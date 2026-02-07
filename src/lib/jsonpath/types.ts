/**
 * JSONPath Tester Types
 * Type definitions for JSONPath query testing
 */

export type ResultFormat = 'json' | 'table' | 'tree';

export interface JSONPathSettings {
  autoExecute: boolean;
  debounceMs: number;
  resultFormat: ResultFormat;
  showPaths: boolean;
  wrapResults: boolean;
  prettyPrint: boolean;
  indentSize: number;
}

export const DEFAULT_JSONPATH_SETTINGS: JSONPathSettings = {
  autoExecute: true,
  debounceMs: 300,
  resultFormat: 'json',
  showPaths: true,
  wrapResults: true,
  prettyPrint: true,
  indentSize: 2,
};

export interface JSONPathMatch {
  value: unknown;
  path: string;
  pointer: string;
}

export interface JSONPathResult {
  matches: JSONPathMatch[];
  matchCount: number;
  executionTime: number;
  error?: string;
}

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  matchCount: number;
  isSuccessful: boolean;
}

export interface JSONPathPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<JSONPathSettings>;
}

export interface JSONPathExample {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  json: string;
  queries: {
    name: string;
    query: string;
    description: string;
  }[];
}

export interface SyntaxReference {
  syntax: string;
  name: string;
  description: string;
  example: string;
}

// JSONPath operators reference
export const JSONPATH_SYNTAX: SyntaxReference[] = [
  { syntax: '$', name: 'Root', description: 'Root element', example: '$' },
  { syntax: '@', name: 'Current', description: 'Current element', example: '@.price' },
  { syntax: '.property', name: 'Dot Notation', description: 'Child property', example: '$.store.book' },
  { syntax: "['property']", name: 'Bracket Notation', description: 'Child property', example: "$['store']['book']" },
  { syntax: '[n]', name: 'Array Index', description: 'Array element by index', example: '$.store.book[0]' },
  { syntax: '[-n]', name: 'Negative Index', description: 'Array element from end', example: '$.store.book[-1]' },
  { syntax: '[start:end]', name: 'Array Slice', description: 'Array slice', example: '$.store.book[0:2]' },
  { syntax: '[::step]', name: 'Step Slice', description: 'Array slice with step', example: '$.store.book[::2]' },
  { syntax: '*', name: 'Wildcard', description: 'All elements', example: '$.store.*' },
  { syntax: '[*]', name: 'Array Wildcard', description: 'All array elements', example: '$.store.book[*]' },
  { syntax: '..', name: 'Recursive', description: 'Recursive descent', example: '$..author' },
  { syntax: '[?(@.condition)]', name: 'Filter', description: 'Filter expression', example: '$.store.book[?(@.price < 10)]' },
  { syntax: '[a,b,c]', name: 'Union', description: 'Multiple selections', example: '$.store.book[0,1,3]' },
  { syntax: '.length()', name: 'Length', description: 'Array/string length', example: '$.store.book.length()' },
];
