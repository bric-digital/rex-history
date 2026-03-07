/**
 * Extension-mode integration tests for HistoryServiceWorkerModule.
 *
 * These tests load the history module as a real Chrome extension with real Chrome APIs
 * (chrome.alarms, chrome.history, chrome.storage, IndexedDB). All URL visits use fake
 * domains (news.me, block.me, social.me) mapped to 127.0.0.1 via --host-resolver-rules,
 * served by the local test server (tests/scripts/run-server.js on port 3001).
 *
 * The sw-entry.mts shim registers an EventCaptureModule that populates
 * self.__capturedEvents, allowing event payload assertions equivalent to the
 * mock-based service-worker-module.spec.ts tests — but using real Chrome APIs.
 *
 * This follows the same pattern as the Keystone acceptance tests.
 *
 * All tests share one browser context (beforeAll / afterAll) with serial execution
 * to avoid the MV3 service-worker registration race.
 *
 * IMPORTANT — headless mode:
 *   Chrome's CDP bridge does not expose extension service workers in headless mode.
 *   Tests use headless: false. On macOS/Windows a small window appears during the
 *   run; on Linux CI wrap in Xvfb.
 */

import { test, expect, chromium, type BrowserContext, type Worker } from '@playwright/test'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { fileURLToPath } from 'url'
import {
  visitUrl,
  waitForAllowListEntry,
  prepareManualHistoryCollection,
  triggerHistoryCollection,
  waitForHistoryEntries,
  waitForConfigurationLoaded,
  injectConfigAndIdentifier,
  injectListEntries,
  resetCapturedEvents,
  waitForCapturedEvent,
} from '../utils/extension.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SERVER_PORT = 3001

const HOST_RESOLVER_RULES = [
  'MAP news.me 127.0.0.1',
  'MAP *.news.me 127.0.0.1',
  'MAP block.me 127.0.0.1',
  'MAP *.block.me 127.0.0.1',
  'MAP social.me 127.0.0.1',
  'MAP *.social.me 127.0.0.1',
].join(', ')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isHistoryVisit(event: Record<string, unknown>): boolean {
  return event.name === 'rex-history-visit'
}

function hasMarker(event: Record<string, unknown>, marker: string): boolean {
  return typeof event.url === 'string' && event.url.includes(`marker=${marker}`)
}

async function waitForCollectionComplete(sw: Worker): Promise<void> {
  await sw.evaluate(async () => {
    const deadline = Date.now() + 10_000
    while (Date.now() < deadline) {
      const result = await chrome.storage.local.get('webmunkHistoryStatus')
      const status = result.webmunkHistoryStatus as { isCollecting?: boolean; lastCollectionTime?: number } | undefined
      if (status?.isCollecting === false && status?.lastCollectionTime !== undefined) return
      await new Promise((r) => setTimeout(r, 100))
    }
    throw new Error('Collection did not complete within 10s')
  })
}

// ---------------------------------------------------------------------------
// Shared context
// ---------------------------------------------------------------------------

