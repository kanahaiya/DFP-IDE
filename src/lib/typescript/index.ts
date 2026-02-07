/**
 * JSON to TypeScript Library
 */

export { convertJSONToTypeScript } from './generator';
export {
  DEFAULT_TYPESCRIPT_SETTINGS,
  type TypeScriptGeneratorSettings,
  type TypeScriptGenerationResult,
  type TypeScriptTypeDefinition,
  type TypeScriptProperty,
  type ArrayNotation,
  type TypeScriptOutputFormat,
  type NullHandling,
} from './types';
export {
  TYPESCRIPT_PRESETS,
  getPresetById,
  applyPreset,
  type TypeScriptPreset,
} from './presets';
