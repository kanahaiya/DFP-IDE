import type { BaseGeneratorSettings, InferredType, FieldInfo, GeneratedClass, ConversionResult, ValidationError } from '@/lib/code-gen/types';

export type CppLibrary = 'nlohmann' | 'rapidjson' | 'jsoncpp' | 'boost' | 'none';
export type CppStandard = 'cpp11' | 'cpp14' | 'cpp17' | 'cpp20';
export type CppOutputMode = 'struct' | 'class' | 'header-only' | 'header-source';

export interface CppGeneratorSettings extends BaseGeneratorSettings {
  library: CppLibrary;
  cppStandard: CppStandard;
  outputMode: CppOutputMode;
  includeNullable: boolean;
  useOptional: boolean;
  generateConstructors: boolean;
  generateGettersSetters: boolean;
  useSmartPointers: boolean;
  addSerializationMacros: boolean;
  includeValidation: boolean;
  useStringView: boolean;
  generateComments: boolean;
  namespacePrefix: string;
  headerGuardStyle: 'pragma' | 'ifndef';
  indentStyle: 'spaces' | 'tabs';
  indentSize: number;
}

export interface CppFieldInfo extends FieldInfo {
  cppType: string;
  originalName: string;
  isOptional: boolean;
  defaultValue?: string;
}

export interface CppClassInfo extends GeneratedClass {
  fields: CppFieldInfo[];
  headerCode: string;
  sourceCode?: string;
}

export interface CppConversionResult extends ConversionResult {
  classes: CppClassInfo[];
  headerContent: string;
  sourceContent?: string;
}

export { type InferredType, type FieldInfo, type GeneratedClass, type ConversionResult, type ValidationError };
