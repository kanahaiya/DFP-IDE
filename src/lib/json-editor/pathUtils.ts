/**
 * JSON Path Utilities
 * Helper functions for navigating and manipulating JSON paths
 */

import type { JsonValue, JsonObject, NodeType } from './types';

/**
 * Generate a unique ID for a tree node
 */
export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convert path array to string representation
 * e.g., ['users', '0', 'name'] -> 'users[0].name'
 */
export function pathToString(path: string[]): string {
  if (path.length === 0) return 'root';
  
  return path.reduce((acc, segment, index) => {
    // Check if segment is a numeric array index
    if (/^\d+$/.test(segment)) {
      return `${acc}[${segment}]`;
    }
    // Check if segment needs bracket notation (contains special chars)
    if (/[^a-zA-Z0-9_$]/.test(segment) || /^\d/.test(segment)) {
      return `${acc}["${segment}"]`;
    }
    return index === 0 ? segment : `${acc}.${segment}`;
  }, '');
}

/**
 * Convert string path to array
 * e.g., 'users[0].name' -> ['users', '0', 'name']
 */
export function stringToPath(pathString: string): string[] {
  if (!pathString || pathString === 'root') return [];
  
  const result: string[] = [];
  let current = '';
  let inBracket = false;
  let inQuote = false;
  let quoteChar = '';
  
  for (let i = 0; i < pathString.length; i++) {
    const char = pathString[i];
    
    if (!inBracket && !inQuote) {
      if (char === '.') {
        if (current) {
          result.push(current);
          current = '';
        }
      } else if (char === '[') {
        if (current) {
          result.push(current);
          current = '';
        }
        inBracket = true;
      } else {
        current += char;
      }
    } else if (inBracket) {
      if (char === '"' || char === "'") {
        if (!inQuote) {
          inQuote = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuote = false;
        } else {
          current += char;
        }
      } else if (char === ']' && !inQuote) {
        result.push(current);
        current = '';
        inBracket = false;
      } else {
        current += char;
      }
    }
  }
  
  if (current) {
    result.push(current);
  }
  
  return result;
}

/**
 * Get the value at a path in a JSON object
 */
export function getValueAtPath(data: JsonValue, path: string[]): JsonValue | undefined {
  if (path.length === 0) return data;
  
  let current: JsonValue = data;
  
  for (const segment of path) {
    if (current === null || typeof current !== 'object') {
      return undefined;
    }
    
    if (Array.isArray(current)) {
      const index = parseInt(segment, 10);
      if (isNaN(index) || index < 0 || index >= current.length) {
        return undefined;
      }
      current = current[index];
    } else {
      if (!(segment in current)) {
        return undefined;
      }
      current = (current as JsonObject)[segment];
    }
  }
  
  return current;
}

/**
 * Set a value at a path in a JSON object (immutably)
 */
export function setValueAtPath(data: JsonValue, path: string[], value: JsonValue): JsonValue {
  if (path.length === 0) return value;
  
  const [head, ...rest] = path;
  
  if (Array.isArray(data)) {
    const index = parseInt(head, 10);
    const newArray = [...data];
    newArray[index] = rest.length === 0 ? value : setValueAtPath(data[index], rest, value);
    return newArray;
  }
  
  if (typeof data === 'object' && data !== null) {
    return {
      ...data,
      [head]: rest.length === 0 ? value : setValueAtPath((data as JsonObject)[head], rest, value),
    };
  }
  
  return data;
}

/**
 * Delete a value at a path (immutably)
 */
export function deleteAtPath(data: JsonValue, path: string[]): JsonValue {
  if (path.length === 0) return data;
  if (path.length === 1) {
    const [key] = path;
    
    if (Array.isArray(data)) {
      const index = parseInt(key, 10);
      return data.filter((_, i) => i !== index);
    }
    
    if (typeof data === 'object' && data !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...rest } = data as JsonObject;
      return rest;
    }
    
    return data;
  }
  
  const [head, ...rest] = path;
  
  if (Array.isArray(data)) {
    const index = parseInt(head, 10);
    const newArray = [...data];
    newArray[index] = deleteAtPath(data[index], rest);
    return newArray;
  }
  
  if (typeof data === 'object' && data !== null) {
    return {
      ...data,
      [head]: deleteAtPath((data as JsonObject)[head], rest),
    };
  }
  
  return data;
}

