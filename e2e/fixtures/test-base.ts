import { test as base, Page } from '@playwright/test';

/**
 * Custom test fixture that blocks analytics and tracking requests
 * This prevents E2E test traffic from being counted as real user traffic
 */

// List of domains/patterns to block during E2E tests
const BLOCKED_PATTERNS = [
  // Google Analytics
  '**/google-analytics.com/**',
  '**/googletagmanager.com/**',
  '**/analytics.google.com/**',
  '**/www.google-analytics.com/**',
  // Google Ads
  '**/googleadservices.com/**',
  '**/googlesyndication.com/**',
  '**/doubleclick.net/**',
  // Facebook
  '**/facebook.com/tr/**',
  '**/connect.facebook.net/**',
  '**/facebook.net/**',
  // Other common trackers
  '**/hotjar.com/**',
  '**/segment.io/**',
  '**/segment.com/**',
  '**/mixpanel.com/**',
  '**/amplitude.com/**',
  '**/fullstory.com/**',
  '**/clarity.ms/**',
  '**/mouseflow.com/**',
  '**/heap.io/**',
  '**/intercom.io/**',
  // Generic patterns (Note: In Playwright glob, ? is literal, use * for wildcards)
  '**/collect*',
  '**/analytics*',
];

/**
 * Block analytics requests for a given page
 */
async function blockAnalytics(page: Page): Promise<void> {
  // Block all analytics-related requests
  for (const pattern of BLOCKED_PATTERNS) {
    await page.route(pattern, (route) => {
      // Abort the request silently
      route.abort('blockedbyclient');
    });
  }
}

/**
 * Extended test with analytics blocking built-in
 */
export const test = base.extend<{ blockAnalyticsFixture: void }>({
  // This fixture runs before each test and blocks analytics
  blockAnalyticsFixture: [async ({ page }, use) => {
    await blockAnalytics(page);
    await use();
  }, { auto: true }], // auto: true means it runs automatically for all tests
});

export { expect } from '@playwright/test';
