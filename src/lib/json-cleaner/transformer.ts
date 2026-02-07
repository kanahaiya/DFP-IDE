/**
 * JSON Cleaner - Key/Value Transformations
 * Transform keys, convert types, flatten/unflatten
 */

import type { KeyCase, TransformSettings } from './types';
import { DEFAULT_TRANSFORM_SETTINGS } from './types';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Convert a string to different cases
 */
export function convertCase(str: string, targetCase: KeyCase): string {
  // First, normalize to words
  const words = str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase -> camel Case
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // XMLParser -> XML Parser
    .replace(/[-_\s]+/g, ' ') // hyphens, underscores, spaces -> spaces
    .toLowerCase()
    .trim()
    .split(/\s+/);
  
  switch (targetCase) {
    case 'camelCase':
      return words
        .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    
    case 'PascalCase':
      return words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    
    case 'snake_case':
      return words.join('_');
    
    case 'kebab-case':
      return words.join('-');
    
    case 'SCREAMING_SNAKE_CASE':
      return words.join('_').toUpperCase();
    
    default:
      return str;
  }
}

/**
 * Transform object keys recursively
 */
function transformKeys(
  value: JsonValue,
  targetCase: KeyCase,
  deep: boolean
): JsonValue {
  if (value === null) return null;
  
  if (Array.isArray(value)) {
    return deep
      ? value.map(item => transformKeys(item as JsonValue, targetCase, deep))
      : value;
  }
  
  if (typeof value === 'object') {
    const transformed: { [key: string]: JsonValue } = {};
    for (const [key, val] of Object.entries(value)) {
      const newKey = convertCase(key, targetCase);
      transformed[newKey] = deep
        ? transformKeys(val as JsonValue, targetCase, deep)
        : val as JsonValue;
    }
    return transformed;
  }
  
  return value;
}

/**
 * Convert string values to numbers where possible
 */
function stringToNumber(value: JsonValue, deep: boolean): JsonValue {
  if (typeof value === 'string') {
    const num = Number(value);
    if (!isNaN(num) && value.trim() !== '') {
      return num;
    }
    return value;
  }
  
  if (Array.isArray(value) && deep) {
    return value.map(item => stringToNumber(item as JsonValue, deep));
  }
  
  if (typeof value === 'object' && value !== null && deep) {
    const transformed: { [key: string]: JsonValue } = {};
    for (const [key, val] of Object.entries(value)) {
      transformed[key] = stringToNumber(val as JsonValue, deep);
    }
    return transformed;
  }
  
  return value;
}

/**
 * Convert string values to booleans where possible
 */
function stringToBoolean(value: JsonValue, deep: boolean): JsonValue {
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
    return value;
  }
  
  if (Array.isArray(value) && deep) {
    return value.map(item => stringToBoolean(item as JsonValue, deep));
  }
  
  if (typeof value === 'object' && value !== null && deep) {
    const transformed: { [key: string]: JsonValue } = {};
    for (const [key, val] of Object.entries(value)) {
      transformed[key] = stringToBoolean(val as JsonValue, deep);
    }
    return transformed;
  }
  
  return value;
}

/**
 * Convert numbers to strings
 */
function numberToString(value: JsonValue, deep: boolean): JsonValue {
  if (typeof value === 'number') {
    return String(value);
  }
  
  if (Array.isArray(value) && deep) {
    return value.map(item => numberToString(item as JsonValue, deep));
  }
  
  if (typeof value === 'object' && value !== null && deep) {
    const transformed: { [key: string]: JsonValue } = {};
    for (const [key, val] of Object.entries(value)) {
      transformed[key] = numberToString(val as JsonValue, deep);
    }
    return transformed;
  }
  
  return value;
}

/**
 * Convert booleans to strings
 */
function booleanToString(value: JsonValue, deep: boolean): JsonValue {
  if (typeof value === 'boolean') {
    return String(value);
  }
  
  if (Array.isArray(value) && deep) {
    return value.map(item => booleanToString(item as JsonValue, deep));
  }
  
  if (typeof value === 'object' && value !== null && deep) {
    const transformed: { [key: string]: JsonValue } = {};
    for (const [key, val] of Object.entries(value)) {
      transformed[key] = booleanToString(val as JsonValue, deep);
    }
    return transformed;
  }
  
  return value;
}

