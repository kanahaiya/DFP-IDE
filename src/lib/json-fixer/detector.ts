/**
 * JSON Fixer Error Detector
 * Detects ALL JSON syntax errors with detailed information
 */

import type {
  ErrorItem,
  DetectionResult,
  ErrorType,
  ErrorCategory,
  ErrorSeverity,
  FixSuggestion,
} from './types';
import { ERROR_TYPE_INFO } from './types';
import { getErrorExplanation } from './explanations';

let errorIdCounter = 0;

function generateErrorId(): string {
  return `err-${++errorIdCounter}-${Date.now()}`;
}

function createFixSuggestion(
  description: string,
  original: string,
  replacement: string,
  startOffset: number,
  endOffset: number,
  confidence: 'high' | 'medium' | 'low' = 'high'
): FixSuggestion {
  return {
    id: `fix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    description,
    preview: replacement,
    original,
    replacement,
    startOffset,
    endOffset,
    confidence,
  };
}

function getLineColumn(input: string, offset: number): { line: number; column: number } {
  const lines = input.substring(0, offset).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

function getContext(input: string, offset: number, contextLength = 30): string {
  const start = Math.max(0, offset - contextLength);
  const end = Math.min(input.length, offset + contextLength);
  let context = input.substring(start, end);
  
  if (start > 0) context = '...' + context;
  if (end < input.length) context = context + '...';
  
  return context.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
}

function createError(
  type: ErrorType,
  message: string,
  input: string,
  offset: number,
  length: number = 1,
  suggestions: FixSuggestion[] = []
): ErrorItem {
  const info = ERROR_TYPE_INFO[type];
  const { line, column } = getLineColumn(input, offset);
  
  return {
    id: generateErrorId(),
    type,
    category: info.category,
    severity: info.severity,
    message,
    line,
    column,
    offset,
    length,
    context: getContext(input, offset),
    explanation: getErrorExplanation(type),
    fixable: suggestions.length > 0,
    suggestions,
  };
}

/**
 * Detect single quote usage
 */
function detectSingleQuotes(input: string): ErrorItem[] {
  const errors: ErrorItem[] = [];
  const regex = /'([^'\\]|\\.)*'/g;
  let match;
  
  while ((match = regex.exec(input)) !== null) {
    const original = match[0];
    const replacement = '"' + original.slice(1, -1) + '"';
    
    errors.push(createError(
      'single_quote',
      'Single quotes are not valid in JSON. Use double quotes instead.',
      input,
      match.index,
      original.length,
      [createFixSuggestion(
        'Replace single quotes with double quotes',
        original,
        replacement,
        match.index,
        match.index + original.length
      )]
    ));
  }
  
  return errors;
}

/**
 * Detect curly/smart quotes
 */
function detectCurlyQuotes(input: string): ErrorItem[] {
  const errors: ErrorItem[] = [];
  const curlyQuotes = ['\u201C', '\u201D', '\u2018', '\u2019'];
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (curlyQuotes.includes(char)) {
      const replacement = char === '\u2018' || char === '\u2019' ? "'" : '"';
      errors.push(createError(
        'curly_quote',
        `Curly quote "${char}" is not valid JSON. Use straight quotes.`,
        input,
        i,
        1,
        [createFixSuggestion(
          'Replace with straight quote',
          char,
          replacement,
          i,
          i + 1
        )]
      ));
    }
  }
  
  return errors;
}

/**
 * Detect trailing commas
 */
function detectTrailingCommas(input: string): ErrorItem[] {
  const errors: ErrorItem[] = [];
  const regex = /,\s*([}\]])/g;
  let match;
  
  while ((match = regex.exec(input)) !== null) {
    const commaIndex = match.index;
    const closingIndex = commaIndex + match[0].length - 1;
    
    errors.push(createError(
      'trailing_comma',
      `Trailing comma before "${match[1]}" is not allowed in JSON.`,
      input,
      commaIndex,
      1,
      [createFixSuggestion(
        'Remove trailing comma',
        match[0],
        match[0].slice(1), // Remove the comma
        commaIndex,
        closingIndex
      )]
    ));
  }
  
  return errors;
}

/**
 * Detect invalid boolean values (True, FALSE, etc.)
 */
function detectInvalidBooleans(input: string): ErrorItem[] {
  const errors: ErrorItem[] = [];
  const regex = /\b(True|TRUE|False|FALSE)\b/g;
  let match;
  
  while ((match = regex.exec(input)) !== null) {
    const original = match[0];
    const replacement = original.toLowerCase();
    
    errors.push(createError(
      'invalid_boolean',
      `"${original}" is not valid JSON. Boolean values must be lowercase.`,
      input,
      match.index,
      original.length,
      [createFixSuggestion(
        `Replace with "${replacement}"`,
        original,
        replacement,
        match.index,
        match.index + original.length
      )]
    ));
  }
  
  return errors;
}

/**
 * Detect invalid null values (NULL, None, etc.)
 */
function detectInvalidNulls(input: string): ErrorItem[] {
  const errors: ErrorItem[] = [];
  const regex = /\b(NULL|None|Null)\b/g;
  let match;
  
  while ((match = regex.exec(input)) !== null) {
    const original = match[0];
    
    errors.push(createError(
      'invalid_null',
      `"${original}" is not valid JSON. Use lowercase "null".`,
      input,
      match.index,
      original.length,
      [createFixSuggestion(
        'Replace with "null"',
        original,
        'null',
        match.index,
        match.index + original.length
      )]
    ));
  }
  
  return errors;
}

/**
 * Detect undefined values
 */
function detectUndefined(input: string): ErrorItem[] {
  const errors: ErrorItem[] = [];
  const regex = /\bundefined\b/g;
  let match;
  
  while ((match = regex.exec(input)) !== null) {
    errors.push(createError(
      'undefined_value',
      '"undefined" is not a valid JSON value. Use "null" instead.',
      input,
      match.index,
      9,
      [createFixSuggestion(
        'Replace with "null"',
        'undefined',
        'null',
        match.index,
        match.index + 9
      )]
    ));
  }
  
  return errors;
}

/**
 * Detect NaN values
 */
function detectNaN(input: string): ErrorItem[] {
  const errors: ErrorItem[] = [];
  const regex = /\bNaN\b/g;
  let match;
  
  while ((match = regex.exec(input)) !== null) {
    errors.push(createError(
      'nan_value',
      'NaN is not a valid JSON value. Consider using null or a string representation.',
      input,
      match.index,
      3,
      [
        createFixSuggestion('Replace with null', 'NaN', 'null', match.index, match.index + 3),
        createFixSuggestion('Replace with string "NaN"', 'NaN', '"NaN"', match.index, match.index + 3, 'medium'),
      ]
    ));
  }
  
  return errors;
}

/**
 * Detect Infinity values
 */
function detectInfinity(input: string): ErrorItem[] {
  const errors: ErrorItem[] = [];
  const regex = /\b(-?Infinity)\b/g;
  let match;
  
  while ((match = regex.exec(input)) !== null) {
    const original = match[0];
    errors.push(createError(
      'infinity_value',
      `${original} is not a valid JSON value. Consider using null or a string.`,
      input,
      match.index,
      original.length,
      [
        createFixSuggestion('Replace with null', original, 'null', match.index, match.index + original.length),
        createFixSuggestion(`Replace with string "${original}"`, original, `"${original}"`, match.index, match.index + original.length, 'medium'),
      ]
    ));
  }
  
  return errors;
}

/**
 * Detect JavaScript comments
 */
function detectComments(input: string): ErrorItem[] {
  const errors: ErrorItem[] = [];
  
  // Single-line comments
  const singleLineRegex = /\/\/.*$/gm;
  let match;
  
  while ((match = singleLineRegex.exec(input)) !== null) {
    errors.push(createError(
      'comment',
      'JavaScript-style comments are not allowed in JSON.',
      input,
      match.index,
      match[0].length,
      [createFixSuggestion(
        'Remove comment',
        match[0],
        '',
        match.index,
        match.index + match[0].length
      )]
    ));
  }
  
  // Multi-line comments
  const multiLineRegex = /\/\*[\s\S]*?\*\//g;
  
  while ((match = multiLineRegex.exec(input)) !== null) {
    errors.push(createError(
      'comment',
      'Block comments are not allowed in JSON.',
      input,
      match.index,
      match[0].length,
      [createFixSuggestion(
        'Remove comment',
        match[0],
        '',
        match.index,
        match.index + match[0].length
      )]
    ));
  }
  
  return errors;
}

/**
 * Detect unquoted keys (JavaScript object style)
 */
function detectUnquotedKeys(input: string): ErrorItem[] {
  const errors: ErrorItem[] = [];
  // Match unquoted keys: word followed by colon (but not after : or ,)
  const regex = /(?<=[{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g;
  let match;
  
  while ((match = regex.exec(input)) !== null) {
    const key = match[1];
    const keyStart = match.index;
    
    // Skip if already in quotes
    const beforeKey = input.substring(Math.max(0, keyStart - 1), keyStart);
    if (beforeKey === '"' || beforeKey === "'") continue;
    
    errors.push(createError(
      'unquoted_key',
      `Object key "${key}" must be quoted in JSON.`,
      input,
      keyStart,
      key.length,
      [createFixSuggestion(
        'Add double quotes',
        key,
        `"${key}"`,
        keyStart,
        keyStart + key.length
      )]
    ));
  }
  
  return errors;
}

/**
 * Check bracket/brace balance
 */
function detectBracketErrors(input: string): ErrorItem[] {
  const errors: ErrorItem[] = [];
  const stack: { char: string; index: number }[] = [];
  let inString = false;
  let escapeNext = false;
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\' && inString) {
      escapeNext = true;
      continue;
    }
    
    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }
    
    if (inString) continue;
    
    if (char === '{' || char === '[') {
      stack.push({ char, index: i });
    } else if (char === '}' || char === ']') {
      const expected = char === '}' ? '{' : '[';
      
      if (stack.length === 0) {
        errors.push(createError(
          char === '}' ? 'extra_brace' : 'extra_bracket',
          `Unexpected "${char}" - no matching opening bracket.`,
          input,
          i,
          1,
          [createFixSuggestion('Remove extra bracket', char, '', i, i + 1, 'medium')]
        ));
      } else {
        const top = stack[stack.length - 1];
        if (top.char !== expected) {
          errors.push(createError(
            char === '}' ? 'unclosed_bracket' : 'unclosed_brace',
            `Mismatched brackets: expected "${expected === '{' ? '}' : ']'}" but found "${char}".`,
            input,
            i,
            1,
            [createFixSuggestion(
              `Replace with "${expected === '{' ? '}' : ']'}"`,
              char,
              expected === '{' ? '}' : ']',
              i,
              i + 1,
              'medium'
            )]
          ));
        }
        stack.pop();
      }
    }
  }
  
  // Report unclosed brackets
  for (const unclosed of stack) {
    const expected = unclosed.char === '{' ? '}' : ']';
    errors.push(createError(
      unclosed.char === '{' ? 'unclosed_brace' : 'unclosed_bracket',
      `Unclosed "${unclosed.char}" - missing "${expected}".`,
      input,
      unclosed.index,
      1,
      [createFixSuggestion(
        `Add "${expected}" at end`,
        '',
        expected,
        input.length,
        input.length,
        'medium'
      )]
    ));
  }
  
  return errors;
}

/**
 * Detect errors from native JSON.parse
 */
function detectNativeParseError(input: string): ErrorItem[] {
  try {
    JSON.parse(input);
    return [];
  } catch (e) {
    if (e instanceof SyntaxError) {
      // Parse the error message to extract position
      const posMatch = e.message.match(/position (\d+)/i);
      const lineMatch = e.message.match(/line (\d+)/i);
      const columnMatch = e.message.match(/column (\d+)/i);
      
      let offset = 0;
      if (posMatch) {
        offset = parseInt(posMatch[1], 10);
      }
      
      const { line, column } = lineMatch && columnMatch
        ? { line: parseInt(lineMatch[1], 10), column: parseInt(columnMatch[1], 10) }
        : getLineColumn(input, offset);
      
      // Determine error type from message
      let type: ErrorType = 'unknown';
      if (e.message.includes('Unexpected end')) {
        type = 'unexpected_end';
      } else if (e.message.includes('Unexpected token')) {
        type = 'unexpected_token';
      }
      
      const error: ErrorItem = {
        id: generateErrorId(),
        type,
        category: ERROR_TYPE_INFO[type].category,
        severity: 'critical',
        message: e.message,
        line,
        column,
        offset,
        length: 1,
        context: getContext(input, offset),
        explanation: getErrorExplanation(type),
        fixable: false,
        suggestions: [],
      };
      
      return [error];
    }
    return [];
  }
}

/**
 * Main detection function - detects ALL errors
 */
export function detectErrors(input: string): DetectionResult {
  const startTime = performance.now();
  
  if (!input.trim()) {
    return {
      errors: [],
      totalCount: 0,
      bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
      byCategory: { syntax: 0, structure: 0, value: 0, formatting: 0, encoding: 0, semantic: 0 },
      fixableCount: 0,
      detectionTime: performance.now() - startTime,
    };
  }
  
  // Collect all errors from different detectors
  const allErrors: ErrorItem[] = [
    ...detectSingleQuotes(input),
    ...detectCurlyQuotes(input),
    ...detectTrailingCommas(input),
    ...detectInvalidBooleans(input),
    ...detectInvalidNulls(input),
    ...detectUndefined(input),
    ...detectNaN(input),
    ...detectInfinity(input),
    ...detectComments(input),
    ...detectUnquotedKeys(input),
    ...detectBracketErrors(input),
  ];
  
  // If we found specific errors, don't add native parse error
  // (it would be redundant/confusing)
  if (allErrors.length === 0) {
    allErrors.push(...detectNativeParseError(input));
  }
  
  // Sort errors by position
  allErrors.sort((a, b) => a.offset - b.offset);
  
  // Calculate statistics
  const bySeverity: Record<ErrorSeverity, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  const byCategory: Record<ErrorCategory, number> = { syntax: 0, structure: 0, value: 0, formatting: 0, encoding: 0, semantic: 0 };
  let fixableCount = 0;
  
  for (const error of allErrors) {
    bySeverity[error.severity]++;
    byCategory[error.category]++;
    if (error.fixable) fixableCount++;
  }
  
  return {
    errors: allErrors,
    totalCount: allErrors.length,
    bySeverity,
    byCategory,
    fixableCount,
    detectionTime: performance.now() - startTime,
  };
}
