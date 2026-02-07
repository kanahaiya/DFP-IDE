/**
 * JSON Formatter - Core formatting and beautification logic
 */

import type {
  FormatterSettings,
  FormatResult,
  FormatStats,
  SizeMetrics,
  ValidationError,
  JsonValue,
  JsonObject,
  IndentationType,
} from './types';
import { DEFAULT_FORMATTER_SETTINGS, isPlainObject, isArray } from './types';

// ============================================================================
// Size Calculation
// ============================================================================

/**
 * Get byte size of a string
 */
export function getByteSize(str: string): number {
  return new Blob([str]).size;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

/**
 * Calculate size metrics
 */
export function calculateSizeMetrics(str: string): SizeMetrics {
  const bytes = getByteSize(str);
  return {
    bytes,
    characters: str.length,
    lines: str.split('\n').length,
    formatted: formatBytes(bytes),
  };
}

// ============================================================================
// Formatting Logic
// ============================================================================

/**
 * Get indentation string
 */
function getIndentString(indentation: IndentationType): string {
  if (indentation === 'tab') return '\t';
  return ' '.repeat(indentation);
}

/**
 * Clean data based on settings
 */
function cleanData(data: JsonValue, settings: FormatterSettings): JsonValue {
  if (data === null) {
    return settings.removeNulls ? undefined as unknown as JsonValue : null;
  }

  if (isArray(data)) {
    if (settings.removeEmptyArrays && data.length === 0) {
      return undefined as unknown as JsonValue;
    }
    const cleaned = data
      .map(item => cleanData(item, settings))
      .filter(item => item !== undefined);
    return cleaned;
  }

  if (isPlainObject(data)) {
    const keys = settings.sortKeys 
      ? Object.keys(data).sort((a, b) => a.localeCompare(b))
      : Object.keys(data);
    
    const result: JsonObject = {};
    
    for (const key of keys) {
      const value = data[key];
      
      // Check for removal conditions
      if (value === null && settings.removeNulls) continue;
      if (value === '' && settings.removeEmptyStrings) continue;
      if (isArray(value) && value.length === 0 && settings.removeEmptyArrays) continue;
      if (isPlainObject(value) && Object.keys(value).length === 0 && settings.removeEmptyObjects) continue;
      
      const cleanedValue = cleanData(value, settings);
      if (cleanedValue !== undefined) {
        result[key] = cleanedValue;
      }
    }
    
    if (settings.removeEmptyObjects && Object.keys(result).length === 0) {
      return undefined as unknown as JsonValue;
    }
    
    return result;
  }

  if (typeof data === 'string') {
    if (settings.removeEmptyStrings && data === '') {
      return undefined as unknown as JsonValue;
    }
  }

  return data;
}

/**
 * Escape unicode characters
 */
function escapeUnicode(str: string): string {
  return str.replace(/[\u007F-\uFFFF]/g, (char) => {
    return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
  });
}

/**
 * Custom JSON stringify with options
 */
function customStringify(
  data: JsonValue,
  settings: FormatterSettings
): string {
  const indent = getIndentString(settings.indentation);
  
  let result = JSON.stringify(data, null, indent);
  
  if (settings.escapeUnicode) {
    result = escapeUnicode(result);
  }
  
  if (settings.trailingNewline && !result.endsWith('\n')) {
    result += '\n';
  }
  
  return result;
}

/**
 * Format JSON with settings
 */
export function formatJSON(
  input: string,
  settings: Partial<FormatterSettings> = {}
): FormatResult {
  const startTime = performance.now();
  const mergedSettings = { ...DEFAULT_FORMATTER_SETTINGS, ...settings };
  
  const originalMetrics = calculateSizeMetrics(input);
  
  try {
    // Parse JSON
    const parsed = JSON.parse(input);
    
    // Clean data based on settings
    let data: JsonValue = parsed;
    if (
      mergedSettings.removeNulls ||
      mergedSettings.removeEmptyStrings ||
      mergedSettings.removeEmptyArrays ||
      mergedSettings.removeEmptyObjects ||
      mergedSettings.sortKeys
    ) {
      data = cleanData(parsed, mergedSettings);
    }
    
    // Format output
    const output = customStringify(data, mergedSettings);
    const formattedMetrics = calculateSizeMetrics(output);
    
    const stats: FormatStats = {
      original: originalMetrics,
      formatted: formattedMetrics,
      changeBytes: formattedMetrics.bytes - originalMetrics.bytes,
      changePercent: ((formattedMetrics.bytes - originalMetrics.bytes) / originalMetrics.bytes) * 100,
    };
    
    return {
      success: true,
      output,
      stats,
      errors: [],
      processingTime: performance.now() - startTime,
    };
  } catch (error) {
    const err = error as SyntaxError;
    const errorMessage = err.message;
    
    // Parse error location from message
    const lineMatch = errorMessage.match(/line (\d+)/i);
    const columnMatch = errorMessage.match(/column (\d+)/i);
    const positionMatch = errorMessage.match(/position (\d+)/i);
    
    let line = 1;
    let column = 1;
    
    if (lineMatch) {
      line = parseInt(lineMatch[1], 10);
    } else if (positionMatch) {
      const position = parseInt(positionMatch[1], 10);
      const lines = input.substring(0, position).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }
    
    if (columnMatch) {
      column = parseInt(columnMatch[1], 10);
    }
    
    const validationError: ValidationError = {
      line,
      column,
      message: errorMessage,
      severity: 'error',
      type: 'SyntaxError',
    };
    
    return {
      success: false,
      output: '',
      stats: {
        original: originalMetrics,
        formatted: { bytes: 0, characters: 0, lines: 0, formatted: '0 B' },
        changeBytes: 0,
        changePercent: 0,
      },
      errors: [validationError],
      processingTime: performance.now() - startTime,
    };
  }
}

/**
 * Minify JSON (remove all whitespace)
 */
export function minifyJSON(input: string): FormatResult {
  const startTime = performance.now();
  const originalMetrics = calculateSizeMetrics(input);
  
  try {
    const parsed = JSON.parse(input);
    const output = JSON.stringify(parsed);
    const formattedMetrics = calculateSizeMetrics(output);
    
    const stats: FormatStats = {
      original: originalMetrics,
      formatted: formattedMetrics,
      changeBytes: formattedMetrics.bytes - originalMetrics.bytes,
      changePercent: ((formattedMetrics.bytes - originalMetrics.bytes) / originalMetrics.bytes) * 100,
    };
    
    return {
      success: true,
      output,
      stats,
      errors: [],
      processingTime: performance.now() - startTime,
    };
  } catch (error) {
    const err = error as SyntaxError;
    
    return {
      success: false,
      output: '',
      stats: {
        original: originalMetrics,
        formatted: { bytes: 0, characters: 0, lines: 0, formatted: '0 B' },
        changeBytes: 0,
        changePercent: 0,
      },
      errors: [{
        line: 1,
        column: 1,
        message: err.message,
        severity: 'error',
        type: 'SyntaxError',
      }],
      processingTime: performance.now() - startTime,
    };
  }
}

/**
 * Quick format (beautify with 2 spaces)
 */
export function quickFormat(input: string): string {
  try {
    return JSON.stringify(JSON.parse(input), null, 2);
  } catch {
    return input;
  }
}

/**
 * Quick minify
 */
export function quickMinify(input: string): string {
  try {
    return JSON.stringify(JSON.parse(input));
  } catch {
    return input;
  }
}
