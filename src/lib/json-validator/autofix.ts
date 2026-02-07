/**
 * JSON Auto-Fix
 * Automatically fix common JSON errors
 */

import type { AutoFixResult, AutoFixChange, ValidatorSettings } from './types';
import { DEFAULT_VALIDATOR_SETTINGS } from './types';

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
 * Fix single quotes to double quotes
 */
function fixSingleQuotes(input: string, changes: AutoFixChange[]): string {
  
  // Simple approach: replace all single quotes with double quotes
  // This is a simplified fix and may not handle all edge cases
  const lines = input.split('\n');
  const newLines: string[] = [];
  
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    let inDoubleQuote = false;
    let newLine = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const prevChar = i > 0 ? line[i - 1] : '';
      
      if (char === '"' && prevChar !== '\\') {
        inDoubleQuote = !inDoubleQuote;
        newLine += char;
      } else if (char === "'" && !inDoubleQuote && prevChar !== '\\') {
        newLine += '"';
        changes.push({
          line: lineIdx + 1,
          column: i + 1,
          type: 'single_quote',
          description: 'Replaced single quote with double quote',
          before: "'",
          after: '"',
        });
      } else {
        newLine += char;
      }
    }
    
    newLines.push(newLine);
  }
  
  return newLines.join('\n');
}

/**
 * Fix trailing commas
 */
function fixTrailingCommas(input: string, changes: AutoFixChange[]): string {
  const regex = /,(\s*[}\]])/g;
  let result = input;
  let match;
  let offset = 0;
  
  while ((match = regex.exec(input)) !== null) {
    const pos = match.index - offset;
    const loc = getLineColumn(input, match.index);
    
    changes.push({
      line: loc.line,
      column: loc.column,
      type: 'trailing_comma',
      description: 'Removed trailing comma',
      before: `,${match[1]}`,
      after: match[1],
    });
    
    result = result.substring(0, pos) + match[1] + result.substring(pos + match[0].length);
    offset += 1; // Removed one character (the comma)
  }
  
  return result;
}

/**
 * Remove comments
 */
function removeComments(input: string, changes: AutoFixChange[]): string {
  let result = input;
  
  // Remove single-line comments (// ...)
  const singleLineRegex = /\/\/[^\n]*/g;
  let match;
  
  while ((match = singleLineRegex.exec(input)) !== null) {
    const loc = getLineColumn(input, match.index);
    changes.push({
      line: loc.line,
      column: loc.column,
      type: 'comment',
      description: 'Removed single-line comment',
      before: match[0],
      after: '',
    });
  }
  result = result.replace(singleLineRegex, '');
  
  // Remove multi-line comments (/* ... */)
  const multiLineRegex = /\/\*[\s\S]*?\*\//g;
  while ((match = multiLineRegex.exec(result)) !== null) {
    const loc = getLineColumn(result, match.index);
    changes.push({
      line: loc.line,
      column: loc.column,
      type: 'comment',
      description: 'Removed multi-line comment',
      before: match[0].substring(0, 30) + (match[0].length > 30 ? '...' : ''),
      after: '',
    });
  }
  result = result.replace(multiLineRegex, '');
  
  return result;
}

/**
 * Fix unquoted keys
 */
function fixUnquotedKeys(input: string, changes: AutoFixChange[]): string {
  // Match unquoted keys: word followed by colon, not inside quotes
  const regex = /(?<=[\{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=:)/g;
  let result = input;
  let match;
  
  const matches: Array<{ index: number; key: string }> = [];
  while ((match = regex.exec(input)) !== null) {
    matches.push({ index: match.index, key: match[1] });
  }
  
  // Process in reverse order to maintain positions
  for (let i = matches.length - 1; i >= 0; i--) {
    const { index, key } = matches[i];
    const loc = getLineColumn(input, index);
    
    changes.push({
      line: loc.line,
      column: loc.column,
      type: 'unquoted_key',
      description: `Added quotes around key "${key}"`,
      before: key,
      after: `"${key}"`,
    });
    
    result = result.substring(0, index) + `"${key}"` + result.substring(index + key.length);
  }
  
  return result;
}

/**
 * Fix JavaScript-style values (undefined, NaN, Infinity)
 */
function fixJavaScriptValues(input: string, changes: AutoFixChange[]): string {
  let result = input;
  
  // Replace undefined with null
  const undefinedRegex = /:\s*undefined\b/g;
  result = result.replace(undefinedRegex, (match, offset) => {
    const loc = getLineColumn(input, offset);
    changes.push({
      line: loc.line,
      column: loc.column,
      type: 'syntax',
      description: 'Replaced undefined with null',
      before: 'undefined',
      after: 'null',
    });
    return ': null';
  });
  
  // Replace NaN with null
  const nanRegex = /:\s*NaN\b/g;
  result = result.replace(nanRegex, (match, offset) => {
    const loc = getLineColumn(input, offset);
    changes.push({
      line: loc.line,
      column: loc.column,
      type: 'syntax',
      description: 'Replaced NaN with null',
      before: 'NaN',
      after: 'null',
    });
    return ': null';
  });
  
  // Replace Infinity with null
  const infinityRegex = /:\s*(-)?Infinity\b/g;
  result = result.replace(infinityRegex, (match, negative, offset) => {
    const loc = getLineColumn(input, offset);
    changes.push({
      line: loc.line,
      column: loc.column,
      type: 'syntax',
      description: `Replaced ${negative ? '-' : ''}Infinity with null`,
      before: `${negative || ''}Infinity`,
      after: 'null',
    });
    return ': null';
  });
  
  return result;
}

/**
 * Main auto-fix function
 */
export function autoFixJSON(
  input: string,
  settings: Partial<ValidatorSettings> = {}
): AutoFixResult {
  const config: ValidatorSettings = { ...DEFAULT_VALIDATOR_SETTINGS, ...settings };
  const changes: AutoFixChange[] = [];
  let fixed = input;
  
  // Apply fixes in order
  fixed = removeComments(fixed, changes);
  fixed = fixSingleQuotes(fixed, changes);
  fixed = fixUnquotedKeys(fixed, changes);
  fixed = fixTrailingCommas(fixed, changes);
  fixed = fixJavaScriptValues(fixed, changes);
  
  // Clean up empty lines created by removing comments
  fixed = fixed.replace(/^\s*[\r\n]/gm, '');
  
  // Try to format the result
  let success = false;
  let remainingErrors = 0;
  
  try {
    const parsed = JSON.parse(fixed);
    const indent = config.indentation === 'tab' ? '\t' : config.indentation;
    fixed = JSON.stringify(parsed, null, indent);
    success = true;
  } catch {
    // Count remaining errors by trying to identify issues
    remainingErrors = 1; // At least one error remains
  }
  
  return {
    fixed,
    changes,
    success,
    remainingErrors,
  };
}

/**
 * Preview fixes without applying (returns what would change)
 */
export function previewFixes(input: string): AutoFixChange[] {
  const changes: AutoFixChange[] = [];
  const temp = input;
  
  // Detect what would be fixed
  removeComments(temp, changes);
  fixSingleQuotes(temp, changes);
  fixUnquotedKeys(temp, changes);
  fixTrailingCommas(temp, changes);
  fixJavaScriptValues(temp, changes);
  
  return changes;
}
