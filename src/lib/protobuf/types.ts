/**
 * JSON to Protobuf Converter Types
 * Type definitions for Protocol Buffer schema generation
 */

export type ProtoSyntax = 'proto2' | 'proto3';

export type ProtoFieldType =
  | 'double'
  | 'float'
  | 'int32'
  | 'int64'
  | 'uint32'
  | 'uint64'
  | 'sint32'
  | 'sint64'
  | 'fixed32'
  | 'fixed64'
  | 'sfixed32'
  | 'sfixed64'
  | 'bool'
  | 'string'
  | 'bytes';

export interface ProtoField {
  name: string;
  type: ProtoFieldType | string; // string for message types
  number: number;
  repeated: boolean;
  optional: boolean;
  comment?: string;
  jsonName?: string;
}

export interface ProtoMessage {
  name: string;
  fields: ProtoField[];
  nestedMessages: ProtoMessage[];
  nestedEnums: ProtoEnum[];
  comment?: string;
}

export interface ProtoEnumValue {
  name: string;
  number: number;
}

export interface ProtoEnum {
  name: string;
  values: ProtoEnumValue[];
}

export interface ProtoFile {
  syntax: ProtoSyntax;
  package?: string;
  imports: string[];
  options: Record<string, string>;
  messages: ProtoMessage[];
  enums: ProtoEnum[];
}

export interface ProtobufGeneratorSettings {
  syntax: ProtoSyntax;
  packageName: string;
  rootMessageName: string;
  useSnakeCase: boolean;
  inferInt64ForLargeNumbers: boolean;
  generateComments: boolean;
  includeJsonName: boolean;
  useOptionalForNullable: boolean;
  indentation: number;
  sortFields: boolean;
}

export const DEFAULT_PROTOBUF_SETTINGS: ProtobufGeneratorSettings = {
  syntax: 'proto3',
  packageName: '',
  rootMessageName: 'Root',
  useSnakeCase: true,
  inferInt64ForLargeNumbers: true,
  generateComments: false,
  includeJsonName: false,
  useOptionalForNullable: true,
  indentation: 2,
  sortFields: false,
};

export interface ProtobufGenerationResult {
  success: boolean;
  output: string;
  messages: ProtoMessage[];
  errors: string[];
  warnings: string[];
}

export interface ProtobufPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<ProtobufGeneratorSettings>;
}
