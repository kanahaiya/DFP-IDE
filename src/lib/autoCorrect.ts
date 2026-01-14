/**
 * Auto-correct and format utility for JSON
 * Uses jsonrepair library - industry-standard JSON repair tool
 * that handles 50+ edge cases and syntax errors
 */

import { jsonrepair } from 'jsonrepair';

export interface AutoCorrectResult {
  success: boolean;
  output: string;
  error?: string;
}

/**
 * Auto-correct and format JSON input using jsonrepair library
 * Handles extensive edge cases including:
 * - Missing quotes around keys
 * - Trailing commas
 * - Single quotes to double quotes
 * - Missing commas between elements
 * - Comments in JSON
 * - Unbalanced brackets/braces
 * - JavaScript object notation
 * - And many more edge cases
 */
export function autoCorrectJSON(input: string): AutoCorrectResult {
  if (!input.trim()) {
    return { success: false, error: 'Input is empty', output: input };
  }

  try {
    // First, try to parse as-is
    const parsed = JSON.parse(input);
    // If successful, just prettify
    return {
      success: true,
      output: JSON.stringify(parsed, null, 2),
    };
  } catch {
    // Use jsonrepair library to fix the JSON
    try {
      const repaired = jsonrepair(input);
      // Parse the repaired JSON to validate it
      const parsed = JSON.parse(repaired);
      // Return prettified version
      return {
        success: true,
        output: JSON.stringify(parsed, null, 2),
      };
    } catch (repairError) {
      return {
        success: false,
        error: repairError instanceof Error ? repairError.message : 'Could not fix JSON syntax',
        output: input,
      };
    }
  }
}

