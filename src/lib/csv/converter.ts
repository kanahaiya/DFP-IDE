/**
 * CSV to JSON Converter
 * Uses PapaParse for robust CSV parsing with comprehensive options
 */

import Papa, { type ParseConfig } from 'papaparse';
import type { CSVSettings, Indentation } from '@/store/csv';
import { inferAndConvertValue } from './typeInference';

export interface ParsedCSVResult {
  data: unknown[];
  errors: ParseError[];
  meta: ParseMeta;
}

export interface ParseError {
  type: string;
  code: string;
  message: string;
  row?: number;
}

export interface ParseMeta {
  delimiter: string;
  linebreak: string;
  aborted: boolean;
  truncated: boolean;
  fields?: string[];
}

/**
 * Detect delimiter from CSV text
 */
export function detectDelimiter(csvText: string): string {
  const sample = csvText.split('\n').slice(0, 5).join('\n');
  const delimiters = [',', ';', '\t', '|'];
  
  const counts = delimiters.map(delim => ({
    delimiter: delim,
    count: (sample.match(new RegExp(`\\${delim}`, 'g')) || []).length,
  }));
  
  const maxCount = Math.max(...counts.map(c => c.count));
  const detected = counts.find(c => c.count === maxCount);
  
  return detected && detected.count > 0 ? detected.delimiter : ',';
}

/**
 * Parse CSV text with PapaParse
 */
export function parseCSV(csvText: string, settings: CSVSettings): ParsedCSVResult {
  let delimiter: string;
  
  if (settings.delimiter === 'auto') {
    delimiter = detectDelimiter(csvText);
  } else if (settings.delimiter === 'custom') {
    delimiter = settings.customDelimiter;
  } else if (settings.delimiter === '\t') {
    delimiter = '\t';
  } else {
    delimiter = settings.delimiter;
  }
  
  const config: ParseConfig = {
    delimiter: delimiter,
    header: settings.hasHeader,
    skipEmptyLines: settings.skipEmptyLines ? 'greedy' : false,
    dynamicTyping: false, // We'll handle type conversion ourselves
    comments: false,
    quoteChar: '"',
    escapeChar: '"',
    transformHeader: settings.trimWhitespace ? (h) => (typeof h === 'string' ? h.trim() : h) : undefined,
    transform: settings.trimWhitespace ? (value) => (typeof value === 'string' ? value.trim() : value) : undefined,
  };
  
  const result = Papa.parse(csvText, config);
  
  return {
    data: result.data as unknown[],
    errors: result.errors.map(e => ({
      type: e.type,
      code: e.code,
      message: e.message,
      row: e.row,
    })),
    meta: {
      delimiter: result.meta.delimiter,
      linebreak: result.meta.linebreak,
      aborted: result.meta.aborted,
      truncated: result.meta.truncated,
      fields: result.meta.fields,
    },
  };
}

/**
 * Apply data type inference to parsed data
 */
export function applyTypeInference(
  data: unknown[],
  settings: CSVSettings
): unknown[] {
  if (!Array.isArray(data) || data.length === 0) {
    return data;
  }
  
  // If data has headers, it's an array of objects
  if (settings.hasHeader && typeof data[0] === 'object' && data[0] !== null) {
    return data.map(row => {
      const typedRow: Record<string, unknown> = {};
      const rowObj = row as Record<string, unknown>;
      
      for (const [key, value] of Object.entries(rowObj)) {
        typedRow[key] = inferAndConvertValue(value, settings);
      }
      
      return typedRow;
    });
  }
  
  // If no headers, it's an array of arrays
  return data.map(row => {
    if (Array.isArray(row)) {
      return row.map(value => inferAndConvertValue(value, settings));
    }
    return row;
  });
}

/**
 * Convert array of objects to keyed object (first column as key)
 */
