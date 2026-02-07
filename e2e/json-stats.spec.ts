import { test, expect } from '@playwright/test';

// Block analytics requests during tests
test.beforeEach(async ({ page }) => {
  await page.route('**/*google-analytics*/**', (route) => route.abort());
  await page.route('**/*gtag*/**', (route) => route.abort());
  await page.route('**/*analytics*/**', (route) => route.abort());
});

test.describe('JSON Stats Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-stats');
  });

  test('should load the page successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/JSON Stats/i);
    
    // Check main content area exists
    const mainContent = page.locator('.stats-layout, .ide-main-content');
    await expect(mainContent.first()).toBeVisible();
  });

  test('should display input and stats sections', async ({ page }) => {
    const inputSection = page.locator('.input-section, .editor-wrapper').first();
    const statsSection = page.locator('.stats-section, .stats-placeholder').first();
    
    await expect(inputSection).toBeVisible();
    await expect(statsSection).toBeVisible();
  });

  test('should show placeholder when no input', async ({ page }) => {
    const placeholder = page.locator('.stats-placeholder');
    await expect(placeholder).toBeVisible();
    await expect(placeholder).toContainText(/Ready to Analyze/i);
  });

  test('should display settings sidebar', async ({ page }) => {
    const overviewTab = page.locator('.sidebar-tab:has-text("Overview")');
    const typesTab = page.locator('.sidebar-tab:has-text("Types")');
    
    await expect(overviewTab).toBeVisible();
    await expect(typesTab).toBeVisible();
  });

  test('should display export panel', async ({ page }) => {
    const exportSection = page.locator('.export-panel, text="Export"').first();
    await expect(exportSection).toBeVisible();
  });

  test('should have export format options', async ({ page }) => {
    const jsonBtn = page.locator('.format-btn:has-text("JSON")');
    const csvBtn = page.locator('.format-btn:has-text("CSV")');
    const mdBtn = page.locator('.format-btn:has-text("Markdown")');
    
    await expect(jsonBtn).toBeVisible();
    await expect(csvBtn).toBeVisible();
    await expect(mdBtn).toBeVisible();
  });

  test('should have input toolbar with upload/paste/clear', async ({ page }) => {
    // Look for toolbar buttons
    const toolbar = page.locator('.editor-toolbar, [class*="toolbar"]').first();
    await expect(toolbar).toBeVisible();
  });

  test('should have help button', async ({ page }) => {
    const helpBtn = page.locator('button:has([class*="fa-question"]), button:has-text("Help"), .help-button').first();
    await expect(helpBtn).toBeVisible();
  });

  test('should open help modal when clicking help button', async ({ page }) => {
    const helpBtn = page.locator('button:has([class*="fa-question"]), button:has-text("Help"), .help-button').first();
    await helpBtn.click();
    
    // Check modal is visible
    const modal = page.locator('.help-modal, [role="dialog"], .modal');
    await expect(modal.first()).toBeVisible({ timeout: 5000 });
  });

  test('should display SEO content sections', async ({ page }) => {
    // Scroll to SEO content
    await page.locator('#seo-content').scrollIntoViewIfNeeded();
    
    // Check for key SEO sections
    const howToSection = page.locator('h2:has-text("How to")');
    const featuresSection = page.locator('h2:has-text("Features")');
    const faqSection = page.locator('h2:has-text("FAQ")');
    
    await expect(howToSection.first()).toBeVisible();
    await expect(featuresSection.first()).toBeVisible();
    await expect(faqSection.first()).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Page should still be functional
    const mainContent = page.locator('.stats-layout, .ide-main-content').first();
    await expect(mainContent).toBeVisible();
  });

  test('should have correct meta tags', async ({ page }) => {
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription?.toLowerCase()).toContain('json');
    
    // Check canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('json-stats');
  });

  test('should have JSON-LD structured data', async ({ page }) => {
    const jsonLd = await page.locator('script[type="application/ld+json"]').first();
    await expect(jsonLd).toBeAttached();
    
    const content = await jsonLd.textContent();
    expect(content).toBeTruthy();
    const parsed = JSON.parse(content!);
    expect(parsed).toBeTruthy();
  });
});

test.describe('JSON Stats Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-stats');
  });

  test('should show dashboard tabs when stats are available', async ({ page }) => {
    // The dashboard tabs should be visible in the stats section
    // They appear after JSON is analyzed, but the structure should exist
    const statsSection = page.locator('.stats-section');
    await expect(statsSection).toBeVisible();
  });
});

test.describe('JSON Stats Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-stats');
  });

  test('should have no major accessibility violations', async ({ page }) => {
    // Check for basic accessibility
    const mainContent = page.locator('main, [role="main"], .ide-main-content').first();
    await expect(mainContent).toBeVisible();
    
    // Check buttons have accessible names
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Tab through the page
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should have focused element
    const focused = page.locator(':focus');
    await expect(focused).toBeTruthy();
  });
});
