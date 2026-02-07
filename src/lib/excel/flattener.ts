/**
 * JSON Flattener - Flatten nested objects for tabular format
 */

import type { JsonValue, JsonObject, JsonArray } from './types';
import { isPlainObject, isArray, isPrimitive } from './types';

// ============================================================================
// Flattening Options
// ============================================================================

export interface FlattenOptions {
  delimiter: string;
  maxDepth: number;
  arrayHandling: 'index' | 'stringify' | 'first';
  preserveEmptyArrays: boolean;
  preserveEmptyObjects: boolean;
}

export const DEFAULT_FLATTEN_OPTIONS: FlattenOptions = {
  delimiter: '.',
  maxDepth: 5,
  arrayHandling: 'stringify',
  preserveEmptyArrays: false,
  preserveEmptyObjects: false,
};

// ============================================================================
// Core Flattening
// ============================================================================

/**
 * Flatten a nested object to a single-level object
 */
export function flattenObject(
  obj: JsonObject,
  options: Partial<FlattenOptions> = {}
): Record<string, unknown> {
  const opts = { ...DEFAULT_FLATTEN_OPTIONS, ...options };
  const result: Record<string, unknown> = {};
  
  function recurse(current: JsonValue, path: string, depth: number): void {
    // Check max depth
    if (depth > opts.maxDepth) {
      result[path] = JSON.stringify(current);
      return;
    }
    
    // Handle null
    if (current === null) {
      result[path] = null;
      return;
    }
    
    // Handle primitives
    if (isPrimitive(current)) {
      result[path] = current;
      return;
    }
    
    // Handle arrays
    if (isArray(current)) {
      if (current.length === 0) {
        if (opts.preserveEmptyArrays) {
          result[path] = [];
        }
        return;
      }
      
      switch (opts.arrayHandling) {
        case 'index':
          // Create separate keys for each array element
          current.forEach((item, index) => {
            const newPath = path ? `${path}${opts.delimiter}${index}` : String(index);
            recurse(item, newPath, depth + 1);
          });
          break;
          
        case 'first':
          // Only take the first element
          recurse(current[0], path, depth);
          break;
          
        case 'stringify':
        default:
          // Convert array to JSON string
          result[path] = JSON.stringify(current);
          break;
      }
      return;
    }
    
    // Handle objects
    if (isPlainObject(current)) {
      const keys = Object.keys(current);
      
      if (keys.length === 0) {
        if (opts.preserveEmptyObjects) {
          result[path] = {};
        }
        return;
      }
      
      for (const key of keys) {
        const newPath = path ? `${path}${opts.delimiter}${key}` : key;
        recurse(current[key], newPath, depth + 1);
      }
    }
  }
  
  recurse(obj, '', 0);
  return result;
}

/**
 * Flatten an array of objects
 */
export function flattenArrayOfObjects(
  arr: JsonArray,
  options: Partial<FlattenOptions> = {}
): Record<string, unknown>[] {
  return arr.map(item => {
    if (isPlainObject(item)) {
      return flattenObject(item, options);
    }
    // Wrap primitives in an object
    return { value: item };
  });
}

// ============================================================================
// Key Collection
// ============================================================================

/**
 * Get all unique keys from an array of flattened objects
 */
export function getAllKeys(objects: Record<string, unknown>[]): string[] {
  const keySet = new Set<string>();
  
  for (const obj of objects) {
    for (const key of Object.keys(obj)) {
      keySet.add(key);
    }
  }
  
  return Array.from(keySet).sort();
}

/**
 * Get key statistics
 */
export interface KeyStats {
  key: string;
  occurrences: number;
  types: Set<string>;
  hasNull: boolean;
  sampleValues: unknown[];
}

export function analyzeKeys(objects: Record<string, unknown>[]): KeyStats[] {
  const stats = new Map<string, KeyStats>();
  
  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      if (!stats.has(key)) {
        stats.set(key, {
          key,
          occurrences: 0,
          types: new Set(),
          hasNull: false,
          sampleValues: [],
        });
      }
      
      const keyStats = stats.get(key)!;
      keyStats.occurrences++;
      
      if (value === null) {
        keyStats.hasNull = true;
      } else {
        keyStats.types.add(typeof value);
      }
      
      if (keyStats.sampleValues.length < 3 && value !== null) {
        keyStats.sampleValues.push(value);
      }
    }
  }
  
  return Array.from(stats.values());
}

// ============================================================================
// Depth Analysis
// ============================================================================

/**
 * Get maximum nesting depth of an object
 */
export function getMaxDepth(value: JsonValue, currentDepth: number = 0): number {
  if (isPrimitive(value)) {
    return currentDepth;
  }
  
  if (isArray(value)) {
    let max = currentDepth;
    for (const item of value) {
      max = Math.max(max, getMaxDepth(item, currentDepth + 1));
    }
    return max;
  }
  
  if (isPlainObject(value)) {
    let max = currentDepth;
    for (const val of Object.values(value)) {
      max = Math.max(max, getMaxDepth(val, currentDepth + 1));
    }
    return max;
  }
  
  return currentDepth;
}

/**
 * Count total nested objects
 */
export function countNestedObjects(value: JsonValue): number {
  let count = 0;
  
  function traverse(val: JsonValue): void {
    if (isPlainObject(val)) {
      count++;
      for (const v of Object.values(val)) {
        traverse(v);
      }
    } else if (isArray(val)) {
      for (const item of val) {
        traverse(item);
      }
    }
  }
  
  traverse(value);
  return count;
}

// ============================================================================
// Unflatten (Reverse Operation)
// ============================================================================

/**
 * Unflatten a flat object back to nested structure
 */
export function unflattenObject(
  obj: Record<string, unknown>,
  delimiter: string = '.'
): JsonObject {
  const result: JsonObject = {};
  
  for (const [flatKey, value] of Object.entries(obj)) {
    const parts = flatKey.split(delimiter);
    let current: JsonObject = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        // Determine if next part is numeric (array) or string (object)
        const nextPart = parts[i + 1];
        current[part] = /^\d+$/.test(nextPart) ? [] : {};
      }
      current = current[part] as JsonObject;
    }
    
    const lastPart = parts[parts.length - 1];
    current[lastPart] = value as JsonValue;
  }
  
  return result;
}
