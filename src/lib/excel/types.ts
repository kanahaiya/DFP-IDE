/**
 * Type definitions for JSON to Excel tool
 */

// ============================================================================
// Export Settings
// ============================================================================

/**
 * File format options
 */
export type ExcelFormat = 'xlsx' | 'xls' | 'csv';

/**
 * Export settings configuration
 */
export interface ExcelExportSettings {
  // File options
  format: ExcelFormat;
  filename: string;
  sheetName: string;
  
  // Structure options
  includeHeaders: boolean;
  flattenNested: boolean;
  flattenDepth: number;
  flattenDelimiter: string;
  
  // Formatting options
  autoFitColumns: boolean;
  boldHeaders: boolean;
  freezeHeaders: boolean;
  enableAutoFilter: boolean;
  
  // Data handling
  nullValue: string;
  dateFormat: string;
  numberFormat: string;
}

/**
 * Default export settings
 */
export const DEFAULT_EXPORT_SETTINGS: ExcelExportSettings = {
  format: 'xlsx',
  filename: 'data',
  sheetName: 'Sheet1',
  includeHeaders: true,
  flattenNested: true,
  flattenDepth: 5,
  flattenDelimiter: '.',
  autoFitColumns: true,
  boldHeaders: true,
  freezeHeaders: true,
  enableAutoFilter: true,
  nullValue: '',
  dateFormat: 'YYYY-MM-DD',
  numberFormat: 'General',
};

// ============================================================================
// Column Configuration
// ============================================================================

/**
 * Column data type
 */
export type ColumnDataType = 'string' | 'number' | 'boolean' | 'date' | 'mixed';

/**
 * Column configuration
 */
export interface ColumnConfig {
  key: string;
  originalKey: string;
  displayName: string;
  dataType: ColumnDataType;
  visible: boolean;
  order: number;
  width?: number;
  format?: string;
}

/**
 * Column manager state
 */
export interface ColumnManagerState {
  columns: ColumnConfig[];
  selectedColumns: string[];
}

// ============================================================================
// Preview Data
// ============================================================================

/**
 * Preview row data
 */
export type PreviewRow = Record<string, unknown>;

/**
 * Preview data with metadata
 */
export interface PreviewData {
  headers: string[];
  rows: PreviewRow[];
  totalRows: number;
  totalColumns: number;
  truncated: boolean;
}

// ============================================================================
// Conversion Result
// ============================================================================

/**
 * JSON structure type
 */
export type JsonStructureType = 
  | 'array_of_objects' 
  | 'single_object' 
  | 'array_of_primitives'
  | 'nested_object'
  | 'mixed';

/**
 * Structure analysis result
 */
export interface StructureAnalysis {
  type: JsonStructureType;
  rowCount: number;
  columnCount: number;
  maxDepth: number;
  hasNestedObjects: boolean;
  hasArrays: boolean;
  warnings: string[];
}

/**
 * Conversion result
 */
export interface ConversionResult {
  success: boolean;
  preview: PreviewData;
  columns: ColumnConfig[];
  structure: StructureAnalysis;
  errors: string[];
}

// ============================================================================
// Export Result
// ============================================================================

/**
 * Export result
 */
export interface ExportResult {
  success: boolean;
  filename: string;
  format: ExcelFormat;
  rowCount: number;
  columnCount: number;
  fileSize?: number;
  error?: string;
}

// ============================================================================
// Preset Types
// ============================================================================

/**
 * Export preset configuration
 */
export interface ExportPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<ExcelExportSettings>;
}

/**
 * Built-in export presets
 */
export const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: 'simple',
    name: 'Simple Export',
    description: 'Basic Excel file with headers',
    icon: 'fas fa-file-excel',
    settings: {
      format: 'xlsx',
      includeHeaders: true,
      flattenNested: true,
      autoFitColumns: true,
      boldHeaders: true,
    },
  },
  {
    id: 'full-featured',
    name: 'Full Featured',
    description: 'All formatting options enabled',
    icon: 'fas fa-table',
    settings: {
      format: 'xlsx',
      includeHeaders: true,
      flattenNested: true,
      autoFitColumns: true,
      boldHeaders: true,
      freezeHeaders: true,
      enableAutoFilter: true,
    },
  },
  {
    id: 'csv-export',
    name: 'CSV Export',
    description: 'Simple CSV for compatibility',
    icon: 'fas fa-file-csv',
    settings: {
      format: 'csv',
      includeHeaders: true,
      flattenNested: true,
    },
  },
  {
    id: 'legacy-xls',
    name: 'Legacy Excel',
    description: 'XLS format for older Excel versions',
    icon: 'fas fa-history',
    settings: {
      format: 'xls',
      includeHeaders: true,
      flattenNested: true,
    },
  },
];

// ============================================================================
// Utility Types
// ============================================================================

/**
 * JSON value types
 */
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject { [key: string]: JsonValue; }
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
