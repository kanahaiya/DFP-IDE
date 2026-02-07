/**
 * JSON Validator - Core validation engine
 * Provides detailed error reporting with line/column positions
 */

import type {
  ValidationResult,
  ValidationError,
  JsonStats,
  ValidatorSettings,
  ErrorType,
} from './types';
import { DEFAULT_VALIDATOR_SETTINGS } from './types';

/**
 * Get line and column from position in string
 */
function getLineColumn(input: string, position: number): { line: number; column: number } {
  const lines = input.substring(0, position).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

/**
 * Parse JSON error message to extract position
 */
function parseJsonError(error: SyntaxError, input: string): ValidationError {
  const message = error.message;
  let position = 0;
  let line = 1;
  let column = 1;

  // Try to extract position from error message
  const posMatch = message.match(/position\s+(\d+)/i);
  const lineMatch = message.match(/line\s+(\d+)/i);
  const colMatch = message.match(/column\s+(\d+)/i);

  if (posMatch) {
    position = parseInt(posMatch[1], 10);
    const loc = getLineColumn(input, position);
    line = loc.line;
    column = loc.column;
  } else if (lineMatch) {
    line = parseInt(lineMatch[1], 10);
    if (colMatch) {
      column = parseInt(colMatch[1], 10);
    }
  }

  // Determine error type from message
  let type: ErrorType = 'syntax';
  let suggestion: string | undefined;

  if (message.includes('Unexpected token')) {
    if (message.includes("'")) {
      type = 'single_quote';
      suggestion = 'Use double quotes (") instead of single quotes (\')';
    } else if (message.includes(',')) {
      type = 'trailing_comma';
      suggestion = 'Remove the trailing comma';
    }
  } else if (message.includes('Unexpected end')) {
    suggestion = 'Check for missing closing brackets or braces';
  }

  return {
    line,
    column,
    position,
    message: message.replace(/^JSON\.parse:\s*/i, ''),
    type,
    severity: 'error',
    suggestion,
    fixable: type !== 'syntax',
  };
}

/**
 * Detect common JSON issues that native parser may not catch or report well
 */
function detectIssues(input: string, settings: ValidatorSettings): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for single quotes
  if (settings.strictMode && !settings.allowSingleQuotes) {
    const singleQuoteRegex = /(?<!\\)'([^']*?)(?<!\\)'/g;
    let match;
    while ((match = singleQuoteRegex.exec(input)) !== null) {
      // Make sure it's not inside a double-quoted string
      const beforeMatch = input.substring(0, match.index);
      const doubleQuoteCount = (beforeMatch.match(/(?<!\\)"/g) || []).length;
      if (doubleQuoteCount % 2 === 0) {
        const loc = getLineColumn(input, match.index);
        errors.push({
          line: loc.line,
          column: loc.column,
          position: match.index,
          message: 'Single quotes are not valid in JSON',
          type: 'single_quote',
          severity: 'error',
          suggestion: 'Replace single quotes with double quotes',
          fixable: true,
        });
      }
    }
  }

  // Check for trailing commas
  if (settings.strictMode && !settings.allowTrailingCommas) {
    const trailingCommaRegex = /,\s*([}\]])/g;
    let match;
    while ((match = trailingCommaRegex.exec(input)) !== null) {
      const loc = getLineColumn(input, match.index);
      errors.push({
        line: loc.line,
        column: loc.column,
        position: match.index,
        message: 'Trailing commas are not allowed in JSON',
        type: 'trailing_comma',
        severity: 'error',
        suggestion: 'Remove the trailing comma',
        fixable: true,
      });
    }
  }

  // Check for comments
  if (settings.strictMode && !settings.allowComments) {
    // Single-line comments
    const singleCommentRegex = /\/\/[^\n]*/g;
    let match;
    while ((match = singleCommentRegex.exec(input)) !== null) {
      const loc = getLineColumn(input, match.index);
      errors.push({
        line: loc.line,
        column: loc.column,
        position: match.index,
        message: 'Comments are not allowed in JSON',
        type: 'comment',
        severity: 'error',
        suggestion: 'Remove the comment',
        fixable: true,
      });
    }

    // Multi-line comments
    const multiCommentRegex = /\/\*[\s\S]*?\*\//g;
    while ((match = multiCommentRegex.exec(input)) !== null) {
      const loc = getLineColumn(input, match.index);
      errors.push({
        line: loc.line,
        column: loc.column,
        position: match.index,
        message: 'Multi-line comments are not allowed in JSON',
        type: 'comment',
        severity: 'error',
        suggestion: 'Remove the comment',
        fixable: true,
      });
    }
  }

  // Check for unquoted keys
  if (settings.strictMode && !settings.allowUnquotedKeys) {
    const unquotedKeyRegex = /(?<=[\{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g;
    let match;
    while ((match = unquotedKeyRegex.exec(input)) !== null) {
      const loc = getLineColumn(input, match.index);
      errors.push({
        line: loc.line,
        column: loc.column,
        position: match.index,
        message: `Unquoted key "${match[1]}" - keys must be double-quoted strings`,
        type: 'unquoted_key',
        severity: 'error',
        suggestion: `Wrap the key in double quotes: "${match[1]}"`,
        fixable: true,
      });
    }
  }

  // Check for duplicate keys
  if (settings.detectDuplicateKeys) {
    try {
      const keyPaths = new Map<string, number[]>();
      detectDuplicateKeysRecursive(input, keyPaths);
      
      for (const [path, positions] of keyPaths) {
        if (positions.length > 1) {
          for (let i = 1; i < positions.length; i++) {
            const loc = getLineColumn(input, positions[i]);
            errors.push({
              line: loc.line,
              column: loc.column,
              position: positions[i],
              message: `Duplicate key "${path.split('.').pop()}"`,
              type: 'duplicate_key',
              severity: 'warning',
              suggestion: 'Remove or rename the duplicate key',
              fixable: false,
            });
          }
        }
      }
    } catch {
      // Ignore errors during duplicate key detection
    }
  }

  return errors;
}

/**
 * Recursively detect duplicate keys using regex (simplified approach)
 */
function detectDuplicateKeysRecursive(input: string, keyPaths: Map<string, number[]>, path: string = ''): void {
  // Simple regex to find keys - this is a simplified approach
  const keyRegex = /"([^"]+)"\s*:/g;
  let match;
  const localKeys = new Map<string, number[]>();

  while ((match = keyRegex.exec(input)) !== null) {
    const key = match[1];
    const fullPath = path ? `${path}.${key}` : key;
    
    if (!localKeys.has(key)) {
      localKeys.set(key, []);
    }
    localKeys.get(key)!.push(match.index);
    
    if (!keyPaths.has(fullPath)) {
      keyPaths.set(fullPath, []);
    }
    keyPaths.get(fullPath)!.push(match.index);
  }
}

