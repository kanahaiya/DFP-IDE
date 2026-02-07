/**
 * Type definitions for JSON to SQL converter
 */

export type SqlDialect = 'mysql' | 'postgresql' | 'sqlite' | 'sqlserver' | 'oracle';
export type OutputMode = 'create-table' | 'insert' | 'both';

export interface SqlGeneratorSettings {
  // Naming
  tableName: string;
  columnNaming: 'snake_case' | 'camelCase' | 'original';
  
  // SQL dialect
  dialect: SqlDialect;
  outputMode: OutputMode;
  
  // Table options
  addPrimaryKey: boolean;
  primaryKeyName: string;
  primaryKeyType: 'INT AUTO_INCREMENT' | 'SERIAL' | 'UUID' | 'INTEGER PRIMARY KEY';
  addTimestamps: boolean;
  
  // Type options
  useNullable: boolean;
  inferTypes: boolean;
  defaultStringLength: number;
  
  // Insert options
  batchInserts: boolean;
  batchSize: number;
  
  // Formatting
  useUppercaseKeywords: boolean;
  indentSize: number;
}

export interface SqlGenerationResult {
  success: boolean;
  code?: string;
  tableCount?: number;
  rowCount?: number;
  errors?: Array<{
    line?: number;
    column?: number;
    message: string;
  }>;
}

export interface SqlPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<SqlGeneratorSettings>;
}

export const DEFAULT_SQL_SETTINGS: SqlGeneratorSettings = {
  tableName: 'my_table',
  columnNaming: 'snake_case',
  dialect: 'postgresql',
  outputMode: 'create-table',
  addPrimaryKey: true,
  primaryKeyName: 'id',
  primaryKeyType: 'SERIAL',
  addTimestamps: false,
  useNullable: true,
  inferTypes: true,
  defaultStringLength: 255,
  batchInserts: false,
  batchSize: 100,
  useUppercaseKeywords: true,
  indentSize: 2,
};
