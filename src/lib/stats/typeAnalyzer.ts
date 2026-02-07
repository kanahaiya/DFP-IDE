/**
 * Type distribution analysis for JSON Stats tool
 */

import type { TypeDistribution, TypeCount, JsonDataType, JsonValue } from './types';
import { isPlainObject, isArray, isPrimitive, getJsonType, TYPE_COLORS } from './types';

/**
 * Analyze type distribution in JSON data
 */
export function analyzeTypes(data: JsonValue): TypeDistribution {
  const counts: Record<JsonDataType, number> = {
    string: 0,
    number: 0,
    boolean: 0,
    null: 0,
    object: 0,
    array: 0,
  };
  
  // Count all types
  countTypes(data, counts);
  
  // Calculate total
  const totalValues = Object.values(counts).reduce((sum, count) => sum + count, 0);
  
  // Create type count objects with percentages
  const typeCountArray: TypeCount[] = (Object.entries(counts) as [JsonDataType, number][])
    .filter(([, count]) => count > 0)
    .map(([type, count]) => ({
      type,
      count,
      percentage: totalValues > 0 ? Math.round((count / totalValues) * 1000) / 10 : 0,
      color: TYPE_COLORS[type],
    }))
    .sort((a, b) => b.count - a.count);
  
  // Find most and least common
  const sortedTypes = [...typeCountArray].sort((a, b) => b.count - a.count);
  const mostCommon = sortedTypes[0]?.type || 'object';
  const leastCommon = sortedTypes[sortedTypes.length - 1]?.type || 'object';
  
  return {
    counts: typeCountArray,
    totalValues,
    mostCommon,
    leastCommon,
  };
}

/**
 * Recursively count types in JSON data
 */
function countTypes(value: JsonValue, counts: Record<JsonDataType, number>): void {
  const type = getJsonType(value);
  counts[type]++;
  
  if (isArray(value)) {
    for (const item of value) {
      countTypes(item, counts);
    }
  } else if (isPlainObject(value)) {
    for (const val of Object.values(value)) {
      countTypes(val, counts);
    }
  }
}

/**
 * Get type distribution for a specific key across all objects
 */
export function getTypesForKey(data: JsonValue, targetKey: string): JsonDataType[] {
  const types = new Set<JsonDataType>();
  
  function traverse(value: JsonValue): void {
    if (isPrimitive(value)) return;
    
    if (isArray(value)) {
      for (const item of value) {
        traverse(item);
      }
    } else if (isPlainObject(value)) {
      if (targetKey in value) {
        types.add(getJsonType(value[targetKey]));
      }
      for (const val of Object.values(value)) {
        traverse(val);
      }
    }
  }
  
  traverse(data);
  return Array.from(types);
}

/**
 * Find keys with inconsistent types
 */
export function findInconsistentTypes(
  data: JsonValue
): { key: string; types: JsonDataType[] }[] {
  const keyTypes: Map<string, Set<JsonDataType>> = new Map();
  
  function traverse(value: JsonValue): void {
    if (isPrimitive(value)) return;
    
    if (isArray(value)) {
      for (const item of value) {
        traverse(item);
      }
    } else if (isPlainObject(value)) {
      for (const [key, val] of Object.entries(value)) {
        const type = getJsonType(val);
        if (!keyTypes.has(key)) {
          keyTypes.set(key, new Set());
        }
        keyTypes.get(key)!.add(type);
        traverse(val);
      }
    }
  }
  
  traverse(data);
  
  // Find keys with multiple types
  const inconsistent: { key: string; types: JsonDataType[] }[] = [];
  
  for (const [key, types] of keyTypes) {
    if (types.size > 1) {
      inconsistent.push({
        key,
        types: Array.from(types),
      });
    }
  }
  
  return inconsistent;
}

/**
 * Get primitive type ratio (primitives vs containers)
 */
export function getPrimitiveRatio(distribution: TypeDistribution): number {
  const primitiveCount = distribution.counts
    .filter(c => ['string', 'number', 'boolean', 'null'].includes(c.type))
    .reduce((sum, c) => sum + c.count, 0);
  
  return distribution.totalValues > 0
    ? Math.round((primitiveCount / distribution.totalValues) * 100)
    : 0;
}
