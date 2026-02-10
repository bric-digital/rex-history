import { REXClientModule, registerREXModule } from '@bric/rex-core/browser'

/**
 * Minimal browser module for webmunk-history
 * History collection happens in the service worker, not in the browser context
 */
class HistoryBrowserModule extends REXClientModule {
  constructor() {
    super()
  }

  setup() {
    // No browser context setup needed for history collection
    console.log('[rex-history/browser] History collection runs in service worker context')
  }
}

const plugin = new HistoryBrowserModule()

registerREXModule(plugin)

export default plugin
