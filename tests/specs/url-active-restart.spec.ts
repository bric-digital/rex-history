/**
 * Url-active records must survive a service worker restart.
 *
 * Chrome stops an idle extension service worker after about 30 seconds, and
 * history is collected later, on an alarm or on request. A visit collected
 * after a restart must still carry the tab it was seen in.
 */

import { test, expect, chromium, type BrowserContext } from '@playwright/test'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { fileURLToPath } from 'url'
import {
  visitUrl,
  prepareManualHistoryCollection,
  triggerHistoryCollection,
  waitForHistoryEntries,
  waitForConfigurationLoaded,
  injectConfigAndIdentifier,
  waitForCapturedEvent,
} from '../utils/extension.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SERVER_PORT = 3001

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServiceWorkerLike = { evaluate: (pageFunction: (arg: any) => unknown, arg?: unknown) => Promise<any> }

let context: BrowserContext
let serviceWorker: ServiceWorkerLike
let extensionOrigin: string
let userDataDir: string

async function workerCount(): Promise<number> {
  const page = context.pages()[0] ?? await context.newPage()
  const cdp = await context.newCDPSession(page)
  const { targetInfos } = await cdp.send('Target.getTargets')
  await cdp.detach()
  return targetInfos.filter((target: { type: string }) => target.type === 'service_worker').length
}

async function restartServiceWorker(): Promise<void> {
  const extensionPage = `${extensionOrigin}/manifest.json`
  const page = context.pages()[0] ?? await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('ServiceWorker.enable')
  await cdp.send('ServiceWorker.stopAllWorkers')
  await cdp.detach()
  await expect.poll(workerCount, { timeout: 5000 }).toBe(0)

  const waker = await context.newPage()
  await waker.goto(extensionPage)
  await waker.evaluate(() => chrome.runtime.sendMessage({ messageType: 'getHistoryStatus' }))
  await waker.close()
  await expect.poll(workerCount, { timeout: 5000 }).toBe(1)

  serviceWorker = restartedWorker()
  await waitForConfigurationLoaded(serviceWorker)
}

// Playwright does not report an extension service worker that Chrome restarted,
// so the restarted worker is reached through the Chrome DevTools Protocol.
function restartedWorker(): ServiceWorkerLike {
  return {
    async evaluate(pageFunction, arg) {
      const page = context.pages()[0] ?? await context.newPage()
      const cdp = await context.newCDPSession(page)
      const { targetInfos } = await cdp.send('Target.getTargets')
      const target = targetInfos.find((info: { type: string }) => info.type === 'service_worker')
      const { sessionId } = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: false })

      const answer = new Promise<unknown>((resolve, reject) => {
        cdp.on('Target.receivedMessageFromTarget', (event) => {
          if (event.sessionId !== sessionId) return
          const message = JSON.parse(event.message)
          if (message.id !== 1) return
          if (message.result?.exceptionDetails) {
            reject(new Error(message.result.exceptionDetails.exception?.description ?? 'evaluation failed'))
          } else {
            resolve(message.result?.result?.value)
          }
        })
      })

      await cdp.send('Target.sendMessageToTarget', {
        sessionId,
        message: JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `(${pageFunction.toString()})(${JSON.stringify(arg)})`,
            returnByValue: true,
            awaitPromise: true,
          },
        }),
      })

      const value = await answer
      await cdp.detach()
      return value
    },
  }
}

async function visitAndAnnounce(marker: string): Promise<void> {
  await visitUrl(context, `http://alpha.news.me:${SERVER_PORT}/allowlisted?marker=${marker}`)
  await waitForHistoryEntries(serviceWorker, [marker])

  await serviceWorker.evaluate(async (marker) => {
    const [item] = await chrome.history.search({ text: marker, startTime: 0 })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (self as any).__testSendMessage({
      messageType: 'pageUrlActive',
      event: {
        name: 'rex-page-url-active',
        tab_id: 41,
        window_id: 7,
        session_id: `session-${marker}`,
        url: item.url,
        url_shown_at: item.lastVisitTime,
      },
    })
  }, marker)
}

async function collectedVisit(marker: string): Promise<Record<string, unknown>> {
  await triggerHistoryCollection(serviceWorker)
  const isVisit = (event: Record<string, unknown>) =>
    event.name === 'rex-history-visit' && typeof event.url === 'string' && event.url.includes(`marker=${marker}`)
  const events = await waitForCapturedEvent(serviceWorker, isVisit, `Expected rex-history-visit with marker=${marker}`)
  return events.find(isVisit)!
}

test.describe('url-active records and service worker restarts', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeAll(async () => {
    const extensionPath = path.join(__dirname, '../extension')
    userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pw-history-restart-'))

    context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--host-resolver-rules=MAP alpha.news.me 127.0.0.1',
      ],
    })

    const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker', { timeout: 30_000 })
    extensionOrigin = `chrome-extension://${new URL(worker.url()).host}`
    serviceWorker = worker
    await injectConfigAndIdentifier(serviceWorker)
  })

  test.afterAll(async () => {
    await context?.close()
    fs.rmSync(userDataDir, { recursive: true, force: true })
  })

  test('control: a visit collected without a restart carries its tab', async () => {
    const marker = `no-restart-${Date.now()}`
    await prepareManualHistoryCollection(serviceWorker)
    await visitAndAnnounce(marker)

    const visit = await collectedVisit(marker)

    expect(visit.tab_id).toBe(41)
    expect(visit.session_id).toBe(`session-${marker}`)
  })

  test('a visit collected after a restart carries its tab', async () => {
    const marker = `restart-${Date.now()}`
    await prepareManualHistoryCollection(serviceWorker)
    await visitAndAnnounce(marker)

    await restartServiceWorker()
    await prepareManualHistoryCollection(serviceWorker)
    const visit = await collectedVisit(marker)

    expect(visit.tab_id).toBe(41)
    expect(visit.session_id).toBe(`session-${marker}`)
  })
})
