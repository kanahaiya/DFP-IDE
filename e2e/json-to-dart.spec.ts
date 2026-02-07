import { test, expect } from './fixtures/test-base';

test.describe('JSON to Dart Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-dart');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON to Dart/i);
  });

  test('should display input and output panels', async ({ page }) => {
    await expect(page.getByText('JSON Input')).toBeVisible();
    await expect(page.getByText('Dart Output')).toBeVisible();
  });

  test('should convert simple JSON to Dart class', async ({ page }) => {
    const testJson = JSON.stringify({
      name: 'John',
      age: 30,
      isActive: true
    }, null, 2);

    const inputEditor = page.locator('.monaco-editor').first();
    await inputEditor.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.type(testJson);
    
    await page.waitForTimeout(500);
    
    const outputContent = await page.locator('.monaco-editor').nth(1).textContent();
    expect(outputContent).toContain('class');
    expect(outputContent).toContain('fromJson');
  });

  test('should display settings sidebar with tabs', async ({ page }) => {
    await expect(page.getByText('Style')).toBeVisible();
    await expect(page.getByText('Naming')).toBeVisible();
    await expect(page.getByText('Methods')).toBeVisible();
    await expect(page.getByText('Presets')).toBeVisible();
  });

  test('should allow changing code style', async ({ page }) => {
    await page.getByText('Style').click();
    
    const freezedRadio = page.getByRole('radio', { name: /Freezed/i });
    await freezedRadio.click();
    
    await expect(freezedRadio).toBeChecked();
  });

  test('should have presets available', async ({ page }) => {
    await page.getByText('Presets').click();
    
    await expect(page.getByText('Default')).toBeVisible();
    await expect(page.getByText('Flutter Model')).toBeVisible();
    await expect(page.getByText('Freezed')).toBeVisible();
  });

  test('should display SEO content', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    await expect(page.getByText('How to Convert JSON to Dart Classes')).toBeVisible();
    await expect(page.getByText('JSON to Dart Converter Features')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.getByText('JSON Input')).toBeVisible();
    await expect(page.getByText('Dart Output')).toBeVisible();
  });

  test('should have copy and download buttons', async ({ page }) => {
    const copyButton = page.getByRole('button', { name: /copy/i });
    const downloadButton = page.getByRole('button', { name: /download/i });
    
    await expect(copyButton).toBeVisible();
    await expect(downloadButton).toBeVisible();
  });
});
