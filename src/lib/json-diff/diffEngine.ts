/**
 * Core semantic diff engine for JSON comparison
 */

import { computeLCS, matchByIdentifier } from './lcsAlgorithm';
import { buildJSONPath, shouldIgnorePath, parseJSONPath, matchesPattern, shouldIncludePath, PathSegment } from './jsonPath';

// Change type constants
export const CHANGE_TYPES = {
  SAME: 'SAME',
  ADDED: 'ADDED',
  REMOVED: 'REMOVED',
  MODIFIED: 'MODIFIED',
  MOVED: 'MOVED',
  TYPE_CHANGED: 'TYPE_CHANGED',
} as const;

export type ChangeType = typeof CHANGE_TYPES[keyof typeof CHANGE_TYPES];

export interface Change {
  type: ChangeType;
  path: PathSegment[];
  jsonPath: string;
  value?: any;
  oldValue?: any;
  newValue?: any;
  oldIndex?: number;
  newIndex?: number;
  oldPath?: string;
  newPath?: string;
}

export interface CompareOptions {
  maxDepth?: number;
  ignorePatterns?: string[];
  typeCoercion?: boolean;
  floatTolerance?: number;
  caseInsensitive?: boolean;
  ignoreKeyOrder?: boolean;
  arrayStrategy?: 'index' | 'identifier' | 'lcs';
  identifierFields?: string[];
  treatNullAsMissing?: boolean;
  subTreePath?: string | null;
  includePatterns?: string[];
  excludePatterns?: string[];
  structureOnly?: boolean;
  _arrayIndexContext?: { oldIndex: number; newIndex: number } | null;
}

export interface DiffStats {
  total: number;
  added: number;
  removed: number;
  modified: number;
  moved: number;
  typeChanged: number;
}

interface ComparisonResult {
  equal: boolean;
  typeChanged: boolean;
}

/**
 * Compare two values with type coercion and tolerance
 */
function compareValues(oldVal: any, newVal: any, options: CompareOptions = {}): ComparisonResult {
  const {
    typeCoercion = false,
    floatTolerance = 0.0001,
    caseInsensitive = false,
  } = options;

  // Strict equality
  if (oldVal === newVal) {
    return { equal: true, typeChanged: false };
  }

  // Type check
  const oldType = typeof oldVal;
  const newType = typeof newVal;

  if (oldType !== newType) {
    if (!typeCoercion) {
      return { equal: false, typeChanged: true };
    }

    // Type coercion
    if (oldType === 'number' && newType === 'string') {
      const numVal = parseFloat(newVal);
      if (!isNaN(numVal) && isFinite(numVal)) {
        if (oldVal === numVal) {
          return { equal: true, typeChanged: false };
        }
        return compareValues(oldVal, numVal, options);
      }
    } else if (oldType === 'string' && newType === 'number') {
      const numVal = parseFloat(oldVal);
      if (!isNaN(numVal) && isFinite(numVal)) {
        if (numVal === newVal) {
          return { equal: true, typeChanged: false };
        }
        return compareValues(numVal, newVal, options);
      }
    } else if (oldType === 'boolean' && newType === 'string') {
      const boolStr = String(oldVal).toLowerCase();
      const newStr = String(newVal).toLowerCase();
      if (boolStr === newStr || 
          (newStr === 'true' && oldVal === true) || 
          (newStr === 'false' && oldVal === false)) {
        return { equal: true, typeChanged: false };
      }
    } else if (oldType === 'string' && newType === 'boolean') {
      const oldStr = String(oldVal).toLowerCase();
      const boolStr = String(newVal).toLowerCase();
      if (oldStr === boolStr || 
          (oldStr === 'true' && newVal === true) || 
          (oldStr === 'false' && newVal === false)) {
        return { equal: true, typeChanged: false };
      }
    }
    
    return { equal: false, typeChanged: true };
  }

  // Same type, different values
  if (oldType === 'number' && newType === 'number') {
    if (Math.abs(oldVal - newVal) <= floatTolerance) {
      return { equal: true, typeChanged: false };
    }
  } else if (oldType === 'string' && newType === 'string') {
    if (caseInsensitive && oldVal.toLowerCase() === newVal.toLowerCase()) {
      return { equal: true, typeChanged: false };
    }
  }

  return { equal: false, typeChanged: false };
}

