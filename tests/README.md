# Webmunk History Test Suite

Comprehensive automated tests for the webmunk-history module.

## Table of Contents

- [Quick Start](#quick-start)
- [Directory Structure](#directory-structure)
- [Test Coverage](#test-coverage)
- [Running Tests](#running-tests)
- [Implementation Details](#implementation-details)
- [CI/CD Integration](#cicd-integration)

---

## Quick Start

Get the automated tests running in under 5 minutes.

### Prerequisites

- Node.js 18+ installed
- Python 3 installed (for local web server)

### Step-by-Step

#### 1. Navigate to Module Directory

```bash
cd webmunk-history
```

#### 2. Install Dependencies

```bash
npm install
```

This installs:
- Playwright (browser automation)
- esbuild (bundler)
- All required dependencies

#### 3. Install Browser

```bash
npx playwright install chromium
```

Only needed once. Downloads Chromium browser for testing.

#### 4. Run Tests

```bash
npm test
```

This will:
1. Build test bundles (via pretest script)
2. Start a local web server (Python http.server on port 8080)
3. Open Chromium in headless mode
4. Run all test suites
5. Display results in the terminal
6. Generate an HTML report if any tests fail

### Expected Output

```
Running tests using 1 worker

  ✓ History Service Worker - Initialization (4)
  ✓ History Service Worker - Storage Operations (4)
  ✓ History Service Worker - URL Filtering (2)
  ✓ History Service Worker - Alarm Management (2)
  ✓ History Service Worker - Mock History Collection (3)
  ✓ History Service Worker - Debug Logging Guards (3)
  ✓ History Service Worker - Message Handling (2)
  ✓ History Service Worker - Configuration Changes (2)
  ✓ History Service Worker - Top Domains Generation (1)
  ✓ History Extension - UI Elements (1)
  ✓ History Extension - Status Display (4)
  ✓ History Extension - Configuration Display (4)
  ✓ History Extension - User Interactions (3)
  ✓ History Extension - Error Handling (2)

  37 passed (8s)
```

---

## Directory Structure

```
tests/
├── specs/                          # Playwright test specs
│   ├── service-worker.spec.js     # Service worker module tests
│   └── extension.spec.js          # Extension UI module tests
├── src/                           # Test HTML pages and fixtures
│   ├── test-page.html             # Service worker test environment
│   ├── history-status-ui.html     # Extension UI test page
│   └── build/                     # Built bundles (generated)
├── scripts/
│   └── build-test-bundle.js       # esbuild bundler script
└── README.md                      # This file
```

---

## Test Coverage

### Service Worker Module Tests (23 tests)

**Initialization** (4 tests)
- Initialize with no configuration
- Load configuration from server config
- Prioritize local override config over server config
- Configuration merging behavior

**Storage Operations** (4 tests)
- Save and load status
- Save and retrieve last fetch time
- Handle missing last fetch time with lookback_days
- Status persistence

**URL Filtering** (2 tests)
- Filter non-http(s) URLs (file://, chrome://, etc.)
- Allow http and https URLs

**Alarm Management** (2 tests)
- Create periodic collection alarm
- Clear existing alarm before creating new one

**Mock History Collection** (3 tests)
- Retrieve mock history items
- Filter history by startTime
- Retrieve visits for a URL

**Debug Logging Guards** (3 tests)
- Only enable debug logging in dev extension
- Store debug flag in storage
- Remove debug flag if not in dev extension

**Message Handling** (2 tests)
- Respond to getHistoryStatus message
- Respond to triggerHistoryCollection message

**Configuration Changes** (2 tests)
- React to configuration changes
- React to local override changes

**Top Domains Generation** (1 test)
- Collect domains from history

### Extension UI Module Tests (14 tests)

**UI Elements** (1 test)
- Display all required UI elements

**Status Display** (4 tests)
- Display last collection time
- Display items collected count
- Disable button when collection is in progress
- Re-enable button after collection completes

**Configuration Display** (4 tests)
- Display configuration values
- Display N/A for missing config values
- Display "None" for empty list arrays
- Display "No" when top domains generation is disabled

**User Interactions** (3 tests)
- Trigger collection when button is clicked
- Disable button during collection
- Refresh status when refresh button is clicked

**Error Handling** (2 tests)
- Display "Error" when status fetch fails
- Handle collection trigger failure gracefully

---

## Running Tests

### Available Scripts

From the `webmunk-history` directory:

```bash
# Run all tests (builds bundles first)
npm test

# Run tests in CI mode (dot reporter)
npm run test:ci

# Run tests with browser visible
npm run test:headed

# Open Playwright UI for interactive testing
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Build test bundles only
npm run pretest
```

### Headless Mode (Default)

```bash
npm test
```

Tests run in the background without opening a browser window.

### Headed Mode (Watch Tests Execute)

```bash
npm run test:headed
```

Watch the tests execute in real-time in a visible browser.

### Interactive UI Mode

```bash
npm run test:ui
```

Opens Playwright's UI for:
- Running individual tests
- Debugging test failures
- Viewing test traces
- Time-travel debugging

### Debug Mode

```bash
npm run test:debug
```

Pauses at each test for step-by-step debugging.

---

## Implementation Details

### Mock Chrome APIs

The test environment provides mock implementations of Chrome extension APIs:

#### chrome.runtime
- `getManifest()` - Returns mock manifest
- `sendMessage()` - Mock message passing
- `onMessage.addListener()` - Mock message listener

#### chrome.storage.local
- `get()` - Retrieve from mock storage
- `set()` - Save to mock storage
- `remove()` - Remove from mock storage
- `clear()` - Clear all mock storage

#### chrome.history
- `search()` - Search mock history items
- `getVisits()` - Get visits for a URL
- Mock history items added via `window.addMockHistoryItem()`

#### chrome.alarms
- `create()` - Create mock alarm
- `clear()` - Clear mock alarm
- `get()` - Get mock alarm
- `onAlarm.addListener()` - Mock alarm listener

### Test Helpers

**Service Worker Tests:**
- `window.clearStorage()` - Clear mock storage
- `window.clearMockHistory()` - Clear mock history items
- `window.addMockHistoryItem(item)` - Add mock history item
- `window.triggerAlarm(name)` - Trigger mock alarm

**Extension UI Tests:**
- `window.clearStorage()` - Clear mock storage
- `window.refreshHistoryStatus()` - Refresh status display
- `window.loadHistoryConfiguration()` - Load configuration
- `window.mockConfigResponse` - Set mock config response

### Build System

The build script (`tests/scripts/build-test-bundle.js`) uses esbuild to:
1. Bundle TypeScript modules for browser compatibility
2. Handle ES module imports
3. Generate sourcemaps for debugging
4. Bundle service-worker, extension, and browser modules separately

---

## CI/CD Integration

### CircleCI Configuration

Add to your `.circleci/config.yml`:

```yaml
- run:
    name: Test History Module
    command: |
      cd webmunk-history
      npm install
      npx playwright install chromium
      npm test
```

### GitHub Actions Configuration

Add to your workflow:

```yaml
- name: Test History Module
  run: |
    cd webmunk-history
    npm install
    npx playwright install chromium
    npm test
```

---

## Troubleshooting

### "python3: command not found"

Edit `playwright.config.js` and change:
```javascript
command: 'python -m http.server -d tests/src 8080'
```

### "Port 8080 already in use"

Kill the process using port 8080:
```bash
lsof -ti:8080 | xargs kill -9
```

Or change the port in `playwright.config.js`.

### Tests Fail with "testUtilitiesReady is not true"

The bundle wasn't built. Run:
```bash
npm run pretest
```

### "Cannot find module"

Install dependencies:
```bash
npm install
```

### Build Script Errors

Make sure you're in the `webmunk-history` directory and that `src/` contains the module files.

---

## Testing Philosophy

1. **Mock Chrome APIs**: Tests use mock implementations to avoid browser dependencies
2. **Sequential Execution**: Tests run sequentially to avoid state conflicts
3. **Comprehensive Coverage**: Tests cover initialization, configuration, collection, filtering, and UI
4. **Isolated Tests**: Each test clears state before running
5. **Realistic Scenarios**: Tests simulate real extension behavior

---

## Next Steps

After verifying tests pass:

1. Integrate into webmunk-dev-extension for integration testing
2. Test with real Chrome extension environment
3. Add performance testing with larger datasets
4. Test cross-browser compatibility (Firefox, Edge)

---

## Additional Resources

- **Playwright Documentation**: https://playwright.dev/docs/intro
- **Test Specs**: `specs/service-worker.spec.js`, `specs/extension.spec.js`
- **HTML Report**: Opens automatically on test failure at `playwright-report/index.html`
- **Build Script**: `scripts/build-test-bundle.js`
- **Playwright Config**: `playwright.config.js`
