/**
 * Type Inference Engine
 * Infers types and structure from JSON data
 */

import type { InferredType, InferredSchema, InferredProperty, SchemaGeneratorSettings } from './types';

/**
 * Regular expressions for format detection
 */
const FORMAT_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uri: /^https?:\/\//,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  date: /^\d{4}-\d{2}-\d{2}$/,
  dateTime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
  ipv4: /^(\d{1,3}\.){3}\d{1,3}$/,
  ipv6: /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i,
};

/**
 * Detect string format
 */
function detectStringFormat(value: string): string | undefined {
  if (FORMAT_PATTERNS.email.test(value)) return 'email';
  if (FORMAT_PATTERNS.uuid.test(value)) return 'uuid';
  if (FORMAT_PATTERNS.dateTime.test(value)) return 'date-time';
  if (FORMAT_PATTERNS.date.test(value)) return 'date';
  if (FORMAT_PATTERNS.uri.test(value)) return 'uri';
  if (FORMAT_PATTERNS.ipv4.test(value)) return 'ipv4';
  if (FORMAT_PATTERNS.ipv6.test(value)) return 'ipv6';
  return undefined;
}

/**
 * Infer type from a single value
 */
function inferType(value: unknown, settings: SchemaGeneratorSettings): InferredType {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'integer' : 'number';
  }
  if (typeof value === 'string') {
    if (settings.inferFormats) {
      const format = detectStringFormat(value);
      if (format === 'email') return 'email';
      if (format === 'uri') return 'uri';
      if (format === 'uuid') return 'uuid';
      if (format === 'date' || format === 'date-time') return 'date';
    }
    return 'string';
  }
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return 'unknown';
}

/**
 * Merge two inferred types (for arrays with mixed types)
 */
function mergeTypes(type1: InferredType, type2: InferredType): InferredType {
  if (type1 === type2) return type1;
  if (type1 === 'integer' && type2 === 'number') return 'number';
  if (type1 === 'number' && type2 === 'integer') return 'number';
  // For other mismatches, fall back to string (most permissive)
  return 'string';
}

/**
 * Infer schema from array items
 */
function inferArrayItemsSchema(
  items: unknown[],
  settings: SchemaGeneratorSettings
): InferredSchema | undefined {
  if (items.length === 0) return undefined;

  // Infer schema from first item, then merge with others
  let itemSchema = inferSchemaFromValue(items[0], 'item', settings);

  for (let i = 1; i < items.length; i++) {
    const otherSchema = inferSchemaFromValue(items[i], 'item', settings);
    itemSchema = mergeSchemas(itemSchema, otherSchema);
  }

  return itemSchema;
}

/**
 * Merge two schemas
 */
function mergeSchemas(schema1: InferredSchema, schema2: InferredSchema): InferredSchema {
  if (schema1.type !== schema2.type) {
    // Different types, use more general type
    return {
      type: mergeTypes(schema1.type, schema2.type),
    };
  }

  if (schema1.type === 'object' && schema2.type === 'object') {
    const mergedProperties: Record<string, InferredProperty> = { ...schema1.properties };
    
    for (const [key, prop] of Object.entries(schema2.properties || {})) {
      if (mergedProperties[key]) {
        // Property exists in both, merge
        mergedProperties[key] = {
          ...mergedProperties[key],
          isRequired: mergedProperties[key].isRequired && prop.isRequired,
          isNullable: mergedProperties[key].isNullable || prop.isNullable,
        };
      } else {
        // Property only in second schema, mark as optional
        mergedProperties[key] = {
          ...prop,
          isRequired: false,
        };
      }
    }

    // Mark properties only in first schema as optional
    for (const key of Object.keys(schema1.properties || {})) {
      if (!schema2.properties?.[key]) {
        mergedProperties[key].isRequired = false;
      }
    }

    return {
      type: 'object',
      properties: mergedProperties,
    };
  }

  if (schema1.type === 'array' && schema2.type === 'array') {
    const mergedItems = schema1.items && schema2.items
      ? mergeSchemas(schema1.items, schema2.items)
      : schema1.items || schema2.items;

    return {
      type: 'array',
      items: mergedItems,
    };
  }

  return schema1;
}

/**
 * Infer schema from a value
 */
function inferSchemaFromValue(
  value: unknown,
  name: string,
  settings: SchemaGeneratorSettings
): InferredSchema {
  const type = inferType(value, settings);

  if (type === 'object' && typeof value === 'object' && value !== null) {
    const properties: Record<string, InferredProperty> = {};
    const entries = Object.entries(value as Record<string, unknown>);
    
    // Optionally sort properties
    const sortedEntries = settings.sortProperties
      ? entries.sort(([a], [b]) => a.localeCompare(b))
      : entries;

    for (const [key, val] of sortedEntries) {
      const propType = inferType(val, settings);
      const prop: InferredProperty = {
        name: key,
        type: propType,
        isRequired: !settings.makeAllOptional && (settings.makeAllRequired || val !== null),
        isNullable: val === null,
      };

      // Add format for strings
      if (propType === 'string' && typeof val === 'string' && settings.inferFormats) {
        prop.format = detectStringFormat(val);
      }

      // Handle nested objects
      if (propType === 'object' && val !== null) {
        const nestedSchema = inferSchemaFromValue(val, key, settings);
        prop.properties = nestedSchema.properties;
      }

      // Handle arrays
      if (propType === 'array' && Array.isArray(val)) {
        prop.items = inferArrayItemsSchema(val, settings);
      }

      properties[key] = prop;
    }

    return {
      type: 'object',
      properties,
      title: name,
    };
  }

  if (type === 'array' && Array.isArray(value)) {
    return {
      type: 'array',
      items: inferArrayItemsSchema(value, settings),
    };
  }

  return { type };
}

/**
 * Main inference function
 */
export function inferSchema(
  json: string,
  settings: SchemaGeneratorSettings
): InferredSchema {
  const parsed = JSON.parse(json);
  return inferSchemaFromValue(parsed, settings.rootName, settings);
}

/**
 * Convert inferred type to JSON Schema type
 */
export function toJsonSchemaType(type: InferredType): string {
  switch (type) {
    case 'email':
    case 'uri':
    case 'uuid':
    case 'date':
      return 'string';
    default:
      return type;
  }
}

/**
 * Get format string for special types
 */
export function getFormatForType(type: InferredType): string | undefined {
  switch (type) {
    case 'email':
      return 'email';
    case 'uri':
      return 'uri';
    case 'uuid':
      return 'uuid';
    case 'date':
      return 'date-time';
    default:
      return undefined;
  }
}
