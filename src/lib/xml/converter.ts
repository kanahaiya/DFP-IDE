/**
 * JSON to XML Converter
 * 
 * Converts JSON data to XML format with extensive customization options.
 * All processing happens client-side for privacy and security.
 */

export interface XMLConversionSettings {
  // Root element configuration
  rootElement: string;
  includeDeclaration: boolean;
  encoding: string;
  version: string;
  
  // Formatting options
  indentation: 'none' | '2spaces' | '4spaces' | 'tabs';
  lineBreaks: boolean;
  
  // Array handling
  arrayWrapper: boolean;
  arrayWrapperName: string;
  itemNaming: 'singular' | 'custom' | 'parent';
  customItemName: string;
  includeArrayIndex: boolean;
  
  // Data type handling
  cdataMode: 'auto' | 'force' | 'disabled';
  nullHandling: 'self-closing' | 'empty' | 'omit' | 'custom';
  customNullText: string;
  booleanFormat: 'lowercase' | 'capitalized' | 'numeric';
  
  // Attribute mode
  attributeMode: 'elements' | 'attributes' | 'smart';
  
  // Namespace support
  namespaceEnabled: boolean;
  namespaceUri: string;
  namespacePrefix: string;
  
  // Key transformation
  sortKeys: boolean;
  keyTransform: 'none' | 'lowercase' | 'uppercase' | 'camelCase' | 'kebab-case';
}

export const DEFAULT_XML_SETTINGS: XMLConversionSettings = {
  rootElement: 'root',
  includeDeclaration: true,
  encoding: 'UTF-8',
  version: '1.0',
  
  indentation: '2spaces',
  lineBreaks: true,
  
  arrayWrapper: false,
  arrayWrapperName: 'items',
  itemNaming: 'singular',
  customItemName: 'item',
  includeArrayIndex: false,
  
  cdataMode: 'auto',
  nullHandling: 'self-closing',
  customNullText: 'null',
  booleanFormat: 'lowercase',
  
  attributeMode: 'elements',
  
  namespaceEnabled: false,
  namespaceUri: '',
  namespacePrefix: '',
  
  sortKeys: false,
  keyTransform: 'none',
};

/**
 * Characters that require CDATA wrapping or entity encoding
 */
const CDATA_CONTENT_REGEX = /[<>&]/;

/**
 * XML entities for encoding special characters
 */
const XML_ENTITIES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;',
};

/**
 * Get singular form of a word (basic implementation)
 */
function getSingular(word: string): string {
  if (word.endsWith('ies')) {
    return word.slice(0, -3) + 'y';
  }
  if (word.endsWith('es') && (word.endsWith('shes') || word.endsWith('ches') || word.endsWith('xes') || word.endsWith('sses'))) {
    return word.slice(0, -2);
  }
  if (word.endsWith('s') && !word.endsWith('ss')) {
    return word.slice(0, -1);
  }
  return word;
}

/**
 * Transform key based on settings
 */
function transformKey(key: string, transform: XMLConversionSettings['keyTransform']): string {
  switch (transform) {
    case 'lowercase':
      return key.toLowerCase();
    case 'uppercase':
      return key.toUpperCase();
    case 'camelCase':
      return key.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    case 'kebab-case':
      return key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/[\s_]+/g, '-');
    default:
      return key;
  }
}

/**
 * Sanitize element name to be valid XML
 */
function sanitizeElementName(name: string): string {
  // XML element names can't start with numbers or special characters
  let sanitized = name.replace(/[^a-zA-Z0-9_-]/g, '_');
  if (/^[0-9]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }
  if (/^xml/i.test(sanitized)) {
    sanitized = '_' + sanitized;
  }
  return sanitized || 'element';
}

/**
 * Encode special characters as XML entities
 */
function encodeXMLEntities(text: string): string {
  return text.replace(/[<>&"']/g, (char) => XML_ENTITIES[char] || char);
}

/**
 * Check if value needs CDATA wrapping
 */
function needsCDATA(value: string, mode: XMLConversionSettings['cdataMode']): boolean {
  if (mode === 'disabled') return false;
  if (mode === 'force') return true;
  // Auto mode: wrap if contains special characters
  return CDATA_CONTENT_REGEX.test(value);
}

/**
 * Wrap text in CDATA section
 */
function wrapCDATA(text: string): string {
  // Handle nested CDATA by splitting on ]]>
  const escaped = text.replace(/]]>/g, ']]]]><![CDATA[>');
  return `<![CDATA[${escaped}]]>`;
}

/**
 * Format a value for XML output
 */
