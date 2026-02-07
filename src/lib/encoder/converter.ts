/**
 * JSON Encoder - Encoding functions for various formats
 * All processing is client-side with no server dependencies
 */

export type EncodingType = 'url' | 'base64' | 'base64url' | 'hex' | 'htmlEntity' | 'unicode' | 'uri';

export interface EncoderSettings {
  encodingType: EncodingType;
  minifyFirst: boolean;
  formatFirst: boolean;
  // URL options
  spaceAsPlus: boolean;
  // Base64 options
  urlSafe: boolean;
  includePadding: boolean;
  // Hex options
  uppercase: boolean;
  hexPrefix: 'none' | '0x' | '\\x';
  hexDelimiter: 'none' | 'space' | 'colon';
  // Unicode options
  escapeAll: boolean;
  escapeNonAscii: boolean;
}

export const DEFAULT_ENCODER_SETTINGS: EncoderSettings = {
  encodingType: 'url',
  minifyFirst: true,
  formatFirst: false,
  spaceAsPlus: false,
  urlSafe: false,
  includePadding: true,
  uppercase: false,
  hexPrefix: 'none',
  hexDelimiter: 'none',
  escapeAll: false,
  escapeNonAscii: true,
};

export type EncoderResult = {
  success: true;
  output: string;
  stats: {
    inputLength: number;
    outputLength: number;
    compressionRatio: number;
  };
} | {
  success: false;
  error: string;
};

/**
 * URL Encoding using encodeURIComponent
 */
function urlEncode(input: string, spaceAsPlus: boolean): string {
  let encoded = encodeURIComponent(input);
  if (spaceAsPlus) {
    encoded = encoded.replace(/%20/g, '+');
  }
  return encoded;
}

/**
 * URI Encoding using encodeURI (preserves URI special characters)
 */
function uriEncode(input: string): string {
  return encodeURI(input);
}

/**
 * Base64 Encoding with UTF-8 support
 */
function base64Encode(input: string, urlSafe: boolean, includePadding: boolean): string {
  // Handle UTF-8 characters properly
  const utf8Bytes = new TextEncoder().encode(input);
  const binaryString = Array.from(utf8Bytes)
    .map(byte => String.fromCharCode(byte))
    .join('');
  
  let encoded = btoa(binaryString);
  
  if (urlSafe) {
    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_');
  }
  
  if (!includePadding) {
    encoded = encoded.replace(/=+$/, '');
  }
  
  return encoded;
}

/**
 * Hex Encoding
 */
function hexEncode(
  input: string,
  uppercase: boolean,
  prefix: 'none' | '0x' | '\\x',
  delimiter: 'none' | 'space' | 'colon'
): string {
  const bytes = new TextEncoder().encode(input);
  const hexChars = Array.from(bytes).map(byte => {
    let hex = byte.toString(16).padStart(2, '0');
    if (uppercase) {
      hex = hex.toUpperCase();
    }
    if (prefix === '0x') {
      hex = '0x' + hex;
    } else if (prefix === '\\x') {
      hex = '\\x' + hex;
    }
    return hex;
  });
  
  let delimiterChar = '';
  if (delimiter === 'space') {
    delimiterChar = ' ';
  } else if (delimiter === 'colon') {
    delimiterChar = ':';
  }
  
  return hexChars.join(delimiterChar);
}

/**
 * HTML Entity Encoding
 */
function htmlEntityEncode(input: string): string {
  return Array.from(input)
    .map(char => {
      const code = char.charCodeAt(0);
      // Encode special HTML characters and non-ASCII
      if (code < 32 || code > 126 || '<>&"\''.includes(char)) {
        return `&#${code};`;
      }
      return char;
    })
    .join('');
}

/**
 * Unicode Escape Encoding (\uXXXX format)
 */
function unicodeEncode(input: string, escapeAll: boolean, escapeNonAscii: boolean): string {
  return Array.from(input)
    .map(char => {
      const code = char.charCodeAt(0);
      
      if (escapeAll) {
        // Escape every character
        if (code > 0xFFFF) {
          // Handle surrogate pairs for characters outside BMP
          const highSurrogate = Math.floor((code - 0x10000) / 0x400) + 0xD800;
          const lowSurrogate = ((code - 0x10000) % 0x400) + 0xDC00;
          return `\\u${highSurrogate.toString(16).padStart(4, '0')}\\u${lowSurrogate.toString(16).padStart(4, '0')}`;
        }
        return `\\u${code.toString(16).padStart(4, '0')}`;
      } else if (escapeNonAscii && code > 127) {
        // Only escape non-ASCII characters
        if (code > 0xFFFF) {
          const highSurrogate = Math.floor((code - 0x10000) / 0x400) + 0xD800;
          const lowSurrogate = ((code - 0x10000) % 0x400) + 0xDC00;
          return `\\u${highSurrogate.toString(16).padStart(4, '0')}\\u${lowSurrogate.toString(16).padStart(4, '0')}`;
        }
        return `\\u${code.toString(16).padStart(4, '0')}`;
      }
      return char;
    })
    .join('');
}

