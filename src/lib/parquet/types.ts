/**
 * JSON to Parquet Converter Types
 * Type definitions for Apache Parquet schema generation
 */

export type ParquetPrimitiveType =
  | 'BOOLEAN'
  | 'INT32'
  | 'INT64'
  | 'INT96'
  | 'FLOAT'
  | 'DOUBLE'
  | 'BYTE_ARRAY'
  | 'FIXED_LEN_BYTE_ARRAY';

export type ParquetLogicalType =
  | 'STRING'
  | 'UUID'
  | 'DATE'
  | 'TIME'
  | 'TIMESTAMP'
  | 'INTEGER'
  | 'DECIMAL'
  | 'JSON'
  | 'BSON'
  | 'ENUM'
  | 'LIST'
  | 'MAP';

export type ParquetRepetition = 'REQUIRED' | 'OPTIONAL' | 'REPEATED';

export type ParquetCompression = 
  | 'UNCOMPRESSED'
  | 'SNAPPY'
  | 'GZIP'
  | 'LZ4'
  | 'ZSTD';

export interface ParquetField {
  name: string;
  type: ParquetPrimitiveType;
  logicalType?: ParquetLogicalType;
  repetition: ParquetRepetition;
  precision?: number;
  scale?: number;
  length?: number;
  children?: ParquetField[];
}

export interface ParquetSchema {
  name: string;
  fields: ParquetField[];
}

export interface ParquetGeneratorSettings {
  rootName: string;
  compression: ParquetCompression;
  rowGroupSize: number;
  useSnakeCase: boolean;
  inferLogicalTypes: boolean;
  useOptionalForNullable: boolean;
  useDictionaryEncoding: boolean;
  pageSize: number;
}

export const DEFAULT_PARQUET_SETTINGS: ParquetGeneratorSettings = {
  rootName: 'root',
  compression: 'SNAPPY',
  rowGroupSize: 1000000,
  useSnakeCase: true,
  inferLogicalTypes: true,
  useOptionalForNullable: true,
  useDictionaryEncoding: true,
  pageSize: 1048576,
};

export interface ParquetGenerationResult {
  success: boolean;
  schemaText: string;
  schema: ParquetSchema | null;
  stats: ParquetStats | null;
  errors: string[];
  warnings: string[];
}

export interface ParquetStats {
  rowCount: number;
  columnCount: number;
  estimatedSize: string;
  compression: ParquetCompression;
}

export interface ParquetPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<ParquetGeneratorSettings>;
}
