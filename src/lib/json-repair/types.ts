/**
 * JSON Repair Type Definitions
 * Types for automatic JSON repair functionality
 */

// Repair operation types
export type RepairOperationType =
  | 'quote_fix'           // Fixed quote issues (single to double, curly to straight)
  | 'missing_quote'       // Added missing quotes to keys or values
  | 'trailing_comma'      // Removed trailing comma
  | 'missing_comma'       // Added missing comma
  | 'missing_colon'       // Added missing colon
  | 'bracket_fix'         // Fixed bracket/brace issues
  | 'boolean_fix'         // Fixed boolean capitalization (True -> true)
  | 'null_fix'            // Fixed null capitalization (NULL -> null)
  | 'comment_removal'     // Removed JavaScript comments
  | 'jsonp_unwrap'        // Unwrapped JSONP callback
  | 'mongodb_fix'         // Converted MongoDB types
  | 'escape_fix'          // Fixed escape sequences
  | 'string_concat'       // Merged concatenated strings
  | 'whitespace_fix'      // Fixed whitespace issues
  | 'undefined_fix'       // Converted undefined to null
  | 'nan_fix'             // Converted NaN to null
  | 'infinity_fix'        // Converted Infinity to null
  | 'other';              // Other repair operations

// Severity level for repair operations
export type RepairSeverity = 'critical' | 'high' | 'medium' | 'low';

// Individual repair operation
export interface RepairOperation {
  type: RepairOperationType;
  severity: RepairSeverity;
  line?: number;
  column?: number;
  description: string;
  original?: string;
  fixed?: string;
}

// Repair result
export interface RepairResult {
  success: boolean;
  input: string;
  output: string;
  isValid: boolean;
  operations: RepairOperation[];
  operationCounts: Record<RepairOperationType, number>;
  totalFixes: number;
  repairTime: number;
  error?: string;
  confidence: RepairConfidence;
}

// Repair confidence level
export type RepairConfidence = 'high' | 'medium' | 'low';

// Repair mode
export type RepairMode = 'strict' | 'standard' | 'lenient' | 'llm';

// Repair settings
export interface RepairSettings {
  mode: RepairMode;
  
  // Quote fixes
  fixSingleQuotes: boolean;
  fixCurlyQuotes: boolean;
  addMissingQuotes: boolean;
  
  // Punctuation fixes
  fixTrailingCommas: boolean;
  fixMissingCommas: boolean;
  fixMissingColons: boolean;
  
  // Bracket fixes
  fixBrackets: boolean;
  
  // Value fixes
  fixBooleans: boolean;
  fixNulls: boolean;
  fixUndefined: boolean;
  fixNaN: boolean;
  fixInfinity: boolean;
  
  // Cleanup
  removeComments: boolean;
  unwrapJSONP: boolean;
  fixMongoDB: boolean;
  fixEscapes: boolean;
  mergeStrings: boolean;
  
  // Output options
  formatOutput: boolean;
  indentation: number | 'tab';
}

// Default settings
export const DEFAULT_REPAIR_SETTINGS: RepairSettings = {
  mode: 'standard',
  
  // Quote fixes
  fixSingleQuotes: true,
  fixCurlyQuotes: true,
  addMissingQuotes: true,
  
  // Punctuation fixes
  fixTrailingCommas: true,
  fixMissingCommas: true,
  fixMissingColons: true,
  
  // Bracket fixes
  fixBrackets: true,
  
  // Value fixes
  fixBooleans: true,
  fixNulls: true,
  fixUndefined: true,
  fixNaN: true,
  fixInfinity: true,
  
  // Cleanup
  removeComments: true,
  unwrapJSONP: true,
  fixMongoDB: true,
  fixEscapes: true,
  mergeStrings: true,
  
  // Output options
  formatOutput: true,
  indentation: 2,
};

// Operation severity mapping
export const OPERATION_SEVERITY: Record<RepairOperationType, RepairSeverity> = {
  bracket_fix: 'critical',
  missing_quote: 'high',
  quote_fix: 'high',
  missing_colon: 'high',
  missing_comma: 'high',
  boolean_fix: 'medium',
  null_fix: 'medium',
  trailing_comma: 'medium',
  comment_removal: 'medium',
  jsonp_unwrap: 'medium',
  mongodb_fix: 'medium',
  undefined_fix: 'medium',
  nan_fix: 'medium',
  infinity_fix: 'medium',
  escape_fix: 'low',
  string_concat: 'low',
  whitespace_fix: 'low',
  other: 'low',
};

// Operation descriptions
export const OPERATION_DESCRIPTIONS: Record<RepairOperationType, string> = {
  quote_fix: 'Fixed quote characters (single to double, curly to straight)',
  missing_quote: 'Added missing quotes to key or value',
  trailing_comma: 'Removed trailing comma',
  missing_comma: 'Added missing comma between elements',
  missing_colon: 'Added missing colon after key',
  bracket_fix: 'Fixed bracket or brace mismatch',
  boolean_fix: 'Fixed boolean value capitalization',
  null_fix: 'Fixed null value capitalization',
  comment_removal: 'Removed JavaScript comment',
  jsonp_unwrap: 'Unwrapped JSONP callback function',
  mongodb_fix: 'Converted MongoDB extended JSON type',
  escape_fix: 'Fixed escape sequence',
  string_concat: 'Merged concatenated strings',
  whitespace_fix: 'Fixed whitespace issue',
  undefined_fix: 'Converted undefined to null',
  nan_fix: 'Converted NaN to null',
  infinity_fix: 'Converted Infinity to null',
  other: 'Applied miscellaneous repair',
};
