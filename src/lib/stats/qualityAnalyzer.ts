/**
 * Data quality analysis for JSON Stats tool
 */

import type {
  DataQualityInsights,
  QualityIssue,
  JsonDataType,
  JsonValue,
} from './types';
import { isPlainObject, isArray, getJsonType } from './types';

/**
 * Analyze data quality of JSON
 */
export function analyzeQuality(data: JsonValue): DataQualityInsights {
  const issues: QualityIssue[] = [];
  const inconsistentTypes: Map<string, Set<JsonDataType>> = new Map();
  
  let nullCount = 0;
  let emptyStringCount = 0;
  let emptyArrayCount = 0;
  let emptyObjectCount = 0;
  
  // Traverse and collect issues
  traverseForQuality(data, '', issues, inconsistentTypes, (counts) => {
    nullCount = counts.nulls;
    emptyStringCount = counts.emptyStrings;
    emptyArrayCount = counts.emptyArrays;
    emptyObjectCount = counts.emptyObjects;
  });
  
  // Convert inconsistent types map to array
  const inconsistentTypesArray = Array.from(inconsistentTypes.entries())
    .filter(([, types]) => types.size > 1)
    .map(([key, types]) => ({
      key,
      types: Array.from(types),
    }));
  
  // Add issues for inconsistent types
  for (const { key, types } of inconsistentTypesArray) {
    issues.push({
      type: 'inconsistent_type',
      path: key,
      message: `Key "${key}" has inconsistent types: ${types.join(', ')}`,
      severity: 'warning',
    });
  }
  
  // Calculate quality score (0-100)
  const score = calculateQualityScore({
    nullCount,
    emptyStringCount,
    emptyArrayCount,
    emptyObjectCount,
    inconsistentTypeCount: inconsistentTypesArray.length,
    totalIssues: issues.length,
  });
  
  // Generate suggestions
  const suggestions = generateSuggestions({
    nullCount,
    emptyStringCount,
    emptyArrayCount,
    emptyObjectCount,
    inconsistentTypes: inconsistentTypesArray,
  });
  
  return {
    score,
    issues: issues.slice(0, 50), // Limit to 50 issues
    nullCount,
    emptyStringCount,
    emptyArrayCount,
    emptyObjectCount,
    inconsistentTypes: inconsistentTypesArray,
    suggestions,
  };
}

/**
 * Traverse JSON and collect quality issues
 */
function traverseForQuality(
  value: JsonValue,
  path: string,
  issues: QualityIssue[],
  keyTypes: Map<string, Set<JsonDataType>>,
  updateCounts: (counts: {
    nulls: number;
    emptyStrings: number;
    emptyArrays: number;
    emptyObjects: number;
  }) => void
): void {
  const counts = {
    nulls: 0,
    emptyStrings: 0,
    emptyArrays: 0,
    emptyObjects: 0,
  };
  
  function traverse(val: JsonValue, currentPath: string, key?: string): void {
    // Track key types for inconsistency detection
    if (key && !isPlainObject(val) && !isArray(val)) {
      if (!keyTypes.has(key)) {
        keyTypes.set(key, new Set());
      }
      keyTypes.get(key)!.add(getJsonType(val));
    }
    
    // Check for null
    if (val === null) {
      counts.nulls++;
      if (issues.length < 100) {
        issues.push({
          type: 'null_value',
          path: currentPath,
          message: `Null value at ${currentPath || 'root'}`,
          severity: 'info',
        });
      }
      return;
    }
    
    // Check for empty string
    if (val === '') {
      counts.emptyStrings++;
      if (issues.length < 100) {
        issues.push({
          type: 'empty_string',
          path: currentPath,
          message: `Empty string at ${currentPath || 'root'}`,
          severity: 'info',
        });
      }
      return;
    }
    
    // Check for empty array
    if (isArray(val)) {
      if (val.length === 0) {
        counts.emptyArrays++;
        if (issues.length < 100) {
          issues.push({
            type: 'empty_array',
            path: currentPath,
            message: `Empty array at ${currentPath || 'root'}`,
            severity: 'info',
          });
        }
      } else {
        val.forEach((item, index) => {
          traverse(item, `${currentPath}[${index}]`);
        });
      }
      return;
    }
    
    // Check for empty object
    if (isPlainObject(val)) {
      const keys = Object.keys(val);
      if (keys.length === 0) {
        counts.emptyObjects++;
        if (issues.length < 100) {
          issues.push({
            type: 'empty_object',
            path: currentPath,
            message: `Empty object at ${currentPath || 'root'}`,
            severity: 'info',
          });
        }
      } else {
        for (const k of keys) {
          const newPath = currentPath ? `${currentPath}.${k}` : k;
          traverse(val[k], newPath, k);
        }
      }
    }
  }
  
  traverse(value, path);
  updateCounts(counts);
}

/**
 * Calculate quality score based on issues
 */
function calculateQualityScore(params: {
  nullCount: number;
  emptyStringCount: number;
  emptyArrayCount: number;
  emptyObjectCount: number;
  inconsistentTypeCount: number;
  totalIssues: number;
}): number {
  let score = 100;
  
  // Deduct for nulls (minor)
  score -= Math.min(params.nullCount * 0.5, 10);
  
  // Deduct for empty values (minor)
  const emptyCount = params.emptyStringCount + params.emptyArrayCount + params.emptyObjectCount;
  score -= Math.min(emptyCount * 0.5, 10);
  
  // Deduct for inconsistent types (more significant)
  score -= Math.min(params.inconsistentTypeCount * 5, 30);
  
  // Deduct for total issues (capped)
  score -= Math.min(params.totalIssues * 0.2, 20);
  
  return Math.max(0, Math.round(score));
}

/**
 * Generate improvement suggestions
 */
function generateSuggestions(params: {
  nullCount: number;
  emptyStringCount: number;
  emptyArrayCount: number;
  emptyObjectCount: number;
  inconsistentTypes: { key: string; types: JsonDataType[] }[];
}): string[] {
  const suggestions: string[] = [];
  
  if (params.nullCount > 0) {
    suggestions.push(
      `Consider removing or replacing ${params.nullCount} null value(s) for cleaner data.`
    );
  }
  
  if (params.emptyStringCount > 0) {
    suggestions.push(
      `${params.emptyStringCount} empty string(s) found. Consider using null or removing these fields.`
    );
  }
  
  if (params.emptyArrayCount > 0) {
    suggestions.push(
      `${params.emptyArrayCount} empty array(s) found. Remove if not needed to reduce size.`
    );
  }
  
  if (params.emptyObjectCount > 0) {
    suggestions.push(
      `${params.emptyObjectCount} empty object(s) found. Remove if not needed to reduce size.`
    );
  }
  
  if (params.inconsistentTypes.length > 0) {
    const examples = params.inconsistentTypes.slice(0, 3).map(t => t.key);
    suggestions.push(
      `${params.inconsistentTypes.length} key(s) have inconsistent types (${examples.join(', ')}). Standardize types for better data quality.`
    );
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Your JSON data looks clean! No major quality issues detected.');
  }
  
  return suggestions;
}

/**
 * Get severity distribution of issues
 */
export function getSeverityDistribution(
  issues: QualityIssue[]
): { info: number; warning: number; error: number } {
  return {
    info: issues.filter(i => i.severity === 'info').length,
    warning: issues.filter(i => i.severity === 'warning').length,
    error: issues.filter(i => i.severity === 'error').length,
  };
}
