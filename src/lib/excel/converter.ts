/**
 * JSON to Excel Converter - Core conversion logic using SheetJS
 */

import * as XLSX from 'xlsx';
import type {
  ExcelExportSettings,
  ColumnConfig,
  PreviewData,
  ConversionResult,
  ExportResult,
  StructureAnalysis,
  JsonStructureType,
  JsonValue,
  JsonObject,
  JsonArray,
} from './types';
import { DEFAULT_EXPORT_SETTINGS, isPlainObject, isArray, isPrimitive } from './types';
import { flattenObject, flattenArrayOfObjects, getAllKeys, getMaxDepth } from './flattener';
import { generateColumns, getVisibleColumns, calculateAllColumnWidths } from './columnManager';

// ============================================================================
// Structure Analysis
// ============================================================================

/**
 * Analyze JSON structure to determine how to convert it
 */
export function analyzeStructure(data: JsonValue): StructureAnalysis {
  const warnings: string[] = [];
  
  // Determine structure type
  let type: JsonStructureType = 'single_object';
  let rowCount = 1;
  let columnCount = 0;
  
  if (isArray(data)) {
    if (data.length === 0) {
      return {
        type: 'array_of_objects',
        rowCount: 0,
        columnCount: 0,
        maxDepth: 0,
        hasNestedObjects: false,
        hasArrays: false,
        warnings: ['Empty array'],
      };
    }
    
    // Check if all elements are objects
    const allObjects = data.every(item => isPlainObject(item));
    const allPrimitives = data.every(item => isPrimitive(item));
    
    if (allObjects) {
      type = 'array_of_objects';
      rowCount = data.length;
    } else if (allPrimitives) {
      type = 'array_of_primitives';
      rowCount = data.length;
      columnCount = 1;
    } else {
      type = 'mixed';
      rowCount = data.length;
      warnings.push('Array contains mixed types (objects and primitives)');
    }
  } else if (isPlainObject(data)) {
    // Check if object has nested objects
    const hasNested = Object.values(data).some(val => 
      isPlainObject(val) || isArray(val)
    );
    type = hasNested ? 'nested_object' : 'single_object';
  }
  
  // Calculate depth and check for nesting
  const maxDepth = getMaxDepth(data);
  const hasNestedObjects = maxDepth > 1;
  const hasArrays = JSON.stringify(data).includes('[');
  
  if (maxDepth > 5) {
    warnings.push(`Deeply nested structure (${maxDepth} levels). Consider flattening.`);
  }
  
  if (rowCount > 100000) {
    warnings.push(`Large dataset (${rowCount.toLocaleString()} rows). Export may be slow.`);
  }
  
  return {
    type,
    rowCount,
    columnCount,
    maxDepth,
    hasNestedObjects,
    hasArrays,
    warnings,
  };
}

// ============================================================================
// Data Conversion
// ============================================================================

/**
 * Convert JSON to tabular format
 */
export function convertToTabular(
  data: JsonValue,
  settings: Partial<ExcelExportSettings> = {}
): ConversionResult {
  const opts = { ...DEFAULT_EXPORT_SETTINGS, ...settings };
  const errors: string[] = [];
  
  try {
    // Analyze structure
    const structure = analyzeStructure(data);
    
    // Convert to rows based on structure type
    let rows: Record<string, unknown>[] = [];
    
    switch (structure.type) {
      case 'array_of_objects':
        rows = opts.flattenNested
          ? flattenArrayOfObjects(data as JsonArray, {
              delimiter: opts.flattenDelimiter,
              maxDepth: opts.flattenDepth,
            })
          : (data as JsonObject[]).map(obj => ({ ...obj }));
        break;
        
      case 'array_of_primitives':
        rows = (data as unknown[]).map(val => ({ value: val }));
        break;
        
      case 'single_object':
      case 'nested_object':
        const flattened = opts.flattenNested
          ? flattenObject(data as JsonObject, {
              delimiter: opts.flattenDelimiter,
              maxDepth: opts.flattenDepth,
            })
          : (data as JsonObject);
        rows = [flattened];
        break;
        
      case 'mixed':
        rows = (data as JsonArray).map(item => {
          if (isPlainObject(item)) {
            return opts.flattenNested
              ? flattenObject(item, {
                  delimiter: opts.flattenDelimiter,
                  maxDepth: opts.flattenDepth,
                })
              : item;
          }
          return { value: item };
        });
        break;
    }
    
    // Generate columns
    const columns = generateColumns(rows);
    
    // Get all unique headers
    const headers = getAllKeys(rows);
    
    // Create preview (limit to 100 rows)
    const previewRows = rows.slice(0, 100);
    const preview: PreviewData = {
      headers,
      rows: previewRows,
      totalRows: rows.length,
      totalColumns: headers.length,
      truncated: rows.length > 100,
    };
    
    // Update structure with column count
    structure.columnCount = headers.length;
    
    return {
      success: true,
      preview,
      columns,
      structure,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      preview: {
        headers: [],
        rows: [],
        totalRows: 0,
        totalColumns: 0,
        truncated: false,
      },
      columns: [],
      structure: {
        type: 'single_object',
        rowCount: 0,
        columnCount: 0,
        maxDepth: 0,
        hasNestedObjects: false,
        hasArrays: false,
        warnings: [],
      },
      errors: [(error as Error).message],
    };
  }
}