test.describe('HistoryServiceWorkerModule — real extension', () => {
  test.describe.configure({ mode: 'serial' })

  let context: BrowserContext
  let serviceWorker: Worker
  let userDataDir: string

  test.beforeAll(async () => {
    const extensionPath = path.join(__dirname, '../extension')
    userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pw-history-ext-'))

    context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        `--host-resolver-rules=${HOST_RESOLVER_RULES}`,
      ],
    })

    serviceWorker =
      context.serviceWorkers()[0] ??
      await context.waitForEvent('serviceworker', { timeout: 30_000 })

    await serviceWorker.evaluate(async () => {
      const deadline = Date.now() + 10_000
      while (Date.now() < deadline) {
        const result = await chrome.storage.local.get('webmunkHistoryStatus')
        if (result.webmunkHistoryStatus !== undefined) return
        await new Promise((r) => setTimeout(r, 100))
      }
      throw new Error('setup() did not write webmunkHistoryStatus within 10s')
    })
  })

  test.afterAll(async () => {
    await context?.close()
    if (userDataDir) {
      fs.rmSync(userDataDir, { recursive: true, force: true })
    }
  })

  // -------------------------------------------------------------------------
  // Startup
  // -------------------------------------------------------------------------

  test('service worker starts and writes initial status to chrome.storage', async () => {
    const status = await serviceWorker.evaluate(async () => {
      const result = await chrome.storage.local.get('webmunkHistoryStatus')
      return result.webmunkHistoryStatus
    })
    expect(status).toBeTruthy()
    expect(status.isCollecting).toBe(false)
    expect(status.configSource).toBe('none')
  })

  test('alarm is created in real chrome.alarms after config + identifier are injected', async () => {
    await injectConfigAndIdentifier(serviceWorker, { collection_interval_minutes: 30 })

    const alarm = await serviceWorker.evaluate(async () => {
      const deadline = Date.now() + 5_000
      while (Date.now() < deadline) {
        const a = await chrome.alarms.get('rex-history-collection')
        if (a) return a
        await new Promise((r) => setTimeout(r, 100))
      }
      return null
    })

    expect(alarm).toBeTruthy()
    expect(alarm.periodInMinutes).toBe(30)
  })

  test('getHistoryStatus message returns current module status', async () => {
    const response = await serviceWorker.evaluate(async () => {
      return await (self as any).__testSendMessage({ messageType: 'getHistoryStatus' }) // eslint-disable-line @typescript-eslint/no-explicit-any
    })
    expect(response).toBeTruthy()
    expect(response.isCollecting).toBe(false)
  })

  // -------------------------------------------------------------------------
  // Basic collection with full event payload assertions
  // -------------------------------------------------------------------------

  test('collected event includes all expected fields with real chrome.history data', async () => {
    await injectConfigAndIdentifier(serviceWorker)
    await prepareManualHistoryCollection(serviceWorker)
    await resetCapturedEvents(serviceWorker)

    const marker = `payload-${Date.now()}`
    await visitUrl(context, `http://alpha.news.me:${SERVER_PORT}/allowlisted?marker=${marker}`)
    await waitForHistoryEntries(serviceWorker, [marker])
    await triggerHistoryCollection(serviceWorker)

    const events = await waitForCapturedEvent(
      serviceWorker,
      (e) => isHistoryVisit(e) && hasMarker(e, marker),
      `Expected rex-history-visit with marker=${marker}`
    )

    const event = events.find((e) => isHistoryVisit(e) && hasMarker(e, marker))!
    expect(event.name).toBe('rex-history-visit')
    expect(typeof event.url).toBe('string')
    expect(event.url).toContain(marker)
    expect(typeof event.domain).toBe('string')
    expect(event.domain).toBe('news.me')
    expect(typeof event.visit_time).toBe('number')
    expect(typeof event.transition_type).toBe('string')
    expect(Array.isArray(event.categories)).toBe(true)
    expect(typeof event.visit_id).toBe('string')
  })

  test('visit_time in collected event is close to actual visit time', async () => {
    await injectConfigAndIdentifier(serviceWorker)
    await prepareManualHistoryCollection(serviceWorker)
    await resetCapturedEvents(serviceWorker)

    const visitStart = Date.now()
    const marker = `ts-${Date.now()}`
    await visitUrl(context, `http://alpha.news.me:${SERVER_PORT}/allowlisted?marker=${marker}`)
    const visitEnd = Date.now()
    await waitForHistoryEntries(serviceWorker, [marker])
    await triggerHistoryCollection(serviceWorker)

    const events = await waitForCapturedEvent(
      serviceWorker,
      (e) => isHistoryVisit(e) && hasMarker(e, marker),
      `Expected rex-history-visit with marker=${marker}`
    )

    const event = events.find((e) => isHistoryVisit(e) && hasMarker(e, marker))!
    const visitTime = Number(event.visit_time)
    expect(Number.isFinite(visitTime)).toBe(true)
    expect(visitTime).toBeGreaterThanOrEqual(visitStart - 2000)
    expect(visitTime).toBeLessThanOrEqual(visitEnd + 5000)
  })

  // -------------------------------------------------------------------------
  // Allow list — event payload assertions
  // -------------------------------------------------------------------------

  test('URL on allow list is collected with full URL in event payload', async () => {
    await injectConfigAndIdentifier(serviceWorker, { allow_lists: ['news-sites'] })
    await injectListEntries(serviceWorker, [{
      list_name: 'news-sites',
      pattern: 'news.me',
      pattern_type: 'domain',
    }])
    await waitForAllowListEntry(serviceWorker, 'news-sites', 'news.me', 'domain')
    await prepareManualHistoryCollection(serviceWorker)
    await resetCapturedEvents(serviceWorker)

    const marker = `allow-full-${Date.now()}`
    const targetUrl = `http://alpha.news.me:${SERVER_PORT}/allowlisted?marker=${marker}`
    await visitUrl(context, targetUrl)
    await waitForHistoryEntries(serviceWorker, [marker])
    await triggerHistoryCollection(serviceWorker)

    const events = await waitForCapturedEvent(
      serviceWorker,
      (e) => isHistoryVisit(e) && hasMarker(e, marker),
      `Expected allowlisted event with marker=${marker}`
    )

    const event = events.find((e) => isHistoryVisit(e) && hasMarker(e, marker))!
    expect(event.url).toBe(targetUrl)
    expect(event.domain).toBe('news.me')
  })

  test('URL not on allow list records as CATEGORY:NOT_ON_ALLOWLIST with domain and title cleared', async () => {
    await injectConfigAndIdentifier(serviceWorker, { allow_lists: ['news-sites'] })
    await injectListEntries(serviceWorker, [{
      list_name: 'news-sites',
      pattern: 'news.me',
      pattern_type: 'domain',
    }])
    await waitForAllowListEntry(serviceWorker, 'news-sites', 'news.me', 'domain')
    await prepareManualHistoryCollection(serviceWorker)
    await resetCapturedEvents(serviceWorker)

    const visitStart = Date.now()
    const marker = `not-allowed-${Date.now()}`
    await visitUrl(context, `http://delta.block.me:${SERVER_PORT}/not-allowlisted?marker=${marker}`)
    await waitForHistoryEntries(serviceWorker, [marker])
    await triggerHistoryCollection(serviceWorker)

    // The event url will be CATEGORY:NOT_ON_ALLOWLIST — match by visit_time window instead of marker
    const events = await waitForCapturedEvent(
      serviceWorker,
      (e) => {
        if (!isHistoryVisit(e)) return false
        const t = Number(e.visit_time)
        return e.url === 'CATEGORY:NOT_ON_ALLOWLIST' && t >= visitStart - 2000
      },
      'Expected CATEGORY:NOT_ON_ALLOWLIST event in visit time window'
    )

    const event = events.find((e) => {
      if (!isHistoryVisit(e)) return false
      const t = Number(e.visit_time)
      return e.url === 'CATEGORY:NOT_ON_ALLOWLIST' && t >= visitStart - 2000
    })!
    expect(event.url).toBe('CATEGORY:NOT_ON_ALLOWLIST')
    expect(event.domain).toBe('')
    expect(event.title).toBe('')
  })

  // -------------------------------------------------------------------------
  // Filter list — event payload assertions
  // -------------------------------------------------------------------------

  test('URL matching a filter list records as CATEGORY:<category> with domain and title cleared', async () => {
    await injectConfigAndIdentifier(serviceWorker, { filter_lists: ['sensitive-sites'] })
    await injectListEntries(serviceWorker, [{
      list_name: 'sensitive-sites',
      pattern: 'social.me',
      pattern_type: 'domain',
      metadata: { category: 'social-media' },
    }])
    await prepareManualHistoryCollection(serviceWorker)
    await resetCapturedEvents(serviceWorker)

    const visitStart = Date.now()
    const marker = `filter-cat-${Date.now()}`
    await visitUrl(context, `http://alpha.social.me:${SERVER_PORT}/allowlisted?marker=${marker}`)
    await waitForHistoryEntries(serviceWorker, [marker])
    await triggerHistoryCollection(serviceWorker)

    const events = await waitForCapturedEvent(
      serviceWorker,
      (e) => {
        if (!isHistoryVisit(e)) return false
        const t = Number(e.visit_time)
        return e.url === 'CATEGORY:social-media' && t >= visitStart - 2000
      },
      'Expected CATEGORY:social-media event'
    )

    const event = events.find((e) => e.url === 'CATEGORY:social-media')!
    expect(event.url).toBe('CATEGORY:social-media')
    expect(event.domain).toBe('')
    expect(event.title).toBe('')
  })

  // -------------------------------------------------------------------------
  // Domain-only list — event payload assertions
  // -------------------------------------------------------------------------

  test('URL on domain_only list records as "DOMAIN ONLY" but preserves domain field', async () => {
    await injectConfigAndIdentifier(serviceWorker, { domain_only_lists: ['domain-only-sites'] })
    await injectListEntries(serviceWorker, [{
      list_name: 'domain-only-sites',
      pattern: 'social.me',
      pattern_type: 'domain',
    }])
    await prepareManualHistoryCollection(serviceWorker)
    await resetCapturedEvents(serviceWorker)

    const visitStart = Date.now()
    const marker = `domonly-${Date.now()}`
    await visitUrl(context, `http://alpha.social.me:${SERVER_PORT}/allowlisted?marker=${marker}`)
    await waitForHistoryEntries(serviceWorker, [marker])
    await triggerHistoryCollection(serviceWorker)

    const events = await waitForCapturedEvent(
      serviceWorker,
      (e) => {
        if (!isHistoryVisit(e)) return false
        const t = Number(e.visit_time)
        return e.url === 'DOMAIN ONLY' && t >= visitStart - 2000
      },
      'Expected DOMAIN ONLY event'
    )

    const event = events.find((e) => e.url === 'DOMAIN ONLY')!
    expect(event.url).toBe('DOMAIN ONLY')
    expect(event.domain).toBe('social.me')
  })

  // -------------------------------------------------------------------------
  // Category lists — event payload assertions
  // -------------------------------------------------------------------------

  test('URL matching a category list has correct category in event payload', async () => {
    await injectConfigAndIdentifier(serviceWorker, { category_lists: ['site-categories'] })
    await injectListEntries(serviceWorker, [{
      list_name: 'site-categories',
      pattern: 'news.me',
      pattern_type: 'domain',
      metadata: { category: 'news' },
    }])
    await prepareManualHistoryCollection(serviceWorker)
    await resetCapturedEvents(serviceWorker)

    const marker = `cat-${Date.now()}`
    await visitUrl(context, `http://alpha.news.me:${SERVER_PORT}/allowlisted?marker=${marker}`)
    await waitForHistoryEntries(serviceWorker, [marker])
    await triggerHistoryCollection(serviceWorker)

    const events = await waitForCapturedEvent(
      serviceWorker,
      (e) => isHistoryVisit(e) && hasMarker(e, marker),
      `Expected event with marker=${marker}`
    )

    const event = events.find((e) => isHistoryVisit(e) && hasMarker(e, marker))!
    expect(Array.isArray(event.categories)).toBe(true)
    expect(event.categories).toContain('news')
  })

  // -------------------------------------------------------------------------
  // Navigation sequence / transition types
  // -------------------------------------------------------------------------

  test('H→A: homepage then article click-through captured in order', async () => {
    await injectConfigAndIdentifier(serviceWorker)
    await prepareManualHistoryCollection(serviceWorker)
    await resetCapturedEvents(serviceWorker)

    const marker = `journey-ha-${Date.now()}`
    const page = await context.newPage()
    await page.goto(`http://alpha.news.me:${SERVER_PORT}/journey/home?marker=${marker}`, { waitUntil: 'domcontentloaded' })
    await page.click('#article-a-link')
    await page.waitForURL(`**/journey/article-a?marker=${marker}`)
    await page.close()

    await waitForHistoryEntries(serviceWorker, [
      `/journey/home?marker=${marker}`,
      `/journey/article-a?marker=${marker}`,
    ])
    await triggerHistoryCollection(serviceWorker)

    const events = await waitForCapturedEvent(
      serviceWorker,
      (e) => isHistoryVisit(e) && hasMarker(e, marker),
      `Expected history events with marker=${marker}`
    )

    const markerEvents = events.filter((e) => isHistoryVisit(e) && hasMarker(e, marker))
    const urls = markerEvents.map((e) => e.url as string)
    expect(urls.some((u) => u.includes('/journey/home'))).toBe(true)
    expect(urls.some((u) => u.includes('/journey/article-a'))).toBe(true)
  })

  test('H→A→H: back navigation captured — home appears twice', async () => {
    await injectConfigAndIdentifier(serviceWorker)
    await prepareManualHistoryCollection(serviceWorker)
    await resetCapturedEvents(serviceWorker)

    const marker = `journey-hah-${Date.now()}`
    const page = await context.newPage()
    await page.goto(`http://alpha.news.me:${SERVER_PORT}/journey/home?marker=${marker}`, { waitUntil: 'domcontentloaded' })
    await page.click('#article-a-link')
    await page.waitForURL(`**/journey/article-a?marker=${marker}`)
    await page.goBack({ waitUntil: 'domcontentloaded' })
    await page.waitForURL(`**/journey/home?marker=${marker}`)
    await page.close()

    await waitForHistoryEntries(serviceWorker, [
      `/journey/home?marker=${marker}`,
      `/journey/article-a?marker=${marker}`,
    ])
    await triggerHistoryCollection(serviceWorker)

    const events = await waitForCapturedEvent(
      serviceWorker,
      (e) => isHistoryVisit(e) && hasMarker(e, marker),
      `Expected history events with marker=${marker}`
    )

    const markerEvents = events.filter((e) => isHistoryVisit(e) && hasMarker(e, marker))
    const homeVisits = markerEvents.filter((e) => (e.url as string).includes('/journey/home'))
    const articleVisits = markerEvents.filter((e) => (e.url as string).includes('/journey/article-a'))
    // Home visited twice (initial + back), article once
    expect(homeVisits.length).toBeGreaterThanOrEqual(2)
    expect(articleVisits.length).toBeGreaterThanOrEqual(1)
  })

  test('reload creates a transition_type=reload entry', async () => {
    await injectConfigAndIdentifier(serviceWorker)
    await prepareManualHistoryCollection(serviceWorker)
    await resetCapturedEvents(serviceWorker)

    const marker = `reload-${Date.now()}`
    const page = await context.newPage()
    await page.goto(`http://alpha.news.me:${SERVER_PORT}/allowlisted?marker=${marker}`, { waitUntil: 'domcontentloaded' })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.close()

    await waitForHistoryEntries(serviceWorker, [marker])
    await triggerHistoryCollection(serviceWorker)

    const events = await waitForCapturedEvent(
      serviceWorker,
      (e) => isHistoryVisit(e) && hasMarker(e, marker),
      `Expected history events with marker=${marker}`
    )

    const markerEvents = events.filter((e) => isHistoryVisit(e) && hasMarker(e, marker))
    const reloadEvents = markerEvents.filter((e) => e.transition_type === 'reload')
    expect(reloadEvents.length).toBeGreaterThanOrEqual(1)
  })

  // -------------------------------------------------------------------------
  // Cursor — second cycle picks up new visits
  // -------------------------------------------------------------------------

  test('second collection cycle captures visits added after the first cycle', async () => {
    await injectConfigAndIdentifier(serviceWorker)
    await prepareManualHistoryCollection(serviceWorker)
    await resetCapturedEvents(serviceWorker)

    const marker1 = `cycle1-${Date.now()}`
    await visitUrl(context, `http://alpha.news.me:${SERVER_PORT}/allowlisted?marker=${marker1}`)
    await waitForHistoryEntries(serviceWorker, [marker1])
    await triggerHistoryCollection(serviceWorker)
    await waitForCollectionComplete(serviceWorker)

    const afterFirst = await serviceWorker.evaluate(async () => {
      const r = await chrome.storage.local.get('webmunkHistoryStatus')
      return r.webmunkHistoryStatus
    })
    expect(afterFirst.itemsCollected).toBeGreaterThan(0)

    await resetCapturedEvents(serviceWorker)
    const marker2 = `cycle2-${Date.now()}`
    await visitUrl(context, `http://alpha.news.me:${SERVER_PORT}/allowlisted?marker=${marker2}`)
    await waitForHistoryEntries(serviceWorker, [marker2])
    await triggerHistoryCollection(serviceWorker)

    const events = await waitForCapturedEvent(
      serviceWorker,
      (e) => isHistoryVisit(e) && hasMarker(e, marker2),
      `Expected second-cycle event with marker=${marker2}`
    )

    expect(events.some((e) => isHistoryVisit(e) && hasMarker(e, marker2))).toBe(true)
  })

  // -------------------------------------------------------------------------
  // getOldestHistoryAge
  // -------------------------------------------------------------------------

  test('getOldestHistoryAge returns a finite age in seconds based on real chrome.history', async () => {
    const response = await serviceWorker.evaluate(async () => {
      return await (self as any).__testSendMessage({ messageType: 'getOldestHistoryAge' }) // eslint-disable-line @typescript-eslint/no-explicit-any
    })

    expect(response).toBeTruthy()
    expect('ageSeconds' in response).toBe(true)
    if (response.ageSeconds !== null) {
      expect(typeof response.ageSeconds).toBe('number')
      expect(response.ageSeconds).toBeGreaterThanOrEqual(0)
    }
  })
})

