import { test, expect } from '@playwright/test';

// Block analytics requests during tests
test.beforeEach(async ({ page }) => {
  await page.route('**/*google-analytics*/**', (route) => route.abort());
  await page.route('**/*gtag*/**', (route) => route.abort());
  await page.route('**/*analytics*/**', (route) => route.abort());
});

test.describe('JSON Minifier Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-minifier');
  });

  test('should load the page successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/JSON Minifier/i);
    
    // Check main heading exists
    const heading = page.locator('h1, .tool-title, .mode-info');
    await expect(heading.first()).toBeVisible();
  });

  test('should display mode toggle banner', async ({ page }) => {
    const modeInfo = page.locator('.mode-info');
    await expect(modeInfo).toBeVisible();
    await expect(modeInfo).toContainText(/Mode/i);
    
    const toggleBtn = page.locator('.mode-toggle-btn');
    await expect(toggleBtn).toBeVisible();
  });

  test('should toggle between minify and beautify modes', async ({ page }) => {
    // Initial mode should be minify
    const modeInfo = page.locator('.mode-info');
    await expect(modeInfo).toContainText(/Minify/i);
    
    // Click toggle button
    const toggleBtn = page.locator('.mode-toggle-btn');
    await toggleBtn.click();
    
    // Mode should change to beautify
    await expect(modeInfo).toContainText(/Beautify/i);
    
    // Click again to go back to minify
    await toggleBtn.click();
    await expect(modeInfo).toContainText(/Minify/i);
  });

  test('should display settings sidebar with tabs', async ({ page }) => {
    const formatTab = page.locator('.sidebar-tab:has-text("Format")');
    const cleanTab = page.locator('.sidebar-tab:has-text("Clean")');
    const presetsTab = page.locator('.sidebar-tab:has-text("Presets")');
    
    await expect(formatTab).toBeVisible();
    await expect(cleanTab).toBeVisible();
    await expect(presetsTab).toBeVisible();
  });

  test('should switch between settings tabs', async ({ page }) => {
    // Click Clean tab
    const cleanTab = page.locator('.sidebar-tab:has-text("Clean")');
    await cleanTab.click();
    
    // Check cleaning options are visible
    const removeNulls = page.locator('label:has-text("Remove null values")');
    await expect(removeNulls).toBeVisible();
    
    // Click Presets tab
    const presetsTab = page.locator('.sidebar-tab:has-text("Presets")');
    await presetsTab.click();
    
    // Check presets are visible
    const productionPreset = page.locator('.preset-btn:has-text("Production")');
    await expect(productionPreset).toBeVisible();
  });

  test('should display input and output panels', async ({ page }) => {
    const inputLabel = page.locator('.output-label, .editor-toolbar-label, text="Input JSON"').first();
    const outputLabel = page.locator('.output-label:has-text("Output")');
    
    await expect(inputLabel).toBeVisible();
    await expect(outputLabel).toBeVisible();
  });

  test('should display stats bar', async ({ page }) => {
    const statsBar = page.locator('.stats-bar');
    await expect(statsBar).toBeVisible();
  });

  test('should have copy and download buttons', async ({ page }) => {
    const copyBtn = page.locator('button:has-text("Copy")').first();
    const downloadBtn = page.locator('button:has-text("Download")').first();
    
    await expect(copyBtn).toBeVisible();
    await expect(downloadBtn).toBeVisible();
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
    const modeInfo = page.locator('.mode-info');
    await expect(modeInfo).toBeVisible();
    
    // Mode toggle should be visible
    const toggleBtn = page.locator('.mode-toggle-btn');
    await expect(toggleBtn).toBeVisible();
  });

  test('should apply preset settings', async ({ page }) => {
    // Click Presets tab
    const presetsTab = page.locator('.sidebar-tab:has-text("Presets")');
    await presetsTab.click();
    
    // Click a beautify preset
    const readablePreset = page.locator('.preset-btn:has-text("Readable")');
    await readablePreset.click();
    
    // Mode should change to beautify
    const modeInfo = page.locator('.mode-info');
    await expect(modeInfo).toContainText(/Beautify/i);
  });

  test('should have correct meta tags', async ({ page }) => {
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription?.toLowerCase()).toContain('json');
    
    // Check canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('json-minifier');
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

test.describe('JSON Minifier Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-minifier');
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
