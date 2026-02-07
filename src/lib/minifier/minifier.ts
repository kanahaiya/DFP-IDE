/**
 * Core minification and beautification logic for JSON Minifier tool
 */

import type {
  MinifierSettings,
  MinifyResult,
  CompressionStats,
  SizeMetrics,
  JsonValue,
  JsonObject,
  IndentationType,
} from './types';
import { DEFAULT_MINIFIER_SETTINGS, isPlainObject, isArray } from './types';
import { validateJSON, getByteSize, getLineCount, formatBytes } from './validator';

// ============================================================================
// Size Metrics Calculation
// ============================================================================

/**
 * Calculate size metrics for a string
 */
function calculateSizeMetrics(input: string): SizeMetrics {
  const bytes = getByteSize(input);
  return {
    bytes,
    characters: input.length,
    lines: getLineCount(input),
    formatted: formatBytes(bytes),
  };
}

/**
 * Calculate compression statistics
 */
function calculateCompressionStats(
  original: string,
  processed: string
): CompressionStats {
  const originalMetrics = calculateSizeMetrics(original);
  const processedMetrics = calculateSizeMetrics(processed);
  
  const bytesSaved = originalMetrics.bytes - processedMetrics.bytes;
  const percentageReduction = originalMetrics.bytes > 0
    ? (bytesSaved / originalMetrics.bytes) * 100
    : 0;
  
  const ratio = processedMetrics.bytes > 0
    ? originalMetrics.bytes / processedMetrics.bytes
    : 1;
  
  return {
    original: originalMetrics,
    processed: processedMetrics,
    bytesSaved,
    percentageReduction: Math.round(percentageReduction * 10) / 10,
    compressionRatio: `${ratio.toFixed(1)}:1`,
  };
}

// ============================================================================
// JSON Cleaning Functions
// ============================================================================

/**
 * Clean JSON value according to settings
 */
function cleanValue(
  value: JsonValue,
  settings: MinifierSettings
): JsonValue | undefined {
  // Handle null
  if (value === null) {
    return settings.removeNulls ? undefined : null;
  }
  
  // Handle string
  if (typeof value === 'string') {
    if (settings.removeEmptyStrings && value === '') {
      return undefined;
    }
    return value;
  }
  
  // Handle number or boolean
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  
  // Handle array
  if (isArray(value)) {
    const cleanedArray = value
      .map(item => cleanValue(item, settings))
      .filter(item => item !== undefined) as JsonValue[];
    
    if (settings.removeEmptyArrays && cleanedArray.length === 0) {
      return undefined;
    }
    return cleanedArray;
  }
  
  // Handle object
  if (isPlainObject(value)) {
    const cleanedObject: JsonObject = {};
    const keys = settings.sortKeys
      ? Object.keys(value).sort()
      : Object.keys(value);
    
    for (const key of keys) {
      const cleanedValue = cleanValue(value[key], settings);
      if (cleanedValue !== undefined) {
        cleanedObject[key] = cleanedValue;
      }
    }
    
    if (settings.removeEmptyObjects && Object.keys(cleanedObject).length === 0) {
      return undefined;
    }
    return cleanedObject;
  }
  
  return value;
}

/**
 * Sort object keys recursively
 */
function sortObjectKeys(value: JsonValue): JsonValue {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  if (isArray(value)) {
    return value.map(sortObjectKeys);
  }
  
  if (isPlainObject(value)) {
    const sortedObject: JsonObject = {};
    const sortedKeys = Object.keys(value).sort();
    for (const key of sortedKeys) {
      sortedObject[key] = sortObjectKeys(value[key]);
    }
    return sortedObject;
  }
  
  return value;
}

// ============================================================================
// Custom JSON Stringify with Options
// ============================================================================

/**
 * Get indentation string
 */
function getIndentString(indentation: IndentationType): string {
  if (indentation === 'tab') {
    return '\t';
  }
  return ' '.repeat(indentation);
}

/**
 * Stringify with unicode escaping option
 */
function stringifyWithOptions(
  value: JsonValue,
  settings: MinifierSettings
): string {
  const space = settings.mode === 'beautify'
    ? getIndentString(settings.indentation)
    : undefined;
  
  let result = JSON.stringify(value, null, space);
  
  // Escape unicode if requested
  if (settings.escapeUnicode) {
    result = result.replace(/[\u0080-\uFFFF]/g, (char) => {
      return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
    });
  }
  
  // Add trailing newline if requested
  if (settings.trailingNewline && !result.endsWith('\n')) {
    result += '\n';
  }
  
  return result;
}

// ============================================================================
// Main Minifier Functions
// ============================================================================

/**
 * Minify JSON string
 */
