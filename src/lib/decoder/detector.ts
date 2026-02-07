/**
 * Encoding Detection Logic for JSON Decoder
 * Detects the encoding type of input strings
 */

export type EncodingType = 'url' | 'base64' | 'hex' | 'htmlEntity' | 'unicode' | 'unescape';

export interface DetectedEncoding {
  type: EncodingType;
  confidence: number; // 0-1
  reason: string;
}

/**
 * Check for URL encoding patterns
 */
function detectURLEncoding(input: string): DetectedEncoding | null {
  // Count percent-encoded sequences
  const percentMatches = input.match(/%[0-9A-Fa-f]{2}/g) || [];
  const percentCount = percentMatches.length;
  
  if (percentCount === 0) {
    return null;
  }
  
  // Calculate confidence based on density
  const density = (percentCount * 3) / input.length;
  
  // Check for common URL-encoded JSON characters
  const hasJsonChars = /%7B|%7D|%22|%5B|%5D|%3A/i.test(input);
  
  if (density > 0.1 || (hasJsonChars && percentCount > 2)) {
    return {
      type: 'url',
      confidence: Math.min(0.9, density + (hasJsonChars ? 0.3 : 0)),
      reason: `Found ${percentCount} percent-encoded sequences`,
    };
  }
  
  return null;
}

/**
 * Check for Base64 encoding patterns
 */
function detectBase64Encoding(input: string): DetectedEncoding | null {
  const trimmed = input.trim();
  
  // Must be reasonable length
  if (trimmed.length < 4) {
    return null;
  }
  
  // Standard Base64 pattern
  const standardBase64 = /^[A-Za-z0-9+/]+={0,2}$/;
  // URL-safe Base64 pattern
  const urlSafeBase64 = /^[A-Za-z0-9_-]+={0,2}$/;
  
  if (standardBase64.test(trimmed) || urlSafeBase64.test(trimmed)) {
    // Check length is valid (should be divisible by 4 when padded)
    const paddedLength = trimmed.replace(/=+$/, '').length;
    const remainder = paddedLength % 4;
    
    // Valid Base64 has length % 4 === 0 or has proper padding
    if (remainder === 0 || remainder === 2 || remainder === 3) {
      // Higher confidence for longer strings and if it starts with expected Base64 JSON
      let confidence = 0.6;
      
      // Check if it decodes to something JSON-like
      try {
        const decoded = atob(trimmed.replace(/-/g, '+').replace(/_/g, '/'));
        if (decoded.startsWith('{') || decoded.startsWith('[')) {
          confidence = 0.9;
        }
      } catch {
        // Can't decode, lower confidence
        confidence = 0.3;
      }
      
      return {
        type: 'base64',
        confidence,
        reason: 'Matches Base64 character pattern',
      };
    }
  }
  
  return null;
}

/**
 * Check for Hex encoding patterns
 */
function detectHexEncoding(input: string): DetectedEncoding | null {
  // Remove common hex prefixes and delimiters
  const cleaned = input
    .replace(/0x/gi, '')
    .replace(/\\x/gi, '')
    .replace(/[:\s]/g, '')
    .trim();
  
  // Must be even length and only hex chars
  if (cleaned.length < 4 || cleaned.length % 2 !== 0) {
    return null;
  }
  
  if (/^[0-9A-Fa-f]+$/.test(cleaned)) {
    // Higher confidence if it has prefixes or looks like JSON hex
    let confidence = 0.5;
    
    if (/0x|\\x/i.test(input)) {
      confidence = 0.8;
    }
    
    // Check if decoded looks like JSON
    try {
      const bytes = new Uint8Array(cleaned.length / 2);
      for (let i = 0; i < cleaned.length; i += 2) {
        bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
      }
      const decoded = new TextDecoder().decode(bytes);
      if (decoded.startsWith('{') || decoded.startsWith('[')) {
        confidence = 0.9;
      }
    } catch {
      // Ignore decode errors
    }
    
    return {
      type: 'hex',
      confidence,
      reason: 'Matches hexadecimal pattern',
    };
  }
  
  return null;
}

/**
 * Check for HTML entity encoding
 */
