/**
 * Shared types for JSON to Code converters
 */

/**
 * Naming convention options
 */
export type NamingConvention = 'camelCase' | 'PascalCase' | 'snake_case' | 'SCREAMING_SNAKE_CASE' | 'kebab-case' | 'preserve';

/**
 * Case convention for class/type names
 */
export type CaseConvention = 'PascalCase' | 'camelCase' | 'snake_case';

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export interface JsonObject { [key: string]: JsonValue }
export type JsonArray = JsonValue[];

/**
 * Inferred type information for a JSON value
 */
export interface InferredType {
  type: 'string' | 'int' | 'float' | 'boolean' | 'null' | 'array' | 'object' | 'mixed';
  isNullable: boolean;
  arrayElementType?: InferredType;
  objectFields?: Record<string, InferredType>;
  originalKey?: string;
}

/**
 * Field information for code generation
 */
export interface FieldInfo {
  name: string;
  originalName: string;
  type: InferredType;
  isRequired: boolean;
}

/**
 * Generated class/struct information
 */
export interface GeneratedClass {
  name: string;
  fields: FieldInfo[];
  nestedClasses: GeneratedClass[];
}

/**
 * Common settings for all code generators
 */
export interface BaseGeneratorSettings {
  rootClassName: string;
  indentation: number | 'tab';
  useNullableTypes: boolean;
}

/**
 * Conversion result
 */
export interface ConversionResult {
  success: boolean;
  code?: string;
  errors?: ValidationError[];
  generatedClasses?: GeneratedClass[];
}

/**
 * Validation error
 */
export interface ValidationError {
  message: string;
  line?: number;
  column?: number;
  type: 'syntax' | 'type' | 'naming';
}

/**
 * Reserved keywords for various languages
 */
export const RESERVED_KEYWORDS: Record<string, string[]> = {
  go: [
    'break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 'else',
    'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import', 'interface',
    'map', 'package', 'range', 'return', 'select', 'struct', 'switch', 'type', 'var'
  ],
  swift: [
    'associatedtype', 'class', 'deinit', 'enum', 'extension', 'fileprivate',
    'func', 'import', 'init', 'inout', 'internal', 'let', 'open', 'operator',
    'private', 'protocol', 'public', 'rethrows', 'static', 'struct', 'subscript',
    'typealias', 'var', 'break', 'case', 'continue', 'default', 'defer', 'do',
    'else', 'fallthrough', 'for', 'guard', 'if', 'in', 'repeat', 'return',
    'switch', 'where', 'while', 'Any', 'catch', 'false', 'is', 'nil', 'super',
    'self', 'Self', 'throw', 'throws', 'true', 'try', 'Type'
  ],
  dart: [
    'abstract', 'as', 'assert', 'async', 'await', 'break', 'case', 'catch',
    'class', 'const', 'continue', 'covariant', 'default', 'deferred', 'do',
    'dynamic', 'else', 'enum', 'export', 'extends', 'extension', 'external',
    'factory', 'false', 'final', 'finally', 'for', 'Function', 'get', 'hide',
    'if', 'implements', 'import', 'in', 'interface', 'is', 'late', 'library',
    'mixin', 'new', 'null', 'on', 'operator', 'part', 'required', 'rethrow',
    'return', 'set', 'show', 'static', 'super', 'switch', 'sync', 'this',
    'throw', 'true', 'try', 'typedef', 'var', 'void', 'while', 'with', 'yield'
  ]
};
