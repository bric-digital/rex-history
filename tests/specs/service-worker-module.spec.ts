import { test, expect } from '@playwright/test'

/**
 * Integration tests for the real HistoryServiceWorkerModule.
 *
 * Unlike service-worker.spec.js — which only exercises the chrome mock stubs —
 * these tests load test-shim.bundle.js, which instantiates the actual
 * HistoryServiceWorkerModule and registers an EventCaptureModule alongside it.
 * All assertions target real module behaviour.
 */

// ---------------------------------------------------------------------------
// Helpers (run inside browser page via page.evaluate)
// ---------------------------------------------------------------------------

/** Wait until setup() has written its initial status to storage. */
async function waitForModuleSetup(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => (window as any).__historyShimLoaded === true)
  await page.waitForFunction(
    () => (window as any).chrome.storage.local._data.webmunkHistoryStatus !== undefined
  )
}

/** Inject a complete history config + user identifier so the module will collect. */
async function seedConfigAndIdentifier(
  page: import('@playwright/test').Page,
  overrides: Record<string, unknown> = {}
) {
  await page.evaluate((overrides) => {
    window.chrome.storage.local._data.rexIdentifier = 'test-participant-001'
    window.chrome.storage.local._data.REXConfiguration = {
      history: {
        collection_interval_minutes: 60,
        lookback_days: 7,
        filter_lists: [],
        allow_lists: [],
        category_lists: [],
        domain_only_lists: [],
        generate_top_domains: false,
        top_domains_count: 50,
        top_domains_list_name: 'top-domains',
        ...overrides
      }
    }
  }, overrides)
}

/** Add a mock history item with one visit. */
async function addHistoryItem(
  page: import('@playwright/test').Page,
  url: string,
  title: string,
  visitTime: number
) {
  await page.evaluate(({ url, title, visitTime }) => {
    window.chrome.history._items.push({
      id: String(Date.now() + Math.random()),
      url,
      title,
      lastVisitTime: visitTime,
      visitCount: 1,
      typedCount: 0,
      _visits: [{ visitId: String(Date.now()), visitTime, transition: 'typed' }]
    })
  }, { url, title, visitTime })
}

/** Wait for history collection to finish (isCollecting → false). */
async function waitForCollectionComplete(page: import('@playwright/test').Page) {
  await page.waitForFunction(
    () => {
      const status = (window as any).chrome.storage.local._data.webmunkHistoryStatus
      return status && status.isCollecting === false && status.lastCollectionTime !== undefined
    },
    { timeout: 10_000 }
  )
}

// ---------------------------------------------------------------------------
// Test suites
// ---------------------------------------------------------------------------

test.describe('HistoryServiceWorkerModule — Initialization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-page.html')
    await waitForModuleSetup(page)
  })

  test('setup() writes initial status to storage', async ({ page }) => {
    const status = await page.evaluate(
      () => (window as any).chrome.storage.local._data.webmunkHistoryStatus
    )
    expect(status).toBeTruthy()
    expect(status.isCollecting).toBe(false)
  })

  test('without a server config, configSource is "none"', async ({ page }) => {
    const status = await page.evaluate(
      () => (window as any).chrome.storage.local._data.webmunkHistoryStatus
    )
    expect(status.configSource).toBe('none')
  })

  test('with a server config, configSource is "server"', async ({ page }) => {
    await seedConfigAndIdentifier(page)

    // Fire the storage change listener so the module reacts to the new config.
    await page.evaluate(async () => {
      await window.chrome.storage.local.set(
        (window as any).chrome.storage.local._data
      )
    })

    await page.waitForFunction(
      () =>
        (window as any).chrome.storage.local._data.webmunkHistoryStatus?.configSource === 'server',
      { timeout: 5_000 }
    )

    const status = await page.evaluate(
      () => (window as any).chrome.storage.local._data.webmunkHistoryStatus
    )
    expect(status.configSource).toBe('server')
  })
})

