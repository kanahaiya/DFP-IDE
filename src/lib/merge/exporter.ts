/**
 * Export functionality for JSON Merge tool
 */

import type {
  MergeSettings,
  ExportSettings,
  JsonValue,
  JsonObject,
  IndentationType,
} from './types';

/**
 * Format JSON output according to settings
 */
export function formatOutput(
  data: JsonValue,
  settings: MergeSettings | ExportSettings
): string {
  if (data === null || data === undefined) {
    return '';
  }
  
  const indentation = settings.indentation;
  const sortKeys = settings.sortKeys;
  
  // Handle minified output
  if (indentation === 'minified') {
    const processed = sortKeys ? sortObjectKeysRecursive(data) : data;
    return JSON.stringify(processed);
  }
  
  // Calculate indent string
  const indentStr = indentation === 'tab' ? '\t' : ' '.repeat(indentation as number);
  
  // Sort keys if requested
  const processed = sortKeys ? sortObjectKeysRecursive(data) : data;
  
  // Format with proper indentation
  return JSON.stringify(processed, null, indentStr);
}

/**
 * Recursively sort object keys
 */
function sortObjectKeysRecursive(value: JsonValue): JsonValue {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map(item => sortObjectKeysRecursive(item));
  }
  
  const sorted: JsonObject = {};
  const keys = Object.keys(value as JsonObject).sort();
  
  for (const key of keys) {
    sorted[key] = sortObjectKeysRecursive((value as JsonObject)[key]);
  }
  
  return sorted;
}

/**
 * Export as downloadable file
 */
export function exportToFile(
  data: JsonValue,
  settings: ExportSettings,
  filename?: string
): void {
  const content = formatOutput(data, settings);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const defaultFilename = `merged-json-${timestamp}.json`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || settings.filename || defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(
  data: JsonValue,
  settings: MergeSettings | ExportSettings
): Promise<boolean> {
  const content = formatOutput(data, settings);
  
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  }
}

/**
 * Get character count of formatted output
 */
export function getCharCount(data: JsonValue, settings: MergeSettings | ExportSettings): number {
  return formatOutput(data, settings).length;
}

/**
 * Get line count of formatted output
 */
export function getLineCount(data: JsonValue, settings: MergeSettings | ExportSettings): number {
  const formatted = formatOutput(data, settings);
  return formatted.split('\n').length;
}

/**
 * Get byte size of formatted output
 */
export function getByteSize(data: JsonValue, settings: MergeSettings | ExportSettings): number {
  const formatted = formatOutput(data, settings);
  return new Blob([formatted]).size;
}

/**
 * Format byte size for display
 */
export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Create preview of merged data (truncated for large outputs)
 */
export function createPreview(
  data: JsonValue,
  settings: MergeSettings | ExportSettings,
  maxLines: number = 1000
): { preview: string; truncated: boolean; totalLines: number } {
  const formatted = formatOutput(data, settings);
  const lines = formatted.split('\n');
  const totalLines = lines.length;
  
  if (totalLines <= maxLines) {
    return {
      preview: formatted,
      truncated: false,
      totalLines,
    };
  }
  
  const preview = lines.slice(0, maxLines).join('\n') + '\n... (truncated)';
  
  return {
    preview,
    truncated: true,
    totalLines,
  };
}

/**
 * Validate indentation value
 */
export function isValidIndentation(value: unknown): value is IndentationType {
  return value === 2 || value === 3 || value === 4 || value === 'tab' || value === 'minified';
}

/**
 * Get indentation display name
 */
export function getIndentationName(indentation: IndentationType): string {
  switch (indentation) {
    case 2: return '2 spaces';
    case 3: return '3 spaces';
    case 4: return '4 spaces';
    case 'tab': return 'Tabs';
    case 'minified': return 'Minified';
    default: return '2 spaces';
  }
}
