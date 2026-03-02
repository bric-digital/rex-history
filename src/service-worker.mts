import psl from 'psl'
import rexCorePlugin, { REXServiceWorkerModule, registerREXModule, dispatchEvent } from '@bric/rex-core/service-worker'
import { type REXConfiguration } from '@bric/rex-core/extension'
import * as listUtils from '@bric/rex-lists'

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
}

interface HistoryStatus {
  lastCollectionTime?: number;
  itemsCollected: number;
  isCollecting: boolean;
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
      console.error('[webmunk-history] Failed to check identifier:', error)
      return false
    }
  }

  async setup() {
    console.log('[webmunk-history/service-worker] Setting up history collection module')

    // Initialize list database
    try {
      await listUtils.initializeListDatabase()
      console.log('[webmunk-history] List database initialized')
    } catch (error) {
      console.error('[webmunk-history] Failed to initialize list database:', error)
    }

    // React to configuration updates (e.g., after identifier is set and remote config is fetched).
    // This ensures periodic collection turns on once history config becomes available AND identifier is set.
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local') return
      if (changes.REXConfiguration || changes.rexIdentifier) {
        this.loadConfiguration()
          .then(async () => {
            const hasIdentifier = await this.hasIdentifier()
            if (this.config && hasIdentifier) {
              await this.setupAlarm()
              console.log('[webmunk-history] Configuration and identifier available, alarm set up')
            } else if (this.config && !hasIdentifier) {
              console.log('[webmunk-history] Configuration available but no identifier - waiting for identifier before starting collection')
            }
          })
          .catch((err) => {
            console.error('[webmunk-history] Failed to react to configuration change:', err)
          })
      }
    })

    // Load configuration
    await this.loadConfiguration()

    // Set up periodic collection alarm ONLY if identifier exists
    const hasIdentifier = await this.hasIdentifier()
    if (this.config && hasIdentifier) {
      await this.setupAlarm()
      console.log(`[webmunk-history] Alarm set for every ${this.config.collection_interval_minutes} minutes`)
    } else if (this.config && !hasIdentifier) {
      console.log('[webmunk-history] Configuration loaded but no identifier set - collection will start once identifier is provided')
    }

    // Set up alarm listener
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'rex-history-collection') {
        console.log('[webmunk-history] Periodic collection triggered')
        this.collectHistory().catch((error) => {
          console.error('[webmunk-history] Collection error:', error)
        })
      }
    })

    // Message listener registration is handled by rex-core; registering here
    // would create a duplicate listener. Kept commented for reference.
    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //   return this.handleMessage(message, sender, sendResponse)
    // })

    // Load status from storage
    await this.loadStatus()

    // Ensure status reflects current effective configuration + source
    await this.loadConfiguration()
  }

  async loadConfiguration() {
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

        console.log('[webmunk-history] Configuration loaded from rex-core:', historyConfig)
      } else {
        this.config = null
        this.status.configSource = 'none'
        delete this.status.effectiveConfig
        await this.saveStatus()
        console.warn('[webmunk-history] No history configuration found in rex-core configuration')
      }
      const listConfig = configurationRecord?.['lists']
      if (listConfig !== null && listConfig !== undefined && typeof listConfig === 'object' && !Array.isArray(listConfig)) {
        listUtils.parseAndSyncLists(listConfig as Parameters<typeof listUtils.parseAndSyncLists>[0])
          .then(() => {
            console.log('[webmunk-history] Lists synced.')
          })
          .catch((err: unknown) => {
            console.error('[webmunk-history] Failed to sync lists:', err)
          })
      }

    } catch (error) {
      console.error('[webmunk-history] Failed to load configuration:', error)
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
      console.error('[webmunk-history] Failed to load status:', error)
    }
  }

  async saveStatus() {
    try {
      await chrome.storage.local.set({
        webmunkHistoryStatus: this.status
      })
    } catch (error) {
      console.error('[webmunk-history] Failed to save status:', error)
    }
  }

  async getLastFetchTime(): Promise<number> {
    try {
      const result = await chrome.storage.local.get('webmunkHistoryLastFetch')
      if (result.webmunkHistoryLastFetch) {
        return result.webmunkHistoryLastFetch as number
      }

      // If no last fetch time, use lookback_days from config
      if (this.config) {
        const lookbackMs = this.config.lookback_days * 24 * 60 * 60 * 1000
        return Date.now() - lookbackMs
      }

      // Default to 30 days ago
      return Date.now() - (30 * 24 * 60 * 60 * 1000)
    } catch (error) {
      console.error('[webmunk-history] Failed to get last fetch time:', error)
      return Date.now() - (30 * 24 * 60 * 60 * 1000)
    }
  }

  async setLastFetchTime(timestamp: number) {
    try {
      await chrome.storage.local.set({
        webmunkHistoryLastFetch: timestamp
      })
    } catch (error) {
      console.error('[webmunk-history] Failed to set last fetch time:', error)
    }
  }

  collectHistory(): Promise<void> {
    if (this.status.isCollecting) {
      console.log('[webmunk-history] Collection already in progress, skipping')
      return Promise.resolve()
    }

    // IMPORTANT: Do not collect or send data until user has entered an identifier
    return this.hasIdentifier()
      .then((hasIdentifier) => {
        if (!hasIdentifier) {
          console.warn('[webmunk-history] No identifier set - collection will not start until identifier is provided')
          return Promise.reject(new Error('NO_IDENTIFIER'))
        }
        return this.loadConfiguration()
      })
      .then(() => this.waitForConfiguration())
      .then(() => {
        if (!this.config) {
          console.warn('[webmunk-history] No configuration available, skipping collection')
          return Promise.reject(new Error('NO_CONFIGURATION'))
        }

        console.log('[webmunk-history] Starting history collection')
        this.status.isCollecting = true
        return this.saveStatus()
      })
      .then(() => this.runCollectionCycle())
      .catch((error: unknown) => {
        if (error instanceof Error && (error.message === 'NO_IDENTIFIER' || error.message === 'NO_CONFIGURATION')) {
          return
        }

        console.error('[webmunk-history] Collection error:', error)
        // Even on failure, record that we attempted a fetch so operators/tests can
        // see activity and avoid "undefined" last-fetch state.
        return this.setLastFetchTime(Date.now())
      })
      .finally(() => {
        if (!this.status.isCollecting) {
          return
        }

        this.status.isCollecting = false
        return this.saveStatus().finally(() => {
          console.log('[webmunk-history] Collection complete')
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

  private runCollectionCycle(): Promise<void> {
    let collectedCount = 0
    let lastProcessedVisitTime = 0

    return this.getLastFetchTime()
      .then((initialLastFetch) => {
        lastProcessedVisitTime = initialLastFetch
        console.log(`[webmunk-history] Fetching history since ${new Date(initialLastFetch).toISOString()}`)

        const fetchHistoryBatch = (): Promise<void> => {
          return chrome.history.search({
            text: '',
            startTime: lastProcessedVisitTime,
            maxResults: 10000
          }).then((historyItems) => {
            console.log(`[webmunk-history] Found ${historyItems.length} history items`)
            if (historyItems.length === 0) {
              return
            }

            return this.processHistoryBatch(historyItems, lastProcessedVisitTime)
              .then((batchResult) => {
                collectedCount += batchResult.collectedCount
                if (batchResult.maxVisitTime <= lastProcessedVisitTime) {
                  return
                }
                // Advance cursor so the next fetch only looks for newer visits.
                lastProcessedVisitTime = batchResult.maxVisitTime + 1
                return fetchHistoryBatch()
              })
          })
        }

        return fetchHistoryBatch()
      })
      .then(() => {
        console.log(`[webmunk-history] Collected ${collectedCount} history visits`)
        if (this.config?.generate_top_domains) {
          return this.generateTopDomainsList()
        }
      })
      .then(() => {
        this.status.lastCollectionTime = Date.now()
        this.status.itemsCollected += collectedCount
        return this.setLastFetchTime(Date.now())
      })
      .then(() => this.saveStatus())
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
        const categories = await this.categorizeUrl(item.url)

        // Dispatch event to all modules (PDK will pick it up for upload)
        console.log('[webmunk-history] Logging event: rex-history-visit')
        dispatchEvent({
          name: 'rex-history-visit',
          // IMPORTANT: `url` is the recorded URL (may be replaced by CATEGORY:... for filtered items)
          url: recordedUrl,
          recorded_url: recordedUrl,
          domain: registeredDomain,
          title: recordedTitle,
          visit_time: visit.visitTime,
          transition: visit.transition,
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
                matched_pattern: allowCheck.matchEntry.domain,
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
                matched_pattern: filterMatch.domain,
                matched_pattern_type: filterMatch.pattern_type,
                matched_source: filterMatch.source,
                matched_metadata: filterMatch.metadata || {}
              }
            : undefined
        })

        collectedCount++
      }
    }

    return { collectedCount, maxVisitTime }
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
          console.log(`[webmunk-history] URL allowed by list ${listName}: ${url}`)
          return { allowed: true, matchedList: listName, matchEntry: match }
        }
      } catch (error) {
        console.error(`[webmunk-history] Error checking allow list ${listName}:`, error)
      }
    }

    // No match found in any allow-list = skip this URL
    console.log(`[webmunk-history] URL not in allow-lists, skipping: ${url}`)
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
    if (!this.config) {
      return { recordedUrl: url }
    }

    for (const listName of this.config.filter_lists) {
      try {
        const match = await listUtils.matchDomainAgainstList(url, listName)
        if (match) {
          const category = (match.metadata?.category as string | undefined) ?? null
          const recordedUrl = `CATEGORY:${category ?? 'null'}`

          console.log(`[webmunk-history] Filtered URL by list ${listName} -> ${recordedUrl}`)

          await this.maybeLogFilteredUrlDebug(url, recordedUrl, listName, match, ctx)
          return { recordedUrl, filteredByList: listName, filterMatch: match }
        }
      } catch (error) {
        console.error(`[webmunk-history] Error checking filter list ${listName}:`, error)
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
          console.log(`[webmunk-history] Applied domain-only filter by list ${listName}`)

          await this.maybeLogFilteredUrlDebug(url, 'DOMAIN ONLY', listName, match, ctx)
          return { filteredByList: listName, filterMatch: match }
        }
      } catch (error) {
        console.error(`[webmunk-history] Error checking domain-only list ${listName}:`, error)
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
        console.warn('[webmunk-history] Debug URL logging was enabled, but this is not the dev extension. Disabling.')
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
      matched_pattern: match?.domain,
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
    if (!this.config) return []

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
        console.error(`[webmunk-history] Error checking category list ${listName}:`, error)
      }
    }

    if (matches.length === 0) return []

    // Define specificity hierarchy (higher = more specific)
    const specificity: Record<string, number> = {
      'exact_url': 5,
      'regex': 4,
      'host_path_prefix': 3,
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

    console.log('[webmunk-history] Generating top domains list')

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
        domain: domain,
        pattern_type: 'domain' as const,
        source: 'generated' as const,
        metadata: {
          visit_count: count,
          generated_at: Date.now()
        }
      }))

      await listUtils.bulkCreateListEntries(entries)

      console.log(`[webmunk-history] Generated top ${sortedDomains.length} domains`)
    } catch {
      console.error('[webmunk-history] Error generating top domains list')
    }
  }

  handleMessage(message: { messageType: string; [key: string]: unknown }, sender: chrome.runtime.MessageSender, sendResponse: (response: unknown) => void): boolean {
    console.log('[webmunk-history] Received message:', message.messageType)

    if (message.messageType === 'triggerHistoryCollection') {
      console.log('[webmunk-history] Triggering manual collection')
      this.collectHistory().then(() => {
        sendResponse({ success: true })
      }).catch((error) => {
        sendResponse({ success: false, error: error.message })
      })
      return true
    }

    if (message.messageType === 'getHistoryStatus') {
      console.log('[webmunk-history] Sending status:', this.status)
      sendResponse(this.status)
      return true
    }

    if (message.messageType === 'getOldestHistoryAge') {
      console.log('[webmunk-history] Searching for oldest history item')
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
            console.log(`[webmunk-history] First 10k items are all under ${lookbackDays} days old, fetching another page`)
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

    console.log('[webmunk-history] Unknown message type, not handling')
    return false
  }

  // Note: This module does NOT respond to events, only sends them
  // The logEvent method is intentionally not implemented to avoid infinite recursion
  // when dispatchEvent() is called
}

const plugin = new HistoryServiceWorkerModule()

registerREXModule(plugin)

export default plugin