/**
 * Add a property at a path (immutably)
 */
export function addPropertyAtPath(
  data: JsonValue,
  path: string[],
  key: string,
  value: JsonValue
): JsonValue {
  const parent = getValueAtPath(data, path);
  
  if (typeof parent !== 'object' || parent === null) {
    throw new Error(`Cannot add property to non-object at path: ${pathToString(path)}`);
  }
  
  if (Array.isArray(parent)) {
    const newArray = [...parent, value];
    return setValueAtPath(data, path, newArray);
  }
  
  const newObject = { ...parent, [key]: value };
  return setValueAtPath(data, path, newObject);
}

/**
 * Rename a key at a path (immutably)
 */
export function renameKeyAtPath(
  data: JsonValue,
  path: string[],
  oldKey: string,
  newKey: string
): JsonValue {
  if (oldKey === newKey) return data;
  
  const parent = getValueAtPath(data, path);
  
  if (typeof parent !== 'object' || parent === null || Array.isArray(parent)) {
    throw new Error(`Cannot rename key at path: ${pathToString(path)}`);
  }
  
  const entries = Object.entries(parent as JsonObject);
  const newObject: JsonObject = {};
  
  for (const [key, val] of entries) {
    newObject[key === oldKey ? newKey : key] = val;
  }
  
  return setValueAtPath(data, path, newObject);
}

/**
 * Move an array item (immutably)
 */
export function moveArrayItem(
  data: JsonValue,
  path: string[],
  fromIndex: number,
  toIndex: number
): JsonValue {
  const array = getValueAtPath(data, path);
  
  if (!Array.isArray(array)) {
    throw new Error(`Cannot move item in non-array at path: ${pathToString(path)}`);
  }
  
  if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) {
    throw new Error('Index out of bounds');
  }
  
  const newArray = [...array];
  const [removed] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, removed);
  
  return setValueAtPath(data, path, newArray);
}

/**
 * Get the type of a JSON value
 */
export function getNodeType(value: JsonValue): NodeType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  
  switch (typeof value) {
    case 'string': return 'string';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'object': return 'object';
    default: return 'null';
  }
}

/**
 * Get default value for a type
 */
export function getDefaultValue(type: NodeType): JsonValue {
  switch (type) {
    case 'object': return {};
    case 'array': return [];
    case 'string': return '';
    case 'number': return 0;
    case 'boolean': return false;
    case 'null': return null;
  }
}

/**
 * Get display name for a type
 */
export function getTypeDisplayName(type: NodeType): string {
  switch (type) {
    case 'object': return 'Object';
    case 'array': return 'Array';
    case 'string': return 'String';
    case 'number': return 'Number';
    case 'boolean': return 'Boolean';
    case 'null': return 'Null';
  }
}

/**
 * Get icon for a type
 */
export function getTypeIcon(type: NodeType): string {
  switch (type) {
    case 'object': return 'fas fa-brackets-curly';
    case 'array': return 'fas fa-brackets-square';
    case 'string': return 'fas fa-quote-right';
    case 'number': return 'fas fa-hashtag';
    case 'boolean': return 'fas fa-toggle-on';
    case 'null': return 'fas fa-minus';
  }
}

/**
 * Check if a key is valid
 */
export function isValidKey(key: string): boolean {
  return key.length > 0;
}

/**
 * Check if a value is a primitive
 */
export function isPrimitive(value: JsonValue): boolean {
  return value === null || typeof value !== 'object';
}

/**
 * Count children of a value
 */
export function countChildren(value: JsonValue): number {
  if (value === null || typeof value !== 'object') return 0;
  if (Array.isArray(value)) return value.length;
  return Object.keys(value).length;
}

/**
 * Get parent path from a path
 */
export function getParentPath(path: string[]): string[] {
  return path.slice(0, -1);
}

/**
 * Get key from a path
 */
export function getKeyFromPath(path: string[]): string | undefined {
  return path.length > 0 ? path[path.length - 1] : undefined;
}

/**
 * Check if pathA is ancestor of pathB
 */
export function isAncestor(pathA: string[], pathB: string[]): boolean {
  if (pathA.length >= pathB.length) return false;
  return pathA.every((segment, index) => pathB[index] === segment);
}
