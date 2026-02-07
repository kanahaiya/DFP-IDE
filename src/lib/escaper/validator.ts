/**
 * JSON Escaper Validator
 * Validates input and detects if already escaped
 */

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  isJSON: boolean;
  isAlreadyEscaped: boolean;
  escapeLevel: number;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Check if input is valid JSON
 */
function isValidJSON(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect if string appears to be an escaped JSON string
 */
function detectEscapedString(input: string): { isEscaped: boolean; level: number } {
  const trimmed = input.trim();
  
  // Check if it's a quoted string that might be escaped JSON
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    
    // Count escape sequences
    const escapeCount = (trimmed.match(/\\["\\\/bfnrt]|\\u[0-9a-fA-F]{4}/g) || []).length;
    
    if (escapeCount > 0) {
      // Try to parse as JSON string to get the unescaped content
      try {
        const unquoted = JSON.parse(trimmed);
        if (typeof unquoted === 'string') {
          // Check if the unquoted content is valid JSON
          if (isValidJSON(unquoted)) {
            return { isEscaped: true, level: 1 };
          }
          // Check for deeper escaping
          const nested = detectEscapedString(unquoted);
          if (nested.isEscaped) {
            return { isEscaped: true, level: nested.level + 1 };
          }
        }
      } catch {
        // Not a valid JSON string
      }
    }
  }
  
  // Check for unquoted escaped patterns (double backslashes suggest escaping)
  if (/\\"/.test(trimmed) || /\\\\/.test(trimmed)) {
    return { isEscaped: true, level: 1 };
  }
  
  return { isEscaped: false, level: 0 };
}

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
 * Validate JSON input
 */
export function validateInput(input: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  if (!input || !input.trim()) {
    return {
      isValid: false,
      isJSON: false,
      isAlreadyEscaped: false,
      escapeLevel: 0,
      errors: [{ line: 1, column: 1, message: 'Input is empty', severity: 'error' }],
      warnings: [],
    };
  }
  
  const trimmed = input.trim();
  
  // Check if already escaped
  const { isEscaped, level } = detectEscapedString(trimmed);
  
  if (isEscaped) {
    warnings.push({
      line: 1,
      column: 1,
      message: `Input appears to be already escaped (level ${level}). Consider using the JSON Unescaper first.`,
      severity: 'warning',
    });
  }
  
  // Check if valid JSON
  const isJSON = isValidJSON(trimmed);
  
  if (!isJSON) {
    // Try to parse and get error details
    try {
      JSON.parse(trimmed);
    } catch (e) {
      const error = e as SyntaxError;
      const match = error.message.match(/position (\d+)/);
      const position = match ? parseInt(match[1], 10) : 0;
      const { line, column } = getLineColumn(trimmed, position);
      
      // Not an error for escaper - we can escape any text
      warnings.push({
        line,
        column,
        message: 'Input is not valid JSON. It will be escaped as a plain string.',
        severity: 'warning',
      });
    }
  }
  
  // Check for potential issues
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(trimmed)) {
    warnings.push({
      line: 1,
      column: 1,
      message: 'Input contains control characters that will be escaped',
      severity: 'warning',
    });
  }
  
  return {
    isValid: true, // Escaper can handle any input
    isJSON,
    isAlreadyEscaped: isEscaped,
    escapeLevel: level,
    errors,
    warnings,
  };
}

/**
 * Validate output (check if properly escaped)
 */
export function validateOutput(output: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  if (!output) {
    return {
      isValid: false,
      isJSON: false,
      isAlreadyEscaped: false,
      escapeLevel: 0,
      errors: [{ line: 1, column: 1, message: 'Output is empty', severity: 'error' }],
      warnings: [],
    };
  }
  
  // Check if output is a valid JSON string
  const isValidString = output.startsWith('"') && output.endsWith('"');
  
  if (isValidString) {
    try {
      JSON.parse(output);
    } catch {
      errors.push({
        line: 1,
        column: 1,
        message: 'Output is not a valid JSON string',
        severity: 'error',
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    isJSON: isValidString,
    isAlreadyEscaped: true,
    escapeLevel: 1,
    errors,
    warnings,
  };
}
