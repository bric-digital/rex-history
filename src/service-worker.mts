import psl from 'psl'
import { WebmunkServiceWorkerModule, registerWebmunkModule, dispatchEvent } from '@bric/webmunk-core/service-worker'
import * as listUtils from '@bric/webmunk-lists'

interface HistoryConfig {
  collection_interval_minutes: number;
  lookback_days: number;
  filter_lists: string[];
  allow_lists: string[];
  category_lists: string[];
  generate_top_domains: boolean;
  top_domains_count: number;
  top_domains_list_name: string;
}

interface HistoryStatus {
  lastCollectionTime?: number;
  itemsCollected: number;
  isCollecting: boolean;
  configSource?: 'local_override' | 'server' | 'none';
  effectiveConfig?: HistoryConfig;
}

/**
 * History collection module - collects browser history with filtering and categorization
 */
class HistoryServiceWorkerModule extends WebmunkServiceWorkerModule {
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
    // This ensures periodic collection turns on once history config becomes available.
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local') return
      if (changes.webmunkConfiguration || changes.webmunkHistoryConfiguration) {
        this.loadConfiguration()
          .then(async () => {
            if (this.config) {
              await this.setupAlarm()
            }
          })
          .catch((err) => {
            console.error('[webmunk-history] Failed to react to configuration change:', err)
          })
      }
    })

    // Load configuration
    await this.loadConfiguration()

    // Set up periodic collection alarm
    if (this.config) {
      await this.setupAlarm()
      console.log(`[webmunk-history] Alarm set for every ${this.config.collection_interval_minutes} minutes`)
    }

    // Set up alarm listener
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'webmunk-history-collection') {
        console.log('[webmunk-history] Periodic collection triggered')
        this.collectHistory().catch((error) => {
          console.error('[webmunk-history] Collection error:', error)
        })
      }
    })

    // Set up message listener
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      return this.handleMessage(message, sender, sendResponse)
    })

    // Load status from storage
    await this.loadStatus()

    // Ensure status reflects current effective configuration + source
    await this.loadConfiguration()
  }

  async loadConfiguration() {
    try {
      // Base config typically comes from the server-provided config (stored by webmunk-core)
      const baseResult = await chrome.storage.local.get('webmunkConfiguration')
      const baseConfig = baseResult.webmunkConfiguration as { history?: HistoryConfig } | undefined

      // Optional local override (often injected by an extension's service worker from its bundled config.json)
      const overrideResult = await chrome.storage.local.get('webmunkHistoryConfiguration')
      const overrideConfig = overrideResult.webmunkHistoryConfiguration as { history?: HistoryConfig } | undefined

      const baseHistory = baseConfig?.history
      const overrideHistory = overrideConfig?.history

      // Effective config rule:
      // - If overrideHistory exists, it overrides baseHistory field-by-field
      // - Else fall back to baseHistory
      let effectiveHistory: HistoryConfig | undefined
      let source: HistoryStatus['configSource'] = 'none'

      if (overrideHistory) {
        effectiveHistory = { ...(baseHistory ?? {}), ...overrideHistory } as HistoryConfig
        source = 'local_override'
      } else if (baseHistory) {
        effectiveHistory = baseHistory
        source = 'server'
      }

      if (effectiveHistory) {
        this.config = effectiveHistory
        this.status.configSource = source
        this.status.effectiveConfig = effectiveHistory
        await this.saveStatus()

        console.log('[webmunk-history] Effective configuration loaded:', effectiveHistory)
        if (source === 'local_override') {
          console.warn('[webmunk-history] Using LOCAL override config (webmunkHistoryConfiguration.history) over server config (webmunkConfiguration.history)')
        }
      } else {
        this.config = null
        this.status.configSource = 'none'
        delete this.status.effectiveConfig
        await this.saveStatus()
        console.warn('[webmunk-history] No history configuration found (neither override nor server config)')
      }
    } catch (error) {
      console.error('[webmunk-history] Failed to load configuration:', error)
    }
  }

  async setupAlarm() {
    if (!this.config) return

    // Clear any existing alarm
    await chrome.alarms.clear('webmunk-history-collection')

    // Create new alarm
    await chrome.alarms.create('webmunk-history-collection', {
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

  async collectHistory() {
    if (this.status.isCollecting) {
      console.log('[webmunk-history] Collection already in progress, skipping')
      return
    }

    // Re-load configuration so server updates / local overrides are reflected at collection time
    await this.loadConfiguration()

    // In some environments (e.g., integration tests), the extension UI may write the initial
    // `webmunkConfiguration` slightly after the service worker starts. For manual collection,
    // do a short bounded retry so a user click doesn't silently no-op due to a race.
    if (!this.config) {
      const deadlineMs = Date.now() + 1500
      while (!this.config && Date.now() < deadlineMs) {
        await new Promise((resolve) => setTimeout(resolve, 250))
        await this.loadConfiguration()
      }
    }

    if (!this.config) {
      console.warn('[webmunk-history] No configuration available, skipping collection')
      return
    }

    console.log('[webmunk-history] Starting history collection')
    this.status.isCollecting = true
    await this.saveStatus()

    try {
      // Get last fetch time
      const lastFetch = await this.getLastFetchTime()
      console.log(`[webmunk-history] Fetching history since ${new Date(lastFetch).toISOString()}`)

      // Search history since lastFetch
      const historyItems = await chrome.history.search({
        text: '',
        startTime: lastFetch,
        maxResults: 10000
      })

      console.log(`[webmunk-history] Found ${historyItems.length} history items`)

      let collectedCount = 0

      // Process each history item
      for (const item of historyItems) {
        if (!item.url) continue

        // Get visits for this item
        const visits = await chrome.history.getVisits({ url: item.url })

        for (const visit of visits) {
          // Only process visits after lastFetch
          if (!visit.visitTime || visit.visitTime <= lastFetch) continue

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

          // Apply allow_lists: if configured, only collect URLs matching an allow-list.
          // If not allowed, create a dummy record (like blocklist behavior).
          const allowCheck = await this.checkAllowLists(item.url)
          let recordedUrl = item.url
          let recordedTitle = item.title || ''
          let filteredByList: string | undefined
          let filterMatch: listUtils.ListEntry | undefined
          
          if (!allowCheck.allowed) {
            // URL not on allowlist - create dummy record with category placeholder
            recordedUrl = 'CATEGORY:NOT_ON_ALLOWLIST'
            recordedTitle = ''
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

            // Privacy: if we masked the URL, mask the title too.
            if (recordedUrl.startsWith('CATEGORY:')) {
              recordedTitle = ''
            }
          }

          // Categorize against category lists
          const categories = await this.categorizeUrl(item.url)

          // Dispatch event to all modules (PDK will pick it up for upload)
          console.log('[webmunk-history] Logging event: webmunk-history-visit')
          dispatchEvent({
            name: 'webmunk-history-visit',
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

      console.log(`[webmunk-history] Collected ${collectedCount} history visits`)

      // Generate top domains list if enabled
      if (this.config.generate_top_domains) {
        await this.generateTopDomainsList()
      }

      // Update status
      this.status.lastCollectionTime = Date.now()
      this.status.itemsCollected += collectedCount
      await this.setLastFetchTime(Date.now())
      await this.saveStatus()

    } catch (error) {
      console.error('[webmunk-history] Collection error:', error)
      // Even on failure, record that we attempted a fetch so operators/tests can
      // see activity and avoid "undefined" last-fetch state.
      await this.setLastFetchTime(Date.now())
    } finally {
      this.status.isCollecting = false
      await this.saveStatus()
      console.log('[webmunk-history] Collection complete')
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

    const categories: string[] = []

    for (const listName of this.config.category_lists) {
      try {
        const match = await listUtils.matchDomainAgainstList(url, listName)
        if (match && match.metadata?.category) {
          categories.push(match.metadata.category as string)
        }
      } catch (error) {
        console.error(`[webmunk-history] Error checking category list ${listName}:`, error)
      }
    }

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
      return false
    }

    console.log('[webmunk-history] Unknown message type, not handling')
    return false
  }

  // Note: This module does NOT respond to events, only sends them
  // The logEvent method is intentionally not implemented to avoid infinite recursion
  // when dispatchEvent() is called
}

const plugin = new HistoryServiceWorkerModule()

registerWebmunkModule(plugin)

export default plugin
