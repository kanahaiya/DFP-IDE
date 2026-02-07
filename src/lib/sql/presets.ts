/**
 * Preset configurations for JSON to SQL converter
 */

import type { SqlPreset } from './types';

export const SQL_PRESETS: SqlPreset[] = [
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'PostgreSQL CREATE TABLE statement',
    settings: {
      dialect: 'postgresql',
      outputMode: 'create-table',
      primaryKeyType: 'SERIAL',
      useUppercaseKeywords: true,
    },
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'MySQL CREATE TABLE statement',
    settings: {
      dialect: 'mysql',
      outputMode: 'create-table',
      primaryKeyType: 'INT AUTO_INCREMENT',
      useUppercaseKeywords: true,
    },
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    description: 'SQLite CREATE TABLE statement',
    settings: {
      dialect: 'sqlite',
      outputMode: 'create-table',
      primaryKeyType: 'INTEGER PRIMARY KEY',
      useUppercaseKeywords: true,
    },
  },
  {
    id: 'insert-only',
    name: 'INSERT Statements',
    description: 'Generate INSERT statements only',
    settings: {
      outputMode: 'insert',
      batchInserts: false,
    },
  },
  {
    id: 'batch-insert',
    name: 'Batch INSERT',
    description: 'Batch INSERT statements for multiple rows',
    settings: {
      outputMode: 'insert',
      batchInserts: true,
      batchSize: 100,
    },
  },
  {
    id: 'full-schema',
    name: 'Full Schema',
    description: 'CREATE TABLE + INSERT with timestamps',
    settings: {
      outputMode: 'both',
      addPrimaryKey: true,
      addTimestamps: true,
    },
  },
];
