/**
 * JSON Validator Types
 * Type definitions for JSON syntax validation
 */

export type JsonStandard = 'RFC8259' | 'RFC7159' | 'ECMA404';

export type ErrorSeverity = 'error' | 'warning' | 'info';

export type ErrorType = 
  | 'syntax'
  | 'structure'
  | 'trailing_comma'
  | 'single_quote'
  | 'unquoted_key'
  | 'comment'
  | 'invalid_escape'
  | 'duplicate_key'
  | 'invalid_number'
  | 'invalid_unicode';

export interface ValidationError {
  line: number;
  column: number;
  position: number;
  message: string;
  type: ErrorType;
  severity: ErrorSeverity;
  suggestion?: string;
  fixable?: boolean;
}

export interface JsonStats {
  totalKeys: number;
  totalValues: number;
  depth: number;
  objectCount: number;
  arrayCount: number;
  stringCount: number;
  numberCount: number;
  booleanCount: number;
  nullCount: number;
  size: number;
  sizeFormatted: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  stats: JsonStats | null;
  validationTime: number;
  standard: JsonStandard;
}

export interface AutoFixResult {
  fixed: string;
  changes: AutoFixChange[];
  success: boolean;
  remainingErrors: number;
}

export interface AutoFixChange {
  line: number;
  column: number;
  type: string;
  description: string;
  before: string;
  after: string;
}

export interface ValidatorSettings {
  standard: JsonStandard;
  strictMode: boolean;
  allowComments: boolean;
  allowTrailingCommas: boolean;
  allowSingleQuotes: boolean;
  allowUnquotedKeys: boolean;
  detectDuplicateKeys: boolean;
  showStatistics: boolean;
  autoValidate: boolean;
  indentation: number | 'tab';
}

export const DEFAULT_VALIDATOR_SETTINGS: ValidatorSettings = {
  standard: 'RFC8259',
  strictMode: true,
  allowComments: false,
  allowTrailingCommas: false,
  allowSingleQuotes: false,
  allowUnquotedKeys: false,
  detectDuplicateKeys: true,
  showStatistics: true,
  autoValidate: true,
  indentation: 2,
};

export interface ValidatorPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<ValidatorSettings>;
}
