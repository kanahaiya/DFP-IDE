/**
 * JSON Fixer Type Definitions
 * Types for interactive JSON error detection and fixing
 */

// Error severity levels
export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';

// Error categories
export type ErrorCategory = 
  | 'syntax'      // Basic syntax errors (missing brackets, quotes)
  | 'structure'   // Structural issues (unclosed objects, arrays)
  | 'value'       // Value issues (invalid booleans, nulls)
  | 'formatting'  // Formatting issues (trailing commas, comments)
  | 'encoding'    // Encoding issues (invalid characters)
  | 'semantic';   // Semantic issues (duplicate keys)

// Error type identifiers
export type ErrorType =
  | 'missing_quote'
  | 'single_quote'
  | 'curly_quote'
  | 'unquoted_key'
  | 'unquoted_value'
  | 'missing_comma'
  | 'trailing_comma'
  | 'missing_colon'
  | 'unclosed_bracket'
  | 'unclosed_brace'
  | 'extra_bracket'
  | 'extra_brace'
  | 'invalid_boolean'
  | 'invalid_null'
  | 'invalid_value'
  | 'undefined_value'
  | 'nan_value'
  | 'infinity_value'
  | 'comment'
  | 'invalid_escape'
  | 'control_character'
  | 'duplicate_key'
  | 'unexpected_token'
  | 'unexpected_end'
  | 'unknown';

// Fix suggestion
export interface FixSuggestion {
  id: string;
  description: string;
  preview: string;
  original: string;
  replacement: string;
  startOffset: number;
  endOffset: number;
  confidence: 'high' | 'medium' | 'low';
}

// Individual error item
export interface ErrorItem {
  id: string;
  type: ErrorType;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  line: number;
  column: number;
  offset: number;
  length: number;
  context: string; // Surrounding code snippet
  explanation: string; // Educational explanation
  fixable: boolean;
  suggestions: FixSuggestion[];
}

// Detection result
export interface DetectionResult {
  errors: ErrorItem[];
  totalCount: number;
  bySeverity: Record<ErrorSeverity, number>;
  byCategory: Record<ErrorCategory, number>;
  fixableCount: number;
  detectionTime: number;
}

// Fix result
export interface FixResult {
  success: boolean;
  errorId: string;
  original: string;
  fixed: string;
  appliedFix: FixSuggestion | null;
}

// Fixer settings
export interface FixerSettings {
  // Detection options
  showSeverity: ErrorSeverity[];
  showCategories: ErrorCategory[];
  maxErrors: number;
  
  // Display options
  showExplanations: boolean;
  showContext: boolean;
  highlightErrors: boolean;
  
  // Auto-detection
  autoDetect: boolean;
  debounceMs: number;
}

// Default fixer settings
export const DEFAULT_FIXER_SETTINGS: FixerSettings = {
  showSeverity: ['critical', 'high', 'medium', 'low'],
  showCategories: ['syntax', 'structure', 'value', 'formatting', 'encoding', 'semantic'],
  maxErrors: 100,
  showExplanations: true,
  showContext: true,
  highlightErrors: true,
  autoDetect: true,
  debounceMs: 300,
};

// Error type metadata
export const ERROR_TYPE_INFO: Record<ErrorType, {
  severity: ErrorSeverity;
  category: ErrorCategory;
  title: string;
  icon: string;
}> = {
  missing_quote: { severity: 'high', category: 'syntax', title: 'Missing Quote', icon: 'fas fa-quote-right' },
  single_quote: { severity: 'high', category: 'syntax', title: 'Single Quote', icon: 'fas fa-quote-left' },
  curly_quote: { severity: 'medium', category: 'syntax', title: 'Curly Quote', icon: 'fas fa-text-width' },
  unquoted_key: { severity: 'high', category: 'syntax', title: 'Unquoted Key', icon: 'fas fa-key' },
  unquoted_value: { severity: 'high', category: 'syntax', title: 'Unquoted Value', icon: 'fas fa-font' },
  missing_comma: { severity: 'critical', category: 'syntax', title: 'Missing Comma', icon: 'fas fa-plus' },
  trailing_comma: { severity: 'medium', category: 'formatting', title: 'Trailing Comma', icon: 'fas fa-eraser' },
  missing_colon: { severity: 'critical', category: 'syntax', title: 'Missing Colon', icon: 'fas fa-grip-lines-vertical' },
  unclosed_bracket: { severity: 'critical', category: 'structure', title: 'Unclosed Bracket', icon: 'fas fa-brackets-curly' },
  unclosed_brace: { severity: 'critical', category: 'structure', title: 'Unclosed Brace', icon: 'fas fa-code' },
  extra_bracket: { severity: 'critical', category: 'structure', title: 'Extra Bracket', icon: 'fas fa-minus' },
  extra_brace: { severity: 'critical', category: 'structure', title: 'Extra Brace', icon: 'fas fa-minus' },
  invalid_boolean: { severity: 'medium', category: 'value', title: 'Invalid Boolean', icon: 'fas fa-toggle-on' },
  invalid_null: { severity: 'medium', category: 'value', title: 'Invalid Null', icon: 'fas fa-ban' },
  invalid_value: { severity: 'high', category: 'value', title: 'Invalid Value', icon: 'fas fa-exclamation-triangle' },
  undefined_value: { severity: 'medium', category: 'value', title: 'Undefined Value', icon: 'fas fa-question' },
  nan_value: { severity: 'medium', category: 'value', title: 'NaN Value', icon: 'fas fa-divide' },
  infinity_value: { severity: 'medium', category: 'value', title: 'Infinity Value', icon: 'fas fa-infinity' },
  comment: { severity: 'low', category: 'formatting', title: 'Comment', icon: 'fas fa-comment-slash' },
  invalid_escape: { severity: 'high', category: 'encoding', title: 'Invalid Escape', icon: 'fas fa-backspace' },
  control_character: { severity: 'high', category: 'encoding', title: 'Control Character', icon: 'fas fa-keyboard' },
  duplicate_key: { severity: 'low', category: 'semantic', title: 'Duplicate Key', icon: 'fas fa-clone' },
  unexpected_token: { severity: 'critical', category: 'syntax', title: 'Unexpected Token', icon: 'fas fa-exclamation' },
  unexpected_end: { severity: 'critical', category: 'structure', title: 'Unexpected End', icon: 'fas fa-ellipsis-h' },
  unknown: { severity: 'high', category: 'syntax', title: 'Unknown Error', icon: 'fas fa-question-circle' },
};
