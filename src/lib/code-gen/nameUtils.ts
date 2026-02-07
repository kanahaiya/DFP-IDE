/**
 * Name conversion utilities for JSON to Code converters
 */

import { RESERVED_KEYWORDS } from './types';

/**
 * Convert string to PascalCase (for class/struct names)
 * Examples: "user_name" -> "UserName", "firstName" -> "FirstName"
 */
export function toPascalCase(str: string): string {
  if (!str) return 'Unknown';
  
  // Handle special characters and split
  const words = str
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(/[\s_-]+/)
    .filter(Boolean);
  
  if (words.length === 0) return 'Unknown';
  
  // Handle already camelCase strings
  const result = words.map(word => {
    // Split camelCase words
    const subWords = word.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    return subWords.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  }).join('');
  
  // Ensure starts with letter
  if (/^[0-9]/.test(result)) {
    return 'N' + result;
  }
  
  return result;
}

/**
 * Convert string to camelCase (for property/field names)
 * Examples: "user_name" -> "userName", "FirstName" -> "firstName"
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  if (!pascal) return 'unknown';
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert string to snake_case
 * Examples: "userName" -> "user_name", "FirstName" -> "first_name"
 */
export function toSnakeCase(str: string): string {
  if (!str) return 'unknown';
  
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/^_/, '')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

/**
 * Sanitize identifier for a specific language
 * Handles reserved keywords and invalid characters
 */
export function sanitizeIdentifier(
  name: string, 
  language: 'go' | 'swift' | 'dart',
  style: 'pascal' | 'camel' | 'snake' = 'camel'
): string {
  let result: string;
  
  switch (style) {
    case 'pascal':
      result = toPascalCase(name);
      break;
    case 'snake':
      result = toSnakeCase(name);
      break;
    case 'camel':
    default:
      result = toCamelCase(name);
  }
  
  // Check for reserved keywords
  const keywords = RESERVED_KEYWORDS[language] || [];
  if (keywords.includes(result.toLowerCase())) {
    // Append underscore or use different strategy based on language
    switch (language) {
      case 'go':
        // Go convention: capitalize or add underscore
        result = result + '_';
        break;
      case 'swift':
        // Swift: use backticks in output, but store with suffix
        result = result + 'Value';
        break;
      case 'dart':
        // Dart: add suffix
        result = result + '_';
        break;
    }
  }
  
  return result;
}

/**
 * Generate a unique class name from a field key
 * Handles nested objects with parent context
 */
export function generateClassName(
  key: string,
  parentName?: string,
  existingNames?: Set<string>
): string {
  let baseName = toPascalCase(key);
  
  // If parent context provided, use it for disambiguation
  if (parentName && existingNames?.has(baseName)) {
    baseName = parentName + baseName;
  }
  
  // Ensure uniqueness
  if (existingNames) {
    let uniqueName = baseName;
    let counter = 1;
    while (existingNames.has(uniqueName)) {
      uniqueName = baseName + counter;
      counter++;
    }
    existingNames.add(uniqueName);
    return uniqueName;
  }
  
  return baseName;
}

/**
 * Singularize a plural word (basic implementation)
 * Used for array element class names
 */
export function singularize(word: string): string {
  if (!word) return word;
  
  const lowerWord = word.toLowerCase();
  
  // Common irregular plurals
  const irregulars: Record<string, string> = {
    'children': 'child',
    'people': 'person',
    'men': 'man',
    'women': 'woman',
    'mice': 'mouse',
    'geese': 'goose',
    'teeth': 'tooth',
    'feet': 'foot',
    'data': 'datum',
    'indices': 'index',
    'matrices': 'matrix',
    'vertices': 'vertex',
  };
  
  if (irregulars[lowerWord]) {
    // Preserve original case
    const result = irregulars[lowerWord];
    if (word[0] === word[0].toUpperCase()) {
      return result.charAt(0).toUpperCase() + result.slice(1);
    }
    return result;
  }
  
  // Common patterns
  if (lowerWord.endsWith('ies') && word.length > 3) {
    return word.slice(0, -3) + 'y';
  }
  if (lowerWord.endsWith('es') && (lowerWord.endsWith('sses') || lowerWord.endsWith('xes') || lowerWord.endsWith('zes') || lowerWord.endsWith('ches') || lowerWord.endsWith('shes'))) {
    return word.slice(0, -2);
  }
  if (lowerWord.endsWith('s') && !lowerWord.endsWith('ss') && word.length > 1) {
    return word.slice(0, -1);
  }
  
  return word;
}
