/**
 * JSON Decoder - Decoding functions for various encoded formats
 * All processing is client-side with no server dependencies
 */

export type DecodingType = 'auto' | 'url' | 'base64' | 'hex' | 'htmlEntity' | 'unicode' | 'unescape';

export interface DecoderSettings {
  decodingType: DecodingType;
  autoDetect: boolean;
  recursiveDecode: boolean;
  maxIterations: number;
  formatOutput: boolean;
  indentation: 2 | 4 | 'tab';
  sortKeys: boolean;
}

export const DEFAULT_DECODER_SETTINGS: DecoderSettings = {
  decodingType: 'auto',
  autoDetect: true,
  recursiveDecode: true,
  maxIterations: 10,
  formatOutput: true,
  indentation: 2,
  sortKeys: false,
};

export type DecoderResult = {
  success: true;
  output: string;
  decodingChain: string[];
  isValidJSON: boolean;
  stats: {
    inputLength: number;
    outputLength: number;
    iterations: number;
  };
} | {
  success: false;
  error: string;
};

/**
 * URL Decode
 */
function urlDecode(input: string): string {
  try {
    // Handle + as space (form encoding)
    const withSpaces = input.replace(/\+/g, ' ');
    return decodeURIComponent(withSpaces);
  } catch {
    // Try without the + replacement
    return decodeURIComponent(input);
  }
}

/**
 * Base64 Decode with UTF-8 support
 */
function base64Decode(input: string): string {
  // Normalize: add padding if needed
  let normalized = input.trim();
  
  // Convert URL-safe Base64 to standard
  normalized = normalized.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if needed
  while (normalized.length % 4 !== 0) {
    normalized += '=';
  }
  
  try {
    const binaryString = atob(normalized);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    // Fallback for non-UTF8
    return atob(normalized);
  }
}

/**
 * Hex Decode
 */
function hexDecode(input: string): string {
  // Remove common prefixes and delimiters
  const cleaned = input
    .replace(/0x/gi, '')
    .replace(/\\x/gi, '')
    .replace(/[:\s]/g, '');
  
  // Must be even length
  if (cleaned.length % 2 !== 0) {
    throw new Error('Invalid hex string: odd length');
  }
  
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    const byte = parseInt(cleaned.substring(i, i + 2), 16);
    if (isNaN(byte)) {
      throw new Error(`Invalid hex character at position ${i}`);
    }
    bytes[i / 2] = byte;
  }
  
  return new TextDecoder('utf-8').decode(bytes);
}

/**
 * HTML Entity Decode
 */
function htmlEntityDecode(input: string): string {
  // Decode numeric entities
  let result = input.replace(/&#(\d+);/g, (_, code) => {
    return String.fromCodePoint(parseInt(code, 10));
  });
  
  // Decode hex entities
  result = result.replace(/&#x([0-9a-f]+);/gi, (_, code) => {
    return String.fromCodePoint(parseInt(code, 16));
  });
  
  // Decode named entities
  const namedEntities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  };
  
  for (const [entity, char] of Object.entries(namedEntities)) {
    result = result.split(entity).join(char);
  }
  
  return result;
}

/**
 * Unicode Escape Decode (\uXXXX)
 */
function unicodeDecode(input: string): string {
  return input.replace(/\\u([0-9a-f]{4})/gi, (_, code) => {
    return String.fromCharCode(parseInt(code, 16));
  });
}

/**
 * Unescape JSON string (remove extra escaping)
 */
