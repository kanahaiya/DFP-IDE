/**
 * Type definitions for JSON Formatter tool
 */

// ============================================================================
// Mode Types
// ============================================================================

/**
 * View modes
 */
export type ViewMode = 'code' | 'tree' | 'split';

/**
 * Indentation options
 */
export type IndentationType = 2 | 3 | 4 | 'tab';

// ============================================================================
// Settings Interface
// ============================================================================

/**
 * Formatter settings configuration
 */
export interface FormatterSettings {
  // View mode
  viewMode: ViewMode;
  
  // Formatting options
  indentation: IndentationType;
  sortKeys: boolean;
  
  // Cleaning options
  removeNulls: boolean;
  removeEmptyStrings: boolean;
  removeEmptyArrays: boolean;
  removeEmptyObjects: boolean;
  
  // Advanced options
  escapeUnicode: boolean;
  quoteStyle: 'double' | 'single';
  trailingNewline: boolean;
  
  // Validation options
  validateOnType: boolean;
  autoFormat: boolean;
}

/**
 * Default formatter settings
 */
export const DEFAULT_FORMATTER_SETTINGS: FormatterSettings = {
  viewMode: 'code',
  indentation: 2,
  sortKeys: false,
  removeNulls: false,
  removeEmptyStrings: false,
  removeEmptyArrays: false,
  removeEmptyObjects: false,
  escapeUnicode: false,
  quoteStyle: 'double',
  trailingNewline: true,
  validateOnType: true,
  autoFormat: false,
};

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Error severity levels
 */
export type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Validation error with position info
 */
export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: ErrorSeverity;
  type?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  parsedData?: unknown;
  parseTime: number;
}

// ============================================================================
// Tree View Types
// ============================================================================

/**
 * Node types in JSON tree
 */
export type NodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

/**
 * Tree node representation
 */
export interface TreeNode {
  id: string;
  key: string;
  value: unknown;
  type: NodeType;
  depth: number;
  path: string;
  children: TreeNode[];
  isExpanded: boolean;
  childCount?: number;
  parent?: TreeNode;
}

/**
 * Tree view state
 */
export interface TreeViewState {
  root: TreeNode | null;
  expandedNodes: Set<string>;
  selectedNode: string | null;
  searchQuery: string;
  matchedNodes: string[];
  currentMatchIndex: number;
}

// ============================================================================
// Formatting Result Types
// ============================================================================

/**
 * Size metrics
 */
export interface SizeMetrics {
  bytes: number;
  characters: number;
  lines: number;
  formatted: string;
}

/**
 * Format statistics
 */
export interface FormatStats {
  original: SizeMetrics;
  formatted: SizeMetrics;
  changeBytes: number;
  changePercent: number;
}

/**
 * Format result
 */
export interface FormatResult {
  success: boolean;
  output: string;
  stats: FormatStats;
  errors: ValidationError[];
  processingTime: number;
}

// ============================================================================
// Manipulation Types
// ============================================================================

/**
 * Sort order options
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Filter criteria
 */
export interface FilterCriteria {
  keyPattern?: string;
  valuePattern?: string;
  caseSensitive: boolean;
  useRegex: boolean;
}

/**
 * Manipulation options
 */
export interface ManipulationOptions {
  sortKeys: boolean;
  sortOrder: SortOrder;
  removeNulls: boolean;
  removeEmptyStrings: boolean;
  removeEmptyArrays: boolean;
  removeEmptyObjects: boolean;
  removeDuplicates: boolean;
  filter?: FilterCriteria;
  convertStringNumbers: boolean;
  trimStrings: boolean;
}

// ============================================================================
// Preset Types
// ============================================================================

/**
 * Formatter preset configuration
 */
export interface FormatterPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<FormatterSettings>;
}

/**
 * Built-in formatter presets
 */
export const FORMATTER_PRESETS: FormatterPreset[] = [
  {
    id: 'readable',
    name: 'Readable',
    description: 'Beautified with 2-space indentation',
    icon: 'fas fa-book-open',
    settings: {
      indentation: 2,
      sortKeys: false,
    },
  },
  {
    id: 'expanded',
    name: 'Expanded',
    description: '4-space indentation for maximum readability',
    icon: 'fas fa-expand',
    settings: {
      indentation: 4,
      sortKeys: false,
    },
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Minimized whitespace for smaller files',
    icon: 'fas fa-compress-arrows-alt',
    settings: {
      indentation: 2,
      trailingNewline: false,
    },
  },
  {
    id: 'sorted',
    name: 'Sorted Keys',
    description: 'Alphabetically sorted keys at every level',
    icon: 'fas fa-sort-alpha-down',
    settings: {
      indentation: 2,
      sortKeys: true,
    },
  },
  {
    id: 'clean',
    name: 'Clean Data',
    description: 'Remove nulls, empty strings, and empty collections',
    icon: 'fas fa-broom',
    settings: {
      indentation: 2,
      removeNulls: true,
      removeEmptyStrings: true,
      removeEmptyArrays: true,
      removeEmptyObjects: true,
    },
  },
  {
    id: 'tabs',
    name: 'Tab Indented',
    description: 'Use tabs for indentation',
    icon: 'fas fa-indent',
    settings: {
      indentation: 'tab',
      sortKeys: false,
    },
  },
];

// ============================================================================
// Utility Types
// ============================================================================

/**
 * JSON primitive types
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON value (recursive)
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * JSON object
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * JSON array
 */
export type JsonArray = JsonValue[];

/**
 * Check if value is a plain object
 */
export function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if value is an array
 */
export function isArray(value: unknown): value is JsonArray {
  return Array.isArray(value);
}

/**
 * Check if value is a primitive
 */
export function isPrimitive(value: unknown): value is JsonPrimitive {
  return value === null || typeof value !== 'object';
}

/**
 * Get node type from value
 */
export function getNodeType(value: unknown): NodeType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  switch (typeof value) {
    case 'object': return 'object';
    case 'string': return 'string';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    default: return 'string';
  }
}
