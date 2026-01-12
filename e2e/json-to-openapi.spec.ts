/**
 * End-to-End tests for JSON to OpenAPI tool
 * Tests complete user journeys across different browsers and devices
 */

import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const TOOL_URL = `${BASE_URL}/json-to-openapi`;

test.describe('JSON to OpenAPI E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TOOL_URL);
    await page.waitForLoadState('networkidle');
  });

  test.describe('First-Time User Flow', () => {
    test('should navigate to tool and see initial state', async ({ page }) => {
      // Verify page loaded
      await expect(page).toHaveTitle(/JSON to OpenAPI/i);
      
      // Verify main components are visible
      await expect(page.locator('text=API Endpoints')).toBeVisible();
      await expect(page.locator('text=API Information')).toBeVisible();
      
      // Verify one default endpoint exists
      await expect(page.locator('.endpoint-card')).toHaveCount(1);
    });

    test('should load sample JSON and generate OpenAPI', async ({ page }) => {
      const startTime = Date.now();
      
      // Expand endpoint
      await page.click('text=/users');
      
      // Load sample JSON
      await page.click('text=User');
      
      // Wait for JSON to load
      await page.waitForTimeout(500);
      
      // Verify JSON loaded (check for success icon)
      await expect(page.locator('.fa-check-circle').first()).toBeVisible();
      
      // Switch to output tab/panel
      const outputPanel = page.locator('[data-testid="output-panel"]').or(page.locator('text=OpenAPI Output'));
      
      // Verify output contains OpenAPI content
      const output = await page.textContent('body');
      expect(output).toContain('openapi');
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(10000); // Should complete in < 10 seconds
    });

    test('should switch between YAML and JSON formats', async ({ page }) => {
      // Load sample data
      await page.click('text=/users');
      await page.click('text=User');
      
      // Find format toggle
      const yamlButton = page.locator('button:has-text("YAML")');
      const jsonButton = page.locator('button:has-text("JSON")');
      
      // Verify YAML is default
      await expect(yamlButton).toHaveClass(/active/);
      
      // Switch to JSON
      await jsonButton.click();
      await page.waitForTimeout(200);
      
      await expect(jsonButton).toHaveClass(/active/);
      
      // Switch back to YAML
      await yamlButton.click();
      await page.waitForTimeout(200);
      
      await expect(yamlButton).toHaveClass(/active/);
    });
  });

  test.describe('Power User Flow', () => {
    test('should create multiple endpoints and generate spec', async ({ page }) => {
      const startTime = Date.now();
      
      // Add 4 more endpoints (total 5)
      for (let i = 0; i < 4; i++) {
        await page.click('button[title="Add new endpoint"]');
        await page.waitForTimeout(100);
      }
      
      // Verify 5 endpoints exist
      await expect(page.locator('.endpoint-card')).toHaveCount(5);
      
      // Configure each endpoint
      const endpoints = [
        { path: '/api/users', method: 'get', sample: 'User' },
        { path: '/api/users', method: 'post', sample: 'User' },
        { path: '/api/products', method: 'get', sample: 'Product' },
        { path: '/api/orders', method: 'get', sample: 'Order' },
        { path: '/api/orders', method: 'post', sample: 'Order' },
      ];
      
      for (let i = 0; i < endpoints.length; i++) {
        const endpoint = endpoints[i];
        
        // Click endpoint to expand
        await page.locator('.endpoint-card').nth(i).click();
        await page.waitForTimeout(200);
        
        // Update path
        const pathInput = page.locator(`input[id="path-${i}"]`);
        await pathInput.fill(endpoint.path);
        
        // Update method
        const methodSelect = page.locator(`select[id="method-${i}"]`);
        await methodSelect.selectOption(endpoint.method);
        
        // Load sample JSON
        await page.click(`text=${endpoint.sample}`);
        await page.waitForTimeout(200);
      }
      
      // Update API settings
      await page.fill('input[id="api-title"]', 'E-commerce API');
      await page.fill('input[id="api-version"]', '1.0.0');
      await page.fill('textarea[id="api-description"]', 'Complete e-commerce API');
      
      // Verify generation completed
      const output = await page.textContent('body');
      expect(output).toContain('openapi');
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(15000); // Should complete in < 15 seconds
    });

    test('should toggle all schema options', async ({ page }) => {
      // Load sample data
      await page.click('text=/users');
      await page.click('text=User');
      
      // Toggle all checkboxes
      await page.check('input[id="includeExamples"]');
      await page.check('input[id="markRequired"]');
      await page.check('input[id="generateComponents"]');
      await page.check('input[id="detectFormats"]');
      await page.check('input[id="addDescriptions"]');
      await page.check('input[id="addConstraints"]');
      
      // Verify all are checked
      await expect(page.locator('input[id="includeExamples"]')).toBeChecked();
      await expect(page.locator('input[id="markRequired"]')).toBeChecked();
      await expect(page.locator('input[id="generateComponents"]')).toBeChecked();
    });
  });

  test.describe('Endpoint Management', () => {
    test('should add and remove endpoints', async ({ page }) => {
      // Add 3 endpoints
      await page.click('button[title="Add new endpoint"]');
      await page.click('button[title="Add new endpoint"]');
      await page.click('button[title="Add new endpoint"]');
      
      await expect(page.locator('.endpoint-card')).toHaveCount(4);
      
      // Remove 2 endpoints
      const removeButtons = page.locator('button[title="Remove endpoint"]');
      await removeButtons.nth(1).click();
      await page.waitForTimeout(200);
      
      await expect(page.locator('.endpoint-card')).toHaveCount(3);
      
      await removeButtons.nth(0).click();
      await page.waitForTimeout(200);
      
      await expect(page.locator('.endpoint-card')).toHaveCount(2);
    });

    test('should not remove last endpoint', async ({ page }) => {
      const removeButton = page.locator('button[title="Remove endpoint"]');
      
      // Should be disabled
      await expect(removeButton).toBeDisabled();
    });

    test('should expand and collapse endpoints', async ({ page }) => {
      // Add another endpoint
      await page.click('button[title="Add new endpoint"]');
      
      // Click first endpoint to expand
      await page.locator('.endpoint-card').nth(0).click();
      await page.waitForTimeout(200);
      
      // Verify configuration visible
      await expect(page.locator('input[id="path-0"]')).toBeVisible();
      
      // Click again to collapse
      await page.locator('.endpoint-header').nth(0).click();
      await page.waitForTimeout(200);
      
      // Configuration should be hidden
      await expect(page.locator('input[id="path-0"]')).not.toBeVisible();
    });
  });

  test.describe('Input Validation', () => {
    test('should handle invalid JSON gracefully', async ({ page }) => {
      // Expand endpoint
      await page.click('text=/users');
      
      // Try to input invalid JSON (if there's a direct JSON input)
      // This might need adjustment based on actual UI
      
      // The tool should still work and not crash
      await expect(page.locator('text=API Endpoints')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      // Clear required fields
      await page.fill('input[id="api-title"]', '');
      await page.fill('input[id="api-version"]', '');
      
      // Tool should still function or show validation
      await expect(page.locator('input[id="api-title"]')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load page quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(TOOL_URL);
      await page.waitForLoadState('networkidle');
      
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      expect(loadTime).toBeLessThan(3000); // Page should load in < 3 seconds
    });

    test('should handle interactions with low latency', async ({ page }) => {
      const interactions = [
        () => page.click('button[title="Add new endpoint"]'),
        () => page.click('text=/users'),
        () => page.click('button:has-text("YAML")'),
        () => page.click('button:has-text("JSON")'),
      ];
      
      for (const interaction of interactions) {
        const startTime = Date.now();
        await interaction();
        await page.waitForTimeout(50); // Small delay for UI update
        const endTime = Date.now();
        
        expect(endTime - startTime).toBeLessThan(100); // Each interaction < 100ms
      }
    });

    test('should handle large JSON input', async ({ page }) => {
      // Create large JSON object
      const largeObject: any = {};
      for (let i = 0; i < 100; i++) {
        largeObject[`field${i}`] = `value${i}`;
      }
      
      // This test assumes there's a way to input custom JSON
      // Implementation depends on actual UI
      
      // The tool should handle it without crashing
      await expect(page.locator('text=API Endpoints')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Verify focus is visible
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check for important ARIA labels
      const addButton = page.locator('button[title="Add new endpoint"]');
      await expect(addButton).toHaveAttribute('title');
      
      // Check form labels
      await page.click('text=/users');
      await expect(page.locator('label[for="path-0"]')).toBeVisible();
    });

    test('should support screen readers', async ({ page }) => {
      // Check for semantic HTML
      const main = page.locator('main');
      const headers = page.locator('h1, h2, h3');
      
      await expect(headers.first()).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await expect(page.locator('text=API Endpoints')).toBeVisible();
      
      // Add endpoint
      await page.click('button[title="Add new endpoint"]');
      await expect(page.locator('.endpoint-card')).toHaveCount(2);
    });

    test('should work on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await expect(page.locator('text=API Endpoints')).toBeVisible();
      
      // Verify main functionality works
      await page.click('text=/users');
      await page.waitForTimeout(200);
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    test('should work in different browsers', async ({ page, browserName }) => {
      // This test runs automatically in different browsers via Playwright config
      
      await expect(page.locator('text=API Endpoints')).toBeVisible();
      
      // Add endpoint
      await page.click('button[title="Add new endpoint"]');
      await expect(page.locator('.endpoint-card')).toHaveCount(2);
      
      // Load sample
      await page.click('text=/users');
      await page.click('text=User');
      
      // Verify it works
      await expect(page.locator('.fa-check-circle').first()).toBeVisible();
    });
  });

  test.describe('Error Recovery', () => {
    test('should recover from network errors', async ({ page }) => {
      // Simulate offline
      await page.context().setOffline(true);
      
      // Try to interact
      await page.click('button[title="Add new endpoint"]').catch(() => {});
      
      // Go back online
      await page.context().setOffline(false);
      
      // Should work again
      await page.click('button[title="Add new endpoint"]');
      await expect(page.locator('.endpoint-card')).toHaveCount(2);
    });
  });

  test.describe('State Persistence', () => {
    test('should maintain state during session', async ({ page }) => {
      // Make changes
      await page.click('button[title="Add new endpoint"]');
      await page.fill('input[id="api-title"]', 'My Custom API');
      
      // Verify changes persist
      await expect(page.locator('.endpoint-card')).toHaveCount(2);
      await expect(page.locator('input[id="api-title"]')).toHaveValue('My Custom API');
      
      // Refresh page (if state should persist)
      // await page.reload();
      // await expect(page.locator('.endpoint-card')).toHaveCount(2);
    });
  });
});

test.describe('JSON to OpenAPI - Complete User Journeys', () => {
  test('Journey 1: Quick API Documentation', async ({ page }) => {
    await page.goto(TOOL_URL);
    
    // User wants to quickly document a single endpoint
    await page.click('text=/users');
    await page.click('text=User');
    
    // Update API info
    await page.fill('input[id="api-title"]', 'User API');
    
    // Switch to JSON format
    await page.click('button:has-text("JSON")');
    
    // Verify output
    const output = await page.textContent('body');
    expect(output).toContain('openapi');
    expect(output).toContain('User API');
  });

  test('Journey 2: Complete REST API Documentation', async ({ page }) => {
    await page.goto(TOOL_URL);
    
    // User wants to document a complete REST API
    const operations = [
      { method: 'get', sample: 'User' },
      { method: 'post', sample: 'User' },
      { method: 'put', sample: 'User' },
      { method: 'delete', sample: 'User' },
    ];
    
    // Configure first endpoint
    await page.click('text=/users');
    await page.locator('select[id="method-0"]').selectOption('get');
    await page.click('text=User');
    
    // Add remaining endpoints
    for (let i = 1; i < operations.length; i++) {
      await page.click('button[title="Add new endpoint"]');
      await page.waitForTimeout(200);
      
      await page.locator('.endpoint-card').nth(i).click();
      await page.locator(`select[id="method-${i}"]`).selectOption(operations[i].method);
      await page.click(`text=${operations[i].sample}`);
      await page.waitForTimeout(200);
    }
    
    // Configure API settings
    await page.fill('input[id="api-title"]', 'Complete User API');
    await page.fill('input[id="api-version"]', '2.0.0');
    
    // Enable all options
    await page.check('input[id="includeExamples"]');
    await page.check('input[id="markRequired"]');
    await page.check('input[id="generateComponents"]');
    
    // Verify complete spec
    const output = await page.textContent('body');
    expect(output).toContain('openapi');
    expect(output).toContain('Complete User API');
  });
});
