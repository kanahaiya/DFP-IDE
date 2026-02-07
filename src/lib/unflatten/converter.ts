/**
 * JSON Unflatten - Convert flattened JSON back to nested structure
 * All processing is client-side with no server dependencies
 */

export type DelimiterType = 'dot' | 'underscore' | 'custom';
export type ConflictMode = 'strict' | 'lastWins' | 'preserveFirst';

export interface UnflattenSettings {
  delimiter: DelimiterType;
  customDelimiter: string;
  autoDetectArrays: boolean;
  forceArrayConversion: boolean;
  conflictMode: ConflictMode;
  preserveNumbers: boolean;
  preserveBooleans: boolean;
  preserveNull: boolean;
  formatOutput: boolean;
  indentation: 2 | 4 | 'tab';
  sortKeys: boolean;
}

export const DEFAULT_UNFLATTEN_SETTINGS: UnflattenSettings = {
  delimiter: 'dot',
  customDelimiter: '',
  autoDetectArrays: true,
  forceArrayConversion: false,
  conflictMode: 'lastWins',
  preserveNumbers: true,
  preserveBooleans: true,
  preserveNull: true,
  formatOutput: true,
  indentation: 2,
  sortKeys: false,
};

export type UnflattenResult = {
  success: true;
  output: string;
  stats: {
    inputKeys: number;
    outputDepth: number;
    arraysCreated: number;
    conflictsResolved: number;
  };
} | {
  success: false;
  error: string;
};

/**
 * Get the delimiter string based on delimiter type
 */
function getDelimiter(type: DelimiterType, custom: string): string {
  switch (type) {
    case 'dot':
      return '.';
    case 'underscore':
      return '_';
    case 'custom':
      return custom || '.';
    default:
      return '.';
  }
}

/**
 * Parse a flat key into path segments
 * Handles both dot notation and bracket notation
 */