test.describe('HistoryServiceWorkerModule — Alarm Setup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-page.html')
    await waitForModuleSetup(page)
  })

  test('alarm is created after config + identifier are available', async ({ page }) => {
    await seedConfigAndIdentifier(page, { collection_interval_minutes: 30 })

    // Re-set storage to trigger the onChanged listener.
    await page.evaluate(async () => {
      await window.chrome.storage.local.set(
        (window as any).chrome.storage.local._data
      )
    })

    await page.waitForFunction(
      () => !!(window as any).chrome.alarms._alarms['rex-history-collection'],
      { timeout: 5_000 }
    )

    const alarm = await page.evaluate(
      () => (window as any).chrome.alarms._alarms['rex-history-collection']
    )
    expect(alarm).toBeTruthy()
    expect(alarm.periodInMinutes).toBe(30)
  })

  test('no alarm is created when there is no user identifier', async ({ page }) => {
    // Set config but no identifier.
    await page.evaluate(() => {
      window.chrome.storage.local._data.REXConfiguration = {
        history: { collection_interval_minutes: 60, lookback_days: 7 }
      }
    })
    await page.evaluate(async () => {
      await window.chrome.storage.local.set(
        (window as any).chrome.storage.local._data
      )
    })

    // Give the module a moment to react.
    await page.waitForTimeout(300)

    const alarm = await page.evaluate(
      () => (window as any).chrome.alarms._alarms['rex-history-collection']
    )
    expect(alarm).toBeUndefined()
  })
})

test.describe('HistoryServiceWorkerModule — Message Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-page.html')
    await waitForModuleSetup(page)
  })

  test('getHistoryStatus returns the current module status', async ({ page }) => {
    const response = await page.evaluate(
      () => (window as any).__sendMessage({ messageType: 'getHistoryStatus' })
    )
    expect(response).toBeTruthy()
    expect(response.isCollecting).toBe(false)
  })

  test('triggerHistoryCollection returns success (no identifier → resolves cleanly)', async ({ page }) => {
    // Without an identifier the module exits the collection promise chain safely.
    const response = await page.evaluate(
      () => (window as any).__sendMessage({ messageType: 'triggerHistoryCollection' })
    )
    // The module resolves with success once the collect promise chain settles.
    expect(response).toBeTruthy()
    expect(response.success).toBe(true)
  })
})

test.describe('HistoryServiceWorkerModule — URL Filtering (shouldSkipUrl)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-page.html')
    await waitForModuleSetup(page)
    await seedConfigAndIdentifier(page)
    // Trigger config load.
    await page.evaluate(async () => {
      await window.chrome.storage.local.set(
        (window as any).chrome.storage.local._data
      )
    })
    await page.waitForFunction(
      () =>
        (window as any).chrome.storage.local._data.webmunkHistoryStatus?.configSource === 'server',
      { timeout: 5_000 }
    )
  })

  test('non-http(s) URLs are not collected as events', async ({ page }) => {
    const now = Date.now()

    // Add non-HTTP items that should be skipped.
    await page.evaluate((now) => {
      const skipUrls = [
        'file:///Users/test/file.txt',
        'chrome://extensions/',
        'about:blank',
        'ftp://example.com/file.zip'
      ]
      for (const url of skipUrls) {
        window.chrome.history._items.push({
          id: String(Math.random()),
          url,
          title: 'Skip me',
          lastVisitTime: now,
          visitCount: 1,
          typedCount: 0,
          _visits: [{ visitId: String(Math.random()), visitTime: now, transition: 'typed' }]
        })
      }
    }, now)

    // Reset captured events before collection.
    await page.evaluate(() => { (window as any).__capturedEvents = [] })

    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const events = await page.evaluate(
      () => (window as any).__capturedEvents as Record<string, unknown>[]
    )
    // None of the non-http URLs should have produced a rex-history-visit event.
    const visitEvents = events.filter((e) => e.name === 'rex-history-visit')
    expect(visitEvents).toHaveLength(0)
  })

  test('http and https URLs are collected as events', async ({ page }) => {
    const now = Date.now()

    await addHistoryItem(page, 'https://www.example.com', 'Example', now - 1000)
    await addHistoryItem(page, 'http://another.example.org/path', 'Another', now - 2000)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const events = await page.evaluate(
      () =>
        ((window as any).__capturedEvents as Record<string, unknown>[]).filter(
          (e) => e.name === 'rex-history-visit'
        )
    )
    expect(events.length).toBeGreaterThanOrEqual(2)
    const urls = events.map((e) => e.url as string)
    expect(urls).toContain('https://www.example.com')
    expect(urls).toContain('http://another.example.org/path')
  })
})

