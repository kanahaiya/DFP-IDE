import { renderHook, act } from '@testing-library/react';
import { useOpenAPIStore } from '../openapi';

describe('OpenAPI Store', () => {
  beforeEach(() => {
    // Reset store to initial state
    const { result } = renderHook(() => useOpenAPIStore());
    act(() => {
      result.current.resetAll();
    });
  });

  describe('Initial State', () => {
    it('should have one default endpoint', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      expect(result.current.endpoints.length).toBe(1);
      expect(result.current.endpoints[0].path).toBe('/users');
      expect(result.current.endpoints[0].method).toBe('post');
    });

    it('should have default settings', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      expect(result.current.settings.title).toBe('Generated API');
      expect(result.current.settings.version).toBe('1.0.0');
      expect(result.current.settings.openAPIVersion).toBe('3.0');
    });

    it('should have YAML as default output format', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      expect(result.current.outputFormat).toBe('yaml');
    });

    it('should have first endpoint as active', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      expect(result.current.activeEndpointIndex).toBe(0);
    });
  });

  describe('Adding Endpoints', () => {
    it('should add a new endpoint', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
      });
      
      expect(result.current.endpoints.length).toBe(2);
    });

    it('should set new endpoint as active', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
      });
      
      expect(result.current.activeEndpointIndex).toBe(1);
    });

    it('should add endpoint with unique ID', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
        result.current.addEndpoint();
      });
      
      const ids = result.current.endpoints.map(ep => ep.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(3);
    });

    it('should add endpoint with default values', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
      });
      
      const newEndpoint = result.current.endpoints[1];
      expect(newEndpoint.path).toBe('/users');
      expect(newEndpoint.method).toBe('post');
      expect(newEndpoint.responseCode).toBe('200');
    });
  });

  describe('Removing Endpoints', () => {
    it('should remove endpoint at index', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
        result.current.addEndpoint();
      });
      
      expect(result.current.endpoints.length).toBe(3);
      
      act(() => {
        result.current.removeEndpoint(1);
      });
      
      expect(result.current.endpoints.length).toBe(2);
    });

    it('should not remove if only one endpoint exists', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.removeEndpoint(0);
      });
      
      expect(result.current.endpoints.length).toBe(1);
    });

    it('should update active index when removing active endpoint', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
        result.current.addEndpoint();
        result.current.setActiveEndpoint(1);
      });
      
      expect(result.current.activeEndpointIndex).toBe(1);
      
      act(() => {
        result.current.removeEndpoint(1);
      });
      
      expect(result.current.activeEndpointIndex).toBe(0);
    });

    it('should update active index when removing before active endpoint', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
        result.current.addEndpoint();
        result.current.setActiveEndpoint(2);
      });
      
      act(() => {
        result.current.removeEndpoint(0);
      });
      
      expect(result.current.activeEndpointIndex).toBe(1);
    });
  });

  describe('Updating Endpoints', () => {
    it('should update endpoint path', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.updateEndpoint(0, { path: '/api/products' });
      });
      
      expect(result.current.endpoints[0].path).toBe('/api/products');
    });

    it('should update endpoint method', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.updateEndpoint(0, { method: 'get' });
      });
      
      expect(result.current.endpoints[0].method).toBe('get');
    });

    it('should update multiple fields at once', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.updateEndpoint(0, {
          path: '/api/orders',
          method: 'put',
          responseCode: '201',
        });
      });
      
      expect(result.current.endpoints[0].path).toBe('/api/orders');
      expect(result.current.endpoints[0].method).toBe('put');
      expect(result.current.endpoints[0].responseCode).toBe('201');
    });

    it('should only update specified endpoint', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
        result.current.updateEndpoint(0, { path: '/api/updated' });
      });
      
      expect(result.current.endpoints[0].path).toBe('/api/updated');
      expect(result.current.endpoints[1].path).toBe('/users');
    });
  });

  describe('Setting Active Endpoint', () => {
    it('should set active endpoint index', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
        result.current.setActiveEndpoint(1);
      });
      
      expect(result.current.activeEndpointIndex).toBe(1);
    });

    it('should allow setting any valid index', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
        result.current.addEndpoint();
        result.current.setActiveEndpoint(2);
      });
      
      expect(result.current.activeEndpointIndex).toBe(2);
    });
  });

  describe('Loading Endpoint JSON', () => {
    it('should load JSON for endpoint', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      const json = '{"id": 1, "name": "John"}';
      
      act(() => {
        result.current.loadEndpointJSON(0, json);
      });
      
      expect(result.current.endpoints[0].json).toBe(json);
    });

    it('should only update JSON for specified endpoint', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      const json1 = '{"id": 1}';
      const json2 = '{"id": 2}';
      
      act(() => {
        result.current.addEndpoint();
        result.current.loadEndpointJSON(0, json1);
        result.current.loadEndpointJSON(1, json2);
      });
      
      expect(result.current.endpoints[0].json).toBe(json1);
      expect(result.current.endpoints[1].json).toBe(json2);
    });
  });

  describe('Updating Settings', () => {
    it('should update title', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.updateSettings({ title: 'My API' });
      });
      
      expect(result.current.settings.title).toBe('My API');
    });

    it('should update version', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.updateSettings({ version: '2.0.0' });
      });
      
      expect(result.current.settings.version).toBe('2.0.0');
    });

    it('should update multiple settings at once', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.updateSettings({
          title: 'New API',
          version: '3.0.0',
          description: 'New description',
        });
      });
      
      expect(result.current.settings.title).toBe('New API');
      expect(result.current.settings.version).toBe('3.0.0');
      expect(result.current.settings.description).toBe('New description');
    });

    it('should toggle boolean settings', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.updateSettings({ includeExamples: false });
      });
      
      expect(result.current.settings.includeExamples).toBe(false);
      
      act(() => {
        result.current.updateSettings({ includeExamples: true });
      });
      
      expect(result.current.settings.includeExamples).toBe(true);
    });

    it('should update OpenAPI version', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.updateSettings({ openAPIVersion: '2.0' });
      });
      
      expect(result.current.settings.openAPIVersion).toBe('2.0');
    });
  });

  describe('Setting Output Format', () => {
    it('should set output format to JSON', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.setOutputFormat('json');
      });
      
      expect(result.current.outputFormat).toBe('json');
    });

    it('should set output format to YAML', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.setOutputFormat('json');
        result.current.setOutputFormat('yaml');
      });
      
      expect(result.current.outputFormat).toBe('yaml');
    });
  });

  describe('Resetting Store', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      // Make changes
      act(() => {
        result.current.addEndpoint();
        result.current.addEndpoint();
        result.current.updateSettings({ title: 'Changed' });
        result.current.setOutputFormat('json');
      });
      
      // Reset
      act(() => {
        result.current.resetAll();
      });
      
      expect(result.current.endpoints.length).toBe(1);
      expect(result.current.settings.title).toBe('Generated API');
      expect(result.current.outputFormat).toBe('yaml');
      expect(result.current.activeEndpointIndex).toBe(0);
    });
  });

  describe('Complex Workflows', () => {
    it('should handle adding and removing multiple endpoints', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
        result.current.addEndpoint();
        result.current.addEndpoint();
      });
      
      expect(result.current.endpoints.length).toBe(4);
      
      act(() => {
        result.current.removeEndpoint(1);
        result.current.removeEndpoint(1);
      });
      
      expect(result.current.endpoints.length).toBe(2);
    });

    it('should handle updating multiple endpoints', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      act(() => {
        result.current.addEndpoint();
        result.current.addEndpoint();
        
        result.current.updateEndpoint(0, { path: '/api/users' });
        result.current.updateEndpoint(1, { path: '/api/products' });
        result.current.updateEndpoint(2, { path: '/api/orders' });
      });
      
      expect(result.current.endpoints[0].path).toBe('/api/users');
      expect(result.current.endpoints[1].path).toBe('/api/products');
      expect(result.current.endpoints[2].path).toBe('/api/orders');
    });

    it('should handle complete workflow', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      // Add endpoints
      act(() => {
        result.current.addEndpoint();
        result.current.addEndpoint();
      });
      
      // Configure endpoints
      act(() => {
        result.current.updateEndpoint(0, { path: '/api/users', method: 'get' });
        result.current.updateEndpoint(1, { path: '/api/users', method: 'post' });
        result.current.updateEndpoint(2, { path: '/api/users/{id}', method: 'put' });
        
        result.current.loadEndpointJSON(0, '{"users": []}');
        result.current.loadEndpointJSON(1, '{"id": 1, "name": "John"}');
        result.current.loadEndpointJSON(2, '{"id": 1, "name": "Updated"}');
      });
      
      // Update settings
      act(() => {
        result.current.updateSettings({
          title: 'User API',
          version: '1.0.0',
          description: 'API for managing users',
          includeExamples: true,
          markRequired: true,
        });
      });
      
      // Set output format
      act(() => {
        result.current.setOutputFormat('json');
      });
      
      // Verify final state
      expect(result.current.endpoints.length).toBe(3);
      expect(result.current.endpoints[0].method).toBe('get');
      expect(result.current.endpoints[1].method).toBe('post');
      expect(result.current.endpoints[2].method).toBe('put');
      expect(result.current.settings.title).toBe('User API');
      expect(result.current.outputFormat).toBe('json');
    });
  });

  describe('Performance', () => {
    it('should handle many endpoints efficiently', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      const start = performance.now();
      
      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.addEndpoint();
        }
      });
      
      const end = performance.now();
      
      expect(result.current.endpoints.length).toBe(51);
      expect(end - start).toBeLessThan(100);
    });

    it('should handle rapid updates efficiently', () => {
      const { result } = renderHook(() => useOpenAPIStore());
      
      const start = performance.now();
      
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.updateSettings({ title: `API ${i}` });
        }
      });
      
      const end = performance.now();
      
      expect(result.current.settings.title).toBe('API 99');
      expect(end - start).toBeLessThan(100);
    });
  });
});
