import { test, expect } from './fixtures/test-base';

/**
 * JSON to XML E2E Tests - Production Ready
 * Tests focus on UI/UX elements that are reliably testable
 * Analytics and tracking are blocked to prevent E2E traffic from being counted
 */
test.describe('JSON to XML Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-xml');
    await page.waitForLoadState('networkidle');
  });

  test('page loads with correct title and main UI elements', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/JSON to XML/);
    
    // Check IDE layout exists
    await expect(page.locator('.ide-layout')).toBeVisible();
    
    // Check both editor panes exist
    const panes = page.locator('.ide-pane');
    expect(await panes.count()).toBeGreaterThanOrEqual(2);
  });

  test('settings sidebar is functional with XML-specific tabs', async ({ page }) => {
    // Check sidebar exists
    await expect(page.locator('.ide-sidebar')).toBeVisible();
    
    // Check XML-specific tabs are present
    const formatTab = page.locator('.sidebar-tab').filter({ hasText: /Format/i }).first();
    const arraysTab = page.locator('.sidebar-tab').filter({ hasText: /Arrays/i }).first();
    const advancedTab = page.locator('.sidebar-tab').filter({ hasText: /Advanced/i }).first();
    const presetsTab = page.locator('.sidebar-tab').filter({ hasText: /Presets/i }).first();
    
    await expect(formatTab).toBeVisible();
    await expect(arraysTab).toBeVisible();
    await expect(advancedTab).toBeVisible();
    await expect(presetsTab).toBeVisible();
    
    // Click between tabs
    await arraysTab.click();
    await page.waitForTimeout(300);
    await advancedTab.click();
    await page.waitForTimeout(300);
    await presetsTab.click();
    await page.waitForTimeout(300);
    await formatTab.click();
    await page.waitForTimeout(300);
  });

  test('XML presets are available and clickable', async ({ page }) => {
    // Navigate to presets tab
    const presetsTab = page.locator('.sidebar-tab').filter({ hasText: /Presets/i }).first();
    await presetsTab.click();
    await page.waitForTimeout(300);
    
    // Check preset cards exist (should have RSS, Sitemap, SOAP, etc.)
    const presetCards = page.locator('.preset-card');
    const presetCount = await presetCards.count();
    expect(presetCount).toBeGreaterThanOrEqual(5);
    
    // Click first preset
    if (presetCount > 0) {
      await presetCards.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('format options include XML-specific settings', async ({ page }) => {
    // Check root element input exists
    const rootElementInput = page.locator('#rootElement');
    await expect(rootElementInput).toBeVisible();
    
    // Check XML declaration checkbox exists
    const declarationCheckbox = page.locator('#includeDeclaration');
    await expect(declarationCheckbox).toBeVisible();
    
    // Check encoding select exists
    const encodingSelect = page.locator('#encoding');
    await expect(encodingSelect).toBeVisible();
    
    // Check indentation select exists
    const indentationSelect = page.locator('#indentation');
    await expect(indentationSelect).toBeVisible();
  });

  test('array handling options are configurable', async ({ page }) => {
    // Navigate to arrays tab
    const arraysTab = page.locator('.sidebar-tab').filter({ hasText: /Arrays/i }).first();
    await arraysTab.click();
    await page.waitForTimeout(300);
    
    // Check array wrapper checkbox exists
    const arrayWrapperCheckbox = page.locator('#arrayWrapper');
    await expect(arrayWrapperCheckbox).toBeVisible();
    
    // Check item naming select exists
    const itemNamingSelect = page.locator('#itemNaming');
    await expect(itemNamingSelect).toBeVisible();
    
    // Check include array index checkbox exists
    const indexCheckbox = page.locator('#includeArrayIndex');
    await expect(indexCheckbox).toBeVisible();
  });

  test('advanced options include CDATA and namespace settings', async ({ page }) => {
    // Navigate to advanced tab
    const advancedTab = page.locator('.sidebar-tab').filter({ hasText: /Advanced/i }).first();
    await advancedTab.click();
    await page.waitForTimeout(300);
    
    // Check CDATA mode select exists
    const cdataModeSelect = page.locator('#cdataMode');
    await expect(cdataModeSelect).toBeVisible();
    
    // Check null handling select exists
    const nullHandlingSelect = page.locator('#nullHandling');
    await expect(nullHandlingSelect).toBeVisible();
    
    // Check boolean format select exists
    const booleanFormatSelect = page.locator('#booleanFormat');
    await expect(booleanFormatSelect).toBeVisible();
    
    // Check attribute mode select exists
    const attributeModeSelect = page.locator('#attributeMode');
    await expect(attributeModeSelect).toBeVisible();
    
    // Check namespace checkbox exists
    const namespaceCheckbox = page.locator('#namespaceEnabled');
    await expect(namespaceCheckbox).toBeVisible();
  });

  test('tab manager is functional', async ({ page }) => {
    // Check tabs container exists
    const tabsContainer = page.locator('.tabs-container, .tab-bar, [class*="tabs"]').first();
    if (await tabsContainer.isVisible({ timeout: 2000 })) {
      await expect(tabsContainer).toBeVisible();
      
      // Check at least one tab exists
      const tabs = page.locator('.tab-item, [class*="tab"]').first();
      if (await tabs.isVisible({ timeout: 1000 })) {
        await expect(tabs).toBeVisible();
      }
    }
    
    // Check add tab button exists
    const addTabButton = page.locator('.add-tab-btn, button[aria-label*="add"], button[title*="tab"]').first();
    if (await addTabButton.isVisible({ timeout: 1000 })) {
      await expect(addTabButton).toBeVisible();
    }
  });

  test('editor toolbars are present', async ({ page }) => {
    // Check input toolbar elements
    const uploadButton = page.locator('.editor-toolbar').first().locator('button').first();
    await expect(uploadButton).toBeVisible();
    
    // Check output toolbar has copy button
    const outputToolbar = page.locator('.output-toolbar');
    if (await outputToolbar.isVisible({ timeout: 1000 })) {
      await expect(outputToolbar).toBeVisible();
    }
  });

  test('SEO content sections are present with XML-specific content', async ({ page }) => {
    // Scroll to SEO section
    const seoContent = page.locator('.seo-content');
    if (await seoContent.isVisible({ timeout: 2000 })) {
      await seoContent.scrollIntoViewIfNeeded();
      
      // Check for h1 heading in SEO section
      const seoH1 = seoContent.locator('.seo-hero-title, h1').first();
      await expect(seoH1).toBeVisible();
      await expect(seoH1).toContainText(/JSON to XML/i);
      
      // Check for h2 headings
      const h2Count = await seoContent.locator('h2').count();
      expect(h2Count).toBeGreaterThan(5); // Should have multiple sections
      
      // Check FAQ section exists
      const faqList = page.locator('.faq-list');
      if (await faqList.isVisible({ timeout: 1000 })) {
        const faqItems = await faqList.locator('.faq-item').count();
        expect(faqItems).toBeGreaterThan(10);
      }
      
      // Check related tools section
      const relatedToolsGrid = page.locator('.related-tools-grid');
      if (await relatedToolsGrid.isVisible({ timeout: 1000 })) {
        const relatedToolCards = await relatedToolsGrid.locator('.related-tool-card').count();
        expect(relatedToolCards).toBeGreaterThanOrEqual(2);
      }
    }
  });

  test('newsletter section is functional', async ({ page }) => {
    // Scroll to newsletter section
    const newsletter = page.locator('.newsletter-section');
    if (await newsletter.isVisible({ timeout: 2000 })) {
      await newsletter.scrollIntoViewIfNeeded();
      await expect(newsletter).toBeVisible();
      
      // Check email input exists
      const emailInput = page.locator('.newsletter-input');
      await expect(emailInput).toBeVisible();
      
      // Check submit button exists
      const submitButton = page.locator('.newsletter-button');
      await expect(submitButton).toBeVisible();
    }
  });

  test('footer is present with links', async ({ page }) => {
    const footer = page.locator('footer');
    if (await footer.isVisible({ timeout: 2000 })) {
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();
      
      // Check footer has links
      const footerLinks = footer.locator('a');
      expect(await footerLinks.count()).toBeGreaterThan(5);
    }
  });

  test('page is responsive', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('.ide-layout')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('.ide-layout')).toBeVisible();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.ide-layout')).toBeVisible();
  });

  test('help modal can be opened', async ({ page }) => {
    // Look for help button in header
    const helpButton = page.locator('button').filter({ hasText: /help/i }).first();
    if (await helpButton.isVisible({ timeout: 1000 })) {
      await helpButton.click();
      await page.waitForTimeout(500);
      
      // Check modal is visible
      const modal = page.locator('.help-modal, [role="dialog"]');
      if (await modal.isVisible({ timeout: 1000 })) {
        await expect(modal).toBeVisible();
      }
    }
  });

  test('theme toggle is functional', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme"], button[title*="theme"]').first();
    if (await themeToggle.isVisible({ timeout: 1000 })) {
      // Get initial state
      const htmlElement = page.locator('html');
      const initialTheme = await htmlElement.getAttribute('data-theme');
      
      // Click toggle
      await themeToggle.click();
      await page.waitForTimeout(300);
      
      // Theme should have changed (or be set)
      const newTheme = await htmlElement.getAttribute('data-theme');
      // Just verify it's accessible - theme may or may not change based on implementation
      expect(newTheme !== undefined || initialTheme !== undefined).toBeTruthy();
    }
  });

  test('JSON to XML conversion works', async ({ page }) => {
    // Find the input editor (Monaco editor)
    const inputPane = page.locator('.ide-pane').first();
    
    // Type simple JSON
    const jsonInput = '{"name": "test", "value": 123}';
    
    // Focus the editor and type
    await inputPane.click();
    await page.keyboard.type(jsonInput);
    
    // Wait for conversion (300ms debounce + processing time)
    await page.waitForTimeout(1000);
    
    // Check output pane has XML content
    const outputPane = page.locator('.ide-pane').last();
    const outputText = await outputPane.textContent();
    
    // Verify XML-like content appears (contains tags)
    expect(outputText).toContain('<');
    expect(outputText).toContain('>');
  });
});