test.describe('HistoryServiceWorkerModule — Domain-Only List Behavior', () => {
  /** Set up config with allow_lists + domain_only_lists and trigger module reload. */
  async function setupDomainOnlyConfig(
    page: import('@playwright/test').Page,
    overrides: Record<string, unknown> = {}
  ) {
    await seedConfigAndIdentifier(page, {
      allow_lists: ['study-sites'],
      filter_lists: [],
      domain_only_lists: ['domain-only-sites'],
      category_lists: [],
      ...overrides
    })
    await page.evaluate(async () => {
      await window.chrome.storage.local.set(
        (window as any).chrome.storage.local._data
      )
    })
    await page.waitForFunction(
      () =>
        (window as any).chrome.storage.local._data.webmunkHistoryStatus?.configSource === 'server',
      { timeout: 5_000 }
    )
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/test-page.html')
    await waitForModuleSetup(page)
  })

  test('domain-only list URL records as "DOMAIN ONLY" even when not on allow_list', async ({ page }) => {
    const now = Date.now()
    await setupDomainOnlyConfig(page)

    // Populate domain-only list. study-sites has no entries, so facebook.com fails allow_list check.
    await page.evaluate(async () => {
      await (window as any).__listUtils.bulkCreateListEntries([{
        list_name: 'domain-only-sites',
        domain: 'facebook.com',
        pattern_type: 'domain',
        source: 'server',
        metadata: {}
      }])
    })

    await addHistoryItem(page, 'https://www.facebook.com/profile', 'Facebook Profile', now - 500)
    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const events = await page.evaluate(
      () =>
        ((window as any).__capturedEvents as Record<string, unknown>[]).filter(
          (e) => e.name === 'rex-history-visit'
        )
    )
    expect(events.length).toBeGreaterThanOrEqual(1)
    const event = events[0]!
    expect(event.url).toBe('DOMAIN ONLY')
    expect(event.recorded_url).toBe('DOMAIN ONLY')
  })

  test('domain-only list URL preserves domain field', async ({ page }) => {
    const now = Date.now()
    await setupDomainOnlyConfig(page)

    await page.evaluate(async () => {
      await (window as any).__listUtils.bulkCreateListEntries([{
        list_name: 'domain-only-sites',
        domain: 'facebook.com',
        pattern_type: 'domain',
        source: 'server',
        metadata: {}
      }])
    })

    await addHistoryItem(page, 'https://www.facebook.com/profile', 'Facebook Profile', now - 500)
    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const events = await page.evaluate(
      () =>
        ((window as any).__capturedEvents as Record<string, unknown>[]).filter(
          (e) => e.name === 'rex-history-visit'
        )
    )
    expect(events.length).toBeGreaterThanOrEqual(1)
    const event = events[0]!
    expect(event.domain).toBe('facebook.com')
  })

  test('domain-only list URL gets categories populated when also in category list', async ({ page }) => {
    const now = Date.now()
    await setupDomainOnlyConfig(page, { category_lists: ['social-media-categories'] })

    await page.evaluate(async () => {
      await (window as any).__listUtils.bulkCreateListEntries([
        {
          list_name: 'domain-only-sites',
          domain: 'facebook.com',
          pattern_type: 'domain',
          source: 'server',
          metadata: {}
        },
        {
          list_name: 'social-media-categories',
          domain: 'facebook.com',
          pattern_type: 'domain',
          source: 'server',
          metadata: { category: 'social-media' }
        }
      ])
    })

    await addHistoryItem(page, 'https://www.facebook.com/profile', 'Facebook Profile', now - 500)
    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const events = await page.evaluate(
      () =>
        ((window as any).__capturedEvents as Record<string, unknown>[]).filter(
          (e) => e.name === 'rex-history-visit'
        )
    )
    expect(events.length).toBeGreaterThanOrEqual(1)
    const event = events[0]!
    expect(event.url).toBe('DOMAIN ONLY')
    expect(event.domain).toBe('facebook.com')
    expect(Array.isArray(event.categories)).toBe(true)
    expect((event.categories as string[])).toContain('social-media')
  })
})

