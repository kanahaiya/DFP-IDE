/**
 * JSON Unescaper - Unescape JSON strings to readable format
 * All processing is client-side with no server dependencies
 */

export type UnescapeMode = 'auto' | 'jsonString' | 'singleLayer' | 'multiLayer';

export interface UnescaperSettings {
  unescapeMode: UnescapeMode;
  formatOutput: boolean;
  indentation: 2 | 4 | 'tab';
  sortKeys: boolean;
  maxDepth: number;
  removeOuterQuotes: boolean;
}

export const DEFAULT_UNESCAPER_SETTINGS: UnescaperSettings = {
  unescapeMode: 'auto',
  formatOutput: true,
  indentation: 2,
  sortKeys: false,
  maxDepth: 10,
  removeOuterQuotes: true,
};

export type UnescaperResult = {
  success: true;
  output: string;
  unescapeChain: string[];
  isValidJSON: boolean;
  stats: {
    inputLength: number;
    outputLength: number;
    unescapedLayers: number;
  };
} | {
  success: false;
  error: string;
};

/**
 * Unescape a single layer of JSON string escaping
 */
function unescapeSingleLayer(input: string): string {
  // Handle escape sequences
  return input
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\\//g, '/')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => 
      String.fromCharCode(parseInt(hex, 16))
    );
}

/**
 * Remove surrounding quotes from string
 */
function removeQuotes(input: string): string {
  const trimmed = input.trim();
  
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  
  return trimmed;
}

/**
 * Check if string is valid JSON
 */
function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect escape level of input
 */
function detectEscapeLevel(input: string): number {
  let level = 0;
  let current = input.trim();
  
  while (level < 10) {
    // Check if it's a quoted string
    if ((current.startsWith('"') && current.endsWith('"')) ||
        (current.startsWith("'") && current.endsWith("'"))) {
      try {
        const unquoted = JSON.parse(current);
        if (typeof unquoted === 'string') {
          level++;
          current = unquoted;
          continue;
        }
      } catch {
        // Check for escape patterns even if not valid JSON string
        if (/\\"/.test(current) || /\\\\/.test(current) || /\\n/.test(current)) {
          level++;
          current = unescapeSingleLayer(removeQuotes(current));
          continue;
        }
      }
    }
    // Check for unquoted escaped patterns
    else if (/\\"/.test(current) || /\\\\/.test(current) || /\\n/.test(current)) {
      level++;
      current = unescapeSingleLayer(current);
      continue;
    }
    
    break;
  }
  
  return level;
}

/**
 * Unescape JSON string using JSON.parse
 */
function unescapeJSONString(input: string): string {
  const trimmed = input.trim();
  
  // If it's a quoted string, try to parse it
  if ((trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'string') {
        return parsed;
      }
    } catch {
      // Fall through to manual unescaping
    }
  }
  
  // Try wrapping in quotes and parsing
  try {
    const wrapped = '"' + trimmed + '"';
    const parsed = JSON.parse(wrapped);
    if (typeof parsed === 'string') {
      return parsed;
    }
  } catch {
    // Fall through to manual unescaping
  }
  
  // Manual unescaping
  return unescapeSingleLayer(trimmed);
}

/**
 * Multi-layer unescape - recursively unescape until no more escaping found
 */
function multiLayerUnescape(input: string, maxDepth: number): { result: string; layers: number; chain: string[] } {
  let current = input.trim();
  let layers = 0;
  const chain: string[] = [];
  
  while (layers < maxDepth) {
    const previous = current;
    
    // Remove outer quotes if present
    if ((current.startsWith('"') && current.endsWith('"')) ||
        (current.startsWith("'") && current.endsWith("'"))) {
      try {
        const parsed = JSON.parse(current);
        if (typeof parsed === 'string') {
          current = parsed;
          layers++;
          chain.push('JSON.parse');
          continue;
        }
      } catch {
        // Try manual unquoting and unescaping
        const unquoted = current.slice(1, -1);
        const unescaped = unescapeSingleLayer(unquoted);
        if (unescaped !== unquoted) {
          current = unescaped;
          layers++;
          chain.push('unescape');
          continue;
        }
      }
    }
    
    // Check for escape sequences without quotes
    if (/\\"/.test(current) || /\\\\/.test(current) || /\\n/.test(current) || /\\t/.test(current)) {
      const unescaped = unescapeSingleLayer(current);
      if (unescaped !== current) {
        current = unescaped;
        layers++;
        chain.push('unescape');
        continue;
      }
    }
    
    // No more unescaping needed
    if (current === previous) {
      break;
    }
  }
  
  return { result: current, layers, chain };
}

