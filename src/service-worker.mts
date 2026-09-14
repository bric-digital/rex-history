import psl from 'psl'
import rexCorePlugin, { REXServiceWorkerModule, registerREXModule, dispatchEvent } from '@bric/rex-core/service-worker'
import type { REXConfiguration } from '@bric/rex-core/common'
import * as listUtils from '@bric/rex-lists'
import { type RexPageUrlActiveEvent } from '@bric/rex-types/types'

interface HistoryConfig {
  collection_interval_minutes: number;
  lookback_days: number;
  filter_lists: string[];
  allow_lists: string[];
  category_lists: string[];
  domain_only_lists: string[];
  generate_top_domains: boolean;
  top_domains_count: number;
  top_domains_list_name: string;
  /**
   * Tolerance (ms) for joining a `rex-history-visit` record to a buffered
   * `rex-page-url-active` record from `rex-page-events` (if installed).
   * Match requires exact URL string AND |visit_time − url_shown_at| ≤ tolerance.
   * Set to 0 to disable joining. Default 5000 when unset.
   */
  page_events_link_tolerance_ms?: number;
  /**
   * Per-request page size (chrome.history.search maxResults) within a single
   * time window. Not a collection cap: the walk steps through fixed time
   * windows, and a window that returns a full page is split toward a 1-minute
   * floor so every record is still collected. Default 1000 when unset.
   */
  collection_page_size?: number;
  /**
   * Width of each forward collection window, in hours. The walk steps the
   * cursor through [cursor, cursor+window) windows from the seed time toward
   * now. Smaller windows mean more iterations but less work per window.
   * Default 1 when unset.
   */
  collection_window_hours?: number;
  /**
   * Wall-clock budget (ms) for how long one alarm wake spends walking windows
   * before yielding to the next alarm (MV3 worker-lifetime guard), checked
   * between windows and between sub-windows of a split window. The cursor is
   * persisted after every closed sub-window, so the next wake resumes cleanly.
   * Default 20000 when unset. 0 means "one sub-window unit per wake" (used in
   * tests and as a hard floor — at least one leaf always runs).
   */
  collection_walk_budget_ms?: number;
  /**
   * Consecutive worker wakes allowed to start at the same cursor before the
   * walk concludes the window cannot be finished, skips it, and emits a
   * rex-history-walk-stuck diagnostic. Default 5 when unset.
   */
  collection_max_window_attempts?: number;
}

// ---------------------------------------------------------------------------
// Optional linkage to rex-page-events.
//
// rex-history does NOT import @bric/rex-page-events. The only seam is the
// well-known `globalThis.__rexPageEventsUrlActive.subscribe` contract installed
// by rex-page-events at its own setup. If the seam isn't present (because
// rex-page-events wasn't bundled into this extension), we silently proceed
// without linkage fields — no error, no crash.
// ---------------------------------------------------------------------------

const URL_ACTIVE_BUFFER_MAX = 256
const DEFAULT_PAGE_EVENTS_LINK_TOLERANCE_MS = 5000
const DEFAULT_COLLECTION_PAGE_SIZE = 1000
const DEFAULT_LOOKBACK_DAYS = 90
const DEFAULT_COLLECTION_WINDOW_HOURS = 1
const DEFAULT_WALK_BUDGET_MS = 20000
// Recursion floor for splitting an over-full window. A window <= this width
// that still overflows the page is collected best-effort (overflow escape
// hatch) rather than split further — the walk must never wedge on one hot hour.
const MIN_WINDOW_MS = 60000
const DEFAULT_MAX_WINDOW_ATTEMPTS = 5
const WALK_ATTEMPT_KEY = 'webmunkHistoryWalkAttempt'

interface WindowWalkResult {
  collectedCount: number;
  /**
   * Everything in [windowStart, advancedTo) is fully collected and safe to
   * persist as the cursor. advancedTo < windowEnd means the deadline was hit
   * partway through the window.
   */
  advancedTo: number;
}
// Durable marker written immediately BEFORE the uncapped overflow fetch+process,
// cleared immediately after it succeeds. If a pathological minute (e.g. tens of
// thousands of same-timestamp dumped visits) makes that uncapped batch exceed
// the MV3 ~5-min worker kill, the worker dies mid-batch and this marker survives.
// On the next worker start loadStatus() finds it, knows the previous attempt at
// that window crashed (because a clean run would have cleared it), emits a
// server-visible rex-history-overflow-stuck event (which now transmits — a fresh
// worker has no crash pending), and skips the poison window so the walk escapes
// instead of re-crashing on it forever.
const OVERFLOW_MARKER_KEY = 'webmunkHistoryOverflowMarker'

interface UrlActiveSeam {
  subscribe(listener: (event: RexPageUrlActiveEvent) => void): () => void
}

function getUrlActiveSeam(): UrlActiveSeam | undefined {
  return (globalThis as unknown as { __rexPageEventsUrlActive?: UrlActiveSeam })
    .__rexPageEventsUrlActive
}

interface HistoryStatus {
  lastCollectionTime?: number;
  itemsCollected: number;
  isCollecting: boolean;
  listsReady?: boolean;
  configSource?: 'server' | 'none';
  effectiveConfig?: HistoryConfig;
}

/**
 * History collection module - collects browser history with filtering and categorization
 */
class HistoryServiceWorkerModule extends REXServiceWorkerModule {
  config: HistoryConfig | null = null
  status: HistoryStatus = {
    itemsCollected: 0,
    isCollecting: false
  }

  /**
   * Ring buffer of observed `rex-page-url-active` records from rex-page-events.
   * Populated only when the optional seam is available. See the module header
   * for the coupling model.
   */
  private urlActiveBuffer: RexPageUrlActiveEvent[] = []
  private urlActiveUnsubscribe: (() => void) | null = null

  /**
   * Guards against concurrent loadConfiguration() calls.
   *
   * loadConfiguration() calls parseAndSyncLists() which deletes-then-reinserts
   * IndexedDB entries.  If two calls overlap (e.g. storage.onChanged fires
   * while collectHistory's own loadConfiguration is mid-sync), the second
   * delete can wipe entries the first call just inserted, leaving allow-lists
   * temporarily empty during a collection cycle.
   *
   * By coalescing overlapping calls into a single promise we avoid the race.
   */
  private loadConfigurationPromise: Promise<void> | null = null

  /**
   * DEV-ONLY debug flag:
   * When enabled (and running inside Webmunk Dev Extension), we emit a dataset event
   * containing the *full* original URL for filtered items so you can verify list behavior.
   *
   * This is explicitly blocked outside the dev extension to prevent accidental deployment.
   */
  private static readonly DEBUG_LOG_FILTERED_URLS_KEY = 'webmunk_debug_log_filtered_urls'

  constructor() {
    super()
  }

  moduleName(): string {
    return 'HistoryServiceWorkerModule'
  }

  // -------------------------------------------------------------------------
  // Optional rex-page-events linkage
  // -------------------------------------------------------------------------

