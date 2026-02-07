/**
 * JSON Encoder - Input Validation
 */

export interface ValidationResult {
  isValid: boolean;
  isJSON: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  message: string;
  type: 'size' | 'encoding' | 'content';
}

/**
 * Validate input for encoding
 * Note: Encoder accepts any string, but provides info about JSON validity
 */
export function validateInput(input: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let isJSON = false;
  
  if (!input.trim()) {
    return {
      isValid: false,
      isJSON: false,
      errors: [{ line: 1, column: 1, message: 'Input is empty', severity: 'error' }],
      warnings: [],
    };
  }
  
  // Check if it's valid JSON
  try {
    JSON.parse(input);
    isJSON = true;
  } catch {
    // Not valid JSON - that's okay for encoding, just note it
    isJSON = false;
  }
  
  // Size warnings
  const byteSize = new TextEncoder().encode(input).length;
  if (byteSize > 10 * 1024 * 1024) { // 10MB
    warnings.push({
      message: 'Input is very large (>10MB). Encoding may be slow.',
      type: 'size',
    });
  } else if (byteSize > 1024 * 1024) { // 1MB
    warnings.push({
      message: 'Input is large (>1MB). Consider processing in chunks for better performance.',
      type: 'size',
    });
  }
  
  // Check for potentially problematic content
  if (input.includes('\0')) {
    warnings.push({
      message: 'Input contains null bytes which may cause issues in some contexts.',
      type: 'content',
    });
  }
  
  // Check for already-encoded content
  if (/%[0-9A-Fa-f]{2}/.test(input)) {
    warnings.push({
      message: 'Input appears to already contain URL-encoded content. Double encoding may occur.',
      type: 'encoding',
    });
  }
  
  if (/^[A-Za-z0-9+/]+=*$/.test(input) && input.length > 20) {
    warnings.push({
      message: 'Input may already be Base64 encoded. Consider decoding first.',
      type: 'encoding',
    });
  }
  
  return {
    isValid: true,
    isJSON,
    errors,
    warnings,
  };
}

/**
 * Get line and column from position in string
 */
export function getLineAndColumn(input: string, position: number): { line: number; column: number } {
  const lines = input.substring(0, position).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

/**
 * Format file size for display
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