export function minifyJSON(
  input: string,
  settings: Partial<MinifierSettings> = {}
): MinifyResult {
  const startTime = performance.now();
  const fullSettings: MinifierSettings = {
    ...DEFAULT_MINIFIER_SETTINGS,
    ...settings,
    mode: 'minify',
  };
  
  // Validate input
  const validation = validateJSON(input);
  if (!validation.isValid) {
    return {
      success: false,
      output: '',
      stats: calculateCompressionStats(input, ''),
      errors: validation.errors,
      processingTime: performance.now() - startTime,
    };
  }
  
  try {
    let data = validation.parsedData as JsonValue;
    
    // Apply cleaning options
    const needsCleaning = fullSettings.removeNulls ||
      fullSettings.removeEmptyStrings ||
      fullSettings.removeEmptyArrays ||
      fullSettings.removeEmptyObjects ||
      fullSettings.sortKeys;
    
    if (needsCleaning) {
      const cleanedData = cleanValue(data, fullSettings);
      data = cleanedData !== undefined ? cleanedData : data;
    } else if (fullSettings.sortKeys) {
      data = sortObjectKeys(data);
    }
    
    // Minify (no whitespace)
    const output = JSON.stringify(data);
    
    return {
      success: true,
      output,
      stats: calculateCompressionStats(input, output),
      errors: [],
      processingTime: performance.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      output: '',
      stats: calculateCompressionStats(input, ''),
      errors: [{
        line: 1,
        column: 1,
        message: `Processing error: ${(error as Error).message}`,
        severity: 'error',
      }],
      processingTime: performance.now() - startTime,
    };
  }
}

/**
 * Beautify JSON string
 */
export function beautifyJSON(
  input: string,
  settings: Partial<MinifierSettings> = {}
): MinifyResult {
  const startTime = performance.now();
  const fullSettings: MinifierSettings = {
    ...DEFAULT_MINIFIER_SETTINGS,
    ...settings,
    mode: 'beautify',
  };
  
  // Validate input
  const validation = validateJSON(input);
  if (!validation.isValid) {
    return {
      success: false,
      output: '',
      stats: calculateCompressionStats(input, ''),
      errors: validation.errors,
      processingTime: performance.now() - startTime,
    };
  }
  
  try {
    let data = validation.parsedData as JsonValue;
    
    // Apply cleaning options
    const needsCleaning = fullSettings.removeNulls ||
      fullSettings.removeEmptyStrings ||
      fullSettings.removeEmptyArrays ||
      fullSettings.removeEmptyObjects;
    
    if (needsCleaning) {
      const cleanedData = cleanValue(data, fullSettings);
      data = cleanedData !== undefined ? cleanedData : data;
    }
    
    // Sort keys if requested
    if (fullSettings.sortKeys) {
      data = sortObjectKeys(data);
    }
    
    // Beautify with formatting
    const output = stringifyWithOptions(data, fullSettings);
    
    return {
      success: true,
      output,
      stats: calculateCompressionStats(input, output),
      errors: [],
      processingTime: performance.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      output: '',
      stats: calculateCompressionStats(input, ''),
      errors: [{
        line: 1,
        column: 1,
        message: `Processing error: ${(error as Error).message}`,
        severity: 'error',
      }],
      processingTime: performance.now() - startTime,
    };
  }
}

/**
 * Process JSON based on settings (minify or beautify)
 */
export function processJSON(
  input: string,
  settings: Partial<MinifierSettings> = {}
): MinifyResult {
  const fullSettings: MinifierSettings = {
    ...DEFAULT_MINIFIER_SETTINGS,
    ...settings,
  };
  
  if (fullSettings.mode === 'minify') {
    return minifyJSON(input, fullSettings);
  } else {
    return beautifyJSON(input, fullSettings);
  }
}

/**
 * Quick minify without options (fastest path)
 */
export function quickMinify(input: string): string | null {
  try {
    return JSON.stringify(JSON.parse(input));
  } catch {
    return null;
  }
}

/**
 * Quick beautify without options
 */
export function quickBeautify(input: string, indent: number = 2): string | null {
  try {
    return JSON.stringify(JSON.parse(input), null, indent);
  } catch {
    return null;
  }
}

/**
 * Estimate compression without full processing
 */
export function estimateCompression(input: string): {
  estimatedReduction: number;
  isMinified: boolean;
} {
  const trimmed = input.trim();
  
  // Check if already minified (no newlines, minimal whitespace)
  const isMinified = !trimmed.includes('\n') && 
    trimmed.replace(/\s/g, '').length === trimmed.length * 0.95;
  
  // Estimate by counting whitespace
  const whitespaceCount = (input.match(/\s/g) || []).length;
  const estimatedReduction = (whitespaceCount / input.length) * 100;
  
  return {
    estimatedReduction: Math.round(estimatedReduction),
    isMinified,
  };
}
