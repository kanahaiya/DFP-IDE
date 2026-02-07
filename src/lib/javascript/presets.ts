/**
 * JavaScript Generator Presets
 */

import type { JavaScriptGeneratorSettings } from './types';
import { DEFAULT_JAVASCRIPT_SETTINGS } from './types';

export interface JavaScriptPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<JavaScriptGeneratorSettings>;
}

export const JAVASCRIPT_PRESETS: JavaScriptPreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard const declaration with single quotes',
    settings: {
      ...DEFAULT_JAVASCRIPT_SETTINGS,
    },
  },
  {
    id: 'es6-module',
    name: 'ES6 Module',
    description: 'Export as ES6 default module',
    settings: {
      variableDeclaration: 'const',
      exportFormat: 'es6-default',
      quoteStyle: 'single',
      trailingComma: true,
      semicolon: true,
    },
  },
  {
    id: 'es6-named',
    name: 'ES6 Named Export',
    description: 'Export as named ES6 export',
    settings: {
      variableDeclaration: 'const',
      exportFormat: 'es6-named',
      quoteStyle: 'single',
      trailingComma: true,
      semicolon: true,
    },
  },
  {
    id: 'commonjs',
    name: 'CommonJS',
    description: 'Node.js module.exports format',
    settings: {
      variableDeclaration: 'const',
      exportFormat: 'commonjs',
      quoteStyle: 'single',
      trailingComma: true,
      semicolon: true,
    },
  },
  {
    id: 'umd',
    name: 'UMD Module',
    description: 'Universal Module Definition for browser/Node',
    settings: {
      variableDeclaration: 'const',
      exportFormat: 'umd',
      moduleName: 'myData',
      quoteStyle: 'single',
      semicolon: true,
    },
  },
  {
    id: 'double-quotes',
    name: 'Double Quotes',
    description: 'Use double quotes for strings',
    settings: {
      variableDeclaration: 'const',
      quoteStyle: 'double',
      quoteKeys: false,
      trailingComma: true,
      semicolon: true,
    },
  },
  {
    id: 'no-semicolons',
    name: 'No Semicolons',
    description: 'ASI style without semicolons',
    settings: {
      variableDeclaration: 'const',
      quoteStyle: 'single',
      trailingComma: true,
      semicolon: false,
    },
  },
  {
    id: 'immutable',
    name: 'Immutable',
    description: 'Freeze object for immutability',
    settings: {
      variableDeclaration: 'const',
      freezeObject: true,
      quoteStyle: 'single',
      trailingComma: true,
      semicolon: true,
    },
  },
  {
    id: 'legacy',
    name: 'Legacy (var)',
    description: 'ES5 compatible with var declaration',
    settings: {
      variableDeclaration: 'var',
      exportFormat: 'none',
      quoteStyle: 'double',
      quoteKeys: true,
      trailingComma: false,
      semicolon: true,
    },
  },
  {
    id: 'raw-object',
    name: 'Raw Object',
    description: 'Object literal only, no variable',
    settings: {
      variableDeclaration: 'none',
      exportFormat: 'none',
      quoteStyle: 'single',
      trailingComma: true,
      semicolon: false,
    },
  },
];

/**
 * Get a preset by ID
 */
export function getPresetById(id: string): JavaScriptPreset | undefined {
  return JAVASCRIPT_PRESETS.find((preset) => preset.id === id);
}

/**
 * Apply a preset to current settings
 */
export function applyPreset(
  currentSettings: JavaScriptGeneratorSettings,
  presetId: string
): JavaScriptGeneratorSettings {
  const preset = getPresetById(presetId);
  if (!preset) {
    return currentSettings;
  }

  return {
    ...currentSettings,
    ...preset.settings,
  };
}
