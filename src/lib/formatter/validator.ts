/**
 * JSON Validator - Validation and error detection
 */

import type { ValidationResult, ValidationError } from './types';

// ============================================================================
// JSON Validation
// ============================================================================

/**
 * Validate JSON syntax
 */
export function validateJSON(input: string): ValidationResult {
  const startTime = performance.now();
  
  if (!input.trim()) {
    return {
      isValid: false,
      errors: [{
        line: 1,
        column: 1,
        message: 'Empty input',
        severity: 'error',
        type: 'EmptyInput',
      }],
      parseTime: performance.now() - startTime,
    };
  }
  
  try {
    const parsed = JSON.parse(input);
    return {
      isValid: true,
      errors: [],
      parsedData: parsed,
      parseTime: performance.now() - startTime,
    };
  } catch (error) {
    const err = error as SyntaxError;
    const errorInfo = parseErrorMessage(err.message, input);
    
    return {
      isValid: false,
      errors: [errorInfo],
      parseTime: performance.now() - startTime,
    };
  }
}

/**
 * Parse error message to extract position
 */
function parseErrorMessage(message: string, input: string): ValidationError {
  // Try to extract position from error message
  const positionMatch = message.match(/position (\d+)/i);
  const lineMatch = message.match(/line (\d+)/i);
  const columnMatch = message.match(/column (\d+)/i);
  
  let line = 1;
  let column = 1;
  
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    const beforeError = input.substring(0, position);
    const lines = beforeError.split('\n');
    line = lines.length;
    column = lines[lines.length - 1].length + 1;
  } else if (lineMatch) {
    line = parseInt(lineMatch[1], 10);
    if (columnMatch) {
      column = parseInt(columnMatch[1], 10);
    }
  }
  
  // Determine error type from message
  const type = determineErrorType(message);
  
  return {
    line,
    column,
    message: formatErrorMessage(message, type),
    severity: 'error',
    type,
  };
}

/**
 * Determine the type of JSON error
 */
function determineErrorType(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('unexpected token')) {
    if (lowerMessage.includes("'")) return 'SingleQuotes';
    if (lowerMessage.includes(',')) return 'TrailingComma';
    return 'UnexpectedToken';
  }
  if (lowerMessage.includes('unexpected end')) return 'UnexpectedEnd';
  if (lowerMessage.includes('unexpected string')) return 'UnexpectedString';
  if (lowerMessage.includes('unexpected number')) return 'UnexpectedNumber';
  if (lowerMessage.includes('property name')) return 'PropertyName';
  if (lowerMessage.includes('after property')) return 'AfterProperty';
  
  return 'SyntaxError';
}

/**
 * Format error message for better UX
 */
function formatErrorMessage(originalMessage: string, type: string): string {
  switch (type) {
    case 'SingleQuotes':
      return 'JSON requires double quotes, not single quotes';
    case 'TrailingComma':
      return 'Trailing commas are not allowed in JSON';
    case 'UnexpectedEnd':
      return 'Unexpected end of input - missing closing bracket or brace';
    case 'PropertyName':
      return 'Property names must be double-quoted strings';
    case 'AfterProperty':
      return 'Expected comma or closing brace after property value';
    default:
      return originalMessage;
  }
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Check if string looks like JSON
 */
export function isLikelyJSON(input: string): boolean {
  const trimmed = input.trim();
  return (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  );
}

/**
 * Get line count
 */
export function getLineCount(input: string): number {
  return input.split('\n').length;
}

/**
 * Get character count
 */
export function getCharacterCount(input: string): number {
  return input.length;
}

/**
 * Find matching bracket position
 */
export function findMatchingBracket(input: string, position: number): number | null {
  const char = input[position];
  const pairs: Record<string, string> = {
    '{': '}',
    '}': '{',
    '[': ']',
    ']': '[',
  };
  
  if (!pairs[char]) return null;
  
  const isOpening = char === '{' || char === '[';
  const target = pairs[char];
  let depth = 1;
  let inString = false;
  let escape = false;
  
  const direction = isOpening ? 1 : -1;
  let i = position + direction;
  
  while (i >= 0 && i < input.length && depth > 0) {
    const c = input[i];
    
    if (escape) {
      escape = false;
    } else if (c === '\\') {
      escape = true;
    } else if (c === '"' && !escape) {
      inString = !inString;
    } else if (!inString) {
      if (c === char) {
        depth++;
      } else if (c === target) {
        depth--;
      }
    }
    
    i += direction;
  }
  
  return depth === 0 ? i - direction : null;
}

// ============================================================================
// Auto-Fix Suggestions
// ============================================================================

/**
 * Common fix suggestions
 */
export interface FixSuggestion {
  description: string;
  fix: (input: string) => string;
}

/**
 * Get fix suggestions for common errors
 */
export function getFixSuggestions(input: string, error: ValidationError): FixSuggestion[] {
  const suggestions: FixSuggestion[] = [];
  
  switch (error.type) {
    case 'SingleQuotes':
      suggestions.push({
        description: 'Replace single quotes with double quotes',
        fix: (str) => str.replace(/'/g, '"'),
      });
      break;
      
    case 'TrailingComma':
      suggestions.push({
        description: 'Remove trailing commas',
        fix: (str) => str.replace(/,(\s*[\]}])/g, '$1'),
      });
      break;
      
    case 'PropertyName':
      suggestions.push({
        description: 'Add quotes around property names',
        fix: (str) => str.replace(/(\{|\,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":'),
      });
      break;
      
    default:
      break;
  }
  
  return suggestions;
}

/**
 * Try to auto-fix common JSON errors
 */
export function tryAutoFix(input: string): { fixed: string; changes: string[] } {
  let fixed = input;
  const changes: string[] = [];
  
  // Fix single quotes
  const singleQuoteCount = (fixed.match(/'/g) || []).length;
  if (singleQuoteCount > 0) {
    // Only replace quotes that are likely property names or string values
    const originalFixed = fixed;
    fixed = fixed.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');
    if (fixed !== originalFixed) {
      changes.push('Replaced single quotes with double quotes');
    }
  }
  
  // Fix trailing commas
  const trailingCommaRegex = /,(\s*[\]}])/g;
  if (trailingCommaRegex.test(fixed)) {
    fixed = fixed.replace(trailingCommaRegex, '$1');
    changes.push('Removed trailing commas');
  }
  
  // Fix unquoted property names
  const unquotedKeyRegex = /(\{|\,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g;
  if (unquotedKeyRegex.test(fixed)) {
    fixed = fixed.replace(unquotedKeyRegex, '$1"$2":');
    changes.push('Added quotes to property names');
  }
  
  // Try to validate after fixes
  try {
    JSON.parse(fixed);
  } catch {
    // If still invalid, return changes attempted so far
  }
  
  return { fixed, changes };
}
