import { inferType, mergeTypes, type InferredType } from '../typeInference';

describe('Type Inference', () => {
  describe('Primitive Types', () => {
    it('should infer string type', () => {
      const result = inferType('hello');
      expect(result.type).toBe('string');
    });

    it('should infer integer type', () => {
      const result = inferType(42);
      expect(result.type).toBe('integer');
      expect(result.format).toBe('int64');
    });

    it('should infer number type for floats', () => {
      const result = inferType(3.14);
      expect(result.type).toBe('number');
      expect(result.format).toBe('double');
    });

    it('should infer boolean type', () => {
      const result = inferType(true);
      expect(result.type).toBe('boolean');
    });

    it('should handle null values', () => {
      const result = inferType(null);
      expect(result.type).toBe('string');
      expect(result.nullable).toBe(true);
    });
  });

  describe('String Format Detection', () => {
    it('should detect email format', () => {
      const result = inferType('test@example.com');
      expect(result.type).toBe('string');
      expect(result.format).toBe('email');
    });

    it('should detect email from key name', () => {
      const result = inferType('john@example.com', 'userEmail');
      expect(result.format).toBe('email');
    });

    it('should detect UUID format', () => {
      const result = inferType('123e4567-e89b-12d3-a456-426614174000');
      expect(result.type).toBe('string');
      expect(result.format).toBe('uuid');
    });

    it('should detect date-time format', () => {
      const result = inferType('2024-01-15T10:30:00Z');
      expect(result.type).toBe('string');
      expect(result.format).toBe('date-time');
    });

    it('should detect date format with date key', () => {
      const result = inferType('2024-01-15', 'birthDate');
      expect(result.type).toBe('string');
      expect(result.format).toBe('date');
    });

    it('should detect URI format from value', () => {
      const result = inferType('https://example.com/path');
      expect(result.type).toBe('string');
      expect(result.format).toBe('uri');
    });

    it('should detect URI format from key', () => {
      const result = inferType('example.com', 'websiteUrl');
      expect(result.type).toBe('string');
      expect(result.format).toBe('uri');
    });

    it('should not detect format for regular strings', () => {
      const result = inferType('just a regular string');
      expect(result.type).toBe('string');
      expect(result.format).toBeUndefined();
    });
  });

  describe('Array Types', () => {
    it('should infer array of strings', () => {
      const result = inferType(['one', 'two', 'three']);
      expect(result.type).toBe('array');
      expect(result.items?.type).toBe('string');
    });

    it('should infer array of numbers', () => {
      const result = inferType([1, 2, 3]);
      expect(result.type).toBe('array');
      expect(result.items?.type).toBe('integer');
    });

    it('should infer array of objects', () => {
      const result = inferType([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ]);
      
      expect(result.type).toBe('array');
      expect(result.items?.type).toBe('object');
      expect(result.items?.properties?.id.type).toBe('integer');
      expect(result.items?.properties?.name.type).toBe('string');
    });

    it('should handle empty arrays', () => {
      const result = inferType([]);
      expect(result.type).toBe('array');
      expect(result.items?.type).toBe('string');
    });

    it('should infer from first element only', () => {
      const result = inferType([
        { id: 1, name: 'John' },
        { id: 'two', name: 'Jane' }, // Different type for id
      ]);
      
      // Should infer from first element
      expect(result.items?.properties?.id.type).toBe('integer');
    });
  });

  describe('Object Types', () => {
    it('should infer simple object', () => {
      const result = inferType({
        name: 'John',
        age: 30,
      });
      
      expect(result.type).toBe('object');
      expect(result.properties?.name.type).toBe('string');
      expect(result.properties?.age.type).toBe('integer');
    });

    it('should mark required fields', () => {
      const result = inferType({
        name: 'John',
        age: 30,
      });
      
      expect(result.required).toContain('name');
      expect(result.required).toContain('age');
    });

    it('should not mark null fields as required', () => {
      const result = inferType({
        name: 'John',
        middleName: null,
      });
      
      expect(result.required).toContain('name');
      expect(result.required).not.toContain('middleName');
    });

    it('should handle nested objects', () => {
      const result = inferType({
        user: {
          profile: {
            name: 'John',
          },
        },
      });
      
      expect(result.type).toBe('object');
      expect(result.properties?.user.type).toBe('object');
      expect(result.properties?.user.properties?.profile.type).toBe('object');
      expect(result.properties?.user.properties?.profile.properties?.name.type).toBe('string');
    });

    it('should handle mixed types in object', () => {
      const result = inferType({
        string: 'text',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' },
      });
      
      expect(result.properties?.string.type).toBe('string');
      expect(result.properties?.number.type).toBe('integer');
      expect(result.properties?.boolean.type).toBe('boolean');
      expect(result.properties?.array.type).toBe('array');
      expect(result.properties?.object.type).toBe('object');
    });
  });

  describe('Complex Nested Structures', () => {
    it('should handle deeply nested objects', () => {
      const result = inferType({
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep',
              },
            },
          },
        },
      });
      
      expect(result.type).toBe('object');
      let current = result.properties?.level1;
      expect(current?.type).toBe('object');
      
      current = current?.properties?.level2;
      expect(current?.type).toBe('object');
      
      current = current?.properties?.level3;
      expect(current?.type).toBe('object');
      
      current = current?.properties?.level4;
      expect(current?.type).toBe('object');
      expect(current?.properties?.value.type).toBe('string');
    });

    it('should handle arrays of nested objects', () => {
      const result = inferType({
        users: [
          {
            id: 1,
            profile: {
              name: 'John',
              address: {
                city: 'NYC',
              },
            },
          },
        ],
      });
      
      expect(result.properties?.users.type).toBe('array');
      expect(result.properties?.users.items?.type).toBe('object');
      expect(result.properties?.users.items?.properties?.profile.type).toBe('object');
      expect(result.properties?.users.items?.properties?.profile.properties?.address.type).toBe('object');
    });
  });

  describe('Type Merging', () => {
    it('should merge same primitive types', () => {
      const type1: InferredType = { type: 'string' };
      const type2: InferredType = { type: 'string' };
      
      const result = mergeTypes(type1, type2);
      expect(result.type).toBe('string');
    });

    it('should fallback to string for conflicting types', () => {
      const type1: InferredType = { type: 'string' };
      const type2: InferredType = { type: 'integer' };
      
      const result = mergeTypes(type1, type2);
      expect(result.type).toBe('string');
    });

    it('should merge object types', () => {
      const type1: InferredType = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'integer' },
        },
        required: ['name', 'age'],
      };
      
      const type2: InferredType = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
        required: ['name'],
      };
      
      const result = mergeTypes(type1, type2);
      
      expect(result.type).toBe('object');
      expect(result.properties?.name.type).toBe('string');
      expect(result.properties?.age.type).toBe('integer');
      expect(result.properties?.email.type).toBe('string');
      expect(result.required).toContain('name');
      expect(result.required).not.toContain('age'); // Not in both
    });

    it('should merge array types', () => {
      const type1: InferredType = {
        type: 'array',
        items: { type: 'string' },
      };
      
      const type2: InferredType = {
        type: 'array',
        items: { type: 'string', format: 'email' },
      };
      
      const result = mergeTypes(type1, type2);
      
      expect(result.type).toBe('array');
      expect(result.items?.type).toBe('string');
      expect(result.items?.format).toBe('email'); // Prefer format
    });

    it('should prefer type with format', () => {
      const type1: InferredType = { type: 'string' };
      const type2: InferredType = { type: 'string', format: 'email' };
      
      const result = mergeTypes(type1, type2);
      expect(result.format).toBe('email');
    });

    it('should handle nested object merging', () => {
      const type1: InferredType = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
          },
        },
      };
      
      const type2: InferredType = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              age: { type: 'integer' },
            },
          },
        },
      };
      
      const result = mergeTypes(type1, type2);
      
      expect(result.properties?.user.properties?.name.type).toBe('string');
      expect(result.properties?.user.properties?.age.type).toBe('integer');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined', () => {
      const result = inferType(undefined);
      expect(result.type).toBe('string');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      const result = inferType(longString);
      expect(result.type).toBe('string');
    });

    it('should handle very large numbers', () => {
      const result = inferType(Number.MAX_SAFE_INTEGER);
      expect(result.type).toBe('integer');
    });

    it('should handle very small numbers', () => {
      const result = inferType(Number.MIN_SAFE_INTEGER);
      expect(result.type).toBe('integer');
    });

    it('should handle special number values', () => {
      const infinityResult = inferType(Infinity);
      expect(infinityResult.type).toBe('number');
      
      const nanResult = inferType(NaN);
      expect(nanResult.type).toBe('number');
    });

    it('should handle empty objects', () => {
      const result = inferType({});
      expect(result.type).toBe('object');
      expect(result.properties).toEqual({});
    });

    it('should handle objects with many properties', () => {
      const largeObject: any = {};
      for (let i = 0; i < 100; i++) {
        largeObject[`field${i}`] = `value${i}`;
      }
      
      const result = inferType(largeObject);
      expect(result.type).toBe('object');
      expect(Object.keys(result.properties || {}).length).toBe(100);
    });

    it('should handle special characters in keys', () => {
      const result = inferType({
        'key-with-dashes': 'value',
        'key.with.dots': 'value',
        'key_with_underscores': 'value',
      });
      
      expect(result.properties?.['key-with-dashes'].type).toBe('string');
      expect(result.properties?.['key.with.dots'].type).toBe('string');
      expect(result.properties?.['key_with_underscores'].type).toBe('string');
    });

    it('should handle Unicode in keys and values', () => {
      const result = inferType({
        '日本語': '値',
        emoji: '🚀',
      });
      
      expect(result.properties?.['日本語'].type).toBe('string');
      expect(result.properties?.emoji.type).toBe('string');
    });
  });

  describe('Performance', () => {
    it('should handle large objects quickly', () => {
      const largeObject: any = {};
      for (let i = 0; i < 100; i++) {
        largeObject[`field${i}`] = `value${i}`;
      }
      
      const start = performance.now();
      inferType(largeObject);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50);
    });

    it('should handle deep nesting quickly', () => {
      let deepObject: any = { value: 'deep' };
      for (let i = 0; i < 10; i++) {
        deepObject = { nested: deepObject };
      }
      
      const start = performance.now();
      inferType(deepObject);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50);
    });
  });
});
