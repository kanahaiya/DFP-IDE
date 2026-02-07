/**
 * Unflatten Presets - Pre-configured settings for common use cases
 */

import type { UnflattenSettings } from './converter';

export interface UnflattenPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<UnflattenSettings>;
}

export const UNFLATTEN_PRESETS: UnflattenPreset[] = [
  {
    id: 'auto-detect',
    name: 'Auto Detect',
    description: 'Auto-detect arrays with dot delimiter',
    icon: 'fas fa-magic',
    settings: {
      delimiter: 'dot',
      autoDetectArrays: true,
      forceArrayConversion: false,
      conflictMode: 'lastWins',
      preserveNumbers: true,
      preserveBooleans: true,
      preserveNull: true,
      formatOutput: true,
      indentation: 2,
    },
  },
  {
    id: 'database-import',
    name: 'Database Import',
    description: 'For database exports with dot notation',
    icon: 'fas fa-database',
    settings: {
      delimiter: 'dot',
      autoDetectArrays: true,
      forceArrayConversion: false,
      conflictMode: 'lastWins',
      preserveNumbers: true,
      preserveBooleans: true,
      preserveNull: true,
      formatOutput: true,
      indentation: 2,
    },
  },
  {
    id: 'form-data',
    name: 'Form Data',
    description: 'For form serialization with bracket arrays',
    icon: 'fas fa-wpforms',
    settings: {
      delimiter: 'dot',
      autoDetectArrays: true,
      forceArrayConversion: true,
      conflictMode: 'lastWins',
      preserveNumbers: false,
      preserveBooleans: false,
      preserveNull: false,
      formatOutput: true,
      indentation: 2,
    },
  },
  {
    id: 'config-import',
    name: 'Config Import',
    description: 'For configuration files with underscores',
    icon: 'fas fa-cogs',
    settings: {
      delimiter: 'underscore',
      autoDetectArrays: false,
      forceArrayConversion: false,
      conflictMode: 'lastWins',
      preserveNumbers: true,
      preserveBooleans: true,
      preserveNull: true,
      formatOutput: true,
      indentation: 2,
    },
  },
  {
    id: 'strict-mode',
    name: 'Strict Mode',
    description: 'Error on any key conflicts',
    icon: 'fas fa-shield-alt',
    settings: {
      delimiter: 'dot',
      autoDetectArrays: true,
      forceArrayConversion: false,
      conflictMode: 'strict',
      preserveNumbers: true,
      preserveBooleans: true,
      preserveNull: true,
      formatOutput: true,
      indentation: 2,
    },
  },
  {
    id: 'preserve-first',
    name: 'Preserve First',
    description: 'Keep first value on conflicts',
    icon: 'fas fa-hand-paper',
    settings: {
      delimiter: 'dot',
      autoDetectArrays: true,
      forceArrayConversion: false,
      conflictMode: 'preserveFirst',
      preserveNumbers: true,
      preserveBooleans: true,
      preserveNull: true,
      formatOutput: true,
      indentation: 2,
    },
  },
  {
    id: 'minified',
    name: 'Minified Output',
    description: 'Compact single-line output',
    icon: 'fas fa-compress-arrows-alt',
    settings: {
      delimiter: 'dot',
      autoDetectArrays: true,
      forceArrayConversion: false,
      conflictMode: 'lastWins',
      preserveNumbers: true,
      preserveBooleans: true,
      preserveNull: true,
      formatOutput: false,
    },
  },
  {
    id: 'sorted-keys',
    name: 'Sorted Keys',
    description: 'Alphabetically sort object keys',
    icon: 'fas fa-sort-alpha-down',
    settings: {
      delimiter: 'dot',
      autoDetectArrays: true,
      forceArrayConversion: false,
      conflictMode: 'lastWins',
      preserveNumbers: true,
      preserveBooleans: true,
      preserveNull: true,
      formatOutput: true,
      indentation: 2,
      sortKeys: true,
    },
  },
];

/**
 * Get preset by ID
 */
export function getUnflattenPresetById(id: string): UnflattenPreset | undefined {
  return UNFLATTEN_PRESETS.find(preset => preset.id === id);
}

/**
 * Get all presets
 */
export function getAllUnflattenPresets(): UnflattenPreset[] {
  return UNFLATTEN_PRESETS;
}
