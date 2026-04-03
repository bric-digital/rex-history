#!/usr/bin/env node

/**
 * Build script to bundle webmunk-history modules for browser testing
 * Uses esbuild to create browser-compatible bundles
 */

import * as esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdir } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const srcDir = join(__dirname, '../../src')
const testSrcDir = join(__dirname, '../src')
const outputDir = join(__dirname, '../src/build')
const extensionDir = join(__dirname, '../extension')

// Ensure output directories exist
await mkdir(outputDir, { recursive: true })
await mkdir(extensionDir, { recursive: true })

const modules = [
  {
    name: 'service-worker',
    input: join(srcDir, 'service-worker.mts'),
    output: join(outputDir, 'service-worker.bundle.js')
  },
  {
    name: 'extension',
    input: join(srcDir, 'extension.mts'),
    output: join(outputDir, 'extension.bundle.js')
  },
  {
    name: 'browser',
    input: join(srcDir, 'browser.mts'),
    output: join(outputDir, 'browser.bundle.js')
  },
  {
    // Test shim: loads the real HistoryServiceWorkerModule plus an EventCaptureModule.
    // Used by test-page.html to exercise the actual module code.
    name: 'test-shim',
    input: join(testSrcDir, 'test-shim.mts'),
    output: join(outputDir, 'test-shim.bundle.js')
  },
  {
    // Option-C extension service worker: loads HistoryServiceWorkerModule + message routing.
    // Output goes into tests/extension/ so Playwright can load it as a real Chrome extension.
    name: 'extension-sw',
    input: join(extensionDir, 'sw-entry.mts'),
    output: join(extensionDir, 'service-worker.bundle.js')
  }
]

try {
  for (const module of modules) {
    await esbuild.build({
      entryPoints: [module.input],
      bundle: true,
      format: 'esm',
      platform: 'browser',
      target: 'es2021',
      outfile: module.output,
      sourcemap: true,
      // Bundle all dependencies - chrome APIs will be provided by test environment
      resolveExtensions: ['.mts', '.ts', '.js', '.mjs'],
      mainFields: ['module', 'main'],
      conditions: ['import', 'module', 'default'],
      // Define globals
      define: {
        'chrome': 'globalThis.chrome'
      }
    })

    console.log(`✅ ${module.name} bundle created: ${module.output}`)
  }

  console.log('\n✅ All bundles created successfully')
  console.log('   You can now run: npm test')
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}
