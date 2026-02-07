/**
 * JSON Fixer - Individual Fix Application
 * Apply individual fixes to JSON text
 */

import type { ErrorItem, FixSuggestion, FixResult } from './types';

/**
 * Apply a single fix to the input text
 */
export function applyFix(
  input: string,
  error: ErrorItem,
  suggestion: FixSuggestion
): FixResult {
  try {
    // Validate the suggestion
    if (suggestion.startOffset < 0 || suggestion.endOffset > input.length) {
      return {
        success: false,
        errorId: error.id,
        original: input,
        fixed: input,
        appliedFix: null,
      };
    }
    
    // Apply the fix
    const before = input.substring(0, suggestion.startOffset);
    const after = input.substring(suggestion.endOffset);
    const fixed = before + suggestion.replacement + after;
    
    return {
      success: true,
      errorId: error.id,
      original: input,
      fixed,
      appliedFix: suggestion,
    };
  } catch {
    return {
      success: false,
      errorId: error.id,
      original: input,
      fixed: input,
      appliedFix: null,
    };
  }
}

/**
 * Apply multiple fixes at once
 * Fixes are applied in reverse order to preserve offsets
 */
export function applyMultipleFixes(
  input: string,
  fixes: Array<{ error: ErrorItem; suggestion: FixSuggestion }>
): string {
  // Sort fixes by start offset in descending order
  const sortedFixes = [...fixes].sort(
    (a, b) => b.suggestion.startOffset - a.suggestion.startOffset
  );
  
  let result = input;
  
  for (const { suggestion } of sortedFixes) {
    const before = result.substring(0, suggestion.startOffset);
    const after = result.substring(suggestion.endOffset);
    result = before + suggestion.replacement + after;
  }
  
  return result;
}

/**
 * Generate preview of a fix
 */
export function generateFixPreview(
  input: string,
  suggestion: FixSuggestion,
  contextLines: number = 2
): { before: string; after: string; lineNumber: number } {
  // Find the line containing the fix
  const beforeFix = input.substring(0, suggestion.startOffset);
  const lines = beforeFix.split('\n');
  const lineNumber = lines.length;
  
  // Get context lines
  const allLines = input.split('\n');
  const startLine = Math.max(0, lineNumber - 1 - contextLines);
  const endLine = Math.min(allLines.length, lineNumber + contextLines);
  
  // Build before preview
  const beforeLines = allLines.slice(startLine, endLine);
  const before = beforeLines.join('\n');
  
  // Apply fix
  const fixedInput = 
    input.substring(0, suggestion.startOffset) + 
    suggestion.replacement + 
    input.substring(suggestion.endOffset);
  
  // Build after preview
  const afterAllLines = fixedInput.split('\n');
  const afterLines = afterAllLines.slice(startLine, Math.min(afterAllLines.length, endLine));
  const after = afterLines.join('\n');
  
  return { before, after, lineNumber };
}

/**
 * Get the best fix suggestion for an error
 * Returns the suggestion with highest confidence
 */
export function getBestFix(error: ErrorItem): FixSuggestion | null {
  if (!error.fixable || error.suggestions.length === 0) {
    return null;
  }
  
  // Sort by confidence (high > medium > low)
  const confidenceOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...error.suggestions].sort(
    (a, b) => confidenceOrder[a.confidence] - confidenceOrder[b.confidence]
  );
  
  return sorted[0];
}

/**
 * Auto-fix all errors with high confidence fixes
 */
export function autoFixHighConfidence(
  input: string,
  errors: ErrorItem[]
): { fixed: string; appliedCount: number; skippedCount: number } {
  const highConfidenceFixes: Array<{ error: ErrorItem; suggestion: FixSuggestion }> = [];
  let skippedCount = 0;
  
  for (const error of errors) {
    const bestFix = getBestFix(error);
    if (bestFix && bestFix.confidence === 'high') {
      highConfidenceFixes.push({ error, suggestion: bestFix });
    } else {
      skippedCount++;
    }
  }
  
  const fixed = applyMultipleFixes(input, highConfidenceFixes);
  
  return {
    fixed,
    appliedCount: highConfidenceFixes.length,
    skippedCount,
  };
}

/**
 * Validate that a fix can still be applied
 * (the original text at the offset matches)
 */
export function validateFix(input: string, suggestion: FixSuggestion): boolean {
  if (suggestion.startOffset < 0 || suggestion.endOffset > input.length) {
    return false;
  }
  
  const currentText = input.substring(suggestion.startOffset, suggestion.endOffset);
  return currentText === suggestion.original;
}

/**
 * Recalculate offsets for remaining errors after a fix is applied
 */
export function recalculateOffsets(
  errors: ErrorItem[],
  appliedFix: FixSuggestion
): ErrorItem[] {
  const offsetDelta = appliedFix.replacement.length - appliedFix.original.length;
  
  return errors.map(error => {
    // Errors before the fix position are unchanged
    if (error.offset < appliedFix.startOffset) {
      return error;
    }
    
    // Errors at or after the fix position need offset adjustment
    return {
      ...error,
      offset: error.offset + offsetDelta,
      suggestions: error.suggestions.map(s => ({
        ...s,
        startOffset: s.startOffset >= appliedFix.startOffset
          ? s.startOffset + offsetDelta
          : s.startOffset,
        endOffset: s.endOffset >= appliedFix.startOffset
          ? s.endOffset + offsetDelta
          : s.endOffset,
      })),
    };
  });
}
