/**
 * Utility to map JSON changes to Monaco Editor line decorations
 */

import { Change } from './diffEngine';
import { buildJSONPath, parseJSONPath } from './jsonPath';

export type DiffLineType = 'ADDED' | 'REMOVED' | 'MODIFIED' | 'TYPE_CHANGED' | 'MOVED';

export interface LineDiffInfo {
  lineNumber: number;
  type: DiffLineType;
}

export interface MonacoDecoration {
  range: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
  options: {
    isWholeLine: boolean;
    className: string;
    glyphMarginClassName?: string;
    glyphMarginHoverMessage?: { value: string };
    hoverMessage?: { value: string };
  };
}

/**
 * Build a map of JSONPath to line numbers by parsing the JSON structure
 * Uses a stack-based approach to properly track nested objects and arrays
 * @param jsonText - Formatted JSON text
 * @returns Map of JSONPath to line number
 */
export function buildPathToLineMap(jsonText: string): Map<string, number> {
  const map = new Map<string, number>();
  if (!jsonText || !jsonText.trim()) return map;
  
  const lines = jsonText.split('\n');
  
  // Stack to track current path context
  // Each entry: { type: 'object' | 'array', path: string, arrayIndex: number }
  const stack: Array<{ type: 'object' | 'array'; path: string; arrayIndex: number }> = [];
  
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const trimmed = line.trim();
    const lineNum = lineIdx + 1;
    
    if (!trimmed) continue;
    
    // Check for key: value pattern
    const keyMatch = trimmed.match(/^"([^"\\]*(?:\\.[^"\\]*)*)"\s*:/);
    
    if (keyMatch) {
      const key = keyMatch[1];
      
      // Build the full path for this key
      let parentPath = '$';
      if (stack.length > 0) {
        const parent = stack[stack.length - 1];
        if (parent.type === 'array') {
          parentPath = `${parent.path}[${parent.arrayIndex}]`;
        } else {
          parentPath = parent.path;
        }
      }
      
      const fullPath = parentPath === '$' ? `$.${key}` : `${parentPath}.${key}`;
      const bracketPath = parentPath === '$' ? `$['${key}']` : `${parentPath}['${key}']`;
      
      map.set(fullPath, lineNum);
      map.set(bracketPath, lineNum);
      
      // Check what comes after the colon
      const afterColon = trimmed.substring(keyMatch[0].length).trim();
      
      if (afterColon.startsWith('{')) {
        // Object value - push to stack
        stack.push({ type: 'object', path: fullPath, arrayIndex: -1 });
        // Check if object closes on same line
        if (afterColon.includes('}')) {
          stack.pop();
        }
      } else if (afterColon.startsWith('[')) {
        // Array value - push to stack
        stack.push({ type: 'array', path: fullPath, arrayIndex: 0 });
        // Check if array closes on same line
        if (afterColon.includes(']')) {
          stack.pop();
        }
      }
      // Primitive values don't affect the stack
      
    } else {
      // Not a key: value line
      // Could be: opening brace/bracket, closing brace/bracket, array element, or standalone value
      
      // Handle array elements (values without keys)
      if (stack.length > 0) {
        const parent = stack[stack.length - 1];
        
        if (parent.type === 'array') {
          // This could be an array element
          const isClosingOnly = /^[\]\},\s]*$/.test(trimmed);
          
          if (!isClosingOnly && !trimmed.startsWith(']') && !trimmed.startsWith('}')) {
            // This is an array element
            const elementPath = `${parent.path}[${parent.arrayIndex}]`;
            map.set(elementPath, lineNum);
            
            if (trimmed.startsWith('{')) {
              // Object in array
              stack.push({ type: 'object', path: elementPath, arrayIndex: -1 });
              if (!trimmed.endsWith('{') && trimmed.includes('}')) {
                // Object closes on same line
                stack.pop();
                parent.arrayIndex++;
              }
            } else if (trimmed.startsWith('[')) {
              // Nested array
              stack.push({ type: 'array', path: elementPath, arrayIndex: 0 });
              if (trimmed.includes(']')) {
                stack.pop();
                parent.arrayIndex++;
              }
            } else {
              // Primitive array element
              parent.arrayIndex++;
            }
          }
        }
      }
    }
    
    // Handle closing braces/brackets
    // Count closings that aren't part of a key:value on this line
    let closeCount = 0;
    let inString = false;
    let escaped = false;
    
    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i];
      
      if (escaped) {
        escaped = false;
        continue;
      }
      
      if (char === '\\') {
        escaped = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '}' || char === ']') {
          closeCount++;
        }
      }
    }
    
    // Pop stack for each closing
    for (let i = 0; i < closeCount; i++) {
      if (stack.length > 0) {
        stack.pop();
        // If parent is an array, increment its index
        if (stack.length > 0 && stack[stack.length - 1].type === 'array') {
          stack[stack.length - 1].arrayIndex++;
        }
      }
    }
  }
  
  return map;
}

