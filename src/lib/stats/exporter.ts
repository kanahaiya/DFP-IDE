/**
 * Export functionality for JSON Stats tool
 */

import type { JsonStats, ExportSettings, ExportFormat } from './types';
import { DEFAULT_EXPORT_SETTINGS } from './types';

/**
 * Export stats to JSON format
 */
function exportToJSON(stats: JsonStats, settings: ExportSettings): string {
  const exportData: Record<string, unknown> = {};
  
  if (settings.includeSize) {
    exportData.size = stats.size;
  }
  
  if (settings.includeStructure) {
    exportData.structure = stats.structure;
  }
  
  if (settings.includeTypes) {
    exportData.types = stats.types;
  }
  
  if (settings.includeKeys) {
    exportData.keys = stats.keys;
  }
  
  if (settings.includeValues) {
    exportData.values = stats.values;
  }
  
  if (settings.includeQuality) {
    exportData.quality = stats.quality;
  }
  
  exportData.processingTime = stats.processingTime;
  exportData.isValid = stats.isValid;
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Export stats to CSV format
 */
function exportToCSV(stats: JsonStats, settings: ExportSettings): string {
  const rows: string[][] = [];
  
  // Header
  rows.push(['Category', 'Metric', 'Value']);
  
  if (settings.includeSize) {
    rows.push(['Size', 'Bytes', String(stats.size.bytes)]);
    rows.push(['Size', 'Characters', String(stats.size.characters)]);
    rows.push(['Size', 'Lines', String(stats.size.lines)]);
    rows.push(['Size', 'Minified Bytes', String(stats.size.minifiedBytes)]);
  }
  
  if (settings.includeStructure) {
    rows.push(['Structure', 'Max Depth', String(stats.structure.maxDepth)]);
    rows.push(['Structure', 'Total Objects', String(stats.structure.totalObjects)]);
    rows.push(['Structure', 'Total Arrays', String(stats.structure.totalArrays)]);
    rows.push(['Structure', 'Total Keys', String(stats.structure.totalKeys)]);
    rows.push(['Structure', 'Total Values', String(stats.structure.totalValues)]);
    rows.push(['Structure', 'Root Type', stats.structure.rootType]);
  }
  
  if (settings.includeTypes) {
    for (const typeCount of stats.types.counts) {
      rows.push(['Types', typeCount.type, `${typeCount.count} (${typeCount.percentage}%)`]);
    }
  }
  
  if (settings.includeKeys) {
    rows.push(['Keys', 'Unique Keys', String(stats.keys.uniqueKeys)]);
    rows.push(['Keys', 'Total Instances', String(stats.keys.totalKeyInstances)]);
    rows.push(['Keys', 'Average Length', String(stats.keys.averageKeyLength)]);
    rows.push(['Keys', 'Longest Key', stats.keys.longestKey]);
    rows.push(['Keys', 'Shortest Key', stats.keys.shortestKey]);
  }
  
  if (settings.includeValues) {
    rows.push(['Values - Strings', 'Count', String(stats.values.strings.count)]);
    rows.push(['Values - Strings', 'Average Length', String(stats.values.strings.averageLength)]);
    rows.push(['Values - Numbers', 'Count', String(stats.values.numbers.count)]);
    rows.push(['Values - Numbers', 'Min', String(stats.values.numbers.min)]);
    rows.push(['Values - Numbers', 'Max', String(stats.values.numbers.max)]);
    rows.push(['Values - Numbers', 'Average', String(stats.values.numbers.average)]);
    rows.push(['Values - Booleans', 'Count', String(stats.values.booleans.count)]);
    rows.push(['Values - Nulls', 'Count', String(stats.values.nulls.count)]);
  }
  
  if (settings.includeQuality) {
    rows.push(['Quality', 'Score', String(stats.quality.score)]);
    rows.push(['Quality', 'Null Count', String(stats.quality.nullCount)]);
    rows.push(['Quality', 'Empty Strings', String(stats.quality.emptyStringCount)]);
    rows.push(['Quality', 'Empty Arrays', String(stats.quality.emptyArrayCount)]);
    rows.push(['Quality', 'Empty Objects', String(stats.quality.emptyObjectCount)]);
    rows.push(['Quality', 'Issues Count', String(stats.quality.issues.length)]);
  }
  
  rows.push(['Meta', 'Processing Time (ms)', String(stats.processingTime)]);
  
  // Convert to CSV string
  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

/**
 * Export stats to Markdown format
 */
function exportToMarkdown(stats: JsonStats, settings: ExportSettings): string {
  const lines: string[] = [];
  
  lines.push('# JSON Statistics Report');
  lines.push('');
  
  if (settings.includeSize) {
    lines.push('## Size Metrics');
    lines.push('');
    lines.push('| Metric | Value |');
    lines.push('|--------|-------|');
    lines.push(`| Bytes | ${stats.size.bytesFormatted} |`);
    lines.push(`| Characters | ${stats.size.characters.toLocaleString()} |`);
    lines.push(`| Lines | ${stats.size.lines.toLocaleString()} |`);
    lines.push(`| Minified Size | ${stats.size.minifiedFormatted} |`);
    lines.push('');
  }
  
  if (settings.includeStructure) {
    lines.push('## Structure Analysis');
    lines.push('');
    lines.push('| Metric | Value |');
    lines.push('|--------|-------|');
    lines.push(`| Max Depth | ${stats.structure.maxDepth} |`);
    lines.push(`| Total Objects | ${stats.structure.totalObjects.toLocaleString()} |`);
    lines.push(`| Total Arrays | ${stats.structure.totalArrays.toLocaleString()} |`);
    lines.push(`| Total Keys | ${stats.structure.totalKeys.toLocaleString()} |`);
    lines.push(`| Root Type | ${stats.structure.rootType} |`);
    lines.push('');
  }
  
  if (settings.includeTypes) {
    lines.push('## Type Distribution');
    lines.push('');
    lines.push('| Type | Count | Percentage |');
    lines.push('|------|-------|------------|');
    for (const typeCount of stats.types.counts) {
      lines.push(`| ${typeCount.type} | ${typeCount.count.toLocaleString()} | ${typeCount.percentage}% |`);
    }
    lines.push('');
  }
  
  if (settings.includeKeys) {
    lines.push('## Key Analysis');
    lines.push('');
    lines.push('| Metric | Value |');
    lines.push('|--------|-------|');
    lines.push(`| Unique Keys | ${stats.keys.uniqueKeys.toLocaleString()} |`);
    lines.push(`| Total Instances | ${stats.keys.totalKeyInstances.toLocaleString()} |`);
    lines.push(`| Average Length | ${stats.keys.averageKeyLength} |`);
    lines.push(`| Longest Key | \`${stats.keys.longestKey}\` |`);
    lines.push('');
    
    if (stats.keys.topKeys.length > 0) {
      lines.push('### Most Common Keys');
      lines.push('');
      lines.push('| Key | Count |');
      lines.push('|-----|-------|');
      for (const key of stats.keys.topKeys.slice(0, 10)) {
        lines.push(`| \`${key.key}\` | ${key.count} |`);
      }
      lines.push('');
    }
  }
  
  if (settings.includeQuality) {
    lines.push('## Data Quality');
    lines.push('');
    lines.push(`**Quality Score: ${stats.quality.score}/100**`);
    lines.push('');
    lines.push('| Issue Type | Count |');
    lines.push('|------------|-------|');
    lines.push(`| Null Values | ${stats.quality.nullCount} |`);
    lines.push(`| Empty Strings | ${stats.quality.emptyStringCount} |`);
    lines.push(`| Empty Arrays | ${stats.quality.emptyArrayCount} |`);
    lines.push(`| Empty Objects | ${stats.quality.emptyObjectCount} |`);
    lines.push('');
    
    if (stats.quality.suggestions.length > 0) {
      lines.push('### Suggestions');
      lines.push('');
      for (const suggestion of stats.quality.suggestions) {
        lines.push(`- ${suggestion}`);
      }
      lines.push('');
    }
  }
  
  lines.push('---');
  lines.push(`*Generated in ${stats.processingTime}ms*`);
  
  return lines.join('\n');
}

/**
 * Export stats to specified format
 */
export function exportStats(
  stats: JsonStats,
  settings: Partial<ExportSettings> = {}
): string {
  const fullSettings: ExportSettings = {
    ...DEFAULT_EXPORT_SETTINGS,
    ...settings,
  };
  
  switch (fullSettings.format) {
    case 'csv':
      return exportToCSV(stats, fullSettings);
    case 'markdown':
      return exportToMarkdown(stats, fullSettings);
    case 'json':
    default:
      return exportToJSON(stats, fullSettings);
  }
}

/**
 * Get file extension for format
 */
export function getFileExtension(format: ExportFormat): string {
  switch (format) {
    case 'csv':
      return '.csv';
    case 'markdown':
      return '.md';
    case 'json':
    default:
      return '.json';
  }
}

/**
 * Get MIME type for format
 */
export function getMimeType(format: ExportFormat): string {
  switch (format) {
    case 'csv':
      return 'text/csv';
    case 'markdown':
      return 'text/markdown';
    case 'json':
    default:
      return 'application/json';
  }
}

/**
 * Download stats as file
 */
export function downloadStats(
  stats: JsonStats,
  settings: Partial<ExportSettings> = {},
  filename?: string
): void {
  const fullSettings: ExportSettings = {
    ...DEFAULT_EXPORT_SETTINGS,
    ...settings,
  };
  
  const content = exportStats(stats, fullSettings);
  const mimeType = getMimeType(fullSettings.format);
  const extension = getFileExtension(fullSettings.format);
  const finalFilename = filename || `json-stats${extension}`;
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = finalFilename;
  a.click();
  
  URL.revokeObjectURL(url);
}
