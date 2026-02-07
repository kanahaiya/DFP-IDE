/**
 * Core merge logic for JSON Merge tool
 */

import type {
  MergeSettings,
  MergeResult,
  MergeConflict,
  MergeStats,
  MergeInput,
  JsonValue,
  JsonObject,
  JsonArray,
  ValidationError,
} from './types';
import {
  DEFAULT_MERGE_SETTINGS,
  isPlainObject,
  isArray,
  isPrimitive,
} from './types';
import { validateJSON } from './validator';
import { formatOutput } from './exporter';

// ============================================================================
// Main Merge Function
// ============================================================================

/**
 * Merge multiple JSON inputs according to settings
 */
export function mergeJSON(
  inputs: MergeInput[],
  settings: MergeSettings = DEFAULT_MERGE_SETTINGS
): MergeResult {
  const startTime = performance.now();
  const conflicts: MergeConflict[] = [];
  const errors: ValidationError[] = [];
  
  // Validate all inputs first
  const parsedInputs: { input: MergeInput; data: JsonValue }[] = [];
  
  for (const input of inputs) {
    if (!input.content || input.content.trim() === '') {
      continue; // Skip empty inputs
    }
    
    const validation = validateJSON(input.content, input.id);
    if (!validation.isValid) {
      errors.push(...validation.errors);
      continue;
    }
    
    parsedInputs.push({
      input,
      data: validation.parsed as JsonValue,
    });
  }
  
  // If no valid inputs, return error
  if (parsedInputs.length === 0) {
    return {
      success: false,
      output: null,
      outputString: '',
      conflicts: [],
      stats: createEmptyStats(0, performance.now() - startTime),
      errors: errors.length > 0 ? errors : [{
        inputId: 'all',
        line: 1,
        column: 1,
        message: 'No valid JSON inputs to merge',
        severity: 'error',
      }],
    };
  }
  
  // If only one valid input, return it directly
  if (parsedInputs.length === 1) {
    const output = parsedInputs[0].data;
    return {
      success: true,
      output,
      outputString: formatOutput(output, settings),
      conflicts: [],
      stats: createStats(parsedInputs, output, 0, performance.now() - startTime),
      errors,
    };
  }
  
  // Perform merge based on strategy
  let merged: JsonValue;
  
  try {
    merged = performMerge(parsedInputs, settings, conflicts);
  } catch (error) {
    return {
      success: false,
      output: null,
      outputString: '',
      conflicts,
      stats: createEmptyStats(parsedInputs.length, performance.now() - startTime),
      errors: [{
        inputId: 'merge',
        line: 1,
        column: 1,
        message: error instanceof Error ? error.message : 'Merge failed',
        severity: 'error',
      }],
    };
  }
  
  const processingTime = performance.now() - startTime;
  
  return {
    success: true,
    output: merged,
    outputString: formatOutput(merged, settings),
    conflicts,
    stats: createStats(parsedInputs, merged, conflicts.length, processingTime),
    errors,
  };
}

// ============================================================================
// Strategy Dispatcher
// ============================================================================

/**
 * Perform merge based on selected strategy
 */
function performMerge(
  parsedInputs: { input: MergeInput; data: JsonValue }[],
  settings: MergeSettings,
  conflicts: MergeConflict[]
): JsonValue {
  const dataArray = parsedInputs.map(p => p.data);
  
  switch (settings.strategy) {
    case 'simple':
      return simpleMerge(dataArray, settings, conflicts, parsedInputs);
      
    case 'deep':
      return deepMerge(dataArray, settings, conflicts, parsedInputs);
      
    case 'arrayConcatenation':
      return arrayConcatenation(dataArray, settings);
      
    case 'arrayUnion':
      return arrayUnion(dataArray, settings);
      
    case 'nestedArrayMerge':
      return nestedArrayMerge(dataArray, settings, conflicts, parsedInputs);
      
    case 'custom':
      // Custom uses deep merge as base with additional rules
      return deepMerge(dataArray, settings, conflicts, parsedInputs);
      
    default:
      return simpleMerge(dataArray, settings, conflicts, parsedInputs);
  }
}

// ============================================================================
// Merge Strategies
// ============================================================================

/**
 * Simple merge: later values override earlier ones (shallow)
 */
