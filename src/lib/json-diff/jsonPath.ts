/**
 * JSONPath utilities for navigating and querying JSON structures
 */

export type PathSegment = string | number;

/**
 * Build JSONPath string from path array
 * @param path - Array of keys/indices
 * @returns JSONPath string
 */
export function buildJSONPath(path: PathSegment[]): string {
  if (!path || path.length === 0) {
    return '$';
  }
  
  return '$' + path.map(segment => {
    if (typeof segment === 'number') {
      return `[${segment}]`;
    }
    // Check if segment needs bracket notation
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(segment)) {
      return `.${segment}`;
    }
    return `['${segment.replace(/'/g, "\\'")}']`;
  }).join('');
}

/**
 * Parse JSONPath string into path array
 * @param jsonPath - JSONPath string (e.g., "$.user[0].name")
 * @returns Array of path segments
 */
export function parseJSONPath(jsonPath: string): PathSegment[] {
  if (!jsonPath || jsonPath === '$') {
    return [];
  }
  
  const path: PathSegment[] = [];
  let current = jsonPath.slice(1); // Remove '$'
  
  while (current.length > 0) {
    // Match bracket notation: [0] or ['key']
    const bracketMatch = current.match(/^\[(\d+)\]|^\['([^']+)'\]/);
    if (bracketMatch) {
      if (bracketMatch[1] !== undefined) {
        path.push(parseInt(bracketMatch[1], 10));
      } else {
        path.push(bracketMatch[2]);
      }
      current = current.slice(bracketMatch[0].length);
      continue;
    }
    
    // Match dot notation: .key
    const dotMatch = current.match(/^\.([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (dotMatch) {
      path.push(dotMatch[1]);
      current = current.slice(dotMatch[0].length);
      continue;
    }
    
    // Invalid path
    break;
  }
  
  return path;
}

/**
 * Get value at JSONPath in object
 * @param obj - Object to navigate
 * @param jsonPath - JSONPath string
 * @returns Value at path or undefined
 */
export function getValueAtPath(obj: any, jsonPath: string): any {
  const path = parseJSONPath(jsonPath);
  let current = obj;
  
  for (const segment of path) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[segment];
  }
  
  return current;
}

/**
 * Check if JSONPath matches a pattern (supports wildcards and .. for deep matching)
 * @param jsonPath - JSONPath to check
 * @param pattern - Pattern (supports * wildcard and .. for deep matching)
 * @returns True if matches
 */
export function matchesPattern(jsonPath: string, pattern: string): boolean {
  // Handle deep matching with ..
  if (pattern.includes('..')) {
    // For deep matching, check if the pattern matches anywhere in the path
    const searchPattern = pattern.replace(/^\$\.?/, '');
    
    // If pattern ends with .*, match the base and then allow array indices
    if (searchPattern.endsWith('.*')) {
      const basePattern = searchPattern.slice(0, -2);
      const escapedBase = basePattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regexPattern = `${escapedBase}(?:\\.|\\[\\d+\\]|\\[\\'[^\\']+\\'\\])(?:[^\\[\\]\\.]*|\\[\\d+\\]|\\[\\'[^\\']+\\'\\])*`;
      const regex = new RegExp(regexPattern);
      return regex.test(jsonPath);
    }
    
    // For other deep patterns, split by .. and check segments
    const parts = pattern.split('..');
    let lastIndex = 0;
    for (const part of parts) {
      if (part === '') continue;
      const cleanPart = part.replace(/^\$\.?/, '');
      if (cleanPart) {
        let partPattern = cleanPart
          .replace(/\$/g, '\\$')
          .replace(/\./g, '\\.');
        
        if (partPattern.includes('*')) {
          partPattern = partPattern.replace(/\*/g, '(?:[^\\[\\]]+|\\[\\d+\\]|\\[\\\'[^\\\']+\\\'])*');
        }
        
        const regex = new RegExp(partPattern);
        const found = jsonPath.substring(lastIndex).search(regex);
        if (found === -1) return false;
        lastIndex += found + partPattern.length;
      }
    }
    return true;
  }
  
  // Special handling for patterns ending with .*
  if (pattern.endsWith('.*')) {
    const basePattern = pattern.slice(0, -2);
    const baseRegex = basePattern
      .replace(/\$/g, '\\$')
      .replace(/\./g, '\\.');
    
    const regexPattern = `^${baseRegex}(?:\\.|\\[\\d+\\]|\\[\\'[^\\']+\\'\\])(?:[^\\[\\]\\.]*|\\[\\d+\\]|\\[\\'[^\\']+\\'\\])*$`;
    const regex = new RegExp(regexPattern);
    return regex.test(jsonPath);
  }
  
  // Handle other wildcard patterns
  let regexPattern = pattern
    .replace(/\$/g, '\\$')
    .replace(/\./g, '\\.');
  
  if (regexPattern.includes('*')) {
    regexPattern = regexPattern.replace(/\*/g, '(?:\\.[^\\[\\]]+|\\[\\d+\\]|\\[\\\'[^\\\']+\\\'])*');
  }
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(jsonPath);
}

/**
 * Check if JSONPath should be ignored based on ignore patterns
 * @param jsonPath - JSONPath to check
 * @param ignorePatterns - Array of patterns to ignore
 * @returns True if should be ignored
 */
export function shouldIgnorePath(jsonPath: string, ignorePatterns: string[] = []): boolean {
  return ignorePatterns.some(pattern => {
    if (pattern.startsWith('/') && pattern.endsWith('/')) {
      // Regex pattern
      try {
        const regex = new RegExp(pattern.slice(1, -1));
        return regex.test(jsonPath);
      } catch {
        return false;
      }
    }
    // JSONPath pattern with wildcards
    return matchesPattern(jsonPath, pattern);
  });
}

/**
 * Check if a path matches an include pattern or is a parent of a path that matches
 * This allows traversal to parent paths that lead to matching paths
 * @param jsonPath - JSONPath to check
 * @param includePatterns - Array of include patterns
 * @returns True if should be included
 */
export function shouldIncludePath(jsonPath: string, includePatterns: string[] = []): boolean {
  if (includePatterns.length === 0) {
    return true;
  }
  
  // Check if path directly matches any include pattern
  const directMatch = includePatterns.some(pattern => matchesPattern(jsonPath, pattern));
  if (directMatch) {
    return true;
  }
  
  // Check if this path is a parent/ancestor of any path that matches an include pattern
  for (const pattern of includePatterns) {
    // Handle root path - always allow root if any pattern exists
    if (jsonPath === '$') {
      return true;
    }
    
    let cleanPattern = pattern;
    
    // For patterns with wildcards, extract the base path
    if (pattern.includes('*')) {
      const parts = pattern.split('*');
      cleanPattern = parts[0].replace(/\.$/, '');
    } else if (pattern.includes('..')) {
      cleanPattern = pattern;
    }
    
    // Check if jsonPath is a prefix of the pattern (parent path)
    if (cleanPattern.startsWith(jsonPath + '.') || 
        cleanPattern.startsWith(jsonPath + '[') ||
        jsonPath === cleanPattern) {
      return true;
    }
    
    // For patterns with wildcards at the end, check if jsonPath is a parent
    if (pattern.includes('*') && !pattern.startsWith('$..')) {
      const basePattern = pattern.split('*')[0].replace(/\.$/, '');
      if (jsonPath === basePattern || jsonPath.startsWith(basePattern + '.')) {
        return true;
      }
    }
  }
  
  return false;
}
