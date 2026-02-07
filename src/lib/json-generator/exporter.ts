/**
 * JSON Generator Export Functions
 * Export generated data in various formats
 */

import type { ExportSettings, IndentStyle, SchemaField } from './types';

// ============================================================================
// JSON Export
// ============================================================================

function getIndentation(style: IndentStyle): string | number | undefined {
  switch (style) {
    case '2spaces':
      return 2;
    case '4spaces':
      return 4;
    case 'tabs':
      return '\t';
    case 'minified':
      return undefined;
    default:
      return 2;
  }
}

export function exportToJSON(
  data: Record<string, unknown>[],
  settings: ExportSettings
): string {
  const indent = getIndentation(settings.indent);
  
  if (settings.sortKeys) {
    // Deep sort keys in each record
    const sortedData = data.map(record => sortObjectKeys(record));
    return JSON.stringify(sortedData, null, indent);
  }
  
  return JSON.stringify(data, null, indent);
}

function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  
  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  
  for (const key of keys) {
    sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
  }
  
  return sorted;
}

// ============================================================================
// JSONL Export (JSON Lines)
// ============================================================================

export function exportToJSONL(
  data: Record<string, unknown>[],
  settings: ExportSettings
): string {
  return data
    .map(record => {
      if (settings.sortKeys) {
        return JSON.stringify(sortObjectKeys(record));
      }
      return JSON.stringify(record);
    })
    .join('\n');
}

// ============================================================================
// CSV Export
// ============================================================================

