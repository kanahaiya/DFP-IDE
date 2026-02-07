/**
 * Type definitions for JSON Minifier tool
 */

// ============================================================================
// Mode Types
// ============================================================================

/**
 * Operation mode
 */
export type MinifierMode = 'minify' | 'beautify';

/**
 * Indentation options for beautify mode
 */
export type IndentationType = 2 | 3 | 4 | 'tab';

// ============================================================================
// Settings Interface
// ============================================================================

/**
 * Complete minifier settings configuration
 */
export interface MinifierSettings {
  // Operation mode
  mode: MinifierMode;
  
  // Beautify options
  indentation: IndentationType;
  
  // Formatting options
  sortKeys: boolean;           // Sort object keys alphabetically
  removeNulls: boolean;        // Remove null values from output
  removeEmptyStrings: boolean; // Remove empty string values
  removeEmptyArrays: boolean;  // Remove empty arrays
  removeEmptyObjects: boolean; // Remove empty objects
  
  // Advanced options
  escapeUnicode: boolean;      // Escape non-ASCII characters
  trailingNewline: boolean;    // Add newline at end of output
}

/**
 * Default minifier settings
 */
export const DEFAULT_MINIFIER_SETTINGS: MinifierSettings = {
  mode: 'minify',
  indentation: 2,
  sortKeys: false,
  removeNulls: false,
  removeEmptyStrings: false,
  removeEmptyArrays: false,
  removeEmptyObjects: false,
  escapeUnicode: false,
  trailingNewline: false,
};

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation error with position info
 */
export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  parsedData?: unknown;
}

// ============================================================================
// Compression Stats Types
// ============================================================================

/**
 * Size metrics
 */
export interface SizeMetrics {
  bytes: number;
  characters: number;
  lines: number;
  formatted: string; // Human-readable (e.g., "1.5 KB")
}

/**
 * Compression statistics
 */
export interface CompressionStats {
  original: SizeMetrics;
  processed: SizeMetrics;
  bytesSaved: number;
  percentageReduction: number;
  compressionRatio: string; // e.g., "2.3:1"
}

// ============================================================================
// Result Types
// ============================================================================

/**
 * Minify/Beautify result
 */
export interface MinifyResult {
  success: boolean;
  output: string;
  stats: CompressionStats;
  errors: ValidationError[];
  processingTime: number; // milliseconds
}

// ============================================================================
// Preset Types
// ============================================================================

/**
 * Minifier preset configuration
 */
export interface MinifierPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<MinifierSettings>;
}

/**
 * Built-in minifier presets
 */
export const MINIFIER_PRESETS: MinifierPreset[] = [
  {
    id: 'production',
    name: 'Production',
    description: 'Minified output for production use',
    icon: 'fas fa-rocket',
    settings: {
      mode: 'minify',
      removeNulls: false,
      sortKeys: false,
    },
  },
  {
    id: 'compact-clean',
    name: 'Compact & Clean',
    description: 'Minified with nulls and empty values removed',
    icon: 'fas fa-broom',
    settings: {
      mode: 'minify',
      removeNulls: true,
      removeEmptyStrings: true,
      removeEmptyArrays: true,
      removeEmptyObjects: true,
    },
  },
  {
    id: 'readable',
    name: 'Readable',
    description: '2-space indented for readability',
    icon: 'fas fa-book-open',
    settings: {
      mode: 'beautify',
      indentation: 2,
      sortKeys: false,
    },
  },
  {
    id: 'sorted',
    name: 'Sorted Keys',
    description: 'Beautified with alphabetically sorted keys',
    icon: 'fas fa-sort-alpha-down',
    settings: {
      mode: 'beautify',
      indentation: 2,
      sortKeys: true,
    },
  },
  {
    id: 'expanded',
    name: 'Expanded',
    description: '4-space indented for maximum readability',
    icon: 'fas fa-expand',
    settings: {
      mode: 'beautify',
      indentation: 4,
      sortKeys: false,
    },
  },
  {
    id: 'tabs',
    name: 'Tab Indented',
    description: 'Beautified with tab indentation',
    icon: 'fas fa-indent',
    settings: {
      mode: 'beautify',
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
