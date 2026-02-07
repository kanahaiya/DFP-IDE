/**
 * JavaScript Generator Types
 */

import type { NamingConvention } from '../code-gen/types';

/**
 * Variable declaration type
 */
export type VariableDeclaration = 'const' | 'let' | 'var' | 'none';

/**
 * Export format
 */
export type ExportFormat = 'none' | 'es6-default' | 'es6-named' | 'commonjs' | 'umd';

/**
 * Quote style
 */
export type QuoteStyle = 'single' | 'double';

/**
 * JavaScript generator settings
 */
export interface JavaScriptGeneratorSettings {
  // Variable settings
  variableName: string;
  variableDeclaration: VariableDeclaration;
  
  // Export settings
  exportFormat: ExportFormat;
  moduleName: string; // For UMD
  
  // Naming
  propertyNaming: NamingConvention;
  
  // Formatting
  quoteStyle: QuoteStyle;
  quoteKeys: boolean; // Always quote object keys
  trailingComma: boolean;
  semicolon: boolean;
  indentSize: number;
  useSpaces: boolean;
  
  // Advanced
  addComments: boolean;
  freezeObject: boolean;
  useShorthandSyntax: boolean;
}

/**
 * Default settings
 */
export const DEFAULT_JAVASCRIPT_SETTINGS: JavaScriptGeneratorSettings = {
  variableName: 'data',
  variableDeclaration: 'const',
  
  exportFormat: 'none',
  moduleName: 'myModule',
  
  propertyNaming: 'preserve',
  
  quoteStyle: 'single',
  quoteKeys: false,
  trailingComma: true,
  semicolon: true,
  indentSize: 2,
  useSpaces: true,
  
  addComments: false,
  freezeObject: false,
  useShorthandSyntax: false,
};

/**
 * Generation result
 */
export interface JavaScriptGenerationResult {
  success: boolean;
  code?: string;
  errors?: { message: string; type: string }[];
}
