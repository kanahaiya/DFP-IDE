/**
 * TypeScript Generator Types
 */

import type { NamingConvention, CaseConvention, ValidationError } from '../code-gen/types';

/**
 * Array notation style
 */
export type ArrayNotation = 'brackets' | 'generic'; // T[] vs Array<T>

/**
 * Output format for TypeScript
 */
export type TypeScriptOutputFormat = 'interface' | 'type' | 'both';

/**
 * Null handling strategy
 */
export type NullHandling = 'nullable' | 'optional' | 'undefined' | 'null-or-undefined';

/**
 * TypeScript generator settings
 */
export interface TypeScriptGeneratorSettings {
  // Naming
  rootTypeName: string;
  typeNaming: CaseConvention;
  propertyNaming: NamingConvention;
  
  // Output format
  outputFormat: TypeScriptOutputFormat;
  exportTypes: boolean;
  useTypeKeyword: boolean; // type vs interface
  
  // Type options
  arrayNotation: ArrayNotation;
  useReadonly: boolean;
  useOptionalProperties: boolean;
  markAllOptional: boolean;
  
  // Null handling
  nullHandling: NullHandling;
  useStrictNullChecks: boolean;
  useUnknownInsteadOfAny: boolean;
  
  // Advanced
  generateJSDoc: boolean;
  includeExamples: boolean;
  generateEnums: boolean;
  inlineNestedTypes: boolean;
  addIndexSignature: boolean;
  
  // Formatting
  indentSize: number;
  useSpaces: boolean;
  sortProperties: boolean;
  addTrailingComma: boolean;
}

/**
 * Default settings
 */
export const DEFAULT_TYPESCRIPT_SETTINGS: TypeScriptGeneratorSettings = {
  rootTypeName: 'Root',
  typeNaming: 'PascalCase',
  propertyNaming: 'camelCase',
  
  outputFormat: 'interface',
  exportTypes: true,
  useTypeKeyword: false,
  
  arrayNotation: 'brackets',
  useReadonly: false,
  useOptionalProperties: true,
  markAllOptional: false,
  
  nullHandling: 'nullable',
  useStrictNullChecks: true,
  useUnknownInsteadOfAny: true,
  
  generateJSDoc: false,
  includeExamples: false,
  generateEnums: false,
  inlineNestedTypes: false,
  addIndexSignature: false,
  
  indentSize: 2,
  useSpaces: true,
  sortProperties: false,
  addTrailingComma: true,
};

/**
 * Property definition for TypeScript
 */
export interface TypeScriptProperty {
  name: string;
  originalName: string;
  type: string;
  isOptional: boolean;
  isReadonly: boolean;
  jsDoc?: string;
  example?: string;
}

/**
 * Interface/Type definition
 */
export interface TypeScriptTypeDefinition {
  name: string;
  properties: TypeScriptProperty[];
  isExported: boolean;
  jsDoc?: string;
}

/**
 * Generation result
 */
export interface TypeScriptGenerationResult {
  success: boolean;
  code?: string;
  interfaces?: TypeScriptTypeDefinition[];
  typeCount?: number;
  errors?: ValidationError[];
}
