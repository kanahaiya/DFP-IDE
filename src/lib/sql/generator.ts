/**
 * JSON to SQL code generator
 */

import type { SqlGeneratorSettings, SqlGenerationResult } from './types';
import { DEFAULT_SQL_SETTINGS } from './types';

interface ColumnDefinition {
  name: string;
  originalName: string;
  type: string;
  isNullable: boolean;
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/-/g, '_');
}

function convertColumnName(name: string, settings: SqlGeneratorSettings): string {
  switch (settings.columnNaming) {
    case 'camelCase':
      return name.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    case 'snake_case':
      return toSnakeCase(name);
    case 'original':
    default:
      return name;
  }
}

function inferSqlType(value: unknown, settings: SqlGeneratorSettings): string {
  const { dialect } = settings;
  
  if (value === null) {
    return dialect === 'postgresql' ? 'TEXT' : 'VARCHAR(255)';
  }
  
  if (typeof value === 'string') {
    // Try to detect specific types
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return 'DATE';
    }
    if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/.test(value)) {
      return dialect === 'postgresql' ? 'TIMESTAMP' : 'DATETIME';
    }
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
      return dialect === 'postgresql' ? 'UUID' : `VARCHAR(36)`;
    }
    
    const len = Math.max(value.length, settings.defaultStringLength);
    if (len > 65535) {
      return dialect === 'postgresql' ? 'TEXT' : 'LONGTEXT';
    }
    if (len > 255) {
      return 'TEXT';
    }
    return `VARCHAR(${settings.defaultStringLength})`;
  }
  
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      if (value > 2147483647 || value < -2147483648) {
        return 'BIGINT';
      }
      return dialect === 'postgresql' ? 'INTEGER' : 'INT';
    }
    return dialect === 'postgresql' ? 'DOUBLE PRECISION' : 'DOUBLE';
  }
  
  if (typeof value === 'boolean') {
    return dialect === 'mysql' ? 'TINYINT(1)' : 'BOOLEAN';
  }
  
  if (Array.isArray(value)) {
    return dialect === 'postgresql' ? 'JSONB' : 'JSON';
  }
  
  if (typeof value === 'object') {
    return dialect === 'postgresql' ? 'JSONB' : 'JSON';
  }
  
  return 'TEXT';
}

function analyzeColumns(
  obj: Record<string, unknown>,
  settings: SqlGeneratorSettings
): ColumnDefinition[] {
  const columns: ColumnDefinition[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const columnName = convertColumnName(key, settings);
    const type = settings.inferTypes ? inferSqlType(value, settings) : 'TEXT';
    
    columns.push({
      name: columnName,
      originalName: key,
      type,
      isNullable: value === null || settings.useNullable,
    });
  }
  
  return columns;
}

function keyword(word: string, settings: SqlGeneratorSettings): string {
  return settings.useUppercaseKeywords ? word.toUpperCase() : word.toLowerCase();
}

function generateCreateTable(
  tableName: string,
  columns: ColumnDefinition[],
  settings: SqlGeneratorSettings
): string {
  const indent = ' '.repeat(settings.indentSize);
  const lines: string[] = [];
  
  lines.push(`${keyword('CREATE TABLE', settings)} ${tableName} (`);
  
  const columnDefs: string[] = [];
  
  // Primary key
  if (settings.addPrimaryKey) {
    let pkType = settings.primaryKeyType;
    if (settings.dialect === 'postgresql' && pkType === 'INT AUTO_INCREMENT') {
      pkType = 'SERIAL';
    } else if (settings.dialect === 'mysql' && pkType === 'SERIAL') {
      pkType = 'INT AUTO_INCREMENT';
    } else if (settings.dialect === 'sqlite') {
      pkType = 'INTEGER PRIMARY KEY';
    }
    
    if (settings.dialect === 'postgresql' && pkType === 'SERIAL') {
      columnDefs.push(`${indent}${settings.primaryKeyName} ${pkType} ${keyword('PRIMARY KEY', settings)}`);
    } else if (settings.dialect === 'sqlite') {
      columnDefs.push(`${indent}${settings.primaryKeyName} ${pkType}`);
    } else {
      columnDefs.push(`${indent}${settings.primaryKeyName} ${pkType} ${keyword('PRIMARY KEY', settings)}`);
    }
  }
  
  // Data columns
  for (const col of columns) {
    const nullStr = col.isNullable ? '' : ` ${keyword('NOT NULL', settings)}`;
    columnDefs.push(`${indent}${col.name} ${col.type}${nullStr}`);
  }
  
  // Timestamps
  if (settings.addTimestamps) {
    const timestampType = settings.dialect === 'postgresql' ? 'TIMESTAMP' : 'DATETIME';
    const defaultNow = settings.dialect === 'postgresql' ? 'NOW()' : 'CURRENT_TIMESTAMP';
    columnDefs.push(`${indent}created_at ${timestampType} ${keyword('DEFAULT', settings)} ${defaultNow}`);
    columnDefs.push(`${indent}updated_at ${timestampType} ${keyword('DEFAULT', settings)} ${defaultNow}`);
  }
  
  lines.push(columnDefs.join(',\n'));
  lines.push(');');
  
  return lines.join('\n');
}

