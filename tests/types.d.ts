/**
 * Type augmentations for the test mock Chrome APIs defined in test-page.html.
 *
 * The mock chrome object adds internal properties (_data, _items, _alarms,
 * _listeners) and helper functions (triggerAlarm, addMockHistoryItem, etc.)
 * that don't exist on the real Chrome extension types.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    /** Trigger a mock chrome.alarms.onAlarm listener by alarm name. */
    triggerAlarm(name: string): void

    /** Add a mock history item to chrome.history._items. */
    addMockHistoryItem(item: any): void

    /** Clear all mock history items. */
    clearMockHistory(): void

    /** Clear all mock chrome.storage.local data. */
    clearStorage(): Promise<void>

    /** True once test-page.html's inline script has finished. */
    testUtilitiesReady?: boolean

    /** True once test-shim.bundle.js has finished loading. */
    __historyShimLoaded?: boolean

    /** Events captured by the EventCaptureModule in test-shim. */
    __capturedEvents?: any[]

    /** Message listeners registered via chrome.runtime.onMessage.addListener. */
    __chromeMessageListeners?: Array<(...args: any[]) => void>
  }
}

declare namespace chrome.storage {
  interface StorageArea {
    /** Internal data store used by the mock. */
    _data: Record<string, any>
  }
}

declare namespace chrome.history {
  /** Internal items array used by the mock. */
  let _items: Array<chrome.history.HistoryItem & { _visits?: any[] }>
}

export {}