/**
 * Preprocess JSON - minify or format
 */
function preprocessJSON(input: string, minify: boolean, format: boolean): string {
  try {
    const parsed = JSON.parse(input);
    if (minify) {
      return JSON.stringify(parsed);
    } else if (format) {
      return JSON.stringify(parsed, null, 2);
    }
    return input;
  } catch {
    // If not valid JSON, return as-is
    return input;
  }
}

/**
 * Main encoding function
 */
export function encodeJSON(input: string, settings: Partial<EncoderSettings>): EncoderResult {
  const mergedSettings: EncoderSettings = { ...DEFAULT_ENCODER_SETTINGS, ...settings };
  
  if (!input.trim()) {
    return { success: false, error: 'Input is empty' };
  }
  
  try {
    // Preprocess if needed
    let processedInput = input;
    if (mergedSettings.minifyFirst) {
      processedInput = preprocessJSON(input, true, false);
    } else if (mergedSettings.formatFirst) {
      processedInput = preprocessJSON(input, false, true);
    }
    
    let output: string;
    
    switch (mergedSettings.encodingType) {
      case 'url':
        output = urlEncode(processedInput, mergedSettings.spaceAsPlus);
        break;
      case 'uri':
        output = uriEncode(processedInput);
        break;
      case 'base64':
        output = base64Encode(processedInput, false, mergedSettings.includePadding);
        break;
      case 'base64url':
        output = base64Encode(processedInput, true, mergedSettings.includePadding);
        break;
      case 'hex':
        output = hexEncode(
          processedInput,
          mergedSettings.uppercase,
          mergedSettings.hexPrefix,
          mergedSettings.hexDelimiter
        );
        break;
      case 'htmlEntity':
        output = htmlEntityEncode(processedInput);
        break;
      case 'unicode':
        output = unicodeEncode(
          processedInput,
          mergedSettings.escapeAll,
          mergedSettings.escapeNonAscii
        );
        break;
      default:
        return { success: false, error: `Unknown encoding type: ${mergedSettings.encodingType}` };
    }
    
    const inputLength = new TextEncoder().encode(processedInput).length;
    const outputLength = new TextEncoder().encode(output).length;
    
    return {
      success: true,
      output,
      stats: {
        inputLength,
        outputLength,
        compressionRatio: inputLength > 0 ? ((outputLength - inputLength) / inputLength) * 100 : 0,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown encoding error';
    return { success: false, error: message };
  }
}

/**
 * Get encoding type display name
 */
export function getEncodingTypeName(type: EncodingType): string {
  const names: Record<EncodingType, string> = {
    url: 'URL Encoding',
    uri: 'URI Encoding',
    base64: 'Base64',
    base64url: 'Base64 URL-Safe',
    hex: 'Hexadecimal',
    htmlEntity: 'HTML Entities',
    unicode: 'Unicode Escape',
  };
  return names[type] || type;
}

/**
 * Get all encoding types
 */
export function getEncodingTypes(): { value: EncodingType; label: string; description: string }[] {
  return [
    { value: 'url', label: 'URL Encoding', description: 'Encode for URL query parameters (encodeURIComponent)' },
    { value: 'uri', label: 'URI Encoding', description: 'Encode for URIs, preserving special chars (encodeURI)' },
    { value: 'base64', label: 'Base64', description: 'Standard Base64 encoding' },
    { value: 'base64url', label: 'Base64 URL-Safe', description: 'URL-safe Base64 with - and _ instead of + and /' },
    { value: 'hex', label: 'Hexadecimal', description: 'Convert to hex byte representation' },
    { value: 'htmlEntity', label: 'HTML Entities', description: 'Encode as HTML numeric entities (&#XXX;)' },
    { value: 'unicode', label: 'Unicode Escape', description: 'Escape to \\uXXXX format' },
  ];
}
