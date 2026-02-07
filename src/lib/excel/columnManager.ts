/**
 * Column Manager - Handle column selection, renaming, and reordering
 */

import type { ColumnConfig, ColumnDataType, PreviewRow } from './types';

// ============================================================================
// Column Detection
// ============================================================================

/**
 * Detect data type from sample values
 */
export function detectDataType(values: unknown[]): ColumnDataType {
  const types = new Set<string>();
  
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;
    
    if (typeof value === 'boolean') {
      types.add('boolean');
    } else if (typeof value === 'number') {
      types.add('number');
    } else if (typeof value === 'string') {
      // Check if string looks like a date
      if (isDateString(value)) {
        types.add('date');
      } else if (isNumericString(value)) {
        types.add('number');
      } else {
        types.add('string');
      }
    } else {
      types.add('string');
    }
  }
  
  if (types.size === 0) return 'string';
  if (types.size === 1) return types.values().next().value as ColumnDataType;
  return 'mixed';
}

/**
 * Check if string looks like a date
 */
function isDateString(value: string): boolean {
  // Common date patterns
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/,                    // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,   // ISO format
    /^\d{2}\/\d{2}\/\d{4}$/,                  // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/,                    // DD-MM-YYYY
  ];
  
  return datePatterns.some(pattern => pattern.test(value));
}

/**
 * Check if string is numeric
 */
function isNumericString(value: string): boolean {
  const trimmed = value.trim();
  return trimmed !== '' && !isNaN(Number(trimmed));
}

// ============================================================================
// Column Generation
// ============================================================================

/**
 * Generate column configurations from data
 */
export function generateColumns(rows: PreviewRow[]): ColumnConfig[] {
  const keyMap = new Map<string, unknown[]>();
  
  // Collect all values for each key
  for (const row of rows) {
    for (const [key, value] of Object.entries(row)) {
      if (!keyMap.has(key)) {
        keyMap.set(key, []);
      }
      keyMap.get(key)!.push(value);
    }
  }
  
  // Create column configs
  const columns: ColumnConfig[] = [];
  let order = 0;
  
  for (const [key, values] of keyMap) {
    columns.push({
      key,
      originalKey: key,
      displayName: formatColumnName(key),
      dataType: detectDataType(values),
      visible: true,
      order: order++,
    });
  }
  
  return columns;
}

/**
 * Format column name from key (convert camelCase, snake_case to Title Case)
 */
export function formatColumnName(key: string): string {
  return key
    // Add space before uppercase letters
    .replace(/([A-Z])/g, ' $1')
    // Replace underscores and dots with spaces
    .replace(/[_\.]/g, ' ')
    // Capitalize first letter of each word
    .replace(/\b\w/g, c => c.toUpperCase())
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================================
// Column Operations
// ============================================================================

/**
 * Reorder columns
 */
export function reorderColumns(
  columns: ColumnConfig[],
  fromIndex: number,
  toIndex: number
): ColumnConfig[] {
  const result = [...columns];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  
  // Update order values
  return result.map((col, index) => ({
    ...col,
    order: index,
  }));
}

/**
 * Toggle column visibility
 */
export function toggleColumnVisibility(
  columns: ColumnConfig[],
  key: string
): ColumnConfig[] {
  return columns.map(col => 
    col.key === key ? { ...col, visible: !col.visible } : col
  );
}

/**
 * Rename column
 */
export function renameColumn(
  columns: ColumnConfig[],
  key: string,
  newName: string
): ColumnConfig[] {
  return columns.map(col =>
    col.key === key ? { ...col, displayName: newName } : col
  );
}

/**
 * Select all columns
 */
export function selectAllColumns(columns: ColumnConfig[]): ColumnConfig[] {
  return columns.map(col => ({ ...col, visible: true }));
}

/**
 * Deselect all columns
 */
export function deselectAllColumns(columns: ColumnConfig[]): ColumnConfig[] {
  return columns.map(col => ({ ...col, visible: false }));
}

/**
 * Get visible columns in order
 */
export function getVisibleColumns(columns: ColumnConfig[]): ColumnConfig[] {
  return columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get column by key
 */
export function getColumnByKey(
  columns: ColumnConfig[],
  key: string
): ColumnConfig | undefined {
  return columns.find(col => col.key === key);
}

// ============================================================================
// Column Width Calculation
// ============================================================================

/**
 * Calculate optimal column width based on content
 */
export function calculateColumnWidth(
  header: string,
  values: unknown[],
  maxWidth: number = 50
): number {
  let maxLength = header.length;
  
  for (const value of values.slice(0, 100)) { // Sample first 100 rows
    const str = formatValue(value);
    maxLength = Math.max(maxLength, str.length);
  }
  
  return Math.min(maxLength + 2, maxWidth);
}

/**
 * Format value to string for width calculation
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  return JSON.stringify(value);
}

/**
 * Calculate all column widths
 */
export function calculateAllColumnWidths(
  columns: ColumnConfig[],
  rows: PreviewRow[]
): Map<string, number> {
  const widths = new Map<string, number>();
  
  for (const col of columns) {
    const values = rows.map(row => row[col.key]);
    const width = calculateColumnWidth(col.displayName, values);
    widths.set(col.key, width);
  }
  
  return widths;
}

// ============================================================================
// Column Validation
// ============================================================================

/**
 * Validate column configuration
 */
export function validateColumns(columns: ColumnConfig[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check for duplicate display names
  const displayNames = columns.map(col => col.displayName);
  const uniqueNames = new Set(displayNames);
  if (uniqueNames.size !== displayNames.length) {
    errors.push('Duplicate column names detected');
  }
  
  // Check for empty display names
  if (columns.some(col => !col.displayName.trim())) {
    errors.push('Column names cannot be empty');
  }
  
  // Check that at least one column is visible
  if (!columns.some(col => col.visible)) {
    errors.push('At least one column must be selected');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
