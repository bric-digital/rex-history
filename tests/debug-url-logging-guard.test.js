import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

test('debug full-URL logging is hard-gated to Webmunk Dev Extension only', () => {
  const serviceWorkerPath = path.resolve('src', 'service-worker.mts')
  const src = fs.readFileSync(serviceWorkerPath, 'utf8')

  // Ensure the flag key exists (so toggling is explicit and discoverable)
  assert.ok(
    src.includes('webmunk_debug_log_filtered_urls'),
    'Expected debug flag key to exist'
  )

  // Ensure there is an explicit dev-only manifest-name gate (prevents accidental deployment)
  assert.ok(
    src.includes("chrome.runtime.getManifest().name === 'Webmunk Dev Extension'"),
    'Expected a hard gate on manifest name "Webmunk Dev Extension"'
  )

  // Ensure we emit a dedicated debug event (easy to filter downstream)
  assert.ok(
    src.includes("name: 'webmunk-history-filtered-url-debug'"),
    'Expected debug event name webmunk-history-filtered-url-debug'
  )
})



