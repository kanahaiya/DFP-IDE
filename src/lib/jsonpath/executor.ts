/**
 * JSONPath Executor
 * Execute JSONPath queries against JSON data using jsonpath-plus
 */

import { JSONPath } from 'jsonpath-plus';
import type { JSONPathResult, JSONPathMatch, JSONPathSettings } from './types';

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
 * Validate JSONPath query syntax
 */
export function validateQuery(query: string): { isValid: boolean; error?: string } {
  if (!query.trim()) {
    return { isValid: false, error: 'Query is empty' };
  }

  // Basic syntax checks
  if (!query.startsWith('$') && !query.startsWith('@')) {
    return { isValid: false, error: 'JSONPath query must start with $ or @' };
  }

  // Check for balanced brackets
  const brackets = { '[': 0, '(': 0 };
  for (const char of query) {
    if (char === '[') brackets['[']++;
    if (char === ']') brackets['[']--;
    if (char === '(') brackets['(']++;
    if (char === ')') brackets['(']--;
    
    if (brackets['['] < 0 || brackets['('] < 0) {
      return { isValid: false, error: 'Unbalanced brackets in query' };
    }
  }

  if (brackets['['] !== 0) {
    return { isValid: false, error: 'Unclosed square bracket in query' };
  }
  if (brackets['('] !== 0) {
    return { isValid: false, error: 'Unclosed parenthesis in query' };
  }

  return { isValid: true };
}

/**
 * Execute JSONPath query and return results
 */
export function executeJSONPath(
  jsonInput: string,
  query: string,
  settings: JSONPathSettings
): JSONPathResult {
  const startTime = performance.now();

  // Parse JSON
  const { data, error: parseError } = parseJSON(jsonInput);
  if (parseError) {
    return {
      matches: [],
      matchCount: 0,
      executionTime: performance.now() - startTime,
      error: parseError,
    };
  }

  // Validate query
  const { isValid, error: queryError } = validateQuery(query);
  if (!isValid) {
    return {
      matches: [],
      matchCount: 0,
      executionTime: performance.now() - startTime,
      error: queryError,
    };
  }

  try {
    // Execute JSONPath query with path tracking
    const results: JSONPathMatch[] = [];
    
    JSONPath({
      path: query,
      json: data as object,
      resultType: 'all',
      callback: (payloadValue: unknown, type: string, fullPayload: {
        value: unknown;
        path: string;
        pointer: string;
      }) => {
        if (settings.showPaths) {
          results.push({
            value: fullPayload.value,
            path: fullPayload.path,
            pointer: fullPayload.pointer,
          });
        } else {
          results.push({
            value: fullPayload.value,
            path: '',
            pointer: '',
          });
        }
      },
    });

    return {
      matches: results,
      matchCount: results.length,
      executionTime: performance.now() - startTime,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Query execution failed';
    return {
      matches: [],
      matchCount: 0,
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
  settings: JSONPathSettings
): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  
  if (settings.prettyPrint) {
    return JSON.stringify(value, null, settings.indentSize);
  }
  
  return JSON.stringify(value);
}

/**
 * Extract just values from matches
 */
export function extractValues(matches: JSONPathMatch[]): unknown[] {
  return matches.map(match => match.value);
}

/**
 * Convert matches to table format
 */
export function matchesToTable(matches: JSONPathMatch[]): {
  headers: string[];
  rows: (string | number | boolean | null)[][];
} {
  if (matches.length === 0) {
    return { headers: [], rows: [] };
  }

  // Check if all values are objects with same keys
  const values = matches.map(m => m.value);
  const firstValue = values[0];

  if (
    typeof firstValue === 'object' &&
    firstValue !== null &&
    !Array.isArray(firstValue)
  ) {
    const keys = Object.keys(firstValue);
    const allSameStructure = values.every(
      v =>
        typeof v === 'object' &&
        v !== null &&
        !Array.isArray(v) &&
        keys.every(k => k in (v as Record<string, unknown>))
    );

    if (allSameStructure) {
      const headers = ['#', 'Path', ...keys];
      const rows = matches.map((match, index) => {
        const obj = match.value as Record<string, unknown>;
        return [
          index + 1,
          match.path,
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
  }

  // Default: simple value table
  return {
    headers: ['#', 'Path', 'Value', 'Type'],
    rows: matches.map((match, index) => [
      index + 1,
      match.path,
      typeof match.value === 'object'
        ? JSON.stringify(match.value)
        : String(match.value),
      Array.isArray(match.value)
        ? 'array'
        : match.value === null
        ? 'null'
        : typeof match.value,
    ]),
  };
}
