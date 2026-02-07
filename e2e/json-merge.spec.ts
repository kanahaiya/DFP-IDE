import { test, expect } from './fixtures/test-base';

test.describe('JSON Merge Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-merge');
  });

  test('should load the page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON Merge Tool/);
  });

  test('should display the main UI elements', async ({ page }) => {
    // Check for input panes section
    await expect(page.locator('text=JSON Inputs')).toBeVisible();
    
    // Check for Add Input button
    await expect(page.locator('button:has-text("Add Input")')).toBeVisible();
    
    // Check for output section
    await expect(page.locator('text=Merged Output')).toBeVisible();
    
    // Check for sidebar tabs
    await expect(page.locator('text=Strategy')).toBeVisible();
    await expect(page.locator('text=Output')).toBeVisible();
    await expect(page.locator('text=Presets')).toBeVisible();
  });

  test('should start with 2 input panes', async ({ page }) => {
    const inputPanes = page.locator('.merge-input-pane');
    await expect(inputPanes).toHaveCount(2);
  });

  test('should add and remove input panes', async ({ page }) => {
    // Start with 2 panes
    await expect(page.locator('.merge-input-pane')).toHaveCount(2);
    
    // Click Add Input button
    await page.click('button:has-text("Add Input")');
    await expect(page.locator('.merge-input-pane')).toHaveCount(3);
    
    // Add more
    await page.click('button:has-text("Add Input")');
    await expect(page.locator('.merge-input-pane')).toHaveCount(4);
    
    // Add to maximum
    await page.click('button:has-text("Add Input")');
    await expect(page.locator('.merge-input-pane')).toHaveCount(5);
    
    // Button should be disabled at max
    const addButton = page.locator('button:has-text("Add Input")');
    await expect(addButton).toBeDisabled();
  });

  test('should perform simple merge of two JSON objects', async ({ page }) => {
    const input1 = {
      name: 'John',
      age: 30
    };
    
    const input2 = {
      email: 'john@example.com',
      city: 'New York'
    };
    
    // Find Monaco editors and type content
    const editors = page.locator('.monaco-editor').locator('textarea');
    
    // Type in first editor
    await editors.first().fill(JSON.stringify(input1, null, 2));
    
    // Type in second editor
    await editors.nth(1).fill(JSON.stringify(input2, null, 2));
    
    // Wait for merge to complete (debounced)
    await page.waitForTimeout(500);
    
    // Check that output contains merged data
    const outputText = await page.locator('.merge-output-section').textContent();
    expect(outputText).toContain('name');
    expect(outputText).toContain('email');
  });

  test('should switch between merge strategies', async ({ page }) => {
    // Click on Simple Merge strategy
    await page.click('.strategy-option:has-text("Simple Merge")');
    await expect(page.locator('.strategy-option:has-text("Simple Merge")')).toHaveClass(/selected/);
    
    // Click on Deep Merge strategy
    await page.click('.strategy-option:has-text("Deep Merge")');
    await expect(page.locator('.strategy-option:has-text("Deep Merge")')).toHaveClass(/selected/);
  });

  test('should apply presets', async ({ page }) => {
    // Click Presets tab
    await page.click('button:has-text("Presets")');
    
    // Click on Deep Merge preset
    await page.click('.preset-card:has-text("Deep Merge")');
    
    // Go back to Strategy tab and verify
    await page.click('button:has-text("Strategy")');
    await expect(page.locator('.strategy-option:has-text("Deep Merge")')).toHaveClass(/selected/);
  });

  test('should change output indentation', async ({ page }) => {
    // Click Output tab
    await page.click('button:has-text("Output")');
    
    // Click on 4 Spaces button
    await page.click('button.indent-button:has-text("4 Spaces")');
    await expect(page.locator('button.indent-button:has-text("4 Spaces")')).toHaveClass(/selected/);
    
    // Click on Minified
    await page.click('button.indent-button:has-text("Minified")');
    await expect(page.locator('button.indent-button:has-text("Minified")')).toHaveClass(/selected/);
  });

  test('should show validation errors for invalid JSON', async ({ page }) => {
    // Find Monaco editors and type invalid content
    const editors = page.locator('.monaco-editor').locator('textarea');
    
    // Type invalid JSON in first editor
    await editors.first().fill('{invalid json}');
    
    // Wait for validation
    await page.waitForTimeout(500);
    
    // Check for error indication
    const errorMessage = page.locator('.input-error-message, .merge-errors');
    await expect(errorMessage).toBeVisible();
  });

  test('should display SEO content sections', async ({ page }) => {
    // Scroll down to SEO content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check for key SEO sections
    await expect(page.locator('h2:has-text("How to Merge JSON")')).toBeVisible();
    await expect(page.locator('h2:has-text("Features")')).toBeVisible();
  });

  test('should show help modal', async ({ page }) => {
    // Click help button
    await page.click('button[title="Help"]');
    
    // Check modal is visible
    await expect(page.locator('text=JSON Merge Tool Help')).toBeVisible();
    
    // Close modal
    await page.keyboard.press('Escape');
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Main elements should still be visible
    await expect(page.locator('text=JSON Inputs')).toBeVisible();
    await expect(page.locator('text=Merged Output')).toBeVisible();
    
    // Input panes should stack vertically (check grid layout)
    const inputsContainer = page.locator('.merge-inputs-container');
    await expect(inputsContainer).toBeVisible();
  });
});