/**
 * Calculate JSON statistics
 */
function calculateStats(input: string, parsed: unknown): JsonStats {
  const stats: JsonStats = {
    totalKeys: 0,
    totalValues: 0,
    depth: 0,
    objectCount: 0,
    arrayCount: 0,
    stringCount: 0,
    numberCount: 0,
    booleanCount: 0,
    nullCount: 0,
    size: new Blob([input]).size,
    sizeFormatted: formatSize(new Blob([input]).size),
  };

  function traverse(value: unknown, currentDepth: number): void {
    stats.depth = Math.max(stats.depth, currentDepth);
    stats.totalValues++;

    if (value === null) {
      stats.nullCount++;
    } else if (typeof value === 'boolean') {
      stats.booleanCount++;
    } else if (typeof value === 'number') {
      stats.numberCount++;
    } else if (typeof value === 'string') {
      stats.stringCount++;
    } else if (Array.isArray(value)) {
      stats.arrayCount++;
      for (const item of value) {
        traverse(item, currentDepth + 1);
      }
    } else if (typeof value === 'object') {
      stats.objectCount++;
      const keys = Object.keys(value as object);
      stats.totalKeys += keys.length;
      for (const key of keys) {
        traverse((value as Record<string, unknown>)[key], currentDepth + 1);
      }
    }
  }

  traverse(parsed, 0);
  return stats;
}

/**
 * Format byte size to human readable
 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Main validation function
 */
export function validateJSON(
  input: string,
  settings: Partial<ValidatorSettings> = {}
): ValidationResult {
  const startTime = performance.now();
  const config: ValidatorSettings = { ...DEFAULT_VALIDATOR_SETTINGS, ...settings };
  
  const result: ValidationResult = {
    isValid: false,
    errors: [],
    warnings: [],
    stats: null,
    validationTime: 0,
    standard: config.standard,
  };

  // Empty input check
  if (!input.trim()) {
    result.errors.push({
      line: 1,
      column: 1,
      position: 0,
      message: 'Input is empty',
      type: 'syntax',
      severity: 'error',
      suggestion: 'Enter valid JSON data',
      fixable: false,
    });
    result.validationTime = performance.now() - startTime;
    return result;
  }

  // Detect pre-parse issues
  const preParseErrors = detectIssues(input, config);
  
  // Separate errors and warnings
  for (const error of preParseErrors) {
    if (error.severity === 'warning') {
      result.warnings.push(error);
    } else {
      result.errors.push(error);
    }
  }

  // Try to parse JSON
  try {
    const parsed = JSON.parse(input);
    
    // If we got here, JSON is syntactically valid
    // But we may still have warnings or non-fatal errors
    if (result.errors.length === 0) {
      result.isValid = true;
    }

    // Calculate statistics
    if (config.showStatistics) {
      result.stats = calculateStats(input, parsed);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      const parseError = parseJsonError(error, input);
      
      // Avoid duplicate errors
      const isDuplicate = result.errors.some(
        e => e.line === parseError.line && e.column === parseError.column
      );
      
      if (!isDuplicate) {
        result.errors.push(parseError);
      }
    }
  }

  result.validationTime = performance.now() - startTime;
  return result;
}

/**
 * Quick validation (just checks if valid, no detailed errors)
 */
export function isValidJSON(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format JSON with specified indentation
 */
export function formatJSON(input: string, indent: number | 'tab' = 2): string {
  try {
    const parsed = JSON.parse(input);
    const space = indent === 'tab' ? '\t' : indent;
    return JSON.stringify(parsed, null, space);
  } catch {
    return input;
  }
}

/**
 * Minify JSON (remove whitespace)
 */
export function minifyJSON(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch {
    return input;
  }
}
