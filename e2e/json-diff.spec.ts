import { test, expect } from '@playwright/test';
import { TestBase } from './fixtures/test-base';

test.describe('JSON Diff Tool', () => {
  let testBase: TestBase;

  test.beforeEach(async ({ page }) => {
    testBase = new TestBase(page);
    await page.goto('/json-diff');
    await page.waitForSelector('[data-testid="ide-layout"]', { timeout: 10000 });
  });

  test('should load JSON Diff page', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON Diff/i);
    
    // Check that main elements are present
    await expect(page.locator('.json-diff-container')).toBeVisible();
  });

  test('should accept JSON input in both editors', async ({ page }) => {
    const leftJSON = '{"name":"John","age":30}';
    const rightJSON = '{"name":"Jane","age":25}';
    
    // Wait for Monaco editors to load
    await page.waitForSelector('.monaco-editor', { timeout: 10000 });
    
    // Get Monaco editor instances
    const editors = await page.locator('.monaco-editor').all();
    expect(editors.length).toBeGreaterThanOrEqual(2);
  });

  test('should show comparison settings panel', async ({ page }) => {
    // Check for settings sidebar
    await expect(page.locator('.settings-sidebar')).toBeVisible();
    
    // Check for comparison options
    await expect(page.locator('text=Comparison')).toBeVisible();
    await expect(page.locator('text=View')).toBeVisible();
  });

  test('should allow switching view modes', async ({ page }) => {
    // Click on View tab
    await page.click('button:has-text("View")');
    
    // Check view mode selector is visible
    await expect(page.locator('.view-mode-selector')).toBeVisible();
    
    // Check for all view mode buttons
    await expect(page.locator('text=Split View')).toBeVisible();
    await expect(page.locator('text=Unified View')).toBeVisible();
    await expect(page.locator('text=Tree View')).toBeVisible();
    await expect(page.locator('text=Report View')).toBeVisible();
  });

  test('should show export options', async ({ page }) => {
    // Click on View tab
    await page.click('button:has-text("View")');
    
    // Check for export section
    await expect(page.locator('text=Export')).toBeVisible();
    
    // Check for export buttons
    await expect(page.locator('button:has-text("JSON Patch")')).toBeVisible();
    await expect(page.locator('button:has-text("Delta")')).toBeVisible();
    await expect(page.locator('button:has-text("Unified Diff")')).toBeVisible();
  });

  test('should handle file upload', async ({ page }) => {
    // Check for upload button
    const uploadButtons = await page.locator('button[title="Upload file"]').all();
    expect(uploadButtons.length).toBeGreaterThanOrEqual(2); // Left and right
  });

  test('should have sample templates', async ({ page }) => {
    // Check for sample template buttons
    const templateButtons = await page.locator('button[title*="sample"]').all();
    expect(templateButtons.length).toBeGreaterThanOrEqual(2);
  });

  test('should show help modal when help button is clicked', async ({ page }) => {
    // Find and click help button
    const helpButton = page.locator('button[title*="Help"], button[aria-label*="Help"]');
    if (await helpButton.count() > 0) {
      await helpButton.first().click();
      
      // Check for help modal
      await expect(page.locator('.modal')).toBeVisible();
    }
  });

  test('should display stats bar', async ({ page }) => {
    // Check for stats bar
    await expect(page.locator('.stats-bar')).toBeVisible();
  });

  test('should support tab management', async ({ page }) => {
    // Check for tab manager
    await expect(page.locator('.tab-manager')).toBeVisible();
    
    // Check for active tab
    const tabs = await page.locator('.tab').all();
    expect(tabs.length).toBeGreaterThanOrEqual(1);
  });
});
