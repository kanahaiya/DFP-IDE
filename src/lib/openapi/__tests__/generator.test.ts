import { generateOpenAPISpec, validateSpec } from '../generator';
import type { Endpoint, OpenAPISettings } from '@/types';

describe('OpenAPI Generator', () => {
  const defaultSettings: OpenAPISettings = {
    title: 'Test API',
    version: '1.0.0',
    description: 'Test Description',
    serverUrl: 'https://api.example.com',
    openAPIVersion: '3.0',
    includeExamples: true,
    markRequired: true,
    generateComponents: true,
    detectFormats: true,
    addDescriptions: true,
    addConstraints: true,
  };

  const simpleEndpoint: Endpoint = {
    id: '1',
    path: '/api/users',
    method: 'get',
    json: JSON.stringify({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    }),
    responseCode: '200',
  };

  describe('YAML Output', () => {
    it('should generate YAML format', () => {
      const output = generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'yaml',
      });

      expect(output).toContain('openapi:');
      expect(output).toContain('info:');
      expect(output).toContain('paths:');
    });

    it('should have proper YAML indentation', () => {
      const output = generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'yaml',
      });

      const lines = output.split('\n');
      const indentedLines = lines.filter(line => line.startsWith('  '));
      
      expect(indentedLines.length).toBeGreaterThan(0);
    });

    it('should not include JSON syntax in YAML', () => {
      const output = generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'yaml',
      });

      // YAML shouldn't have curly braces at the start of lines (except in strings)
      const lines = output.split('\n');
      const invalidLines = lines.filter(line => /^\s*{/.test(line));
      
      expect(invalidLines.length).toBe(0);
    });

    it('should handle complex nested objects in YAML', () => {
      const complexEndpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({
          user: {
            profile: {
              address: {
                city: 'NYC',
                state: 'NY',
              },
            },
          },
        }),
      };

      const output = generateOpenAPISpec({
        endpoints: [complexEndpoint],
        settings: defaultSettings,
        outputFormat: 'yaml',
      });

      expect(output).toContain('user:');
      expect(output).toContain('profile:');
      expect(output).toContain('address:');
    });

    it('should handle arrays in YAML', () => {
      const arrayEndpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({
          items: ['item1', 'item2', 'item3'],
        }),
      };

      const output = generateOpenAPISpec({
        endpoints: [arrayEndpoint],
        settings: defaultSettings,
        outputFormat: 'yaml',
      });

      expect(output).toContain('items:');
      expect(output).toContain('type: array');
    });
  });

  describe('JSON Output', () => {
    it('should generate JSON format', () => {
      const output = generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'json',
      });

      expect(() => JSON.parse(output)).not.toThrow();
    });

    it('should have proper JSON indentation', () => {
      const output = generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'json',
      });

      expect(output).toContain('  "openapi"');
      expect(output).toContain('  "info"');
    });

    it('should be valid JSON', () => {
      const output = generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'json',
      });

      const parsed = JSON.parse(output);
      expect(parsed.openapi).toBe('3.0.3');
      expect(parsed.info).toBeDefined();
      expect(parsed.paths).toBeDefined();
    });

    it('should handle special characters in JSON', () => {
      const specialEndpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({
          message: 'Hello "World" with \n newlines and \t tabs',
        }),
      };

      const output = generateOpenAPISpec({
        endpoints: [specialEndpoint],
        settings: defaultSettings,
        outputFormat: 'json',
      });

      expect(() => JSON.parse(output)).not.toThrow();
    });
  });

  describe('Output Quality', () => {
    it('should not have trailing commas', () => {
      const output = generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'json',
      });

      expect(output).not.toMatch(/,\s*[}\]]/);
    });

    it('should have consistent line endings', () => {
      const output = generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'yaml',
      });

      // Should use \n, not \r\n
      expect(output).not.toContain('\r\n');
    });

    it('should not have excessive blank lines', () => {
      const output = generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'yaml',
      });

      // No more than 2 consecutive blank lines
      expect(output).not.toMatch(/\n\n\n\n/);
    });
  });

  describe('Multiple Endpoints', () => {
    it('should handle multiple endpoints in YAML', () => {
      const endpoints: Endpoint[] = [
        simpleEndpoint,
        { ...simpleEndpoint, id: '2', path: '/api/products' },
        { ...simpleEndpoint, id: '3', path: '/api/orders' },
      ];

      const output = generateOpenAPISpec({
        endpoints,
        settings: defaultSettings,
        outputFormat: 'yaml',
      });

      expect(output).toContain('/api/users:');
      expect(output).toContain('/api/products:');
      expect(output).toContain('/api/orders:');
    });

    it('should handle multiple endpoints in JSON', () => {
      const endpoints: Endpoint[] = [
        simpleEndpoint,
        { ...simpleEndpoint, id: '2', path: '/api/products' },
      ];

      const output = generateOpenAPISpec({
        endpoints,
        settings: defaultSettings,
        outputFormat: 'json',
      });

      const parsed = JSON.parse(output);
      expect(Object.keys(parsed.paths).length).toBe(2);
    });
  });

  describe('Large Specs', () => {
    it('should handle large JSON objects', () => {
      const largeObject: any = {};
      for (let i = 0; i < 100; i++) {
        largeObject[`field${i}`] = `value${i}`;
      }

      const largeEndpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify(largeObject),
      };

      const output = generateOpenAPISpec({
        endpoints: [largeEndpoint],
        settings: defaultSettings,
        outputFormat: 'json',
      });

      expect(output.length).toBeGreaterThan(1000);
      expect(() => JSON.parse(output)).not.toThrow();
    });

    it('should handle many endpoints', () => {
      const endpoints: Endpoint[] = [];
      for (let i = 0; i < 20; i++) {
        endpoints.push({
          ...simpleEndpoint,
          id: String(i),
          path: `/api/endpoint${i}`,
        });
      }

      const output = generateOpenAPISpec({
        endpoints,
        settings: defaultSettings,
        outputFormat: 'yaml',
      });

      expect(output.length).toBeGreaterThan(500);
    });
  });

  describe('Performance', () => {
    it('should generate YAML quickly', () => {
      const start = performance.now();
      
      generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'yaml',
      });
      
      const end = performance.now();
      expect(end - start).toBeLessThan(100);
    });

    it('should generate JSON quickly', () => {
      const start = performance.now();
      
      generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'json',
      });
      
      const end = performance.now();
      expect(end - start).toBeLessThan(100);
    });

    it('should handle format switching quickly', () => {
      const start = performance.now();
      
      generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'yaml',
      });
      
      generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'json',
      });
      
      const end = performance.now();
      expect(end - start).toBeLessThan(200);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty endpoints array', () => {
      const output = generateOpenAPISpec({
        endpoints: [],
        settings: defaultSettings,
        outputFormat: 'yaml',
      });

      expect(output).toContain('paths: {}');
    });

    it('should handle endpoints with no JSON', () => {
      const emptyEndpoint: Endpoint = {
        ...simpleEndpoint,
        json: '',
      };

      const output = generateOpenAPISpec({
        endpoints: [emptyEndpoint],
        settings: defaultSettings,
        outputFormat: 'yaml',
      });

      expect(output).toContain('paths: {}');
    });

    it('should handle Unicode characters', () => {
      const unicodeEndpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({
          name: '日本語',
          emoji: '🚀',
        }),
      };

      const output = generateOpenAPISpec({
        endpoints: [unicodeEndpoint],
        settings: defaultSettings,
        outputFormat: 'json',
      });

      expect(() => JSON.parse(output)).not.toThrow();
      expect(output).toContain('日本語');
      expect(output).toContain('🚀');
    });
  });

  describe('Validation Integration', () => {
    it('should generate valid specs that pass validation', () => {
      const output = generateOpenAPISpec({
        endpoints: [simpleEndpoint],
        settings: defaultSettings,
        outputFormat: 'json',
      });

      const spec = JSON.parse(output);
      const validation = validateSpec(spec);

      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });
  });
});