  /**
   * Probe for the rex-page-events subscriber seam and subscribe if present.
   * Safe to call once per setup; idempotent if called twice in a row.
   */
  private trySubscribeUrlActive(): void {
    if (this.urlActiveUnsubscribe !== null) {
      return // already subscribed
    }
    const seam = getUrlActiveSeam()
    if (seam === undefined || typeof seam.subscribe !== 'function') {
      console.log('[rex-history] rex-page-events not detected; visits will not carry tab linkage fields')
      return
    }
    this.urlActiveUnsubscribe = seam.subscribe((record) => {
      this.recordUrlActive(record)
    })
    console.log('[rex-history] Subscribed to rex-page-events url-active seam')
  }

  private recordUrlActive(record: RexPageUrlActiveEvent): void {
    this.urlActiveBuffer.push(record)
    if (this.urlActiveBuffer.length > URL_ACTIVE_BUFFER_MAX) {
      this.urlActiveBuffer.splice(0, this.urlActiveBuffer.length - URL_ACTIVE_BUFFER_MAX)
    }
  }

  /**
   * Find the most recent buffered url-active record matching the visit within
   * tolerance. Returns null when: no match, tolerance is 0, URL is redacted
   * (starts with `CATEGORY:`), or the seam was never wired up.
   */
  private findUrlActiveMatch(url: string, visitTime: number): RexPageUrlActiveEvent | null {
    if (url.startsWith('CATEGORY:')) {
      return null // redacted visit — never try to un-redact via linkage
    }
    const tolerance = this.config?.page_events_link_tolerance_ms
      ?? DEFAULT_PAGE_EVENTS_LINK_TOLERANCE_MS
    if (tolerance <= 0) {
      return null
    }

    let best: RexPageUrlActiveEvent | null = null
    for (const record of this.urlActiveBuffer) {
      if (record.url !== url) continue
      if (Math.abs(visitTime - record.url_shown_at) > tolerance) continue
      if (best === null || record.url_shown_at > best.url_shown_at) {
        best = record
      }
    }
    return best
  }

  /**
   * Check if user identifier has been set.
   * History collection should not start until an identifier exists.
   */
  async hasIdentifier(): Promise<boolean> {
    try {
      const result = await chrome.storage.local.get('rexIdentifier')
      const identifier = (result.rexIdentifier as string | undefined)?.toString().trim()
      return Boolean(identifier)
    } catch (error) {
      console.error('[rex-history] Failed to check identifier:', error)
      return false
    }
  }