export function convertToKeyedObject(data: unknown[]): Record<string, unknown> {
  if (!Array.isArray(data) || data.length === 0) {
    return {};
  }
  
  const keyed: Record<string, unknown> = {};
  
  for (const row of data) {
    if (typeof row === 'object' && row !== null) {
      const rowObj = row as Record<string, unknown>;
      const keys = Object.keys(rowObj);
      
      if (keys.length > 0) {
        const firstKey = keys[0];
        const keyValue = String(rowObj[firstKey]);
        
        // Create object with remaining properties
        const remainingObj: Record<string, unknown> = {};
        for (let i = 1; i < keys.length; i++) {
          remainingObj[keys[i]] = rowObj[keys[i]];
        }
        
        keyed[keyValue] = remainingObj;
      }
    }
  }
  
  return keyed;
}

/**
 * Convert array of objects to column arrays
 */
export function convertToColumnArrays(data: unknown[]): Record<string, unknown[]> {
  if (!Array.isArray(data) || data.length === 0) {
    return {};
  }
  
  const columns: Record<string, unknown[]> = {};
  
  // Get all unique keys
  const allKeys = new Set<string>();
  for (const row of data) {
    if (typeof row === 'object' && row !== null) {
      Object.keys(row as Record<string, unknown>).forEach(key => allKeys.add(key));
    }
  }
  
  // Initialize columns
  allKeys.forEach(key => {
    columns[key] = [];
  });
  
  // Fill columns
  for (const row of data) {
    if (typeof row === 'object' && row !== null) {
      const rowObj = row as Record<string, unknown>;
      allKeys.forEach(key => {
        columns[key].push(rowObj[key] !== undefined ? rowObj[key] : null);
      });
    }
  }
  
  return columns;
}

/**
 * Convert array of objects with dot notation to nested JSON
 */
export function convertToNestedJSON(data: unknown[]): unknown[] {
  if (!Array.isArray(data) || data.length === 0) {
    return data;
  }
  
  return data.map(row => {
    if (typeof row !== 'object' || row === null) {
      return row;
    }
    
    const nested: Record<string, unknown> = {};
    const rowObj = row as Record<string, unknown>;
    
    for (const [key, value] of Object.entries(rowObj)) {
      setNestedValue(nested, key, value);
    }
    
    return nested;
  });
}

/**
 * Set nested value using dot notation
 */
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    
    if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
      current[part] = {};
    }
    
    current = current[part] as Record<string, unknown>;
  }
  
  current[parts[parts.length - 1]] = value;
}

/**
 * Format JSON output with indentation
 */
export function formatJSONOutput(
  data: unknown,
  indentation: Indentation,
  sortKeys: boolean
): string {
  if (indentation === 'minified') {
    return JSON.stringify(data);
  }
  
  const indent = indentation === 'tab' ? '\t' : indentation;
  
  if (sortKeys) {
    // Sort keys recursively
    const sortedData = sortObjectKeys(data);
    return JSON.stringify(sortedData, null, indent);
  }
  
  return JSON.stringify(data, null, indent);
}

/**
 * Sort object keys recursively
 */
function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(item => sortObjectKeys(item));
  }
  
  if (obj !== null && typeof obj === 'object') {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    
    for (const key of keys) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    }
    
    return sorted;
  }
  
  return obj;
}

/**
 * Main conversion function
 */
export function convertCSVToJSON(csvText: string, settings: CSVSettings): string {
  if (!csvText || !csvText.trim()) {
    return '';
  }
  
  try {
    // Parse CSV
    const parsed = parseCSV(csvText, settings);
    
    if (parsed.errors.length > 0) {
      const criticalErrors = parsed.errors.filter(e => e.type === 'Quotes' || e.type === 'FieldMismatch');
      if (criticalErrors.length > 0) {
        throw new Error(`CSV parsing error: ${criticalErrors[0].message}`);
      }
    }
    
    // Apply type inference
    let data: unknown = applyTypeInference(parsed.data, settings);
    
    // Apply output format transformation
    switch (settings.outputFormat) {
      case 'keyed':
        data = convertToKeyedObject(data as unknown[]);
        break;
      case 'columns':
        data = convertToColumnArrays(data as unknown[]);
        break;
      case 'nested':
        data = convertToNestedJSON(data as unknown[]);
        break;
      case 'array':
      default:
        // Already in array format
        break;
    }
    
    // Format output
    return formatJSONOutput(data, settings.indentation, settings.sortKeys);
  } catch (error) {
    throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
