/**
 * Type inference for CSV data
 * Converts string values to appropriate JavaScript types
 */

import type { CSVSettings } from '@/store/csv';

/**
 * Check if value is a number
 */
export function isNumber(value: string): boolean {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  
  const trimmed = value.trim();
  
  // Handle scientific notation
  if (/^[+-]?\d+\.?\d*[eE][+-]?\d+$/.test(trimmed)) {
    return true;
  }
  
  // Handle regular numbers (including decimals and negatives)
  return /^[+-]?\d+\.?\d*$/.test(trimmed) && !isNaN(parseFloat(trimmed));
}

/**
 * Check if value is a boolean
 */
export function isBoolean(value: string): boolean {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  
  const trimmed = value.trim().toLowerCase();
  return ['true', 'false', 'yes', 'no', '1', '0'].includes(trimmed);
}

/**
 * Check if value is null
 */
export function isNull(value: string): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  
  const trimmed = value.trim().toLowerCase();
  return trimmed === '' || trimmed === 'null' || trimmed === 'nil' || trimmed === 'none';
}

/**
 * Check if value is a date-time (ISO 8601 format)
 */
export function isDateTime(value: string): boolean {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  
  const trimmed = value.trim();
  
  // ISO 8601 date-time patterns (must include time portion)
  // Examples: 2024-01-15T10:30:00Z, 2024-01-15T10:30:00.123+05:30
  const iso8601Pattern =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
  
  if (!iso8601Pattern.test(trimmed)) {
    return false;
  }
  
  const date = new Date(trimmed);
  return !isNaN(date.getTime());
}

/**
 * Check if value is a date (YYYY-MM-DD format)
 */
export function isDate(value: string): boolean {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  
  const trimmed = value.trim();
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!datePattern.test(trimmed)) {
    return false;
  }
  
  const date = new Date(trimmed);
  return !isNaN(date.getTime());
}

/**
 * Check if value is an email
 */
export function isEmail(value: string): boolean {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  
  const trimmed = value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(trimmed);
}

/**
 * Check if value is a UUID
 */
export function isUUID(value: string): boolean {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  
  const trimmed = value.trim();
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(trimmed);
}

/**
 * Check if value is a URL
 */
export function isURL(value: string): boolean {
  if (value === '' || value === null || value === undefined) {
    return false;
  }
  
  const trimmed = value.trim();
  
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Convert boolean string to boolean
 */
export function parseBoolean(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  return trimmed === 'true' || trimmed === 'yes' || trimmed === '1';
}

/**
 * Convert number string to number
 */
export function parseNumber(value: string): number {
  return parseFloat(value.trim());
}

/**
 * Infer and convert value to appropriate type
 */
export function inferAndConvertValue(value: unknown, settings: CSVSettings): unknown {
  // If value is not a string, return as-is
  if (typeof value !== 'string') {
    return value;
  }
  
  const strValue = value as string;
  
  // Check for null first
  if (settings.parseNulls && isNull(strValue)) {
    return null;
  }
  
  // Check for numbers
  if (settings.parseNumbers && isNumber(strValue)) {
    return parseNumber(strValue);
  }
  
  // Check for booleans
  if (settings.parseBooleans && isBoolean(strValue)) {
    return parseBoolean(strValue);
  }
  
  // Check for dates
  if (settings.parseDates) {
    if (isDateTime(strValue)) {
      return strValue; // Keep as ISO string for JSON compatibility
    }
    if (isDate(strValue)) {
      return strValue; // Keep as date string
    }
  }
  
  // Return as string
  return strValue;
}

/**
 * Detect format of a value (for schema generation or metadata)
 */
export function detectFormat(value: string): string | undefined {
  if (isEmail(value)) {
    return 'email';
  }
  
  if (isUUID(value)) {
    return 'uuid';
  }
  
  if (isURL(value)) {
    return 'uri';
  }
  
  if (isDateTime(value)) {
    return 'date-time';
  }
  
  if (isDate(value)) {
    return 'date';
  }
  
  return undefined;
}

/**
 * Analyze column to infer best type
 * Useful for determining if a column should be treated as a specific type
 */
export function analyzeColumn(values: unknown[]): {
  type: 'string' | 'number' | 'boolean' | 'null' | 'mixed';
  format?: string;
  nullable: boolean;
} {
  const types = new Set<string>();
  const formats = new Set<string>();
  let hasNull = false;
  
  for (const value of values) {
    if (value === null || value === undefined || (typeof value === 'string' && isNull(value))) {
      hasNull = true;
      continue;
    }
    
    if (typeof value === 'string') {
      if (isNumber(value)) {
        types.add('number');
      } else if (isBoolean(value)) {
        types.add('boolean');
      } else {
        types.add('string');
        const format = detectFormat(value);
        if (format) {
          formats.add(format);
        }
      }
    } else if (typeof value === 'number') {
      types.add('number');
    } else if (typeof value === 'boolean') {
      types.add('boolean');
    } else {
      types.add('string');
    }
  }
  
  // Determine predominant type
  let type: 'string' | 'number' | 'boolean' | 'null' | 'mixed' = 'string';
  
  if (types.size === 0) {
    type = 'null';
  } else if (types.size === 1) {
    type = Array.from(types)[0] as 'string' | 'number' | 'boolean';
  } else {
    type = 'mixed';
  }
  
  // Determine predominant format
  const format = formats.size === 1 ? Array.from(formats)[0] : undefined;
  
  return {
    type,
    format,
    nullable: hasNull,
  };
}
