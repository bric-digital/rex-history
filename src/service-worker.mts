import psl from 'psl'
import { WebmunkServiceWorkerModule, registerWebmunkModule } from '@bric/webmunk-core/service-worker'
import * as listUtils from '@bric/webmunk-core/list-utilities'

interface HistoryConfig {
  collection_interval_minutes: number;
  lookback_days: number;
  filter_lists: string[];
  category_lists: string[];
  generate_top_domains: boolean;
  top_domains_count: number;
  top_domains_list_name: string;
}

interface HistoryStatus {
  lastCollectionTime?: number;
  itemsCollected: number;
  isCollecting: boolean;
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
  }

  async loadConfiguration() {
    try {
      // Try the history-specific key first (AI-Extension uses this)
      let result = await chrome.storage.local.get('webmunkHistoryConfiguration')
      let config = result.webmunkHistoryConfiguration

      // Fallback to the general configuration key for compatibility
      if (!config) {
        result = await chrome.storage.local.get('webmunkConfiguration')
        config = result.webmunkConfiguration
      }

      if (config && config.history) {
        this.config = config.history as HistoryConfig
        console.log('[webmunk-history] Configuration loaded:', this.config)
      } else {
        console.warn('[webmunk-history] No history configuration found')
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

          // Filter against privacy lists
          if (await this.shouldFilterUrl(item.url)) {
            continue
          }

          // Categorize against category lists
          const categories = await this.categorizeUrl(item.url)

          // Log event
          this.logEvent({
            name: 'webmunk-history-visit',
            url: item.url,
            title: item.title || '',
            visit_time: visit.visitTime,
            transition: visit.transition,
            categories: categories,
            date: visit.visitTime
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
    } finally {
      this.status.isCollecting = false
      await this.saveStatus()
      console.log('[webmunk-history] Collection complete')
    }
  }

  async shouldFilterUrl(url: string): Promise<boolean> {
    if (!this.config) return true

    // Filter non-http(s) URLs
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return true
    }

    // Filter chrome:// and extension:// URLs
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
      return true
    }

    // Check against configured filter lists
    for (const listName of this.config.filter_lists) {
      try {
        const match = await listUtils.matchDomainAgainstList(url, listName)
        if (match) {
          console.log(`[webmunk-history] Filtered URL ${url} by list ${listName}`)
          return true
        }
      } catch (error) {
        console.error(`[webmunk-history] Error checking filter list ${listName}:`, error)
      }
    }

    return false
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
          const domain = parsed.domain || hostname

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

  logEvent(event: { name: string; [key: string]: unknown }) {
    console.log('[webmunk-history] Logging event:', event.name)
    // Events are automatically logged via the parent class
    // which will be picked up by webmunk-passive-data-kit
  }
}

const plugin = new HistoryServiceWorkerModule()

registerWebmunkModule(plugin)

export default plugin
