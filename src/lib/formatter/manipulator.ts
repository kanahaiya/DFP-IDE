/**
 * JSON Manipulator - Data manipulation operations
 */

import type {
  ManipulationOptions,
  FilterCriteria,
  JsonValue,
  JsonObject,
  JsonArray,
  SortOrder,
} from './types';
import { isPlainObject, isArray } from './types';

// ============================================================================
// Default Options
// ============================================================================

export const DEFAULT_MANIPULATION_OPTIONS: ManipulationOptions = {
  sortKeys: false,
  sortOrder: 'asc',
  removeNulls: false,
  removeEmptyStrings: false,
  removeEmptyArrays: false,
  removeEmptyObjects: false,
  removeDuplicates: false,
  convertStringNumbers: false,
  trimStrings: false,
};

// ============================================================================
// Sort Operations
// ============================================================================

/**
 * Sort object keys
 */
export function sortObjectKeys(obj: JsonObject, order: SortOrder = 'asc'): JsonObject {
  const keys = Object.keys(obj).sort((a, b) => {
    const comparison = a.localeCompare(b);
    return order === 'asc' ? comparison : -comparison;
  });
  
  const result: JsonObject = {};
  for (const key of keys) {
    const value = obj[key];
    if (isPlainObject(value)) {
      result[key] = sortObjectKeys(value, order);
    } else if (isArray(value)) {
      result[key] = value.map(item => 
        isPlainObject(item) ? sortObjectKeys(item, order) : item
      );
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Sort array values
 */
export function sortArrayValues(arr: JsonArray, order: SortOrder = 'asc'): JsonArray {
  return [...arr].sort((a, b) => {
    const aStr = JSON.stringify(a);
    const bStr = JSON.stringify(b);
    const comparison = aStr.localeCompare(bStr);
    return order === 'asc' ? comparison : -comparison;
  });
}

// ============================================================================
// Remove Operations
// ============================================================================

/**
 * Remove null values recursively
 */
export function removeNulls(data: JsonValue): JsonValue {
  if (data === null) return undefined as unknown as JsonValue;
  
  if (isArray(data)) {
    return data
      .filter(item => item !== null)
      .map(item => removeNulls(item))
      .filter(item => item !== undefined);
  }
  
  if (isPlainObject(data)) {
    const result: JsonObject = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== null) {
        const cleaned = removeNulls(value);
        if (cleaned !== undefined) {
          result[key] = cleaned;
        }
      }
    }
    return result;
  }
  
  return data;
}

/**
 * Remove empty strings recursively
 */
export function removeEmptyStrings(data: JsonValue): JsonValue {
  if (data === '') return undefined as unknown as JsonValue;
  
  if (isArray(data)) {
    return data
      .filter(item => item !== '')
      .map(item => removeEmptyStrings(item))
      .filter(item => item !== undefined);
  }
  
  if (isPlainObject(data)) {
    const result: JsonObject = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== '') {
        const cleaned = removeEmptyStrings(value);
        if (cleaned !== undefined) {
          result[key] = cleaned;
        }
      }
    }
    return result;
  }
  
  return data;
}

/**
 * Remove empty arrays recursively
 */
export function removeEmptyArrays(data: JsonValue): JsonValue {
  if (isArray(data)) {
    if (data.length === 0) return undefined as unknown as JsonValue;
    return data
      .map(item => removeEmptyArrays(item))
      .filter(item => item !== undefined);
  }
  
  if (isPlainObject(data)) {
    const result: JsonObject = {};
    for (const [key, value] of Object.entries(data)) {
      if (!(isArray(value) && value.length === 0)) {
        const cleaned = removeEmptyArrays(value);
        if (cleaned !== undefined) {
          result[key] = cleaned;
        }
      }
    }
    return result;
  }
  
  return data;
}

/**
 * Remove empty objects recursively
 */
export function removeEmptyObjects(data: JsonValue): JsonValue {
  if (isPlainObject(data)) {
    const keys = Object.keys(data);
    if (keys.length === 0) return undefined as unknown as JsonValue;
    
    const result: JsonObject = {};
    for (const key of keys) {
      const cleaned = removeEmptyObjects(data[key]);
      if (cleaned !== undefined) {
        result[key] = cleaned;
      }
    }
    
    // Check if result is now empty
    if (Object.keys(result).length === 0) {
      return undefined as unknown as JsonValue;
    }
    
    return result;
  }
  
  if (isArray(data)) {
    return data
      .map(item => removeEmptyObjects(item))
      .filter(item => item !== undefined);
  }
  
  return data;
}

/**
 * Remove duplicate values from arrays
 */
export function removeDuplicates(data: JsonValue): JsonValue {
  if (isArray(data)) {
    const seen = new Set<string>();
    const unique: JsonArray = [];
    
    for (const item of data) {
      const key = JSON.stringify(item);
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(removeDuplicates(item));
      }
    }
    
    return unique;
  }
  
  if (isPlainObject(data)) {
    const result: JsonObject = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = removeDuplicates(value);
    }
    return result;
  }
  
  return data;
}

// ============================================================================
// Transform Operations
// ============================================================================

/**
 * Convert string numbers to actual numbers
 */
