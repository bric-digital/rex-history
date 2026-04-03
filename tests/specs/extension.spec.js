import { test, expect } from '@playwright/test';

/**
 * Test suite for webmunk-history extension module UI
 * Tests status display, manual collection triggering, and configuration display
 */

test.describe('History Extension - UI Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/history-status-ui.html');
    await page.waitForFunction(() => window.testUtilitiesReady === true);
    await page.evaluate(() => window.clearStorage());
  });

  test('should display history status UI elements', async ({ page }) => {
    const elements = await page.evaluate(() => {
      return {
        hasLastCollection: !!document.querySelector('#history-last-collection'),
        hasItemsCollected: !!document.querySelector('#history-items-collected'),
        hasTriggerButton: !!document.querySelector('#history-trigger-collection'),
        hasRefreshButton: !!document.querySelector('#history-refresh-status'),
        hasConfigInterval: !!document.querySelector('#history-config-interval'),
        hasConfigLookback: !!document.querySelector('#history-config-lookback'),
        hasConfigFilterLists: !!document.querySelector('#history-config-filter-lists'),
        hasConfigCategoryLists: !!document.querySelector('#history-config-category-lists'),
        hasConfigDomainOnlyLists: !!document.querySelector('#history-config-domain-only-lists'),
        hasConfigTopDomains: !!document.querySelector('#history-config-top-domains'),
        hasConfigTopDomainsCount: !!document.querySelector('#history-config-top-domains-count')
      };
    });

    expect(elements.hasLastCollection).toBe(true);
    expect(elements.hasItemsCollected).toBe(true);
    expect(elements.hasTriggerButton).toBe(true);
    expect(elements.hasRefreshButton).toBe(true);
    expect(elements.hasConfigInterval).toBe(true);
    expect(elements.hasConfigLookback).toBe(true);
    expect(elements.hasConfigFilterLists).toBe(true);
    expect(elements.hasConfigCategoryLists).toBe(true);
    expect(elements.hasConfigDomainOnlyLists).toBe(true);
    expect(elements.hasConfigTopDomains).toBe(true);
    expect(elements.hasConfigTopDomainsCount).toBe(true);
  });

  test('should display "Never" when no collection has occurred', async ({ page }) => {
    const lastCollectionText = await page.textContent('#history-last-collection');
    expect(lastCollectionText).toBe('Never');
  });

  test('should display "0" items collected initially', async ({ page }) => {
    const itemsText = await page.textContent('#history-items-collected');
    expect(itemsText).toBe('0');
  });

  test('should have enabled "Collect Now" button initially', async ({ page }) => {
    const isDisabled = await page.isDisabled('#history-trigger-collection');
    expect(isDisabled).toBe(false);

    const buttonText = await page.textContent('#history-trigger-collection');
    expect(buttonText).toBe('Collect Now');
  });
});

