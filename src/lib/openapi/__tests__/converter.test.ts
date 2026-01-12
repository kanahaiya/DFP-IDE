import { generateOpenAPISpec, validateSpec, type OpenAPISpec, type SchemaObject } from '../converter';
import type { Endpoint, OpenAPISettings } from '@/types';

describe('OpenAPI Converter', () => {
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

  describe('Format Detection', () => {
    it('should detect email format', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ email: 'test@example.com' }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.email.format).toBe('email');
    });

    it('should detect UUID format', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ id: '123e4567-e89b-12d3-a456-426614174000' }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.id.format).toBe('uuid');
    });

    it('should detect date-time format', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ createdAt: '2024-01-15T10:30:00Z' }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.createdAt.format).toBe('date-time');
    });

    it('should detect date format', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ birthDate: '2024-01-15' }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.birthDate.format).toBe('date');
    });

    it('should detect URI format', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ website: 'https://example.com' }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.website.format).toBe('uri');
    });

    it('should not detect format when detectFormats is false', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ email: 'test@example.com' }),
      };

      const spec = generateOpenAPISpec([endpoint], { ...defaultSettings, detectFormats: false });
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.email.format).toBeUndefined();
    });
  });

  describe('Type Inference', () => {
    it('should infer string type', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ name: 'John' }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.name.type).toBe('string');
    });

    it('should infer integer type', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ age: 30 }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.age.type).toBe('integer');
    });

    it('should infer number type for floats', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ price: 29.99 }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.price.type).toBe('number');
      expect(schema.properties.price.format).toBe('double');
    });

    it('should infer boolean type', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ active: true }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.active.type).toBe('boolean');
    });

    it('should infer array type', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ tags: ['tag1', 'tag2'] }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.tags.type).toBe('array');
      expect(schema.properties.tags.items.type).toBe('string');
    });

    it('should infer object type', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ address: { city: 'NYC', state: 'NY' } }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.address.type).toBe('object');
      expect(schema.properties.address.properties).toBeDefined();
    });

    it('should handle null values', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ middleName: null }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.middleName.type).toBe('string');
      expect(schema.properties.middleName.nullable).toBe(true);
    });

    it('should handle empty arrays', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ items: [] }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.items.type).toBe('array');
      expect(schema.properties.items.items.type).toBe('string');
    });
  });

  describe('Nested Objects', () => {
    it('should handle deeply nested objects', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({
          user: {
            profile: {
              address: {
                coordinates: {
                  lat: 40.7128,
                  lng: -74.0060,
                },
              },
            },
          },
        }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.user.type).toBe('object');
      expect(schema.properties.user.properties.profile.type).toBe('object');
      expect(schema.properties.user.properties.profile.properties.address.type).toBe('object');
      expect(
        schema.properties.user.properties.profile.properties.address.properties.coordinates.type
      ).toBe('object');
    });

    it('should handle arrays of objects', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({
          users: [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
          ],
        }),
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.users.type).toBe('array');
      expect(schema.properties.users.items.type).toBe('object');
      expect(schema.properties.users.items.properties.id.type).toBe('integer');
      expect(schema.properties.users.items.properties.name.type).toBe('string');
    });
  });

  describe('Schema Options', () => {
    it('should include examples when enabled', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ name: 'John' }),
      };

      const spec = generateOpenAPISpec([endpoint], { ...defaultSettings, includeExamples: true });
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.name.example).toBe('John');
    });

    it('should not include examples when disabled', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ name: 'John' }),
      };

      const spec = generateOpenAPISpec([endpoint], { ...defaultSettings, includeExamples: false });
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.name.example).toBeUndefined();
    });

    it('should mark fields as required when enabled', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ id: 1, name: 'John' }),
      };

      const spec = generateOpenAPISpec([endpoint], { ...defaultSettings, markRequired: true });
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.required).toContain('id');
      expect(schema.required).toContain('name');
    });

    it('should not mark fields as required when disabled', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ id: 1, name: 'John' }),
      };

      const spec = generateOpenAPISpec([endpoint], { ...defaultSettings, markRequired: false });
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.required).toBeUndefined();
    });

    it('should add constraints when enabled', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ age: 30, name: 'John' }),
      };

      const spec = generateOpenAPISpec([endpoint], { ...defaultSettings, addConstraints: true });
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.age.minimum).toBeDefined();
      expect(schema.properties.age.maximum).toBeDefined();
      expect(schema.properties.name.minLength).toBeDefined();
      expect(schema.properties.name.maxLength).toBeDefined();
    });

    it('should add descriptions when enabled', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify({ name: 'John' }),
      };

      const spec = generateOpenAPISpec([endpoint], { ...defaultSettings, addDescriptions: true });
      const schema = (spec.paths['/api/users'] as any).get.responses['200'].content['application/json'].schema;

      expect(schema.properties.name.description).toBeDefined();
    });
  });

  describe('OpenAPI 3.0 Generation', () => {
    it('should generate valid OpenAPI 3.0 spec', () => {
      const spec = generateOpenAPISpec([simpleEndpoint], defaultSettings);

      expect(spec.openapi).toBe('3.0.3');
      expect(spec.info.title).toBe('Test API');
      expect(spec.info.version).toBe('1.0.0');
      expect(spec.servers).toBeDefined();
      expect(spec.servers![0].url).toBe('https://api.example.com');
    });

    it('should add request body for POST requests', () => {
      const postEndpoint: Endpoint = {
        ...simpleEndpoint,
        method: 'post',
      };

      const spec = generateOpenAPISpec([postEndpoint], defaultSettings);
      const operation = (spec.paths['/api/users'] as any).post;

      expect(operation.requestBody).toBeDefined();
      expect(operation.requestBody.required).toBe(true);
      expect(operation.requestBody.content['application/json']).toBeDefined();
    });

    it('should add request body for PUT requests', () => {
      const putEndpoint: Endpoint = {
        ...simpleEndpoint,
        method: 'put',
      };

      const spec = generateOpenAPISpec([putEndpoint], defaultSettings);
      const operation = (spec.paths['/api/users'] as any).put;

      expect(operation.requestBody).toBeDefined();
    });

    it('should add request body for PATCH requests', () => {
      const patchEndpoint: Endpoint = {
        ...simpleEndpoint,
        method: 'patch',
      };

      const spec = generateOpenAPISpec([patchEndpoint], defaultSettings);
      const operation = (spec.paths['/api/users'] as any).patch;

      expect(operation.requestBody).toBeDefined();
    });

    it('should not add request body for GET requests', () => {
      const spec = generateOpenAPISpec([simpleEndpoint], defaultSettings);
      const operation = (spec.paths['/api/users'] as any).get;

      expect(operation.requestBody).toBeUndefined();
    });

    it('should not add request body for DELETE requests', () => {
      const deleteEndpoint: Endpoint = {
        ...simpleEndpoint,
        method: 'delete',
      };

      const spec = generateOpenAPISpec([deleteEndpoint], defaultSettings);
      const operation = (spec.paths['/api/users'] as any).delete;

      expect(operation.requestBody).toBeUndefined();
    });

    it('should generate component schemas when enabled', () => {
      const spec = generateOpenAPISpec([simpleEndpoint], { ...defaultSettings, generateComponents: true });

      expect(spec.components).toBeDefined();
      expect(spec.components!.schemas).toBeDefined();
      expect(Object.keys(spec.components!.schemas!).length).toBeGreaterThan(0);
    });

    it('should not generate component schemas when disabled', () => {
      const spec = generateOpenAPISpec([simpleEndpoint], { ...defaultSettings, generateComponents: false });

      expect(spec.components).toBeUndefined();
    });
  });

  describe('Swagger 2.0 Generation', () => {
    it('should generate valid Swagger 2.0 spec', () => {
      const spec = generateOpenAPISpec([simpleEndpoint], { ...defaultSettings, openAPIVersion: '2.0' });

      expect(spec.swagger).toBe('2.0');
      expect(spec.host).toBe('api.example.com');
      expect(spec.basePath).toBeDefined();
      expect(spec.schemes).toContain('https');
    });

    it('should add body parameter for POST requests', () => {
      const postEndpoint: Endpoint = {
        ...simpleEndpoint,
        method: 'post',
      };

      const spec = generateOpenAPISpec([postEndpoint], { ...defaultSettings, openAPIVersion: '2.0' });
      const operation = (spec.paths['/api/users'] as any).post;

      expect(operation.parameters).toBeDefined();
      expect(operation.parameters[0].in).toBe('body');
      expect(operation.parameters[0].required).toBe(true);
    });

    it('should generate definitions when enabled', () => {
      const spec = generateOpenAPISpec([simpleEndpoint], {
        ...defaultSettings,
        openAPIVersion: '2.0',
        generateComponents: true,
      });

      expect(spec.definitions).toBeDefined();
      expect(Object.keys(spec.definitions!).length).toBeGreaterThan(0);
    });
  });

  describe('Endpoint Configuration', () => {
    it('should use custom operation ID', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        operationId: 'listUsers',
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const operation = (spec.paths['/api/users'] as any).get;

      expect(operation.operationId).toBe('listUsers');
    });

    it('should generate operation ID if not provided', () => {
      const spec = generateOpenAPISpec([simpleEndpoint], defaultSettings);
      const operation = (spec.paths['/api/users'] as any).get;

      expect(operation.operationId).toBeDefined();
    });

    it('should include summary', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        summary: 'Get all users',
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const operation = (spec.paths['/api/users'] as any).get;

      expect(operation.summary).toBe('Get all users');
    });

    it('should include description', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        description: 'Returns a list of users',
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const operation = (spec.paths['/api/users'] as any).get;

      expect(operation.description).toBe('Returns a list of users');
    });

    it('should include tags', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        tags: 'users, authentication',
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const operation = (spec.paths['/api/users'] as any).get;

      expect(operation.tags).toContain('users');
      expect(operation.tags).toContain('authentication');
    });

    it('should use custom response code', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        responseCode: '201',
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);
      const operation = (spec.paths['/api/users'] as any).get;

      expect(operation.responses['201']).toBeDefined();
    });
  });

  describe('Multiple Endpoints', () => {
    it('should handle multiple endpoints', () => {
      const endpoints: Endpoint[] = [
        simpleEndpoint,
        { ...simpleEndpoint, id: '2', path: '/api/products', method: 'post' },
        { ...simpleEndpoint, id: '3', path: '/api/orders', method: 'put' },
      ];

      const spec = generateOpenAPISpec(endpoints, defaultSettings);

      expect(Object.keys(spec.paths).length).toBe(3);
      expect(spec.paths['/api/users']).toBeDefined();
      expect(spec.paths['/api/products']).toBeDefined();
      expect(spec.paths['/api/orders']).toBeDefined();
    });

    it('should handle multiple methods on same path', () => {
      const endpoints: Endpoint[] = [
        { ...simpleEndpoint, id: '1', method: 'get' },
        { ...simpleEndpoint, id: '2', method: 'post' },
        { ...simpleEndpoint, id: '3', method: 'put' },
      ];

      const spec = generateOpenAPISpec(endpoints, defaultSettings);
      const pathObj = spec.paths['/api/users'] as any;

      expect(pathObj.get).toBeDefined();
      expect(pathObj.post).toBeDefined();
      expect(pathObj.put).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('should validate valid spec', () => {
      const spec: OpenAPISpec = {
        openapi: '3.0.3',
        info: { title: 'Test', version: '1.0.0' },
        servers: [{ url: 'https://api.example.com' }],
        paths: { '/test': {} },
      };

      const result = validateSpec(spec);

      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should catch missing info', () => {
      const spec: any = {
        openapi: '3.0.3',
        paths: {},
      };

      const result = validateSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: info');
    });

    it('should catch missing title', () => {
      const spec: OpenAPISpec = {
        openapi: '3.0.3',
        info: { title: '', version: '1.0.0' },
        paths: {},
      };

      const result = validateSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: info.title');
    });

    it('should catch missing version', () => {
      const spec: OpenAPISpec = {
        openapi: '3.0.3',
        info: { title: 'Test', version: '' },
        paths: {},
      };

      const result = validateSpec(spec);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: info.version');
    });

    it('should warn about missing servers in OpenAPI 3.0', () => {
      const spec: OpenAPISpec = {
        openapi: '3.0.3',
        info: { title: 'Test', version: '1.0.0' },
        paths: {},
      };

      const result = validateSpec(spec);

      expect(result.warnings).toContain('OpenAPI 3.0 spec should include servers array');
    });

    it('should warn about missing host in Swagger 2.0', () => {
      const spec: OpenAPISpec = {
        swagger: '2.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {},
      };

      const result = validateSpec(spec);

      expect(result.warnings).toContain('Swagger 2.0 spec should include host field');
    });
  });

  describe('Edge Cases', () => {
    it('should handle endpoints with empty JSON', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: '',
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);

      expect(Object.keys(spec.paths).length).toBe(0);
    });

    it('should handle invalid JSON gracefully', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: '{ invalid json }',
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);

      expect(Object.keys(spec.paths).length).toBe(0);
    });

    it('should handle very long paths', () => {
      const longPath = '/api/v1/very/long/path/to/resource/with/many/segments';
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        path: longPath,
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);

      expect(spec.paths[longPath]).toBeDefined();
    });

    it('should handle paths with parameters', () => {
      const endpoint: Endpoint = {
        ...simpleEndpoint,
        path: '/api/users/{id}/posts/{postId}',
      };

      const spec = generateOpenAPISpec([endpoint], defaultSettings);

      expect(spec.paths['/api/users/{id}/posts/{postId}']).toBeDefined();
    });
  });

  describe('Performance', () => {
    it('should handle large JSON objects quickly', () => {
      const largeObject: any = {};
      for (let i = 0; i < 100; i++) {
        largeObject[`field${i}`] = `value${i}`;
      }

      const endpoint: Endpoint = {
        ...simpleEndpoint,
        json: JSON.stringify(largeObject),
      };

      const start = performance.now();
      generateOpenAPISpec([endpoint], defaultSettings);
      const end = performance.now();

      expect(end - start).toBeLessThan(100);
    });

    it('should handle many endpoints quickly', () => {
      const endpoints: Endpoint[] = [];
      for (let i = 0; i < 50; i++) {
        endpoints.push({
          ...simpleEndpoint,
          id: String(i),
          path: `/api/endpoint${i}`,
        });
      }

      const start = performance.now();
      generateOpenAPISpec(endpoints, defaultSettings);
      const end = performance.now();

      expect(end - start).toBeLessThan(500);
    });
  });
});
