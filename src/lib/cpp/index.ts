export { convertJSONToCpp, DEFAULT_SETTINGS } from './generator';
export { CPP_PRESETS, applyPreset, getPresetById } from './presets';
export type {
  CppGeneratorSettings,
  CppLibrary,
  CppStandard,
  CppOutputMode,
  CppFieldInfo,
  CppClassInfo,
  CppConversionResult,
} from './types';
