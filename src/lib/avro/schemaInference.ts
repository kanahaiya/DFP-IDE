/**
 * Avro Schema Inference Engine
 * Infers Apache Avro schemas from JSON data
 */

import type {
  AvroType,
  AvroField,
  AvroRecordSchema,
  AvroGeneratorSettings,
  AvroGenerationResult,
} from './types';
import { DEFAULT_AVRO_SETTINGS } from './types';

/**
 * Convert string to snake_case
 */
function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Convert string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, c => c.toUpperCase());
}

/**
 * Check if string looks like a date
 */
function looksLikeDate(value: string): boolean {
  // ISO date format: YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(value);
}

/**
 * Check if string looks like a timestamp
 */
function looksLikeTimestamp(value: string): boolean {
  // ISO 8601 timestamp
  const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/;
  return timestampRegex.test(value);
}

/**
 * Check if string looks like a UUID
 */
function looksLikeUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Infer Avro type from a JSON value
 * Returns 'RECORD' as a special marker for nested objects
 */
function inferType(value: unknown, settings: AvroGeneratorSettings, fieldName: string): AvroType | 'RECORD' {
  if (value === null) {
    return 'null';
  }
  
  const type = typeof value;
  
  switch (type) {
    case 'boolean':
      return 'boolean';
    
    case 'number':
      if (Number.isInteger(value)) {
        const num = value as number;
        // Use long for numbers that exceed int32 range
        if (num > 2147483647 || num < -2147483648) {
          return 'long';
        }
        return 'int';
      }
      return 'double';
    
    case 'string': {
      const str = value as string;
      
      if (settings.inferLogicalTypes) {
        if (looksLikeUUID(str)) {
          return { type: 'string', logicalType: 'uuid' };
        }
        if (looksLikeTimestamp(str)) {
          return { type: 'long', logicalType: 'timestamp-millis' };
        }
        if (looksLikeDate(str)) {
          return { type: 'int', logicalType: 'date' };
        }
      }
      return 'string';
    }
    
    case 'object':
      if (Array.isArray(value)) {
        if (value.length === 0) {
          // Empty array - default to string items
          return { type: 'array', items: 'string' };
        }
        // For arrays of objects, mark as RECORD to handle separately
        const firstItem = value[0];
        if (typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
          // Array of objects - will be handled separately
          return 'RECORD';
        }
        // Infer type from first element for primitive arrays
        const itemType = inferType(firstItem, settings, fieldName + 'Item');
        if (itemType === 'RECORD') {
          return 'RECORD';
        }
        return { type: 'array', items: itemType };
      }
      // Nested object - will be handled separately
      return 'RECORD';
    
    default:
      return 'string';
  }
}

/**
 * Generate Avro record schema from JSON object
 */
function generateRecordSchema(
  data: Record<string, unknown>,
  recordName: string,
  settings: AvroGeneratorSettings,
  nestedRecords: Map<string, AvroRecordSchema>
): AvroRecordSchema {
  const fields: AvroField[] = [];
  
  for (const [key, value] of Object.entries(data)) {
    const fieldName = settings.useSnakeCase ? toSnakeCase(key) : key;
    const inferredType = inferType(value, settings, fieldName);
    let fieldType: AvroType = inferredType === 'RECORD' ? 'string' : inferredType;
    
    // Handle nested objects and arrays of objects
    if (inferredType === 'RECORD') {
      if (Array.isArray(value) && value.length > 0) {
        // Array of objects
        const nestedName = toPascalCase(key) + 'Item';
        const nestedSchema = generateRecordSchema(
          value[0] as Record<string, unknown>,
          nestedName,
          settings,
          nestedRecords
        );
        nestedRecords.set(nestedName, nestedSchema);
        fieldType = { type: 'array', items: nestedName };
      } else {
        // Single nested object - inline the record schema
        const nestedName = toPascalCase(key);
        const nestedSchema = generateRecordSchema(
          value as Record<string, unknown>,
          nestedName,
          settings,
          nestedRecords
        );
        nestedRecords.set(nestedName, nestedSchema);
        // Use the nested schema directly
        fieldType = nestedSchema;
      }
    }
    
    // Handle nullable fields
    const isNullable = value === null || value === undefined;
    if (settings.useUnionForNullable && isNullable) {
      fieldType = ['null', fieldType === 'null' ? 'string' : fieldType];
    }
    
    const field: AvroField = {
      name: fieldName,
      type: fieldType,
    };
    
    // Add default value
    if (settings.includeDefaults) {
      if (Array.isArray(fieldType) && fieldType[0] === 'null') {
        field.default = null;
      }
    }
    
    // Add documentation
    if (settings.generateDoc) {
      field.doc = `Field: ${key}`;
    }
    
    fields.push(field);
  }
  
  const schema: AvroRecordSchema = {
    type: 'record',
    name: recordName,
    fields,
  };
  
  if (settings.namespace) {
    schema.namespace = settings.namespace;
  }
  
  if (settings.generateDoc) {
    schema.doc = `Avro schema for ${recordName}`;
  }
  
  return schema;
}