function formatValue(
  value: unknown,
  settings: XMLConversionSettings
): string {
  if (value === null || value === undefined) {
    switch (settings.nullHandling) {
      case 'custom':
        return encodeXMLEntities(settings.customNullText);
      case 'omit':
        return '';
      default:
        return '';
    }
  }

  if (typeof value === 'boolean') {
    switch (settings.booleanFormat) {
      case 'capitalized':
        return value ? 'True' : 'False';
      case 'numeric':
        return value ? '1' : '0';
      default:
        return value ? 'true' : 'false';
    }
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    if (needsCDATA(value, settings.cdataMode)) {
      return wrapCDATA(value);
    }
    return encodeXMLEntities(value);
  }

  return encodeXMLEntities(String(value));
}

/**
 * Get indentation string based on settings
 */
function getIndent(level: number, settings: XMLConversionSettings): string {
  if (!settings.lineBreaks || settings.indentation === 'none') {
    return '';
  }
  
  let unit = '';
  switch (settings.indentation) {
    case '2spaces':
      unit = '  ';
      break;
    case '4spaces':
      unit = '    ';
      break;
    case 'tabs':
      unit = '\t';
      break;
  }
  
  return unit.repeat(level);
}

/**
 * Get line break string based on settings
 */
function getLineBreak(settings: XMLConversionSettings): string {
  return settings.lineBreaks ? '\n' : '';
}

/**
 * Get item element name for arrays
 */
function getItemName(parentKey: string, index: number, settings: XMLConversionSettings): string {
  let baseName: string;
  
  switch (settings.itemNaming) {
    case 'singular':
      baseName = getSingular(parentKey);
      break;
    case 'custom':
      baseName = settings.customItemName || 'item';
      break;
    case 'parent':
      baseName = parentKey;
      break;
    default:
      baseName = 'item';
  }
  
  return sanitizeElementName(baseName);
}

/**
 * Build namespace prefix for elements
 */
function getNamespacePrefix(settings: XMLConversionSettings): string {
  if (!settings.namespaceEnabled || !settings.namespacePrefix) {
    return '';
  }
  return settings.namespacePrefix + ':';
}

/**
 * Convert a JavaScript value to XML string
 */
function convertToXML(
  key: string,
  value: unknown,
  settings: XMLConversionSettings,
  level: number = 0,
  // isArrayItem parameter reserved for future use (e.g., different formatting for array items)
  _isArrayItem = false,
  arrayIndex?: number
): string {
  // Suppress unused variable warning - parameter reserved for future functionality
  void _isArrayItem;
  const indent = getIndent(level, settings);
  const lineBreak = getLineBreak(settings);
  const prefix = getNamespacePrefix(settings);
  const transformedKey = transformKey(sanitizeElementName(key), settings.keyTransform);
  
  // Handle null/undefined
  if (value === null || value === undefined) {
    switch (settings.nullHandling) {
      case 'omit':
        return '';
      case 'empty':
        return `${indent}<${prefix}${transformedKey}></${prefix}${transformedKey}>${lineBreak}`;
      case 'custom':
        return `${indent}<${prefix}${transformedKey}>${encodeXMLEntities(settings.customNullText)}</${prefix}${transformedKey}>${lineBreak}`;
      case 'self-closing':
      default:
        return `${indent}<${prefix}${transformedKey} />${lineBreak}`;
    }
  }

  // Handle arrays
  if (Array.isArray(value)) {
    let result = '';
    
    if (settings.arrayWrapper) {
      const wrapperName = sanitizeElementName(settings.arrayWrapperName || key);
      result += `${indent}<${prefix}${wrapperName}>${lineBreak}`;
      
      value.forEach((item, index) => {
        const itemName = getItemName(key, index, settings);
        result += convertToXML(itemName, item, settings, level + 1, true, index);
      });
      
      result += `${indent}</${prefix}${wrapperName}>${lineBreak}`;
    } else {
      value.forEach((item, index) => {
        const itemName = getItemName(key, index, settings);
        result += convertToXML(itemName, item, settings, level, true, index);
      });
    }
    
    return result;
  }

  // Handle objects
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value);
    
    if (settings.sortKeys) {
      entries.sort((a, b) => a[0].localeCompare(b[0]));
    }
    
    // Check if we should use attributes (smart mode)
    const useAttributes = settings.attributeMode === 'attributes' || 
      (settings.attributeMode === 'smart' && entries.every(([, v]) => 
        typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'
      ));
    
    if (useAttributes && entries.length > 0) {
      const attrs = entries
        .filter(([, v]) => v !== null && v !== undefined && typeof v !== 'object')
        .map(([k, v]) => {
          const attrKey = transformKey(sanitizeElementName(k), settings.keyTransform);
          const attrValue = formatValue(v, { ...settings, cdataMode: 'disabled' });
          return `${attrKey}="${attrValue}"`;
        })
        .join(' ');
      
      const complexEntries = entries.filter(([, v]) => typeof v === 'object' && v !== null);
      
      if (complexEntries.length === 0) {
        const indexAttr = settings.includeArrayIndex && arrayIndex !== undefined 
          ? ` index="${arrayIndex}"` 
          : '';
        return `${indent}<${prefix}${transformedKey}${indexAttr}${attrs ? ' ' + attrs : ''} />${lineBreak}`;
      }
      
      let result = `${indent}<${prefix}${transformedKey}${attrs ? ' ' + attrs : ''}>${lineBreak}`;
      
      complexEntries.forEach(([k, v]) => {
        result += convertToXML(k, v, settings, level + 1);
      });
      
      result += `${indent}</${prefix}${transformedKey}>${lineBreak}`;
      return result;
    }
    
    // Standard element mode
    const indexAttr = settings.includeArrayIndex && arrayIndex !== undefined 
      ? ` index="${arrayIndex}"` 
      : '';
    
    let result = `${indent}<${prefix}${transformedKey}${indexAttr}>${lineBreak}`;
    
    entries.forEach(([k, v]) => {
      result += convertToXML(k, v, settings, level + 1);
    });
    
    result += `${indent}</${prefix}${transformedKey}>${lineBreak}`;
    return result;
  }

  // Handle primitives
  const formattedValue = formatValue(value, settings);
  const indexAttr = settings.includeArrayIndex && arrayIndex !== undefined 
    ? ` index="${arrayIndex}"` 
    : '';
  
  return `${indent}<${prefix}${transformedKey}${indexAttr}>${formattedValue}</${prefix}${transformedKey}>${lineBreak}`;
}