test.describe('History Extension - Status Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/history-status-ui.html');
    await page.waitForFunction(() => window.testUtilitiesReady === true);
    await page.evaluate(() => window.clearStorage());
  });

  test('should display last collection time', async ({ page }) => {
    const testTime = Date.now() - 3600000; // 1 hour ago

    await page.evaluate(async (time) => {
      await window.chrome.storage.local.set({
        webmunkHistoryStatus: {
          lastCollectionTime: time,
          itemsCollected: 42,
          isCollecting: false
        }
      });

      // Trigger refresh
      window.refreshHistoryStatus();
    }, testTime);

    // Wait for status to update
    await page.waitForTimeout(100);

    const lastCollectionText = await page.textContent('#history-last-collection');
    expect(lastCollectionText).not.toBe('Never');
    expect(lastCollectionText).not.toBe('Error');
  });

  test('should display items collected count', async ({ page }) => {
    await page.evaluate(async () => {
      await window.chrome.storage.local.set({
        webmunkHistoryStatus: {
          itemsCollected: 123,
          isCollecting: false
        }
      });

      window.refreshHistoryStatus();
    });

    await page.waitForTimeout(100);

    const itemsText = await page.textContent('#history-items-collected');
    expect(itemsText).toBe('123');
  });

  test('should disable button when collection is in progress', async ({ page }) => {
    await page.evaluate(async () => {
      await window.chrome.storage.local.set({
        webmunkHistoryStatus: {
          itemsCollected: 50,
          isCollecting: true
        }
      });

      window.refreshHistoryStatus();
    });

    await page.waitForTimeout(100);

    const isDisabled = await page.isDisabled('#history-trigger-collection');
    expect(isDisabled).toBe(true);

    const buttonText = await page.textContent('#history-trigger-collection');
    expect(buttonText).toBe('Collecting...');
  });

  test('should re-enable button after collection completes', async ({ page }) => {
    // Start with collecting
    await page.evaluate(async () => {
      await window.chrome.storage.local.set({
        webmunkHistoryStatus: {
          itemsCollected: 50,
          isCollecting: true
        }
      });
      window.refreshHistoryStatus();
    });

    await page.waitForTimeout(100);

    // Update to not collecting
    await page.evaluate(async () => {
      await window.chrome.storage.local.set({
        webmunkHistoryStatus: {
          itemsCollected: 55,
          isCollecting: false
        }
      });
      window.refreshHistoryStatus();
    });

    await page.waitForTimeout(100);

    const isDisabled = await page.isDisabled('#history-trigger-collection');
    expect(isDisabled).toBe(false);

    const buttonText = await page.textContent('#history-trigger-collection');
    expect(buttonText).toBe('Collect Now');
  });
});

test.describe('History Extension - Configuration Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/history-status-ui.html');
    await page.waitForFunction(() => window.testUtilitiesReady === true);
    await page.evaluate(() => window.clearStorage());
  });

  test('should display configuration values', async ({ page }) => {
    await page.evaluate(async () => {
      // Mock the fetchConfiguration message response
      window.mockConfigResponse = {
        history: {
          collection_interval_minutes: 60,
          lookback_days: 7,
          filter_lists: ['blocked-sites', 'sensitive-domains'],
          category_lists: ['social-media', 'news'],
          domain_only_lists: ['video-platforms'],
          generate_top_domains: true,
          top_domains_count: 50,
          top_domains_list_name: 'top-domains'
        }
      };

      window.loadHistoryConfiguration();
    });

    await page.waitForTimeout(100);

    const configValues = await page.evaluate(() => {
      return {
        interval: document.querySelector('#history-config-interval').textContent,
        lookback: document.querySelector('#history-config-lookback').textContent,
        filterLists: document.querySelector('#history-config-filter-lists').textContent,
        categoryLists: document.querySelector('#history-config-category-lists').textContent,
        domainOnlyLists: document.querySelector('#history-config-domain-only-lists')?.textContent,
        topDomains: document.querySelector('#history-config-top-domains').textContent,
        topDomainsCount: document.querySelector('#history-config-top-domains-count').textContent
      };
    });

    expect(configValues.interval).toBe('60');
    expect(configValues.lookback).toBe('7');
    expect(configValues.filterLists).toBe('blocked-sites, sensitive-domains');
    expect(configValues.categoryLists).toBe('social-media, news');
    expect(configValues.domainOnlyLists).toBe('video-platforms');
    expect(configValues.topDomains).toBe('Yes');
    expect(configValues.topDomainsCount).toBe('50');
  });

  test('should display N/A for missing config values', async ({ page }) => {
    await page.evaluate(async () => {
      window.mockConfigResponse = {
        history: {}
      };

      window.loadHistoryConfiguration();
    });

    await page.waitForTimeout(100);

    const configValues = await page.evaluate(() => {
      return {
        interval: document.querySelector('#history-config-interval').textContent,
        lookback: document.querySelector('#history-config-lookback').textContent
      };
    });

    expect(configValues.interval).toBe('N/A');
    expect(configValues.lookback).toBe('N/A');
  });

  test('should display "None" for empty list arrays', async ({ page }) => {
    await page.evaluate(async () => {
      window.mockConfigResponse = {
        history: {
          filter_lists: [],
          category_lists: [],
          domain_only_lists: []
        }
      };

      window.loadHistoryConfiguration();
    });

    await page.waitForTimeout(100);

    const configValues = await page.evaluate(() => {
      return {
        filterLists: document.querySelector('#history-config-filter-lists').textContent,
        categoryLists: document.querySelector('#history-config-category-lists').textContent,
        domainOnlyLists: document.querySelector('#history-config-domain-only-lists').textContent
      };
    });

    expect(configValues.filterLists).toBe('None');
    expect(configValues.categoryLists).toBe('None');
    expect(configValues.domainOnlyLists).toBe('None');
  });

  test('should display "No" when top domains generation is disabled', async ({ page }) => {
    await page.evaluate(async () => {
      window.mockConfigResponse = {
        history: {
          generate_top_domains: false
        }
      };

      window.loadHistoryConfiguration();
    });

    await page.waitForTimeout(100);

    const topDomainsText = await page.textContent('#history-config-top-domains');
    expect(topDomainsText).toBe('No');
  });
});

