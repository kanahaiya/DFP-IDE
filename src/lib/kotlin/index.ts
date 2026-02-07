/**
 * JSON to Kotlin Library
 */

export { convertJSONToKotlin } from './generator';
export {
  DEFAULT_KOTLIN_SETTINGS,
  type KotlinGeneratorSettings,
  type KotlinGenerationResult,
  type KotlinClassDefinition,
  type KotlinProperty,
  type KotlinSerializationLibrary,
} from './types';
export {
  KOTLIN_PRESETS,
  getPresetById,
  applyPreset,
  type KotlinPreset,
} from './presets';
