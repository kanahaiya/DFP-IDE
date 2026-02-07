/**
 * Parquet Schema Inference Engine
 * Infers Apache Parquet schemas from JSON data
 */

import type {
  ParquetPrimitiveType,
  ParquetLogicalType,
  ParquetRepetition,
  ParquetField,
  ParquetSchema,
  ParquetGeneratorSettings,
  ParquetGenerationResult,
  ParquetStats,
} from './types';
import { DEFAULT_PARQUET_SETTINGS } from './types';

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
 * Check if string looks like a date
 */
function looksLikeDate(value: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(value);
}

/**
 * Check if string looks like a timestamp
 */
function looksLikeTimestamp(value: string): boolean {
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
 * Infer Parquet type from a JSON value
 */
function inferType(
  value: unknown,
  settings: ParquetGeneratorSettings
): { type: ParquetPrimitiveType; logicalType?: ParquetLogicalType } {
  if (value === null || value === undefined) {
    return { type: 'BYTE_ARRAY', logicalType: 'STRING' };
  }

  const jsType = typeof value;

  switch (jsType) {
    case 'boolean':
      return { type: 'BOOLEAN' };

    case 'number':
      if (Number.isInteger(value)) {
        const num = value as number;
        if (num > 2147483647 || num < -2147483648) {
          return { type: 'INT64' };
        }
        return { type: 'INT32' };
      }
      return { type: 'DOUBLE' };

    case 'string': {
      const str = value as string;

      if (settings.inferLogicalTypes) {
        if (looksLikeUUID(str)) {
          return { type: 'FIXED_LEN_BYTE_ARRAY', logicalType: 'UUID' };
        }
        if (looksLikeTimestamp(str)) {
          return { type: 'INT64', logicalType: 'TIMESTAMP' };
        }
        if (looksLikeDate(str)) {
          return { type: 'INT32', logicalType: 'DATE' };
        }
      }
      return { type: 'BYTE_ARRAY', logicalType: 'STRING' };
    }

    default:
      return { type: 'BYTE_ARRAY', logicalType: 'STRING' };
  }
}

/**
 * Generate Parquet field from JSON key-value
 */
function generateField(
  key: string,
  value: unknown,
  settings: ParquetGeneratorSettings
): ParquetField {
  const fieldName = settings.useSnakeCase ? toSnakeCase(key) : key;
  const isNullable = value === null || value === undefined;
  const repetition: ParquetRepetition = isNullable && settings.useOptionalForNullable 
    ? 'OPTIONAL' 
    : 'REQUIRED';

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return {
        name: fieldName,
        type: 'BYTE_ARRAY',
        logicalType: 'LIST',
        repetition: 'OPTIONAL',
        children: [{
          name: 'element',
          type: 'BYTE_ARRAY',
          logicalType: 'STRING',
          repetition: 'OPTIONAL',
        }],
      };
    }

    const firstItem = value[0];
    
    // Array of objects
    if (typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
      const childFields = Object.entries(firstItem as Record<string, unknown>).map(
        ([k, v]) => generateField(k, v, settings)
      );
      
      return {
        name: fieldName,
        type: 'BYTE_ARRAY',
        logicalType: 'LIST',
        repetition: 'OPTIONAL',
        children: [{
          name: 'element',
          type: 'BYTE_ARRAY',
          repetition: 'OPTIONAL',
          children: childFields,
        }],
      };
    }

    // Array of primitives
    const { type, logicalType } = inferType(firstItem, settings);
    return {
      name: fieldName,
      type: 'BYTE_ARRAY',
      logicalType: 'LIST',
      repetition: 'OPTIONAL',
      children: [{
        name: 'element',
        type,
        logicalType,
        repetition: 'OPTIONAL',
      }],
    };
  }

  // Handle nested objects
  if (typeof value === 'object' && value !== null) {
    const childFields = Object.entries(value as Record<string, unknown>).map(
      ([k, v]) => generateField(k, v, settings)
    );

    return {
      name: fieldName,
      type: 'BYTE_ARRAY',
      repetition,
      children: childFields,
    };
  }

  // Handle primitives
  const { type, logicalType } = inferType(value, settings);
  
  const field: ParquetField = {
    name: fieldName,
    type,
    repetition,
  };

  if (logicalType) {
    field.logicalType = logicalType;
  }

  return field;
}

/**
 * Generate Parquet schema text representation
 */