export function exportToCSV(
  data: Record<string, unknown>[]
): string {
  if (data.length === 0) {
    return '';
  }

  // Flatten nested objects
  const flattenedData = data.map(record => flattenObject(record));
  
  // Get all unique headers
  const headersSet = new Set<string>();
  for (const record of flattenedData) {
    Object.keys(record).forEach(key => headersSet.add(key));
  }
  const headers = Array.from(headersSet).sort();
  
  // Create CSV header row
  const headerRow = headers.map(escapeCSVField).join(',');
  
  // Create data rows
  const dataRows = flattenedData.map(record => {
    return headers.map(header => {
      const value = record[header];
      return escapeCSVField(formatCSVValue(value));
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

function flattenObject(
  obj: Record<string, unknown>,
  prefix: string = ''
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else if (Array.isArray(value)) {
      // Convert arrays to JSON string for CSV
      result[newKey] = JSON.stringify(value);
    } else {
      result[newKey] = value;
    }
  }
  
  return result;
}

function formatCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function escapeCSVField(field: string): string {
  // Check if field needs quoting
  if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
    // Escape double quotes by doubling them
    const escaped = field.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  return field;
}

// ============================================================================
// TypeScript Export
// ============================================================================

export function exportToTypeScript(
  data: Record<string, unknown>[],
  schema: SchemaField[],
  settings: ExportSettings
): string {
  const lines: string[] = [];
  
  // Generate TypeScript interface
  if (settings.includeTypes) {
    const interfaceName = 'GeneratedData';
    const interfaceCode = generateTypeScriptInterface(schema, interfaceName);
    lines.push(interfaceCode);
    lines.push('');
  }
  
  // Generate data constant
  const indent = getIndentation(settings.indent);
  const jsonData = settings.sortKeys 
    ? JSON.stringify(data.map(sortObjectKeys), null, indent)
    : JSON.stringify(data, null, indent);
  
  if (settings.includeTypes) {
    lines.push(`export const data: GeneratedData[] = ${jsonData};`);
  } else {
    lines.push(`export const data = ${jsonData};`);
  }
  
  return lines.join('\n');
}

function generateTypeScriptInterface(
  schema: SchemaField[],
  name: string,
  indent: string = ''
): string {
  const lines: string[] = [];
  lines.push(`${indent}export interface ${name} {`);
  
  for (const field of schema) {
    const tsType = getTypeScriptType(field);
    const optional = field.options.nullable ? '?' : '';
    lines.push(`${indent}  ${field.name}${optional}: ${tsType};`);
  }
  
  lines.push(`${indent}}`);
  return lines.join('\n');
}

function getTypeScriptType(field: SchemaField): string {
  const nullSuffix = field.options.nullable ? ' | null' : '';
  
  switch (field.type) {
    // Basic types
    case 'string':
    case 'firstName':
    case 'lastName':
    case 'fullName':
    case 'email':
    case 'phone':
    case 'username':
    case 'avatar':
    case 'streetAddress':
    case 'city':
    case 'state':
    case 'zipCode':
    case 'country':
    case 'countryCode':
    case 'timezone':
    case 'company':
    case 'jobTitle':
    case 'department':
    case 'industry':
    case 'catchPhrase':
    case 'productName':
    case 'creditCard':
    case 'creditCardCVV':
    case 'iban':
    case 'bic':
    case 'currencyCode':
    case 'currencyName':
    case 'transactionId':
    case 'url':
    case 'domain':
    case 'ipv4':
    case 'ipv6':
    case 'mac':
    case 'userAgent':
    case 'color':
    case 'rgb':
    case 'mimeType':
    case 'fileExtension':
    case 'imageUrl':
    case 'uuid':
    case 'objectId':
    case 'alphanumeric':
    case 'slug':
    case 'date':
    case 'datetime':
    case 'past':
    case 'future':
    case 'recent':
    case 'month':
    case 'weekday':
    case 'word':
    case 'words':
    case 'sentence':
    case 'sentences':
    case 'paragraph':
    case 'paragraphs':
    case 'lorem':
    case 'gender':
    case 'birthday':
      return `string${nullSuffix}`;
    
    case 'number':
    case 'age':
    case 'latitude':
    case 'longitude':
    case 'price':
    case 'sequentialId':
    case 'timestamp':
      return `number${nullSuffix}`;
    
    case 'boolean':
      return `boolean${nullSuffix}`;
    
    case 'null':
      return 'null';
    
    case 'enum':
      const enumOpts = field.options as { values?: (string | number | boolean)[] };
      if (enumOpts.values && enumOpts.values.length > 0) {
        const types = enumOpts.values.map(v => 
          typeof v === 'string' ? `'${v}'` : String(v)
        ).join(' | ');
        return `(${types})${nullSuffix}`;
      }
      return `string${nullSuffix}`;
    
    case 'constant':
      const constOpts = field.options as { value?: unknown };
      if (constOpts.value !== undefined) {
        if (typeof constOpts.value === 'string') {
          return `'${constOpts.value}'`;
        }
        return String(constOpts.value);
      }
      return 'unknown';
    
    case 'object':
      if (field.children && field.children.length > 0) {
        const props = field.children.map(child => {
          const childType = getTypeScriptType(child);
          const optional = child.options.nullable ? '?' : '';
          return `${child.name}${optional}: ${childType}`;
        }).join('; ');
        return `{ ${props} }${nullSuffix}`;
      }
      return `Record<string, unknown>${nullSuffix}`;
    
    case 'array':
      if (field.children && field.children.length > 0) {
        const itemType = getTypeScriptType(field.children[0]);
        return `${itemType}[]${nullSuffix}`;
      }
      return `unknown[]${nullSuffix}`;
    
    default:
      return `unknown${nullSuffix}`;
  }
}

// ============================================================================
// Main Export Function
// ============================================================================

export function exportData(
  data: Record<string, unknown>[],
  schema: SchemaField[],
  settings: ExportSettings
): string {
  switch (settings.format) {
    case 'json':
      return exportToJSON(data, settings);
    case 'jsonl':
      return exportToJSONL(data, settings);
    case 'csv':
      return exportToCSV(data);
    case 'typescript':
      return exportToTypeScript(data, schema, settings);
    default:
      return exportToJSON(data, settings);
  }
}

// ============================================================================
// Download Helper
// ============================================================================

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getFileExtension(format: ExportSettings['format']): string {
  switch (format) {
    case 'json':
      return 'json';
    case 'jsonl':
      return 'jsonl';
    case 'csv':
      return 'csv';
    case 'typescript':
      return 'ts';
    default:
      return 'json';
  }
}

export function getMimeType(format: ExportSettings['format']): string {
  switch (format) {
    case 'json':
      return 'application/json';
    case 'jsonl':
      return 'application/x-ndjson';
    case 'csv':
      return 'text/csv';
    case 'typescript':
      return 'text/typescript';
    default:
      return 'application/json';
  }
}
