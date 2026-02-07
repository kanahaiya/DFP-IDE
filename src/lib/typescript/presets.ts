/**
 * TypeScript Generator Presets
 */

import type { TypeScriptGeneratorSettings } from './types';
import { DEFAULT_TYPESCRIPT_SETTINGS } from './types';

export interface TypeScriptPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<TypeScriptGeneratorSettings>;
}

export const TYPESCRIPT_PRESETS: TypeScriptPreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard TypeScript interfaces with sensible defaults',
    settings: {
      ...DEFAULT_TYPESCRIPT_SETTINGS,
    },
  },
  {
    id: 'strict',
    name: 'Strict Mode',
    description: 'Strict TypeScript with readonly properties and strict null checks',
    settings: {
      outputFormat: 'interface',
      useReadonly: true,
      useStrictNullChecks: true,
      useUnknownInsteadOfAny: true,
      useOptionalProperties: true,
      markAllOptional: false,
      nullHandling: 'nullable',
      exportTypes: true,
    },
  },
  {
    id: 'types-only',
    name: 'Type Aliases',
    description: 'Use type aliases instead of interfaces',
    settings: {
      outputFormat: 'type',
      useTypeKeyword: true,
      exportTypes: true,
      useOptionalProperties: true,
    },
  },
  {
    id: 'documented',
    name: 'Documented',
    description: 'Include JSDoc comments and examples',
    settings: {
      generateJSDoc: true,
      includeExamples: true,
      exportTypes: true,
      useOptionalProperties: true,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Minimal output without optional markers or exports',
    settings: {
      exportTypes: false,
      useOptionalProperties: false,
      markAllOptional: false,
      generateJSDoc: false,
      useReadonly: false,
      addTrailingComma: false,
    },
  },
  {
    id: 'immutable',
    name: 'Immutable',
    description: 'All properties are readonly for immutable data structures',
    settings: {
      useReadonly: true,
      outputFormat: 'interface',
      exportTypes: true,
      useOptionalProperties: true,
    },
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Optimized for API response types with null handling',
    settings: {
      outputFormat: 'interface',
      useOptionalProperties: true,
      nullHandling: 'nullable',
      useStrictNullChecks: true,
      exportTypes: true,
      generateJSDoc: true,
    },
  },
  {
    id: 'generic-array',
    name: 'Generic Arrays',
    description: 'Use Array<T> notation instead of T[]',
    settings: {
      arrayNotation: 'generic',
      outputFormat: 'interface',
      exportTypes: true,
    },
  },
];

/**
 * Get a preset by ID
 */
export function getPresetById(id: string): TypeScriptPreset | undefined {
  return TYPESCRIPT_PRESETS.find((preset) => preset.id === id);
}

/**
 * Apply a preset to current settings
 */
export function applyPreset(
  currentSettings: TypeScriptGeneratorSettings,
  presetId: string
): TypeScriptGeneratorSettings {
  const preset = getPresetById(presetId);
  if (!preset) {
    return currentSettings;
  }

  return {
    ...currentSettings,
    ...preset.settings,
  };
}