/**
 * Compare two primitive values
 */
function comparePrimitives(oldVal: any, newVal: any, options: CompareOptions): Partial<Change> {
  const comparison = compareValues(oldVal, newVal, options);
  
  if (comparison.equal) {
    return { type: CHANGE_TYPES.SAME };
  }
  
  if (comparison.typeChanged) {
    return {
      type: CHANGE_TYPES.TYPE_CHANGED,
      oldValue: oldVal,
      newValue: newVal,
    };
  }
  
  return {
    type: CHANGE_TYPES.MODIFIED,
    oldValue: oldVal,
    newValue: newVal,
  };
}

/**
 * Compare two objects
 */
function compareObjects(
  oldObj: Record<string, any>,
  newObj: Record<string, any>,
  path: PathSegment[],
  options: CompareOptions
): Change[] {
  const changes: Change[] = [];
  const { structureOnly } = options;
  const allKeys = new Set([
    ...Object.keys(oldObj),
    ...Object.keys(newObj),
  ]);

  // Handle key ordering
  const keys = options.ignoreKeyOrder
    ? Array.from(allKeys).sort()
    : Array.from(allKeys);

  for (const key of keys) {
    const currentPath = [...path, key];
    const jsonPath = buildJSONPath(currentPath);

    // Check ignore patterns
    if (shouldIgnorePath(jsonPath, options.ignorePatterns || [])) {
      continue;
    }
    
    // Check exclude patterns
    if (options.excludePatterns && options.excludePatterns.length > 0) {
      if (shouldIgnorePath(jsonPath, options.excludePatterns)) {
        continue;
      }
    }
    
    // Check include patterns
    if (options.includePatterns && options.includePatterns.length > 0) {
      if (!shouldIncludePath(jsonPath, options.includePatterns)) {
        continue;
      }
    }

    const oldVal = oldObj[key];
    const newVal = newObj[key];
    const oldExists = key in oldObj;
    const newExists = key in newObj;

    if (!oldExists && newExists) {
      if (options.excludePatterns && shouldIgnorePath(jsonPath, options.excludePatterns)) {
        continue;
      }
      if (options.includePatterns && !matchesPattern(jsonPath, options.includePatterns)) {
        if (!shouldIncludePath(jsonPath, options.includePatterns)) {
          continue;
        }
      }
      
      changes.push({
        type: CHANGE_TYPES.ADDED,
        path: currentPath,
        jsonPath,
        value: structureOnly ? '[key added]' : newVal,
      });
    } else if (oldExists && !newExists) {
      if (options.excludePatterns && shouldIgnorePath(jsonPath, options.excludePatterns)) {
        continue;
      }
      if (options.includePatterns && !matchesPattern(jsonPath, options.includePatterns)) {
        if (!shouldIncludePath(jsonPath, options.includePatterns)) {
          continue;
        }
      }
      
      changes.push({
        type: CHANGE_TYPES.REMOVED,
        path: currentPath,
        jsonPath,
        value: structureOnly ? '[key removed]' : oldVal,
      });
    } else {
      // Both exist
      if (structureOnly) {
        const getType = (val: any) => {
          if (val === undefined) return 'undefined';
          if (val === null) return 'null';
          if (Array.isArray(val)) return 'array';
          return typeof val;
        };
        const oldType = getType(oldVal);
        const newType = getType(newVal);
        
        if (oldType !== newType) {
          changes.push({
            type: CHANGE_TYPES.TYPE_CHANGED,
            path: currentPath,
            jsonPath,
            oldValue: `[${oldType}]`,
            newValue: `[${newType}]`,
          });
        }
        const childChanges = compare(oldVal, newVal, currentPath, options);
        changes.push(...childChanges);
      } else {
        const childChanges = compare(oldVal, newVal, currentPath, options);
        if (options._arrayIndexContext) {
          childChanges.forEach(change => {
            if (!change.oldIndex && !change.newIndex) {
              change.oldIndex = options._arrayIndexContext!.oldIndex;
              change.newIndex = options._arrayIndexContext!.newIndex;
            }
          });
        }
        changes.push(...childChanges);
      }
    }
  }

  return changes;
}

/**
 * Compare two arrays
 */