/**
 * Convert null to string "null"
 */
function nullToString(value: JsonValue, deep: boolean): JsonValue {
  if (value === null) {
    return 'null';
  }
  
  if (Array.isArray(value) && deep) {
    return value.map(item => nullToString(item as JsonValue, deep));
  }
  
  if (typeof value === 'object' && value !== null && deep) {
    const transformed: { [key: string]: JsonValue } = {};
    for (const [key, val] of Object.entries(value)) {
      transformed[key] = nullToString(val as JsonValue, deep);
    }
    return transformed;
  }
  
  return value;
}

/**
 * Flatten a nested object
 */
export function flattenObject(
  value: JsonValue,
  separator: string = '.',
  prefix: string = ''
): { [key: string]: JsonValue } {
  const result: { [key: string]: JsonValue } = {};
  
  if (value === null || typeof value !== 'object') {
    if (prefix) {
      result[prefix] = value;
    }
    return result;
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) {
      result[prefix] = [];
    } else {
      for (let i = 0; i < value.length; i++) {
        const newPrefix = prefix ? `${prefix}${separator}${i}` : String(i);
        Object.assign(result, flattenObject(value[i] as JsonValue, separator, newPrefix));
      }
    }
    return result;
  }
  
  const keys = Object.keys(value);
  if (keys.length === 0) {
    result[prefix] = {};
    return result;
  }
  
  for (const key of keys) {
    const newPrefix = prefix ? `${prefix}${separator}${key}` : key;
    Object.assign(result, flattenObject((value as { [key: string]: JsonValue })[key], separator, newPrefix));
  }
  
  return result;
}

/**
 * Unflatten a flattened object
 */
export function unflattenObject(
  value: { [key: string]: JsonValue },
  separator: string = '.'
): JsonValue {
  const result: { [key: string]: JsonValue } = {};
  
  for (const [key, val] of Object.entries(value)) {
    const parts = key.split(separator);
    let current: Record<string, JsonValue> = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];
      const isNextArray = /^\d+$/.test(nextPart);
      
      if (!(part in current)) {
        current[part] = isNextArray ? [] : {};
      }
      current = current[part] as Record<string, JsonValue>;
    }
    
    const lastPart = parts[parts.length - 1];
    (current as Record<string, JsonValue>)[lastPart] = val;
  }
  
  return result;
}

/**
 * Main transform function
 */
export function transformJSON(
  input: string,
  settings: TransformSettings = DEFAULT_TRANSFORM_SETTINGS,
  indentation: number | 'tab' = 2
): { success: boolean; output: string; transformCount: number; error?: string } {
  try {
    let parsed = JSON.parse(input) as JsonValue;
    let transformCount = 0;
    
    // Transform keys
    if (settings.keyCase) {
      parsed = transformKeys(parsed, settings.keyCase, settings.keyTransformDeep);
      transformCount++;
    }
    
    // Type conversions
    if (settings.stringToNumber) {
      parsed = stringToNumber(parsed, true);
      transformCount++;
    }
    
    if (settings.stringToBoolean) {
      parsed = stringToBoolean(parsed, true);
      transformCount++;
    }
    
    if (settings.numberToString) {
      parsed = numberToString(parsed, true);
      transformCount++;
    }
    
    if (settings.booleanToString) {
      parsed = booleanToString(parsed, true);
      transformCount++;
    }
    
    if (settings.nullToString) {
      parsed = nullToString(parsed, true);
      transformCount++;
    }
    
    // Flatten
    if (settings.flatten && typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      parsed = flattenObject(parsed, settings.flattenSeparator);
      transformCount++;
    }
    
    // Unflatten
    if (settings.unflatten && typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      parsed = unflattenObject(parsed as { [key: string]: JsonValue }, settings.flattenSeparator);
      transformCount++;
    }
    
    const indent = indentation === 'tab' ? '\t' : indentation;
    const output = JSON.stringify(parsed, null, indent);
    
    return { success: true, output, transformCount };
  } catch (error) {
    return {
      success: false,
      output: input,
      transformCount: 0,
      error: error instanceof Error ? error.message : 'Transform failed',
    };
  }
}
