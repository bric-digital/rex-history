/**
 * Test shim for webmunk-history service worker module.
 *
 * Loads the real HistoryServiceWorkerModule and registers an EventCaptureModule
 * alongside it, so Playwright tests can assert on dispatched history events.
 *
 * Load tests/src/build/test-shim.bundle.js in the test page AFTER the
 * chrome mock has been defined on window.
 */
import rexCorePlugin, { registerREXModule, REXServiceWorkerModule } from '@bric/rex-core/service-worker'
import * as listUtils from '@bric/rex-lists'
import historyPlugin from '../../src/service-worker.mjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any

// Set up event capture array. Populated by EventCaptureModule.logEvent.
// Tests reset this with: page.evaluate(() => { window.__capturedEvents = [] })
g.__capturedEvents = []

/**
 * Captures all events dispatched by the history module for test assertions.
 */
class EventCaptureModule extends REXServiceWorkerModule {
  moduleName(): string { return 'EventCapture' }
  override setup(): void { /* intentional no-op */ }
  override handleMessage(_msg: unknown, _sender: unknown, _sendResponse: (r: unknown) => void): boolean { return false }
  override logEvent(event: object): void {
    // Always push into whichever array is currently assigned to __capturedEvents,
    // so that tests can reset by assigning a new array.
    const arr = g.__capturedEvents
    if (Array.isArray(arr)) {
      arr.push(event)
    }
  }
}

registerREXModule(new EventCaptureModule())

// Expose the plugin instance so tests can call methods directly if needed.
g.__historyPlugin = historyPlugin

// Expose listUtils so tests can populate the list database for filtering/categorisation tests.
g.__listUtils = listUtils

// Expose a helper that routes a message through rex-core's module dispatch, matching
// the real extension behaviour (the history module registers with rex-core, not
// chrome.runtime.onMessage directly).
//
// Usage in tests:
//   const response = await page.evaluate(() => window.__sendMessage({ messageType: 'getHistoryStatus' }))
g.__sendMessage = (message: Record<string, unknown>): Promise<unknown> => {
  return new Promise((resolve) => {
    rexCorePlugin.handleMessage(message, {}, resolve)
  })
}

// Signal that the shim has finished loading (module setup() may still be in-flight).
// Tests should also wait for webmunkHistoryStatus to appear in storage, which signals
// that setup() has completed (setup() always calls saveStatus() at least once).
g.__historyShimLoaded = true
