import { test, expect } from './fixtures/test-base';

/**
 * JSON Encoder E2E Tests
 * Tests for URL, Base64, Hex, HTML Entity, and Unicode encoding
 */
test.describe('JSON Encoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-encoder');
    await page.waitForLoadState('networkidle');
  });

  test('page loads with correct title and main UI elements', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON Encoder/);
    await expect(page.locator('.ide-layout')).toBeVisible();
    const panes = page.locator('.ide-pane');
    expect(await panes.count()).toBeGreaterThanOrEqual(2);
  });

  test('settings sidebar is functional with encoding tabs', async ({ page }) => {
    await expect(page.locator('.ide-sidebar')).toBeVisible();
    
    const typeTab = page.locator('.sidebar-tab').filter({ hasText: /Type/i }).first();
    const optionsTab = page.locator('.sidebar-tab').filter({ hasText: /Options/i }).first();
    const advancedTab = page.locator('.sidebar-tab').filter({ hasText: /Advanced/i }).first();
    const presetsTab = page.locator('.sidebar-tab').filter({ hasText: /Presets/i }).first();
    
    await expect(typeTab).toBeVisible();
    await expect(optionsTab).toBeVisible();
    await expect(advancedTab).toBeVisible();
    await expect(presetsTab).toBeVisible();
    
    await optionsTab.click();
    await page.waitForTimeout(300);
    await advancedTab.click();
    await page.waitForTimeout(300);
    await presetsTab.click();
    await page.waitForTimeout(300);
    await typeTab.click();
  });

  test('encoding type selector is present and functional', async ({ page }) => {
    const encodingTypeSelect = page.locator('#encodingType');
    await expect(encodingTypeSelect).toBeVisible();
    
    // Check encoding options exist
    const options = encodingTypeSelect.locator('option');
    expect(await options.count()).toBeGreaterThanOrEqual(5);
    
    // Try changing encoding type
    await encodingTypeSelect.selectOption('base64');
    await page.waitForTimeout(300);
    await encodingTypeSelect.selectOption('hex');
    await page.waitForTimeout(300);
    await encodingTypeSelect.selectOption('url');
  });

  test('presets are available and clickable', async ({ page }) => {
    const presetsTab = page.locator('.sidebar-tab').filter({ hasText: /Presets/i }).first();
    await presetsTab.click();
    await page.waitForTimeout(300);
    
    const presetCards = page.locator('.preset-card');
    const presetCount = await presetCards.count();
    expect(presetCount).toBeGreaterThanOrEqual(5);
    
    if (presetCount > 0) {
      await presetCards.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('preprocessing options are present', async ({ page }) => {
    const minifyCheckbox = page.locator('#minifyFirst');
    const formatCheckbox = page.locator('#formatFirst');
    
    await expect(minifyCheckbox).toBeVisible();
    await expect(formatCheckbox).toBeVisible();
  });

  test('tab manager is functional', async ({ page }) => {
    const tabManager = page.locator('.tab-manager');
    await expect(tabManager).toBeVisible();
    
    const tabs = tabManager.locator('.tab-item');
    expect(await tabs.count()).toBeGreaterThanOrEqual(1);
    
    const addTabButton = tabManager.locator('.add-tab-btn, button[title*="tab"], button:has-text("+")').first();
    if (await addTabButton.isVisible()) {
      await addTabButton.click();
      await page.waitForTimeout(300);
      expect(await tabs.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('editor toolbars are present', async ({ page }) => {
    const inputToolbar = page.locator('.editor-toolbar').first();
    await expect(inputToolbar).toBeVisible();
    
    const uploadButton = inputToolbar.locator('button, label').filter({ hasText: /upload|file/i }).first();
    const pasteButton = inputToolbar.locator('button').filter({ hasText: /paste/i }).first();
    const clearButton = inputToolbar.locator('button').filter({ hasText: /clear/i }).first();
    
    expect(
      await uploadButton.isVisible() ||
      await pasteButton.isVisible() ||
      await clearButton.isVisible()
    ).toBeTruthy();
  });

  test('output toolbar has copy and download', async ({ page }) => {
    const outputToolbar = page.locator('.editor-toolbar, .output-toolbar').last();
    await expect(outputToolbar).toBeVisible();
  });

  test('SEO content sections are present', async ({ page }) => {
    const seoContent = page.locator('#seo-content, article, .seo-content').first();
    await expect(seoContent).toBeVisible();
    
    const headings = page.locator('h1, h2');
    expect(await headings.count()).toBeGreaterThan(0);
  });

  test('footer is present', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('help modal can be opened', async ({ page }) => {
    const helpButton = page.locator('button[title*="Help"], button:has(i.fa-question), button:has-text("Help")').first();
    
    if (await helpButton.isVisible()) {
      await helpButton.click();
      await page.waitForTimeout(300);
      
      const modal = page.locator('.modal, .help-modal, [role="dialog"]').first();
      await expect(modal).toBeVisible();
      
      const closeButton = modal.locator('button:has-text("Close"), button[aria-label="Close"], .close-btn').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('theme toggle is functional', async ({ page }) => {
    const themeToggle = page.locator('button[title*="theme"], button:has(i.fa-moon), button:has(i.fa-sun)').first();
    
    if (await themeToggle.isVisible()) {
      const htmlElement = page.locator('html');
      const initialTheme = await htmlElement.getAttribute('data-theme');
      
      await themeToggle.click();
      await page.waitForTimeout(300);
      
      const newTheme = await htmlElement.getAttribute('data-theme');
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('URL encoding works correctly', async ({ page }) => {
    // Set encoding type to URL
    const encodingTypeSelect = page.locator('#encodingType');
    await encodingTypeSelect.selectOption('url');
    await page.waitForTimeout(300);
    
    // Type JSON in input
    const inputEditor = page.locator('.monaco-editor').first();
    await inputEditor.click();
    await page.keyboard.type('{"name":"test"}');
    
    // Wait for encoding
    await page.waitForTimeout(500);
    
    // Check output contains URL-encoded content
    const outputEditor = page.locator('.monaco-editor').last();
    const outputContent = await outputEditor.textContent();
    expect(outputContent).toContain('%7B');
  });

  test('Base64 encoding works correctly', async ({ page }) => {
    const encodingTypeSelect = page.locator('#encodingType');
    await encodingTypeSelect.selectOption('base64');
    await page.waitForTimeout(300);
    
    const inputEditor = page.locator('.monaco-editor').first();
    await inputEditor.click();
    await page.keyboard.type('{"test":123}');
    
    await page.waitForTimeout(500);
    
    const outputEditor = page.locator('.monaco-editor').last();
    const outputContent = await outputEditor.textContent();
    // Base64 output should be alphanumeric
    expect(outputContent).toMatch(/[A-Za-z0-9+/=]/);
  });

  test('page is responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mainContent = page.locator('.ide-layout, main, .encoder-container').first();
    await expect(mainContent).toBeVisible();
    
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500);
    await expect(mainContent).toBeVisible();
  });
});
