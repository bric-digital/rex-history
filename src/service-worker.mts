import psl from 'psl'
import rexCorePlugin, { REXServiceWorkerModule, registerREXModule, dispatchEvent, type EventPayload } from '@bric/rex-core/service-worker'
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
   * Page size for the collection loop's chrome.history.search calls.
   * This is a per-request page size, not a collection cap: the loop
   * paginates by advancing a visit-time cursor until a page returns
   * empty, so every record is collected regardless of this value.
   * Smaller pages reduce per-request memory/latency in the service
   * worker at the cost of more loop iterations. Default 1000 when unset.
   */
  collection_page_size?: number;
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

interface ResolvedRecordedUrl {
  recordedUrl: string;
  recordedTitle: string;
  registeredDomain: string;
  filteredByList?: string | undefined;
  filterMatch?: listUtils.ListEntry | undefined;
  allowCheck: { allowed: boolean; matchedList?: string; matchEntry?: listUtils.ListEntry };
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

  private sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), ms)
    })
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
        console.log('[rex-history] Periodic collection triggered')
        this.collectHistory().catch((error) => {
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

  async getLastFetchTime(): Promise<number> {
    try {
      const result = await chrome.storage.local.get('webmunkHistoryLastFetch')
      if (result.webmunkHistoryLastFetch) {
        return result.webmunkHistoryLastFetch as number
      }
      const lookbackDays = this.config?.lookback_days ?? 30
      return Date.now() - lookbackDays * 24 * 60 * 60 * 1000
    } catch (error) {
      console.error('[rex-history] Failed to get last fetch time:', error)
      return Date.now() - (30 * 24 * 60 * 60 * 1000)
    }
  }

  async setLastFetchTime(timestamp: number) {
    try {
      await chrome.storage.local.set({
        webmunkHistoryLastFetch: timestamp
      })
    } catch (error) {
      console.error('[rex-history] Failed to set last fetch time:', error)
    }
  }

  async collectHistory(): Promise<void> {
    if (this.status.isCollecting) {
      console.log('[rex-history] Collection already in progress, skipping')
      return
    }

    if (!this.status.listsReady) {
      console.log('[rex-history] Lists not yet synced, skipping collection')
      return
    }

    // Set the flag synchronously BEFORE any async work so that concurrent
    // callers (e.g. storage.onChanged → loadConfiguration) see isCollecting
    // immediately and skip the destructive parseAndSyncLists cycle.
    this.status.isCollecting = true

    try {
      // IMPORTANT: Do not collect or send data until user has entered an identifier
      const hasIdentifier = await this.hasIdentifier()
      if (!hasIdentifier) {
        console.warn('[rex-history] No identifier set - collection will not start until identifier is provided')
        throw new Error('NO_IDENTIFIER')
      }

      // Full loadConfiguration (with list sync) is safe here because
      // isCollecting is already true, which prevents the storage.onChanged
      // listener from starting a concurrent list sync.
      await this.loadConfiguration()
      await this.waitForConfiguration()

      if (!this.config) {
        console.warn('[rex-history] No configuration available, skipping collection')
        throw new Error('NO_CONFIGURATION')
      }

      console.log('[rex-history] Starting history collection')
      await this.saveStatus()
      await this.runCollectionCycle()
    } catch (error: unknown) {
      if (error instanceof Error && (error.message === 'NO_IDENTIFIER' || error.message === 'NO_CONFIGURATION')) {
        return
      }
      console.error('[rex-history] Collection error:', error)
      // Even on failure, record that we attempted a fetch so operators/tests can
      // see activity and avoid "undefined" last-fetch state.
      await this.setLastFetchTime(Date.now())
    } finally {
      this.status.isCollecting = false
      await this.saveStatus()
      console.log('[rex-history] Collection complete')
    }
  }

  private async waitForConfiguration(): Promise<void> {
    if (this.config) return

    const deadlineMs = Date.now() + 1500
    while (!this.config && Date.now() < deadlineMs) {
      await this.sleep(250)
      await this.loadConfiguration()
    }
  }

  private async runCollectionCycle(): Promise<void> {
    let collectedCount = 0
    let lastProcessedVisitTime = await this.getLastFetchTime()
    console.log(`[rex-history] Fetching history since ${new Date(lastProcessedVisitTime).toISOString()}`)

    const pageSize = this.config?.collection_page_size ?? DEFAULT_COLLECTION_PAGE_SIZE

    let durableCursor = lastProcessedVisitTime

    while (true) {
      // Persist the PREVIOUS batch's cursor before fetching the next page. That
      // batch's data points have had a full fetch+process cycle to clear PDK's
      // ~1s persist debounce, so resuming past them cannot lose data. Lagging
      // the durable cursor one batch behind the in-memory one means a service
      // worker killed mid-walk resumes where it left off instead of re-walking
      // from scratch on the next alarm (the cause of endless re-submission with
      // no rex-history-collection-complete on heavy histories).
      await this.setLastFetchTime(durableCursor)
      const historyItems = await chrome.history.search({
        text: '', startTime: lastProcessedVisitTime, maxResults: pageSize
      })
      console.log(`[rex-history] Found ${historyItems.length} history items`)
      if (historyItems.length === 0) break

      const batchResult = await this.processHistoryBatch(historyItems, lastProcessedVisitTime)
      collectedCount += batchResult.collectedCount
      if (batchResult.maxVisitTime <= lastProcessedVisitTime) break
      // Advance cursor so the next fetch only looks for newer visits.
      lastProcessedVisitTime = batchResult.maxVisitTime + 1
      durableCursor = lastProcessedVisitTime
    }

    console.log(`[rex-history] Collected ${collectedCount} history visits`)
    if (this.config?.generate_top_domains) {
      await this.generateTopDomainsList()
    }

    // PDK's enqueueDataPoint persists to IndexedDB only when >1 second
    // has elapsed since the last persist.  When multiple history events
    // are dispatched in quick succession, only the first triggers a
    // persist; later events stay in PDK's in-memory queue.  Dispatching
    // a lightweight summary event after a short delay ensures the
    // persist debounce has expired, so PDK flushes the entire queue.
    // When no items were collected we still need to dispatch the
    // completion event so callers (e.g. offboarding) know history
    // collection finished.  Skip the 1.1s PDK-debounce delay since
    // there is nothing queued to flush.
    if (collectedCount === 0) {
      dispatchEvent({
        name: 'pdk-app-event',
        event_name: 'rex-history-collection-complete',
        event_details: {
          collected_count: 0,
          date: Date.now()
        }
      })
    } else {
      await this.sleep(1100)
      dispatchEvent({
        name: 'pdk-app-event',
        event_name: 'rex-history-collection-complete',
        event_details: {
          collected_count: collectedCount,
          date: Date.now()
        }
      })
    }

    this.status.lastCollectionTime = Date.now()
    this.status.itemsCollected += collectedCount
    await this.setLastFetchTime(lastProcessedVisitTime)
    await this.saveStatus()
  }

  private async resolveRecordedUrl(
    url: string,
    visit: chrome.history.VisitItem,
    item: chrome.history.HistoryItem
  ): Promise<ResolvedRecordedUrl> {
    const ctx: { visit_id?: string; visit_time?: number; history_item_id?: string } = {
      visit_id: visit.visitId,
      history_item_id: item.id
    }
    // The caller only invokes resolveRecordedUrl for visits that passed its
    // `!visit.visitTime` guard, so visitTime is defined here. Assign only when
    // present so the optional property is omitted rather than set to undefined
    // (exactOptionalPropertyTypes distinguishes the two).
    if (visit.visitTime !== undefined) {
      ctx.visit_time = visit.visitTime
    }

    let registeredDomain = this.safeRegisteredDomain(url)
    // eslint-disable-next-line no-useless-assignment -- placates static analysis: every branch below reassigns recordedUrl before it is read, but the `= url` initializer documents the unfiltered default (applyFilterLists returns url unchanged on no match)
    let recordedUrl = url
    let recordedTitle = item.title || ''
    let filteredByList: string | undefined
    let filterMatch: listUtils.ListEntry | undefined

    // Apply domain_only_lists FIRST: takes precedence over allow_lists.
    // URLs on a domain_only_list are always collected at domain resolution,
    // regardless of allow_list membership.
    const domainOnlyResult = await this.applyDomainOnlyLists(url, ctx)

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
      allowCheck = await this.checkAllowLists(url)

      if (!allowCheck.allowed) {
        // URL not on allowlist - create dummy record with category placeholder
        recordedUrl = 'CATEGORY:NOT_ON_ALLOWLIST'
        recordedTitle = ''
        registeredDomain = ''
        // Log debug event if enabled (dev-only)
        await this.maybeLogFilteredUrlDebug(
          url,
          recordedUrl,
          'NOT_ON_ALLOWLIST',
          undefined,
          ctx
        )
      } else {
        // Apply filter_lists to produce a privacy-preserving recorded URL (but still upload the visit).
        const filterResult = await this.applyFilterLists(url, ctx)
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

    return { recordedUrl, recordedTitle, registeredDomain, filteredByList, filterMatch, allowCheck }
  }

  private buildVisitEvent(
    item: chrome.history.HistoryItem,
    visit: chrome.history.VisitItem,
    resolved: ResolvedRecordedUrl,
    categories: string[],
    linkFields: Record<string, unknown>
  ): EventPayload {
    return {
      name: 'rex-history-visit',
      // IMPORTANT: `url` is the recorded URL (may be replaced by CATEGORY:... for filtered items)
      url: resolved.recordedUrl,
      recorded_url: resolved.recordedUrl,
      domain: resolved.registeredDomain,
      title: resolved.recordedTitle,
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
      allowed_by_list: resolved.allowCheck.matchedList,
      allowed_by_list_entry: resolved.allowCheck.matchEntry
        ? {
            list_name: resolved.allowCheck.matchedList,
            matched_pattern: resolved.allowCheck.matchEntry.pattern,
            matched_pattern_type: resolved.allowCheck.matchEntry.pattern_type,
            matched_source: resolved.allowCheck.matchEntry.source,
            matched_metadata: resolved.allowCheck.matchEntry.metadata || {}
          }
        : undefined,

      // Filter-list context (safe: doesn't include original URL)
      filtered: Boolean(resolved.filteredByList),
      filtered_by_list: resolved.filteredByList,
      filtered_by_list_entry: resolved.filterMatch
        ? {
            list_name: resolved.filteredByList,
            matched_pattern: resolved.filterMatch.pattern,
            matched_pattern_type: resolved.filterMatch.pattern_type,
            matched_source: resolved.filterMatch.source,
            matched_metadata: resolved.filterMatch.metadata || {}
          }
        : undefined,

      // Optional linkage to rex-page-events (tab/session identity + exact url_shown_at).
      // Spread so these keys are simply absent when no match fired.
      ...linkFields,
    }
  }

  private async processHistoryBatch(
    historyItems: chrome.history.HistoryItem[],
    lastFetch: number
  ): Promise<{ collectedCount: number; maxVisitTime: number }> {
    let collectedCount = 0
    let maxVisitTime = lastFetch

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
        // Only process visits after lastFetch
        if (!visit.visitTime || visit.visitTime <= lastFetch) continue
        maxVisitTime = Math.max(maxVisitTime, visit.visitTime)

        // Basic privacy filter: only process http(s) URLs (and skip everything else like file://).
        if (this.shouldSkipUrl(item.url)) {
          continue
        }

        failedStep = 'list-matching'
        const resolved = await this.resolveRecordedUrl(item.url, visit, item)

        // Categorize against category lists
        failedStep = 'categorize'
        const categories = await this.categorizeUrl(item.url)

        // Attempt to link this visit to an observed rex-page-url-active record.
        // If the visit's recorded URL is redacted (filter/domain_only/allow miss),
        // we pass the REDACTED URL so the match short-circuits — defense in depth
        // against accidentally un-redacting via linkage metadata. When the URL is
        // not redacted, we pass the raw URL to match against buffer records.
        // When rex-page-events isn't installed, the buffer is empty and this is a no-op.
        const matchUrl = resolved.recordedUrl.startsWith('CATEGORY:') || resolved.recordedUrl === ''
          ? resolved.recordedUrl
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
        dispatchEvent(this.buildVisitEvent(item, visit, resolved, categories, linkFields))

        collectedCount++
      }
      } catch (error) {
        console.error(`[rex-history] Skipping history item due to error processing it: ${item.url}`, error)
        this.emitSkippedDiagnostic(item, failedStep, error)
      }
    }

    return { collectedCount, maxVisitTime }
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
      console.log('[rex-history] Triggering manual collection')
      this.collectHistory().then(() => {
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
      const lookbackDays = this.config?.lookback_days ?? 30
      const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000

      chrome.history.search({ text: '', startTime: 0, maxResults: 10000 })
        .then((items) => {
          if (items.length === 0) {
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
                sendResponse({ ageSeconds: (Date.now() - oldest) / 1000 })
              })
              .catch(() => sendResponse({ ageSeconds: (Date.now() - oldestVisitTime) / 1000 }))
          } else {
            sendResponse({ ageSeconds: (Date.now() - oldestVisitTime) / 1000 })
          }
        })
        .catch(() => sendResponse({ ageSeconds: null }))
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
