/**
 * Types for JSON to Dart converter
 */

import type { BaseGeneratorSettings, ValidationError } from '../code-gen/types';

/**
 * Dart code generation style
 */
export type DartCodeStyle = 'plain' | 'freezed' | 'jsonSerializable';

/**
 * Dart-specific generator settings
 */
export interface DartGeneratorSettings extends BaseGeneratorSettings {
  // Naming
  rootClassName: string;
  
  // Code style
  codeStyle: DartCodeStyle;
  
  // Properties
  useFinal: boolean;
  useRequired: boolean;
  
  // Methods
  generateFromJson: boolean;
  generateToJson: boolean;
  generateCopyWith: boolean;
  generateToString: boolean;
  generateEquality: boolean;
  
  // Formatting
  indentation: number | 'tab';
  addComments: boolean;
}

/**
 * Default settings
 */
export const DEFAULT_DART_SETTINGS: DartGeneratorSettings = {
  rootClassName: 'Root',
  indentation: 2,
  useNullableTypes: true,
  
  // Code style
  codeStyle: 'plain',
  
  // Properties
  useFinal: true,
  useRequired: true,
  
  // Methods
  generateFromJson: true,
  generateToJson: true,
  generateCopyWith: false,
  generateToString: false,
  generateEquality: false,
  
  // Formatting
  addComments: false,
};

/**
 * Dart conversion result
 */
export interface DartConversionResult {
  success: boolean;
  code?: string;
  errors?: ValidationError[];
  classCount?: number;
}

/**
 * Dart preset
 */
export interface DartPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<DartGeneratorSettings>;
}