function compareArrays(
  oldArr: any[],
  newArr: any[],
  path: PathSegment[],
  options: CompareOptions
): Change[] {
  const changes: Change[] = [];
  const strategy = options.arrayStrategy || 'index';
  const arrayIndexContext = options._arrayIndexContext || null;

  if (strategy === 'identifier') {
    const idFields = options.identifierFields || ['id', 'uuid', 'key', '_id'];
    const matches = matchByIdentifier(oldArr, newArr, idFields);
    
    matches.forEach(match => {
      if (match.type === 'same' && match.index1 !== undefined && match.index2 !== undefined) {
        const oldVal = oldArr[match.index1];
        const newVal = newArr[match.index2];
        
        if (match.index1 !== match.index2) {
          // Element moved
          const movedPath = [...path, match.index2];
          const movedJsonPath = buildJSONPath(movedPath);
          const oldJsonPath = buildJSONPath([...path, match.index1]);
          
          let shouldSkipMoved = false;
          if (options.excludePatterns && options.excludePatterns.length > 0) {
            if (shouldIgnorePath(movedJsonPath, options.excludePatterns) || 
                shouldIgnorePath(oldJsonPath, options.excludePatterns)) {
              shouldSkipMoved = true;
            }
          }
          
          if (!shouldSkipMoved && options.includePatterns && options.includePatterns.length > 0) {
            if (!shouldIncludePath(movedJsonPath, options.includePatterns) && 
                !shouldIncludePath(oldJsonPath, options.includePatterns)) {
              shouldSkipMoved = true;
            }
          }
          
          const nestedOptions = {
            ...options,
            _arrayIndexContext: { oldIndex: match.index1, newIndex: match.index2 }
          };
          const childChanges = compare(oldVal, newVal, [...path, match.index2], nestedOptions);
          
          if (!shouldSkipMoved) {
            changes.push({
              type: CHANGE_TYPES.MOVED,
              path: movedPath,
              jsonPath: movedJsonPath,
              value: newVal,
              oldIndex: match.index1,
              newIndex: match.index2,
              oldPath: oldJsonPath,
              newPath: movedJsonPath,
            });
          }
          
          childChanges.forEach(change => {
            if (!change.oldIndex && !change.newIndex) {
              change.oldIndex = match.index1;
              change.newIndex = match.index2;
            }
            if (change.path && change.path.length > path.length) {
              const arrayIndexPosition = path.length;
              if (typeof change.path[arrayIndexPosition] === 'number') {
                change.path[arrayIndexPosition] = change.oldIndex!;
                change.jsonPath = buildJSONPath(change.path);
              }
            }
          });
          changes.push(...childChanges);
        } else {
          const nestedOptions = {
            ...options,
            _arrayIndexContext: { oldIndex: match.index1, newIndex: match.index2 }
          };
          const childChanges = compare(oldVal, newVal, [...path, match.index1], nestedOptions);
          
          childChanges.forEach(change => {
            if (arrayIndexContext) {
              change.oldIndex = arrayIndexContext.oldIndex;
              change.newIndex = arrayIndexContext.newIndex;
            } else {
              change.oldIndex = match.index1;
              change.newIndex = match.index2;
            }
            if (change.path && change.path.length > path.length) {
              const arrayIndexPosition = path.length;
              if (typeof change.path[arrayIndexPosition] === 'number') {
                if (change.path[arrayIndexPosition] !== change.oldIndex) {
                  change.path[arrayIndexPosition] = change.oldIndex!;
                  change.jsonPath = buildJSONPath(change.path);
                }
              }
            }
          });
          changes.push(...childChanges);
        }
      } else if (match.type === 'added' && match.index2 !== undefined) {
        changes.push({
          type: CHANGE_TYPES.ADDED,
          path: [...path, match.index2],
          jsonPath: buildJSONPath([...path, match.index2]),
          value: newArr[match.index2],
        });
      } else if (match.type === 'removed' && match.index1 !== undefined) {
        changes.push({
          type: CHANGE_TYPES.REMOVED,
          path: [...path, match.index1],
          jsonPath: buildJSONPath([...path, match.index1]),
          value: oldArr[match.index1],
        });
      }
    });
  } else if (strategy === 'lcs') {
    const lcsResult = computeLCS(oldArr, newArr);
    
    lcsResult.forEach(match => {
      if (match.type === 'same' && match.index1 !== undefined && match.index2 !== undefined) {
        const oldVal = oldArr[match.index1];
        const newVal = newArr[match.index2];
        
        if (match.index1 !== match.index2) {
          changes.push({
            type: CHANGE_TYPES.MOVED,
            path: [...path, match.index2],
            jsonPath: buildJSONPath([...path, match.index2]),
            value: newVal,
            oldIndex: match.index1,
            newIndex: match.index2,
            oldPath: buildJSONPath([...path, match.index1]),
            newPath: buildJSONPath([...path, match.index2]),
          });
          
          const childChanges = compare(oldVal, newVal, [...path, match.index2], options);
          changes.push(...childChanges);
        } else {
          const childChanges = compare(oldVal, newVal, [...path, match.index1], options);
          changes.push(...childChanges);
        }
      } else if (match.type === 'added' && match.index2 !== undefined) {
        const addedPath = [...path, match.index2];
        const addedJsonPath = buildJSONPath(addedPath);
        
        if (options.excludePatterns && shouldIgnorePath(addedJsonPath, options.excludePatterns)) {
          return;
        }
        
        changes.push({
          type: CHANGE_TYPES.ADDED,
          path: addedPath,
          jsonPath: addedJsonPath,
          value: newArr[match.index2],
        });
      } else if (match.type === 'removed' && match.index1 !== undefined) {
        const removedPath = [...path, match.index1];
        const removedJsonPath = buildJSONPath(removedPath);
        
        if (options.excludePatterns && shouldIgnorePath(removedJsonPath, options.excludePatterns)) {
          return;
        }
        
        changes.push({
          type: CHANGE_TYPES.REMOVED,
          path: removedPath,
          jsonPath: removedJsonPath,
          value: oldArr[match.index1],
        });
      }
    });
  } else {
    // Index-based matching (default)
    const maxLen = Math.max(oldArr.length, newArr.length);
    
    for (let i = 0; i < maxLen; i++) {
      const currentPath = [...path, i];
      const jsonPath = buildJSONPath(currentPath);
      
      if (shouldIgnorePath(jsonPath, options.ignorePatterns || [])) {
        continue;
      }
      
      if (options.excludePatterns && shouldIgnorePath(jsonPath, options.excludePatterns)) {
        continue;
      }
      
      if (options.includePatterns && !shouldIncludePath(jsonPath, options.includePatterns)) {
        continue;
      }

      const oldVal = oldArr[i];
      const newVal = newArr[i];

      if (i >= oldArr.length) {
        if (options.excludePatterns && shouldIgnorePath(jsonPath, options.excludePatterns)) {
          continue;
        }
        changes.push({
          type: CHANGE_TYPES.ADDED,
          path: currentPath,
          jsonPath,
          value: newVal,
        });
      } else if (i >= newArr.length) {
        if (options.excludePatterns && shouldIgnorePath(jsonPath, options.excludePatterns)) {
          continue;
        }
        changes.push({
          type: CHANGE_TYPES.REMOVED,
          path: currentPath,
          jsonPath,
          value: oldVal,
        });
      } else {
        const childChanges = compare(oldVal, newVal, currentPath, options);
        changes.push(...childChanges);
      }
    }
  }

  return changes;
}

