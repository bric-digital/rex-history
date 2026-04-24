import { test, expect, Page } from '@playwright/test'

/**
 * Verifies the optional linkage from rex-history to rex-page-events via the
 * globalThis.__rexPageEventsUrlActive seam.
 *
 * `?urlActive=on` on the test page installs a mock seam BEFORE the shim bundle
 * loads, so rex-history's setup() subscribes. Without the flag, the seam is
 * absent and no linkage happens — proving optional degradation.
 */

async function waitForModuleSetup(page: Page) {
  await page.waitForFunction(() => (window as any).__historyShimLoaded === true)
  await page.waitForFunction(
    () => (window as any).chrome.storage.local._data.webmunkHistoryStatus !== undefined
  )
}

async function seedConfigAndIdentifier(page: Page, overrides: Record<string, unknown> = {}) {
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
        ...overrides,
      },
    }
    ;(window as any).chrome.storage.local.set({
      rexIdentifier: 'test-participant-001',
      REXConfiguration: (window as any).chrome.storage.local._data.REXConfiguration,
    })
  }, overrides)
  // Give the storage.onChanged listener a beat to react.
  await page.waitForTimeout(100)
}

async function addHistoryItem(page: Page, url: string, title: string, visitTime: number) {
  await page.evaluate(({ url, title, visitTime }) => {
    ;(window as any).chrome.history._items.push({
      id: String(Date.now() + Math.random()),
      url,
      title,
      lastVisitTime: visitTime,
      visitCount: 1,
      typedCount: 0,
      _visits: [{ visitId: String(Date.now()), visitTime, transition: 'typed' }],
    })
  }, { url, title, visitTime })
}

async function waitForCollectionComplete(page: Page) {
  await page.waitForFunction(
    () => {
      const s = (window as any).chrome.storage.local._data.webmunkHistoryStatus
      return s && s.isCollecting === false && s.lastCollectionTime !== undefined
    },
    { timeout: 10_000 }
  )
}

async function dispatchedVisits(page: Page, urlContains?: string): Promise<any[]> {
  return page.evaluate((needle) => {
    const events = ((window as any).__capturedEvents as Record<string, unknown>[]) ?? []
    return events.filter(
      (e) =>
        e.name === 'rex-history-visit' &&
        (!needle || (typeof e.url === 'string' && (e.url as string).includes(needle)))
    )
  }, urlContains ?? null)
}

async function triggerCollection(page: Page) {
  await page.evaluate(() => { (window as any).__capturedEvents = [] })
  await page.evaluate(() => { (window as any).triggerAlarm('rex-history-collection') })
  await waitForCollectionComplete(page)
}

