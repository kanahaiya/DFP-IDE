/**
 * JSON to Protobuf Library
 * Public API exports
 */

export * from './types';
export { jsonToProtobuf, validateProtoSchema } from './generator';
export { PROTOBUF_PRESETS, applyProtobufPreset, getProtobufPresetById, getDefaultProtobufSettings } from './presets';