  async setup() {
    console.log('[rex-history/service-worker] Setting up history collection module')

    // Optional linkage to rex-page-events. If the seam is absent (module not
    // bundled), the buffer stays empty and visits go out without linkage fields.
    this.trySubscribeUrlActive()

    // Initialize list database
    try {
      await listUtils.initializeListDatabase()
      console.log('[rex-history] List database initialized')
    } catch (error) {
      console.error('[rex-history] Failed to initialize list database:', error)
    }

    // React to configuration updates (e.g., after identifier is set and remote config is fetched).
    // This ensures periodic collection turns on once history config becomes available AND identifier is set.
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local') return
      if (changes.REXConfiguration || changes.rexIdentifier) {
        // Use loadConfigOnly (no list sync) to avoid racing with collection
        // cycles.  parseAndSyncLists temporarily empties lists during its
        // delete-then-reinsert cycle; if that overlaps with a collection the
        // allow-list check misclassifies visits.  Lists are synced inside
        // collectHistory() instead, where the timing is controlled.
        this.loadConfigOnly()
          .then(async () => {
            const hasIdentifier = await this.hasIdentifier()
            if (this.config && hasIdentifier) {
              await this.setupAlarm()
              console.log('[rex-history] Configuration and identifier available, alarm set up')
            } else if (this.config && !hasIdentifier) {
              console.log('[rex-history] Configuration available but no identifier - waiting for identifier before starting collection')
            }
          })
          .catch((err) => {
            console.error('[rex-history] Failed to react to configuration change:', err)
          })
      }
    })

    // Load status from storage before configuration so that listsReady
    // persisted from a previous run is available before the alarm can fire.
    await this.loadStatus()

    // Load configuration and sync lists. loadConfigurationImpl sets
    // listsReady once at least one allow-list has entries in IndexedDB.
    // On a service worker restart with a pre-populated DB, loadStatus()
    // above already restored listsReady: true so collection isn't blocked
    // while the re-sync runs.
    await this.loadConfiguration()

    // Set up periodic collection alarm ONLY if identifier exists
    const hasIdentifier = await this.hasIdentifier()
    if (this.config && hasIdentifier) {
      await this.setupAlarm()
      console.log(`[rex-history] Alarm set for every ${this.config.collection_interval_minutes} minutes`)
    } else if (this.config && !hasIdentifier) {
      console.log('[rex-history] Configuration loaded but no identifier set - collection will start once identifier is provided')
    }

    // Set up alarm listener
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'rex-history-collection') {
        // Periodic alarm → gentle (budget-limited) walk.
        console.log('[rex-history] Periodic collection triggered')
        this.collectHistory(false).catch((error) => {
          console.error('[rex-history] Collection error:', error)
        })
      } else if (alarm.name === 'rex-history-collection-eager') {
        // Self-scheduled continuation of an eager backfill (see runCollectionCycle).
        console.log('[rex-history] Eager backfill continuation triggered')
        this.collectHistory(true).catch((error) => {
          console.error('[rex-history] Collection error:', error)
        })
      }
    })
  }

  async loadConfiguration() {
    if (this.loadConfigurationPromise) {
      return this.loadConfigurationPromise
    }
    this.loadConfigurationPromise = this.loadConfigurationImpl(true)
    try {
      await this.loadConfigurationPromise
    } finally {
      this.loadConfigurationPromise = null
    }
  }

  /**
   * Reload history config from rex-core WITHOUT re-syncing lists.
   *
   * collectHistory() calls this instead of loadConfiguration() so that a
   * concurrent parseAndSyncLists (which temporarily empties lists) cannot
   * race with the collection cycle's allow-list checks.
   */
  private async loadConfigOnly() {
    await this.loadConfigurationImpl(false)
  }

  private async loadConfigurationImpl(syncLists: boolean) {
    try {
      // Always fetch through rex-core, which owns configuration loading/storage.
      const configuration = await rexCorePlugin.fetchConfiguration() as REXConfiguration | undefined
      const configurationRecord = configuration as unknown as Record<string, unknown> | undefined
      const historyConfig = configurationRecord?.['history'] as HistoryConfig | undefined

      if (historyConfig && (historyConfig as unknown as Record<string, unknown>)['enabled'] !== false) {
        this.config = historyConfig
        this.status.configSource = 'server'
        this.status.effectiveConfig = historyConfig
        await this.saveStatus()

        console.log('[rex-history] Configuration loaded from rex-core:', historyConfig)
      } else {
        this.config = null
        this.status.configSource = 'none'
        delete this.status.effectiveConfig
        await this.saveStatus()
        console.warn('[rex-history] No history configuration found in rex-core configuration')
      }

      if (!syncLists) return

      const listConfig = configurationRecord?.['lists']
      if (listConfig !== null && listConfig !== undefined && typeof listConfig === 'object' && !Array.isArray(listConfig)) {
        await listUtils.parseAndSyncLists(listConfig as Parameters<typeof listUtils.parseAndSyncLists>[0])
        console.log('[rex-history] Lists synced.')
      }

      const allowLists = this.config?.allow_lists
      if (!allowLists || allowLists.length === 0) {
        this.status.listsReady = true
      } else {
        const checks = await Promise.all(allowLists.map((name) => listUtils.hasListEntries(name)))
        if (checks.some(Boolean)) {
          this.status.listsReady = true
        }
      }
      await this.saveStatus()

    } catch (error) {
      console.error('[rex-history] Failed to load configuration:', error)
    }
  }

  async setupAlarm() {
    if (!this.config) return

    // Clear any existing alarm
    await chrome.alarms.clear('rex-history-collection')

    // Create new alarm
    await chrome.alarms.create('rex-history-collection', {
      periodInMinutes: this.config.collection_interval_minutes,
      delayInMinutes: this.config.collection_interval_minutes
    })
  }

  async loadStatus() {
    try {
      const result = await chrome.storage.local.get('webmunkHistoryStatus')
      if (result.webmunkHistoryStatus) {
        this.status = result.webmunkHistoryStatus as HistoryStatus
      }
    } catch (error) {
      console.error('[rex-history] Failed to load status:', error)
    }
    // isCollecting is in-memory concurrency state for a single worker lifetime,
    // not durable status. A fresh worker must always start collectable. Forcing
    // it false here self-heals participants whose previous worker was suspended
    // mid-cycle and stranded a `true` in storage (it would otherwise wedge every
    // future collection via the guard in collectHistory).
    this.status.isCollecting = false

    await this.recoverFromOverflowCrash()
  }

  /**
   * Self-heal a worker that was killed mid-overflow. A stranded OVERFLOW_MARKER_KEY
   * means the previous worker started an uncapped fetch+process for a pathological
   * minute and never finished (a clean run clears the marker). Left alone, the next
   * cycle re-reads the same cursor, hits the same poison window, and re-crashes —
   * a new flavor of the infinite resend loop. So here, on a fresh worker with no
   * crash pending, we emit a server-visible diagnostic (which now actually
   * transmits) and advance the cursor past the poison window so the walk escapes.
   * Skipping that one minute loses only the pathological cluster; the alternative
   * is never completing at all.
   */
  private async recoverFromOverflowCrash(): Promise<void> {
    try {
      const stored = await chrome.storage.local.get(OVERFLOW_MARKER_KEY)
      const marker = stored[OVERFLOW_MARKER_KEY] as
        | { windowStart: number; windowEnd: number; itemCount: number; attemptedAt: number }
        | undefined
      if (!marker) {
        return
      }
      console.error('[rex-history] Overflow crash detected — previous worker died processing the window', new Date(marker.windowStart).toISOString(), '..', new Date(marker.windowEnd).toISOString(), `(${marker.itemCount} items). Skipping it.`)
      dispatchEvent({
        name: 'pdk-app-event',
        event_name: 'rex-history-overflow-stuck',
        event_details: {
          window_start: marker.windowStart,
          window_end: marker.windowEnd,
          item_count: marker.itemCount,
          attempted_at: marker.attemptedAt,
          date: Date.now()
        }
      })
      // Advance the cursor past the poison window so the resumed walk skips it,
      // but only forward — never rewind a cursor that has already moved on.
      const current = await this.getLastFetchTime()
      if (current < marker.windowEnd) {
        await this.setLastFetchTime(marker.windowEnd)
      }
      await chrome.storage.local.remove(OVERFLOW_MARKER_KEY)
    } catch (error) {
      console.error('[rex-history] Failed to recover from overflow crash:', error)
    }
  }

  async saveStatus() {
    try {
      await chrome.storage.local.set({
        webmunkHistoryStatus: this.status
      })
    } catch (error) {
      console.error('[rex-history] Failed to save status:', error)
    }
  }

  /**
   * Installation timestamp from rex-core, via its getInstallTime message API
   * (rex-core owns this — do not read the rexInstallTime storage key directly).
   * Returns null when rex-core hasn't recorded it yet or is too old to answer.
   */
  private async getInstallTime(): Promise<number | null> {
    try {
      const response = await chrome.runtime.sendMessage({ messageType: 'getInstallTime' })
      return typeof response === 'number' ? response : null
    } catch (error) {
      console.error('[rex-history] Failed to get install time from rex-core:', error)
      return null
    }
  }

  async getLastFetchTime(): Promise<number> {
    try {
      const result = await chrome.storage.local.get('webmunkHistoryLastFetch')
      if (result.webmunkHistoryLastFetch) {
        return result.webmunkHistoryLastFetch as number
      }

      // First run: seed the cursor at lookback_days BEFORE the install time, so
      // the backfill covers the lookback window leading up to enrollment (and
      // everything since). When rex-core can't supply an install time (older
      // rex-core, or not yet recorded), fall back to lookback_days before now.
      const now = Date.now()
      const lookbackDays = this.config?.lookback_days ?? DEFAULT_LOOKBACK_DAYS
      const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000
      const installTime = await this.getInstallTime()
      const anchor = installTime ?? now
      return anchor - lookbackMs
    } catch (error) {
      console.error('[rex-history] Failed to get last fetch time:', error)
      return Date.now() - (DEFAULT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000)
    }
  }

  async setLastFetchTime(timestamp: number) {
    try {
      await chrome.storage.local.set({
        webmunkHistoryLastFetch: timestamp
      })
    } catch (error) {
      console.error('[rex-history] Failed to set last fetch time:', error)
      // A swallowed cursor-write failure (typically a full chrome.storage.local
      // quota) silently stalls collection: the cursor never advances, the walk
      // re-runs the same page forever, and no completion event fires — yet from
      // the backend this is indistinguishable from a healthy participant who
      // simply hasn't run yet. Emit a privacy-safe diagnostic so the stall and
      // its cause are visible server-side. Guarded so it can never itself throw.
      this.emitCursorWriteFailedDiagnostic(timestamp, error)
    }
  }

  private emitCursorWriteFailedDiagnostic(attemptedCursor: number, error: unknown): void {
    try {
      let errorName = 'unknown'
      let errorMessage = String(error)
      if (error instanceof Error) {
        errorName = error.name
        errorMessage = error.message
      }
      dispatchEvent({
        name: 'pdk-app-event',
        event_name: 'rex-history-cursor-write-failed',
        event_details: {
          error_name: errorName,
          error_message: errorMessage,
          attempted_cursor: attemptedCursor,
          date: Date.now()
        }
      })
    } catch (diagnosticError) {
      // A diagnostic must never become a new failure path.
      console.error('[rex-history] Failed to emit rex-history-cursor-write-failed diagnostic:', diagnosticError)
    }
  }

  private emitCollectionErrorDiagnostic(error: unknown): void {
    try {
      let errorName = 'unknown'
      let errorMessage = String(error)
      if (error instanceof Error) {
        errorName = error.name
        errorMessage = error.message
      }
      dispatchEvent({
        name: 'pdk-app-event',
        event_name: 'rex-history-collection-error',
        event_details: {
          error_name: errorName,
          error_message: errorMessage,
          date: Date.now()
        }
      })
    } catch (diagnosticError) {
      // A diagnostic must never become a new failure path.
      console.error('[rex-history] Failed to emit rex-history-collection-error diagnostic:', diagnosticError)
    }
  }

  collectHistory(eager = false): Promise<void> {
    if (this.status.isCollecting) {
      console.log('[rex-history] Collection already in progress, skipping')
      return Promise.resolve()
    }

    if (!this.status.listsReady) {
      console.log('[rex-history] Lists not yet synced, skipping collection')
      return Promise.resolve()
    }

    // Set the flag synchronously BEFORE any async work so that concurrent
    // callers (e.g. storage.onChanged → loadConfiguration) see isCollecting
    // immediately and skip the destructive parseAndSyncLists cycle.
    this.status.isCollecting = true

    // IMPORTANT: Do not collect or send data until user has entered an identifier
    return this.hasIdentifier()
      .then((hasIdentifier) => {
        if (!hasIdentifier) {
          console.warn('[rex-history] No identifier set - collection will not start until identifier is provided')
          return Promise.reject(new Error('NO_IDENTIFIER'))
        }
        // Full loadConfiguration (with list sync) is safe here because
        // isCollecting is already true, which prevents the storage.onChanged
        // listener from starting a concurrent list sync.
        return this.loadConfiguration()
      })
      .then(() => this.waitForConfiguration())
      .then(() => {
        if (!this.config) {
          console.warn('[rex-history] No configuration available, skipping collection')
          return Promise.reject(new Error('NO_CONFIGURATION'))
        }

        console.log('[rex-history] Starting history collection')
        return this.saveStatus()
      })
      .then(() => this.runCollectionCycle(eager))
      .catch((error: unknown) => {
        if (error instanceof Error && (error.message === 'NO_IDENTIFIER' || error.message === 'NO_CONFIGURATION')) {
          return
        }

        console.error('[rex-history] Collection error:', error)
        // The cursor stays where the walk durably got to: moving it would
        // silently discard the unwalked range. Surface the error server-side
        // instead, where until now it reached only the participant's console.
        this.emitCollectionErrorDiagnostic(error)
      })
      .finally(() => {
        this.status.isCollecting = false
        return this.saveStatus().finally(() => {
          console.log('[rex-history] Collection complete')
        })
      })
  }

  private waitForConfiguration(): Promise<void> {
    if (this.config) {
      return Promise.resolve()
    }

    const deadlineMs = Date.now() + 1500
    const tryReload = (): Promise<void> => {
      if (this.config) {
        return Promise.resolve()
      }
      if (Date.now() >= deadlineMs) {
        return Promise.resolve()
      }

      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 250)
      })
        .then(() => this.loadConfiguration())
        .then(() => tryReload())
    }

    return tryReload()
  }

  /**
   * Walk browsing history forward in fixed time windows.
   *
   * The cursor (webmunkHistoryLastFetch) is a wall-clock time that marches
   * monotonically from its seed (lookback_days before install time) toward
   * cycleNow. Each window [cursor, windowEnd) is fully closed — all its visits
   * processed — before the cursor advances to windowEnd. This replaces the old
   * startTime-only walk that advanced by max-visit-time and therefore depended
   * on chrome.history.search's newest-first ordering, which silently dropped
   * older visits and never finished on heavy histories.
   *
   * Per-wake the walk is bounded by a wall-clock budget (MV3 worker-lifetime
   * guard), enforced between windows and, inside a split window, between
   * sub-windows. Each fully-closed sub-window persists the cursor, so a
   * worker killed mid-window resumes at most one leaf back. When the budget
   * is hit before catching up to now, it emits a progress event and yields:
   * a periodic alarm resumes next cycle; an eager (offboarding) walk re-arms
   * an immediate alarm to continue back-to-back. collection-complete fires
   * only when the cursor actually reaches ~now.
   */
  private async runCollectionCycle(eager: boolean): Promise<void> {
    const cycleNow = Date.now()
    const windowMs = (this.config?.collection_window_hours ?? DEFAULT_COLLECTION_WINDOW_HOURS) * 60 * 60 * 1000
    const budgetMs = this.config?.collection_walk_budget_ms ?? DEFAULT_WALK_BUDGET_MS
    const deadline = cycleNow + budgetMs

    let cursor = await this.getLastFetchTime()
    cursor = await this.advancePastStuckWindow(cursor, cycleNow, windowMs)
    console.log(`[rex-history] Walking history from ${new Date(cursor).toISOString()} toward ${new Date(cycleNow).toISOString()} (eager=${eager})`)

    let collectedCount = 0
    let windowsThisWake = 0

    while (cursor < cycleNow) {
      // Always run at least one window per wake (windowsThisWake === 0) so a
      // zero/tiny budget still makes forward progress. After that, yield once
      // the wall-clock budget is spent.
      if (windowsThisWake > 0 && Date.now() >= deadline) {
        break
      }

      const windowEnd = Math.min(cursor + windowMs, cycleNow)
      const result = await this.collectWindow(cursor, windowEnd, deadline)
      collectedCount += result.collectedCount
      cursor = result.advancedTo
      // Persist after every closed sub-window run so a worker killed mid-walk
      // resumes exactly here on the next alarm rather than re-walking from the
      // window start.
      await this.setLastFetchTime(cursor)
      windowsThisWake++
    }

    const caughtUp = cursor >= cycleNow
    console.log(`[rex-history] Collected ${collectedCount} visits across ${windowsThisWake} window(s); caughtUp=${caughtUp}`)

    if (caughtUp && this.config?.generate_top_domains) {
      await this.generateTopDomainsList()
    }

    this.status.lastCollectionTime = Date.now()
    this.status.itemsCollected += collectedCount
    await this.setLastFetchTime(cursor)
    await this.saveStatus()

    if (caughtUp) {
      await this.emitCollectionComplete(collectedCount)
    } else {
      // More range remains. Emit a heartbeat (not complete) and, in eager mode,
      // re-arm an immediate alarm so the backfill continues without waiting for
      // the next periodic tick.
      dispatchEvent({
        name: 'pdk-app-event',
        event_name: 'rex-history-collection-progress',
        event_details: {
          collected_count: collectedCount,
          cursor,
          target: cycleNow,
          date: Date.now()
        }
      })
      if (eager) {
        this.rearmEagerAlarm()
      }
    }
  }

  /**
   * Wedge breaker: a wake that starts at the same cursor as the previous wake
   * means that wake persisted no progress (killed before closing one leaf).
   * Count consecutive same-cursor starts durably; past the limit, skip one
   * window and emit a server-visible diagnostic. Losing at most one window
   * beats the field failure mode of losing everything from the wedge onward.
   */
  private async advancePastStuckWindow(cursor: number, cycleNow: number, windowMs: number): Promise<number> {
    try {
      const stored = await chrome.storage.local.get(WALK_ATTEMPT_KEY)
      const attempt = stored[WALK_ATTEMPT_KEY] as
        | { cursor: number; attempts: number; firstAttemptAt: number }
        | undefined
      const maxAttempts = this.config?.collection_max_window_attempts ?? DEFAULT_MAX_WINDOW_ATTEMPTS
      const now = Date.now()

      if (attempt === undefined || attempt.cursor !== cursor) {
        await chrome.storage.local.set({ [WALK_ATTEMPT_KEY]: { cursor, attempts: 1, firstAttemptAt: now } })
        return cursor
      }

      if (attempt.attempts < maxAttempts) {
        await chrome.storage.local.set({
          [WALK_ATTEMPT_KEY]: { cursor, attempts: attempt.attempts + 1, firstAttemptAt: attempt.firstAttemptAt }
        })
        return cursor
      }

      const skippedTo = Math.min(cursor + windowMs, cycleNow)
      console.error(`[rex-history] Walk stuck at ${new Date(cursor).toISOString()} after ${attempt.attempts} attempts — skipping to ${new Date(skippedTo).toISOString()}`)
      dispatchEvent({
        name: 'pdk-app-event',
        event_name: 'rex-history-walk-stuck',
        event_details: {
          cursor,
          attempts: attempt.attempts,
          first_attempt_at: attempt.firstAttemptAt,
          skipped_to: skippedTo,
          date: now
        }
      })
      await this.setLastFetchTime(skippedTo)
      await chrome.storage.local.set({ [WALK_ATTEMPT_KEY]: { cursor: skippedTo, attempts: 1, firstAttemptAt: now } })
      return skippedTo
    } catch (error) {
      // Bookkeeping must never become a new way to block collection.
      console.error('[rex-history] Stuck-window bookkeeping failed:', error)
      return cursor
    }
  }

  /**
   * Collect every visit inside [windowStart, windowEnd). If the window returns a
   * full page it holds more URLs than one page can safely carry: split it toward
   * MIN_WINDOW_MS. A sub-MIN_WINDOW_MS window that still overflows is collected
   * best-effort and a privacy-safe overflow diagnostic is emitted — the walk
   * never wedges on one abnormally heavy stretch. Returns visits collected and
   * how far the window is durably closed (`advancedTo`); `advancedTo <
   * windowEnd` means the deadline was hit between sub-windows.
   */
  private async collectWindow(windowStart: number, windowEnd: number, deadline: number): Promise<WindowWalkResult> {
    const pageSize = this.config?.collection_page_size ?? DEFAULT_COLLECTION_PAGE_SIZE

    const historyItems = await chrome.history.search({
      text: '',
      startTime: windowStart,
      endTime: windowEnd,
      maxResults: pageSize
    })

    if (historyItems.length >= pageSize) {
      const span = windowEnd - windowStart
      if (span > MIN_WINDOW_MS) {
        // Split the window and process the halves in order. Persisting the
        // boundary after the first half closes means a worker killed in the
        // second half resumes at mid instead of re-walking (and re-uploading)
        // the whole window — the wedge observed in the field on dense
        // histories. Checking the deadline between halves keeps one wake's
        // work bounded while still guaranteeing at least one leaf of progress.
        const mid = windowStart + Math.floor(span / 2)
        const first = await this.collectWindow(windowStart, mid, deadline)
        if (first.advancedTo < mid) {
          return first
        }
        await this.setLastFetchTime(mid)
        if (Date.now() >= deadline) {
          return { collectedCount: first.collectedCount, advancedTo: mid }
        }
        const second = await this.collectWindow(mid, windowEnd, deadline)
        return {
          collectedCount: first.collectedCount + second.collectedCount,
          advancedTo: second.advancedTo
        }
      }
      // Floor reached and still over-full (e.g. a cluster of same-timestamp
      // visits). Re-fetch this minute uncapped so NO item is dropped, flag it,
      // and process the whole set. A one-minute window is small enough that an
      // uncapped fetch is safe, and this is the only way to avoid losing items
      // beyond the first page.
      this.emitWindowOverflowDiagnostic(windowStart, windowEnd, historyItems.length, pageSize)
      // Persist a durable marker BEFORE the uncapped fetch+process. If that work
      // exceeds the MV3 worker lifetime and the worker is killed mid-batch, this
      // marker is the only evidence that survives — loadStatus() reads it on the
      // next start to report and skip the poison window (see OVERFLOW_MARKER_KEY).
      await chrome.storage.local.set({
        [OVERFLOW_MARKER_KEY]: { windowStart, windowEnd, itemCount: historyItems.length, attemptedAt: Date.now() }
      })
      const allItems = await chrome.history.search({
        text: '',
        startTime: windowStart,
        endTime: windowEnd,
        maxResults: 0 // 0 = no limit (chrome.history.search treats 0 as unlimited)
      })
      const overflowResult = await this.processHistoryBatch(allItems, windowStart, windowEnd)
      // Survived the uncapped batch — clear the marker so a later worker start
      // does not mistake this window for a crash.
      await chrome.storage.local.remove(OVERFLOW_MARKER_KEY)
      return { collectedCount: overflowResult.collectedCount, advancedTo: windowEnd }
    }

    const batchResult = await this.processHistoryBatch(historyItems, windowStart, windowEnd)
    return { collectedCount: batchResult.collectedCount, advancedTo: windowEnd }
  }

  /**
   * Dispatch rex-history-collection-complete. Delays 1.1s when items were
   * collected so PDK's ~1s persist debounce expires and the whole queue flushes;
   * fires immediately when nothing was queued. Unchanged contract for the
   * offboarding consumer that releases its "Collecting Data" spinner on this.
   */
  private async emitCollectionComplete(collectedCount: number): Promise<void> {
    if (collectedCount > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, 1100))
    }
    dispatchEvent({
      name: 'pdk-app-event',
      event_name: 'rex-history-collection-complete',
      event_details: {
        collected_count: collectedCount,
        date: Date.now()
      }
    })
  }

  private rearmEagerAlarm(): void {
    // ponytail: Chrome clamps alarm delays to a 1-minute minimum in production,
    // so an eager backfill resumes ~1 min later, not instantly. That is still
    // far better than waiting for the periodic interval and avoids busy-looping
    // the worker. If sub-minute resumption is ever needed, switch to a
    // self-messaging continuation instead of an alarm.
    chrome.alarms.create('rex-history-collection-eager', { delayInMinutes: 0.1 })
  }

  private emitWindowOverflowDiagnostic(windowStart: number, windowEnd: number, itemCount: number, pageSize: number): void {
    try {
      dispatchEvent({
        name: 'pdk-app-event',
        event_name: 'rex-history-window-overflow',
        event_details: {
          window_start: windowStart,
          window_end: windowEnd,
          item_count: itemCount,
          page_size: pageSize,
          date: Date.now()
        }
      })
    } catch (diagnosticError) {
      console.error('[rex-history] Failed to emit rex-history-window-overflow diagnostic:', diagnosticError)
    }
  }

  private async processHistoryBatch(
    historyItems: chrome.history.HistoryItem[],
    windowStart: number,
    windowEnd: number
  ): Promise<{ collectedCount: number }> {
    let collectedCount = 0

    // Process each history item
    for (const item of historyItems) {
      if (!item.url) continue

      // Isolate each item: a single pathological record (e.g. a URL that makes
      // chrome.history.getVisits or list matching throw) must not abort the whole
      // batch. On failure we log, skip the record, and continue so the rest of the
      // batch is collected and the completion event still fires.
      // Tracks the operation in progress so a skip diagnostic can report which
      // step threw. Updated before each step that can reject.
      let failedStep = 'getVisits'
      try {
      // Get visits for this item
      const visits = await chrome.history.getVisits({ url: item.url })

      for (const visit of visits) {
        // Process only visits inside this window [windowStart, windowEnd).
        // A search() page can include items whose other visits fall outside the
        // window (getVisits returns ALL of a URL's visits), so we filter here.
        // The half-open interval matches the cursor advancing to windowEnd: a
        // visit at exactly windowEnd belongs to the next window, not this one.
        if (!visit.visitTime || visit.visitTime < windowStart || visit.visitTime >= windowEnd) continue

        // Basic privacy filter: only process http(s) URLs (and skip everything else like file://).
        if (this.shouldSkipUrl(item.url)) {
          continue
        }

        // Extract registered domain from URL using psl
        let registeredDomain = 'not available'
        try {
          const urlObj = new URL(item.url)
          const hostname = urlObj.hostname
          const parsed = psl.parse(hostname)
          if (parsed.error === undefined && 'domain' in parsed && parsed.domain) {
            registeredDomain = parsed.domain
          }
        } catch {
          // Keep default 'not available' for invalid URLs
        }

        let recordedUrl = item.url
        let recordedTitle = item.title || ''
        let filteredByList: string | undefined
        let filterMatch: listUtils.ListEntry | undefined

        // Apply domain_only_lists FIRST: takes precedence over allow_lists.
        // URLs on a domain_only_list are always collected at domain resolution,
        // regardless of allow_list membership.
        failedStep = 'list-matching'
        const domainOnlyResult = await this.applyDomainOnlyLists(item.url, {
          visit_id: visit.visitId,
          visit_time: visit.visitTime,
          history_item_id: item.id
        })

        let allowCheck: { allowed: boolean; matchedList?: string; matchEntry?: listUtils.ListEntry }

        if (domainOnlyResult.filteredByList) {
          recordedUrl = 'DOMAIN ONLY'
          recordedTitle = 'DOMAIN ONLY'
          filteredByList = domainOnlyResult.filteredByList
          filterMatch = domainOnlyResult.filterMatch
          allowCheck = { allowed: true }
          // registeredDomain stays as-is (domain preserved — that's the point of domain_only)
        } else {
          // Apply allow_lists: if configured, only collect URLs matching an allow-list.
          // If not allowed, create a dummy record (like blocklist behavior).
          allowCheck = await this.checkAllowLists(item.url)

          if (!allowCheck.allowed) {
            // URL not on allowlist - create dummy record with category placeholder
            recordedUrl = 'CATEGORY:NOT_ON_ALLOWLIST'
            recordedTitle = ''
            registeredDomain = ''
            // Log debug event if enabled (dev-only)
            await this.maybeLogFilteredUrlDebug(
              item.url,
              recordedUrl,
              'NOT_ON_ALLOWLIST',
              undefined,
              {
                visit_id: visit.visitId,
                visit_time: visit.visitTime,
                history_item_id: item.id
              }
            )
          } else {
            // Apply filter_lists to produce a privacy-preserving recorded URL (but still upload the visit).
            const filterResult = await this.applyFilterLists(item.url, {
              visit_id: visit.visitId,
              visit_time: visit.visitTime,
              history_item_id: item.id
            })
            recordedUrl = filterResult.recordedUrl
            filteredByList = filterResult.filteredByList
            filterMatch = filterResult.filterMatch

            // Privacy: if we masked the URL, mask the title and domain too.
            if (recordedUrl.startsWith('CATEGORY:')) {
              recordedTitle = ''
              registeredDomain = ''
            }
          }
        }

        // Categorize against category lists
        failedStep = 'categorize'
        const categories = await this.categorizeUrl(item.url)

        // Attempt to link this visit to an observed rex-page-url-active record.
        // If the visit's recorded URL is redacted (filter/domain_only/allow miss),
        // we pass the REDACTED URL so the match short-circuits — defense in depth
        // against accidentally un-redacting via linkage metadata. When the URL is
        // not redacted, we pass the raw URL to match against buffer records.
        // When rex-page-events isn't installed, the buffer is empty and this is a no-op.
        const matchUrl = recordedUrl.startsWith('CATEGORY:') || recordedUrl === ''
          ? recordedUrl
          : item.url
        const linkMatch = this.findUrlActiveMatch(matchUrl, visit.visitTime)
        const linkFields = linkMatch !== null
          ? {
              tab_id: linkMatch.tab_id,
              window_id: linkMatch.window_id,
              session_id: linkMatch.session_id,
              page_events_url_shown_at: linkMatch.url_shown_at,
            }
          : {}

        // Dispatch event to all modules (PDK will pick it up for upload)
        failedStep = 'dispatch'
        console.log('[rex-history] Logging event: rex-history-visit')
        dispatchEvent({
          name: 'rex-history-visit',
          // IMPORTANT: `url` is the recorded URL (may be replaced by CATEGORY:... for filtered items)
          url: recordedUrl,
          recorded_url: recordedUrl,
          domain: registeredDomain,
          title: recordedTitle,
          visit_time: visit.visitTime,
          transition_type: visit.transition,
          is_local: visit.isLocal,
          categories: categories,
          date: visit.visitTime,

          // Stable per-visit identifiers (useful for dedup + sequence reconstruction)
          visit_id: visit.visitId,
          referring_visit_id: visit.referringVisitId,

          // URL-level history item fields (useful context, low cost)
          history_item_id: item.id,
          last_visit_time: item.lastVisitTime,
          visit_count: item.visitCount,
          typed_count: item.typedCount,

          // Allow-list context (which list allowed this URL)
          allowed_by_list: allowCheck.matchedList,
          allowed_by_list_entry: allowCheck.matchEntry
            ? {
                list_name: allowCheck.matchedList,
                matched_pattern: allowCheck.matchEntry.pattern,
                matched_pattern_type: allowCheck.matchEntry.pattern_type,
                matched_source: allowCheck.matchEntry.source,
                matched_metadata: allowCheck.matchEntry.metadata || {}
              }
            : undefined,

          // Filter-list context (safe: doesn't include original URL)
          filtered: Boolean(filteredByList),
          filtered_by_list: filteredByList,
          filtered_by_list_entry: filterMatch
            ? {
                list_name: filteredByList,
                matched_pattern: filterMatch.pattern,
                matched_pattern_type: filterMatch.pattern_type,
                matched_source: filterMatch.source,
                matched_metadata: filterMatch.metadata || {}
              }
            : undefined,

          // Optional linkage to rex-page-events (tab/session identity + exact url_shown_at).
          // Spread so these keys are simply absent when no match fired.
          ...linkFields,
        })

        collectedCount++
      }
      } catch (error) {
        console.error(`[rex-history] Skipping history item due to error processing it: ${item.url}`, error)
        this.emitSkippedDiagnostic(item, failedStep, error)
      }
    }

    return { collectedCount }
  }

  /**
   * Extract the registered domain from a URL using psl, returning 'not available'
   * for anything unparseable. Never throws.
   */
  private safeRegisteredDomain(url: string): string {
    try {
      const parsed = psl.parse(new URL(url).hostname)
      if (parsed.error === undefined && 'domain' in parsed && parsed.domain) {
        return parsed.domain
      }
    } catch {
      // fall through to default
    }
    return 'not available'
  }

  /**
   * Privacy-safe shape descriptors for a URL: scheme, hostname length, and
   * whether it carries a query string. These help recognise a pathological
   * record (e.g. a giant URL, or one whose query string trips a redaction
   * regex) without exposing any URL content. Never throws.
   */
  private safeUrlShape(url: string): { scheme: string; hostname_length: number; has_query: boolean } {
    try {
      const parsed = new URL(url)
      return {
        scheme: parsed.protocol,
        hostname_length: parsed.hostname.length,
        has_query: parsed.search.length > 0
      }
    } catch {
      return { scheme: 'not available', hostname_length: 0, has_query: false }
    }
  }

  /**
   * Emit a privacy-safe diagnostic when a history item is skipped because
   * processing it threw. Researchers can see that (and why) a record was dropped
   * without the raw URL or title ever leaving the device.
   *
   * Deliberately omits the raw URL and title. The lengths, URL shape, error
   * details, and which step failed are enough to recognise a pathological record
   * and act on it server-side. Emitted in the pdk-app-event family so it does
   * not introduce a new data type.
   */
  private emitSkippedDiagnostic(item: chrome.history.HistoryItem, failedStep: string, error: unknown): void {
    try {
      const shape = item.url ? this.safeUrlShape(item.url) : { scheme: 'not available', hostname_length: 0, has_query: false }
      let errorName = 'unknown'
      let errorMessage = String(error)
      if (error instanceof Error) {
        errorName = error.name
        errorMessage = error.message
      }

      dispatchEvent({
        name: 'pdk-app-event',
        event_name: 'rex-history-skipped',
        event_details: {
          domain: item.url ? this.safeRegisteredDomain(item.url) : 'not available',
          failed_step: failedStep,
          error_name: errorName,
          error_message: errorMessage,
          url_length: item.url ? item.url.length : 0,
          hostname_length: shape.hostname_length,
          title_length: item.title ? item.title.length : 0,
          scheme: shape.scheme,
          has_query: shape.has_query,
          visit_count: item.visitCount,
          history_item_id: item.id,
          date: Date.now()
        }
      })
    } catch (diagnosticError) {
      // A diagnostic must never become a new failure path.
      console.error('[rex-history] Failed to emit rex-history-skipped diagnostic:', diagnosticError)
    }
  }

  /**
   * Privacy baseline: skip URLs we should never collect/upload at all.
   * (Filter lists are handled separately and do NOT skip; they replace recorded URL.)
   */
  private shouldSkipUrl(url: string): boolean {
    // Only allow http(s) by default (privacy).
    return !(url.startsWith('http://') || url.startsWith('https://'))
  }

  /**
   * Check if URL is allowed by the allow_lists.
   *
   * If allow_lists is configured and non-empty, only URLs matching at least one
   * allow-list entry will be collected. URLs not on an allow-list are skipped entirely.
   *
   * Returns { allowed: true, matchedList, matchEntry } if allowed, or { allowed: false } if not.
   */
  private async checkAllowLists(url: string): Promise<{
    allowed: boolean;
    matchedList?: string;
    matchEntry?: listUtils.ListEntry;
  }> {
    if (!this.config) {
      return { allowed: true }
    }

    const allowLists = this.config.allow_lists
    if (!allowLists || allowLists.length === 0) {
      // No allow-lists configured = allow everything (default behavior)
      return { allowed: true }
    }

    // Check each allow-list for a match
    for (const listName of allowLists) {
      try {
        const match = await listUtils.matchDomainAgainstList(url, listName)
        if (match) {
          console.log(`[rex-history] URL allowed by list ${listName}: ${url}`)
          return { allowed: true, matchedList: listName, matchEntry: match }
        }
      } catch (error) {
        console.error(`[rex-history] Error checking allow list ${listName}:`, error)
      }
    }

    // No match found in any allow-list = skip this URL
    console.log(`[rex-history] URL not in allow-lists, skipping: ${url}`)
    return { allowed: false }
  }

  /**
   * Apply configured filter lists to a URL.
   *
   * If a match is found, we replace the recorded URL with `CATEGORY:<category|null>` so the visit
   * can still be uploaded without the full URL. The original URL can still be inspected via the
   * dev-only debug event (guarded by manifest name + storage flag).
   */
  private async applyFilterLists(
    url: string,
    ctx: { visit_id?: string; visit_time?: number; history_item_id?: string }
  ): Promise<{ recordedUrl: string; filteredByList?: string; filterMatch?: listUtils.ListEntry }> {
    if (!this.config || !this.config.filter_lists) {
      return { recordedUrl: url }
    }

    for (const listName of this.config.filter_lists) {
      try {
        const match = await listUtils.matchDomainAgainstList(url, listName)
        if (match) {
          const category = (match.metadata?.category as string | undefined) ?? null
          const recordedUrl = `CATEGORY:${category ?? 'null'}`

          console.log(`[rex-history] Filtered URL by list ${listName} -> ${recordedUrl}`)

          await this.maybeLogFilteredUrlDebug(url, recordedUrl, listName, match, ctx)
          return { recordedUrl, filteredByList: listName, filterMatch: match }
        }
      } catch (error) {
        console.error(`[rex-history] Error checking filter list ${listName}:`, error)
      }
    }

    return { recordedUrl: url }
  }

  /**
   * Apply configured domain_only_lists to a URL.
   *
   * If a match is found, we replace the recorded URL and title with "DOMAIN ONLY" while preserving
   * the registered domain field. This allows researchers to know which domain was visited without
   * exposing the full URL or page title.
   */
  private async applyDomainOnlyLists(
    url: string,
    ctx: { visit_id?: string; visit_time?: number; history_item_id?: string }
  ): Promise<{ filteredByList?: string; filterMatch?: listUtils.ListEntry }> {
    if (!this.config || !this.config.domain_only_lists) {
      return {}
    }

    for (const listName of this.config.domain_only_lists) {
      try {
        const match = await listUtils.matchDomainAgainstList(url, listName)
        if (match) {
          console.log(`[rex-history] Applied domain-only filter by list ${listName}`)

          await this.maybeLogFilteredUrlDebug(url, 'DOMAIN ONLY', listName, match, ctx)
          return { filteredByList: listName, filterMatch: match }
        }
      } catch (error) {
        console.error(`[rex-history] Error checking domain-only list ${listName}:`, error)
      }
    }

    return {}
  }

  private isDevExtension(): boolean {
    try {
      return chrome.runtime.getManifest().name === 'Webmunk Dev Extension'
    } catch {
      return false
    }
  }

  private async maybeLogFilteredUrlDebug(
    url: string,
    recordedUrl: string,
    listName: string,
    match: listUtils.ListEntry | undefined,
    ctx: { visit_id?: string; visit_time?: number; history_item_id?: string }
  ): Promise<void> {
    // Hard safety gate: never allow full-URL debug logging outside the dev extension.
    const { [HistoryServiceWorkerModule.DEBUG_LOG_FILTERED_URLS_KEY]: enabled } =
      await chrome.storage.local.get(HistoryServiceWorkerModule.DEBUG_LOG_FILTERED_URLS_KEY)

    if (!this.isDevExtension()) {
      if (enabled === true) {
        console.warn('[rex-history] Debug URL logging was enabled, but this is not the dev extension. Disabling.')
        await chrome.storage.local.remove(HistoryServiceWorkerModule.DEBUG_LOG_FILTERED_URLS_KEY)
      }
      return
    }

    if (enabled !== true) return

    // Emit a debug event that Passive Data Kit will capture.
    dispatchEvent({
      name: 'webmunk-history-filtered-url-debug',
      url,
      recorded_url: recordedUrl,
      filtered_by_list: listName === 'NOT_ON_ALLOWLIST' ? undefined : listName,
      allowed_by_list: listName === 'NOT_ON_ALLOWLIST' ? 'NOT_ON_ALLOWLIST' : undefined,
      matched_pattern: match?.pattern,
      matched_pattern_type: match?.pattern_type,
      matched_source: match?.source,
      matched_metadata: match?.metadata || {},
      visit_id: ctx.visit_id,
      visit_time: ctx.visit_time,
      history_item_id: ctx.history_item_id,
      date: Date.now()
    })
  }

  async categorizeUrl(url: string): Promise<string[]> {
    if (!this.config || !this.config.category_lists) return []

    // Collect all matches with their pattern types
    const matches: Array<{ category: string; pattern_type: string }> = []

    for (const listName of this.config.category_lists) {
      try {
        const match = await listUtils.matchDomainAgainstList(url, listName)
        if (match && match.metadata?.category) {
          matches.push({
            category: match.metadata.category as string,
            pattern_type: match.pattern_type
          })
        }
      } catch (error) {
        console.error(`[rex-history] Error checking category list ${listName}:`, error)
      }
    }

    if (matches.length === 0) return []

    // Define specificity hierarchy (higher = more specific)
    const specificity: Record<string, number> = {
      'exact_url': 5,
      'regex': 4,
      'host_path_prefix': 3,
      'subdomain_wildcard': 2,
      'host': 2,
      'domain': 1
    }

    // Find the highest specificity level among matches
    const maxSpecificity = Math.max(...matches.map(m => specificity[m.pattern_type] || 0))

    // Return categories only from the most specific pattern type(s)
    // If multiple patterns at the same specificity level match, include all categories
    const categories = matches
      .filter(m => specificity[m.pattern_type] === maxSpecificity)
      .map(m => m.category)

    return categories
  }

  async generateTopDomainsList() {
    if (!this.config) return

    console.log('[rex-history] Generating top domains list')

    try {
      // Get all history
      const historyItems = await chrome.history.search({
        text: '',
        startTime: 0,
        maxResults: 10000
      })

      // Count visits per domain
      const domainCounts = new Map<string, number>()

      for (const item of historyItems) {
        if (!item.url) continue

        try {
          const url = new URL(item.url)
          const hostname = url.hostname

          // Use psl to extract registered domain
          const parsed = psl.parse(hostname)
          const domain = (parsed.error === undefined && 'domain' in parsed && parsed.domain) ? parsed.domain : hostname

          // Increment count
          const currentCount = domainCounts.get(domain) || 0
          domainCounts.set(domain, currentCount + (item.visitCount || 1))
        } catch {
          // Skip invalid URLs
          continue
        }
      }

      // Sort by count and take top N
      const sortedDomains = Array.from(domainCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, this.config.top_domains_count)

      // Clear existing list
      await listUtils.deleteAllEntriesInList(this.config.top_domains_list_name, 'generated')

      // Create new entries
      const entries = sortedDomains.map(([domain, count]) => ({
        list_name: this.config!.top_domains_list_name,
        pattern: domain,
        pattern_type: 'domain' as const,
        source: 'generated' as const,
        metadata: {
          visit_count: count,
          generated_at: Date.now()
        }
      }))

      await listUtils.bulkCreateListEntries(entries)

      console.log(`[rex-history] Generated top ${sortedDomains.length} domains`)
    } catch {
      console.error('[rex-history] Error generating top domains list')
    }
  }

  handleMessage(message: { messageType: string; [key: string]: unknown }, sender: chrome.runtime.MessageSender, sendResponse: (response: unknown) => void): boolean {
    console.log('[rex-history] Received message:', message.messageType)

    if (message.messageType === 'triggerHistoryCollection') {
      // Manual/offboarding trigger → eager backfill: walk to completion across
      // back-to-back wakes so the offboarding spinner releases ASAP.
      console.log('[rex-history] Triggering manual collection (eager)')
      this.collectHistory(true).then(() => {
        sendResponse({ success: true })
      }).catch((error) => {
        sendResponse({ success: false, error: error.message })
      })
      return true
    }

    if (message.messageType === 'getHistoryStatus') {
      console.log('[rex-history] Sending status:', this.status)
      sendResponse(this.status)
      return true
    }

    if (message.messageType === 'getOldestHistoryAge') {
      console.log('[rex-history] Searching for oldest history item')
      const lookbackDays = this.config?.lookback_days ?? DEFAULT_LOOKBACK_DAYS
      const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000

      chrome.history.search({ text: '', startTime: 0, maxResults: 10000 })
        .then((items) => {
          if (items.length === 0) {
            console.log('[rex-history] getOldestHistoryAge: no history items found, ageSeconds=null')
            sendResponse({ ageSeconds: null })
            return
          }

          const oldestVisitTime = items.reduce(
            (min, item) => Math.min(min, item.lastVisitTime ?? Date.now()),
            Date.now()
          )

          // If we received a full page and the oldest found is still under the lookback period,
          // there may be older items beyond the 10k limit — fetch one more page.
          if (items.length === 10000 && (Date.now() - oldestVisitTime) < lookbackMs) {
            console.log(`[rex-history] First 10k items are all under ${lookbackDays} days old, fetching another page`)
            chrome.history.search({ text: '', startTime: 0, endTime: oldestVisitTime - 1, maxResults: 10000 })
              .then((olderItems) => {
                const oldest = olderItems.reduce(
                  (min, item) => Math.min(min, item.lastVisitTime ?? oldestVisitTime),
                  oldestVisitTime
                )
                const ageSeconds = (Date.now() - oldest) / 1000
                console.log(`[rex-history] getOldestHistoryAge: oldest visit ${new Date(oldest).toISOString()}, ageSeconds=${ageSeconds} (${(ageSeconds / 86400).toFixed(1)} days)`)
                sendResponse({ ageSeconds })
              })
              .catch((error) => {
                const ageSeconds = (Date.now() - oldestVisitTime) / 1000
                console.warn('[rex-history] getOldestHistoryAge: second-page search failed, falling back to first-page oldest:', error)
                sendResponse({ ageSeconds })
              })
          } else {
            const ageSeconds = (Date.now() - oldestVisitTime) / 1000
            console.log(`[rex-history] getOldestHistoryAge: oldest visit ${new Date(oldestVisitTime).toISOString()}, ageSeconds=${ageSeconds} (${(ageSeconds / 86400).toFixed(1)} days)`)
            sendResponse({ ageSeconds })
          }
        })
        .catch((error) => {
          console.warn('[rex-history] getOldestHistoryAge: history search failed, ageSeconds=null:', error)
          sendResponse({ ageSeconds: null })
        })
      return true
    }

    console.log('[rex-history] Unknown message type, not handling')
    return false
  }

  // Note: This module does NOT respond to events, only sends them
  // The logEvent method is intentionally not implemented to avoid infinite recursion
  // when dispatchEvent() is called
}

const plugin = new HistoryServiceWorkerModule()

registerREXModule(plugin)

export default plugin