/**
 * Get CSS class name for decoration based on change type and side
 * @param changeType - Type of change
 * @param side - 'left' or 'right'
 * @returns CSS class name
 */
function getDecorationClass(changeType: string, side: 'left' | 'right'): string {
  const baseClass = 'diff-decoration-';
  
  if (side === 'left') {
    switch (changeType) {
      case 'REMOVED':
        return baseClass + 'removed-left';
      case 'MOVED':
        return baseClass + 'moved-left';
      case 'MODIFIED':
        return baseClass + 'modified-left';
      case 'TYPE_CHANGED':
        return baseClass + 'type-changed-left';
      default:
        return '';
    }
  } else {
    switch (changeType) {
      case 'ADDED':
        return baseClass + 'added-right';
      case 'MOVED':
        return baseClass + 'moved-right';
      case 'MODIFIED':
        return baseClass + 'modified-right';
      case 'TYPE_CHANGED':
        return baseClass + 'type-changed-right';
      default:
        return '';
    }
  }
}

/**
 * Get glyph margin class for change indicators
 * @param changeType - Type of change
 * @param side - 'left' or 'right'
 * @returns CSS class name
 */
function getGlyphMarginClass(changeType: string, side: 'left' | 'right'): string {
  return 'diff-glyph-' + changeType.toLowerCase() + '-' + side;
}

/**
 * Get decorations for changes in JSON text
 * @param jsonText - Formatted JSON text
 * @param changes - Array of change objects
 * @param side - 'left' or 'right'
 * @param options - Optional settings
 * @returns Array of Monaco decorations
 */