// ============================================================================
// Excel Export
// ============================================================================

/**
 * Export data to Excel file
 */
export function exportToExcel(
  data: JsonValue,
  columns: ColumnConfig[],
  settings: Partial<ExcelExportSettings> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_SETTINGS, ...settings };
  
  try {
    // Convert data to tabular format
    const result = convertToTabular(data, opts);
    if (!result.success) {
      return {
        success: false,
        filename: '',
        format: opts.format,
        rowCount: 0,
        columnCount: 0,
        error: result.errors.join(', '),
      };
    }
    
    // Get visible columns in order
    const visibleColumns = getVisibleColumns(columns);
    const headers = visibleColumns.map(col => col.displayName);
    const keys = visibleColumns.map(col => col.key);
    
    // Prepare worksheet data
    const wsData: unknown[][] = [];
    
    // Add headers if enabled
    if (opts.includeHeaders) {
      wsData.push(headers);
    }
    
    // Add data rows
    for (const row of result.preview.rows) {
      const rowData = keys.map(key => {
        const value = row[key];
        if (value === null || value === undefined) {
          return opts.nullValue;
        }
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return value;
      });
      wsData.push(rowData);
    }
    
    // Handle full data if preview was truncated
    if (result.preview.truncated) {
      // Re-convert with full data for export
      const fullResult = convertToTabular(data, opts);
      if (fullResult.success) {
        // Clear and rebuild with full data
        wsData.length = opts.includeHeaders ? 1 : 0;
        for (const row of fullResult.preview.rows) {
          const rowData = keys.map(key => {
            const value = row[key];
            if (value === null || value === undefined) {
              return opts.nullValue;
            }
            if (typeof value === 'object') {
              return JSON.stringify(value);
            }
            return value;
          });
          wsData.push(rowData);
        }
      }
    }
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Apply column widths
    if (opts.autoFitColumns) {
      const widths = calculateAllColumnWidths(visibleColumns, result.preview.rows);
      ws['!cols'] = keys.map(key => ({
        wch: widths.get(key) || 15,
      }));
    }
    
    // Apply header formatting
    if (opts.boldHeaders && opts.includeHeaders) {
      // Note: Basic xlsx doesn't support styling in community version
      // Would need xlsx-style or similar for bold headers
    }
    
    // Apply freeze panes
    if (opts.freezeHeaders && opts.includeHeaders) {
      ws['!freeze'] = { xSplit: 0, ySplit: 1 };
    }
    
    // Apply auto filter
    if (opts.enableAutoFilter && opts.includeHeaders) {
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) };
    }
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, opts.sheetName);
    
    // Determine file extension
    const extension = opts.format === 'csv' ? 'csv' : opts.format;
    const filename = `${opts.filename}.${extension}`;
    
    // Write file
    XLSX.writeFile(wb, filename, {
      bookType: opts.format === 'csv' ? 'csv' : opts.format,
      compression: true,
    });
    
    return {
      success: true,
      filename,
      format: opts.format,
      rowCount: result.preview.totalRows,
      columnCount: visibleColumns.length,
    };
  } catch (error) {
    return {
      success: false,
      filename: '',
      format: opts.format,
      rowCount: 0,
      columnCount: 0,
      error: (error as Error).message,
    };
  }
}

/**
 * Generate Excel file as Blob (for download without save dialog)
 */
export function generateExcelBlob(
  data: JsonValue,
  columns: ColumnConfig[],
  settings: Partial<ExcelExportSettings> = {}
): Blob | null {
  const opts = { ...DEFAULT_EXPORT_SETTINGS, ...settings };
  
  try {
    // Convert data to tabular format
    const result = convertToTabular(data, opts);
    if (!result.success) {
      return null;
    }
    
    // Get visible columns in order
    const visibleColumns = getVisibleColumns(columns);
    const headers = visibleColumns.map(col => col.displayName);
    const keys = visibleColumns.map(col => col.key);
    
    // Prepare worksheet data
    const wsData: unknown[][] = [];
    
    // Add headers if enabled
    if (opts.includeHeaders) {
      wsData.push(headers);
    }
    
    // Add data rows
    for (const row of result.preview.rows) {
      const rowData = keys.map(key => {
        const value = row[key];
        if (value === null || value === undefined) {
          return opts.nullValue;
        }
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return value;
      });
      wsData.push(rowData);
    }
    
    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Apply column widths
    if (opts.autoFitColumns) {
      const widths = calculateAllColumnWidths(visibleColumns, result.preview.rows);
      ws['!cols'] = keys.map(key => ({
        wch: widths.get(key) || 15,
      }));
    }
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, opts.sheetName);
    
    // Generate blob
    const wbout = XLSX.write(wb, {
      bookType: opts.format === 'csv' ? 'csv' : opts.format,
      type: 'array',
      compression: true,
    });
    
    const mimeType = opts.format === 'csv' 
      ? 'text/csv' 
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    
    return new Blob([wbout], { type: mimeType });
  } catch {
    return null;
  }
}

/**
 * Parse JSON string safely
 */
export function parseJSON(input: string): { data: JsonValue | null; error: string | null } {
  try {
    const data = JSON.parse(input);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}
