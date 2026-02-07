/**
 * JSON Cleaner - Core Cleaning Operations
 * Remove nulls, empty values, duplicates, and more
 */

import type {
  CleaningSettings,
  CleaningResult,
  CleaningOperationResult,
  CleaningStats,
} from './types';
import { DEFAULT_CLEANING_SETTINGS } from './types';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Check if a string is whitespace only
 */
function isWhitespaceOnly(value: string): boolean {
  return /^\s*$/.test(value);
}

/**
 * Recursively clean an object/array
 */
function cleanValue(
  value: JsonValue,
  settings: CleaningSettings,
  stats: { removed: number }
): JsonValue | undefined {
  // Handle null
  if (value === null) {
    if (settings.removeNull) {
      stats.removed++;
      return undefined;
    }
    return null;
  }
  
  // Handle undefined (shouldn't appear in JSON, but just in case)
  if (value === undefined) {
    if (settings.removeUndefined) {
      stats.removed++;
      return undefined;
    }
    return undefined;
  }
  
  // Handle strings
  if (typeof value === 'string') {
    let str = value;
    
    // Trim strings
    if (settings.trimStrings) {
      str = str.trim();
    }
    
    // Remove whitespace-only strings
    if (settings.removeWhitespaceOnly && isWhitespaceOnly(str)) {
      stats.removed++;
      return undefined;
    }
    
    // Remove empty strings
    if (settings.removeEmptyStrings && str === '') {
      stats.removed++;
      return undefined;
    }
    
    return str;
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    // Clean each element
    let cleanedArray = value
      .map(item => cleanValue(item as JsonValue, settings, stats))
      .filter(item => item !== undefined) as JsonValue[];
    
    // Deduplicate arrays
    if (settings.deduplicateArrays) {
      const seen = new Set<string>();
      cleanedArray = cleanedArray.filter(item => {
        const key = JSON.stringify(item);
        if (seen.has(key)) {
          stats.removed++;
          return false;
        }
        seen.add(key);
        return true;
      });
    }
    
    // Remove empty arrays
    if (settings.removeEmptyArrays && cleanedArray.length === 0) {
      stats.removed++;
      return undefined;
    }
    
    return cleanedArray;
  }
  
  // Handle objects
  if (typeof value === 'object') {
    const cleaned: { [key: string]: JsonValue } = {};
    let keys = Object.keys(value as { [key: string]: JsonValue });
    
    // Sort keys
    if (settings.sortKeys) {
      keys = keys.sort();
    }
    
    for (const key of keys) {
      const cleanedValue = cleanValue((value as { [key: string]: JsonValue })[key], settings, stats);
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    
    // Remove empty objects
    if (settings.removeEmptyObjects && Object.keys(cleaned).length === 0) {
      stats.removed++;
      return undefined;
    }
    
    return cleaned;
  }
  
  // Handle primitives (number, boolean)
  return value;
}

/**
 * Count keys in an object recursively
 */
function countKeys(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value !== 'object') return 0;
  
  if (Array.isArray(value)) {
    return value.reduce((sum, item) => sum + countKeys(item), 0);
  }
  
  let count = Object.keys(value).length;
  for (const key of Object.keys(value)) {
    count += countKeys((value as Record<string, unknown>)[key]);
  }
  return count;
}

/**
 * Main cleaning function
 */
export function cleanJSON(
  input: string,
  settings: CleaningSettings = DEFAULT_CLEANING_SETTINGS
): CleaningResult {
  const startTime = performance.now();
  const operations: CleaningOperationResult[] = [];
  
  try {
    // Parse input
    const parsed = JSON.parse(input) as JsonValue;
    
    // Track statistics
    const stats = { removed: 0 };
    const inputKeyCount = countKeys(parsed);
    
    // Clean the JSON
    let cleaned = cleanValue(parsed, settings, stats);
    
    // Handle case where root is removed
    if (cleaned === undefined) {
      cleaned = null;
    }
    
    // Format output
    const indent = settings.minify ? undefined : 
      (settings.indentation === 'tab' ? '\t' : settings.indentation);
    const output = JSON.stringify(cleaned, null, indent);
    
    // Build operations list
    if (settings.removeNull) operations.push({ operation: 'remove_null', affected: 0, description: 'Removed null values' });
    if (settings.removeEmptyStrings) operations.push({ operation: 'remove_empty_string', affected: 0, description: 'Removed empty strings' });
    if (settings.removeEmptyArrays) operations.push({ operation: 'remove_empty_array', affected: 0, description: 'Removed empty arrays' });
    if (settings.removeEmptyObjects) operations.push({ operation: 'remove_empty_object', affected: 0, description: 'Removed empty objects' });
    if (settings.trimStrings) operations.push({ operation: 'trim_strings', affected: 0, description: 'Trimmed string whitespace' });
    if (settings.deduplicateArrays) operations.push({ operation: 'dedupe_arrays', affected: 0, description: 'Removed duplicate array items' });
    if (settings.sortKeys) operations.push({ operation: 'sort_keys', affected: 0, description: 'Sorted object keys' });
    
    // Calculate statistics
    const outputKeyCount = countKeys(cleaned);
    const cleaningStats: CleaningStats = {
      inputSize: input.length,
      outputSize: output.length,
      sizeDifference: input.length - output.length,
      sizeReduction: input.length > 0 ? ((input.length - output.length) / input.length) * 100 : 0,
      removedItems: stats.removed,
      transformedItems: 0,
      inputKeyCount,
      outputKeyCount,
    };
    
    return {
      success: true,
      input,
      output,
      operations,
      stats: cleaningStats,
      processingTime: performance.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      input,
      output: input,
      operations: [],
      stats: {
        inputSize: input.length,
        outputSize: input.length,
        sizeDifference: 0,
        sizeReduction: 0,
        removedItems: 0,
        transformedItems: 0,
        inputKeyCount: 0,
        outputKeyCount: 0,
      },
      processingTime: performance.now() - startTime,
      error: error instanceof Error ? error.message : 'Failed to clean JSON',
    };
  }
}

/**
 * Preview cleaning operations without applying
 */
export function previewCleaning(
  input: string,
  settings: CleaningSettings
): { estimatedRemovals: number; operations: string[] } {
  const operations: string[] = [];
  
  if (settings.removeNull) operations.push('Remove null values');
  if (settings.removeEmptyStrings) operations.push('Remove empty strings');
  if (settings.removeEmptyArrays) operations.push('Remove empty arrays');
  if (settings.removeEmptyObjects) operations.push('Remove empty objects');
  if (settings.removeUndefined) operations.push('Remove undefined values');
  if (settings.trimStrings) operations.push('Trim string whitespace');
  if (settings.removeWhitespaceOnly) operations.push('Remove whitespace-only strings');
  if (settings.deduplicateArrays) operations.push('Deduplicate arrays');
  if (settings.sortKeys) operations.push('Sort object keys');
  
  // Estimate removals (rough count)
  let estimatedRemovals = 0;
  if (settings.removeNull) estimatedRemovals += (input.match(/:\s*null\b/g) || []).length;
  if (settings.removeEmptyStrings) estimatedRemovals += (input.match(/:\s*""/g) || []).length;
  if (settings.removeEmptyArrays) estimatedRemovals += (input.match(/:\s*\[\s*\]/g) || []).length;
  if (settings.removeEmptyObjects) estimatedRemovals += (input.match(/:\s*\{\s*\}/g) || []).length;
  
  return { estimatedRemovals, operations };
}
