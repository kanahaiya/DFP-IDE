/**
 * Type definitions for JSON to Java converter
 */

import type { NamingConvention, CaseConvention } from '../code-gen/types';

export type AnnotationStyle = 'none' | 'jackson' | 'gson' | 'lombok';
export type AccessModifier = 'public' | 'private' | 'protected' | 'package';

export interface JavaGeneratorSettings {
  // Naming
  rootClassName: string;
  packageName: string;
  propertyNaming: NamingConvention;
  classNaming: CaseConvention;
  
  // Annotations
  annotationStyle: AnnotationStyle;
  useLombok: boolean;
  
  // Type options
  usePrimitives: boolean;
  useOptional: boolean;
  useCollectionInterfaces: boolean; // List vs ArrayList
  
  // Methods
  generateGetters: boolean;
  generateSetters: boolean;
  generateConstructors: boolean;
  generateAllArgsConstructor: boolean;
  generateToString: boolean;
  generateHashCodeEquals: boolean;
  generateBuilder: boolean;
  
  // Structure
  generateSeparateClasses: boolean; // vs inner classes
  accessModifier: AccessModifier;
  makeFinal: boolean;
  
  // Formatting
  indentSize: number;
  useSpaces: boolean;
}

export interface JavaGenerationResult {
  success: boolean;
  code?: string;
  classCount?: number;
  errors?: Array<{
    line?: number;
    column?: number;
    message: string;
  }>;
}

export interface JavaPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<JavaGeneratorSettings>;
}

export const DEFAULT_JAVA_SETTINGS: JavaGeneratorSettings = {
  rootClassName: 'Root',
  packageName: 'com.example.model',
  propertyNaming: 'camelCase',
  classNaming: 'PascalCase',
  annotationStyle: 'none',
  useLombok: false,
  usePrimitives: false,
  useOptional: false,
  useCollectionInterfaces: true,
  generateGetters: true,
  generateSetters: true,
  generateConstructors: true,
  generateAllArgsConstructor: false,
  generateToString: false,
  generateHashCodeEquals: false,
  generateBuilder: false,
  generateSeparateClasses: false,
  accessModifier: 'private',
  makeFinal: false,
  indentSize: 4,
  useSpaces: true,
};
