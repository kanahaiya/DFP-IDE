/**
 * Export formats for diff results
 */

import { Change, DiffStats } from './diffEngine';
import { PathSegment } from './jsonPath';

export interface JSONPatchOp {
  op: 'add' | 'remove' | 'replace';
  path: string;
  value?: any;
}

export interface DeltaFormat {
  added: Record<string, any>;
  removed: Record<string, any>;
  modified: Record<string, { from: any; to: any }>;
  moved: Record<string, { from: PathSegment[]; to: PathSegment[]; value: any }>;
  typeChanged: Record<string, { from: any; to: any; fromType: string; toType: string }>;
}

/**
 * Generate JSON Patch (RFC 6902) format
 * @param changes - Array of change objects
 * @returns JSON Patch operations
 */
export function generateJSONPatch(changes: Change[]): JSONPatchOp[] {
  const patch: JSONPatchOp[] = [];
  
  changes.forEach(change => {
    const path = '/' + change.path.join('/').replace(/~/g, '~0').replace(/\//g, '~1');
    
    switch (change.type) {
      case 'ADDED':
        patch.push({
          op: 'add',
          path,
          value: change.value,
        });
        break;
        
      case 'REMOVED':
        patch.push({
          op: 'remove',
          path,
        });
        break;
        
      case 'MODIFIED':
      case 'TYPE_CHANGED':
        patch.push({
          op: 'replace',
          path,
          value: change.newValue,
        });
        break;
        
      case 'MOVED':
        // JSON Patch doesn't have move, use remove + add
        if (change.oldPath) {
          const parsedOldPath = change.oldPath.split(/[\.\[\]]/);
          const oldPath = '/' + parsedOldPath.filter(Boolean).join('/').replace(/~/g, '~0').replace(/\//g, '~1');
          patch.push({
            op: 'remove',
            path: oldPath,
          });
        }
        patch.push({
          op: 'add',
          path,
          value: change.value,
        });
        break;
    }
  });
  
  return patch;
}

/**
 * Generate Delta format (grouped by change type)
 * @param changes - Array of change objects
 * @returns Delta format object
 */
export function generateDelta(changes: Change[]): DeltaFormat {
  const delta: DeltaFormat = {
    added: {},
    removed: {},
    modified: {},
    moved: {},
    typeChanged: {},
  };
  
  changes.forEach(change => {
    const jsonPath = change.jsonPath || '$' + change.path.map(p => `[${p}]`).join('');
    
    switch (change.type) {
      case 'ADDED':
        delta.added[jsonPath] = change.value;
        break;
        
      case 'REMOVED':
        delta.removed[jsonPath] = change.value;
        break;
        
      case 'MODIFIED':
        delta.modified[jsonPath] = {
          from: change.oldValue,
          to: change.newValue,
        };
        break;
        
      case 'MOVED':
        delta.moved[jsonPath] = {
          from: change.oldPath ? [change.oldPath] : [],
          to: change.path,
          value: change.value,
        };
        break;
        
      case 'TYPE_CHANGED':
        delta.typeChanged[jsonPath] = {
          from: change.oldValue,
          to: change.newValue,
          fromType: typeof change.oldValue,
          toType: typeof change.newValue,
        };
        break;
    }
  });
  
  return delta;
}

/**
 * Generate unified diff format
 * @param oldJSON - Old JSON string
 * @param newJSON - New JSON string
 * @param oldFileName - Old file name
 * @param newFileName - New file name
 * @returns Unified diff string
 */
export function generateUnifiedDiff(
  oldJSON: string,
  newJSON: string,
  oldFileName: string = 'original.json',
  newFileName: string = 'modified.json'
): string {
  const oldLines = oldJSON.split('\n');
  const newLines = newJSON.split('\n');
  
  let diff = `--- ${oldFileName}\n+++ ${newFileName}\n`;
  
  const maxLen = Math.max(oldLines.length, newLines.length);
  
  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];
    
    if (oldLine === undefined) {
      diff += `+${newLine}\n`;
    } else if (newLine === undefined) {
      diff += `-${oldLine}\n`;
    } else if (oldLine !== newLine) {
      diff += `-${oldLine}\n`;
      diff += `+${newLine}\n`;
    } else {
      diff += ` ${oldLine}\n`;
    }
  }
  
  return diff;
}

