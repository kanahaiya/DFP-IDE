/**
 * Flattener Presets - Pre-configured settings for common use cases
 */

import type { FlattenerSettings } from './converter';

export interface FlattenerPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<FlattenerSettings>;
}

export const FLATTENER_PRESETS: FlattenerPreset[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Dot notation with indexed arrays',
    icon: 'fas fa-circle',
    settings: {
      notation: 'dot',
      arrayStrategy: 'index',
      ignoreNulls: false,
      ignoreEmpty: false,
      safeMode: false,
      preserveTypes: true,
    },
  },
  {
    id: 'csv-export',
    name: 'CSV Export',
    description: 'Underscore keys, concatenated arrays for spreadsheets',
    icon: 'fas fa-file-csv',
    settings: {
      notation: 'underscore',
      arrayStrategy: 'concatenate',
      ignoreNulls: true,
      ignoreEmpty: true,
      safeMode: true,
      preserveTypes: false,
      concatenateDelimiter: ', ',
    },
  },
  {
    id: 'env-vars',
    name: 'Environment Variables',
    description: 'Uppercase underscore keys for .env files',
    icon: 'fas fa-terminal',
    settings: {
      notation: 'underscore',
      arrayStrategy: 'concatenate',
      ignoreNulls: true,
      ignoreEmpty: true,
      safeMode: true,
      preserveTypes: false,
    },
  },
  {
    id: 'path-style',
    name: 'Path Style',
    description: 'Slash notation like file paths',
    icon: 'fas fa-folder-tree',
    settings: {
      notation: 'slash',
      arrayStrategy: 'index',
      ignoreNulls: false,
      ignoreEmpty: false,
      safeMode: false,
      preserveTypes: true,
    },
  },
  {
    id: 'safe-keys',
    name: 'Safe Keys',
    description: 'Escape special characters in keys',
    icon: 'fas fa-shield-alt',
    settings: {
      notation: 'dot',
      arrayStrategy: 'index',
      ignoreNulls: false,
      ignoreEmpty: false,
      safeMode: true,
      preserveTypes: true,
    },
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Ignore nulls and empty values',
    icon: 'fas fa-compress',
    settings: {
      notation: 'dot',
      arrayStrategy: 'index',
      ignoreNulls: true,
      ignoreEmpty: true,
      safeMode: false,
      preserveTypes: true,
    },
  },
  {
    id: 'bracket',
    name: 'Bracket Style',
    description: 'Bracket notation for form-like data',
    icon: 'fas fa-brackets-curly',
    settings: {
      notation: 'bracket',
      arrayStrategy: 'index',
      ignoreNulls: false,
      ignoreEmpty: false,
      safeMode: false,
      preserveTypes: true,
    },
  },
  {
    id: 'shallow',
    name: 'Shallow (1 Level)',
    description: 'Only flatten first level of nesting',
    icon: 'fas fa-layer-group',
    settings: {
      notation: 'dot',
      arrayStrategy: 'preserve',
      maxDepth: 1,
      ignoreNulls: false,
      ignoreEmpty: false,
      safeMode: false,
      preserveTypes: true,
    },
  },
];

/**
 * Get preset by ID
 */
export function getFlattenerPresetById(id: string): FlattenerPreset | undefined {
  return FLATTENER_PRESETS.find(preset => preset.id === id);
}

/**
 * Get all presets
 */
export function getAllFlattenerPresets(): FlattenerPreset[] {
  return FLATTENER_PRESETS;
}
