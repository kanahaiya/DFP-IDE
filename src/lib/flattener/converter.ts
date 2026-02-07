/**
 * JSON Flattener - Convert nested JSON to flat key-value pairs
 * All processing is client-side with no server dependencies
 */

export type NotationType = 'dot' | 'bracket' | 'underscore' | 'slash';
export type ArrayStrategy = 'index' | 'expand' | 'concatenate' | 'preserve';

export interface FlattenerSettings {
  notation: NotationType;
  arrayStrategy: ArrayStrategy;
  maxDepth: number;
  ignoreNulls: boolean;
  ignoreEmpty: boolean;
  safeMode: boolean;
  customSeparator: string;
  preserveTypes: boolean;
  concatenateDelimiter: string;
}

export const DEFAULT_FLATTENER_SETTINGS: FlattenerSettings = {
  notation: 'dot',
  arrayStrategy: 'index',
  maxDepth: Infinity,
  ignoreNulls: false,
  ignoreEmpty: false,
  safeMode: false,
  customSeparator: '',
  preserveTypes: true,
  concatenateDelimiter: ',',
};

export type FlattenerResult = {
  success: true;
  output: string;
  stats: {
    inputKeys: number;
    outputKeys: number;
    maxDepth: number;
    arraysFlattened: number;
  };
} | {
  success: false;
  error: string;
};

/**
 * Get the separator based on notation type
 */
function getSeparator(notation: NotationType, customSeparator: string): string {
  if (customSeparator) return customSeparator;
  
  switch (notation) {
    case 'dot':
      return '.';
    case 'underscore':
      return '_';
    case 'slash':
      return '/';
    case 'bracket':
      return ''; // bracket notation doesn't use separator
    default:
      return '.';
  }
}

/**
 * Format key based on notation type
 */
function formatKey(
  parentKey: string,
  key: string,
  isArrayIndex: boolean,
  notation: NotationType,
  separator: string,
  safeMode: boolean
): string {
  // Escape special characters in safe mode
  let safeKey = key;
  if (safeMode && !isArrayIndex) {
    safeKey = key.replace(/[.[\]\/\\]/g, '_');
  }
  
  if (!parentKey) {
    if (notation === 'bracket' && isArrayIndex) {
      return `[${safeKey}]`;
    }
    return safeKey;
  }
  
  if (notation === 'bracket') {
    if (isArrayIndex) {
      return `${parentKey}[${safeKey}]`;
    }
    return `${parentKey}[${safeKey}]`;
  }
  
  return `${parentKey}${separator}${safeKey}`;
}

/**
 * Check if value is empty (empty string, array, or object)
 */
