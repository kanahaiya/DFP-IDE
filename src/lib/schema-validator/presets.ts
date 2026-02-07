/**
 * JSON Schema Validator Presets
 * Pre-configured validation settings
 */

import type { SchemaValidatorPreset, SchemaValidatorSettings } from './types';

export const SCHEMA_VALIDATOR_PRESETS: SchemaValidatorPreset[] = [
  {
    id: 'strict',
    name: 'Strict Mode',
    description: 'Most strict validation with all checks enabled',
    icon: 'fa-gavel',
    settings: {
      strictMode: true,
      allErrors: true,
      validateFormats: true,
      coerceTypes: false,
    },
  },
  {
    id: 'lenient',
    name: 'Lenient Mode',
    description: 'Relaxed validation with type coercion',
    icon: 'fa-feather',
    settings: {
      strictMode: false,
      allErrors: true,
      validateFormats: false,
      coerceTypes: true,
    },
  },
  {
    id: 'draft-04',
    name: 'Draft-04 Compatible',
    description: 'Use JSON Schema Draft-04 specification',
    icon: 'fa-history',
    settings: {
      draft: 'draft-04',
      autoDetectDraft: false,
    },
  },
  {
    id: 'draft-07',
    name: 'Draft-07 Compatible',
    description: 'Use JSON Schema Draft-07 specification',
    icon: 'fa-code',
    settings: {
      draft: 'draft-07',
      autoDetectDraft: false,
    },
  },
  {
    id: 'draft-2020',
    name: 'Draft 2020-12',
    description: 'Use latest JSON Schema 2020-12 specification',
    icon: 'fa-star',
    settings: {
      draft: '2020-12',
      autoDetectDraft: false,
    },
  },
];

/**
 * Apply preset to current settings
 */
export function applySchemaPreset(
  currentSettings: SchemaValidatorSettings,
  presetId: string
): SchemaValidatorSettings {
  const preset = SCHEMA_VALIDATOR_PRESETS.find(p => p.id === presetId);
  if (!preset) {
    return currentSettings;
  }
  return {
    ...currentSettings,
    ...preset.settings,
  };
}

/**
 * Get preset by ID
 */
export function getSchemaPresetById(presetId: string): SchemaValidatorPreset | undefined {
  return SCHEMA_VALIDATOR_PRESETS.find(p => p.id === presetId);
}