function escapeValue(value: unknown, settings: SqlGeneratorSettings): string {
  if (value === null) {
    return 'NULL';
  }
  
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  }
  
  if (typeof value === 'number') {
    return value.toString();
  }
  
  if (typeof value === 'boolean') {
    if (settings.dialect === 'mysql') {
      return value ? '1' : '0';
    }
    return value.toString().toUpperCase();
  }
  
  if (typeof value === 'object') {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }
  
  return 'NULL';
}

function generateInsertStatements(
  tableName: string,
  columns: ColumnDefinition[],
  data: Record<string, unknown>[],
  settings: SqlGeneratorSettings
): string {
  const lines: string[] = [];
  const columnNames = columns.map(c => c.name).join(', ');
  
  if (settings.batchInserts && data.length > 1) {
    // Batch insert
    for (let i = 0; i < data.length; i += settings.batchSize) {
      const batch = data.slice(i, i + settings.batchSize);
      lines.push(`${keyword('INSERT INTO', settings)} ${tableName} (${columnNames}) ${keyword('VALUES', settings)}`);
      
      const valueRows = batch.map((row, idx) => {
        const values = columns.map(col => escapeValue(row[col.originalName], settings)).join(', ');
        const isLast = idx === batch.length - 1;
        return `  (${values})${isLast ? ';' : ','}`;
      });
      
      lines.push(valueRows.join('\n'));
      lines.push('');
    }
  } else {
    // Individual inserts
    for (const row of data) {
      const values = columns.map(col => escapeValue(row[col.originalName], settings)).join(', ');
      lines.push(`${keyword('INSERT INTO', settings)} ${tableName} (${columnNames}) ${keyword('VALUES', settings)} (${values});`);
    }
  }
  
  return lines.join('\n');
}

export function convertJSONToSQL(
  jsonString: string,
  settings: Partial<SqlGeneratorSettings> = {}
): SqlGenerationResult {
  const mergedSettings: SqlGeneratorSettings = { ...DEFAULT_SQL_SETTINGS, ...settings };
  
  try {
    const parsed = JSON.parse(jsonString);
    
    let dataArray: Record<string, unknown>[];
    
    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        return {
          success: false,
          errors: [{ message: 'Array is empty' }],
        };
      }
      if (typeof parsed[0] !== 'object' || parsed[0] === null) {
        return {
          success: false,
          errors: [{ message: 'Array must contain objects' }],
        };
      }
      dataArray = parsed as Record<string, unknown>[];
    } else if (typeof parsed === 'object' && parsed !== null) {
      dataArray = [parsed as Record<string, unknown>];
    } else {
      return {
        success: false,
        errors: [{ message: 'Input must be a JSON object or array of objects' }],
      };
    }
    
    // Analyze columns from first object
    const columns = analyzeColumns(dataArray[0], mergedSettings);
    
    const codeBlocks: string[] = [];
    
    // Generate CREATE TABLE
    if (mergedSettings.outputMode === 'create-table' || mergedSettings.outputMode === 'both') {
      codeBlocks.push(generateCreateTable(mergedSettings.tableName, columns, mergedSettings));
    }
    
    // Generate INSERT statements
    if (mergedSettings.outputMode === 'insert' || mergedSettings.outputMode === 'both') {
      if (codeBlocks.length > 0) {
        codeBlocks.push('');
      }
      codeBlocks.push(generateInsertStatements(mergedSettings.tableName, columns, dataArray, mergedSettings));
    }
    
    return {
      success: true,
      code: codeBlocks.join('\n').trim(),
      tableCount: 1,
      rowCount: dataArray.length,
    };
  } catch (error) {
    return {
      success: false,
      errors: [{
        message: error instanceof Error ? error.message : 'Failed to parse JSON',
      }],
    };
  }
}
