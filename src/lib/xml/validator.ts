/**
 * XML and JSON Validation Utilities
 * 
 * Provides validation functions for JSON input and XML output.
 */

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate JSON string and return detailed error information
 */
export function validateJSON(input: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!input || !input.trim()) {
    return { isValid: true, errors: [], warnings: [] };
  }

  try {
    JSON.parse(input);
    
    // Check for potential issues (warnings)
    const lines = input.split('\n');
    
    // Check for trailing commas (common JSON error)
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.match(/,\s*[}\]]\s*$/)) {
        warnings.push({
          line: index + 1,
          column: line.indexOf(',') + 1,
          message: 'Trailing comma detected (may cause issues in strict parsers)',
          severity: 'warning',
        });
      }
    });

    // Check for very deep nesting
    let depth = 0;
    let maxDepth = 0;
    for (const char of input) {
      if (char === '{' || char === '[') {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
      } else if (char === '}' || char === ']') {
        depth--;
      }
    }
    
    if (maxDepth > 20) {
      warnings.push({
        line: 1,
        column: 1,
        message: `Deep nesting detected (${maxDepth} levels). This may affect XML readability.`,
        severity: 'warning',
      });
    }

    // Check for very large arrays
    const parsed = JSON.parse(input);
    checkLargeArrays(parsed, warnings);

    return { isValid: true, errors, warnings };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON';
    
    // Try to extract line/column from error message
    const posMatch = message.match(/position (\d+)/i);
    let line = 1;
    let column = 1;
    
    if (posMatch) {
      const position = parseInt(posMatch[1], 10);
      const lines = input.substring(0, position).split('\n');
      line = lines.length;
      column = (lines[lines.length - 1]?.length || 0) + 1;
    }

    errors.push({
      line,
      column,
      message: formatErrorMessage(message),
      severity: 'error',
    });

    return { isValid: false, errors, warnings };
  }
}

/**
 * Check for large arrays that may cause performance issues
 */
function checkLargeArrays(obj: unknown, warnings: ValidationError[], path: string = ''): void {
  if (Array.isArray(obj)) {
    if (obj.length > 1000) {
      warnings.push({
        line: 1,
        column: 1,
        message: `Large array detected at ${path || 'root'} (${obj.length} items). Conversion may be slow.`,
        severity: 'warning',
      });
    }
    obj.forEach((item, index) => {
      checkLargeArrays(item, warnings, `${path}[${index}]`);
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      checkLargeArrays(value, warnings, path ? `${path}.${key}` : key);
    });
  }
}

/**
 * Format error message for display
 */
function formatErrorMessage(message: string): string {
  // Make error messages more user-friendly
  if (message.includes('Unexpected token')) {
    return message.replace(/Unexpected token (\S+)/, 'Unexpected character "$1"');
  }
  if (message.includes('Unexpected end of JSON')) {
    return 'Incomplete JSON - check for missing closing brackets or quotes';
  }
  if (message.includes('Expected')) {
    return message;
  }
  return message;
}

/**
 * Validate XML string (basic validation)
 */
export function validateXML(input: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!input || !input.trim()) {
    return { isValid: true, errors: [], warnings: [] };
  }

  // Check for basic XML structure
  const trimmed = input.trim();
  
  // Check XML declaration
  if (trimmed.startsWith('<?xml')) {
    const declEnd = trimmed.indexOf('?>');
    if (declEnd === -1) {
      errors.push({
        line: 1,
        column: 1,
        message: 'Invalid XML declaration - missing closing "?>"',
        severity: 'error',
      });
    }
  }

  // Check for balanced tags (basic check)
  const tagStack: string[] = [];
  const tagRegex = /<\/?([a-zA-Z_][\w\-.:]*)[^>]*\/?>/g;
  let match;
  const lines = input.split('\n');
  
  while ((match = tagRegex.exec(input)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    
    // Calculate line number
    const beforeMatch = input.substring(0, match.index);
    const lineNumber = beforeMatch.split('\n').length;
    const lineStart = beforeMatch.lastIndexOf('\n') + 1;
    const column = match.index - lineStart + 1;
    
    if (fullTag.startsWith('</')) {
      // Closing tag
      const expected = tagStack.pop();
      if (expected !== tagName) {
        errors.push({
          line: lineNumber,
          column,
          message: expected 
            ? `Mismatched tag: expected </${expected}>, found </${tagName}>`
            : `Unexpected closing tag: </${tagName}>`,
          severity: 'error',
        });
      }
    } else if (!fullTag.endsWith('/>')) {
      // Opening tag (not self-closing)
      tagStack.push(tagName);
    }
  }

  // Check for unclosed tags
  if (tagStack.length > 0) {
    errors.push({
      line: lines.length,
      column: 1,
      message: `Unclosed tags: ${tagStack.map(t => `<${t}>`).join(', ')}`,
      severity: 'error',
    });
  }

  // Check for common issues (warnings)
  if (input.includes(']]>') && !input.includes('<![CDATA[')) {
    const pos = input.indexOf(']]>');
    const beforePos = input.substring(0, pos);
    const lineNumber = beforePos.split('\n').length;
    
    warnings.push({
      line: lineNumber,
      column: 1,
      message: 'Found "]]>" outside of CDATA section - this may cause parsing issues',
      severity: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get character and line count statistics
 */
export function getTextStats(text: string): {
  characters: number;
  lines: number;
  words: number;
  size: string;
} {
  const characters = text.length;
  const lines = text ? text.split('\n').length : 0;
  const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  
  const bytes = new TextEncoder().encode(text).length;
  let size: string;
  
  if (bytes < 1024) {
    size = `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    size = `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    size = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return { characters, lines, words, size };
}