test.describe('rex-history linkage to rex-page-events (optional)', () => {
  test('NO seam installed: visits go out without tab/session linkage fields', async ({ page }) => {
    // Load WITHOUT the urlActive flag → seam absent.
    await page.goto('/test-page.html')
    await waitForModuleSetup(page)
    await seedConfigAndIdentifier(page)

    const url = 'https://linkless.example/'
    await addHistoryItem(page, url, 'Linkless', Date.now() - 500)
    await triggerCollection(page)

    const visits = await dispatchedVisits(page, 'linkless.example')
    expect(visits.length).toBeGreaterThanOrEqual(1)
    const v = visits[0]
    expect(v.tab_id).toBeUndefined()
    expect(v.window_id).toBeUndefined()
    expect(v.session_id).toBeUndefined()
    expect(v.page_events_url_shown_at).toBeUndefined()
  })

  test('seam installed + matching url_active: visit carries tab_id, window_id, session_id, page_events_url_shown_at', async ({ page }) => {
    await page.goto('/test-page.html?urlActive=on')
    await waitForModuleSetup(page)
    await seedConfigAndIdentifier(page)

    const visitTime = Date.now() - 500
    const url = 'https://matched.example/article'
    const urlShownAt = visitTime + 100 // within default 5000ms tolerance

    // Push an url-active record INTO the buffer via the mock seam.
    await page.evaluate(({ url, urlShownAt }) => {
      ;(window as any).__emitUrlActive({
        name: 'rex-page-url-active',
        tab_id: 9001,
        window_id: 3,
        session_id: 'sess-matched',
        url,
        url_shown_at: urlShownAt,
      })
    }, { url, urlShownAt })

    await addHistoryItem(page, url, 'Matched', visitTime)
    await triggerCollection(page)

    const visits = await dispatchedVisits(page, 'matched.example')
    expect(visits.length).toBeGreaterThanOrEqual(1)
    const v = visits[0]
    expect(v.tab_id).toBe(9001)
    expect(v.window_id).toBe(3)
    expect(v.session_id).toBe('sess-matched')
    expect(v.page_events_url_shown_at).toBe(urlShownAt)
  })

  test('seam installed, URL differs: no linkage fields', async ({ page }) => {
    await page.goto('/test-page.html?urlActive=on')
    await waitForModuleSetup(page)
    await seedConfigAndIdentifier(page)

    const visitTime = Date.now() - 500
    await page.evaluate(({ t }) => {
      ;(window as any).__emitUrlActive({
        name: 'rex-page-url-active',
        tab_id: 1,
        window_id: 1,
        session_id: 'sess-other',
        url: 'https://other.example/',
        url_shown_at: t + 100,
      })
    }, { t: visitTime })

    await addHistoryItem(page, 'https://visited.example/', 'Visited', visitTime)
    await triggerCollection(page)

    const visits = await dispatchedVisits(page, 'visited.example')
    expect(visits.length).toBeGreaterThanOrEqual(1)
    expect(visits[0].tab_id).toBeUndefined()
    expect(visits[0].session_id).toBeUndefined()
  })

  test('seam installed, outside tolerance: no linkage fields', async ({ page }) => {
    await page.goto('/test-page.html?urlActive=on')
    await waitForModuleSetup(page)
    await seedConfigAndIdentifier(page)

    const visitTime = Date.now() - 500
    const url = 'https://staletime.example/'
    // Place the url-active 10 seconds before the visit — outside default 5000ms.
    await page.evaluate(({ url, t }) => {
      ;(window as any).__emitUrlActive({
        name: 'rex-page-url-active',
        tab_id: 1,
        window_id: 1,
        session_id: 'sess-stale',
        url,
        url_shown_at: t - 10_000,
      })
    }, { url, t: visitTime })

    await addHistoryItem(page, url, 'Stale', visitTime)
    await triggerCollection(page)

    const visits = await dispatchedVisits(page, 'staletime.example')
    expect(visits.length).toBeGreaterThanOrEqual(1)
    expect(visits[0].tab_id).toBeUndefined()
  })

  test('tolerance=0 disables matching even when a buffered record exists', async ({ page }) => {
    await page.goto('/test-page.html?urlActive=on')
    await waitForModuleSetup(page)
    await seedConfigAndIdentifier(page, { page_events_link_tolerance_ms: 0 })

    const visitTime = Date.now() - 500
    const url = 'https://disabled.example/'
    await page.evaluate(({ url, t }) => {
      ;(window as any).__emitUrlActive({
        name: 'rex-page-url-active',
        tab_id: 99,
        window_id: 1,
        session_id: 'sess-disabled',
        url,
        url_shown_at: t,
      })
    }, { url, t: visitTime })

    await addHistoryItem(page, url, 'Disabled', visitTime)
    await triggerCollection(page)

    const visits = await dispatchedVisits(page, 'disabled.example')
    expect(visits.length).toBeGreaterThanOrEqual(1)
    expect(visits[0].tab_id).toBeUndefined()
  })

  test('buffer evicts oldest past URL_ACTIVE_BUFFER_MAX', async ({ page }) => {
    await page.goto('/test-page.html?urlActive=on')
    await waitForModuleSetup(page)
    await seedConfigAndIdentifier(page)

    // Push 300 entries (> 256 cap). The FIRST entry — which matches our test URL —
    // should have been evicted by the time we collect.
    const visitTime = Date.now() - 500
    const url = 'https://evicted.example/'
    await page.evaluate(({ url, t }) => {
      ;(window as any).__emitUrlActive({
        name: 'rex-page-url-active',
        tab_id: 1,
        window_id: 1,
        session_id: 'sess-should-evict',
        url,
        url_shown_at: t,
      })
      for (let i = 0; i < 300; i++) {
        ;(window as any).__emitUrlActive({
          name: 'rex-page-url-active',
          tab_id: i + 2,
          window_id: 1,
          session_id: `filler-${i}`,
          url: `https://filler${i}.example/`,
          url_shown_at: t + i,
        })
      }
    }, { url, t: visitTime })

    await addHistoryItem(page, url, 'Evicted', visitTime)
    await triggerCollection(page)

    const visits = await dispatchedVisits(page, 'evicted.example')
    expect(visits.length).toBeGreaterThanOrEqual(1)
    // The matching record should have been evicted, so no linkage.
    expect(visits[0].session_id).toBeUndefined()
  })

  test('redacted (CATEGORY:...) URLs are never matched — privacy guarantee', async ({ page }) => {
    await page.goto('/test-page.html?urlActive=on')
    await waitForModuleSetup(page)

    // Seed rex-lists with a filter list entry that will redact our URL.
    // NOTE: rex-history pins rex-lists#emt_test, an older schema that names the
    // field `domain` rather than the newer `pattern`. We include BOTH so this
    // test works across both schema versions.
    await page.evaluate(async () => {
      const { createListEntry } = (window as any).__listUtils
      await createListEntry({
        list_name: 'blocklist',
        domain: 'secret.example',
        pattern: 'secret.example',
        pattern_type: 'domain',
        source: 'backend',
        metadata: { category: 'health' },
      })
    })

    await seedConfigAndIdentifier(page, {
      filter_lists: ['blocklist'],
    })

    const visitTime = Date.now() - 500
    const url = 'https://secret.example/page'

    // Even if we provide an url-active record with the RAW URL, the history
    // visit's own URL will be redacted to "CATEGORY:health" BEFORE we try to
    // match — and redacted URLs are never matched against the buffer.
    await page.evaluate(({ url, t }) => {
      ;(window as any).__emitUrlActive({
        name: 'rex-page-url-active',
        tab_id: 42,
        window_id: 1,
        session_id: 'sess-secret',
        url,
        url_shown_at: t + 100,
      })
    }, { url, t: visitTime })

    await addHistoryItem(page, url, 'Secret', visitTime)
    await triggerCollection(page)

    // Visit should be there, redacted, with no linkage fields.
    const allVisits = await dispatchedVisits(page)
    const redacted = allVisits.find(
      (v) => typeof v.url === 'string' && (v.url as string).startsWith('CATEGORY:')
    )
    expect(redacted).toBeDefined()
    expect(redacted.tab_id).toBeUndefined()
    expect(redacted.session_id).toBeUndefined()
  })
})
