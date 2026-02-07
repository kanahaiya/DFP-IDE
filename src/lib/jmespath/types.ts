/**
 * JMESPath Query Tester Types
 * Type definitions for JMESPath query testing
 */

export type ResultFormat = 'json' | 'table' | 'tree';

export interface JMESPathSettings {
  autoExecute: boolean;
  debounceMs: number;
  resultFormat: ResultFormat;
  showExecutionTime: boolean;
  prettyPrint: boolean;
  indentSize: number;
}

export const DEFAULT_JMESPATH_SETTINGS: JMESPathSettings = {
  autoExecute: true,
  debounceMs: 300,
  resultFormat: 'json',
  showExecutionTime: true,
  prettyPrint: true,
  indentSize: 2,
};

export interface JMESPathResult {
  result: unknown;
  executionTime: number;
  error?: string;
}

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  hasResult: boolean;
  isSuccessful: boolean;
}

export interface JMESPathPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<JMESPathSettings>;
}

export interface JMESPathExample {
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

// JMESPath operators reference
export const JMESPATH_SYNTAX: SyntaxReference[] = [
  { syntax: 'identifier', name: 'Property Access', description: 'Access object property', example: 'name' },
  { syntax: 'foo.bar', name: 'Subexpression', description: 'Nested property access', example: 'store.book' },
  { syntax: '[n]', name: 'Index Access', description: 'Array element by index', example: 'book[0]' },
  { syntax: '[-n]', name: 'Negative Index', description: 'Array element from end', example: 'book[-1]' },
  { syntax: '[*]', name: 'List Projection', description: 'Project all array elements', example: 'book[*].title' },
  { syntax: '*', name: 'Object Projection', description: 'Project all object values', example: 'store.*' },
  { syntax: '[start:stop]', name: 'Slice', description: 'Array slice', example: 'book[0:2]' },
  { syntax: '[::step]', name: 'Step Slice', description: 'Slice with step', example: 'book[::2]' },
  { syntax: '[?expression]', name: 'Filter', description: 'Filter by condition', example: 'book[?price < `10`]' },
  { syntax: '[]', name: 'Flatten', description: 'Flatten nested arrays', example: 'nested[]' },
  { syntax: '|', name: 'Pipe', description: 'Chain expressions', example: 'book[*].title | [0]' },
  { syntax: '{ key: expr }', name: 'Multiselect Hash', description: 'Create object from expressions', example: '{ name: name, price: price }' },
  { syntax: '[ expr ]', name: 'Multiselect List', description: 'Create array from expressions', example: '[ name, price ]' },
  { syntax: '`literal`', name: 'Literal', description: 'Literal value in expression', example: '[?status == `active`]' },
  { syntax: '&expr', name: 'Expression Reference', description: 'Reference to expression', example: 'sort_by(@, &age)' },
  { syntax: '@', name: 'Current Node', description: 'Reference to current element', example: '[?@ > `10`]' },
];

// Built-in functions reference
export const JMESPATH_FUNCTIONS: SyntaxReference[] = [
  { syntax: 'length()', name: 'Length', description: 'Array/string/object length', example: 'length(items)' },
  { syntax: 'keys()', name: 'Keys', description: 'Object keys', example: 'keys(object)' },
  { syntax: 'values()', name: 'Values', description: 'Object values', example: 'values(object)' },
  { syntax: 'sort()', name: 'Sort', description: 'Sort array', example: 'sort(numbers)' },
  { syntax: 'sort_by()', name: 'Sort By', description: 'Sort by expression', example: 'sort_by(items, &price)' },
  { syntax: 'reverse()', name: 'Reverse', description: 'Reverse array', example: 'reverse(items)' },
  { syntax: 'contains()', name: 'Contains', description: 'Check if contains value', example: "contains(tags, 'json')" },
  { syntax: 'starts_with()', name: 'Starts With', description: 'String starts with', example: "starts_with(name, 'J')" },
  { syntax: 'ends_with()', name: 'Ends With', description: 'String ends with', example: "ends_with(file, '.json')" },
  { syntax: 'type()', name: 'Type', description: 'Get value type', example: 'type(value)' },
  { syntax: 'to_string()', name: 'To String', description: 'Convert to string', example: 'to_string(number)' },
  { syntax: 'to_number()', name: 'To Number', description: 'Convert to number', example: "to_number('42')" },
  { syntax: 'join()', name: 'Join', description: 'Join array to string', example: "join(', ', names)" },
  { syntax: 'min()', name: 'Min', description: 'Minimum value', example: 'min(prices)' },
  { syntax: 'max()', name: 'Max', description: 'Maximum value', example: 'max(prices)' },
  { syntax: 'sum()', name: 'Sum', description: 'Sum of numbers', example: 'sum(prices)' },
  { syntax: 'avg()', name: 'Average', description: 'Average of numbers', example: 'avg(prices)' },
  { syntax: 'not_null()', name: 'Not Null', description: 'First non-null value', example: 'not_null(a, b, c)' },
  { syntax: 'merge()', name: 'Merge', description: 'Merge objects', example: 'merge(obj1, obj2)' },
  { syntax: 'map()', name: 'Map', description: 'Map expression over array', example: 'map(&name, items)' },
];