// ---------------------------------------------------------------------------
// First-install: pre-existing history ingested on first run
// ---------------------------------------------------------------------------

test.describe('HistoryServiceWorkerModule — first-install profile', () => {
  test('ingests pre-existing allowlisted history without new browsing after extension loads', async () => {
    test.setTimeout(60000)

    const extensionPath = path.join(__dirname, '../extension')
    const profileRoot = path.join(os.tmpdir(), 'pw-history-first-install')
    fs.mkdirSync(profileRoot, { recursive: true })
    const userDataDir = fs.mkdtempSync(path.join(profileRoot, 'profile-'))
    const marker = `first-install-${Date.now()}`

    try {
      // Phase 1: seed browsing history WITHOUT the extension loaded.
      const preseedContext = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        args: [
          `--host-resolver-rules=${HOST_RESOLVER_RULES}`,
        ],
      })
      const preseedPage = await preseedContext.newPage()
      await preseedPage.goto(
        `http://alpha.news.me:${SERVER_PORT}/allowlisted?marker=${marker}`,
        { waitUntil: 'domcontentloaded' }
      )
      await preseedPage.close()
      await preseedContext.close()

      // Phase 2: load extension into the same profile and trigger collection.
      const extensionContext = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        args: [
          `--disable-extensions-except=${extensionPath}`,
          `--load-extension=${extensionPath}`,
          `--host-resolver-rules=${HOST_RESOLVER_RULES}`,
        ],
      })

      try {
        let sw = extensionContext.serviceWorkers()[0]
        if (!sw) {
          sw = await extensionContext.waitForEvent('serviceworker', { timeout: 30_000 })
        }

        // Wait for initial setup.
        await sw.evaluate(async () => {
          const deadline = Date.now() + 10_000
          while (Date.now() < deadline) {
            const result = await chrome.storage.local.get('webmunkHistoryStatus')
            if (result.webmunkHistoryStatus !== undefined) return
            await new Promise((r) => setTimeout(r, 100))
          }
          throw new Error('setup() did not complete within 10s')
        })

        // Inject config so allow_lists is empty (collect everything) and reset cursor.
        await sw.evaluate(async () => {
          await chrome.storage.local.set({
            rexIdentifier: 'first-install-test-user',
            REXConfiguration: {
              history: {
                collection_interval_minutes: 60,
                lookback_days: 30,
                filter_lists: [],
                allow_lists: [],
                category_lists: [],
                domain_only_lists: [],
                generate_top_domains: false,
                top_domains_count: 50,
                top_domains_list_name: 'top-domains',
              },
            },
            webmunkHistoryLastFetch: 0,
          })
        })

        await waitForConfigurationLoaded(sw)

        // Confirm the pre-seeded URL is visible in chrome.history.
        await waitForHistoryEntries(sw, [marker])

        await resetCapturedEvents(sw)
        await triggerHistoryCollection(sw)

        // The pre-existing visit should be captured.
        const events = await waitForCapturedEvent(
          sw,
          (e) => isHistoryVisit(e) && hasMarker(e, marker),
          `Expected pre-existing history visit with marker=${marker}`,
          20000
        )

        expect(events.some((e) => isHistoryVisit(e) && hasMarker(e, marker))).toBe(true)
      } finally {
        await extensionContext.close()
      }
    } finally {
      fs.rmSync(userDataDir, { recursive: true, force: true })
    }
  })
})