function parseKeyPath(key: string, delimiter: string): (string | number)[] {
  const parts: (string | number)[] = [];
  let current = '';
  let inBracket = false;
  
  for (let i = 0; i < key.length; i++) {
    const char = key[i];
    
    if (char === '[') {
      if (current) {
        parts.push(current);
        current = '';
      }
      inBracket = true;
    } else if (char === ']') {
      if (current) {
        // Check if it's a numeric index
        const num = parseInt(current, 10);
        if (!isNaN(num) && String(num) === current) {
          parts.push(num);
        } else {
          parts.push(current);
        }
        current = '';
      }
      inBracket = false;
    } else if (!inBracket && char === delimiter) {
      if (current) {
        parts.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  
  if (current) {
    parts.push(current);
  }
  
  return parts;
}

/**
 * Check if a value should be treated as an array index
 */
function isArrayIndex(key: string | number, forceArrayConversion: boolean): boolean {
  if (typeof key === 'number') return true;
  if (!forceArrayConversion) return false;
  
  const num = parseInt(key, 10);
  return !isNaN(num) && String(num) === key && num >= 0;
}

/**
 * Transform string values based on type preservation settings
 */
function transformValue(
  value: unknown,
  settings: UnflattenSettings
): unknown {
  if (typeof value !== 'string') return value;
  
  // Preserve null
  if (settings.preserveNull && value === 'null') {
    return null;
  }
  
  // Preserve booleans
  if (settings.preserveBooleans) {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  
  // Preserve numbers
  if (settings.preserveNumbers) {
    const num = Number(value);
    if (!isNaN(num) && value.trim() !== '' && isFinite(num)) {
      // Check if it's an integer or float
      if (String(num) === value || String(num) === value.trim()) {
        return num;
      }
    }
  }
  
  return value;
}

/**
 * Sort object keys recursively
 */
function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  
  return obj;
}

/**
 * Calculate the depth of a nested structure
 */
function calculateDepth(obj: unknown, currentDepth: number = 0): number {
  if (typeof obj !== 'object' || obj === null) {
    return currentDepth;
  }
  
  let maxDepth = currentDepth;
  const values = Array.isArray(obj) ? obj : Object.values(obj);
  
  for (const value of values) {
    const depth = calculateDepth(value, currentDepth + 1);
    maxDepth = Math.max(maxDepth, depth);
  }
  
  return maxDepth;
}

/**
 * Count arrays in a nested structure
 */
function countArrays(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) {
    return 0;
  }
  
  let count = 0;
  const stack: unknown[] = [obj];
  
  while (stack.length > 0) {
    const current = stack.pop();
    if (Array.isArray(current)) {
      count++;
      stack.push(...current);
    } else if (typeof current === 'object' && current !== null) {
      stack.push(...Object.values(current));
    }
  }
  
  return count;
}

/**
 * Main unflattening function
 */
export function unflattenJSON(input: string, settings: Partial<UnflattenSettings>): UnflattenResult {
  const mergedSettings: UnflattenSettings = { ...DEFAULT_UNFLATTEN_SETTINGS, ...settings };
  
  if (!input || !input.trim()) {
    return { success: false, error: 'Input is empty' };
  }
  
  let parsed: Record<string, unknown>;
  try {
    const result = JSON.parse(input);
    if (typeof result !== 'object' || result === null || Array.isArray(result)) {
      return { success: false, error: 'Input must be a flat JSON object' };
    }
    parsed = result;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid JSON';
    return { success: false, error: `Invalid JSON: ${message}` };
  }
  
  const delimiter = getDelimiter(mergedSettings.delimiter, mergedSettings.customDelimiter);
  const result: Record<string, unknown> = {};
  let conflictsResolved = 0;
  const inputKeys = Object.keys(parsed).length;
  
  for (const [flatKey, value] of Object.entries(parsed)) {
    const path = parseKeyPath(flatKey, delimiter);
    
    if (path.length === 0) continue;
    
    let current: Record<string, unknown> | unknown[] = result;
    
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      const nextKey = path[i + 1];
      const isNextArray = isArrayIndex(nextKey, mergedSettings.forceArrayConversion) || 
        (mergedSettings.autoDetectArrays && typeof nextKey === 'number');
      
      if (Array.isArray(current)) {
        const idx = typeof key === 'number' ? key : parseInt(String(key), 10);
        if (current[idx] === undefined) {
          current[idx] = isNextArray ? [] : {};
        } else if (typeof current[idx] !== 'object' || current[idx] === null) {
          // Conflict: existing value is not an object
          if (mergedSettings.conflictMode === 'strict') {
            return { success: false, error: `Key conflict at path: ${path.slice(0, i + 1).join('.')}` };
          }
          if (mergedSettings.conflictMode === 'lastWins') {
            current[idx] = isNextArray ? [] : {};
            conflictsResolved++;
          }
          // preserveFirst: do nothing, keep existing
        }
        current = current[idx] as Record<string, unknown> | unknown[];
      } else {
        const keyStr = String(key);
        if (current[keyStr] === undefined) {
          current[keyStr] = isNextArray ? [] : {};
        } else if (typeof current[keyStr] !== 'object' || current[keyStr] === null) {
          // Conflict: existing value is not an object
          if (mergedSettings.conflictMode === 'strict') {
            return { success: false, error: `Key conflict at path: ${path.slice(0, i + 1).join('.')}` };
          }
          if (mergedSettings.conflictMode === 'lastWins') {
            current[keyStr] = isNextArray ? [] : {};
            conflictsResolved++;
          }
          // preserveFirst: do nothing, keep existing
        }
        current = current[keyStr] as Record<string, unknown> | unknown[];
      }
    }
    
    // Set the final value
    const lastKey = path[path.length - 1];
    const transformedValue = transformValue(value, mergedSettings);
    
    if (Array.isArray(current)) {
      const idx = typeof lastKey === 'number' ? lastKey : parseInt(String(lastKey), 10);
      if (current[idx] !== undefined && mergedSettings.conflictMode !== 'lastWins') {
        if (mergedSettings.conflictMode === 'strict') {
          return { success: false, error: `Key conflict at path: ${path.join('.')}` };
        }
        // preserveFirst: skip
      } else {
        current[idx] = transformedValue;
      }
    } else {
      const keyStr = String(lastKey);
      if (current[keyStr] !== undefined && mergedSettings.conflictMode !== 'lastWins') {
        if (mergedSettings.conflictMode === 'strict') {
          return { success: false, error: `Key conflict at path: ${path.join('.')}` };
        }
        // preserveFirst: skip
      } else {
        current[keyStr] = transformedValue;
      }
    }
  }
  
  // Sort keys if requested
  const finalResult = mergedSettings.sortKeys ? sortObjectKeys(result) : result;
  
  // Format output
  try {
    let indent: string | number | undefined;
    if (mergedSettings.formatOutput) {
      indent = mergedSettings.indentation === 'tab' ? '\t' : mergedSettings.indentation;
    }
    
    const output = JSON.stringify(finalResult, null, indent);
    const outputDepth = calculateDepth(finalResult);
    const arraysCreated = countArrays(finalResult);
    
    return {
      success: true,
      output,
      stats: {
        inputKeys,
        outputDepth,
        arraysCreated,
        conflictsResolved,
      },
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to stringify result';
    return { success: false, error: message };
  }
}

/**
 * Get delimiter type display name
 */
export function getDelimiterName(type: DelimiterType): string {
  const names: Record<DelimiterType, string> = {
    dot: 'Dot (.)',
    underscore: 'Underscore (_)',
    custom: 'Custom',
  };
  return names[type] || type;
}

/**
 * Get all delimiter types
 */
export function getDelimiterTypes(): { value: DelimiterType; label: string; description: string }[] {
  return [
    { 
      value: 'dot', 
      label: 'Dot (.)', 
      description: 'Standard dot notation (user.name)'
    },
    { 
      value: 'underscore', 
      label: 'Underscore (_)', 
      description: 'Underscore notation (user_name)'
    },
    { 
      value: 'custom', 
      label: 'Custom', 
      description: 'Use a custom delimiter'
    },
  ];
}

/**
 * Get conflict mode display name
 */
export function getConflictModeName(mode: ConflictMode): string {
  const names: Record<ConflictMode, string> = {
    strict: 'Strict (Error on Conflict)',
    lastWins: 'Last-Write-Wins',
    preserveFirst: 'Preserve First',
  };
  return names[mode] || mode;
}

/**
 * Get all conflict modes
 */
export function getConflictModes(): { value: ConflictMode; label: string; description: string }[] {
  return [
    { 
      value: 'lastWins', 
      label: 'Last-Write-Wins', 
      description: 'Later values overwrite earlier ones'
    },
    { 
      value: 'preserveFirst', 
      label: 'Preserve First', 
      description: 'Keep first encountered value'
    },
    { 
      value: 'strict', 
      label: 'Strict', 
      description: 'Error on key conflicts'
    },
  ];
}

/**
 * Auto-detect delimiter from input
 */
export function detectDelimiter(input: string): DelimiterType {
  try {
    const parsed = JSON.parse(input);
    if (typeof parsed !== 'object' || parsed === null) return 'dot';
    
    const keys = Object.keys(parsed);
    
    // Count delimiter occurrences
    let dotCount = 0;
    let underscoreCount = 0;
    
    for (const key of keys) {
      // Don't count delimiters inside brackets
      const withoutBrackets = key.replace(/\[[^\]]*\]/g, '');
      dotCount += (withoutBrackets.match(/\./g) || []).length;
      underscoreCount += (withoutBrackets.match(/_/g) || []).length;
    }
    
    if (underscoreCount > dotCount) return 'underscore';
    return 'dot';
  } catch {
    return 'dot';
  }
}