test.describe('History Extension - User Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/history-status-ui.html');
    await page.waitForFunction(() => window.testUtilitiesReady === true);
    await page.evaluate(() => window.clearStorage());
  });

  test('should trigger collection when button is clicked', async ({ page }) => {
    let messageSent = false;

    await page.evaluate(() => {
      window.chrome.runtime.sendMessage = async (message) => {
        if (message.messageType === 'triggerHistoryCollection') {
          window.collectionTriggered = true;
          return { success: true };
        }
        return { success: false };
      };
    });

    await page.click('#history-trigger-collection');
    await page.waitForTimeout(100);

    messageSent = await page.evaluate(() => window.collectionTriggered === true);
    expect(messageSent).toBe(true);
  });

  test('should disable button during collection', async ({ page }) => {
    await page.evaluate(() => {
      window.chrome.runtime.sendMessage = async (message) => {
        if (message.messageType === 'triggerHistoryCollection') {
          // Simulate long-running collection
          return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 500);
          });
        }
        return { success: false };
      };
    });

    // Click button
    await page.click('#history-trigger-collection');

    // Check immediately that it's disabled
    const isDisabled = await page.isDisabled('#history-trigger-collection');
    expect(isDisabled).toBe(true);

    const buttonText = await page.textContent('#history-trigger-collection');
    expect(buttonText).toBe('Collecting...');
  });

  test('should refresh status when refresh button is clicked', async ({ page }) => {
    await page.evaluate(async () => {
      await window.chrome.storage.local.set({
        webmunkHistoryStatus: {
          itemsCollected: 99,
          isCollecting: false
        }
      });
    });

    await page.click('#history-refresh-status');
    await page.waitForTimeout(100);

    const itemsText = await page.textContent('#history-items-collected');
    expect(itemsText).toBe('99');
  });
});

test.describe('History Extension - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/history-status-ui.html');
    await page.waitForFunction(() => window.testUtilitiesReady === true);
  });

  test('should display "Error" when status fetch fails', async ({ page }) => {
    await page.evaluate(() => {
      window.chrome.runtime.sendMessage = async (message) => {
        if (message.messageType === 'getHistoryStatus') {
          throw new Error('Failed to fetch status');
        }
        return null;
      };

      window.refreshHistoryStatus();
    });

    await page.waitForTimeout(100);

    const lastCollectionText = await page.textContent('#history-last-collection');
    const itemsText = await page.textContent('#history-items-collected');

    expect(lastCollectionText).toBe('Error');
    expect(itemsText).toBe('Error');
  });

  test('should handle collection trigger failure gracefully', async ({ page }) => {
    await page.evaluate(() => {
      window.chrome.runtime.sendMessage = async (message) => {
        if (message.messageType === 'triggerHistoryCollection') {
          throw new Error('Collection failed');
        }
        return null;
      };
    });

    // Click button
    await page.click('#history-trigger-collection');
    await page.waitForTimeout(200);

    // Button should be re-enabled after error
    const isDisabled = await page.isDisabled('#history-trigger-collection');
    expect(isDisabled).toBe(false);
  });
});
