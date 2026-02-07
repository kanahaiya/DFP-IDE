/**
 * JSON validation utilities for Minifier tool
 */

import type { ValidationResult, ValidationError } from './types';

/**
 * Parse JSON error message to extract line and column numbers
 */
function parseJsonError(error: Error, input: string): ValidationError {
  const message = error.message;
  
  // Try to extract position from different JSON parse error formats
  // Format 1: "...at position 123..."
  const positionMatch = message.match(/position\s+(\d+)/i);
  
  // Format 2: "...at line 5 column 10..."
  const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  
  if (lineColMatch) {
    return {
      line: parseInt(lineColMatch[1], 10),
      column: parseInt(lineColMatch[2], 10),
      message: message,
      severity: 'error',
    };
  }
  
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    const { line, column } = positionToLineColumn(input, position);
    return {
      line,
      column,
      message: message,
      severity: 'error',
    };
  }
  
  // Default to first position if we can't parse
  return {
    line: 1,
    column: 1,
    message: message || 'Invalid JSON',
    severity: 'error',
  };
}

/**
 * Convert character position to line and column numbers
 */
function positionToLineColumn(input: string, position: number): { line: number; column: number } {
  const lines = input.substring(0, position).split('\n');
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}

/**
 * Validate JSON string and return detailed result
 */
export function validateJSON(input: string): ValidationResult {
  // Handle empty input
  if (!input || input.trim() === '') {
    return {
      isValid: false,
      errors: [{
        line: 1,
        column: 1,
        message: 'Input is empty',
        severity: 'error',
      }],
    };
  }
  
  try {
    const parsedData = JSON.parse(input);
    return {
      isValid: true,
      errors: [],
      parsedData,
    };
  } catch (error) {
    const validationError = parseJsonError(error as Error, input);
    return {
      isValid: false,
      errors: [validationError],
    };
  }
}

/**
 * Check if input is likely JSON (basic heuristic)
 */
export function isLikelyJSON(input: string): boolean {
  const trimmed = input.trim();
  return (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  );
}

/**
 * Get line count of input
 */
export function getLineCount(input: string): number {
  if (!input) return 0;
  return input.split('\n').length;
}

/**
 * Get character count (excluding whitespace optionally)
 */
export function getCharacterCount(input: string, excludeWhitespace = false): number {
  if (!input) return 0;
  if (excludeWhitespace) {
    return input.replace(/\s/g, '').length;
  }
  return input.length;
}

/**
 * Get byte size of string (UTF-8)
 */
export function getByteSize(input: string): number {
  return new Blob([input]).size;
}

/**
 * Format byte size to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  if (i === 0) return `${bytes} B`;
  
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Try to auto-fix common JSON errors
 */
export function tryAutoFix(input: string): { fixed: string; changes: string[] } {
  const changes: string[] = [];
  let fixed = input;
  
  // Remove trailing commas before } or ]
  const trailingCommaRegex = /,(\s*[}\]])/g;
  if (trailingCommaRegex.test(fixed)) {
    fixed = fixed.replace(trailingCommaRegex, '$1');
    changes.push('Removed trailing commas');
  }
  
  // Replace single quotes with double quotes (for keys and string values)
  // This is a simple approach - more complex cases need better handling
  const singleQuoteRegex = /'([^'\\]*(?:\\.[^'\\]*)*)'/g;
  if (singleQuoteRegex.test(fixed)) {
    fixed = fixed.replace(singleQuoteRegex, '"$1"');
    changes.push('Replaced single quotes with double quotes');
  }
  
  // Add missing quotes to unquoted keys
  // Match: { key: value } => { "key": value }
  const unquotedKeyRegex = /([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g;
  const beforeUnquoted = fixed;
  fixed = fixed.replace(unquotedKeyRegex, '$1"$2"$3');
  if (fixed !== beforeUnquoted) {
    changes.push('Added quotes to unquoted keys');
  }
  
  return { fixed, changes };
}
