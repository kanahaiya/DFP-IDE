/**
 * JSON Schema Validator Library
 * Public API exports
 */

export * from './types';
export { validateJSONSchema, validateSchema } from './validator';
export { EXAMPLE_SCHEMAS, getSchemaById } from './schemas';
export { SCHEMA_VALIDATOR_PRESETS, applySchemaPreset, getSchemaPresetById } from './presets';
