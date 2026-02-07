/**
 * Type definitions for JSON Stats tool
 */

// ============================================================================
// Size Metrics
// ============================================================================

/**
 * Size-related metrics for the JSON data
 */
export interface SizeMetrics {
  bytes: number;
  characters: number;
  lines: number;
  bytesFormatted: string;   // Human-readable (e.g., "1.5 KB")
  minifiedBytes: number;    // Size when minified
  minifiedFormatted: string;
}

// ============================================================================
// Structure Metrics
// ============================================================================

/**
 * Structure analysis results
 */
export interface StructureMetrics {
  maxDepth: number;           // Maximum nesting level
  totalObjects: number;       // Count of all objects
  totalArrays: number;        // Count of all arrays
  totalKeys: number;          // Total number of keys across all objects
  totalValues: number;        // Total number of values (including nested)
  rootType: 'object' | 'array' | 'primitive'; // Type of root element
  isHomogeneous: boolean;     // True if array contains same-type elements
}

// ============================================================================
// Type Distribution
// ============================================================================

/**
 * JSON data types
 */
export type JsonDataType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'object'
  | 'array';

/**
 * Type count with percentage
 */
export interface TypeCount {
  type: JsonDataType;
  count: number;
  percentage: number;
  color: string;       // For visualization
}

/**
 * Complete type distribution
 */
export interface TypeDistribution {
  counts: TypeCount[];
  totalValues: number;
  mostCommon: JsonDataType;
  leastCommon: JsonDataType;
}

// ============================================================================
// Key Analysis
// ============================================================================

/**
 * Key frequency information
 */
export interface KeyFrequency {
  key: string;
  count: number;
  paths: string[];     // JSON paths where this key appears
}

/**
 * Key analysis results
 */
export interface KeyAnalysis {
  uniqueKeys: number;
  totalKeyInstances: number;
  duplicateKeys: KeyFrequency[];      // Keys that appear more than once
  longestKey: string;
  shortestKey: string;
  averageKeyLength: number;
  topKeys: KeyFrequency[];            // Most frequently used keys
  caseVariations: { key: string; variations: string[] }[]; // Same key, different cases
}

// ============================================================================
// Value Analysis
// ============================================================================

/**
 * String value statistics
 */
export interface StringStats {
  count: number;
  minLength: number;
  maxLength: number;
  averageLength: number;
  emptyCount: number;
  urlCount: number;
  emailCount: number;
  dateCount: number;
}

/**
 * Number value statistics
 */
export interface NumberStats {
  count: number;
  min: number;
  max: number;
  average: number;
  sum: number;
  integerCount: number;
  floatCount: number;
  negativeCount: number;
}

/**
 * Array value statistics
 */
export interface ArrayStats {
  count: number;
  minLength: number;
  maxLength: number;
  averageLength: number;
  emptyCount: number;
  totalElements: number;
}

/**
 * Complete value analysis
 */
export interface ValueAnalysis {
  strings: StringStats;
  numbers: NumberStats;
  arrays: ArrayStats;
  booleans: { count: number; trueCount: number; falseCount: number };
  nulls: { count: number };
}

// ============================================================================
// Data Quality
// ============================================================================

/**
 * Quality issue types
 */
export type QualityIssueType =
  | 'null_value'
  | 'empty_string'
  | 'empty_array'
  | 'empty_object'
  | 'inconsistent_type'
  | 'duplicate_key'
  | 'missing_key'
  | 'suspicious_value';

/**
 * Individual quality issue
 */
export interface QualityIssue {
  type: QualityIssueType;
  path: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

/**
 * Data quality insights
 */
export interface DataQualityInsights {
  score: number;              // 0-100 quality score
  issues: QualityIssue[];
  nullCount: number;
  emptyStringCount: number;
  emptyArrayCount: number;
  emptyObjectCount: number;
  inconsistentTypes: { key: string; types: JsonDataType[] }[];
  suggestions: string[];
}

// ============================================================================
// Complete Stats Result
// ============================================================================

/**
 * Complete JSON statistics
 */
export interface JsonStats {
  size: SizeMetrics;
  structure: StructureMetrics;
  types: TypeDistribution;
  keys: KeyAnalysis;
  values: ValueAnalysis;
  quality: DataQualityInsights;
  processingTime: number;    // milliseconds
  isValid: boolean;
  error?: string;
}

// ============================================================================
// Export Settings
// ============================================================================

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'csv' | 'markdown';

/**
 * Export settings
 */
export interface ExportSettings {
  format: ExportFormat;
  includeSize: boolean;
  includeStructure: boolean;
  includeTypes: boolean;
  includeKeys: boolean;
  includeValues: boolean;
  includeQuality: boolean;
}

/**
 * Default export settings
 */
export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  format: 'json',
  includeSize: true,
  includeStructure: true,
  includeTypes: true,
  includeKeys: true,
  includeValues: true,
  includeQuality: true,
};

// ============================================================================
// UI State
// ============================================================================

/**
 * Active section in the stats dashboard
 */
export type ActiveSection = 
  | 'overview'
  | 'structure'
  | 'types'
  | 'keys'
  | 'values'
  | 'quality';

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
 * Get the JSON type of a value
 */
export function getJsonType(value: unknown): JsonDataType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  switch (typeof value) {
    case 'string': return 'string';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    default: return 'object';
  }
}

/**
 * Color palette for type visualization
 */
export const TYPE_COLORS: Record<JsonDataType, string> = {
  string: '#4CAF50',   // Green
  number: '#2196F3',   // Blue
  boolean: '#9C27B0',  // Purple
  null: '#9E9E9E',     // Gray
  object: '#FF9800',   // Orange
  array: '#E91E63',    // Pink
};
