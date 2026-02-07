/**
 * JSON Editor Validator
 * Real-time validation for JSON data
 */

import type {
  JsonValue,
  EditorValidationError,
  ValidationResult,
  EditorSettings,
} from './types';

/**
 * Parse JSON string with detailed error reporting
 */
export function parseJSON(
  input: string,
  settings: Pick<EditorSettings, 'parseMode' | 'allowComments' | 'allowTrailingCommas'>
): { data: JsonValue | null; error: EditorValidationError | null } {
  if (!input.trim()) {
    return { data: null, error: null };
  }
  
  let processedInput = input;
  
  // Handle lenient parsing
  if (settings.parseMode === 'lenient') {
    // Remove comments if allowed
    if (settings.allowComments) {
      // Remove single-line comments
      processedInput = processedInput.replace(/\/\/.*$/gm, '');
      // Remove multi-line comments
      processedInput = processedInput.replace(/\/\*[\s\S]*?\*\//g, '');
    }
    
    // Handle trailing commas if allowed
    if (settings.allowTrailingCommas) {
      // Remove trailing commas before ] and }
      processedInput = processedInput.replace(/,\s*([\]}])/g, '$1');
    }
  }
  
  try {
    const data = JSON.parse(processedInput);
    return { data, error: null };
  } catch (e) {
    const error = e as SyntaxError;
    const errorInfo = parseJsonError(error.message, input);
    
    return {
      data: null,
      error: {
        path: [],
        type: 'syntax',
        message: errorInfo.message,
        line: errorInfo.line,
        column: errorInfo.column,
        suggestion: errorInfo.suggestion,
      },
    };
  }
}

/**
 * Parse JSON error message to extract line and column
 */
function parseJsonError(errorMessage: string, input: string): {
  message: string;
  line: number;
  column: number;
  suggestion?: string;
} {
  // Try to extract position from error message
  // Format varies by browser/engine
  
  // Chrome/V8: "...at position 123"
  let match = errorMessage.match(/at position (\d+)/);
  if (match) {
    const position = parseInt(match[1], 10);
    const { line, column } = positionToLineColumn(input, position);
    return {
      message: errorMessage.replace(/at position \d+/, `at line ${line}, column ${column}`),
      line,
      column,
      suggestion: getSuggestionForPosition(input, position),
    };
  }
  
  // Firefox: "...at line X column Y"
  match = errorMessage.match(/at line (\d+) column (\d+)/);
  if (match) {
    const line = parseInt(match[1], 10);
    const column = parseInt(match[2], 10);
    const position = lineColumnToPosition(input, line, column);
    return {
      message: errorMessage,
      line,
      column,
      suggestion: getSuggestionForPosition(input, position),
    };
  }
  
  // Safari/Generic
  return {
    message: errorMessage,
    line: 1,
    column: 1,
    suggestion: 'Check your JSON syntax for errors',
  };
}

/**
 * Convert absolute position to line and column
 */
function positionToLineColumn(input: string, position: number): { line: number; column: number } {
  let line = 1;
  let column = 1;
  
  for (let i = 0; i < position && i < input.length; i++) {
    if (input[i] === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  
  return { line, column };
}

/**
 * Convert line and column to absolute position
 */
function lineColumnToPosition(input: string, line: number, column: number): number {
  let currentLine = 1;
  let currentColumn = 1;
  
  for (let i = 0; i < input.length; i++) {
    if (currentLine === line && currentColumn === column) {
      return i;
    }
    
    if (input[i] === '\n') {
      currentLine++;
      currentColumn = 1;
    } else {
      currentColumn++;
    }
  }
  
  return input.length;
}

/**
 * Get suggestion for error at position
 */
function getSuggestionForPosition(input: string, position: number): string {
  // Look at context around the error position
  const start = Math.max(0, position - 20);
  const end = Math.min(input.length, position + 20);
  const context = input.slice(start, end);
  
  // Common error patterns
  if (context.includes("'")) {
    return "Use double quotes (\") instead of single quotes (') for strings";
  }
  
  if (/,\s*[}\]]/.test(context)) {
    return "Remove trailing comma before closing bracket";
  }
  
  if (/[}\]]\s*[{\[]/.test(context)) {
    return "Missing comma between values";
  }
  
  if (/:\s*,/.test(context)) {
    return "Missing value after colon";
  }
  
  if (/"\s*"/.test(context)) {
    return "Missing colon between key and value";
  }
  
  if (/[a-zA-Z]+\s*:/.test(context) && !/"[^"]*"\s*:/.test(context)) {
    return "Object keys must be quoted strings";
  }
  
  return "Check syntax near this position";
}

/**
 * Validate JSON structure and find issues
 */
