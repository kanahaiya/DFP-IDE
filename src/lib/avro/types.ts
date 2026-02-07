/**
 * JSON to Avro Converter Types
 * Type definitions for Apache Avro schema generation and encoding
 */

export type AvroPrimitiveType = 
  | 'null'
  | 'boolean'
  | 'int'
  | 'long'
  | 'float'
  | 'double'
  | 'bytes'
  | 'string';

export type AvroComplexType = 'record' | 'enum' | 'array' | 'map' | 'union' | 'fixed';

export type AvroLogicalType = 
  | 'date'
  | 'time-millis'
  | 'time-micros'
  | 'timestamp-millis'
  | 'timestamp-micros'
  | 'duration'
  | 'decimal'
  | 'uuid';

export interface AvroField {
  name: string;
  type: AvroType;
  default?: unknown;
  doc?: string;
  order?: 'ascending' | 'descending' | 'ignore';
  aliases?: string[];
}

export interface AvroRecordSchema {
  type: 'record';
  name: string;
  namespace?: string;
  doc?: string;
  aliases?: string[];
  fields: AvroField[];
}

export interface AvroEnumSchema {
  type: 'enum';
  name: string;
  namespace?: string;
  doc?: string;
  aliases?: string[];
  symbols: string[];
  default?: string;
}

export interface AvroArraySchema {
  type: 'array';
  items: AvroType | string; // string for record name references
}

export interface AvroMapSchema {
  type: 'map';
  values: AvroType;
}

export interface AvroFixedSchema {
  type: 'fixed';
  name: string;
  namespace?: string;
  aliases?: string[];
  size: number;
}

export interface AvroLogicalTypeSchema {
  type: AvroPrimitiveType;
  logicalType: AvroLogicalType;
  precision?: number;
  scale?: number;
}

export type AvroType = 
  | AvroPrimitiveType
  | AvroRecordSchema
  | AvroEnumSchema
  | AvroArraySchema
  | AvroMapSchema
  | AvroFixedSchema
  | AvroLogicalTypeSchema
  | AvroType[];

export interface AvroGeneratorSettings {
  namespace: string;
  rootRecordName: string;
  useSnakeCase: boolean;
  generateDoc: boolean;
  inferLogicalTypes: boolean;
  useUnionForNullable: boolean;
  includeDefaults: boolean;
  indentation: number;
}

export const DEFAULT_AVRO_SETTINGS: AvroGeneratorSettings = {
  namespace: 'com.example',
  rootRecordName: 'Record',
  useSnakeCase: true,
  generateDoc: false,
  inferLogicalTypes: true,
  useUnionForNullable: true,
  includeDefaults: true,
  indentation: 2,
};

export interface AvroGenerationResult {
  success: boolean;
  schema: string;
  parsedSchema: AvroRecordSchema | null;
  errors: string[];
  warnings: string[];
}

export interface AvroPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<AvroGeneratorSettings>;
}
