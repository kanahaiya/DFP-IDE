/**
 * Types for JSON to Swift converter
 */

import type { BaseGeneratorSettings, ValidationError } from '../code-gen/types';

/**
 * Swift output type
 */
export type SwiftOutputType = 'struct' | 'class' | 'finalClass';

/**
 * Swift access modifier
 */
export type SwiftAccessModifier = 'public' | 'internal' | 'private' | 'fileprivate';

/**
 * Codable protocol option
 */
export type CodableOption = 'codable' | 'decodable' | 'encodable' | 'none';

/**
 * Swift-specific generator settings
 */
export interface SwiftGeneratorSettings extends BaseGeneratorSettings {
  // Naming
  rootClassName: string;
  
  // Type options
  outputType: SwiftOutputType;
  accessModifier: SwiftAccessModifier;
  
  // Codable
  codableOption: CodableOption;
  generateCodingKeys: boolean;
  
  // Properties
  useVar: boolean; // var vs let
  markOptional: boolean; // Type? for nullable
  
  // SwiftUI
  addPublished: boolean; // @Published for ObservableObject
  
  // Code generation
  generateInit: boolean;
  addComments: boolean;
  
  // Formatting
  indentation: number | 'tab';
}

/**
 * Default settings
 */
export const DEFAULT_SWIFT_SETTINGS: SwiftGeneratorSettings = {
  rootClassName: 'Root',
  indentation: 4,
  useNullableTypes: true,
  
  // Type options
  outputType: 'struct',
  accessModifier: 'internal',
  
  // Codable
  codableOption: 'codable',
  generateCodingKeys: true,
  
  // Properties
  useVar: false, // Use let by default
  markOptional: true,
  
  // SwiftUI
  addPublished: false,
  
  // Code generation
  generateInit: false,
  addComments: false,
};

/**
 * Swift conversion result
 */
export interface SwiftConversionResult {
  success: boolean;
  code?: string;
  errors?: ValidationError[];
  typeCount?: number;
}

/**
 * Swift preset
 */
export interface SwiftPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<SwiftGeneratorSettings>;
}
