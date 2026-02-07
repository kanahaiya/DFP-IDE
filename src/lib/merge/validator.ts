/**
 * JSON validation for merge inputs
 */

import type { ValidationError } from './types';

/**
 * Result of JSON validation
 */
export interface ValidationResult {
  isValid: boolean;
  parsed: unknown | null;
  errors: ValidationError[];
}

/**
 * Validate JSON string and return parsed result with errors
 */
export function validateJSON(
  content: string,
  inputId: string = 'input'
): ValidationResult {
  if (!content || content.trim() === '') {
    return {
      isValid: false,
      parsed: null,
      errors: [
        {
          inputId,
          line: 1,
          column: 1,
          message: 'Input is empty',
          severity: 'error',
        },
      ],
    };
  }

  try {
    const parsed = JSON.parse(content);
    return {
      isValid: true,
      parsed,
      errors: [],
    };
  } catch (error) {
    const errorInfo = parseJSONError(error, content, inputId);
    return {
      isValid: false,
      parsed: null,
      errors: [errorInfo],
    };
  }
}

/**
 * Parse JSON error to get line and column information
 */
function parseJSONError(
  error: unknown,
  content: string,
  inputId: string
): ValidationError {
  const message = error instanceof Error ? error.message : 'Invalid JSON';
  
  // Try to extract position from error message
  // Common formats:
  // - "Unexpected token X in JSON at position N"
  // - "JSON.parse: expected X at line Y column Z"
  
  let line = 1;
  let column = 1;
  
  // Try to get position from error message
  const positionMatch = message.match(/at position (\d+)/);
  const lineColMatch = message.match(/line (\d+) column (\d+)/);
  
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    column = parseInt(lineColMatch[2], 10);
  } else if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    const { line: l, column: c } = positionToLineColumn(content, position);
    line = l;
    column = c;
  }
  
  // Clean up error message
  const cleanMessage = message
    .replace(/^JSON\.parse:\s*/i, '')
    .replace(/at position \d+/i, '')
    .replace(/line \d+ column \d+/i, '')
    .trim();
  
  return {
    inputId,
    line,
    column,
    message: cleanMessage || 'Invalid JSON syntax',
    severity: 'error',
  };
}

/**
 * Convert character position to line and column
 */
function positionToLineColumn(
  content: string,
  position: number
): { line: number; column: number } {
  let line = 1;
  let column = 1;
  
  for (let i = 0; i < position && i < content.length; i++) {
    if (content[i] === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  
  return { line, column };
}

/**
 * Validate all inputs and return combined results
 */
export function validateAllInputs(
  inputs: { id: string; content: string }[]
): {
  allValid: boolean;
  results: Map<string, ValidationResult>;
  errors: ValidationError[];
} {
  const results = new Map<string, ValidationResult>();
  const allErrors: ValidationError[] = [];
  let allValid = true;
  
  for (const input of inputs) {
    const result = validateJSON(input.content, input.id);
    results.set(input.id, result);
    
    if (!result.isValid) {
      allValid = false;
      allErrors.push(...result.errors);
    }
  }
  
  return {
    allValid,
    results,
    errors: allErrors,
  };
}

/**
 * Quick check if string is valid JSON (without parsing fully)
 */
export function isValidJSON(content: string): boolean {
  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get detailed syntax suggestions based on error type
 */
export function getSyntaxSuggestion(errorMessage: string): string {
  const message = errorMessage.toLowerCase();
  
  if (message.includes('unexpected token') || message.includes('expected')) {
    if (message.includes(',')) {
      return 'Check for missing or extra commas between properties';
    }
    if (message.includes(':')) {
      return 'Check for missing colons between keys and values';
    }
    if (message.includes('}') || message.includes('{')) {
      return 'Check for mismatched curly braces';
    }
    if (message.includes(']') || message.includes('[')) {
      return 'Check for mismatched square brackets';
    }
  }
  
  if (message.includes('end of input') || message.includes('eof')) {
    return 'JSON appears incomplete. Check for missing closing brackets or braces';
  }
  
  if (message.includes('property name') || message.includes('key')) {
    return 'Object keys must be quoted with double quotes';
  }
  
  if (message.includes('string')) {
    return 'Strings must use double quotes, not single quotes';
  }
  
  if (message.includes('trailing comma')) {
    return 'Remove trailing commas after the last property or element';
  }
  
  return 'Check JSON syntax. Common issues: missing quotes, commas, or brackets';
}
