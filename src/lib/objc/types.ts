/**
 * Type definitions for JSON to Objective-C converter
 */

import type { NamingConvention, CaseConvention } from '../code-gen/types';

export type OutputFormat = 'header-implementation' | 'header-only' | 'implementation-only';
export type MemoryManagement = 'arc' | 'mrc';

export interface ObjCGeneratorSettings {
  // Naming
  rootClassName: string;
  classPrefix: string;
  propertyNaming: NamingConvention;
  classNaming: CaseConvention;
  
  // Output format
  outputFormat: OutputFormat;
  memoryManagement: MemoryManagement;
  
  // Property attributes
  useAtomicProperties: boolean;
  useReadonlyProperties: boolean;
  useStrongReferences: boolean;
  
  // Protocol conformance
  conformToNSCoding: boolean;
  conformToNSCopying: boolean;
  conformToNSSecureCoding: boolean;
  
  // Methods
  generateInitWithDictionary: boolean;
  generateToDictionary: boolean;
  generateDescription: boolean;
  
  // Nullability
  useNullabilityAnnotations: boolean;
  useNonnullByDefault: boolean;
  
  // Formatting
  indentSize: number;
  useSpaces: boolean;
}

export interface ObjCGenerationResult {
  success: boolean;
  code?: string;
  headerCode?: string;
  implementationCode?: string;
  classCount?: number;
  errors?: Array<{
    line?: number;
    column?: number;
    message: string;
  }>;
}

export interface ObjCPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<ObjCGeneratorSettings>;
}

export const DEFAULT_OBJC_SETTINGS: ObjCGeneratorSettings = {
  rootClassName: 'Root',
  classPrefix: '',
  propertyNaming: 'camelCase',
  classNaming: 'PascalCase',
  outputFormat: 'header-implementation',
  memoryManagement: 'arc',
  useAtomicProperties: false,
  useReadonlyProperties: false,
  useStrongReferences: true,
  conformToNSCoding: false,
  conformToNSCopying: false,
  conformToNSSecureCoding: false,
  generateInitWithDictionary: true,
  generateToDictionary: true,
  generateDescription: false,
  useNullabilityAnnotations: true,
  useNonnullByDefault: false,
  indentSize: 4,
  useSpaces: true,
};
