/**
 * JSON Validator Presets
 * Pre-configured validation settings for common use cases
 */

import type { ValidatorPreset, ValidatorSettings } from './types';

export const VALIDATOR_PRESETS: ValidatorPreset[] = [
  {
    id: 'strict',
    name: 'Strict (RFC 8259)',
    description: 'Strictest JSON standard - no extensions allowed',
    icon: 'fa-gavel',
    settings: {
      standard: 'RFC8259',
      strictMode: true,
      allowComments: false,
      allowTrailingCommas: false,
      allowSingleQuotes: false,
      allowUnquotedKeys: false,
      detectDuplicateKeys: true,
    },
  },
  {
    id: 'lenient',
    name: 'Lenient (JSON5-like)',
    description: 'Allows comments, trailing commas, and single quotes',
    icon: 'fa-feather',
    settings: {
      standard: 'ECMA404',
      strictMode: false,
      allowComments: true,
      allowTrailingCommas: true,
      allowSingleQuotes: true,
      allowUnquotedKeys: true,
      detectDuplicateKeys: false,
    },
  },
  {
    id: 'config',
    name: 'Config Files',
    description: 'For JSON config files with comments',
    icon: 'fa-cog',
    settings: {
      standard: 'RFC7159',
      strictMode: false,
      allowComments: true,
      allowTrailingCommas: true,
      allowSingleQuotes: false,
      allowUnquotedKeys: false,
      detectDuplicateKeys: true,
    },
  },
  {
    id: 'api',
    name: 'API Response',
    description: 'Strict validation for API JSON responses',
    icon: 'fa-exchange-alt',
    settings: {
      standard: 'RFC8259',
      strictMode: true,
      allowComments: false,
      allowTrailingCommas: false,
      allowSingleQuotes: false,
      allowUnquotedKeys: false,
      detectDuplicateKeys: true,
      showStatistics: true,
    },
  },
];

/**
 * Apply a preset to current settings
 */
export function applyPreset(
  currentSettings: ValidatorSettings,
  presetId: string
): ValidatorSettings {
  const preset = VALIDATOR_PRESETS.find(p => p.id === presetId);
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
export function getPresetById(presetId: string): ValidatorPreset | undefined {
  return VALIDATOR_PRESETS.find(p => p.id === presetId);
}
