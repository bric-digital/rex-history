import type { BrowserContext, Worker } from '@playwright/test'
import { expect } from '@playwright/test'

type ServiceWorkerLike = {
  evaluate: (pageFunction: any, arg?: unknown) => Promise<unknown> // eslint-disable-line @typescript-eslint/no-explicit-any
}

/** Open a page, navigate to the URL, then close it — mirrors Keystone's visitUrl. */
export async function visitUrl(
  context: BrowserContext,
  url: string
): Promise<void> {
  const page = await context.newPage()
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' })
  } finally {
    await page.close()
  }
}

/**
 * Poll IndexedDB inside the service worker until the named list entry is present.
 * Matches Keystone's waitForAllowListEntry pattern exactly.
 */
export async function waitForAllowListEntry(
  serviceWorker: ServiceWorkerLike,
  listName: string,
  pattern: string,
  patternType: 'domain' | 'host'
): Promise<void> {
  await expect.poll(async () => {
    return serviceWorker.evaluate(async (input) => {
      return new Promise<boolean>((resolve) => {
        const openRequest = indexedDB.open('webmunk_lists')
        openRequest.onerror = () => resolve(false)
        openRequest.onsuccess = () => {
          const db = openRequest.result
          const tx = db.transaction(['list_entries'], 'readonly')
          const store = tx.objectStore('list_entries')
          let request: IDBRequest

          // Support both v3 (domain field) and v4 (pattern field) schema.
          if (store.indexNames.contains('list_name_pattern_type_pattern')) {
            request = store.index('list_name_pattern_type_pattern')
              .get([input.listName, input.patternType, input.pattern])
          } else if (store.indexNames.contains('list_name_pattern_type_domain')) {
            request = store.index('list_name_pattern_type_domain')
              .get([input.listName, input.patternType, input.pattern])
          } else {
            request = store.getAll()
          }

          request.onerror = () => resolve(false)
          request.onsuccess = () => {
            if (store.indexNames.contains('list_name_pattern_type_pattern')
              || store.indexNames.contains('list_name_pattern_type_domain')) {
              resolve(Boolean(request.result))
              return
            }
            const rows = Array.isArray(request.result)
              ? request.result as Array<Record<string, unknown>>
              : []
            resolve(rows.some((row) =>
              row.list_name === input.listName
              && row.pattern_type === input.patternType
              && (row.pattern === input.pattern || row.domain === input.pattern)))
          }
        }
      })
    }, { listName, pattern, patternType })
  }, {
    timeout: 20000,
    message: `Expected allow-list entry ${listName}:${patternType}:${pattern} to be synced`,
  }).toBe(true)
}

/**
 * Reset the history cursor and wait for any in-progress collection to finish,
 * so the next triggerHistoryCollection picks up all visits from time 0.
 * Matches Keystone's prepareManualHistoryCollection.
 */
export async function prepareManualHistoryCollection(serviceWorker: ServiceWorkerLike): Promise<void> {
  await serviceWorker.evaluate(async () => {
    await chrome.alarms.clear('rex-history-collection')

    const waitForIdle = async (): Promise<void> => {
      const deadline = Date.now() + 5000
      while (Date.now() < deadline) {
        const result = await chrome.storage.local.get('webmunkHistoryStatus')
        const status = result.webmunkHistoryStatus as { isCollecting?: boolean } | undefined
        if (!status?.isCollecting) return
        await new Promise<void>((r) => setTimeout(r, 100))
      }
    }
    await waitForIdle()

    await chrome.storage.local.set({ webmunkHistoryLastFetch: 0 })
  })
}

/** Send a triggerHistoryCollection message to the service worker. */
export async function triggerHistoryCollection(serviceWorker: ServiceWorkerLike): Promise<void> {
  await serviceWorker.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (self as any).__testSendMessage({ messageType: 'triggerHistoryCollection' })
  })
}

/**
 * Poll chrome.history inside the SW until all given URL substrings appear.
 * Matches Keystone's waitForHistoryEntries.
 */
export async function waitForHistoryEntries(
  serviceWorker: ServiceWorkerLike,
  urlSubstrings: string[],
  timeoutMs = 10000
): Promise<void> {
  await serviceWorker.evaluate(async (input) => {
    const { urlSubstrings, timeoutMs } = input
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      const items = await chrome.history.search({ text: '', startTime: 0, maxResults: 10000 })
      const urls = items.map((item) => item.url ?? '')
      const allFound = urlSubstrings.every((sub) => urls.some((url) => url.includes(sub)))
      if (allFound) return
      await new Promise<void>((r) => setTimeout(r, 200))
    }
    const items = await chrome.history.search({ text: '', startTime: 0, maxResults: 10000 })
    const urls = items.map((item) => item.url ?? '')
    throw new Error(
      `Timed out waiting for history entries.\n` +
      `Expected substrings: ${JSON.stringify(urlSubstrings)}\n` +
      `Found URLs: ${JSON.stringify(urls.slice(0, 20))}`
    )
  }, { urlSubstrings, timeoutMs })
}

