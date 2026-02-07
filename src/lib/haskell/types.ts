import type { BaseGeneratorSettings, InferredType, FieldInfo, GeneratedClass, ConversionResult, ValidationError } from '@/lib/code-gen/types';

export type HaskellOutputMode = 'records' | 'newtypes' | 'both';
export type HaskellAesonStyle = 'generic' | 'template-haskell' | 'manual';
export type HaskellNamingConvention = 'camelCase' | 'PascalCase' | 'snake_case';

export interface HaskellGeneratorSettings extends BaseGeneratorSettings {
  outputMode: HaskellOutputMode;
  aesonStyle: HaskellAesonStyle;
  namingConvention: HaskellNamingConvention;
  deriveGeneric: boolean;
  deriveShow: boolean;
  deriveEq: boolean;
  generateToJSON: boolean;
  generateFromJSON: boolean;
  useStrictFields: boolean;
  addDocComments: boolean;
  modulePrefix: string;
  fieldLabelModifier: boolean;
}

export interface HaskellFieldInfo extends FieldInfo {
  haskellType: string;
  originalKey: string;
  recordField: string;
}

export interface HaskellTypeInfo extends GeneratedClass {
  fields: HaskellFieldInfo[];
  dataDecl: string;
  aesonInstance: string;
}

export interface HaskellConversionResult extends ConversionResult {
  types: HaskellTypeInfo[];
  moduleCode: string;
}

export { type InferredType, type FieldInfo, type GeneratedClass, type ConversionResult, type ValidationError };
