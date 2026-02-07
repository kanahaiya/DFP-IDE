/**
 * Type definitions for JSON to C# converter
 */

import type { NamingConvention, CaseConvention } from '../code-gen/types';

export type SerializerLibrary = 'none' | 'newtonsoft' | 'system.text.json';
export type NullableStyle = 'nullable-reference' | 'nullable-value' | 'none';

export interface CSharpGeneratorSettings {
  // Naming
  rootClassName: string;
  namespace: string;
  propertyNaming: NamingConvention;
  classNaming: CaseConvention;
  
  // Serialization
  serializerLibrary: SerializerLibrary;
  addJsonPropertyAttributes: boolean;
  preserveOriginalNames: boolean;
  
  // Type options
  useNullableTypes: boolean;
  nullableStyle: NullableStyle;
  useRecords: boolean; // C# 9+ records
  useInitOnlySetters: boolean;
  useRequiredModifier: boolean; // C# 11+
  
  // Structure
  usePrimaryConstructor: boolean; // C# 12+
  generatePartialClasses: boolean;
  sealClasses: boolean;
  
  // Collection types
  useImmutableCollections: boolean;
  arrayAsIList: boolean;
  
  // Formatting
  indentSize: number;
  useSpaces: boolean;
  fileScopedNamespace: boolean; // C# 10+
}

export interface CSharpGenerationResult {
  success: boolean;
  code?: string;
  classCount?: number;
  errors?: Array<{
    line?: number;
    column?: number;
    message: string;
  }>;
}

export interface CSharpPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<CSharpGeneratorSettings>;
}

export const DEFAULT_CSHARP_SETTINGS: CSharpGeneratorSettings = {
  rootClassName: 'Root',
  namespace: 'MyNamespace',
  propertyNaming: 'PascalCase',
  classNaming: 'PascalCase',
  serializerLibrary: 'newtonsoft',
  addJsonPropertyAttributes: true,
  preserveOriginalNames: true,
  useNullableTypes: true,
  nullableStyle: 'nullable-reference',
  useRecords: false,
  useInitOnlySetters: false,
  useRequiredModifier: false,
  usePrimaryConstructor: false,
  generatePartialClasses: false,
  sealClasses: false,
  useImmutableCollections: false,
  arrayAsIList: false,
  indentSize: 4,
  useSpaces: true,
  fileScopedNamespace: true,
};
