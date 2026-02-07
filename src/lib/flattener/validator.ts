/**
 * Flattener Input Validator
 * Validates JSON input and provides helpful error messages
 */

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'structure';
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  stats?: {
    depth: number;
    keyCount: number;
    arrayCount: number;
    hasCircularRisk: boolean;
  };
}

/**
 * Calculate the depth of a JSON structure
 */
function calculateDepth(obj: unknown, currentDepth: number = 0): number {
  if (typeof obj !== 'object' || obj === null) {
    return currentDepth;
  }
  
  let maxDepth = currentDepth;
  const values = Array.isArray(obj) ? obj : Object.values(obj);
  
  for (const value of values) {
    const depth = calculateDepth(value, currentDepth + 1);
    maxDepth = Math.max(maxDepth, depth);
  }
  
  return maxDepth;
}

/**
 * Count total keys in a nested object
 */
function countKeys(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) {
    return 0;
  }
  
  let count = 0;
  const stack: unknown[] = [obj];
  
  while (stack.length > 0) {
    const current = stack.pop();
    if (typeof current === 'object' && current !== null) {
      if (!Array.isArray(current)) {
        count += Object.keys(current).length;
      }
      const values = Array.isArray(current) ? current : Object.values(current);
      stack.push(...values);
    }
  }
  
  return count;
}

/**
 * Count arrays in a nested object
 */
function countArrays(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) {
    return 0;
  }
  
  let count = 0;
  const stack: unknown[] = [obj];
  
  while (stack.length > 0) {
    const current = stack.pop();
    if (Array.isArray(current)) {
      count++;
      stack.push(...current);
    } else if (typeof current === 'object' && current !== null) {
      stack.push(...Object.values(current));
    }
  }
  
  return count;
}

/**
 * Parse JSON with detailed error reporting
 */
function parseJSONWithErrors(input: string): { parsed: unknown; error?: ValidationError } {
  try {
    const parsed = JSON.parse(input);
    return { parsed };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid JSON';
    
    // Try to extract line and column from error message
    let line = 1;
    let column = 1;
    
    const positionMatch = message.match(/position\s+(\d+)/i);
    if (positionMatch) {
      const position = parseInt(positionMatch[1], 10);
      // Calculate line and column from position
      const lines = input.substring(0, position).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }
    
    const lineMatch = message.match(/line\s+(\d+)/i);
    const columnMatch = message.match(/column\s+(\d+)/i);
    if (lineMatch) line = parseInt(lineMatch[1], 10);
    if (columnMatch) column = parseInt(columnMatch[1], 10);
    
    return {
      parsed: undefined,
      error: {
        line,
        column,
        message: `JSON syntax error: ${message}`,
        type: 'syntax',
        severity: 'error',
      },
    };
  }
}

/**
 * Check for potential issues that won't cause errors but might be unexpected
 */
function checkWarnings(parsed: unknown): ValidationError[] {
  const warnings: ValidationError[] = [];
  
  // Check for very deep nesting
  const depth = calculateDepth(parsed);
  if (depth > 20) {
    warnings.push({
      line: 1,
      column: 1,
      message: `Very deep nesting detected (${depth} levels). This may cause performance issues.`,
      type: 'structure',
      severity: 'warning',
    });
  }
  
  // Check for large number of keys
  const keyCount = countKeys(parsed);
  if (keyCount > 1000) {
    warnings.push({
      line: 1,
      column: 1,
      message: `Large object with ${keyCount} keys. Output may be very long.`,
      type: 'structure',
      severity: 'warning',
    });
  }
  
  // Check for empty input
  if (typeof parsed === 'object' && parsed !== null) {
    const isEmpty = Array.isArray(parsed) 
      ? parsed.length === 0 
      : Object.keys(parsed).length === 0;
    
    if (isEmpty) {
      warnings.push({
        line: 1,
        column: 1,
        message: 'Input is an empty object or array.',
        type: 'structure',
        severity: 'warning',
      });
    }
  }
  
  return warnings;
}

/**
 * Validate input for flattening
 */
export function validateInput(input: string): ValidationResult {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      errors: [{
        line: 1,
        column: 1,
        message: 'Input is empty',
        type: 'syntax',
        severity: 'error',
      }],
      warnings: [],
    };
  }
  
  const { parsed, error } = parseJSONWithErrors(input);
  
  if (error) {
    return {
      isValid: false,
      errors: [error],
      warnings: [],
    };
  }
  
  // Check if input is an object or array
  if (typeof parsed !== 'object' || parsed === null) {
    return {
      isValid: false,
      errors: [{
        line: 1,
        column: 1,
        message: 'Input must be a JSON object or array, not a primitive value',
        type: 'structure',
        severity: 'error',
      }],
      warnings: [],
    };
  }
  
  const warnings = checkWarnings(parsed);
  const depth = calculateDepth(parsed);
  const keyCount = countKeys(parsed);
  const arrayCount = countArrays(parsed);
  
  return {
    isValid: true,
    errors: [],
    warnings,
    stats: {
      depth,
      keyCount,
      arrayCount,
      hasCircularRisk: false, // JSON.parse handles this
    },
  };
}

/**
 * Validate output JSON
 */
export function validateOutput(output: string): ValidationResult {
  if (!output || !output.trim()) {
    return {
      isValid: false,
      errors: [{
        line: 1,
        column: 1,
        message: 'Output is empty',
        type: 'syntax',
        severity: 'error',
      }],
      warnings: [],
    };
  }
  
  const { parsed, error } = parseJSONWithErrors(output);
  
  if (error) {
    return {
      isValid: false,
      errors: [error],
      warnings: [],
    };
  }
  
  // Output should be a flat object
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      isValid: true,
      errors: [],
      warnings: [{
        line: 1,
        column: 1,
        message: 'Output is not a flat object',
        type: 'structure',
        severity: 'warning',
      }],
    };
  }
  
  return {
    isValid: true,
    errors: [],
    warnings: [],
  };
}

/**
 * Check if input looks like already flattened JSON
 */
export function isAlreadyFlattened(input: string): boolean {
  try {
    const parsed = JSON.parse(input);
    
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return false;
    }
    
    // Check if all values are primitives (flat structure)
    const values = Object.values(parsed);
    const allPrimitive = values.every(
      v => typeof v !== 'object' || v === null
    );
    
    // Check if keys contain separators (dot, bracket, underscore patterns)
    const keys = Object.keys(parsed);
    const hasSeparators = keys.some(
      k => k.includes('.') || k.includes('[') || k.includes('_')
    );
    
    return allPrimitive && hasSeparators && keys.length > 1;
  } catch {
    return false;
  }
}
