/**
 * Type definitions for JSON to Python converter
 */

import type { NamingConvention } from '../code-gen/types';

export type PythonOutputFormat = 'dict' | 'dataclass' | 'pydantic' | 'typeddict' | 'attrs' | 'namedtuple';
export type QuoteStyle = 'single' | 'double';

export interface PythonGeneratorSettings {
  // Output format
  outputFormat: PythonOutputFormat;
  
  // Naming
  variableName: string;
  className: string;
  propertyNaming: NamingConvention;
  convertToSnakeCase: boolean;
  
  // Type hints
  includeTypeHints: boolean;
  useOptionalForNullable: boolean;
  useUnionSyntax: boolean; // Python 3.10+ `str | None` vs `Optional[str]`
  
  // Imports
  includeImports: boolean;
  includeFromFuture: boolean; // `from __future__ import annotations`
  
  // Formatting
  quoteStyle: QuoteStyle;
  indentSize: number;
  
  // Dataclass options
  dataclassFrozen: boolean;
  dataclassSlots: boolean; // Python 3.10+
  dataclassKwOnly: boolean; // Python 3.10+
  
  // Pydantic options
  pydanticVersion: 'v1' | 'v2';
  pydanticStrict: boolean;
  pydanticValidateDefault: boolean;
  
  // Advanced
  detectDatetime: boolean;
  detectUuid: boolean;
  detectEmail: boolean;
  detectUrl: boolean;
}

export interface PythonGenerationResult {
  success: boolean;
  code?: string;
  classCount?: number;
  errors?: Array<{
    line?: number;
    column?: number;
    message: string;
  }>;
}

export interface PythonPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<PythonGeneratorSettings>;
}

export const DEFAULT_PYTHON_SETTINGS: PythonGeneratorSettings = {
  outputFormat: 'dataclass',
  variableName: 'data',
  className: 'MyModel',
  propertyNaming: 'snake_case',
  convertToSnakeCase: true,
  includeTypeHints: true,
  useOptionalForNullable: true,
  useUnionSyntax: false,
  includeImports: true,
  includeFromFuture: false,
  quoteStyle: 'double',
  indentSize: 4,
  dataclassFrozen: false,
  dataclassSlots: false,
  dataclassKwOnly: false,
  pydanticVersion: 'v2',
  pydanticStrict: false,
  pydanticValidateDefault: false,
  detectDatetime: true,
  detectUuid: true,
  detectEmail: false,
  detectUrl: false,
};