/**
 * Main function to convert JSON to Avro schema
 */
export function jsonToAvroSchema(
  json: string,
  settings: Partial<AvroGeneratorSettings> = {}
): AvroGenerationResult {
  const fullSettings: AvroGeneratorSettings = {
    ...DEFAULT_AVRO_SETTINGS,
    ...settings,
  };
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Parse JSON
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch (e) {
    return {
      success: false,
      schema: '',
      parsedSchema: null,
      errors: [`Invalid JSON: ${(e as Error).message}`],
      warnings: [],
    };
  }
  
  // Handle arrays at root level
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return {
        success: false,
        schema: '',
        parsedSchema: null,
        errors: ['Cannot generate schema from empty array'],
        warnings: [],
      };
    }
    data = data[0];
    warnings.push('Root array detected. Using first element as template.');
  }
  
  if (typeof data !== 'object' || data === null) {
    return {
      success: false,
      schema: '',
      parsedSchema: null,
      errors: ['JSON must be an object or array of objects'],
      warnings: [],
    };
  }
  
  // Generate schema
  const nestedRecords = new Map<string, AvroRecordSchema>();
  const rootSchema = generateRecordSchema(
    data as Record<string, unknown>,
    fullSettings.rootRecordName,
    fullSettings,
    nestedRecords
  );
  
  // Build final schema with nested records inlined
  const finalSchema = inlineNestedRecords(rootSchema, nestedRecords);
  
  // Format output
  const schemaString = JSON.stringify(finalSchema, null, fullSettings.indentation);
  
  return {
    success: true,
    schema: schemaString,
    parsedSchema: finalSchema,
    errors,
    warnings,
  };
}

/**
 * Inline nested record schemas into the main schema
 */
function inlineNestedRecords(
  schema: AvroRecordSchema,
  nestedRecords: Map<string, AvroRecordSchema>
): AvroRecordSchema {
  const processType = (type: AvroType | string): AvroType => {
    if (typeof type === 'string' && nestedRecords.has(type)) {
      const nested = nestedRecords.get(type)!;
      return inlineNestedRecords(nested, nestedRecords);
    }
    
    if (typeof type === 'string') {
      // Return primitive string type as-is
      return type as AvroType;
    }
    
    if (Array.isArray(type)) {
      return type.map(t => processType(t)) as AvroType;
    }
    
    if (typeof type === 'object' && 'type' in type) {
      if (type.type === 'array' && 'items' in type) {
        const processedItems = processType(type.items);
        return { type: 'array', items: processedItems };
      }
      if (type.type === 'map' && 'values' in type) {
        const processedValues = processType(type.values);
        return { type: 'map', values: processedValues };
      }
    }
    
    return type;
  };
  
  return {
    ...schema,
    fields: schema.fields.map(field => ({
      ...field,
      type: processType(field.type),
    })),
  };
}

/**
 * Validate an Avro schema
 */
export function validateAvroSchema(schema: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const parsed = JSON.parse(schema);
    
    if (!parsed.type || parsed.type !== 'record') {
      errors.push('Schema must be a record type');
    }
    
    if (!parsed.name) {
      errors.push('Schema must have a name');
    }
    
    if (!parsed.fields || !Array.isArray(parsed.fields)) {
      errors.push('Schema must have a fields array');
    }
  } catch (e) {
    errors.push(`Invalid JSON: ${(e as Error).message}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