/**
 * Main comparison function
 * @param oldVal - Old value
 * @param newVal - New value
 * @param path - Current path in JSON structure
 * @param options - Comparison options
 * @returns Array of change objects
 */
export function compare(
  oldVal: any,
  newVal: any,
  path: PathSegment[] = [],
  options: CompareOptions = {}
): Change[] {
  const {
    maxDepth = Infinity,
    ignorePatterns = [],
    typeCoercion = false,
    floatTolerance = 0.0001,
    caseInsensitive = false,
    ignoreKeyOrder = false,
    arrayStrategy = 'index',
    identifierFields = ['id', 'uuid', 'key', '_id'],
    treatNullAsMissing = false,
  } = options;

  // Check max depth
  if (path.length >= maxDepth) {
    return [];
  }

  const jsonPath = buildJSONPath(path);
  
  // Extract sub-tree and pattern options
  const subTreePath = options.subTreePath || null;
  const includePatterns = options.includePatterns || [];
  const excludePatterns = options.excludePatterns || [];
  const structureOnly = options.structureOnly || false;
  
  // Check if we're in sub-tree mode
  if (subTreePath) {
    const hasWildcards = subTreePath.includes('*') || subTreePath.includes('..');
    
    if (hasWildcards) {
      if (!matchesPattern(jsonPath, subTreePath)) {
        return [];
      }
    } else {
      const subPath = parseJSONPath(subTreePath);
      if (path.length === 0 && subPath.length > 0) {
        return [];
      }
      
      if (path.length < subPath.length) {
        const pathMatches = path.every((seg, idx) => subPath[idx] === seg);
        if (!pathMatches) {
          return [];
        }
      } else if (path.length >= subPath.length) {
        const pathMatches = subPath.every((seg, idx) => path[idx] === seg);
        if (!pathMatches) {
          return [];
        }
      }
    }
  }
  
  // Check include/exclude patterns
  if (includePatterns.length > 0 && !shouldIncludePath(jsonPath, includePatterns)) {
    return [];
  }
  
  if (excludePatterns.length > 0 && shouldIgnorePath(jsonPath, excludePatterns)) {
    return [];
  }
  
  // Check ignore patterns
  if (shouldIgnorePath(jsonPath, ignorePatterns)) {
    return [];
  }

  // Handle null as missing
  if (treatNullAsMissing) {
    if (oldVal === null && newVal !== null && newVal !== undefined) {
      return [{
        type: CHANGE_TYPES.ADDED,
        path,
        jsonPath,
        value: newVal,
      }];
    }
    if (oldVal !== null && oldVal !== undefined && newVal === null) {
      return [{
        type: CHANGE_TYPES.REMOVED,
        path,
        jsonPath,
        value: oldVal,
      }];
    }
    if (oldVal === null && newVal === null) {
      return [];
    }
  }

  // Type checking
  const getType = (val: any) => {
    if (val === undefined) return 'undefined';
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  };
  
  const oldType = getType(oldVal);
  const newType = getType(newVal);

  // Type changed
  if (oldType !== newType) {
    if (typeCoercion) {
      const isPrimitive = (type: string) => type === 'number' || type === 'string' || type === 'boolean';
      
      if (isPrimitive(oldType) && isPrimitive(newType)) {
        const coercionResult = compareValues(oldVal, newVal, {
          typeCoercion: true,
          floatTolerance,
          caseInsensitive,
        });
        
        if (coercionResult.equal) {
          return [];
        }
      }
    }
    
    return [{
      type: CHANGE_TYPES.TYPE_CHANGED,
      path,
      jsonPath,
      oldValue: oldVal,
      newValue: newVal,
    }];
  }

  // Compare based on type
  if (oldType === 'object' && oldVal !== null && !Array.isArray(oldVal)) {
    return compareObjects(oldVal, newVal, path, options);
  } else if (oldType === 'array') {
    return compareArrays(oldVal, newVal, path, options);
  } else {
    // Primitive types
    if (structureOnly) {
      return [];
    }
    
    const result = comparePrimitives(oldVal, newVal, {
      typeCoercion,
      floatTolerance,
      caseInsensitive,
    });
    
    if (result.type === CHANGE_TYPES.SAME) {
      return [];
    }
    
    return [{
      ...result as Change,
      path,
      jsonPath,
    }];
  }
}

/**
 * Compute diff statistics
 * @param changes - Array of change objects
 * @returns Statistics object
 */
export function computeStats(changes: Change[]): DiffStats {
  const stats: DiffStats = {
    total: changes.length,
    added: 0,
    removed: 0,
    modified: 0,
    moved: 0,
    typeChanged: 0,
  };

  changes.forEach(change => {
    switch (change.type) {
      case CHANGE_TYPES.ADDED:
        stats.added++;
        break;
      case CHANGE_TYPES.REMOVED:
        stats.removed++;
        break;
      case CHANGE_TYPES.MODIFIED:
        stats.modified++;
        break;
      case CHANGE_TYPES.MOVED:
        stats.moved++;
        break;
      case CHANGE_TYPES.TYPE_CHANGED:
        stats.typeChanged++;
        break;
    }
  });

  return stats;
}