/**
 * Convert JSON string to XML string
 */
export function convertJSONToXML(
  jsonInput: string,
  settings: Partial<XMLConversionSettings> = {}
): { success: true; output: string } | { success: false; error: string } {
  const mergedSettings: XMLConversionSettings = {
    ...DEFAULT_XML_SETTINGS,
    ...settings,
  };

  try {
    // Parse JSON
    const parsed = JSON.parse(jsonInput);
    
    // Build XML output
    let xml = '';
    const lineBreak = getLineBreak(mergedSettings);
    const prefix = getNamespacePrefix(mergedSettings);
    
    // Add XML declaration
    if (mergedSettings.includeDeclaration) {
      xml += `<?xml version="${mergedSettings.version}" encoding="${mergedSettings.encoding}"?>${lineBreak}`;
    }
    
    // Build root element with optional namespace
    const rootName = sanitizeElementName(mergedSettings.rootElement);
    let rootAttrs = '';
    
    if (mergedSettings.namespaceEnabled && mergedSettings.namespaceUri) {
      if (mergedSettings.namespacePrefix) {
        rootAttrs = ` xmlns:${mergedSettings.namespacePrefix}="${mergedSettings.namespaceUri}"`;
      } else {
        rootAttrs = ` xmlns="${mergedSettings.namespaceUri}"`;
      }
    }
    
    xml += `<${prefix}${rootName}${rootAttrs}>${lineBreak}`;
    
    // Convert content
    if (Array.isArray(parsed)) {
      // Handle root-level array
      parsed.forEach((item, index) => {
        const itemName = getItemName(mergedSettings.rootElement, index, mergedSettings);
        xml += convertToXML(itemName, item, mergedSettings, 1, true, index);
      });
    } else if (typeof parsed === 'object' && parsed !== null) {
      // Handle root-level object
      const entries = Object.entries(parsed);
      
      if (mergedSettings.sortKeys) {
        entries.sort((a, b) => a[0].localeCompare(b[0]));
      }
      
      entries.forEach(([key, value]) => {
        xml += convertToXML(key, value, mergedSettings, 1);
      });
    } else {
      // Handle primitive root value
      xml += getIndent(1, mergedSettings) + formatValue(parsed, mergedSettings) + lineBreak;
    }
    
    xml += `</${prefix}${rootName}>`;
    
    return { success: true, output: xml };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: `JSON parsing error: ${message}` };
  }
}

/**
 * Format JSON string (pretty print)
 */
export function formatJSON(jsonInput: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(jsonInput);
    return JSON.stringify(parsed, null, indent);
  } catch {
    return jsonInput;
  }
}

/**
 * Estimate output size in bytes
 */
export function estimateOutputSize(xml: string): { bytes: number; formatted: string } {
  const bytes = new TextEncoder().encode(xml).length;
  
  if (bytes < 1024) {
    return { bytes, formatted: `${bytes} B` };
  } else if (bytes < 1024 * 1024) {
    return { bytes, formatted: `${(bytes / 1024).toFixed(2)} KB` };
  } else {
    return { bytes, formatted: `${(bytes / (1024 * 1024)).toFixed(2)} MB` };
  }
}
