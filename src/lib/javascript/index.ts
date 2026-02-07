/**
 * JSON to JavaScript Library
 */

export { convertJSONToJavaScript } from './generator';
export {
  DEFAULT_JAVASCRIPT_SETTINGS,
  type JavaScriptGeneratorSettings,
  type JavaScriptGenerationResult,
  type VariableDeclaration,
  type ExportFormat,
  type QuoteStyle,
} from './types';
export {
  JAVASCRIPT_PRESETS,
  getPresetById,
  applyPreset,
  type JavaScriptPreset,
} from './presets';
