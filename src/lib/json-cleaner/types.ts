/**
 * JSON Cleaner Type Definitions
 * Types for JSON cleaning, transformation, and sanitization
 */

// Key naming conventions
export type KeyCase = 'camelCase' | 'snake_case' | 'PascalCase' | 'kebab-case' | 'SCREAMING_SNAKE_CASE';

// Cleaning operation types
export type CleaningOperation = 
  | 'remove_null'
  | 'remove_empty_string'
  | 'remove_empty_array'
  | 'remove_empty_object'
  | 'remove_undefined'
  | 'trim_strings'
  | 'remove_whitespace_only'
  | 'dedupe_arrays'
  | 'sort_keys'
  | 'remove_duplicates';

// Transform operation types
export type TransformOperation =
  | 'key_case'
  | 'string_to_number'
  | 'string_to_boolean'
  | 'number_to_string'
  | 'boolean_to_string'
  | 'null_to_string'
  | 'flatten'
  | 'unflatten';

// Cleaning settings
export interface CleaningSettings {
  // Removal options
  removeNull: boolean;
  removeEmptyStrings: boolean;
  removeEmptyArrays: boolean;
  removeEmptyObjects: boolean;
  removeUndefined: boolean;
  
  // String operations
  trimStrings: boolean;
  removeWhitespaceOnly: boolean;
  
  // Array operations
  deduplicateArrays: boolean;
  
  // Object operations
  sortKeys: boolean;
  sortKeysDeep: boolean;
  
  // Output options
  minify: boolean;
  indentation: number | 'tab';
}

// Transform settings
export interface TransformSettings {
  // Key transformations
  keyCase: KeyCase | null;
  keyTransformDeep: boolean;
  
  // Type conversions
  stringToNumber: boolean;
  stringToBoolean: boolean;
  numberToString: boolean;
  booleanToString: boolean;
  nullToString: boolean;
  
  // Structure transformations
  flatten: boolean;
  flattenSeparator: string;
  unflatten: boolean;
}

// Full cleaner settings
export interface CleanerSettings {
  cleaning: CleaningSettings;
  transform: TransformSettings;
}

// Cleaning result
export interface CleaningResult {
  success: boolean;
  input: string;
  output: string;
  operations: CleaningOperationResult[];
  stats: CleaningStats;
  processingTime: number;
  error?: string;
}

// Individual operation result
export interface CleaningOperationResult {
  operation: CleaningOperation | TransformOperation;
  affected: number;
  description: string;
}

// Cleaning statistics
export interface CleaningStats {
  inputSize: number;
  outputSize: number;
  sizeDifference: number;
  sizeReduction: number; // percentage
  removedItems: number;
  transformedItems: number;
  inputKeyCount: number;
  outputKeyCount: number;
}

// Default settings
export const DEFAULT_CLEANING_SETTINGS: CleaningSettings = {
  removeNull: false,
  removeEmptyStrings: false,
  removeEmptyArrays: false,
  removeEmptyObjects: false,
  removeUndefined: true,
  trimStrings: false,
  removeWhitespaceOnly: false,
  deduplicateArrays: false,
  sortKeys: false,
  sortKeysDeep: false,
  minify: false,
  indentation: 2,
};

export const DEFAULT_TRANSFORM_SETTINGS: TransformSettings = {
  keyCase: null,
  keyTransformDeep: true,
  stringToNumber: false,
  stringToBoolean: false,
  numberToString: false,
  booleanToString: false,
  nullToString: false,
  flatten: false,
  flattenSeparator: '.',
  unflatten: false,
};

export const DEFAULT_CLEANER_SETTINGS: CleanerSettings = {
  cleaning: DEFAULT_CLEANING_SETTINGS,
  transform: DEFAULT_TRANSFORM_SETTINGS,
};

// Preset types
export type CleanerPreset = 'minimal' | 'standard' | 'aggressive' | 'api' | 'storage';

// Tree node for visualization
export interface TreeNode {
  id: string;
  key: string;
  value: unknown;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  path: string;
  depth: number;
  children?: TreeNode[];
  isExpanded?: boolean;
}
