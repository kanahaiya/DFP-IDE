/**
 * JSON Decoder - Input/Output Validation
 */

export interface ValidationResult {
  isValid: boolean;
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
 * Validate input for decoding
 */
export function validateInput(input: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  if (!input.trim()) {
    return {
      isValid: false,
      errors: [{ line: 1, column: 1, message: 'Input is empty', severity: 'error' }],
      warnings: [],
    };
  }
  
  // Size warnings
  const byteSize = new TextEncoder().encode(input).length;
  if (byteSize > 10 * 1024 * 1024) {
    warnings.push({
      message: 'Input is very large (>10MB). Decoding may be slow.',
      type: 'size',
    });
  } else if (byteSize > 1024 * 1024) {
    warnings.push({
      message: 'Input is large (>1MB). Consider processing in chunks.',
      type: 'size',
    });
  }
  
  // Check for potentially corrupted Base64
  if (/^[A-Za-z0-9+/=_-]+$/.test(input.trim())) {
    const length = input.replace(/=+$/, '').length;
    if (length % 4 === 1) {
      warnings.push({
        message: 'Base64 string may be corrupted (invalid length).',
        type: 'encoding',
      });
    }
  }
  
  // Check for incomplete hex
  const cleanedHex = input.replace(/0x|\\x|[:\s]/gi, '');
  if (/^[0-9A-Fa-f]+$/.test(cleanedHex) && cleanedHex.length % 2 !== 0) {
    warnings.push({
      message: 'Hex string has odd length (may be incomplete).',
      type: 'encoding',
    });
  }
  
  // Check for incomplete URL encoding
  if (/%[0-9A-Fa-f]?$/i.test(input) || /%[^0-9A-Fa-f]/i.test(input)) {
    warnings.push({
      message: 'URL encoding may be incomplete or malformed.',
      type: 'encoding',
    });
  }
  
  return {
    isValid: true,
    errors,
    warnings,
  };
}

/**
 * Validate decoded output
 */
export function validateOutput(output: string): {
  isValidJSON: boolean;
  jsonError?: string;
} {
  try {
    JSON.parse(output);
    return { isValidJSON: true };
  } catch (e) {
    return {
      isValidJSON: false,
      jsonError: e instanceof Error ? e.message : 'Invalid JSON',
    };
  }
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