function simpleMerge(
  dataArray: JsonValue[],
  settings: MergeSettings,
  conflicts: MergeConflict[],
  inputs: { input: MergeInput; data: JsonValue }[],
  path: string = ''
): JsonValue {
  // If any item is not an object, return the last one
  if (!dataArray.every(isPlainObject)) {
    // Handle arrays according to array ordering setting
    if (dataArray.some(isArray)) {
      return handleArrays(dataArray as JsonArray[], settings);
    }
    // Return last non-null value based on duplicate strategy
    return selectValue(dataArray, settings);
  }
  
  const result: JsonObject = {};
  const objects = dataArray as JsonObject[];
  
  // Collect all keys
  const allKeys = new Set<string>();
  objects.forEach(obj => Object.keys(obj).forEach(key => allKeys.add(key)));
  
  // Process each key
  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const values = objects
      .map((obj, idx) => ({ value: obj[key], inputIdx: idx }))
      .filter(v => v.value !== undefined);
    
    if (values.length === 0) continue;
    
    if (values.length === 1) {
      result[key] = values[0].value;
    } else {
      // Multiple values - select based on strategy
      const selectedValue = selectValueByStrategy(
        values.map(v => v.value),
        settings,
        conflicts,
        inputs,
        currentPath,
        key
      );
      result[key] = selectedValue;
    }
  }
  
  // Sort keys if requested
  if (settings.sortKeys) {
    return sortObjectKeys(result);
  }
  
  return result;
}

/**
 * Deep merge: recursively merge nested objects
 */
function deepMerge(
  dataArray: JsonValue[],
  settings: MergeSettings,
  conflicts: MergeConflict[],
  inputs: { input: MergeInput; data: JsonValue }[],
  path: string = ''
): JsonValue {
  // If any item is not an object, handle appropriately
  if (!dataArray.every(isPlainObject)) {
    // Handle arrays
    if (dataArray.some(isArray)) {
      return handleArraysDeep(dataArray, settings);
    }
    // Return selected value for primitives
    return selectValue(dataArray, settings);
  }
  
  const result: JsonObject = {};
  const objects = dataArray as JsonObject[];
  
  // Collect all keys
  const allKeys = new Set<string>();
  objects.forEach(obj => Object.keys(obj).forEach(key => allKeys.add(key)));
  
  // Process each key
  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const values = objects
      .map((obj, idx) => ({ value: obj[key], inputIdx: idx }))
      .filter(v => v.value !== undefined);
    
    if (values.length === 0) continue;
    
    if (values.length === 1) {
      result[key] = values[0].value;
    } else {
      // Check if all values are objects for recursive merge
      const allObjects = values.every(v => isPlainObject(v.value));
      
      if (allObjects) {
        // Recursively deep merge objects
        result[key] = deepMerge(
          values.map(v => v.value),
          settings,
          conflicts,
          inputs,
          currentPath
        );
      } else {
        // Mixed types or primitives - select based on strategy
        const selectedValue = selectValueByStrategy(
          values.map(v => v.value),
          settings,
          conflicts,
          inputs,
          currentPath,
          key
        );
        result[key] = selectedValue;
      }
    }
  }
  
  // Sort keys if requested
  if (settings.sortKeys) {
    return sortObjectKeys(result);
  }
  
  return result;
}

/**
 * Array concatenation: join all arrays together
 */
function arrayConcatenation(
  dataArray: JsonValue[],
  settings: MergeSettings
): JsonValue {
  // If all are arrays, concatenate them
  if (dataArray.every(isArray)) {
    const result = (dataArray as JsonArray[]).flat();
    
    if (settings.arrayOrdering === 'sort') {
      return sortArray(result);
    }
    
    return result;
  }
  
  // If all are objects, concatenate array values within
  if (dataArray.every(isPlainObject)) {
    const objects = dataArray as JsonObject[];
    const result: JsonObject = {};
    
    const allKeys = new Set<string>();
    objects.forEach(obj => Object.keys(obj).forEach(key => allKeys.add(key)));
    
    for (const key of allKeys) {
      const values = objects.map(obj => obj[key]).filter(v => v !== undefined);
      
      if (values.every(isArray)) {
        result[key] = (values as JsonArray[]).flat();
      } else if (values.length === 1) {
        result[key] = values[0];
      } else {
        // Last value wins for non-arrays
        result[key] = values[values.length - 1];
      }
    }
    
    return settings.sortKeys ? sortObjectKeys(result) : result;
  }
  
  // Mixed types - return last value
  return dataArray[dataArray.length - 1];
}

/**
 * Array union: combine arrays removing duplicates
 */
