import { WebmunkClientModule, registerWebmunkModule } from '@bric/webmunk-core/browser'

/**
 * Minimal browser module for webmunk-history
 * History collection happens in the service worker, not in the browser context
 */
class HistoryBrowserModule extends WebmunkClientModule {
  constructor() {
    super()
  }

  setup() {
    // No browser context setup needed for history collection
    console.log('[webmunk-history/browser] History collection runs in service worker context')
  }
}

const plugin = new HistoryBrowserModule()

registerWebmunkModule(plugin)

export default plugin
