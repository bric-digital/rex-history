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
    ;(window as any).chrome.storage.local._data.rexIdentifier = 'test-participant-001'
    ;(window as any).chrome.storage.local._data.REXConfiguration = {
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
    ;(window as any).chrome.history._items.push({
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
      ;(window as any).chrome.storage.local._data.REXConfiguration = {
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
        ;(window as any).chrome.history._items.push({
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
        pattern: 'facebook.com',
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
        pattern: 'facebook.com',
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
          pattern: 'facebook.com',
          pattern_type: 'domain',
          source: 'server',
          metadata: {}
        },
        {
          list_name: 'social-media-categories',
          pattern: 'facebook.com',
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

test.describe('HistoryServiceWorkerModule — Filter Lists', () => {
  async function setupFilterConfig(
    page: import('@playwright/test').Page,
    overrides: Record<string, unknown> = {}
  ) {
    await seedConfigAndIdentifier(page, {
      filter_lists: ['sensitive-sites'],
      allow_lists: [],
      category_lists: [],
      domain_only_lists: [],
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

  test('URL matching a filter list records as CATEGORY:<category>', async ({ page }) => {
    const now = Date.now()
    await setupFilterConfig(page)

    await page.evaluate(async () => {
      await (window as any).__listUtils.bulkCreateListEntries([{
        list_name: 'sensitive-sites',
        pattern: 'reddit.com',
        pattern_type: 'domain',
        source: 'server',
        metadata: { category: 'social-media' }
      }])
    })

    await addHistoryItem(page, 'https://www.reddit.com/r/news', 'Reddit News', now - 500)
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
    expect(event.url).toBe('CATEGORY:social-media')
    expect(event.recorded_url).toBe('CATEGORY:social-media')
  })

  test('filtered URL has domain and title cleared', async ({ page }) => {
    const now = Date.now()
    await setupFilterConfig(page)

    await page.evaluate(async () => {
      await (window as any).__listUtils.bulkCreateListEntries([{
        list_name: 'sensitive-sites',
        pattern: 'reddit.com',
        pattern_type: 'domain',
        source: 'server',
        metadata: { category: 'social-media' }
      }])
    })

    await addHistoryItem(page, 'https://www.reddit.com/r/news', 'Reddit News', now - 500)
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
    expect(event.domain).toBe('')
    expect(event.title).toBe('')
  })

  test('URL not matching any filter list passes through unmodified', async ({ page }) => {
    const now = Date.now()
    await setupFilterConfig(page)

    await page.evaluate(async () => {
      await (window as any).__listUtils.bulkCreateListEntries([{
        list_name: 'sensitive-sites',
        pattern: 'reddit.com',
        pattern_type: 'domain',
        source: 'server',
        metadata: { category: 'social-media' }
      }])
    })

    await addHistoryItem(page, 'https://www.example.com/page', 'Example', now - 500)
    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const events = await page.evaluate(
      () =>
        ((window as any).__capturedEvents as Record<string, unknown>[]).filter(
          (e) => e.name === 'rex-history-visit' && (e.url as string).includes('example.com')
        )
    )
    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(events[0]!.url).toBe('https://www.example.com/page')
    expect(events[0]!.domain).toBe('example.com')
  })

  test('filter list entry with no category metadata records as CATEGORY:null', async ({ page }) => {
    const now = Date.now()
    await setupFilterConfig(page)

    await page.evaluate(async () => {
      await (window as any).__listUtils.bulkCreateListEntries([{
        list_name: 'sensitive-sites',
        pattern: 'example.com',
        pattern_type: 'domain',
        source: 'server',
        metadata: {}
      }])
    })

    await addHistoryItem(page, 'https://www.example.com/page', 'Example', now - 500)
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
    expect(events[0]!.url).toBe('CATEGORY:null')
  })
})

test.describe('HistoryServiceWorkerModule — Allow Lists', () => {
  async function setupAllowConfig(
    page: import('@playwright/test').Page,
    overrides: Record<string, unknown> = {}
  ) {
    await seedConfigAndIdentifier(page, {
      allow_lists: ['study-sites'],
      filter_lists: [],
      category_lists: [],
      domain_only_lists: [],
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

  test('URL on allow list is collected with full URL', async ({ page }) => {
    const now = Date.now()
    await setupAllowConfig(page)

    await page.evaluate(async () => {
      await (window as any).__listUtils.bulkCreateListEntries([{
        list_name: 'study-sites',
        pattern: 'bbc.com',
        pattern_type: 'domain',
        source: 'server',
        metadata: {}
      }])
    })

    await addHistoryItem(page, 'https://www.bbc.com/news/article', 'BBC News', now - 500)
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
    expect(events[0]!.url).toBe('https://www.bbc.com/news/article')
  })

  test('URL not on allow list records as CATEGORY:NOT_ON_ALLOWLIST', async ({ page }) => {
    const now = Date.now()
    await setupAllowConfig(page)

    await page.evaluate(async () => {
      await (window as any).__listUtils.bulkCreateListEntries([{
        list_name: 'study-sites',
        pattern: 'bbc.com',
        pattern_type: 'domain',
        source: 'server',
        metadata: {}
      }])
    })

    await addHistoryItem(page, 'https://www.example.com/page', 'Example', now - 500)
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
    expect(event.url).toBe('CATEGORY:NOT_ON_ALLOWLIST')
    expect(event.domain).toBe('')
    expect(event.title).toBe('')
  })

  test('no allow list configured collects all URLs', async ({ page }) => {
    const now = Date.now()
    // No allow_lists = allow everything
    await seedConfigAndIdentifier(page, {
      allow_lists: [],
      filter_lists: [],
      category_lists: [],
      domain_only_lists: []
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

    await addHistoryItem(page, 'https://www.random-site.com/', 'Random', now - 500)
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
    expect(events[0]!.url).toBe('https://www.random-site.com/')
  })
})

test.describe('HistoryServiceWorkerModule — getOldestHistoryAge Message', () => {
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

  test('returns null ageSeconds when history is empty', async ({ page }) => {
    // Ensure history is empty
    await page.evaluate(() => { (window as any).chrome.history._items = [] })

    const response = await page.evaluate(
      () => (window as any).__sendMessage({ messageType: 'getOldestHistoryAge' })
    )
    expect(response).toBeTruthy()
    expect(response.ageSeconds).toBeNull()
  })

  test('returns ageSeconds as a number when history items exist', async ({ page }) => {
    const now = Date.now()
    const oldTime = now - 5 * 24 * 60 * 60 * 1000 // 5 days ago

    await page.evaluate(() => { (window as any).chrome.history._items = [] })
    await addHistoryItem(page, 'https://www.example.com', 'Example', oldTime)

    const response = await page.evaluate(
      () => (window as any).__sendMessage({ messageType: 'getOldestHistoryAge' })
    )
    expect(response).toBeTruthy()
    expect(typeof response.ageSeconds).toBe('number')
    // Should be approximately 5 days in seconds, give 60s tolerance
    expect(response.ageSeconds).toBeGreaterThan(5 * 24 * 60 * 60 - 60)
    expect(response.ageSeconds).toBeLessThan(5 * 24 * 60 * 60 + 60)
  })

  test('returns age of the oldest item when multiple items exist', async ({ page }) => {
    const now = Date.now()
    await page.evaluate(() => { (window as any).chrome.history._items = [] })

    // Add items at different ages; oldest is 10 days ago
    await addHistoryItem(page, 'https://www.recent.com', 'Recent', now - 1 * 24 * 60 * 60 * 1000)
    await addHistoryItem(page, 'https://www.oldest.com', 'Oldest', now - 10 * 24 * 60 * 60 * 1000)
    await addHistoryItem(page, 'https://www.middle.com', 'Middle', now - 5 * 24 * 60 * 60 * 1000)

    const response = await page.evaluate(
      () => (window as any).__sendMessage({ messageType: 'getOldestHistoryAge' })
    )
    expect(typeof response.ageSeconds).toBe('number')
    // Must be at least 10 days
    expect(response.ageSeconds).toBeGreaterThan(10 * 24 * 60 * 60 - 60)
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

  test('second collection cycle captures visits added after the first cycle', async ({ page }) => {
    // Add a history item and run the first collection cycle.
    const t1 = Date.now() - 2000
    await addHistoryItem(page, 'https://www.first.com', 'First', t1)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const firstCycleEvents = await page.evaluate(
      () =>
        ((window as any).__capturedEvents as Record<string, unknown>[]).filter(
          (e) => e.name === 'rex-history-visit'
        )
    )
    const firstUrls = firstCycleEvents.map((e) => e.url)
    expect(firstUrls).toContain('https://www.first.com')

    // Add a second history item AFTER the first cycle completed, then run a
    // second cycle. The cursor must not have jumped past this visit.
    const t2 = Date.now()
    await addHistoryItem(page, 'https://www.second.com', 'Second', t2)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const secondCycleEvents = await page.evaluate(
      () =>
        ((window as any).__capturedEvents as Record<string, unknown>[]).filter(
          (e) => e.name === 'rex-history-visit'
        )
    )
    const secondUrls = secondCycleEvents.map((e) => e.url)
    expect(secondUrls).toContain('https://www.second.com')
  })
})

test.describe('HistoryServiceWorkerModule — Bad-Record Resilience', () => {
  /**
   * Wait until a collection cycle has settled (isCollecting back to false).
   * Unlike waitForCollectionComplete, this does NOT require lastCollectionTime,
   * so it still returns when a cycle aborts early — exactly the case under test.
   */
  async function waitForCollectionSettled(page: import('@playwright/test').Page) {
    // Let the alarm handler flip isCollecting to true first, then wait for false.
    await page.waitForFunction(
      () => {
        const status = (window as any).chrome.storage.local._data.webmunkHistoryStatus
        return status && status.isCollecting === false
      },
      { timeout: 10_000 }
    )
  }

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

  test('a record whose getVisits throws does not stop the rest of the batch', async ({ page }) => {
    const now = Date.now()

    // Three items. The middle one is "poison": getVisits rejects for its URL,
    // mimicking a pathological record in a participant's history. Items before
    // AND after it must still be collected, and the completion event must fire.
    await addHistoryItem(page, 'https://www.before.com', 'Before', now - 3000)
    await addHistoryItem(page, 'https://www.poison.com', 'Poison', now - 2000)
    await addHistoryItem(page, 'https://www.after.com', 'After', now - 1000)

    // Make getVisits throw only for the poison URL, leaving others intact.
    await page.evaluate(() => {
      const history = (window as any).chrome.history
      const originalGetVisits = history.getVisits
      history.getVisits = async ({ url }: { url: string }) => {
        if (url === 'https://www.poison.com') {
          throw new Error('simulated chrome.history.getVisits failure')
        }
        return originalGetVisits({ url })
      }
    })

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionSettled(page)

    const events = await page.evaluate(
      () => (window as any).__capturedEvents as Record<string, unknown>[]
    )

    const visitUrls = events
      .filter((e) => e.name === 'rex-history-visit')
      .map((e) => e.url as string)

    // The good records on either side of the poison record must survive.
    expect(visitUrls).toContain('https://www.before.com')
    expect(visitUrls).toContain('https://www.after.com')

    // The completion event must still be dispatched so downstream consumers
    // (offboarding, researcher dashboards) know history collection finished.
    const completed = events.some(
      (e) => e.event_name === 'rex-history-collection-complete'
    )
    expect(completed).toBe(true)
  })

  test('a skipped record emits a privacy-safe rex-history-skipped diagnostic event', async ({ page }) => {
    const now = Date.now()

    await addHistoryItem(page, 'https://www.poison.com/secret-path?token=abc', 'Sensitive Title', now - 2000)

    await page.evaluate(() => {
      const history = (window as any).chrome.history
      const originalGetVisits = history.getVisits
      history.getVisits = async ({ url }: { url: string }) => {
        if (url.startsWith('https://www.poison.com')) {
          throw new Error('simulated chrome.history.getVisits failure')
        }
        return originalGetVisits({ url })
      }
    })

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionSettled(page)

    const events = await page.evaluate(
      () => (window as any).__capturedEvents as Record<string, unknown>[]
    )

    // Emitted in the pdk-app-event family (no new data type for the backend).
    const skipped = events.find(
      (e) => e.name === 'pdk-app-event' && e.event_name === 'rex-history-skipped'
    )
    expect(skipped).toBeTruthy()

    const details = skipped!.event_details as Record<string, unknown>

    // Researcher-useful, privacy-safe diagnostic fields.
    expect(details.domain).toBe('poison.com')
    expect(details.failed_step).toBe('getVisits')
    expect(typeof details.error_name).toBe('string')
    expect(typeof details.error_message).toBe('string')
    expect(details.url_length).toBe('https://www.poison.com/secret-path?token=abc'.length)
    expect(details.hostname_length).toBe('www.poison.com'.length)
    expect(details.title_length).toBe('Sensitive Title'.length)
    expect(details.scheme).toBe('https:')
    expect(details.has_query).toBe(true)
    expect(details.history_item_id).toBeTruthy()

    // Privacy: the raw URL and title must NEVER appear in the diagnostic.
    const serialized = JSON.stringify(skipped)
    expect(serialized).not.toContain('secret-path')
    expect(serialized).not.toContain('token=abc')
    expect(serialized).not.toContain('Sensitive Title')
  })
})

test.describe('HistoryServiceWorkerModule — Stranded isCollecting flag (Defect D)', () => {
  /**
   * Reproduces the permanent wedge: in MV3 the service worker can be suspended
   * mid-collection, after collectHistory() has set isCollecting and persisted it
   * but before the .finally() that resets it. On the next worker start,
   * loadStatus() reads the stranded `true` back from storage, and the guard at
   * the top of collectHistory() then skips every future collection forever.
   *
   * The fix: isCollecting is in-memory concurrency state for a single worker
   * lifetime and must never block a fresh worker. A restart must always start
   * collectable, regardless of what is in storage.
   */
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

  test('a worker restart with a stranded isCollecting:true still collects', async ({ page }) => {
    const now = Date.now()
    await addHistoryItem(page, 'https://www.example.com', 'Example', now - 1000)

    // Simulate the post-suspension state: storage carries isCollecting:true that
    // the previous (killed) worker never got to reset. Then re-run loadStatus()
    // to mimic a fresh worker reading that state on start.
    await page.evaluate(async () => {
      const data = (window as any).chrome.storage.local._data
      data.webmunkHistoryStatus = { ...data.webmunkHistoryStatus, isCollecting: true }
      await window.chrome.storage.local.set(data)
      // Mirror what setup() does on a worker restart.
      await (window as any).__historyPlugin.loadStatus()
    })

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const events = await page.evaluate(
      () => (window as any).__capturedEvents as Record<string, unknown>[]
    )
    const visitUrls = events
      .filter((e) => e.name === 'rex-history-visit')
      .map((e) => e.url as string)

    // If the stranded flag still wedged the worker, no visit would ever be
    // collected and this would be empty.
    expect(visitUrls).toContain('https://www.example.com')
  })

  test('loadStatus() clears a stranded isCollecting on worker start', async ({ page }) => {
    // The self-heal contract: a worker reading a stranded `true` from storage
    // must come up with isCollecting false, so the guard in collectHistory()
    // does not skip every future cycle. This is what unwedges participants who
    // were suspended mid-cycle on a previous build.
    const collectingAfterLoad = await page.evaluate(async () => {
      const data = (window as any).chrome.storage.local._data
      data.webmunkHistoryStatus = { ...data.webmunkHistoryStatus, isCollecting: true }
      await window.chrome.storage.local.set(data)

      const plugin = (window as any).__historyPlugin
      await plugin.loadStatus()
      return plugin.status.isCollecting as boolean
    })

    expect(collectingAfterLoad).toBe(false)
  })
})
