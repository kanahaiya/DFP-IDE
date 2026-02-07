/**
 * Kotlin Generator Types
 */

import type { NamingConvention, CaseConvention } from '../code-gen/types';

/**
 * Serialization library
 */
export type KotlinSerializationLibrary = 'none' | 'kotlinx' | 'gson' | 'moshi' | 'jackson';

/**
 * Kotlin generator settings
 */
export interface KotlinGeneratorSettings {
  // Naming
  rootClassName: string;
  classNaming: CaseConvention;
  propertyNaming: NamingConvention;
  
  // Serialization
  serializationLibrary: KotlinSerializationLibrary;
  addSerialNames: boolean;
  
  // Data class options
  useDataClass: boolean;
  generateCompanionObject: boolean;
  addDefaultValues: boolean;
  makePropertiesNullable: boolean;
  useValProperties: boolean;
  
  // Advanced
  addKDoc: boolean;
  generateParcelize: boolean;
  packageName: string;
  addImports: boolean;
  
  // Formatting
  indentSize: number;
  useSpaces: boolean;
}

/**
 * Default settings
 */
export const DEFAULT_KOTLIN_SETTINGS: KotlinGeneratorSettings = {
  rootClassName: 'Root',
  classNaming: 'PascalCase',
  propertyNaming: 'camelCase',
  
  serializationLibrary: 'none',
  addSerialNames: true,
  
  useDataClass: true,
  generateCompanionObject: false,
  addDefaultValues: false,
  makePropertiesNullable: false,
  useValProperties: true,
  
  addKDoc: false,
  generateParcelize: false,
  packageName: '',
  addImports: true,
  
  indentSize: 4,
  useSpaces: true,
};

/**
 * Property definition for Kotlin
 */
export interface KotlinProperty {
  name: string;
  originalName: string;
  type: string;
  isNullable: boolean;
  defaultValue?: string;
  serialName?: string;
}

/**
 * Class definition
 */
export interface KotlinClassDefinition {
  name: string;
  properties: KotlinProperty[];
  isDataClass: boolean;
  kDoc?: string;
}

/**
 * Generation result
 */
export interface KotlinGenerationResult {
  success: boolean;
  code?: string;
  classes?: KotlinClassDefinition[];
  classCount?: number;
  errors?: { message: string; type: string }[];
}