export function getDecorationsForChanges(
  jsonText: string,
  changes: Change[],
  side: 'left' | 'right',
  options?: { showGlyphMargin?: boolean }
): MonacoDecoration[] {
  if (!jsonText || !changes || changes.length === 0) return [];
  
  const showGlyphMargin = options?.showGlyphMargin ?? true;

  const lines = jsonText.split('\n');
  const decorations: MonacoDecoration[] = [];
  
  // Build path to line map
  const pathToLineMap = buildPathToLineMap(jsonText);
  
  // Track decorated lines
  const decoratedLines = new Map<number, string>();
  
  changes.forEach((change) => {
    // Skip if this change doesn't apply to this side
    // ADDED: Only show in right editor (where the new value appears)
    if (side === 'left' && change.type === 'ADDED') return;
    
    // REMOVED: Only show in left editor (where the old value was)
    if (side === 'right' && change.type === 'REMOVED') return;
    
    // Determine path to use
    let pathToUse = change.jsonPath;
    if (change.type === 'MOVED') {
      if (side === 'left' && change.oldPath) {
        pathToUse = change.oldPath;
      } else if (side === 'right' && change.newPath) {
        pathToUse = change.newPath;
      }
    } else if ((change.type === 'MODIFIED' || change.type === 'TYPE_CHANGED') && 
               change.oldIndex !== undefined && change.newIndex !== undefined) {
      const pathParts = change.path || parseJSONPath(change.jsonPath || '');
      const adjustedPathParts = [...pathParts];
      
      let arrayIndexPosition = -1;
      for (let i = 0; i < pathParts.length; i++) {
        if (typeof pathParts[i] === 'number') {
          arrayIndexPosition = i;
          break;
        }
      }
      
      if (arrayIndexPosition >= 0) {
        adjustedPathParts[arrayIndexPosition] = side === 'left' ? change.oldIndex : change.newIndex;
        pathToUse = buildJSONPath(adjustedPathParts);
      }
    }
    
    // Try to find line number
    let lineNumber = pathToLineMap.get(pathToUse);
    
    // Try alternate formats
    if (!lineNumber) {
      const normalizedPaths = [
        pathToUse.replace(/\['([^']+)'\]/g, '.$1'),
        pathToUse.replace(/\.([a-zA-Z_][a-zA-Z0-9_]*)/g, "['$1']"),
      ];
      
      for (const path of normalizedPaths) {
        lineNumber = pathToLineMap.get(path);
        if (lineNumber) break;
      }
    }
    
    if (lineNumber) {
      // Check if line already has a decoration
      const existingDecoration = decoratedLines.get(lineNumber);
      if (existingDecoration) {
        const priority: Record<string, number> = {
          'TYPE_CHANGED': 3,
          'MODIFIED': 2,
          'ADDED': 1,
          'REMOVED': 1,
          'MOVED': 1,
        };
        const currentPriority = priority[change.type] || 0;
        const existingPriority = priority[existingDecoration] || 0;
        
        if (currentPriority <= existingPriority) {
          return;
        }
      }
      
      const line = lines[lineNumber - 1];
      decoratedLines.set(lineNumber, change.type);
      
      const hoverValue = change.type === 'MOVED' 
        ? `MOVED from index ${change.oldIndex} to ${change.newIndex}\nOld path: ${change.oldPath}\nNew path: ${change.newPath}\nValue: ${JSON.stringify(change.value)}`
        : change.type === 'MODIFIED' || change.type === 'TYPE_CHANGED' 
          ? `${change.type} at ${pathToUse}\nOld: ${JSON.stringify(change.oldValue)}\nNew: ${JSON.stringify(change.newValue)}`
          : `${change.type} at ${pathToUse}\nValue: ${JSON.stringify(change.value || change.newValue || change.oldValue)}`;
      
      decorations.push({
        range: {
          startLineNumber: lineNumber,
          startColumn: 1,
          endLineNumber: lineNumber,
          endColumn: (line?.length || 0) + 1,
        },
        options: {
          isWholeLine: true,
          className: getDecorationClass(change.type, side),
          // Only include glyph margin decorations when enabled
          ...(showGlyphMargin ? {
            glyphMarginClassName: getGlyphMarginClass(change.type, side),
            glyphMarginHoverMessage: { value: `${change.type}: ${pathToUse}` },
          } : {}),
          hoverMessage: { value: hoverValue },
        },
      });
    }
  });
  
  return decorations;
}

/**
 * Extract line diff information from decorations for PNG export
 * @param decorations - Monaco decorations
 * @returns Array of line diff info
 */
export function extractLineDiffs(decorations: MonacoDecoration[]): LineDiffInfo[] {
  const lineDiffs: LineDiffInfo[] = [];
  
  for (const dec of decorations) {
    const lineNumber = dec.range.startLineNumber;
    const className = dec.options.className || '';
    
    // Extract diff type from class name
    let diffType: DiffLineType | null = null;
    
    if (className.includes('added')) {
      diffType = 'ADDED';
    } else if (className.includes('removed')) {
      diffType = 'REMOVED';
    } else if (className.includes('modified')) {
      diffType = 'MODIFIED';
    } else if (className.includes('type-changed')) {
      diffType = 'TYPE_CHANGED';
    } else if (className.includes('moved')) {
      diffType = 'MOVED';
    }
    
    if (diffType) {
      lineDiffs.push({ lineNumber, type: diffType });
    }
  }
  
  return lineDiffs;
}
