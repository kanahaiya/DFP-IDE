/**
 * JSON Schema Validator Types
 * Type definitions for JSON Schema validation
 */

export type SchemaDraft = 'draft-04' | 'draft-06' | 'draft-07' | '2019-09' | '2020-12';

export type SchemaErrorSeverity = 'error' | 'warning' | 'info';

export interface SchemaValidationError {
  path: string;
  message: string;
  keyword: string;
  schemaPath: string;
  value?: unknown;
  expectedType?: string;
  actualType?: string;
  severity: SchemaErrorSeverity;
  suggestion?: string;
}

export interface SchemaValidationResult {
  isValid: boolean;
  errors: SchemaValidationError[];
  warnings: SchemaValidationError[];
  draft: SchemaDraft;
  validationTime: number;
}

export interface SchemaValidatorSettings {
  draft: SchemaDraft;
  autoDetectDraft: boolean;
  strictMode: boolean;
  allErrors: boolean;
  validateFormats: boolean;
  coerceTypes: boolean;
}

export const DEFAULT_SCHEMA_VALIDATOR_SETTINGS: SchemaValidatorSettings = {
  draft: 'draft-07',
  autoDetectDraft: true,
  strictMode: true,
  allErrors: true,
  validateFormats: true,
  coerceTypes: false,
};

export interface ExampleSchema {
  id: string;
  name: string;
  description: string;
  icon: string;
  schema: string;
  sampleData: string;
}

export interface SchemaValidatorPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<SchemaValidatorSettings>;
}

// JSON Schema types
export interface JsonSchema {
  $schema?: string;
  $id?: string;
  $ref?: string;
  $defs?: Record<string, JsonSchema>;
  definitions?: Record<string, JsonSchema>;
  
  // Type validation
  type?: string | string[];
  enum?: unknown[];
  const?: unknown;
  
  // Number validation
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number | boolean;
  exclusiveMaximum?: number | boolean;
  multipleOf?: number;
  
  // String validation
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  
  // Array validation
  items?: JsonSchema | JsonSchema[];
  additionalItems?: boolean | JsonSchema;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  contains?: JsonSchema;
  prefixItems?: JsonSchema[];
  
  // Object validation
  properties?: Record<string, JsonSchema>;
  patternProperties?: Record<string, JsonSchema>;
  additionalProperties?: boolean | JsonSchema;
  required?: string[];
  minProperties?: number;
  maxProperties?: number;
  propertyNames?: JsonSchema;
  dependentRequired?: Record<string, string[]>;
  dependentSchemas?: Record<string, JsonSchema>;
  
  // Combinators
  allOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  not?: JsonSchema;
  if?: JsonSchema;
  then?: JsonSchema;
  else?: JsonSchema;
  
  // Annotations
  title?: string;
  description?: string;
  default?: unknown;
  examples?: unknown[];
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
}
