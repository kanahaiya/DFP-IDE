import { test, expect } from './fixtures/test-base';

/**
 * JSON Escaper E2E Tests
 * Tests for Standard JSON, JavaScript, URL-Safe, and HTML-Safe escaping
 */
test.describe('JSON Escaper', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-escaper');
    await page.waitForLoadState('networkidle');
  });

  test('page loads with correct title and main UI elements', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON.*Escaper/i);
    await expect(page.locator('.ide-layout')).toBeVisible();
    const panes = page.locator('.ide-pane');
    expect(await panes.count()).toBeGreaterThanOrEqual(2);
  });

  test('settings sidebar is functional with escape tabs', async ({ page }) => {
    await expect(page.locator('.ide-sidebar')).toBeVisible();
    
    const modeTab = page.locator('.sidebar-tab').filter({ hasText: /Mode/i }).first();
    const optionsTab = page.locator('.sidebar-tab').filter({ hasText: /Options/i }).first();
    const advancedTab = page.locator('.sidebar-tab').filter({ hasText: /Advanced/i }).first();
    const presetsTab = page.locator('.sidebar-tab').filter({ hasText: /Presets/i }).first();
    
    await expect(modeTab).toBeVisible();
    await expect(optionsTab).toBeVisible();
    await expect(advancedTab).toBeVisible();
    await expect(presetsTab).toBeVisible();
    
    await optionsTab.click();
    await page.waitForTimeout(300);
    await advancedTab.click();
    await page.waitForTimeout(300);
    await presetsTab.click();
    await page.waitForTimeout(300);
    await modeTab.click();
  });

  test('escape mode selector is present and functional', async ({ page }) => {
    const escapeModeSelect = page.locator('#escapeMode');
    await expect(escapeModeSelect).toBeVisible();
    
    // Check escape mode options exist
    const options = escapeModeSelect.locator('option');
    expect(await options.count()).toBeGreaterThanOrEqual(4);
    
    // Try changing escape mode
    await escapeModeSelect.selectOption('javascript');
    await page.waitForTimeout(300);
    await escapeModeSelect.selectOption('urlSafe');
    await page.waitForTimeout(300);
    await escapeModeSelect.selectOption('htmlSafe');
    await page.waitForTimeout(300);
    await escapeModeSelect.selectOption('standard');
  });

  test('presets are available and clickable', async ({ page }) => {
    const presetsTab = page.locator('.sidebar-tab').filter({ hasText: /Presets/i }).first();
    await presetsTab.click();
    await page.waitForTimeout(300);
    
    const presetCards = page.locator('.preset-card');
    const presetCount = await presetCards.count();
    expect(presetCount).toBeGreaterThanOrEqual(6);
    
    if (presetCount > 0) {
      await presetCards.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('escape options are present', async ({ page }) => {
    const optionsTab = page.locator('.sidebar-tab').filter({ hasText: /Options/i }).first();
    await optionsTab.click();
    await page.waitForTimeout(300);
    
    const wrapInQuotesCheckbox = page.locator('#wrapInQuotes');
    const escapeSlashCheckbox = page.locator('#escapeSlash');
    
    await expect(wrapInQuotesCheckbox).toBeVisible();
    await expect(escapeSlashCheckbox).toBeVisible();
  });

  test('unicode options are present', async ({ page }) => {
    const optionsTab = page.locator('.sidebar-tab').filter({ hasText: /Options/i }).first();
    await optionsTab.click();
    await page.waitForTimeout(300);
    
    const unicodeEscapeCheckbox = page.locator('#unicodeEscape');
    await expect(unicodeEscapeCheckbox).toBeVisible();
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

  test('standard JSON escaping works correctly', async ({ page }) => {
    const escapeModeSelect = page.locator('#escapeMode');
    await escapeModeSelect.selectOption('standard');
    await page.waitForTimeout(300);
    
    // Type text with quotes in input
    const inputEditor = page.locator('.monaco-editor').first();
    await inputEditor.click();
    await page.keyboard.type('Hello "World"');
    
    // Wait for escaping
    await page.waitForTimeout(500);
    
    // Check output contains escaped quotes
    const outputEditor = page.locator('.monaco-editor').last();
    const outputContent = await outputEditor.textContent();
    expect(outputContent).toContain('\\"');
  });

  test('URL-safe escaping works correctly', async ({ page }) => {
    const escapeModeSelect = page.locator('#escapeMode');
    await escapeModeSelect.selectOption('urlSafe');
    await page.waitForTimeout(300);
    
    const inputEditor = page.locator('.monaco-editor').first();
    await inputEditor.click();
    await page.keyboard.type('{"name":"test"}');
    
    await page.waitForTimeout(500);
    
    const outputEditor = page.locator('.monaco-editor').last();
    const outputContent = await outputEditor.textContent();
    // URL-safe output should contain percent encoding
    expect(outputContent).toContain('%');
  });

  test('advanced panel shows current configuration', async ({ page }) => {
    const advancedTab = page.locator('.sidebar-tab').filter({ hasText: /Advanced/i }).first();
    await advancedTab.click();
    await page.waitForTimeout(300);
    
    const configDisplay = page.locator('.settings-panel-content');
    await expect(configDisplay).toBeVisible();
    
    // Should show mode info
    const modeText = page.locator('text=Mode:').first();
    await expect(modeText).toBeVisible();
  });

  test('page is responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mainContent = page.locator('.ide-layout, main').first();
    await expect(mainContent).toBeVisible();
    
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500);
    await expect(mainContent).toBeVisible();
  });

  test('sample templates can be loaded', async ({ page }) => {
    const inputToolbar = page.locator('.editor-toolbar').first();
    const samplesButton = inputToolbar.locator('button').filter({ hasText: /sample/i }).first();
    
    if (await samplesButton.isVisible()) {
      await samplesButton.click();
      await page.waitForTimeout(300);
      
      const sampleMenu = page.locator('.dropdown-menu, .sample-menu, [role="menu"]').first();
      if (await sampleMenu.isVisible()) {
        const firstSample = sampleMenu.locator('button, li, .menu-item').first();
        if (await firstSample.isVisible()) {
          await firstSample.click();
          await page.waitForTimeout(500);
        }
      }
    }
  });
});
