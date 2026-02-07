/**
 * JSON Unescaper Validator
 * Validates input and detects escape level
 */

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  isEscaped: boolean;
  escapeLevel: number;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Check if string is valid JSON
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
 * Detect escape sequences in string
 */
function hasEscapeSequences(input: string): boolean {
  return /\\["\\\/bfnrt]|\\u[0-9a-fA-F]{4}/.test(input);
}

/**
 * Detect escape level of input
 */
function detectEscapeLevel(input: string): number {
  let level = 0;
  let current = input.trim();
  
  while (level < 10) {
    // Check if it's a quoted string
    if ((current.startsWith('"') && current.endsWith('"'))) {
      try {
        const parsed = JSON.parse(current);
        if (typeof parsed === 'string') {
          level++;
          current = parsed;
          continue;
        }
      } catch {
        // Check for escape patterns even if not valid JSON string
        if (hasEscapeSequences(current)) {
          level++;
          // Manual unescape for detection
          current = current.slice(1, -1)
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t');
          continue;
        }
      }
    }
    // Check for unquoted escaped patterns
    else if (hasEscapeSequences(current)) {
      level++;
      current = current
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t');
      continue;
    }
    
    break;
  }
  
  return level;
}

/**
 * Get line and column from position
 */
function getLineColumn(input: string, position: number): { line: number; column: number } {
  const lines = input.substring(0, position).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

/**
 * Validate input for unescaping
 */
export function validateInput(input: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  if (!input || !input.trim()) {
    return {
      isValid: false,
      isEscaped: false,
      escapeLevel: 0,
      errors: [{ line: 1, column: 1, message: 'Input is empty', severity: 'error' }],
      warnings: [],
    };
  }
  
  const trimmed = input.trim();
  
  // Check if already valid JSON (might not need unescaping)
  if (isValidJSON(trimmed)) {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed !== 'string') {
      warnings.push({
        line: 1,
        column: 1,
        message: 'Input is already valid JSON. It may not need unescaping.',
        severity: 'warning',
      });
    }
  }
  
  // Detect escape level
  const escapeLevel = detectEscapeLevel(trimmed);
  const isEscaped = escapeLevel > 0 || hasEscapeSequences(trimmed);
  
  if (!isEscaped) {
    warnings.push({
      line: 1,
      column: 1,
      message: 'Input does not appear to contain escape sequences.',
      severity: 'warning',
    });
  }
  
  if (escapeLevel > 3) {
    warnings.push({
      line: 1,
      column: 1,
      message: `Input has ${escapeLevel} levels of escaping. Consider using Multi-Layer mode.`,
      severity: 'warning',
    });
  }
  
  // Check for invalid escape sequences
  const invalidEscapes = trimmed.match(/\\[^"\\/bfnrtu]/g);
  if (invalidEscapes) {
    const firstInvalid = trimmed.indexOf(invalidEscapes[0]);
    const { line, column } = getLineColumn(trimmed, firstInvalid);
    warnings.push({
      line,
      column,
      message: `Found potentially invalid escape sequence: ${invalidEscapes[0]}`,
      severity: 'warning',
    });
  }
  
  // Check for incomplete Unicode escapes
  const incompleteUnicode = trimmed.match(/\\u(?![0-9a-fA-F]{4})/g);
  if (incompleteUnicode) {
    const firstIncomplete = trimmed.indexOf(incompleteUnicode[0]);
    const { line, column } = getLineColumn(trimmed, firstIncomplete);
    errors.push({
      line,
      column,
      message: 'Incomplete Unicode escape sequence',
      severity: 'error',
    });
  }
  
  return {
    isValid: errors.length === 0,
    isEscaped,
    escapeLevel,
    errors,
    warnings,
  };
}

/**
 * Validate output after unescaping
 */
export function validateOutput(output: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  if (!output) {
    return {
      isValid: false,
      isEscaped: false,
      escapeLevel: 0,
      errors: [{ line: 1, column: 1, message: 'Output is empty', severity: 'error' }],
      warnings: [],
    };
  }
  
  // Check if output is valid JSON
  const isJSON = isValidJSON(output);
  
  if (!isJSON) {
    warnings.push({
      line: 1,
      column: 1,
      message: 'Output is not valid JSON',
      severity: 'warning',
    });
  }
  
  // Check if still has escape sequences (might need more unescaping)
  const stillEscaped = hasEscapeSequences(output);
  if (stillEscaped) {
    warnings.push({
      line: 1,
      column: 1,
      message: 'Output still contains escape sequences. Consider unescaping again.',
      severity: 'warning',
    });
  }
  
  return {
    isValid: true,
    isEscaped: stillEscaped,
    escapeLevel: stillEscaped ? detectEscapeLevel(output) : 0,
    errors,
    warnings,
  };
}
