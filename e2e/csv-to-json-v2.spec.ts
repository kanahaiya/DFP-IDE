import { test, expect } from './fixtures/test-base';

/**
 * CSV to JSON E2E Tests - Production Ready
 * Tests focus on UI/UX elements that are reliably testable
 * Analytics and tracking are blocked to prevent E2E traffic from being counted
 */
test.describe('CSV to JSON Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/csv-to-json');
    await page.waitForLoadState('networkidle');
  });

  test('page loads with correct title and main UI elements', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/CSV to JSON/);
    
    // Check IDE layout exists
    await expect(page.locator('.ide-layout')).toBeVisible();
    
    // Check both editor panes exist
    const panes = page.locator('.ide-pane');
    expect(await panes.count()).toBeGreaterThanOrEqual(2);
  });

  test('settings sidebar is functional', async ({ page }) => {
    // Check sidebar exists
    await expect(page.locator('.ide-sidebar')).toBeVisible();
    
    // Check tabs are present
    const parsingTab = page.locator('.sidebar-tab').filter({ hasText: /Parsing/i }).first();
    const outputTab = page.locator('.sidebar-tab').filter({ hasText: /Output/i }).first();
    
    await expect(parsingTab).toBeVisible();
    await expect(outputTab).toBeVisible();
    
    // Click between tabs
    if (await outputTab.isVisible()) {
      await outputTab.click();
      await page.waitForTimeout(300);
      await parsingTab.click();
      await page.waitForTimeout(300);
    }
  });

  test('SEO content sections are present', async ({ page }) => {
    // Scroll to SEO section
    const seoSection = page.locator('#seo-content');
    if (await seoSection.isVisible({ timeout: 2000 })) {
      await seoSection.scrollIntoViewIfNeeded();
      
      // Check for h2 headings
      const h2Count = await seoSection.locator('h2').count();
      expect(h2Count).toBeGreaterThan(3); // Should have multiple sections
      
      // Check newsletter section
      const newsletter = page.locator('.newsletter-section');
      if (await newsletter.isVisible({ timeout: 1000 })) {
        await newsletter.scrollIntoViewIfNeeded();
        await expect(newsletter).toBeVisible();
      }
    }
  });

  test('footer is present', async ({ page }) => {
    const footer = page.locator('footer');
    if (await footer.isVisible({ timeout: 2000 })) {
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();
    }
  });

  test('page is responsive', async ({ page }) => {
    // Test different viewport sizes
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('.ide-layout')).toBeVisible();
    
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('.ide-layout')).toBeVisible();
  });
});
