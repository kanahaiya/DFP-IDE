/**
 * JMESPath Executor
 * Execute JMESPath queries against JSON data using jmespath package
 */

import jmespath from 'jmespath';
import type { JMESPathResult, JMESPathSettings } from './types';

/**
 * Parse JSON string safely
 */
export function parseJSON(input: string): { data: unknown; error?: string } {
  if (!input.trim()) {
    return { data: null, error: 'JSON input is empty' };
  }

  try {
    const data = JSON.parse(input);
    return { data };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid JSON';
    return { data: null, error: `Parse error: ${error}` };
  }
}

/**
 * Validate JMESPath query syntax
 */
export function validateQuery(query: string): { isValid: boolean; error?: string } {
  if (!query.trim()) {
    return { isValid: false, error: 'Query is empty' };
  }

  try {
    // Try to execute the query against empty object to check syntax
    jmespath.search({}, query);
    return { isValid: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid query syntax';
    return { isValid: false, error };
  }
}

/**
 * Execute JMESPath query and return results
 */
export function executeJMESPath(
  jsonInput: string,
  query: string
): JMESPathResult {
  const startTime = performance.now();

  // Parse JSON
  const { data, error: parseError } = parseJSON(jsonInput);
  if (parseError) {
    return {
      result: null,
      executionTime: performance.now() - startTime,
      error: parseError,
    };
  }

  // Validate query
  const { isValid, error: queryError } = validateQuery(query);
  if (!isValid) {
    return {
      result: null,
      executionTime: performance.now() - startTime,
      error: queryError,
    };
  }

  try {
    // Execute JMESPath query
    const result = jmespath.search(data, query);
    
    return {
      result,
      executionTime: performance.now() - startTime,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Query execution failed';
    return {
      result: null,
      executionTime: performance.now() - startTime,
      error: `Execution error: ${errorMessage}`,
    };
  }
}

/**
 * Format result value for display
 */
export function formatResultValue(
  value: unknown,
  settings: JMESPathSettings
): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  
  if (settings.prettyPrint) {
    return JSON.stringify(value, null, settings.indentSize);
  }
  
  return JSON.stringify(value);
}

/**
 * Convert result to table format
 */
export function resultToTable(result: unknown): {
  headers: string[];
  rows: (string | number | boolean | null)[][];
} {
  if (result === null || result === undefined) {
    return { headers: [], rows: [] };
  }

  // If result is an array of objects
  if (Array.isArray(result) && result.length > 0) {
    const firstItem = result[0];
    
    if (typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
      const keys = Object.keys(firstItem);
      const headers = ['#', ...keys];
      const rows = result.map((item, index) => {
        const obj = item as Record<string, unknown>;
        return [
          index + 1,
          ...keys.map(k => {
            const val = obj[k];
            if (val === null) return null;
            if (typeof val === 'object') return JSON.stringify(val);
            return val as string | number | boolean;
          }),
        ];
      });
      return { headers, rows };
    }
    
    // Array of primitives
    return {
      headers: ['#', 'Value', 'Type'],
      rows: result.map((item, index) => [
        index + 1,
        typeof item === 'object' ? JSON.stringify(item) : String(item),
        Array.isArray(item) ? 'array' : item === null ? 'null' : typeof item,
      ]),
    };
  }

  // Single object
  if (typeof result === 'object' && !Array.isArray(result)) {
    const obj = result as Record<string, unknown>;
    return {
      headers: ['Property', 'Value', 'Type'],
      rows: Object.entries(obj).map(([key, value]) => [
        key,
        typeof value === 'object' ? JSON.stringify(value) : String(value),
        Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value,
      ]),
    };
  }

  // Primitive value
  return {
    headers: ['Value', 'Type'],
    rows: [[String(result), typeof result]],
  };
}

/**
 * Check if result is empty
 */
export function isEmptyResult(result: unknown): boolean {
  if (result === null || result === undefined) return true;
  if (Array.isArray(result) && result.length === 0) return true;
  if (typeof result === 'object' && Object.keys(result as object).length === 0) return true;
  return false;
}