/**
 * Escape HTML to prevent XSS attacks
 * @param text - Text to escape
 * @returns Escaped HTML string
 */
function escapeHtml(text: any): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generate HTML report
 * @param changes - Array of change objects
 * @param stats - Statistics object
 * @param options - Options (theme, etc.)
 * @returns HTML string
 */
export function generateHTMLReport(
  changes: Change[],
  stats: DiffStats,
  options: { theme?: 'light' | 'dark' } = {}
): string {
  const { theme = 'light' } = options;
  const isDark = theme === 'dark';
  
  const colors = isDark ? {
    added: '#164b35',
    removed: '#42221f',
    modified: '#332701',
  } : {
    added: '#c3e9c9',
    removed: '#ffc5c5',
    modified: '#fff4c5',
  };
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JSON Diff Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: ${isDark ? '#1f2937' : '#ffffff'};
      color: ${isDark ? '#e5e7eb' : '#1e1e1e'};
    }
    .header {
      border-bottom: 2px solid ${isDark ? '#374151' : '#e5e7eb'};
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    .stat-card {
      padding: 15px;
      border-radius: 8px;
      background: ${isDark ? '#374151' : '#f5f5f5'};
    }
    .stat-label {
      font-size: 12px;
      opacity: 0.7;
      margin-bottom: 5px;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
    }
    .changes {
      margin-top: 30px;
    }
    .change-item {
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 4px;
      border-left: 4px solid;
    }
    .change-added {
      background: ${colors.added};
      border-color: ${isDark ? '#7eebe7' : '#0d7377'};
    }
    .change-removed {
      background: ${colors.removed};
      border-color: ${isDark ? '#f87171' : '#a71c1c'};
    }
    .change-modified {
      background: ${colors.modified};
      border-color: ${isDark ? '#fcd34d' : '#8b6f00'};
    }
    .json-path {
      font-family: 'Courier New', monospace;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .change-value {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      margin-left: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>JSON Diff Report</h1>
    <p>Generated on ${new Date().toLocaleString()}</p>
  </div>
  
  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Total Changes</div>
      <div class="stat-value">${stats.total}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Added</div>
      <div class="stat-value">${stats.added}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Removed</div>
      <div class="stat-value">${stats.removed}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Modified</div>
      <div class="stat-value">${stats.modified}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Type Changed</div>
      <div class="stat-value">${stats.typeChanged}</div>
    </div>
  </div>
  
  <div class="changes">
    <h2>Changes</h2>
    ${changes.map(change => {
      const escapedPath = escapeHtml(change.jsonPath);
      const escapedType = escapeHtml(change.type);
      
      let valueContent;
      if (change.type === 'MODIFIED' || change.type === 'TYPE_CHANGED') {
        const oldVal = escapeHtml(JSON.stringify(change.oldValue));
        const newVal = escapeHtml(JSON.stringify(change.newValue));
        valueContent = `From: ${oldVal} → To: ${newVal}`;
      } else {
        const val = escapeHtml(JSON.stringify(change.value || change.newValue || change.oldValue));
        valueContent = `${escapedType}: ${val}`;
      }
      
      return `
      <div class="change-item change-${change.type.toLowerCase()}">
        <div class="json-path">${escapedPath}</div>
        <div class="change-value">${valueContent}</div>
      </div>`;
    }).join('')}
  </div>
</body>
</html>`;
  
  return html;
}

/**
 * Generate CSV export for changes
 * @param changes - Array of change objects
 * @returns CSV string
 */
export function generateCSV(changes: Change[]): string {
  if (changes.length === 0) {
    return 'No changes found';
  }
  
  const headers = ['Type', 'Path', 'Old Value', 'New Value'];
  const csvRows = [headers.join(',')];
  
  changes.forEach(change => {
    const row = [
      change.type,
      `"${change.jsonPath.replace(/"/g, '""')}"`,
      change.oldValue !== undefined ? `"${JSON.stringify(change.oldValue).replace(/"/g, '""')}"` : '',
      change.newValue !== undefined ? `"${JSON.stringify(change.newValue).replace(/"/g, '""')}"` : change.value !== undefined ? `"${JSON.stringify(change.value).replace(/"/g, '""')}"` : '',
    ];
    
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
}
