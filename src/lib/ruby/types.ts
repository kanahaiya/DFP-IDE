import type { BaseGeneratorSettings, InferredType, FieldInfo, GeneratedClass, ConversionResult, ValidationError } from '@/lib/code-gen/types';

export type RubyHashSyntax = 'symbols' | 'strings' | 'rockets' | 'mixed';
export type RubyOutputMode = 'hash' | 'ostruct' | 'class' | 'struct' | 'data';
export type RubyStringQuote = 'single' | 'double';

export interface RubyGeneratorSettings extends BaseGeneratorSettings {
  hashSyntax: RubyHashSyntax;
  outputMode: RubyOutputMode;
  stringQuote: RubyStringQuote;
  freezeStrings: boolean;
  addTypeSig: boolean; // Sorbet/RBS type signatures
  useSymbols: boolean;
  generateAccessors: boolean;
  generateInitialize: boolean;
  generateToJson: boolean;
  generateFromJson: boolean;
  addFrozenStringLiteral: boolean;
  indentSpaces: number;
}

export interface RubyFieldInfo extends FieldInfo {
  rubyType: string;
  originalKey: string;
  symbolName: string;
}

export interface RubyClassInfo extends GeneratedClass {
  fields: RubyFieldInfo[];
  rubyCode: string;
}

export interface RubyConversionResult extends ConversionResult {
  classes: RubyClassInfo[];
  hashOutput?: string;
  classOutput?: string;
}

export { type InferredType, type FieldInfo, type GeneratedClass, type ConversionResult, type ValidationError };
