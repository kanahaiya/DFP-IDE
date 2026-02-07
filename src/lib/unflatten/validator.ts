/**
 * Unflatten Input Validator
 * Validates flattened JSON input and provides helpful error messages
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
    keyCount: number;
    hasArrayNotation: boolean;
    hasDotNotation: boolean;
    hasUnderscoreNotation: boolean;
    potentialDepth: number;
  };
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
 * Analyze flat keys to detect notation patterns
 */
function analyzeKeys(keys: string[]): {
  hasArrayNotation: boolean;
  hasDotNotation: boolean;
  hasUnderscoreNotation: boolean;
  potentialDepth: number;
} {
  let hasArrayNotation = false;
  let hasDotNotation = false;
  let hasUnderscoreNotation = false;
  let maxDepth = 0;
  
  for (const key of keys) {
    // Check for bracket notation [0], [1], etc.
    if (/\[\d+\]/.test(key) || /\[[^\]]+\]/.test(key)) {
      hasArrayNotation = true;
    }
    
    // Remove bracket content for other checks
    const withoutBrackets = key.replace(/\[[^\]]*\]/g, '');
    
    // Check for dot notation
    if (withoutBrackets.includes('.')) {
      hasDotNotation = true;
    }
    
    // Check for underscore notation (but not single underscores in names)
    // Look for pattern like word_word
    if (/\w+_\w+/.test(withoutBrackets)) {
      hasUnderscoreNotation = true;
    }
    
    // Calculate potential depth
    const parts = key.split(/[.\[\]]+/).filter(Boolean);
    maxDepth = Math.max(maxDepth, parts.length);
  }
  
  return {
    hasArrayNotation,
    hasDotNotation,
    hasUnderscoreNotation,
    potentialDepth: maxDepth,
  };
}

/**
 * Check for potential issues
 */
function checkWarnings(parsed: Record<string, unknown>): ValidationError[] {
  const warnings: ValidationError[] = [];
  const keys = Object.keys(parsed);
  
  // Check for large number of keys
  if (keys.length > 1000) {
    warnings.push({
      line: 1,
      column: 1,
      message: `Large input with ${keys.length} keys. Processing may take longer.`,
      type: 'structure',
      severity: 'warning',
    });
  }
  
  // Check for potential conflicts
  const prefixes = new Set<string>();
  for (const key of keys) {
    const parts = key.split(/[.\[\]]+/).filter(Boolean);
    let prefix = '';
    for (let i = 0; i < parts.length - 1; i++) {
      prefix = prefix ? `${prefix}.${parts[i]}` : parts[i];
      if (keys.includes(prefix)) {
        warnings.push({
          line: 1,
          column: 1,
          message: `Potential key conflict: "${prefix}" is both a value and a prefix of other keys.`,
          type: 'structure',
          severity: 'warning',
        });
        break;
      }
      prefixes.add(prefix);
    }
  }
  
  // Check for mixed notation
  const analysis = analyzeKeys(keys);
  if (analysis.hasDotNotation && analysis.hasUnderscoreNotation) {
    warnings.push({
      line: 1,
      column: 1,
      message: 'Input uses both dot and underscore notation. Results may be unexpected.',
      type: 'structure',
      severity: 'warning',
    });
  }
  
  // Check for very deep nesting
  if (analysis.potentialDepth > 20) {
    warnings.push({
      line: 1,
      column: 1,
      message: `Very deep nesting detected (${analysis.potentialDepth} levels). This may indicate incorrect delimiter detection.`,
      type: 'structure',
      severity: 'warning',
    });
  }
  
  return warnings;
}

/**
 * Validate input for unflattening
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
  
  // Check if input is a flat object
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      isValid: false,
      errors: [{
        line: 1,
        column: 1,
        message: 'Input must be a flat JSON object (not an array or primitive)',
        type: 'structure',
        severity: 'error',
      }],
      warnings: [],
    };
  }
  
  const keys = Object.keys(parsed);
  const values = Object.values(parsed);
  
  // Check if it's already nested (has object/array values)
  const hasNestedValues = values.some(
    v => typeof v === 'object' && v !== null && !Array.isArray(v)
  );
  
  const analysis = analyzeKeys(keys);
  const warnings = checkWarnings(parsed as Record<string, unknown>);
  
  if (hasNestedValues && !analysis.hasDotNotation && !analysis.hasArrayNotation && !analysis.hasUnderscoreNotation) {
    warnings.push({
      line: 1,
      column: 1,
      message: 'Input appears to be already nested. Unflattening may not produce expected results.',
      type: 'structure',
      severity: 'warning',
    });
  }
  
  return {
    isValid: true,
    errors: [],
    warnings,
    stats: {
      keyCount: keys.length,
      ...analysis,
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
  
  if (typeof parsed !== 'object' || parsed === null) {
    return {
      isValid: false,
      errors: [{
        line: 1,
        column: 1,
        message: 'Output is not a valid JSON object',
        type: 'structure',
        severity: 'error',
      }],
      warnings: [],
    };
  }
  
  return {
    isValid: true,
    errors: [],
    warnings: [],
  };
}

/**
 * Check if input looks like flattened JSON
 */
export function isFlattened(input: string): boolean {
  try {
    const parsed = JSON.parse(input);
    
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return false;
    }
    
    const keys = Object.keys(parsed);
    const values = Object.values(parsed);
    
    // Check if all values are primitives
    const allPrimitive = values.every(
      v => typeof v !== 'object' || v === null
    );
    
    if (!allPrimitive) return false;
    
    // Check if keys contain separators
    const analysis = analyzeKeys(keys);
    return analysis.hasDotNotation || analysis.hasArrayNotation || analysis.hasUnderscoreNotation;
  } catch {
    return false;
  }
}