test.describe('HistoryServiceWorkerModule — Collection & Event Payload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-page.html')
    await waitForModuleSetup(page)
    await seedConfigAndIdentifier(page)
    await page.evaluate(async () => {
      await window.chrome.storage.local.set(
        (window as any).chrome.storage.local._data
      )
    })
    await page.waitForFunction(
      () =>
        (window as any).chrome.storage.local._data.webmunkHistoryStatus?.configSource === 'server',
      { timeout: 5_000 }
    )
  })

  test('collection increments itemsCollected in status', async ({ page }) => {
    const now = Date.now()
    await addHistoryItem(page, 'https://www.example.com', 'Example', now - 1000)

    const before = await page.evaluate(
      () => (window as any).chrome.storage.local._data.webmunkHistoryStatus.itemsCollected as number
    )

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const after = await page.evaluate(
      () => (window as any).chrome.storage.local._data.webmunkHistoryStatus.itemsCollected as number
    )
    expect(after).toBeGreaterThan(before)
  })

  test('dispatched events include expected fields', async ({ page }) => {
    const now = Date.now()
    await addHistoryItem(page, 'https://www.example.com', 'Example Domain', now - 500)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const events = await page.evaluate(
      () =>
        ((window as any).__capturedEvents as Record<string, unknown>[]).filter(
          (e) => e.name === 'rex-history-visit'
        )
    )

    expect(events.length).toBeGreaterThanOrEqual(1)
    const event = events[0]!
    expect(event.name).toBe('rex-history-visit')
    expect(typeof event.url).toBe('string')
    expect(typeof event.domain).toBe('string')
    expect(typeof event.visit_time).toBe('number')
    expect(typeof event.transition_type).toBe('string')
    expect(Array.isArray(event.categories)).toBe(true)
  })

  test('event domain is extracted from URL using psl', async ({ page }) => {
    const now = Date.now()
    await addHistoryItem(page, 'https://mail.example.co.uk/inbox', 'Mail', now - 500)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const events = await page.evaluate(
      () =>
        ((window as any).__capturedEvents as Record<string, unknown>[]).filter(
          (e) => e.name === 'rex-history-visit' && (e.url as string).includes('example.co.uk')
        )
    )

    expect(events.length).toBeGreaterThanOrEqual(1)
    // psl should extract the registered domain, not the full hostname
    expect(events[0]!.domain).toBe('example.co.uk')
  })

  test('collection does not run when no identifier is set', async ({ page }) => {
    // Remove the identifier that seedConfigAndIdentifier set.
    await page.evaluate(() => {
      delete (window as any).chrome.storage.local._data.rexIdentifier
    })

    const now = Date.now()
    await addHistoryItem(page, 'https://www.example.com', 'Example', now - 500)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })

    // Give the module time to react (it should bail out quickly with NO_IDENTIFIER).
    await page.waitForTimeout(500)

    const events = await page.evaluate(
      () =>
        ((window as any).__capturedEvents as Record<string, unknown>[]).filter(
          (e) => e.name === 'rex-history-visit'
        )
    )
    expect(events).toHaveLength(0)
  })
})
