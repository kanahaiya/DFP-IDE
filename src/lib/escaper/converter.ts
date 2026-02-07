/**
 * JSON Escaper - Escape JSON strings for various contexts
 * All processing is client-side with no server dependencies
 */

export type EscapeMode = 'standard' | 'javascript' | 'urlSafe' | 'htmlSafe';

export type OutputFormat = 'string' | 'minified' | 'formatted';

export interface EscaperSettings {
  escapeMode: EscapeMode;
  outputFormat: OutputFormat;
  escapeSlash: boolean;
  unicodeEscape: boolean;
  escapeNonAscii: boolean;
  wrapInQuotes: boolean;
  indentation: 2 | 4;
}

export const DEFAULT_ESCAPER_SETTINGS: EscaperSettings = {
  escapeMode: 'standard',
  outputFormat: 'string',
  escapeSlash: false,
  unicodeEscape: false,
  escapeNonAscii: false,
  wrapInQuotes: true,
  indentation: 2,
};

export type EscaperResult = {
  success: true;
  output: string;
  stats: {
    inputLength: number;
    outputLength: number;
    escapedChars: number;
  };
} | {
  success: false;
  error: string;
};

/**
 * Standard JSON escape - escapes characters per RFC 8259
 */
function standardEscape(input: string, settings: EscaperSettings): string {
  let result = '';
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const code = char.charCodeAt(0);
    
    switch (char) {
      case '"':
        result += '\\"';
        break;
      case '\\':
        result += '\\\\';
        break;
      case '/':
        result += settings.escapeSlash ? '\\/' : '/';
        break;
      case '\b':
        result += '\\b';
        break;
      case '\f':
        result += '\\f';
        break;
      case '\n':
        result += '\\n';
        break;
      case '\r':
        result += '\\r';
        break;
      case '\t':
        result += '\\t';
        break;
      default:
        // Control characters (U+0000 to U+001F)
        if (code < 0x20) {
          result += '\\u' + code.toString(16).padStart(4, '0');
        }
        // Non-ASCII characters
        else if (settings.escapeNonAscii && code > 127) {
          if (settings.unicodeEscape) {
            // Handle surrogate pairs for characters outside BMP
            if (code > 0xFFFF) {
              const highSurrogate = Math.floor((code - 0x10000) / 0x400) + 0xD800;
              const lowSurrogate = ((code - 0x10000) % 0x400) + 0xDC00;
              result += '\\u' + highSurrogate.toString(16).padStart(4, '0');
              result += '\\u' + lowSurrogate.toString(16).padStart(4, '0');
            } else {
              result += '\\u' + code.toString(16).padStart(4, '0');
            }
          } else {
            result += char;
          }
        }
        // Unicode escape all characters if enabled
        else if (settings.unicodeEscape && code > 127) {
          result += '\\u' + code.toString(16).padStart(4, '0');
        }
        else {
          result += char;
        }
    }
  }
  
  return result;
}

/**
 * JavaScript string escape - additional escaping for JS contexts
 */
function javascriptEscape(input: string, settings: EscaperSettings): string {
  let result = standardEscape(input, settings);
  
  // Escape single quotes for JavaScript string literals
  result = result.replace(/'/g, "\\'");
  
  // Escape backticks for template literals
  result = result.replace(/`/g, '\\`');
  
  // Escape $ for template literal expressions
  result = result.replace(/\$/g, '\\$');
  
  return result;
}

/**
 * URL-safe escape - encode for URL query parameters
 */
function urlSafeEscape(input: string): string {
  // First stringify to get proper JSON escaping
  const jsonString = JSON.stringify(input);
  // Remove surrounding quotes
  const content = jsonString.slice(1, -1);
  // URL encode the result
  return encodeURIComponent(content);
}

/**
 * HTML-safe escape - encode for HTML attributes
 */
function htmlSafeEscape(input: string, settings: EscaperSettings): string {
  let result = standardEscape(input, settings);
  
  // Additional HTML entity encoding
  result = result
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  return result;
}

/**
 * Preprocess JSON - minify or format before escaping
 */
function preprocessJSON(input: string, format: OutputFormat, indentation: number): string {
  try {
    const parsed = JSON.parse(input);
    switch (format) {
      case 'minified':
        return JSON.stringify(parsed);
      case 'formatted':
        return JSON.stringify(parsed, null, indentation);
      default:
        return input;
    }
  } catch {
    // If not valid JSON, return as-is
    return input;
  }
}

/**
 * Count escaped characters in output
 */
function countEscapedChars(output: string): number {
  const escapePatterns = /\\["\\/bfnrt]|\\u[0-9a-fA-F]{4}/g;
  const matches = output.match(escapePatterns);
  return matches ? matches.length : 0;
}

/**
 * Main escaping function
 */
export function escapeJSON(input: string, settings: Partial<EscaperSettings>): EscaperResult {
  const mergedSettings: EscaperSettings = { ...DEFAULT_ESCAPER_SETTINGS, ...settings };
  
  if (!input) {
    return { success: false, error: 'Input is empty' };
  }
  
  try {
    // Preprocess if needed
    let processedInput = input;
    if (mergedSettings.outputFormat !== 'string') {
      processedInput = preprocessJSON(input, mergedSettings.outputFormat, mergedSettings.indentation);
    }
    
    let output: string;
    
    switch (mergedSettings.escapeMode) {
      case 'standard':
        output = standardEscape(processedInput, mergedSettings);
        break;
      case 'javascript':
        output = javascriptEscape(processedInput, mergedSettings);
        break;
      case 'urlSafe':
        output = urlSafeEscape(processedInput);
        break;
      case 'htmlSafe':
        output = htmlSafeEscape(processedInput, mergedSettings);
        break;
      default:
        return { success: false, error: `Unknown escape mode: ${mergedSettings.escapeMode}` };
    }
    
    // Wrap in quotes if enabled and not URL-safe mode
    if (mergedSettings.wrapInQuotes && mergedSettings.escapeMode !== 'urlSafe') {
      output = '"' + output + '"';
    }
    
    const inputLength = new TextEncoder().encode(input).length;
    const outputLength = new TextEncoder().encode(output).length;
    
    return {
      success: true,
      output,
      stats: {
        inputLength,
        outputLength,
        escapedChars: countEscapedChars(output),
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown escaping error';
    return { success: false, error: message };
  }
}

/**
 * Get escape mode display name
 */
export function getEscapeModeName(mode: EscapeMode): string {
  const names: Record<EscapeMode, string> = {
    standard: 'Standard JSON',
    javascript: 'JavaScript String',
    urlSafe: 'URL-Safe',
    htmlSafe: 'HTML-Safe',
  };
  return names[mode] || mode;
}

/**
 * Get all escape modes
 */
export function getEscapeModes(): { value: EscapeMode; label: string; description: string }[] {
  return [
    { value: 'standard', label: 'Standard JSON', description: 'Standard JSON escaping per RFC 8259' },
    { value: 'javascript', label: 'JavaScript String', description: 'Escape for JavaScript string literals' },
    { value: 'urlSafe', label: 'URL-Safe', description: 'Encode for URL query parameters' },
    { value: 'htmlSafe', label: 'HTML-Safe', description: 'Encode for embedding in HTML attributes' },
  ];
}

/**
 * Get output format options
 */
export function getOutputFormats(): { value: OutputFormat; label: string; description: string }[] {
  return [
    { value: 'string', label: 'As-Is', description: 'Keep original formatting' },
    { value: 'minified', label: 'Minified', description: 'Remove all whitespace before escaping' },
    { value: 'formatted', label: 'Formatted', description: 'Pretty-print before escaping' },
  ];
}
