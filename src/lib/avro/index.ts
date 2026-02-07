/**
 * JSON to Avro Library
 * Public API exports
 */

export * from './types';
export { jsonToAvroSchema, validateAvroSchema } from './schemaInference';
export { AVRO_PRESETS, applyAvroPreset, getAvroPresetById, getDefaultAvroSettings } from './presets';