function arrayUnion(
  dataArray: JsonValue[],
  settings: MergeSettings
): JsonValue {
  // If all are arrays, union them
  if (dataArray.every(isArray)) {
    const combined = (dataArray as JsonArray[]).flat();
    const result = removeDuplicates(combined);
    
    if (settings.arrayOrdering === 'sort') {
      return sortArray(result);
    }
    
    return result;
  }
  
  // If all are objects, union array values within
  if (dataArray.every(isPlainObject)) {
    const objects = dataArray as JsonObject[];
    const result: JsonObject = {};
    
    const allKeys = new Set<string>();
    objects.forEach(obj => Object.keys(obj).forEach(key => allKeys.add(key)));
    
    for (const key of allKeys) {
      const values = objects.map(obj => obj[key]).filter(v => v !== undefined);
      
      if (values.every(isArray)) {
        const combined = (values as JsonArray[]).flat();
        result[key] = removeDuplicates(combined);
      } else if (values.length === 1) {
        result[key] = values[0];
      } else {
        // Last value wins for non-arrays
        result[key] = values[values.length - 1];
      }
    }
    
    return settings.sortKeys ? sortObjectKeys(result) : result;
  }
  
  // Mixed types - return last value
  return dataArray[dataArray.length - 1];
}

/**
 * Nested array merge: match array elements by key field
 */
function nestedArrayMerge(
  dataArray: JsonValue[],
  settings: MergeSettings,
  conflicts: MergeConflict[],
  inputs: { input: MergeInput; data: JsonValue }[],
  path: string = ''
): JsonValue {
  const keyField = settings.arrayMergeKey || 'id';
  
  // If all are arrays, merge by key
  if (dataArray.every(isArray)) {
    return mergeArraysByKey(dataArray as JsonArray[], keyField, settings, conflicts, inputs, path);
  }
  
  // If all are objects, apply nested array merge to array values
  if (dataArray.every(isPlainObject)) {
    const objects = dataArray as JsonObject[];
    const result: JsonObject = {};
    
    const allKeys = new Set<string>();
    objects.forEach(obj => Object.keys(obj).forEach(key => allKeys.add(key)));
    
    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      const values = objects.map(obj => obj[key]).filter(v => v !== undefined);
      
      if (values.length === 0) continue;
      
      if (values.length === 1) {
        result[key] = values[0];
      } else if (values.every(isArray)) {
        result[key] = mergeArraysByKey(
          values as JsonArray[],
          keyField,
          settings,
          conflicts,
          inputs,
          currentPath
        );
      } else if (values.every(isPlainObject)) {
        result[key] = nestedArrayMerge(values, settings, conflicts, inputs, currentPath);
      } else {
        result[key] = values[values.length - 1];
      }
    }
    
    return settings.sortKeys ? sortObjectKeys(result) : result;
  }
  
  return dataArray[dataArray.length - 1];
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Select value based on duplicate key strategy
 */
function selectValue(
  values: JsonValue[],
  settings: MergeSettings
): JsonValue {
  const nonNullValues = settings.nullHandling === 'preserveNonNull'
    ? values.filter(v => v !== null)
    : values;
  
  if (nonNullValues.length === 0) return null;
  
  switch (settings.duplicateKeyStrategy) {
    case 'keepFirst':
      return nonNullValues[0];
    case 'keepLast':
    default:
      return nonNullValues[nonNullValues.length - 1];
  }
}

/**
 * Select value and record conflict
 */
function selectValueByStrategy(
  values: JsonValue[],
  settings: MergeSettings,
  conflicts: MergeConflict[],
  inputs: { input: MergeInput; data: JsonValue }[],
  path: string,
  key: string
): JsonValue {
  // Record conflict if multiple different values
  const uniqueValues = [...new Set(values.map(v => JSON.stringify(v)))];
  if (uniqueValues.length > 1) {
    const resolvedValue = selectValue(values, settings);
    conflicts.push({
      path,
      key,
      values: values.map((value, idx) => ({
        inputId: inputs[idx]?.input.id || `input-${idx}`,
        inputName: inputs[idx]?.input.name || `Input ${idx + 1}`,
        value,
      })),
      resolution: settings.duplicateKeyStrategy === 'keepFirst' ? 'first' : 'last',
      resolvedValue,
    });
    return resolvedValue;
  }
  
  return values[0];
}

/**
 * Handle arrays in deep merge
 */
function handleArraysDeep(
  dataArray: JsonValue[],
  settings: MergeSettings
): JsonValue {
  const arrays = dataArray.filter(isArray) as JsonArray[];
  const nonArrays = dataArray.filter(v => !isArray(v));
  
  if (arrays.length === 0) {
    return selectValue(nonArrays, settings);
  }
  
  // Concatenate arrays by default in deep merge
  return arrays.flat();
}

/**
 * Handle arrays based on settings
 */
function handleArrays(
  arrays: JsonArray[],
  settings: MergeSettings
): JsonArray {
  // Concatenate all arrays
  const result = arrays.flat();
  
  if (settings.arrayOrdering === 'unique') {
    return removeDuplicates(result);
  }
  
  if (settings.arrayOrdering === 'sort') {
    return sortArray(result);
  }
  
  return result;
}