export function convertStringNumbers(data: JsonValue): JsonValue {
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (trimmed !== '' && !isNaN(Number(trimmed))) {
      const num = Number(trimmed);
      // Preserve integer vs float
      if (Number.isInteger(num) && !trimmed.includes('.')) {
        return num;
      }
      return num;
    }
    return data;
  }
  
  if (isArray(data)) {
    return data.map(item => convertStringNumbers(item));
  }
  
  if (isPlainObject(data)) {
    const result: JsonObject = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = convertStringNumbers(value);
    }
    return result;
  }
  
  return data;
}

/**
 * Trim all string values
 */
export function trimStrings(data: JsonValue): JsonValue {
  if (typeof data === 'string') {
    return data.trim();
  }
  
  if (isArray(data)) {
    return data.map(item => trimStrings(item));
  }
  
  if (isPlainObject(data)) {
    const result: JsonObject = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = trimStrings(value);
    }
    return result;
  }
  
  return data;
}

// ============================================================================
// Filter Operations
// ============================================================================

/**
 * Filter data based on criteria
 */
export function filterData(data: JsonValue, criteria: FilterCriteria): JsonValue {
  const { keyPattern, valuePattern, caseSensitive, useRegex } = criteria;
  
  function matchPattern(str: string, pattern: string): boolean {
    if (!pattern) return true;
    
    if (useRegex) {
      try {
        const flags = caseSensitive ? '' : 'i';
        const regex = new RegExp(pattern, flags);
        return regex.test(str);
      } catch {
        return false;
      }
    }
    
    const compareStr = caseSensitive ? str : str.toLowerCase();
    const comparePattern = caseSensitive ? pattern : pattern.toLowerCase();
    return compareStr.includes(comparePattern);
  }
  
  function filterValue(value: JsonValue, key: string): JsonValue | undefined {
    // Check key pattern
    if (keyPattern && !matchPattern(key, keyPattern)) {
      return undefined;
    }
    
    // Check value pattern for primitives
    if (valuePattern && typeof value !== 'object') {
      if (!matchPattern(String(value), valuePattern)) {
        return undefined;
      }
    }
    
    if (isPlainObject(value)) {
      const result: JsonObject = {};
      for (const [k, v] of Object.entries(value)) {
        const filtered = filterValue(v, k);
        if (filtered !== undefined) {
          result[k] = filtered;
        }
      }
      return Object.keys(result).length > 0 ? result : undefined;
    }
    
    if (isArray(value)) {
      const filtered = value
        .map((item, index) => filterValue(item, String(index)))
        .filter(item => item !== undefined) as JsonArray;
      return filtered.length > 0 ? filtered : undefined;
    }
    
    return value;
  }
  
  const result = filterValue(data, 'root');
  return result ?? data;
}

// ============================================================================
// Combined Manipulation
// ============================================================================

/**
 * Apply all manipulation options
 */
export function manipulateJSON(
  input: string,
  options: Partial<ManipulationOptions> = {}
): { output: string; success: boolean; error?: string } {
  const mergedOptions = { ...DEFAULT_MANIPULATION_OPTIONS, ...options };
  
  try {
    let data: JsonValue = JSON.parse(input);
    
    // Apply sorting
    if (mergedOptions.sortKeys && isPlainObject(data)) {
      data = sortObjectKeys(data, mergedOptions.sortOrder);
    }
    
    // Apply removals
    if (mergedOptions.removeNulls) {
      data = removeNulls(data);
    }
    if (mergedOptions.removeEmptyStrings) {
      data = removeEmptyStrings(data);
    }
    if (mergedOptions.removeEmptyArrays) {
      data = removeEmptyArrays(data);
    }
    if (mergedOptions.removeEmptyObjects) {
      data = removeEmptyObjects(data);
    }
    if (mergedOptions.removeDuplicates) {
      data = removeDuplicates(data);
    }
    
    // Apply transformations
    if (mergedOptions.trimStrings) {
      data = trimStrings(data);
    }
    if (mergedOptions.convertStringNumbers) {
      data = convertStringNumbers(data);
    }
    
    // Apply filter
    if (mergedOptions.filter) {
      data = filterData(data, mergedOptions.filter);
    }
    
    return {
      output: JSON.stringify(data, null, 2),
      success: true,
    };
  } catch (error) {
    return {
      output: input,
      success: false,
      error: (error as Error).message,
    };
  }
}

// ============================================================================
// Escape/Unescape Operations
// ============================================================================

/**
 * Escape special characters in JSON string values
 */
export function escapeJSONStrings(data: JsonValue): JsonValue {
  if (typeof data === 'string') {
    return data
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }
  
  if (isArray(data)) {
    return data.map(item => escapeJSONStrings(item));
  }
  
  if (isPlainObject(data)) {
    const result: JsonObject = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = escapeJSONStrings(value);
    }
    return result;
  }
  
  return data;
}

/**
 * Unescape special characters in JSON string values
 */
export function unescapeJSONStrings(data: JsonValue): JsonValue {
  if (typeof data === 'string') {
    return data
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
  
  if (isArray(data)) {
    return data.map(item => unescapeJSONStrings(item));
  }
  
  if (isPlainObject(data)) {
    const result: JsonObject = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = unescapeJSONStrings(value);
    }
    return result;
  }
  
  return data;
}
