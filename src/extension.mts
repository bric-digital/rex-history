import $ from 'jquery'
import { WebmunkExtensionModule, registerWebmunkModule, type WebmunkUIDefinition } from '@bric/webmunk-core/extension'

/**
 * History module extension - provides status UI for history collection
 */
class HistoryExtensionModule extends WebmunkExtensionModule {
  constructor() {
    super()
  }

  setup() {
    console.log('[webmunk-history/extension] History extension module loaded')
  }

  activateInterface(uiDefinition: WebmunkUIDefinition): boolean {
    if (uiDefinition.identifier === 'history-status') {
      this.setupHistoryStatusUI()
      return true
    }

    return false
  }

  setupHistoryStatusUI() {
    // Load collection status
    this.refreshStatus()

    // Set up manual trigger button
    $('#history-trigger-collection').off('click')
    $('#history-trigger-collection').on('click', () => {
      $('#history-trigger-collection').prop('disabled', true)
      $('#history-trigger-collection').text('Collecting...')

      chrome.runtime.sendMessage({
        messageType: 'triggerHistoryCollection'
      }).then(() => {
        $('#history-trigger-collection').prop('disabled', false)
        $('#history-trigger-collection').text('Collect Now')
        this.refreshStatus()
      }).catch((error) => {
        console.error('Failed to trigger history collection:', error)
        $('#history-trigger-collection').prop('disabled', false)
        $('#history-trigger-collection').text('Collect Now')
        alert('Failed to trigger history collection')
      })
    })

    // Set up refresh button
    $('#history-refresh-status').off('click')
    $('#history-refresh-status').on('click', () => {
      this.refreshStatus()
    })

    // Load configuration
    chrome.runtime.sendMessage({
      messageType: 'fetchConfiguration'
    }).then((response: { [name: string]: unknown }) => {
      const config = response['history'] as {
        collection_interval_minutes?: number;
        lookback_days?: number;
        filter_lists?: string[];
        allow_lists?: string[];
        category_lists?: string[];
        generate_top_domains?: boolean;
        top_domains_count?: number;
        top_domains_list_name?: string;
      }

      if (config) {
        $('#history-config-interval').text(config.collection_interval_minutes?.toString() ?? 'N/A')
        $('#history-config-lookback').text(config.lookback_days?.toString() ?? 'N/A')
        $('#history-config-filter-lists').text(config.filter_lists?.length ? config.filter_lists.join(', ') : 'None')
        $('#history-config-allow-lists').text(config.allow_lists?.length ? config.allow_lists.join(', ') : 'None (all URLs allowed)')
        $('#history-config-category-lists').text(config.category_lists?.join(', ') ?? 'None')
        $('#history-config-top-domains').text(config.generate_top_domains ? 'Yes' : 'No')
        $('#history-config-top-domains-count').text(config.top_domains_count?.toString() ?? 'N/A')
      }
    })
  }

  refreshStatus() {
    // Fetch collection status from service worker
    chrome.runtime.sendMessage({
      messageType: 'getHistoryStatus'
    }).then((status: {
      lastCollectionTime?: number;
      itemsCollected?: number;
      isCollecting?: boolean;
    }) => {
      if (status.lastCollectionTime) {
        const lastCollectionDate = new Date(status.lastCollectionTime)
        $('#history-last-collection').text(lastCollectionDate.toLocaleString())
      } else {
        $('#history-last-collection').text('Never')
      }

      $('#history-items-collected').text(status.itemsCollected?.toString() ?? '0')

      if (status.isCollecting) {
        $('#history-trigger-collection').prop('disabled', true)
        $('#history-trigger-collection').text('Collecting...')
      } else {
        $('#history-trigger-collection').prop('disabled', false)
        $('#history-trigger-collection').text('Collect Now')
      }
    }).catch((error) => {
      console.error('Failed to fetch history status:', error)
      $('#history-last-collection').text('Error')
      $('#history-items-collected').text('Error')
    })
  }
}

const plugin = new HistoryExtensionModule()

registerWebmunkModule(plugin)

export default plugin
