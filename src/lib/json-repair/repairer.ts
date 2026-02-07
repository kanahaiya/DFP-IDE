/**
 * JSON Repair Engine
 * Automatic repair of common JSON syntax errors
 */

import { jsonrepair } from 'jsonrepair';
import type {
  RepairResult,
  RepairSettings,
  RepairOperation,
  RepairOperationType,
  RepairConfidence,
} from './types';
import { DEFAULT_REPAIR_SETTINGS, OPERATION_SEVERITY, OPERATION_DESCRIPTIONS } from './types';

/**
 * Detect what type of repair operations were performed by comparing input and output
 */
function detectRepairOperations(input: string, output: string): RepairOperation[] {
  const operations: RepairOperation[] = [];
  
  // Check for single quote to double quote conversion
  const singleQuotePattern = /'([^'\\]|\\.)*'/g;
  const inputSingleQuotes = (input.match(singleQuotePattern) || []).length;
  if (inputSingleQuotes > 0 && !output.includes("'")) {
    operations.push({
      type: 'quote_fix',
      severity: OPERATION_SEVERITY.quote_fix,
      description: `Converted ${inputSingleQuotes} single quote(s) to double quotes`,
    });
  }
  
  // Check for curly quote conversion
  const curlyQuotePattern = /[""'']/g;
  const inputCurlyQuotes = (input.match(curlyQuotePattern) || []).length;
  if (inputCurlyQuotes > 0 && !(output.match(curlyQuotePattern) || []).length) {
    operations.push({
      type: 'quote_fix',
      severity: OPERATION_SEVERITY.quote_fix,
      description: `Converted ${inputCurlyQuotes} curly quote(s) to straight quotes`,
    });
  }
  
  // Check for trailing comma removal
  const trailingCommaPattern = /,\s*[}\]]/g;
  const inputTrailingCommas = (input.match(trailingCommaPattern) || []).length;
  const outputTrailingCommas = (output.match(trailingCommaPattern) || []).length;
  if (inputTrailingCommas > outputTrailingCommas) {
    operations.push({
      type: 'trailing_comma',
      severity: OPERATION_SEVERITY.trailing_comma,
      description: `Removed ${inputTrailingCommas - outputTrailingCommas} trailing comma(s)`,
    });
  }
  
  // Check for boolean fixes (True/TRUE -> true, False/FALSE -> false)
  const wrongBoolPattern = /\b(True|TRUE|False|FALSE)\b/g;
  const inputWrongBools = (input.match(wrongBoolPattern) || []).length;
  if (inputWrongBools > 0) {
    operations.push({
      type: 'boolean_fix',
      severity: OPERATION_SEVERITY.boolean_fix,
      description: `Fixed ${inputWrongBools} boolean value(s) capitalization`,
    });
  }
  
  // Check for null fixes (NULL/None -> null)
  const wrongNullPattern = /\b(NULL|None|Null)\b/g;
  const inputWrongNulls = (input.match(wrongNullPattern) || []).length;
  if (inputWrongNulls > 0) {
    operations.push({
      type: 'null_fix',
      severity: OPERATION_SEVERITY.null_fix,
      description: `Fixed ${inputWrongNulls} null value(s) capitalization`,
    });
  }
  
  // Check for undefined conversion
  const undefinedPattern = /\bundefined\b/g;
  const inputUndefined = (input.match(undefinedPattern) || []).length;
  if (inputUndefined > 0 && !(output.match(undefinedPattern) || []).length) {
    operations.push({
      type: 'undefined_fix',
      severity: OPERATION_SEVERITY.undefined_fix,
      description: `Converted ${inputUndefined} undefined value(s) to null`,
    });
  }
  
  // Check for NaN conversion
  const nanPattern = /\bNaN\b/g;
  const inputNaN = (input.match(nanPattern) || []).length;
  if (inputNaN > 0 && !(output.match(nanPattern) || []).length) {
    operations.push({
      type: 'nan_fix',
      severity: OPERATION_SEVERITY.nan_fix,
      description: `Converted ${inputNaN} NaN value(s) to null`,
    });
  }
  
  // Check for Infinity conversion
  const infinityPattern = /\b-?Infinity\b/g;
  const inputInfinity = (input.match(infinityPattern) || []).length;
  if (inputInfinity > 0 && !(output.match(infinityPattern) || []).length) {
    operations.push({
      type: 'infinity_fix',
      severity: OPERATION_SEVERITY.infinity_fix,
      description: `Converted ${inputInfinity} Infinity value(s) to null`,
    });
  }
  
  // Check for JavaScript comment removal
  const singleLineCommentPattern = /\/\/.*/g;
  const multiLineCommentPattern = /\/\*[\s\S]*?\*\//g;
  const inputComments = 
    (input.match(singleLineCommentPattern) || []).length +
    (input.match(multiLineCommentPattern) || []).length;
  if (inputComments > 0) {
    const outputComments = 
      (output.match(singleLineCommentPattern) || []).length +
      (output.match(multiLineCommentPattern) || []).length;
    if (outputComments < inputComments) {
      operations.push({
        type: 'comment_removal',
        severity: OPERATION_SEVERITY.comment_removal,
        description: `Removed ${inputComments - outputComments} JavaScript comment(s)`,
      });
    }
  }
  
  // Check for JSONP unwrapping
  const jsonpPattern = /^\s*[\w$]+\s*\(/;
  if (jsonpPattern.test(input) && !jsonpPattern.test(output)) {
    operations.push({
      type: 'jsonp_unwrap',
      severity: OPERATION_SEVERITY.jsonp_unwrap,
      description: 'Unwrapped JSONP callback function',
    });
  }
  
  // Check for MongoDB type conversion
  const mongoTypePattern = /(?:ObjectId|NumberLong|NumberInt|NumberDecimal|ISODate|Timestamp|BinData)\s*\(/g;
  const inputMongoTypes = (input.match(mongoTypePattern) || []).length;
  if (inputMongoTypes > 0 && !(output.match(mongoTypePattern) || []).length) {
    operations.push({
      type: 'mongodb_fix',
      severity: OPERATION_SEVERITY.mongodb_fix,
      description: `Converted ${inputMongoTypes} MongoDB extended JSON type(s)`,
    });
  }
  
  // Check for string concatenation
  const stringConcatPattern = /"\s*\+\s*"/g;
  const inputConcats = (input.match(stringConcatPattern) || []).length;
  if (inputConcats > 0 && !(output.match(stringConcatPattern) || []).length) {
    operations.push({
      type: 'string_concat',
      severity: OPERATION_SEVERITY.string_concat,
      description: `Merged ${inputConcats} concatenated string(s)`,
    });
  }
  
  // Check for unquoted keys (rough detection)
  const unquotedKeyPattern = /[{,]\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g;
  const inputUnquotedKeys = [...input.matchAll(unquotedKeyPattern)].filter(m => {
    // Make sure it's not already in quotes
    const beforeMatch = input.slice(0, m.index);
    const lastQuote = Math.max(beforeMatch.lastIndexOf('"'), beforeMatch.lastIndexOf("'"));
    const lastColon = beforeMatch.lastIndexOf(':');
    return lastQuote < lastColon || lastQuote === -1;
  }).length;
  
  if (inputUnquotedKeys > 0) {
    operations.push({
      type: 'missing_quote',
      severity: OPERATION_SEVERITY.missing_quote,
      description: `Added quotes to ${inputUnquotedKeys} unquoted key(s)`,
    });
  }
  
  // If output differs but we couldn't detect specific operations, add generic fix
  if (operations.length === 0 && input.trim() !== output.trim()) {
    operations.push({
      type: 'other',
      severity: OPERATION_SEVERITY.other,
      description: OPERATION_DESCRIPTIONS.other,
    });
  }
  
  return operations;
}

/**
 * Determine confidence level based on repair operations
 */
function calculateConfidence(operations: RepairOperation[]): RepairConfidence {
  if (operations.length === 0) return 'high';
  
  const hassCritical = operations.some(op => op.severity === 'critical');
  const highCount = operations.filter(op => op.severity === 'high').length;
  
  if (hassCritical || highCount > 3) return 'low';
  if (highCount > 1) return 'medium';
  return 'high';
}

/**
 * Count operations by type
 */
function countOperations(operations: RepairOperation[]): Record<RepairOperationType, number> {
  const counts: Record<RepairOperationType, number> = {
    quote_fix: 0,
    missing_quote: 0,
    trailing_comma: 0,
    missing_comma: 0,
    missing_colon: 0,
    bracket_fix: 0,
    boolean_fix: 0,
    null_fix: 0,
    comment_removal: 0,
    jsonp_unwrap: 0,
    mongodb_fix: 0,
    escape_fix: 0,
    string_concat: 0,
    whitespace_fix: 0,
    undefined_fix: 0,
    nan_fix: 0,
    infinity_fix: 0,
    other: 0,
  };
  
  for (const op of operations) {
    counts[op.type]++;
  }
  
  return counts;
}

/**
 * Pre-process input before using jsonrepair library
 */
function preProcess(input: string, settings: RepairSettings): string {
  let processed = input;
  
  // Handle JSONP if enabled
  if (settings.unwrapJSONP) {
    // Match JSONP pattern: callback(JSON) or callback({...})
    const jsonpMatch = processed.match(/^\s*[\w$]+\s*\(\s*([\s\S]*)\s*\)\s*;?\s*$/);
    if (jsonpMatch) {
      processed = jsonpMatch[1];
    }
  }
  
  // Handle MongoDB types if enabled
  if (settings.fixMongoDB) {
    // ObjectId("...") -> "..."
    processed = processed.replace(/ObjectId\s*\(\s*["']([^"']+)["']\s*\)/g, '"$1"');
    // NumberLong(...) -> number
    processed = processed.replace(/NumberLong\s*\(\s*(\d+)\s*\)/g, '$1');
    processed = processed.replace(/NumberInt\s*\(\s*(\d+)\s*\)/g, '$1');
    processed = processed.replace(/NumberDecimal\s*\(\s*["']?([^"')]+)["']?\s*\)/g, '$1');
    // ISODate("...") -> "..."
    processed = processed.replace(/ISODate\s*\(\s*["']([^"']+)["']\s*\)/g, '"$1"');
    // Timestamp(...) -> number
    processed = processed.replace(/Timestamp\s*\(\s*(\d+)\s*,\s*\d+\s*\)/g, '$1');
    // BinData(...) -> "..."
    processed = processed.replace(/BinData\s*\(\s*\d+\s*,\s*["']([^"']+)["']\s*\)/g, '"$1"');
  }
  
  // Handle undefined if enabled
  if (settings.fixUndefined) {
    processed = processed.replace(/\bundefined\b/g, 'null');
  }
  
  // Handle NaN if enabled
  if (settings.fixNaN) {
    processed = processed.replace(/\bNaN\b/g, 'null');
  }
  
  // Handle Infinity if enabled
  if (settings.fixInfinity) {
    processed = processed.replace(/\b-?Infinity\b/g, 'null');
  }
  
  return processed;
}

/**
 * Main repair function
 */
export function repairJSON(
  input: string,
  settings: RepairSettings = DEFAULT_REPAIR_SETTINGS
): RepairResult {
  const startTime = performance.now();
  
  // Handle empty input
  if (!input || !input.trim()) {
    return {
      success: false,
      input,
      output: '',
      isValid: false,
      operations: [],
      operationCounts: countOperations([]),
      totalFixes: 0,
      repairTime: performance.now() - startTime,
      error: 'Input is empty',
      confidence: 'high',
    };
  }
  
  try {
    // Pre-process input
    const preprocessed = preProcess(input, settings);
    
    // Use jsonrepair library for main repair
    let repaired = jsonrepair(preprocessed);
    
    // Post-process: format output if enabled
    if (settings.formatOutput) {
      try {
        const parsed = JSON.parse(repaired);
        const indent = settings.indentation === 'tab' ? '\t' : settings.indentation;
        repaired = JSON.stringify(parsed, null, indent);
      } catch {
        // If parsing fails, return as-is
      }
    }
    
    // Validate the result
    let isValid = false;
    try {
      JSON.parse(repaired);
      isValid = true;
    } catch {
      isValid = false;
    }
    
    // Detect what operations were performed
    const operations = detectRepairOperations(input, repaired);
    const operationCounts = countOperations(operations);
    const confidence = calculateConfidence(operations);
    
    return {
      success: true,
      input,
      output: repaired,
      isValid,
      operations,
      operationCounts,
      totalFixes: operations.length,
      repairTime: performance.now() - startTime,
      confidence,
    };
  } catch (error) {
    return {
      success: false,
      input,
      output: input,
      isValid: false,
      operations: [],
      operationCounts: countOperations([]),
      totalFixes: 0,
      repairTime: performance.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown repair error',
      confidence: 'low',
    };
  }
}

/**
 * Quick check if JSON needs repair
 */
export function needsRepair(input: string): boolean {
  if (!input || !input.trim()) return false;
  
  try {
    JSON.parse(input);
    return false; // Valid JSON, no repair needed
  } catch {
    return true; // Invalid JSON, needs repair
  }
}

/**
 * Get repair preview without applying
 */
export function previewRepair(input: string): { willRepair: boolean; estimatedFixes: string[] } {
  const estimatedFixes: string[] = [];
  
  // Check for common issues
  if (/'[^']*'/.test(input)) {
    estimatedFixes.push('Convert single quotes to double quotes');
  }
  
  if (/[""'']/.test(input)) {
    estimatedFixes.push('Convert curly quotes to straight quotes');
  }
  
  if (/,\s*[}\]]/.test(input)) {
    estimatedFixes.push('Remove trailing commas');
  }
  
  if (/\b(True|TRUE|False|FALSE)\b/.test(input)) {
    estimatedFixes.push('Fix boolean capitalization');
  }
  
  if (/\b(NULL|None|Null)\b/.test(input)) {
    estimatedFixes.push('Fix null capitalization');
  }
  
  if (/\/\/|\/\*/.test(input)) {
    estimatedFixes.push('Remove JavaScript comments');
  }
  
  if (/^\s*[\w$]+\s*\(/.test(input)) {
    estimatedFixes.push('Unwrap JSONP callback');
  }
  
  if (/(?:ObjectId|NumberLong|ISODate)\s*\(/.test(input)) {
    estimatedFixes.push('Convert MongoDB types');
  }
  
  if (/\bundefined\b/.test(input)) {
    estimatedFixes.push('Convert undefined to null');
  }
  
  if (/\bNaN\b/.test(input)) {
    estimatedFixes.push('Convert NaN to null');
  }
  
  if (/\b-?Infinity\b/.test(input)) {
    estimatedFixes.push('Convert Infinity to null');
  }
  
  return {
    willRepair: estimatedFixes.length > 0 || needsRepair(input),
    estimatedFixes,
  };
}
