import type { BaseGeneratorSettings, InferredType, FieldInfo, GeneratedClass, ConversionResult, ValidationError } from '@/lib/code-gen/types';

export type ElmOutputMode = 'types-only' | 'with-decoders' | 'with-encoders' | 'full';
export type ElmNamingStyle = 'camelCase' | 'snake_case';

export interface ElmGeneratorSettings extends BaseGeneratorSettings {
  outputMode: ElmOutputMode;
  namingStyle: ElmNamingStyle;
  generateTypeAliases: boolean;
  generateDecoders: boolean;
  generateEncoders: boolean;
  usePipeline: boolean;
  modulePrefix: string;
  exposeAll: boolean;
  addComments: boolean;
}

export interface ElmFieldInfo extends FieldInfo {
  elmType: string;
  originalKey: string;
  decoderExpr: string;
  encoderExpr: string;
}

export interface ElmTypeInfo extends GeneratedClass {
  fields: ElmFieldInfo[];
  typeAlias: string;
  decoder: string;
  encoder: string;
}

export interface ElmConversionResult extends ConversionResult {
  types: ElmTypeInfo[];
  moduleCode: string;
}

export { type InferredType, type FieldInfo, type GeneratedClass, type ConversionResult, type ValidationError };
