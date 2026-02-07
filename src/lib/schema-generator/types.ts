/**
 * JSON to Schema Generator Types
 * Type definitions for schema generation
 */

import type { EditorLanguage } from '@/types';

export type SchemaFormat = 
  | 'json-schema-draft-07'
  | 'json-schema-2019-09'
  | 'json-schema-2020-12'
  | 'typescript-interface'
  | 'typescript-type'
  | 'zod'
  | 'yup'
  | 'mongoose'
  | 'graphql'
  | 'flow'
  | 'rust'
  | 'go';

export interface SchemaFormatInfo {
  id: SchemaFormat;
  name: string;
  description: string;
  icon: string;
  fileExtension: string;
  language: EditorLanguage;
}

export const SCHEMA_FORMATS: SchemaFormatInfo[] = [
  {
    id: 'json-schema-draft-07',
    name: 'JSON Schema (Draft-07)',
    description: 'JSON Schema Draft-07 specification',
    icon: 'fa-file-code',
    fileExtension: 'json',
    language: 'json',
  },
  {
    id: 'json-schema-2019-09',
    name: 'JSON Schema (2019-09)',
    description: 'JSON Schema Draft 2019-09',
    icon: 'fa-file-code',
    fileExtension: 'json',
    language: 'json',
  },
  {
    id: 'json-schema-2020-12',
    name: 'JSON Schema (2020-12)',
    description: 'JSON Schema Draft 2020-12 (latest)',
    icon: 'fa-file-code',
    fileExtension: 'json',
    language: 'json',
  },
  {
    id: 'typescript-interface',
    name: 'TypeScript Interface',
    description: 'TypeScript interface definitions',
    icon: 'fa-code',
    fileExtension: 'ts',
    language: 'typescript',
  },
  {
    id: 'typescript-type',
    name: 'TypeScript Type',
    description: 'TypeScript type aliases',
    icon: 'fa-code',
    fileExtension: 'ts',
    language: 'typescript',
  },
  {
    id: 'zod',
    name: 'Zod Schema',
    description: 'Zod validation schema',
    icon: 'fa-shield-alt',
    fileExtension: 'ts',
    language: 'typescript',
  },
  {
    id: 'yup',
    name: 'Yup Schema',
    description: 'Yup validation schema',
    icon: 'fa-check-double',
    fileExtension: 'ts',
    language: 'typescript',
  },
  {
    id: 'mongoose',
    name: 'Mongoose Schema',
    description: 'MongoDB Mongoose schema',
    icon: 'fa-database',
    fileExtension: 'js',
    language: 'javascript',
  },
  {
    id: 'graphql',
    name: 'GraphQL Type',
    description: 'GraphQL type definitions',
    icon: 'fa-project-diagram',
    fileExtension: 'graphql',
    language: 'graphql',
  },
  {
    id: 'flow',
    name: 'Flow Type',
    description: 'Flow type annotations',
    icon: 'fa-water',
    fileExtension: 'js',
    language: 'javascript',
  },
  {
    id: 'rust',
    name: 'Rust Struct',
    description: 'Rust struct with serde',
    icon: 'fa-cog',
    fileExtension: 'rs',
    language: 'rust',
  },
  {
    id: 'go',
    name: 'Go Struct',
    description: 'Go struct with JSON tags',
    icon: 'fa-code',
    fileExtension: 'go',
    language: 'go',
  },
];

export type InferredType = 
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'null'
  | 'array'
  | 'object'
  | 'date'
  | 'email'
  | 'uri'
  | 'uuid'
  | 'unknown';

export interface InferredProperty {
  name: string;
  type: InferredType;
  isRequired: boolean;
  isNullable: boolean;
  format?: string;
  items?: InferredSchema;
  properties?: Record<string, InferredProperty>;
  enum?: unknown[];
  description?: string;
}

export interface InferredSchema {
  type: InferredType;
  properties?: Record<string, InferredProperty>;
  items?: InferredSchema;
  required?: string[];
  title?: string;
  description?: string;
}

export interface SchemaGeneratorSettings {
  format: SchemaFormat;
  rootName: string;
  inferEnums: boolean;
  inferFormats: boolean;
  makeAllRequired: boolean;
  makeAllOptional: boolean;
  addDescriptions: boolean;
  indentation: number | 'tab';
  sortProperties: boolean;
}

export const DEFAULT_SCHEMA_GENERATOR_SETTINGS: SchemaGeneratorSettings = {
  format: 'json-schema-draft-07',
  rootName: 'Root',
  inferEnums: true,
  inferFormats: true,
  makeAllRequired: false,
  makeAllOptional: false,
  addDescriptions: false,
  indentation: 2,
  sortProperties: false,
};

export interface SchemaGenerationResult {
  success: boolean;
  output: string;
  errors: string[];
  format: SchemaFormat;
}

export interface SchemaGeneratorPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<SchemaGeneratorSettings>;
}
