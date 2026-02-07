import { test, expect } from './fixtures/test-base';

test.describe('JSON Unflattener Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-unflattener');
    // Wait for the page to fully load
    await page.waitForSelector('.ide-layout', { timeout: 10000 });
  });

  test.describe('Page Load', () => {
    test('should load the JSON Unflattener page', async ({ page }) => {
      await expect(page).toHaveTitle(/JSON Unflattener/i);
    });

    test('should display the IDE layout', async ({ page }) => {
      await expect(page.locator('.ide-layout')).toBeVisible();
    });

    test('should display input and output panels', async ({ page }) => {
      await expect(page.locator('.input-panel')).toBeVisible();
      await expect(page.locator('.output-panel')).toBeVisible();
    });

    test('should display settings sidebar', async ({ page }) => {
      await expect(page.locator('.settings-sidebar')).toBeVisible();
    });

    test('should display SEO content section', async ({ page }) => {
      await expect(page.locator('#seo-content')).toBeVisible();
    });
  });

  test.describe('Settings Tabs', () => {
    test('should have Mode tab selected by default', async ({ page }) => {
      await expect(page.locator('.sidebar-tab.active')).toContainText('Mode');
    });

    test('should switch to Options tab', async ({ page }) => {
      await page.click('.sidebar-tab:has-text("Options")');
      await expect(page.locator('.sidebar-tab.active')).toContainText('Options');
    });

    test('should switch to Advanced tab', async ({ page }) => {
      await page.click('.sidebar-tab:has-text("Advanced")');
      await expect(page.locator('.sidebar-tab.active')).toContainText('Advanced');
    });

    test('should switch to Presets tab', async ({ page }) => {
      await page.click('.sidebar-tab:has-text("Presets")');
      await expect(page.locator('.sidebar-tab.active')).toContainText('Presets');
    });
  });

  test.describe('Mode Settings', () => {
    test('should display delimiter selector', async ({ page }) => {
      await expect(page.locator('#delimiter')).toBeVisible();
    });

    test('should have delimiter options', async ({ page }) => {
      const delimiterSelect = page.locator('#delimiter');
      await expect(delimiterSelect.locator('option')).toHaveCount(3);
    });

    test('should display conflict mode selector', async ({ page }) => {
      await expect(page.locator('#conflictMode')).toBeVisible();
    });

    test('should have conflict mode options', async ({ page }) => {
      const conflictSelect = page.locator('#conflictMode');
      await expect(conflictSelect.locator('option')).toHaveCount(3);
    });
  });

  test.describe('Options Settings', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('.sidebar-tab:has-text("Options")');
    });

    test('should display auto-detect arrays checkbox', async ({ page }) => {
      await expect(page.locator('#autoDetectArrays')).toBeVisible();
    });

    test('should display force array conversion checkbox', async ({ page }) => {
      await expect(page.locator('#forceArrayConversion')).toBeVisible();
    });

    test('should display format output checkbox', async ({ page }) => {
      await expect(page.locator('#formatOutput')).toBeVisible();
    });

    test('should display sort keys checkbox', async ({ page }) => {
      await expect(page.locator('#sortKeys')).toBeVisible();
    });
  });

  test.describe('Advanced Settings', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('.sidebar-tab:has-text("Advanced")');
    });

    test('should display preserve numbers checkbox', async ({ page }) => {
      await expect(page.locator('#preserveNumbers')).toBeVisible();
    });

    test('should display preserve booleans checkbox', async ({ page }) => {
      await expect(page.locator('#preserveBooleans')).toBeVisible();
    });

    test('should display preserve null checkbox', async ({ page }) => {
      await expect(page.locator('#preserveNull')).toBeVisible();
    });
  });

  test.describe('Presets', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('.sidebar-tab:has-text("Presets")');
    });

    test('should display preset buttons', async ({ page }) => {
      await expect(page.locator('.preset-button')).toHaveCount(8);
    });

    test('should have Auto Detect preset', async ({ page }) => {
      await expect(page.locator('.preset-button:has-text("Auto Detect")')).toBeVisible();
    });

    test('should have Database Import preset', async ({ page }) => {
      await expect(page.locator('.preset-button:has-text("Database Import")')).toBeVisible();
    });

    test('should have Form Data preset', async ({ page }) => {
      await expect(page.locator('.preset-button:has-text("Form Data")')).toBeVisible();
    });
  });

  test.describe('Toolbar Actions', () => {
    test('should display upload button', async ({ page }) => {
      await expect(page.locator('.editor-toolbar button:has-text("Upload")')).toBeVisible();
    });

    test('should display paste button', async ({ page }) => {
      await expect(page.locator('.editor-toolbar button:has-text("Paste")')).toBeVisible();
    });

    test('should display clear button', async ({ page }) => {
      await expect(page.locator('.editor-toolbar button:has-text("Clear")')).toBeVisible();
    });

    test('should display sample dropdown', async ({ page }) => {
      await expect(page.locator('.editor-toolbar .sample-dropdown')).toBeVisible();
    });

    test('should display copy button in output toolbar', async ({ page }) => {
      await expect(page.locator('.output-toolbar button:has-text("Copy")')).toBeVisible();
    });

    test('should display download button in output toolbar', async ({ page }) => {
      await expect(page.locator('.output-toolbar button:has-text("Download")')).toBeVisible();
    });
  });

  test.describe('SEO Content', () => {
    test('should display features section', async ({ page }) => {
      await expect(page.locator('.features-section')).toBeVisible();
    });

    test('should display how-to section', async ({ page }) => {
      await expect(page.locator('.how-to-section')).toBeVisible();
    });

    test('should display FAQ section', async ({ page }) => {
      await expect(page.locator('.faq-section')).toBeVisible();
    });

    test('should display related tools section', async ({ page }) => {
      await expect(page.locator('.related-tools-section')).toBeVisible();
    });

    test('should have link to JSON Flattener', async ({ page }) => {
      await expect(page.locator('a[href="/json-flattener"]')).toBeVisible();
    });
  });

  test.describe('Cross-Tool Links', () => {
    test('should link to JSON Flattener from related tools', async ({ page }) => {
      await expect(page.locator('a[href="/json-flattener"]')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('.ide-layout')).toBeVisible();
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('.ide-layout')).toBeVisible();
    });
  });

  test.describe('Help Modal', () => {
    test('should open help modal on click', async ({ page }) => {
      await page.click('button[aria-label="Help"]');
      await expect(page.locator('.help-modal')).toBeVisible();
    });

    test('should close help modal on close button', async ({ page }) => {
      await page.click('button[aria-label="Help"]');
      await expect(page.locator('.help-modal')).toBeVisible();
      await page.click('.help-modal .close-button');
      await expect(page.locator('.help-modal')).not.toBeVisible();
    });
  });
});
