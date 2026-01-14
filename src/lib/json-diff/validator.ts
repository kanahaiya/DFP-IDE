/**
 * JSON validation utilities for diff tool
 */

export interface ValidationError {
  line: number;
  column: number;
  message: string;
}

/**
 * Validate JSON string
 * @param jsonString - JSON string to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateJSON(jsonString: string): ValidationError[] {
  if (!jsonString || !jsonString.trim()) {
    return [];
  }

  try {
    JSON.parse(jsonString);
    return [];
  } catch (error: any) {
    const errors: ValidationError[] = [];
    
    // Try to extract line and column information from error message
    const message = error.message || 'Invalid JSON';
    
    // Try to find position in error message
    const positionMatch = message.match(/position (\d+)/i);
    if (positionMatch) {
      const position = parseInt(positionMatch[1], 10);
      const { line, column } = getLineAndColumn(jsonString, position);
      errors.push({ line, column, message });
    } else {
      // Default to line 1, column 1 if we can't parse the position
      errors.push({ line: 1, column: 1, message });
    }
    
    return errors;
  }
}

/**
 * Get line and column from string position
 * @param text - Text to analyze
 * @param position - Character position
 * @returns Line and column numbers (1-indexed)
 */
function getLineAndColumn(text: string, position: number): { line: number; column: number } {
  const lines = text.substring(0, position).split('\n');
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}

/**
 * Format JSON with validation
 * @param jsonString - JSON string to format
 * @param indentSize - Number of spaces for indentation
 * @returns Formatted JSON string or null if invalid
 */
export function formatJSON(jsonString: string, indentSize: number = 2): string | null {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, indentSize);
  } catch {
    return null;
  }
}

/**
 * Check if string is valid JSON
 * @param jsonString - String to check
 * @returns True if valid JSON
 */
export function isValidJSON(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}
