/**
 * Integration tests for JSON to OpenAPI conversion workflow
 * Tests the complete flow from input to output
 */

import { renderHook, act } from '@testing-library/react';
import { useOpenAPIStore } from '@/store/openapi';
import { generateOpenAPISpec, validateSpec } from '@/lib/openapi/generator';
import type { Endpoint } from '@/types';

describe('JSON to OpenAPI Workflow Integration', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useOpenAPIStore());
    act(() => {
      result.current.resetAll();
    });
  });

  describe('Basic Conversion Flow', () => {
    it('should convert simple JSON to OpenAPI spec', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      // Load JSON
      act(() => {
        result.current.loadEndpointJSON(0, JSON.stringify({
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        }));
        
        result.current.updateEndpoint(0, {
          path: '/api/users',
          method: 'get',
        });
      });
      
      // Generate spec
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      
      // Verify structure
      expect(spec.openapi).toBe('3.0.3');
      expect(spec.paths['/api/users']).toBeDefined();
      expect(spec.paths['/api/users'].get).toBeDefined();
      
      // Verify schema
      const schema = spec.paths['/api/users'].get.responses['200'].content['application/json'].schema;
      expect(schema.properties.id).toBeDefined();
      expect(schema.properties.name).toBeDefined();
      expect(schema.properties.email).toBeDefined();
      expect(schema.properties.email.format).toBe('email');
    });

    it('should validate generated spec', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.loadEndpointJSON(0, JSON.stringify({ id: 1 }));
      });
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      const validation = validateSpec(spec);
      
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('should handle YAML output format', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.loadEndpointJSON(0, JSON.stringify({ id: 1 }));
        result.current.setOutputFormat('yaml');
      });
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: result.current.outputFormat,
      });
      
      expect(output).toContain('openapi:');
      expect(output).toContain('paths:');
      expect(typeof output).toBe('string');
    });
  });

  describe('Multi-Endpoint Workflow', () => {
    it('should handle multiple endpoints with different methods', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      const userJSON = JSON.stringify({ id: 1, name: 'John' });
      
      act(() => {
        // GET /api/users
        result.current.updateEndpoint(0, { path: '/api/users', method: 'get' });
        result.current.loadEndpointJSON(0, JSON.stringify([{ id: 1, name: 'John' }]));
        
        // POST /api/users
        result.current.addEndpoint();
        result.current.updateEndpoint(1, { path: '/api/users', method: 'post' });
        result.current.loadEndpointJSON(1, userJSON);
        
        // PUT /api/users/{id}
        result.current.addEndpoint();
        result.current.updateEndpoint(2, { path: '/api/users/{id}', method: 'put' });
        result.current.loadEndpointJSON(2, userJSON);
        
        // DELETE /api/users/{id}
        result.current.addEndpoint();
        result.current.updateEndpoint(3, { path: '/api/users/{id}', method: 'delete' });
        result.current.loadEndpointJSON(3, '{"success": true}');
      });
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      
      expect(spec.paths['/api/users'].get).toBeDefined();
      expect(spec.paths['/api/users'].post).toBeDefined();
      expect(spec.paths['/api/users/{id}'].put).toBeDefined();
      expect(spec.paths['/api/users/{id}'].delete).toBeDefined();
    });

    it('should handle multiple resources', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        // Users endpoint
        result.current.updateEndpoint(0, { path: '/api/users', method: 'get' });
        result.current.loadEndpointJSON(0, JSON.stringify({ id: 1, name: 'John' }));
        
        // Products endpoint
        result.current.addEndpoint();
        result.current.updateEndpoint(1, { path: '/api/products', method: 'get' });
        result.current.loadEndpointJSON(1, JSON.stringify({ id: 1, name: 'Product', price: 29.99 }));
        
        // Orders endpoint
        result.current.addEndpoint();
        result.current.updateEndpoint(2, { path: '/api/orders', method: 'get' });
        result.current.loadEndpointJSON(2, JSON.stringify({ id: 1, userId: 1, productId: 1 }));
      });
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      
      expect(Object.keys(spec.paths).length).toBe(3);
      expect(spec.paths['/api/users']).toBeDefined();
      expect(spec.paths['/api/products']).toBeDefined();
      expect(spec.paths['/api/orders']).toBeDefined();
    });
  });

  describe('Settings Changes Workflow', () => {
    it('should apply settings to generated spec', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.loadEndpointJSON(0, JSON.stringify({ name: 'John', age: 30 }));
        
        result.current.updateSettings({
          title: 'User API',
          version: '2.0.0',
          description: 'API for managing users',
          serverUrl: 'https://users.api.com',
        });
      });
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      
      expect(spec.info.title).toBe('User API');
      expect(spec.info.version).toBe('2.0.0');
      expect(spec.info.description).toBe('API for managing users');
      expect(spec.servers[0].url).toBe('https://users.api.com');
    });

    it('should toggle schema options', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.loadEndpointJSON(0, JSON.stringify({ name: 'John', age: 30 }));
        
        result.current.updateSettings({
          includeExamples: true,
          markRequired: true,
          addConstraints: true,
        });
      });
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      const schema = spec.paths['/users'].post.responses['200'].content['application/json'].schema;
      
      expect(schema.properties.name.example).toBeDefined();
      expect(schema.required).toContain('name');
      expect(schema.properties.age.minimum).toBeDefined();
    });

    it('should switch between OpenAPI 3.0 and Swagger 2.0', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.loadEndpointJSON(0, JSON.stringify({ id: 1 }));
      });
      
      // OpenAPI 3.0
      const openapi3 = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec3 = JSON.parse(openapi3);
      expect(spec3.openapi).toBe('3.0.3');
      expect(spec3.servers).toBeDefined();
      
      // Swagger 2.0
      act(() => {
        result.current.updateSettings({ openAPIVersion: '2.0' });
      });
      
      const swagger2 = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec2 = JSON.parse(swagger2);
      expect(spec2.swagger).toBe('2.0');
      expect(spec2.host).toBeDefined();
      expect(spec2.basePath).toBeDefined();
    });
  });

  describe('Complex Data Structures', () => {
    it('should handle nested objects', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.loadEndpointJSON(0, JSON.stringify({
          user: {
            profile: {
              name: 'John',
              address: {
                city: 'NYC',
                zip: '10001',
              },
            },
          },
        }));
      });
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      const schema = spec.paths['/users'].post.responses['200'].content['application/json'].schema;
      
      expect(schema.properties.user.type).toBe('object');
      expect(schema.properties.user.properties.profile.type).toBe('object');
      expect(schema.properties.user.properties.profile.properties.address.type).toBe('object');
    });

    it('should handle arrays of objects', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.loadEndpointJSON(0, JSON.stringify({
          users: [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
          ],
        }));
      });
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      const schema = spec.paths['/users'].post.responses['200'].content['application/json'].schema;
      
      expect(schema.properties.users.type).toBe('array');
      expect(schema.properties.users.items.type).toBe('object');
      expect(schema.properties.users.items.properties.id.type).toBe('integer');
    });

    it('should detect various formats', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.loadEndpointJSON(0, JSON.stringify({
          email: 'test@example.com',
          uuid: '123e4567-e89b-12d3-a456-426614174000',
          date: '2024-01-15',
          datetime: '2024-01-15T10:30:00Z',
          url: 'https://example.com',
        }));
      });
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      const schema = spec.paths['/users'].post.responses['200'].content['application/json'].schema;
      
      expect(schema.properties.email.format).toBe('email');
      expect(schema.properties.uuid.format).toBe('uuid');
      expect(schema.properties.datetime.format).toBe('date-time');
      expect(schema.properties.url.format).toBe('uri');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON gracefully', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.loadEndpointJSON(0, '{ invalid json }');
      });
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      
      // Should still generate valid spec, just without this endpoint
      expect(spec.openapi).toBe('3.0.3');
      expect(Object.keys(spec.paths).length).toBe(0);
    });

    it('should handle empty JSON', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.loadEndpointJSON(0, '');
      });
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      expect(spec.openapi).toBe('3.0.3');
      expect(Object.keys(spec.paths).length).toBe(0);
    });

    it('should handle endpoints with no JSON', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
        result.current.loadEndpointJSON(0, JSON.stringify({ id: 1 }));
        // Endpoint 1 has no JSON
      });
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      
      // Should only include endpoint with valid JSON
      expect(Object.keys(spec.paths).length).toBe(1);
    });
  });

  describe('Performance', () => {
    it('should handle large JSON objects', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      const largeObject: any = {};
      for (let i = 0; i < 100; i++) {
        largeObject[`field${i}`] = `value${i}`;
      }
      
      act(() => {
        result.current.loadEndpointJSON(0, JSON.stringify(largeObject));
      });
      
      const start = performance.now();
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const end = performance.now();
      
      expect(end - start).toBeLessThan(200);
      expect(() => JSON.parse(output)).not.toThrow();
    });

    it('should handle many endpoints', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        for (let i = 0; i < 20; i++) {
          if (i > 0) result.current.addEndpoint();
          result.current.updateEndpoint(i, { path: `/api/endpoint${i}` });
          result.current.loadEndpointJSON(i, JSON.stringify({ id: i }));
        }
      });
      
      const start = performance.now();
      
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const end = performance.now();
      
      expect(end - start).toBeLessThan(500);
      
      const spec = JSON.parse(output);
      expect(Object.keys(spec.paths).length).toBe(20);
    });
  });

  describe('Complete User Journey', () => {
    it('should complete full conversion workflow', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      // Step 1: Configure API info
      act(() => {
        result.current.updateSettings({
          title: 'E-commerce API',
          version: '1.0.0',
          description: 'API for e-commerce platform',
          serverUrl: 'https://api.ecommerce.com',
        });
      });
      
      // Step 2: Add and configure endpoints
      act(() => {
        // GET /products
        result.current.updateEndpoint(0, { 
          path: '/products', 
          method: 'get',
          summary: 'List all products',
          tags: 'products',
        });
        result.current.loadEndpointJSON(0, JSON.stringify([
          { id: 1, name: 'Product 1', price: 29.99 }
        ]));
        
        // POST /products
        result.current.addEndpoint();
        result.current.updateEndpoint(1, { 
          path: '/products', 
          method: 'post',
          summary: 'Create a product',
          tags: 'products',
          responseCode: '201',
        });
        result.current.loadEndpointJSON(1, JSON.stringify({
          id: 1,
          name: 'New Product',
          price: 29.99,
          description: 'Product description',
        }));
        
        // GET /orders
        result.current.addEndpoint();
        result.current.updateEndpoint(2, { 
          path: '/orders', 
          method: 'get',
          summary: 'List all orders',
          tags: 'orders',
        });
        result.current.loadEndpointJSON(2, JSON.stringify([
          {
            id: 1,
            userId: 1,
            items: [{ productId: 1, quantity: 2 }],
            total: 59.98,
          }
        ]));
      });
      
      // Step 3: Configure schema options
      act(() => {
        result.current.updateSettings({
          includeExamples: true,
          markRequired: true,
          generateComponents: true,
          detectFormats: true,
          addDescriptions: true,
        });
      });
      
      // Step 4: Generate spec
      const output = generateOpenAPISpec({
        endpoints: result.current.endpoints,
        settings: result.current.settings,
        outputFormat: 'json',
      });
      
      const spec = JSON.parse(output);
      
      // Verify complete spec
      expect(spec.info.title).toBe('E-commerce API');
      expect(spec.paths['/products'].get).toBeDefined();
      expect(spec.paths['/products'].post).toBeDefined();
      expect(spec.paths['/orders'].get).toBeDefined();
      
      // Verify tags
      expect(spec.paths['/products'].get.tags).toContain('products');
      expect(spec.paths['/orders'].get.tags).toContain('orders');
      
      // Verify components
      expect(spec.components).toBeDefined();
      expect(spec.components.schemas).toBeDefined();
      
      // Validate spec
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
    });
  });
});
