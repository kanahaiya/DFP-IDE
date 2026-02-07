/**
 * Type definitions for JSON to Crystal converter
 */

import type { NamingConvention, CaseConvention } from '../code-gen/types';

export type OutputType = 'class' | 'struct';

export interface CrystalGeneratorSettings {
  // Naming
  rootClassName: string;
  propertyNaming: NamingConvention;
  classNaming: CaseConvention;
  
  // Output type
  outputType: OutputType;
  
  // JSON.Serializable
  useJsonSerializable: boolean;
  includeJsonKey: boolean;
  
  // Type options
  useNilableTypes: boolean;
  useStrictTypes: boolean;
  
  // Methods
  generateInitializer: boolean;
  generateFromJson: boolean;
  generateToJson: boolean;
  
  // Formatting
  indentSize: number;
  useSpaces: boolean;
}

export interface CrystalGenerationResult {
  success: boolean;
  code?: string;
  classCount?: number;
  errors?: Array<{
    line?: number;
    column?: number;
    message: string;
  }>;
}

export interface CrystalPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<CrystalGeneratorSettings>;
}

export const DEFAULT_CRYSTAL_SETTINGS: CrystalGeneratorSettings = {
  rootClassName: 'Root',
  propertyNaming: 'snake_case',
  classNaming: 'PascalCase',
  outputType: 'class',
  useJsonSerializable: true,
  includeJsonKey: true,
  useNilableTypes: true,
  useStrictTypes: false,
  generateInitializer: true,
  generateFromJson: false,
  generateToJson: false,
  indentSize: 2,
  useSpaces: true,
};
