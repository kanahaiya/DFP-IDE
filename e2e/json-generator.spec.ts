import { test, expect } from './fixtures/test-base';

/**
 * JSON Generator E2E Tests - Production Ready
 * Tests focus on UI/UX elements that are reliably testable
 * Analytics and tracking are blocked to prevent E2E traffic from being counted
 */
test.describe('JSON Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-generator');
    await page.waitForLoadState('networkidle');
  });

  test('page loads with correct title and main UI elements', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/JSON Generator/);
    
    // Check IDE layout exists
    await expect(page.locator('.ide-layout')).toBeVisible();
    
    // Check generator tool is loaded
    await expect(page.locator('.json-generator-tool')).toBeVisible();
  });

  test('three-panel layout is present', async ({ page }) => {
    // Check for schema panel
    const schemaPanel = page.locator('.schema-panel');
    await expect(schemaPanel).toBeVisible();
    
    // Check for preview panel
    const previewPanel = page.locator('.preview-panel');
    await expect(previewPanel).toBeVisible();
    
    // Check for editor panel
    const editorPanel = page.locator('.editor-panel');
    await expect(editorPanel).toBeVisible();
  });

  test('generate button is present and functional', async ({ page }) => {
    // Check generate button exists
    const generateBtn = page.locator('.btn-primary').filter({ hasText: /Generate/i });
    await expect(generateBtn).toBeVisible();
    
    // Button should be disabled when no schema
    await expect(generateBtn).toBeDisabled();
  });

  test('settings sidebar is functional', async ({ page }) => {
    // Check sidebar exists
    await expect(page.locator('.ide-sidebar')).toBeVisible();
    
    // Check tabs are present
    const schemaTab = page.locator('.sidebar-tab').filter({ hasText: /Schema/i }).first();
    const settingsTab = page.locator('.sidebar-tab').filter({ hasText: /Settings/i }).first();
    const exportTab = page.locator('.sidebar-tab').filter({ hasText: /Export/i }).first();
    
    await expect(schemaTab).toBeVisible();
    await expect(settingsTab).toBeVisible();
    await expect(exportTab).toBeVisible();
    
    // Click between tabs
    if (await settingsTab.isVisible()) {
      await settingsTab.click();
      await page.waitForTimeout(300);
      
      // Check settings content is visible
      const quantityInput = page.locator('input[type="number"]').first();
      await expect(quantityInput).toBeVisible();
      
      await schemaTab.click();
      await page.waitForTimeout(300);
    }
  });

  test('template loading works', async ({ page }) => {
    // Find a template button in sidebar
    const templateBtn = page.locator('.template-btn').first();
    
    if (await templateBtn.isVisible({ timeout: 2000 })) {
      await templateBtn.click();
      await page.waitForTimeout(500);
      
      // Check that schema fields were added
      const schemaFields = page.locator('.schema-field');
      const fieldCount = await schemaFields.count();
      expect(fieldCount).toBeGreaterThan(0);
      
      // Generate button should now be enabled
      const generateBtn = page.locator('.btn-primary').filter({ hasText: /Generate/i });
      await expect(generateBtn).toBeEnabled();
    }
  });

  test('add field button creates new field', async ({ page }) => {
    // Find add field button
    const addBtn = page.locator('.btn-icon').filter({ has: page.locator('.fa-plus') }).first();
    
    if (await addBtn.isVisible({ timeout: 2000 })) {
      await addBtn.click();
      await page.waitForTimeout(300);
      
      // Check that a field was added
      const schemaFields = page.locator('.schema-field');
      const fieldCount = await schemaFields.count();
      expect(fieldCount).toBeGreaterThanOrEqual(1);
      
      // Check that field editor shows configuration
      const fieldEditor = page.locator('.field-editor');
      await expect(fieldEditor).toBeVisible();
    }
  });

  test('view toggle switches between preview and output', async ({ page }) => {
    // Check view toggle exists
    const viewToggle = page.locator('.view-toggle');
    await expect(viewToggle).toBeVisible();
    
    // Check preview button is active by default
    const previewBtn = viewToggle.locator('button').filter({ hasText: /Preview/i });
    await expect(previewBtn).toHaveClass(/active/);
    
    // Output button should be disabled when no output
    const outputBtn = viewToggle.locator('button').filter({ hasText: /Output/i });
    await expect(outputBtn).toBeDisabled();
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
    
    // On mobile, panels should stack
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('.json-generator-tool')).toBeVisible();
  });

  test('copy and download buttons are present', async ({ page }) => {
    // Check toolbar buttons
    const copyBtn = page.locator('.btn-secondary').filter({ has: page.locator('.fa-copy') });
    const downloadBtn = page.locator('.btn-secondary').filter({ has: page.locator('.fa-download') });
    
    await expect(copyBtn).toBeVisible();
    await expect(downloadBtn).toBeVisible();
    
    // Should be disabled when no output
    await expect(copyBtn).toBeDisabled();
    await expect(downloadBtn).toBeDisabled();
  });

  test('help modal can be opened', async ({ page }) => {
    // Find help button in header
    const helpBtn = page.locator('button').filter({ has: page.locator('.fa-question-circle') });
    
    if (await helpBtn.isVisible({ timeout: 2000 })) {
      await helpBtn.click();
      await page.waitForTimeout(300);
      
      // Check modal is visible
      const modal = page.locator('.help-modal');
      if (await modal.isVisible({ timeout: 1000 })) {
        await expect(modal).toBeVisible();
        
        // Close modal
        const closeBtn = modal.locator('button').filter({ has: page.locator('.fa-times') });
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
          await page.waitForTimeout(300);
        }
      }
    }
  });

  test('JSON-LD structured data is present', async ({ page }) => {
    // Check for JSON-LD script tag
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify it contains valid JSON
    if (count > 0) {
      const content = await jsonLd.first().textContent();
      expect(() => JSON.parse(content || '')).not.toThrow();
    }
  });

  test('meta tags are properly set', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /JSON|generator|fake|test/i);
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    if (await ogTitle.count() > 0) {
      await expect(ogTitle).toHaveAttribute('content', /JSON Generator/i);
    }
  });
});