function schemaToText(schema: ParquetSchema, indent: number = 0): string {
  const pad = '  '.repeat(indent);
  const lines: string[] = [];

  if (indent === 0) {
    lines.push(`message ${schema.name} {`);
  }

  for (const field of schema.fields) {
    const typeStr = field.logicalType 
      ? `${field.type} (${field.logicalType})` 
      : field.type;

    if (field.children && field.children.length > 0) {
      lines.push(`${pad}  ${field.repetition.toLowerCase()} group ${field.name}${field.logicalType ? ` (${field.logicalType})` : ''} {`);
      
      for (const child of field.children) {
        const childTypeStr = child.logicalType 
          ? `${child.type} (${child.logicalType})` 
          : child.type;
        
        if (child.children && child.children.length > 0) {
          lines.push(`${pad}    ${child.repetition.toLowerCase()} group ${child.name} {`);
          const childSchema: ParquetSchema = { name: '', fields: child.children };
          const nestedText = schemaToText(childSchema, indent + 3);
          lines.push(nestedText);
          lines.push(`${pad}    }`);
        } else {
          lines.push(`${pad}    ${child.repetition.toLowerCase()} ${childTypeStr} ${child.name};`);
        }
      }
      
      lines.push(`${pad}  }`);
    } else {
      lines.push(`${pad}  ${field.repetition.toLowerCase()} ${typeStr} ${field.name};`);
    }
  }

  if (indent === 0) {
    lines.push('}');
  }

  return lines.join('\n');
}

/**
 * Calculate estimated size
 */
function calculateStats(data: unknown[], schema: ParquetSchema, settings: ParquetGeneratorSettings): ParquetStats {
  const rowCount = data.length;
  const columnCount = countColumns(schema.fields);
  
  // Rough estimation: JSON size * compression ratio
  const jsonSize = JSON.stringify(data).length;
  const compressionRatios: Record<string, number> = {
    'UNCOMPRESSED': 1.0,
    'SNAPPY': 0.5,
    'GZIP': 0.3,
    'LZ4': 0.45,
    'ZSTD': 0.25,
  };
  
  const ratio = compressionRatios[settings.compression] || 0.5;
  const estimatedBytes = Math.round(jsonSize * ratio * 0.8); // Parquet is typically more efficient
  
  let estimatedSize: string;
  if (estimatedBytes < 1024) {
    estimatedSize = `${estimatedBytes} B`;
  } else if (estimatedBytes < 1024 * 1024) {
    estimatedSize = `${(estimatedBytes / 1024).toFixed(2)} KB`;
  } else {
    estimatedSize = `${(estimatedBytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return {
    rowCount,
    columnCount,
    estimatedSize,
    compression: settings.compression,
  };
}

/**
 * Count total columns including nested
 */
function countColumns(fields: ParquetField[]): number {
  let count = 0;
  for (const field of fields) {
    if (field.children && field.children.length > 0) {
      count += countColumns(field.children);
    } else {
      count += 1;
    }
  }
  return count;
}

/**
 * Main function to convert JSON to Parquet schema
 */
export function jsonToParquetSchema(
  json: string,
  settings: Partial<ParquetGeneratorSettings> = {}
): ParquetGenerationResult {
  const fullSettings: ParquetGeneratorSettings = {
    ...DEFAULT_PARQUET_SETTINGS,
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
      schemaText: '',
      schema: null,
      stats: null,
      errors: [`Invalid JSON: ${(e as Error).message}`],
      warnings: [],
    };
  }

  // Ensure array for proper schema inference
  let dataArray: unknown[];
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return {
        success: false,
        schemaText: '',
        schema: null,
        stats: null,
        errors: ['Cannot generate schema from empty array'],
        warnings: [],
      };
    }
    dataArray = data;
  } else if (typeof data === 'object' && data !== null) {
    dataArray = [data];
    warnings.push('Single object detected. Using as single-row table.');
  } else {
    return {
      success: false,
      schemaText: '',
      schema: null,
      stats: null,
      errors: ['JSON must be an object or array of objects'],
      warnings: [],
    };
  }

  // Generate schema from first element
  const firstRow = dataArray[0] as Record<string, unknown>;
  const fields = Object.entries(firstRow).map(([key, value]) =>
    generateField(key, value, fullSettings)
  );

  const schema: ParquetSchema = {
    name: fullSettings.rootName,
    fields,
  };

  const schemaText = schemaToText(schema);
  const stats = calculateStats(dataArray, schema, fullSettings);

  return {
    success: true,
    schemaText,
    schema,
    stats,
    errors,
    warnings,
  };
}

/**
 * Validate a Parquet schema text
 */
export function validateParquetSchema(schemaText: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!schemaText.includes('message ')) {
    errors.push('Schema must start with "message"');
  }

  const openBraces = (schemaText.match(/{/g) || []).length;
  const closeBraces = (schemaText.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push('Unbalanced braces in schema');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