export function validateJSON(
  data: JsonValue,
  options: {
    checkDuplicateKeys?: boolean;
    maxDepth?: number;
    maxArrayLength?: number;
    maxStringLength?: number;
  } = {}
): ValidationResult {
  const errors: EditorValidationError[] = [];
  const warnings: EditorValidationError[] = [];
  
  const {
    checkDuplicateKeys = true,
    maxDepth = 100,
    maxArrayLength = 100000,
    maxStringLength = 1000000,
  } = options;
  
  function traverse(value: JsonValue, path: string[], depth: number): void {
    // Check max depth
    if (depth > maxDepth) {
      errors.push({
        path,
        type: 'structure',
        message: `Maximum nesting depth (${maxDepth}) exceeded`,
        suggestion: 'Flatten deeply nested structures',
      });
      return;
    }
    
    if (value === null) {
      // null is valid
      return;
    }
    
    if (Array.isArray(value)) {
      // Check array length
      if (value.length > maxArrayLength) {
        warnings.push({
          path,
          type: 'structure',
          message: `Array has ${value.length} items (max recommended: ${maxArrayLength})`,
          suggestion: 'Consider paginating or chunking large arrays',
        });
      }
      
      // Traverse array items
      value.forEach((item, index) => {
        traverse(item, [...path, index.toString()], depth + 1);
      });
      return;
    }
    
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      
      // Check for duplicate keys (this is actually handled by JSON.parse,
      // but we can warn about potential issues in the source)
      if (checkDuplicateKeys) {
        const seenKeys = new Set<string>();
        for (const key of keys) {
          if (seenKeys.has(key)) {
            errors.push({
              path,
              type: 'duplicate',
              message: `Duplicate key "${key}"`,
              suggestion: `Rename or remove one of the duplicate "${key}" keys`,
            });
          }
          seenKeys.add(key);
        }
      }
      
      // Traverse object properties
      for (const [key, val] of Object.entries(value)) {
        traverse(val, [...path, key], depth + 1);
      }
      return;
    }
    
    if (typeof value === 'string') {
      // Check string length
      if (value.length > maxStringLength) {
        warnings.push({
          path,
          type: 'structure',
          message: `String has ${value.length} characters (max recommended: ${maxStringLength})`,
          suggestion: 'Consider storing large text externally',
        });
      }
      return;
    }
    
    if (typeof value === 'number') {
      // Check for special number values
      if (!Number.isFinite(value)) {
        errors.push({
          path,
          type: 'type',
          message: `Invalid number value: ${value}`,
          suggestion: 'JSON does not support Infinity or NaN',
        });
      }
      return;
    }
    
    // boolean is always valid
  }
  
  traverse(data, [], 0);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate JSON input string and return validation result
 */
export function validateJSONInput(
  input: string,
  settings: EditorSettings
): ValidationResult {
  // First, try to parse
  const { data, error } = parseJSON(input, settings);
  
  if (error) {
    return {
      isValid: false,
      errors: [error],
      warnings: [],
    };
  }
  
  if (data === null) {
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  }
  
  // Then validate structure
  return validateJSON(data);
}

/**
 * Check if a string is valid JSON
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
 * Format JSON with proper indentation
 */
export function formatJSON(data: JsonValue, indent: number = 2): string {
  return JSON.stringify(data, null, indent);
}

/**
 * Minify JSON (remove whitespace)
 */
export function minifyJSON(data: JsonValue): string {
  return JSON.stringify(data);
}

/**
 * Attempt to auto-fix common JSON errors
 */
export function autoFixJSON(input: string): { fixed: string; changes: string[] } {
  const changes: string[] = [];
  let fixed = input;
  
  // Replace single quotes with double quotes
  if (fixed.includes("'")) {
    // Simple replacement - won't work perfectly for all cases
    fixed = fixed.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"');
    changes.push('Replaced single quotes with double quotes');
  }
  
  // Remove trailing commas
  const trailingCommaRegex = /,(\s*[}\]])/g;
  if (trailingCommaRegex.test(fixed)) {
    fixed = fixed.replace(trailingCommaRegex, '$1');
    changes.push('Removed trailing commas');
  }
  
  // Add quotes to unquoted keys
  const unquotedKeyRegex = /(\{|\,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g;
  if (unquotedKeyRegex.test(fixed)) {
    fixed = fixed.replace(unquotedKeyRegex, '$1"$2":');
    changes.push('Added quotes to unquoted keys');
  }
  
  // Remove comments (single-line)
  if (fixed.includes('//')) {
    fixed = fixed.replace(/\/\/.*$/gm, '');
    changes.push('Removed single-line comments');
  }
  
  // Remove comments (multi-line)
  if (fixed.includes('/*')) {
    fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, '');
    changes.push('Removed multi-line comments');
  }
  
  return { fixed, changes };
}
