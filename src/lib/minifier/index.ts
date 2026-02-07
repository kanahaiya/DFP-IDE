/**
 * JSON Minifier library public API
 */

// Types
export type {
  MinifierMode,
  IndentationType,
  MinifierSettings,
  ValidationError,
  ValidationResult,
  SizeMetrics,
  CompressionStats,
  MinifyResult,
  MinifierPreset,
  JsonValue,
  JsonObject,
  JsonArray,
  JsonPrimitive,
} from './types';

// Constants
export {
  DEFAULT_MINIFIER_SETTINGS,
  MINIFIER_PRESETS,
  isPlainObject,
  isArray,
  isPrimitive,
} from './types';

// Minifier functions
export {
  minifyJSON,
  beautifyJSON,
  processJSON,
  quickMinify,
  quickBeautify,
  estimateCompression,
} from './minifier';

// Validator functions
export {
  validateJSON,
  isLikelyJSON,
  getLineCount,
  getCharacterCount,
  getByteSize,
  formatBytes,
  tryAutoFix,
} from './validator';

// Preset functions
export {
  getAllPresets,
  getPresetById,
  applyPreset,
  getDefaultSettings,
  createCustomPreset,
  suggestPreset,
  getPresetsByMode,
  validatePresetSettings,
} from './presets';