/**
 * Format JSON output
 */
function formatJSON(input: string, indentation: 2 | 4 | 'tab', sortKeys: boolean): string {
  try {
    let parsed = JSON.parse(input);
    
    if (sortKeys) {
      parsed = sortObjectKeys(parsed);
    }
    
    const indent = indentation === 'tab' ? '\t' : indentation;
    return JSON.stringify(parsed, null, indent);
  } catch {
    return input;
  }
}

/**
 * Recursively sort object keys
 */
function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
        return sorted;
      }, {} as Record<string, unknown>);
  }
  return obj;
}

/**
 * Main unescaping function
 */
export function unescapeJSON(input: string, settings: Partial<UnescaperSettings>): UnescaperResult {
  const mergedSettings: UnescaperSettings = { ...DEFAULT_UNESCAPER_SETTINGS, ...settings };
  
  if (!input || !input.trim()) {
    return { success: false, error: 'Input is empty' };
  }
  
  try {
    let current = input.trim();
    const unescapeChain: string[] = [];
    let layers = 0;
    
    switch (mergedSettings.unescapeMode) {
      case 'auto':
      case 'multiLayer': {
        const result = multiLayerUnescape(current, mergedSettings.maxDepth);
        current = result.result;
        layers = result.layers;
        unescapeChain.push(...result.chain);
        break;
      }
      
      case 'jsonString': {
        current = unescapeJSONString(current);
        layers = 1;
        unescapeChain.push('JSON.parse');
        break;
      }
      
      case 'singleLayer': {
        if (mergedSettings.removeOuterQuotes) {
          current = removeQuotes(current);
        }
        current = unescapeSingleLayer(current);
        layers = 1;
        unescapeChain.push('unescape');
        break;
      }
    }
    
    const isJSON = isValidJSON(current);
    
    // Format output if requested and it's valid JSON
    if (mergedSettings.formatOutput && isJSON) {
      current = formatJSON(current, mergedSettings.indentation, mergedSettings.sortKeys);
    }
    
    const inputLength = new TextEncoder().encode(input).length;
    const outputLength = new TextEncoder().encode(current).length;
    
    return {
      success: true,
      output: current,
      unescapeChain,
      isValidJSON: isJSON,
      stats: {
        inputLength,
        outputLength,
        unescapedLayers: layers,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown unescaping error';
    return { success: false, error: message };
  }
}

/**
 * Get unescape mode display name
 */
export function getUnescapeModeName(mode: UnescapeMode): string {
  const names: Record<UnescapeMode, string> = {
    auto: 'Auto Detect',
    jsonString: 'JSON String',
    singleLayer: 'Single Layer',
    multiLayer: 'Multi-Layer',
  };
  return names[mode] || mode;
}

/**
 * Get all unescape modes
 */
export function getUnescapeModes(): { value: UnescapeMode; label: string; description: string }[] {
  return [
    { value: 'auto', label: 'Auto Detect', description: 'Automatically detect and unescape all layers' },
    { value: 'jsonString', label: 'JSON String', description: 'Parse as JSON string literal' },
    { value: 'singleLayer', label: 'Single Layer', description: 'Unescape only one layer' },
    { value: 'multiLayer', label: 'Multi-Layer', description: 'Recursively unescape nested strings' },
  ];
}

/**
 * Detect escape level of input string
 */
export function getEscapeLevel(input: string): number {
  return detectEscapeLevel(input);
}
