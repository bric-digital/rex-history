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

  test('not_on_allowlist_behavior domain_only records unmatched URLs at domain resolution', async ({ page }) => {
    const now = Date.now()
    await setupAllowConfig(page, { not_on_allowlist_behavior: 'domain_only' })

    await page.evaluate(async () => {
      await (window as any).__listUtils.bulkCreateListEntries([{
        list_name: 'study-sites',
        pattern: 'bbc.com',
        pattern_type: 'domain',
        source: 'server',
        metadata: {}
      }])
    })

    await addHistoryItem(page, 'https://www.example.com/private/page', 'Example', now - 500)
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
    expect(event.title).toBe('DOMAIN ONLY')
    expect(event.domain).toBe('example.com')
  })

  test('filter lists still fully redact unmatched URLs under domain_only behavior', async ({ page }) => {
    const now = Date.now()
    await setupAllowConfig(page, {
      not_on_allowlist_behavior: 'domain_only',
      filter_lists: ['blocked-sites']
    })

    await page.evaluate(async () => {
      await (window as any).__listUtils.bulkCreateListEntries([{
        list_name: 'study-sites',
        pattern: 'bbc.com',
        pattern_type: 'domain',
        source: 'server',
        metadata: {}
      }, {
        list_name: 'blocked-sites',
        pattern: 'private-social.com',
        pattern_type: 'domain',
        source: 'server',
        metadata: { category: 'social' }
      }])
    })

    await addHistoryItem(page, 'https://private-social.com/profile/me', 'My Profile', now - 500)
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
    expect(event.url).toBe('CATEGORY:social')
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

test.describe('HistoryServiceWorkerModule — Windowed collection walk', () => {
  /**
   * The collection walk steps forward through fixed time windows
   * [cursor, cursor+window) bounded by BOTH startTime and endTime, processing
   * visits strictly inside each window before advancing the cursor to the
   * window end. This replaces the old startTime-only, advance-by-max-visit-time
   * walk, whose dependence on chrome.history.search's newest-first ordering
   * meant older visits behind newer ones were never collected and heavy
   * histories never finished within the MV3 worker lifetime.
   */
  async function setupWindowed(
    page: import('@playwright/test').Page,
    overrides: Record<string, unknown> = {}
  ) {
    await page.goto('/test-page.html')
    await waitForModuleSetup(page)
    await seedConfigAndIdentifier(page, overrides)
    await page.evaluate(async () => {
      await window.chrome.storage.local.set((window as any).chrome.storage.local._data)
    })
    await page.waitForFunction(
      () => (window as any).chrome.storage.local._data.webmunkHistoryStatus?.configSource === 'server',
      { timeout: 5_000 }
    )
  }

  /** Settle on isCollecting=false without requiring a completion event. */
  async function waitForSettled(page: import('@playwright/test').Page) {
    await page.waitForFunction(
      () => {
        const s = (window as any).chrome.storage.local._data.webmunkHistoryStatus
        return s && s.isCollecting === false && s.lastCollectionTime !== undefined
      },
      { timeout: 10_000 }
    )
  }

  function visitUrls(page: import('@playwright/test').Page) {
    return page.evaluate(() =>
      ((window as any).__capturedEvents as Record<string, unknown>[])
        .filter((e) => e.name === 'rex-history-visit')
        .map((e) => e.url as string)
    )
  }

  const HOUR = 60 * 60 * 1000
  const DAY = 24 * HOUR

  test('collects visits spread across many windows', async ({ page }) => {
    // lookback 7d, 1h windows → ~168 windows. Seed one visit per day for 6 days;
    // every one must be collected regardless of how many empty windows lie between.
    await setupWindowed(page, { lookback_days: 7, collection_window_hours: 1 })
    const now = Date.now()
    const seeded: string[] = []
    for (let d = 1; d <= 6; d++) {
      const url = `https://day${d}.example.com/`
      seeded.push(url)
      await addHistoryItem(page, url, `Day ${d}`, now - d * DAY + HOUR)
    }

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const urls = await visitUrls(page)
    for (const url of seeded) {
      expect(urls).toContain(url)
    }
  })

  test('old visit behind a newer one is not skipped (backwards-walk regression)', async ({ page }) => {
    // The exact failure: a newest-first page would advance the cursor past the
    // old visit, which then never gets collected. Windowed walk must collect both.
    await setupWindowed(page, { lookback_days: 7, collection_window_hours: 1 })
    const now = Date.now()
    await addHistoryItem(page, 'https://old.example.com/', 'Old', now - 5 * DAY)
    await addHistoryItem(page, 'https://new.example.com/', 'New', now - 1 * HOUR)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const urls = await visitUrls(page)
    expect(urls).toContain('https://old.example.com/')
    expect(urls).toContain('https://new.example.com/')
  })

  test('budget exhaustion emits progress (not complete) and persists a mid-walk cursor', async ({ page }) => {
    // A tiny walk budget forces the cycle to stop before catching up to now.
    // Expect: progress event, NO complete event, cursor advanced but < now.
    await setupWindowed(page, {
      lookback_days: 30,
      collection_window_hours: 1,
      collection_walk_budget_ms: 0 // stop after the first window every cycle
    })
    const now = Date.now()
    // Visit early in the lookback window so the first 1h window has work but
    // there's still far more range to cover before reaching now.
    await addHistoryItem(page, 'https://early.example.com/', 'Early', now - 29 * DAY)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForSettled(page)

    const events = await page.evaluate(() => (window as any).__capturedEvents as Record<string, unknown>[])
    const hasComplete = events.some((e) => e.event_name === 'rex-history-collection-complete')
    const hasProgress = events.some((e) => e.event_name === 'rex-history-collection-progress')
    expect(hasProgress).toBe(true)
    expect(hasComplete).toBe(false)

    const cursor = await page.evaluate(
      () => (window as any).chrome.storage.local._data.webmunkHistoryLastFetch as number
    )
    expect(cursor).toBeGreaterThan(now - 30 * DAY)
    expect(cursor).toBeLessThan(now)
  })

  test('resumes from a persisted cursor after a cold worker start (adversarial MV3)', async ({ page }) => {
    // Persist a mid-history cursor as a suspended-then-restarted worker would
    // have left it. A fresh cycle must resume from there, not re-walk lookback.
    await setupWindowed(page, { lookback_days: 30, collection_window_hours: 1 })
    const now = Date.now()
    const resumeFrom = now - 2 * HOUR
    await page.evaluate(async (resumeFrom) => {
      const data = (window as any).chrome.storage.local._data
      data.webmunkHistoryLastFetch = resumeFrom
      await window.chrome.storage.local.set(data)
    }, resumeFrom)

    // One visit BEFORE the resume cursor (must be skipped — already collected)
    // and one AFTER (must be collected on resume).
    await addHistoryItem(page, 'https://already.example.com/', 'Already', now - 10 * DAY)
    await addHistoryItem(page, 'https://fresh.example.com/', 'Fresh', now - 1 * HOUR)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const urls = await visitUrls(page)
    expect(urls).toContain('https://fresh.example.com/')
    expect(urls).not.toContain('https://already.example.com/')
  })

  test('fires collection-complete exactly once when caught up to now', async ({ page }) => {
    await setupWindowed(page, { lookback_days: 7, collection_window_hours: 1 })
    const now = Date.now()
    await addHistoryItem(page, 'https://x.example.com/', 'X', now - 2 * HOUR)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const completes = await page.evaluate(() =>
      ((window as any).__capturedEvents as Record<string, unknown>[])
        .filter((e) => e.event_name === 'rex-history-collection-complete')
    )
    expect(completes.length).toBe(1)

    const cursor = await page.evaluate(
      () => (window as any).chrome.storage.local._data.webmunkHistoryLastFetch as number
    )
    // Cursor reaches ~now (within a window of it).
    expect(cursor).toBeGreaterThanOrEqual(now - HOUR)
  })

  test('eager trigger backfills a large range to completion via re-armed alarms', async ({ page }) => {
    // triggerHistoryCollection (offboarding path) must finish even when each
    // wake's budget covers only part of the range, by re-arming an immediate
    // alarm. We simulate the re-arm by re-firing the alarm whenever an eager
    // cycle settles without completing, then assert completion is reached.
    await setupWindowed(page, {
      lookback_days: 10,
      collection_window_hours: 24,
      collection_walk_budget_ms: 0 // one window per wake → forces multiple wakes
    })
    const now = Date.now()
    await addHistoryItem(page, 'https://b1.example.com/', 'B1', now - 9 * DAY)
    await addHistoryItem(page, 'https://b2.example.com/', 'B2', now - 5 * DAY)
    await addHistoryItem(page, 'https://b3.example.com/', 'B3', now - 1 * DAY)

    const completed = await page.evaluate(async () => {
      ;(window as any).__capturedEvents = []
      const plugin = (window as any).__historyPlugin
      // Eager backfill, then keep re-firing while it re-arms (mimics the
      // immediate alarm the implementation schedules between eager wakes).
      for (let i = 0; i < 30; i++) {
        await plugin.collectHistory(true) // eager = true
        const done = ((window as any).__capturedEvents as Record<string, unknown>[])
          .some((e) => e.event_name === 'rex-history-collection-complete')
        if (done) return true
      }
      return false
    })
    expect(completed).toBe(true)

    const urls = await visitUrls(page)
    expect(urls).toEqual(expect.arrayContaining([
      'https://b1.example.com/', 'https://b2.example.com/', 'https://b3.example.com/'
    ]))
  })

  test('first-run seed is lookback_days BEFORE install time', async ({ page }) => {
    // Install was 2 days ago; lookback is 5 days → seed = 7 days before now.
    // A visit 10 days ago (before the seed) must NOT be collected; a visit
    // 4 days ago (after the seed, i.e. within the lookback window leading up to
    // install) MUST be collected even though it predates install.
    const now = Date.now()
    await page.goto('/test-page.html')
    await waitForModuleSetup(page)
    await page.evaluate((installTime) => {
      ;(window as any).__mockInstallTime = installTime
    }, now - 2 * DAY)
    await seedConfigAndIdentifier(page, { lookback_days: 5, collection_window_hours: 24 })
    await page.evaluate(async () => {
      await window.chrome.storage.local.set((window as any).chrome.storage.local._data)
    })
    await page.waitForFunction(
      () => (window as any).chrome.storage.local._data.webmunkHistoryStatus?.configSource === 'server',
      { timeout: 5_000 }
    )

    // Seed = install(−2d) − lookback(5d) = −7d from now.
    await addHistoryItem(page, 'https://beforeseed.example.com/', 'BeforeSeed', now - 10 * DAY)
    await addHistoryItem(page, 'https://withinwindow.example.com/', 'WithinWindow', now - 4 * DAY)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const urls = await visitUrls(page)
    expect(urls).toContain('https://withinwindow.example.com/')
    expect(urls).not.toContain('https://beforeseed.example.com/')
  })

  test('first-run seed falls back to lookback when install time is null', async ({ page }) => {
    const now = Date.now()
    await page.goto('/test-page.html')
    await waitForModuleSetup(page)
    await page.evaluate(() => { (window as any).__mockInstallTime = null })
    await seedConfigAndIdentifier(page, { lookback_days: 7, collection_window_hours: 24 })
    await page.evaluate(async () => {
      await window.chrome.storage.local.set((window as any).chrome.storage.local._data)
    })
    await page.waitForFunction(
      () => (window as any).chrome.storage.local._data.webmunkHistoryStatus?.configSource === 'server',
      { timeout: 5_000 }
    )

    // Within the 7-day lookback → collected even though no install time exists.
    await addHistoryItem(page, 'https://within.example.com/', 'Within', now - 3 * DAY)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const urls = await visitUrls(page)
    expect(urls).toContain('https://within.example.com/')
  })

  test('heavy window overflow emits a diagnostic and the cursor still advances', async ({ page }) => {
    // More than collection_page_size visits inside a single minute: window
    // splitting bottoms out at the 1-minute floor, so the walk collects the
    // page best-effort, emits rex-history-window-overflow, advances past it,
    // and still completes (never wedges).
    await setupWindowed(page, {
      lookback_days: 1,
      collection_window_hours: 1,
      collection_page_size: 2
    })
    const now = Date.now()
    const minuteStart = now - 30 * 60 * 1000
    // 4 visits inside the same minute (> page size 2).
    for (let i = 0; i < 4; i++) {
      await addHistoryItem(page, `https://hot${i}.example.com/`, `Hot ${i}`, minuteStart + i * 1000)
    }

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const overflow = await page.evaluate(() =>
      ((window as any).__capturedEvents as Record<string, unknown>[])
        .filter((e) => e.event_name === 'rex-history-window-overflow')
    )
    expect(overflow.length).toBeGreaterThanOrEqual(1)
    expect(overflow[0]!.name).toBe('pdk-app-event')

    // The walk must reach now despite the hot minute.
    const cursor = await page.evaluate(
      () => (window as any).chrome.storage.local._data.webmunkHistoryLastFetch as number
    )
    expect(cursor).toBeGreaterThanOrEqual(now - HOUR)
  })

  test('recovers from a worker killed mid-overflow (adversarial MV3 overflow crash)', async ({ page }) => {
    // Simulate the doomsday minute: the previous worker wrote the durable overflow
    // marker, started the uncapped fetch+process, and was KILLED before clearing
    // it (the uncapped batch on a pathological same-timestamp dump exceeds the MV3
    // ~5-min worker lifetime). The cursor is still parked at the poison window's
    // start, so a naive resume would re-hit and re-crash it forever. A cold worker
    // start must instead skip the window, emit a server-visible stuck diagnostic,
    // and clear the marker.
    await setupWindowed(page, { lookback_days: 1, collection_window_hours: 1 })
    const now = Date.now()
    const windowStart = now - 30 * 60 * 1000
    const windowEnd = windowStart + 60 * 1000 // 1-minute floor window

    const result = await page.evaluate(async ({ windowStart, windowEnd }) => {
      const data = (window as any).chrome.storage.local._data
      // Stranded marker + cursor parked at the poison window, as the killed
      // worker would have left them.
      data.webmunkHistoryOverflowMarker = { windowStart, windowEnd, itemCount: 50000, attemptedAt: Date.now() }
      data.webmunkHistoryLastFetch = windowStart
      await window.chrome.storage.local.set(data)
      ;(window as any).__capturedEvents = []

      // Cold worker start.
      await (window as any).__historyPlugin.loadStatus()

      return {
        cursor: data.webmunkHistoryLastFetch as number,
        markerStillPresent: 'webmunkHistoryOverflowMarker' in data,
        stuck: ((window as any).__capturedEvents as Record<string, unknown>[])
          .filter((e) => e.event_name === 'rex-history-overflow-stuck')
      }
    }, { windowStart, windowEnd })

    // Cursor jumped PAST the poison window so the resumed walk won't re-hit it.
    expect(result.cursor).toBe(windowEnd)
    // The marker self-cleared.
    expect(result.markerStillPresent).toBe(false)
    // A server-visible diagnostic fired (this is the signal that survives the crash).
    expect(result.stuck.length).toBe(1)
    expect(result.stuck[0]!.name).toBe('pdk-app-event')
  })

  test('a clean run with no overflow marker does not move the cursor on worker start', async ({ page }) => {
    // Guard against false positives: loadStatus() must NOT skip anything when no
    // overflow marker is present.
    await setupWindowed(page, { lookback_days: 1, collection_window_hours: 1 })
    const now = Date.now()
    const parked = now - 2 * HOUR

    const result = await page.evaluate(async (parked) => {
      const data = (window as any).chrome.storage.local._data
      delete data.webmunkHistoryOverflowMarker
      data.webmunkHistoryLastFetch = parked
      await window.chrome.storage.local.set(data)
      ;(window as any).__capturedEvents = []
      await (window as any).__historyPlugin.loadStatus()
      return {
        cursor: data.webmunkHistoryLastFetch as number,
        stuck: ((window as any).__capturedEvents as Record<string, unknown>[])
          .filter((e) => e.event_name === 'rex-history-overflow-stuck').length
      }
    }, parked)

    expect(result.cursor).toBe(parked)
    expect(result.stuck).toBe(0)
  })
})

test.describe('HistoryServiceWorkerModule — Cursor non-advance at same-timestamp boundary', () => {
  /**
   * Reproduces the 1.3.10 field wedge: a timestamp cluster shared by more than
   * `collection_page_size` history items. The old startTime-only walk froze
   * here forever (page never advanced maxVisitTime). The windowed walk handles
   * it structurally: a window returning a full page is split toward the
   * 1-minute floor, and a cluster that still overflows the floor is collected
   * best-effort while the cursor advances past it (window-overflow escape
   * hatch). Either way the cursor moves and a newer visit behind the cluster is
   * collected — which is what this test asserts (mechanism-independent).
   */
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-page.html')
    await waitForModuleSetup(page)
    // Page size of 2 makes a 3-item same-timestamp cluster overflow one page.
    await seedConfigAndIdentifier(page, { collection_page_size: 2 })
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

  test('cursor advances past a same-timestamp cluster larger than the page', async ({ page }) => {
    const boundary = Date.now() - 100_000

    // Pre-seed the durable cursor exactly at the boundary, as a prior cycle
    // would have left it after collecting visits at `boundary`.
    await page.evaluate(async (boundary) => {
      const data = (window as any).chrome.storage.local._data
      data.webmunkHistoryLastFetch = boundary
      await window.chrome.storage.local.set(data)
    }, boundary)

    // Three items all visited at exactly `boundary` — one page (size 2) cannot
    // hold them, and none advance maxVisitTime since their time == cursor.
    await addHistoryItem(page, 'https://a.example.com', 'A', boundary)
    await addHistoryItem(page, 'https://b.example.com', 'B', boundary)
    await addHistoryItem(page, 'https://c.example.com', 'C', boundary)
    // A genuinely newer visit that sits behind the boundary cluster. A wedged
    // cursor never reaches it; a healed cursor must collect it.
    await addHistoryItem(page, 'https://newer.example.com', 'Newer', boundary + 5_000)

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    const cursorAfter = await page.evaluate(
      () => (window as any).chrome.storage.local._data.webmunkHistoryLastFetch as number
    )
    // Wedge: cursor stays == boundary. Fixed: it moves past the cluster.
    expect(cursorAfter).toBeGreaterThan(boundary)

    const visitUrls = await page.evaluate(
      () =>
        ((window as any).__capturedEvents as Record<string, unknown>[])
          .filter((e) => e.name === 'rex-history-visit')
          .map((e) => e.url as string)
    )
    // The newer visit behind the cluster must be collected once the cursor clears.
    expect(visitUrls).toContain('https://newer.example.com')
  })
})

test.describe('HistoryServiceWorkerModule — Cursor write failure diagnostic', () => {
  /**
   * When chrome.storage.local is full, setLastFetchTime's write silently fails
   * (it only logged the error). A stalled cursor then looks identical to a
   * healthy one from the backend's side: visits stop, no completion event, and
   * nothing says WHY. This makes a quota-stalled participant invisible.
   *
   * Contract: a failed cursor write must (1) not throw — collection must not
   * abort — and (2) emit a privacy-safe rex-history-cursor-write-failed
   * diagnostic so the backend can see the stall and its cause.
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

  test('a failed cursor write emits a diagnostic and does not throw', async ({ page }) => {
    const result = await page.evaluate(async () => {
      ;(window as any).__capturedEvents = []
      // Arm the storage mock to reject writes to the cursor key (simulated quota).
      ;(window as any).chrome.storage.local.__failSetFor = ['webmunkHistoryLastFetch']
      let threw = false
      try {
        await (window as any).__historyPlugin.setLastFetchTime(Date.now())
      } catch {
        threw = true
      }
      ;(window as any).chrome.storage.local.__failSetFor = undefined
      return { threw }
    })

    // (1) The write failure must not propagate — collection must survive it.
    expect(result.threw).toBe(false)

    // (2) A diagnostic must have been emitted so the backend can see the stall.
    const diagnostics = await page.evaluate(
      () =>
        ((window as any).__capturedEvents as Record<string, unknown>[])
          .filter((e) => e.event_name === 'rex-history-cursor-write-failed')
    )
    expect(diagnostics.length).toBeGreaterThanOrEqual(1)
    const d = diagnostics[0]!
    expect(d.name).toBe('pdk-app-event')
    const details = d.event_details as Record<string, unknown>
    expect(typeof details.error_name).toBe('string')
    expect(typeof details.error_message).toBe('string')
    expect(typeof details.attempted_cursor).toBe('number')
  })
})

test.describe('HistoryServiceWorkerModule — resetHistoryCollection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-page.html')
    await waitForModuleSetup(page)
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
  })

  test('reset waits out an in-flight collection instead of silently skipping', async ({ page }) => {
    const now = Date.now()
    await addHistoryItem(page, 'https://www.example.com/waited', 'Waited', now - 1000)

    // Simulate a collection in flight, then release it shortly after.
    await page.evaluate(() => {
      const plugin = (window as any).__historyPlugin
      plugin.status.isCollecting = true
      setTimeout(() => { plugin.status.isCollecting = false }, 700)
    })

    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    const reset = await page.evaluate(
      () => (window as any).__sendMessage({ messageType: 'resetHistoryCollection' })
    )
    expect(reset.success).toBe(true)

    const events = await page.evaluate(
      () => ((window as any).__capturedEvents as Record<string, unknown>[]).filter((e) => e.name === 'rex-history-visit')
    )
    expect(events.length).toBe(1)
  })

  test('reset rewinds the walk cursor so already-collected visits are re-emitted', async ({ page }) => {
    const now = Date.now()
    await addHistoryItem(page, 'https://www.example.com/revisit', 'Revisit', now - 1000)

    // First pass collects the visit and advances the cursor to "now".
    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    await page.evaluate(() => { window.triggerAlarm('rex-history-collection') })
    await waitForCollectionComplete(page)

    let events = await page.evaluate(
      () => ((window as any).__capturedEvents as Record<string, unknown>[]).filter((e) => e.name === 'rex-history-visit')
    )
    expect(events.length).toBe(1)

    // A second ordinary trigger finds nothing new: the cursor has passed the visit.
    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    const trigger = await page.evaluate(
      () => (window as any).__sendMessage({ messageType: 'triggerHistoryCollection' })
    )
    expect(trigger.success).toBe(true)
    events = await page.evaluate(
      () => ((window as any).__capturedEvents as Record<string, unknown>[]).filter((e) => e.name === 'rex-history-visit')
    )
    expect(events.length).toBe(0)

    // Reset rewinds the cursor and re-collects the same visit.
    await page.evaluate(() => { (window as any).__capturedEvents = [] })
    const reset = await page.evaluate(
      () => (window as any).__sendMessage({ messageType: 'resetHistoryCollection' })
    )
    expect(reset.success).toBe(true)
    events = await page.evaluate(
      () => ((window as any).__capturedEvents as Record<string, unknown>[]).filter((e) => e.name === 'rex-history-visit')
    )
    expect(events.length).toBe(1)
  })
})
