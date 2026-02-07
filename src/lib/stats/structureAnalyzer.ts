/**
 * Structure analysis for JSON Stats tool
 */

import type { StructureMetrics, JsonValue } from './types';
import { isPlainObject, isArray, isPrimitive, getJsonType } from './types';

/**
 * Analyze the structure of JSON data
 */
export function analyzeStructure(data: JsonValue): StructureMetrics {
  const context = {
    maxDepth: 0,
    totalObjects: 0,
    totalArrays: 0,
    totalKeys: 0,
    totalValues: 0,
  };
  
  // Determine root type
  let rootType: 'object' | 'array' | 'primitive';
  if (isPlainObject(data)) {
    rootType = 'object';
  } else if (isArray(data)) {
    rootType = 'array';
  } else {
    rootType = 'primitive';
  }
  
  // Traverse the data
  traverseForStructure(data, 0, context);
  
  // Check homogeneity for arrays
  const isHomogeneous = rootType === 'array' 
    ? checkHomogeneity(data as JsonValue[])
    : false;
  
  return {
    maxDepth: context.maxDepth,
    totalObjects: context.totalObjects,
    totalArrays: context.totalArrays,
    totalKeys: context.totalKeys,
    totalValues: context.totalValues,
    rootType,
    isHomogeneous,
  };
}

/**
 * Traverse JSON and collect structure metrics
 */
function traverseForStructure(
  value: JsonValue,
  depth: number,
  context: {
    maxDepth: number;
    totalObjects: number;
    totalArrays: number;
    totalKeys: number;
    totalValues: number;
  }
): void {
  context.maxDepth = Math.max(context.maxDepth, depth);
  context.totalValues++;
  
  if (isPrimitive(value)) {
    return;
  }
  
  if (isArray(value)) {
    context.totalArrays++;
    for (const item of value) {
      traverseForStructure(item, depth + 1, context);
    }
    return;
  }
  
  if (isPlainObject(value)) {
    context.totalObjects++;
    const keys = Object.keys(value);
    context.totalKeys += keys.length;
    for (const key of keys) {
      traverseForStructure(value[key], depth + 1, context);
    }
  }
}

/**
 * Check if an array contains homogeneous elements
 */
function checkHomogeneity(arr: JsonValue[]): boolean {
  if (arr.length === 0) return true;
  
  const firstType = getJsonType(arr[0]);
  
  for (let i = 1; i < arr.length; i++) {
    if (getJsonType(arr[i]) !== firstType) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get depth at a specific path
 */
export function getDepthAtPath(data: JsonValue, path: string[]): number {
  let current: JsonValue = data;
  
  for (const key of path) {
    if (isPlainObject(current) && key in current) {
      current = current[key];
    } else if (isArray(current)) {
      const index = parseInt(key, 10);
      if (!isNaN(index) && index >= 0 && index < current.length) {
        current = current[index];
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  }
  
  return calculateDepth(current);
}

/**
 * Calculate depth of a value
 */
function calculateDepth(value: JsonValue): number {
  if (isPrimitive(value)) {
    return 0;
  }
  
  if (isArray(value)) {
    if (value.length === 0) return 1;
    const childDepths = value.map(item => calculateDepth(item));
    return 1 + Math.max(...childDepths);
  }
  
  if (isPlainObject(value)) {
    const values = Object.values(value);
    if (values.length === 0) return 1;
    const childDepths = values.map(v => calculateDepth(v));
    return 1 + Math.max(...childDepths);
  }
  
  return 0;
}

/**
 * Count total elements (recursive)
 */
export function countTotalElements(value: JsonValue): number {
  if (isPrimitive(value)) {
    return 1;
  }
  
  if (isArray(value)) {
    let count = 1;
    for (const item of value) {
      count += countTotalElements(item);
    }
    return count;
  }
  
  if (isPlainObject(value)) {
    let count = 1;
    for (const v of Object.values(value)) {
      count += countTotalElements(v);
    }
    return count;
  }
  
  return 1;
}
