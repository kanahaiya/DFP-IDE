/**
 * JSON to Parquet Library
 * Public API exports
 */

export * from './types';
export { jsonToParquetSchema, validateParquetSchema } from './schemaInference';
export { PARQUET_PRESETS, applyParquetPreset, getParquetPresetById, getDefaultParquetSettings } from './presets';
