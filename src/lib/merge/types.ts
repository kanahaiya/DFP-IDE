/**
 * Type definitions for JSON Merge tool
 */

// ============================================================================
// Merge Strategy Types
// ============================================================================

/**
 * Available merge strategies
 */
export type MergeStrategy = 
  | 'simple'           // Last value wins (shallow)
  | 'deep'             // Recursive object merge
  | 'arrayConcatenation' // Combine arrays sequentially
  | 'arrayUnion'       // Combine arrays, remove duplicates
  | 'nestedArrayMerge' // Match array elements by key field
  | 'custom';          // Custom per-field rules

/**
 * How to handle duplicate keys when merging
 */
export type DuplicateKeyStrategy = 
  | 'keepFirst'  // Keep value from first document
  | 'keepLast'   // Keep value from last document (default)
  | 'merge';     // Attempt to merge values

/**
 * How to order array elements in output
 */
export type ArrayOrdering = 
  | 'preserve'  // Keep original order
  | 'sort'      // Sort alphabetically/numerically
  | 'unique';   // Remove duplicates, preserve order

/**
 * How to handle null values
 */
export type NullHandling = 
  | 'include'      // Include null values in output
  | 'exclude'      // Remove null values from output
  | 'preserveNonNull'; // Null doesn't override non-null

/**
 * Indentation options for output
 */
export type IndentationType = 2 | 3 | 4 | 'tab' | 'minified';

// ============================================================================
// Settings Interface
// ============================================================================

/**
 * Complete merge settings configuration
 */
export interface MergeSettings {
  // Core strategy
  strategy: MergeStrategy;
  
  // Duplicate handling
  duplicateKeyStrategy: DuplicateKeyStrategy;
  
  // Array handling
  arrayOrdering: ArrayOrdering;
  arrayMergeKey?: string; // Key field for nestedArrayMerge (e.g., "id")
  
  // Null handling
  nullHandling: NullHandling;
  
  // Output formatting
  indentation: IndentationType;
  sortKeys: boolean;
  
  // Advanced options
  ignoreCase: boolean; // Ignore key case when merging
  preserveUndefined: boolean; // Keep undefined values
}

/**
 * Default merge settings
 */
export const DEFAULT_MERGE_SETTINGS: MergeSettings = {
  strategy: 'simple',
  duplicateKeyStrategy: 'keepLast',
  arrayOrdering: 'preserve',
  arrayMergeKey: 'id',
  nullHandling: 'include',
  indentation: 2,
  sortKeys: false,
  ignoreCase: false,
  preserveUndefined: false,
};

// ============================================================================
// Input Types
// ============================================================================

/**
 * Single JSON input pane
 */
export interface MergeInput {
  id: string;
  name: string;
  content: string;
  isValid: boolean;
  error?: string;
}

/**
 * Validation error for an input
 */
export interface ValidationError {
  inputId: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

// ============================================================================
// Result Types
// ============================================================================

/**
 * Conflict detected during merge
 */
export interface MergeConflict {
  path: string;         // JSON path where conflict occurred
  key: string;          // The conflicting key
  values: {
    inputId: string;
    inputName: string;
    value: unknown;
  }[];
  resolution: 'first' | 'last' | 'merged';
  resolvedValue: unknown;
}

/**
 * Statistics about the merge operation
 */
export interface MergeStats {
  inputCount: number;
  totalInputKeys: number;
  outputKeys: number;
  conflictsResolved: number;
  arraysProcessed: number;
  depth: number;         // Maximum nesting depth
  processingTime: number; // in milliseconds
}

/**
 * Complete merge result
 */
export interface MergeResult {
  success: boolean;
  output: JsonValue | null;  // The merged JSON object/array
  outputString: string;  // Formatted JSON string
  conflicts: MergeConflict[];
  stats: MergeStats;
  errors: ValidationError[];
}

// ============================================================================
// Export Settings
// ============================================================================

/**
 * Settings for exporting merged result
 */
export interface ExportSettings {
  format: 'json' | 'jsonMinified';
  indentation: IndentationType;
  sortKeys: boolean;
  includeStats: boolean;
  filename?: string;
}

/**
 * Default export settings
 */
export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  format: 'json',
  indentation: 2,
  sortKeys: false,
  includeStats: false,
};

// ============================================================================
// Preset Types
// ============================================================================

/**
 * Merge preset configuration
 */
export interface MergePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<MergeSettings>;
}

/**
 * Built-in merge presets
 */
export const MERGE_PRESETS: MergePreset[] = [
  {
    id: 'simple-override',
    name: 'Simple Override',
    description: 'Last value wins for all keys',
    icon: 'fas fa-layer-group',
    settings: {
      strategy: 'simple',
      duplicateKeyStrategy: 'keepLast',
    },
  },
  {
    id: 'deep-merge',
    name: 'Deep Merge',
    description: 'Recursively merge nested objects',
    icon: 'fas fa-sitemap',
    settings: {
      strategy: 'deep',
      duplicateKeyStrategy: 'merge',
    },
  },
  {
    id: 'config-merge',
    name: 'Config Merge',
    description: 'Deep merge with sorted keys',
    icon: 'fas fa-cog',
    settings: {
      strategy: 'deep',
      duplicateKeyStrategy: 'keepLast',
      sortKeys: true,
      nullHandling: 'exclude',
    },
  },
  {
    id: 'array-concat',
    name: 'Array Concatenation',
    description: 'Join all arrays together',
    icon: 'fas fa-list',
    settings: {
      strategy: 'arrayConcatenation',
      arrayOrdering: 'preserve',
    },
  },
  {
    id: 'array-unique',
    name: 'Array Union',
    description: 'Combine arrays, remove duplicates',
    icon: 'fas fa-filter',
    settings: {
      strategy: 'arrayUnion',
      arrayOrdering: 'unique',
    },
  },
  {
    id: 'api-merge',
    name: 'API Response Merge',
    description: 'Deep merge preserving arrays',
    icon: 'fas fa-server',
    settings: {
      strategy: 'deep',
      duplicateKeyStrategy: 'keepLast',
      nullHandling: 'preserveNonNull',
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
 * Check if value is a plain object (not array, not null)
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
 * Get the type of a JSON value
 */
export function getJsonType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}
