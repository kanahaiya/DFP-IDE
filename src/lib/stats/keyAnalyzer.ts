/**
 * Key analysis for JSON Stats tool
 */

import type { KeyAnalysis, KeyFrequency, JsonValue } from './types';
import { isPlainObject, isArray, isPrimitive } from './types';

/**
 * Analyze keys in JSON data
 */
export function analyzeKeys(data: JsonValue): KeyAnalysis {
  const keyMap: Map<string, { count: number; paths: string[] }> = new Map();
  const allKeyLengths: number[] = [];
  
  // Collect all keys
  collectKeys(data, '', keyMap, allKeyLengths);
  
  // Calculate unique keys
  const uniqueKeys = keyMap.size;
  const totalKeyInstances = Array.from(keyMap.values())
    .reduce((sum, info) => sum + info.count, 0);
  
  // Find duplicate keys (appear more than once)
  const duplicateKeys: KeyFrequency[] = Array.from(keyMap.entries())
    .filter(([, info]) => info.count > 1)
    .map(([key, info]) => ({
      key,
      count: info.count,
      paths: info.paths.slice(0, 5), // Limit to first 5 paths
    }))
    .sort((a, b) => b.count - a.count);
  
  // Find longest and shortest keys
  const keys = Array.from(keyMap.keys());
  const longestKey = keys.reduce((a, b) => (a.length > b.length ? a : b), '');
  const shortestKey = keys.reduce((a, b) => (a.length < b.length ? a : b), keys[0] || '');
  
  // Calculate average key length
  const averageKeyLength = allKeyLengths.length > 0
    ? Math.round((allKeyLengths.reduce((a, b) => a + b, 0) / allKeyLengths.length) * 10) / 10
    : 0;
  
  // Get top keys
  const topKeys: KeyFrequency[] = Array.from(keyMap.entries())
    .map(([key, info]) => ({
      key,
      count: info.count,
      paths: info.paths.slice(0, 3),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Find case variations
  const caseVariations = findCaseVariations(keys);
  
  return {
    uniqueKeys,
    totalKeyInstances,
    duplicateKeys,
    longestKey,
    shortestKey,
    averageKeyLength,
    topKeys,
    caseVariations,
  };
}

/**
 * Recursively collect all keys
 */
function collectKeys(
  value: JsonValue,
  path: string,
  keyMap: Map<string, { count: number; paths: string[] }>,
  allKeyLengths: number[]
): void {
  if (isPrimitive(value)) return;
  
  if (isArray(value)) {
    value.forEach((item, index) => {
      collectKeys(item, `${path}[${index}]`, keyMap, allKeyLengths);
    });
    return;
  }
  
  if (isPlainObject(value)) {
    for (const [key, val] of Object.entries(value)) {
      const currentPath = path ? `${path}.${key}` : key;
      allKeyLengths.push(key.length);
      
      if (!keyMap.has(key)) {
        keyMap.set(key, { count: 0, paths: [] });
      }
      
      const info = keyMap.get(key)!;
      info.count++;
      if (info.paths.length < 10) {
        info.paths.push(currentPath);
      }
      
      collectKeys(val, currentPath, keyMap, allKeyLengths);
    }
  }
}

/**
 * Find keys that are the same but with different cases
 */
function findCaseVariations(keys: string[]): { key: string; variations: string[] }[] {
  const lowercaseMap: Map<string, string[]> = new Map();
  
  for (const key of keys) {
    const lowercase = key.toLowerCase();
    if (!lowercaseMap.has(lowercase)) {
      lowercaseMap.set(lowercase, []);
    }
    lowercaseMap.get(lowercase)!.push(key);
  }
  
  return Array.from(lowercaseMap.entries())
    .filter(([, variations]) => variations.length > 1)
    .map(([key, variations]) => ({
      key,
      variations: [...new Set(variations)],
    }));
}

/**
 * Get key at a specific path
 */
export function getKeyAtPath(data: JsonValue, path: string[]): string | null {
  if (path.length === 0) return null;
  return path[path.length - 1];
}

/**
 * Search for keys matching a pattern
 */
export function searchKeys(
  data: JsonValue,
  pattern: string | RegExp
): KeyFrequency[] {
  const regex = typeof pattern === 'string'
    ? new RegExp(pattern, 'i')
    : pattern;
  
  const keyMap: Map<string, { count: number; paths: string[] }> = new Map();
  const allKeyLengths: number[] = [];
  
  collectKeys(data, '', keyMap, allKeyLengths);
  
  return Array.from(keyMap.entries())
    .filter(([key]) => regex.test(key))
    .map(([key, info]) => ({
      key,
      count: info.count,
      paths: info.paths,
    }));
}

/**
 * Get nested key paths (keys that contain dots or are deeply nested)
 */
export function getDeepKeys(analysis: KeyAnalysis, minDepth: number = 3): string[] {
  return analysis.topKeys
    .flatMap(k => k.paths)
    .filter(path => (path.match(/\./g) || []).length >= minDepth - 1)
    .slice(0, 20);
}