function unescapeString(input: string): string {
  // Check if it's a double-escaped JSON string
  if ((input.startsWith('"') && input.endsWith('"')) ||
      (input.startsWith("'") && input.endsWith("'"))) {
    try {
      // Try to parse as JSON string
      const parsed = JSON.parse(input);
      if (typeof parsed === 'string') {
        return parsed;
      }
    } catch {
      // Not a valid JSON string, continue with manual unescaping
    }
  }
  
  // Manual unescaping for various patterns
  return input
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t');
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
 * Apply single decoding
 */
function applySingleDecode(input: string, type: Exclude<DecodingType, 'auto'>): string {
  switch (type) {
    case 'url':
      return urlDecode(input);
    case 'base64':
      return base64Decode(input);
    case 'hex':
      return hexDecode(input);
    case 'htmlEntity':
      return htmlEntityDecode(input);
    case 'unicode':
      return unicodeDecode(input);
    case 'unescape':
      return unescapeString(input);
    default:
      return input;
  }
}

/**
 * Import detector for auto-detection
 */
import { detectEncoding } from './detector';

/**
 * Main decoding function
 */
export function decodeJSON(input: string, settings: Partial<DecoderSettings>): DecoderResult {
  const mergedSettings: DecoderSettings = { ...DEFAULT_DECODER_SETTINGS, ...settings };
  
  if (!input.trim()) {
    return { success: false, error: 'Input is empty' };
  }
  
  try {
    let current = input.trim();
    const decodingChain: string[] = [];
    let iterations = 0;
    
    if (mergedSettings.decodingType === 'auto' && mergedSettings.autoDetect) {
      // Auto-detect and decode recursively
      while (iterations < mergedSettings.maxIterations) {
        // If we already have valid JSON, stop decoding
        // This prevents accidentally breaking valid JSON with unescape operations
        if (isValidJSON(current)) {
          break;
        }
        
        const detected = detectEncoding(current);
        
        if (detected.length === 0) {
          break;
        }
        
        // Try the most confident detection
        const bestMatch = detected[0];
        
        try {
          const decoded = applySingleDecode(current, bestMatch.type as Exclude<DecodingType, 'auto'>);
          
          if (decoded === current) {
            break; // No change, stop
          }
          
          decodingChain.push(bestMatch.type);
          current = decoded;
          iterations++;
          
          // Stop if we have valid JSON and not doing recursive decode
          if (!mergedSettings.recursiveDecode && isValidJSON(current)) {
            break;
          }
        } catch {
          // This decoding failed, try next
          break;
        }
      }
    } else if (mergedSettings.decodingType !== 'auto') {
      // Manual decoding type
      if (mergedSettings.recursiveDecode) {
        while (iterations < mergedSettings.maxIterations) {
          try {
            const decoded = applySingleDecode(current, mergedSettings.decodingType);
            if (decoded === current) break;
            decodingChain.push(mergedSettings.decodingType);
            current = decoded;
            iterations++;
          } catch {
            break;
          }
        }
      } else {
        current = applySingleDecode(current, mergedSettings.decodingType);
        decodingChain.push(mergedSettings.decodingType);
        iterations = 1;
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
      decodingChain,
      isValidJSON: isJSON,
      stats: {
        inputLength,
        outputLength,
        iterations,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown decoding error';
    return { success: false, error: message };
  }
}

/**
 * Get decoding type display name
 */
export function getDecodingTypeName(type: DecodingType): string {
  const names: Record<DecodingType, string> = {
    auto: 'Auto Detect',
    url: 'URL Decode',
    base64: 'Base64 Decode',
    hex: 'Hex Decode',
    htmlEntity: 'HTML Entity Decode',
    unicode: 'Unicode Unescape',
    unescape: 'String Unescape',
  };
  return names[type] || type;
}

/**
 * Get all decoding types
 */
export function getDecodingTypes(): { value: DecodingType; label: string; description: string }[] {
  return [
    { value: 'auto', label: 'Auto Detect', description: 'Automatically detect and decode encoding type' },
    { value: 'url', label: 'URL Decode', description: 'Decode URL/percent encoded strings' },
    { value: 'base64', label: 'Base64 Decode', description: 'Decode Base64 and URL-safe Base64' },
    { value: 'hex', label: 'Hex Decode', description: 'Decode hexadecimal byte strings' },
    { value: 'htmlEntity', label: 'HTML Entity Decode', description: 'Decode HTML numeric and named entities' },
    { value: 'unicode', label: 'Unicode Unescape', description: 'Decode \\uXXXX escape sequences' },
    { value: 'unescape', label: 'String Unescape', description: 'Remove extra escape characters' },
  ];
}