/**
 * Merge arrays by matching key field
 */
function mergeArraysByKey(
  arrays: JsonArray[],
  keyField: string,
  settings: MergeSettings,
  conflicts: MergeConflict[],
  inputs: { input: MergeInput; data: JsonValue }[],
  path: string
): JsonArray {
  const merged = new Map<string | number, JsonObject>();
  const noKeyItems: JsonValue[] = [];
  
  for (const array of arrays) {
    for (const item of array) {
      if (isPlainObject(item) && keyField in item) {
        const key = String(item[keyField]);
        const existing = merged.get(key);
        
        if (existing) {
          // Merge with existing
          merged.set(key, deepMerge(
            [existing, item],
            settings,
            conflicts,
            inputs,
            `${path}[${key}]`
          ) as JsonObject);
        } else {
          merged.set(key, item);
        }
      } else {
        noKeyItems.push(item);
      }
    }
  }
  
  const result = [...merged.values(), ...noKeyItems];
  
  if (settings.arrayOrdering === 'sort') {
    return sortArray(result);
  }
  
  return result;
}

/**
 * Remove duplicate values from array
 */
function removeDuplicates(array: JsonArray): JsonArray {
  const seen = new Set<string>();
  const result: JsonArray = [];
  
  for (const item of array) {
    const key = JSON.stringify(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  
  return result;
}

/**
 * Sort array elements
 */
function sortArray(array: JsonArray): JsonArray {
  return [...array].sort((a, b) => {
    const aStr = isPrimitive(a) ? String(a) : JSON.stringify(a);
    const bStr = isPrimitive(b) ? String(b) : JSON.stringify(b);
    return aStr.localeCompare(bStr);
  });
}

/**
 * Sort object keys alphabetically
 */
function sortObjectKeys(obj: JsonObject): JsonObject {
  const sorted: JsonObject = {};
  const keys = Object.keys(obj).sort();
  
  for (const key of keys) {
    const value = obj[key];
    if (isPlainObject(value)) {
      sorted[key] = sortObjectKeys(value);
    } else if (isArray(value)) {
      sorted[key] = value.map(item => 
        isPlainObject(item) ? sortObjectKeys(item) : item
      );
    } else {
      sorted[key] = value;
    }
  }
  
  return sorted;
}

/**
 * Create empty stats for error case
 */
function createEmptyStats(inputCount: number, processingTime: number): MergeStats {
  return {
    inputCount,
    totalInputKeys: 0,
    outputKeys: 0,
    conflictsResolved: 0,
    arraysProcessed: 0,
    depth: 0,
    processingTime,
  };
}

/**
 * Create stats from merge result
 */
function createStats(
  inputs: { input: MergeInput; data: JsonValue }[],
  output: JsonValue,
  conflictsResolved: number,
  processingTime: number
): MergeStats {
  const totalInputKeys = inputs.reduce((sum, { data }) => {
    return sum + countKeys(data);
  }, 0);
  
  return {
    inputCount: inputs.length,
    totalInputKeys,
    outputKeys: countKeys(output),
    conflictsResolved,
    arraysProcessed: countArrays(output),
    depth: getMaxDepth(output),
    processingTime,
  };
}

/**
 * Count keys in JSON value
 */
function countKeys(value: JsonValue): number {
  if (isPrimitive(value)) return 0;
  
  if (isArray(value)) {
    return value.reduce<number>((sum, item) => sum + countKeys(item), 0);
  }
  
  if (isPlainObject(value)) {
    let count = Object.keys(value).length;
    for (const val of Object.values(value)) {
      count += countKeys(val);
    }
    return count;
  }
  
  return 0;
}

/**
 * Count arrays in JSON value
 */
function countArrays(value: JsonValue): number {
  if (isPrimitive(value)) return 0;
  
  if (isArray(value)) {
    return 1 + value.reduce<number>((sum, item) => sum + countArrays(item), 0);
  }
  
  if (isPlainObject(value)) {
    return Object.values(value).reduce<number>((sum, val) => sum + countArrays(val), 0);
  }
  
  return 0;
}

/**
 * Get maximum nesting depth
 */
function getMaxDepth(value: JsonValue, currentDepth: number = 0): number {
  if (isPrimitive(value)) return currentDepth;
  
  if (isArray(value)) {
    if (value.length === 0) return currentDepth;
    return Math.max(...value.map(item => getMaxDepth(item, currentDepth + 1)));
  }
  
  if (isPlainObject(value)) {
    const values = Object.values(value);
    if (values.length === 0) return currentDepth;
    return Math.max(...values.map(val => getMaxDepth(val, currentDepth + 1)));
  }
  
  return currentDepth;
}