/**
 * Poll storage until configSource is 'server', meaning the module has loaded
 * the injected configuration.
 */
export async function waitForConfigurationLoaded(serviceWorker: ServiceWorkerLike): Promise<void> {
  await expect.poll(async () => {
    return serviceWorker.evaluate(async () => {
      const result = await chrome.storage.local.get('webmunkHistoryStatus')
      return result.webmunkHistoryStatus?.configSource
    })
  }, {
    timeout: 15000,
    message: 'Expected configSource to be "server"',
  }).toBe('server')
}

/**
 * Inject history config + identifier directly into chrome.storage and wait for
 * the module to acknowledge it (configSource → 'server').
 */
export async function injectConfigAndIdentifier(
  serviceWorker: ServiceWorkerLike,
  overrides: Record<string, unknown> = {}
): Promise<void> {
  await serviceWorker.evaluate(async (historyConfig) => {
    await chrome.storage.local.set({
      rexIdentifier: 'rex-history-test-user',
      REXConfiguration: {
        history: historyConfig,
      },
    })
  }, {
    collection_interval_minutes: 60,
    lookback_days: 30,
    filter_lists: [],
    allow_lists: [],
    category_lists: [],
    domain_only_lists: [],
    generate_top_domains: false,
    top_domains_count: 50,
    top_domains_list_name: 'top-domains',
    ...overrides,
  })

  await waitForConfigurationLoaded(serviceWorker)
}

/** Clear the captured events array in the service worker. */
export async function resetCapturedEvents(serviceWorker: ServiceWorkerLike): Promise<void> {
  await serviceWorker.evaluate(() => { (self as any).__capturedEvents = [] }) // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Poll __capturedEvents in the service worker until the predicate matches,
 * then return all matching events. Mirrors Keystone's waitForEventInCaptures.
 */
export async function waitForCapturedEvent(
  serviceWorker: ServiceWorkerLike,
  predicate: (event: Record<string, unknown>) => boolean,
  message: string,
  timeoutMs = 15000
): Promise<Record<string, unknown>[]> {
  await expect.poll(async () => {
    const events = await serviceWorker.evaluate(
      () => (self as any).__capturedEvents as Record<string, unknown>[] // eslint-disable-line @typescript-eslint/no-explicit-any
    ) as Record<string, unknown>[]
    return events.some(predicate)
  }, { timeout: timeoutMs, message }).toBe(true)

  return serviceWorker.evaluate(
    () => (self as any).__capturedEvents as Record<string, unknown>[] // eslint-disable-line @typescript-eslint/no-explicit-any
  ) as Promise<Record<string, unknown>[]>
}

/**
 * Write list entries directly to IndexedDB inside the service worker context.
 * Equivalent to Keystone's server-side list sync, but done inline for module tests.
 */
export async function injectListEntries(
  serviceWorker: ServiceWorkerLike,
  entries: Array<{ list_name: string; pattern: string; pattern_type: string; metadata?: Record<string, unknown> }>
): Promise<void> {
  await serviceWorker.evaluate(async (rows) => {
    // Open the DB at whatever version the rex-lists module already created.
    // Do NOT specify a version number here — opening at a higher version would
    // trigger onupgradeneeded which would conflict with rex-lists' own migration logic.
    await new Promise<void>((resolve, reject) => {
      const openRequest = indexedDB.open('webmunk_lists')
      openRequest.onerror = () => reject(new Error('Failed to open webmunk_lists'))
      openRequest.onsuccess = () => {
        const db = openRequest.result
        const tx = db.transaction(['list_entries'], 'readwrite')
        const store = tx.objectStore('list_entries')

        // Clear all existing entries for each list name being written, so
        // repeated calls across tests don't hit the unique index constraint.
        const listNames = [...new Set(rows.map((r) => r.list_name))]
        const listNameIndex = store.index('list_name')
        let pendingDeletes = listNames.length

        const writeRows = () => {
          // Write entries compatible with both v3 (domain field) and v4 (pattern field).
          for (const row of rows) {
            store.add({
              list_name: row.list_name,
              domain: row.pattern,   // v3 field name
              pattern: row.pattern,  // v4 field name
              pattern_type: row.pattern_type,
              source: 'backend',
              metadata: row.metadata ?? {},
            })
          }
        }

        if (pendingDeletes === 0) {
          writeRows()
        } else {
          for (const listName of listNames) {
            const cursorRequest = listNameIndex.openCursor(IDBKeyRange.only(listName))
            cursorRequest.onsuccess = () => {
              const cursor = cursorRequest.result
              if (cursor) {
                cursor.delete()
                cursor.continue()
              } else {
                pendingDeletes--
                if (pendingDeletes === 0) writeRows()
              }
            }
          }
        }

        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(new Error('Transaction failed'))
      }
    })
  }, entries)
}