function isEmpty(value: unknown): boolean {
  if (value === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * Count keys in a nested object
 */
function countKeys(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) return 0;
  
  let count = 0;
  const stack: unknown[] = [obj];
  
  while (stack.length > 0) {
    const current = stack.pop();
    if (typeof current === 'object' && current !== null) {
      const keys = Object.keys(current);
      count += keys.length;
      for (const key of keys) {
        stack.push((current as Record<string, unknown>)[key]);
      }
    }
  }
  
  return count;
}

/**
 * Main flattening function
 */
export function flattenJSON(input: string, settings: Partial<FlattenerSettings>): FlattenerResult {
  const mergedSettings: FlattenerSettings = { ...DEFAULT_FLATTENER_SETTINGS, ...settings };
  
  if (!input || !input.trim()) {
    return { success: false, error: 'Input is empty' };
  }
  
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid JSON';
    return { success: false, error: `Invalid JSON: ${message}` };
  }
  
  if (typeof parsed !== 'object' || parsed === null) {
    return { success: false, error: 'Input must be a JSON object or array' };
  }
  
  const separator = getSeparator(mergedSettings.notation, mergedSettings.customSeparator);
  const result: Record<string, unknown> = {};
  let maxDepthReached = 0;
  let arraysFlattened = 0;
  const inputKeys = countKeys(parsed);
  
  function recurse(current: unknown, path: string, depth: number): void {
    maxDepthReached = Math.max(maxDepthReached, depth);
    
    // Check max depth
    if (depth >= mergedSettings.maxDepth) {
      if (mergedSettings.ignoreNulls && (current === null || current === undefined)) return;
      if (mergedSettings.ignoreEmpty && isEmpty(current)) return;
      result[path] = current;
      return;
    }
    
    // Handle null/undefined
    if (current === null || current === undefined) {
      if (!mergedSettings.ignoreNulls) {
        result[path] = current;
      }
      return;
    }
    
    // Handle arrays
    if (Array.isArray(current)) {
      if (current.length === 0) {
        if (!mergedSettings.ignoreEmpty) {
          result[path] = mergedSettings.preserveTypes ? [] : '[]';
        }
        return;
      }
      
      arraysFlattened++;
      
      switch (mergedSettings.arrayStrategy) {
        case 'preserve':
          result[path] = mergedSettings.preserveTypes ? current : JSON.stringify(current);
          break;
          
        case 'concatenate':
          // Only concatenate primitive values
          const primitives = current.filter(
            (v) => typeof v !== 'object' || v === null
          );
          if (primitives.length === current.length) {
            result[path] = primitives.join(mergedSettings.concatenateDelimiter);
          } else {
            // Fall back to index for mixed arrays
            current.forEach((item, index) => {
              const key = formatKey(path, String(index), true, mergedSettings.notation, separator, mergedSettings.safeMode);
              recurse(item, key, depth + 1);
            });
          }
          break;
          
        case 'expand':
          // Create separate keys for each element with value suffix
          current.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              const key = formatKey(path, String(index), true, mergedSettings.notation, separator, mergedSettings.safeMode);
              recurse(item, key, depth + 1);
            } else {
              const key = formatKey(path, String(index), true, mergedSettings.notation, separator, mergedSettings.safeMode);
              if (!(mergedSettings.ignoreNulls && (item === null || item === undefined))) {
                if (!(mergedSettings.ignoreEmpty && isEmpty(item))) {
                  result[key] = item;
                }
              }
            }
          });
          break;
          
        case 'index':
        default:
          current.forEach((item, index) => {
            const key = formatKey(path, String(index), true, mergedSettings.notation, separator, mergedSettings.safeMode);
            recurse(item, key, depth + 1);
          });
          break;
      }
      return;
    }
    
    // Handle objects
    if (typeof current === 'object') {
      const keys = Object.keys(current as Record<string, unknown>);
      
      if (keys.length === 0) {
        if (!mergedSettings.ignoreEmpty) {
          result[path] = mergedSettings.preserveTypes ? {} : '{}';
        }
        return;
      }
      
      for (const key of keys) {
        const value = (current as Record<string, unknown>)[key];
        const newPath = formatKey(path, key, false, mergedSettings.notation, separator, mergedSettings.safeMode);
        recurse(value, newPath, depth + 1);
      }
      return;
    }
    
    // Handle primitives
    if (mergedSettings.ignoreEmpty && isEmpty(current)) return;
    result[path] = current;
  }
  
  // Start recursion
  if (Array.isArray(parsed)) {
    parsed.forEach((item, index) => {
      const key = formatKey('', String(index), true, mergedSettings.notation, separator, mergedSettings.safeMode);
      recurse(item, key, 1);
    });
  } else {
    for (const key of Object.keys(parsed as Record<string, unknown>)) {
      const value = (parsed as Record<string, unknown>)[key];
      recurse(value, key, 1);
    }
  }
  
  try {
    const output = JSON.stringify(result, null, 2);
    
    return {
      success: true,
      output,
      stats: {
        inputKeys,
        outputKeys: Object.keys(result).length,
        maxDepth: maxDepthReached,
        arraysFlattened,
      },
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to stringify result';
    return { success: false, error: message };
  }
}

/**
 * Get notation type display name
 */
export function getNotationName(notation: NotationType): string {
  const names: Record<NotationType, string> = {
    dot: 'Dot Notation',
    bracket: 'Bracket Notation',
    underscore: 'Underscore Notation',
    slash: 'Path (Slash) Notation',
  };
  return names[notation] || notation;
}

/**
 * Get all notation types
 */
export function getNotationTypes(): { value: NotationType; label: string; description: string; example: string }[] {
  return [
    { 
      value: 'dot', 
      label: 'Dot Notation', 
      description: 'Standard dot-separated keys',
      example: 'user.address.city'
    },
    { 
      value: 'bracket', 
      label: 'Bracket Notation', 
      description: 'Keys in square brackets',
      example: 'user[address][city]'
    },
    { 
      value: 'underscore', 
      label: 'Underscore Notation', 
      description: 'Underscore-separated keys',
      example: 'user_address_city'
    },
    { 
      value: 'slash', 
      label: 'Path (Slash) Notation', 
      description: 'Path-style forward slash keys',
      example: 'user/address/city'
    },
  ];
}

/**
 * Get array strategy display name
 */
export function getArrayStrategyName(strategy: ArrayStrategy): string {
  const names: Record<ArrayStrategy, string> = {
    index: 'Index-Based',
    expand: 'Expand All',
    concatenate: 'Concatenate',
    preserve: 'Preserve Arrays',
  };
  return names[strategy] || strategy;
}

/**
 * Get all array strategies
 */
export function getArrayStrategies(): { value: ArrayStrategy; label: string; description: string }[] {
  return [
    { 
      value: 'index', 
      label: 'Index-Based', 
      description: 'Use numeric indices for array elements'
    },
    { 
      value: 'expand', 
      label: 'Expand All', 
      description: 'Create separate keys for each array element'
    },
    { 
      value: 'concatenate', 
      label: 'Concatenate', 
      description: 'Join array values with delimiter'
    },
    { 
      value: 'preserve', 
      label: 'Preserve Arrays', 
      description: 'Keep arrays as-is in output'
    },
  ];
}