function detectHTMLEntityEncoding(input: string): DetectedEncoding | null {
  // Numeric entities
  const numericMatches = input.match(/&#\d+;/g) || [];
  // Hex entities
  const hexMatches = input.match(/&#x[0-9a-f]+;/gi) || [];
  // Named entities
  const namedMatches = input.match(/&[a-z]+;/gi) || [];
  
  const totalEntities = numericMatches.length + hexMatches.length + namedMatches.length;
  
  if (totalEntities === 0) {
    return null;
  }
  
  const density = totalEntities / (input.length / 5); // Average entity is ~5 chars
  
  return {
    type: 'htmlEntity',
    confidence: Math.min(0.9, 0.3 + density * 0.3),
    reason: `Found ${totalEntities} HTML entities`,
  };
}

/**
 * Check for Unicode escape sequences
 */
function detectUnicodeEncoding(input: string): DetectedEncoding | null {
  const unicodeMatches = input.match(/\\u[0-9A-Fa-f]{4}/g) || [];
  
  if (unicodeMatches.length === 0) {
    return null;
  }
  
  const density = (unicodeMatches.length * 6) / input.length;
  
  return {
    type: 'unicode',
    confidence: Math.min(0.9, 0.4 + density * 0.3),
    reason: `Found ${unicodeMatches.length} Unicode escape sequences`,
  };
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
 * Check for escaped JSON string
 * IMPORTANT: Do NOT recommend unescape for valid JSON - the escape sequences
 * inside JSON strings (like \" for quotes) are required for valid JSON syntax.
 */
function detectEscapedString(input: string): DetectedEncoding | null {
  // If the input is already valid JSON, don't recommend unescape
  // as that would break the JSON syntax by removing required escapes
  if (isValidJSON(input)) {
    return null;
  }
  
  // Check for double-quoted escaped string (double-escaped JSON)
  if ((input.startsWith('"') && input.endsWith('"')) ||
      (input.startsWith("'") && input.endsWith("'"))) {
    
    // Count escape sequences
    const escapes = (input.match(/\\["'\\nrt]/g) || []).length;
    
    if (escapes > 0) {
      return {
        type: 'unescape',
        confidence: 0.7,
        reason: `Found ${escapes} escape sequences in quoted string`,
      };
    }
  }
  
  // Check for double-escaped JSON patterns (like \\\" which indicates extra escaping)
  // Only match patterns that suggest EXTRA escaping, not normal JSON escapes
  if (/\\\\["{}[\]:,]/.test(input) || /\\"/.test(input) && !input.startsWith('{') && !input.startsWith('[')) {
    const escapeCount = (input.match(/\\\\./g) || []).length;
    if (escapeCount > 0) {
      return {
        type: 'unescape',
        confidence: Math.min(0.8, 0.3 + escapeCount * 0.1),
        reason: `Found ${escapeCount} double-escape sequences`,
      };
    }
  }
  
  return null;
}

/**
 * Main detection function - returns all detected encodings sorted by confidence
 */
export function detectEncoding(input: string): DetectedEncoding[] {
  const detections: DetectedEncoding[] = [];
  
  // Run all detectors
  const urlResult = detectURLEncoding(input);
  if (urlResult) detections.push(urlResult);
  
  const base64Result = detectBase64Encoding(input);
  if (base64Result) detections.push(base64Result);
  
  const hexResult = detectHexEncoding(input);
  if (hexResult) detections.push(hexResult);
  
  const htmlResult = detectHTMLEntityEncoding(input);
  if (htmlResult) detections.push(htmlResult);
  
  const unicodeResult = detectUnicodeEncoding(input);
  if (unicodeResult) detections.push(unicodeResult);
  
  const escapeResult = detectEscapedString(input);
  if (escapeResult) detections.push(escapeResult);
  
  // Sort by confidence (highest first)
  return detections.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Get human-readable description of detected encodings
 */
export function describeDetections(detections: DetectedEncoding[]): string {
  if (detections.length === 0) {
    return 'No encoding detected';
  }
  
  return detections
    .map(d => `${d.type} (${Math.round(d.confidence * 100)}% confidence)`)
    .join(' → ');
}
