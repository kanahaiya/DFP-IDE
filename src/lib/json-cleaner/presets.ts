/**
 * JSON Cleaner Presets
 * Pre-configured cleaning profiles for common use cases
 */

import type { CleanerSettings, CleanerPreset } from './types';
import { DEFAULT_CLEANER_SETTINGS } from './types';

export interface CleanerPresetConfig {
  id: CleanerPreset;
  name: string;
  description: string;
  icon: string;
  settings: CleanerSettings;
}

/**
 * Minimal cleaning - only remove undefined
 */
const MINIMAL_SETTINGS: CleanerSettings = {
  cleaning: {
    ...DEFAULT_CLEANER_SETTINGS.cleaning,
    removeNull: false,
    removeEmptyStrings: false,
    removeEmptyArrays: false,
    removeEmptyObjects: false,
    removeUndefined: true,
    trimStrings: false,
    removeWhitespaceOnly: false,
    deduplicateArrays: false,
    sortKeys: false,
    sortKeysDeep: false,
  },
  transform: {
    ...DEFAULT_CLEANER_SETTINGS.transform,
  },
};

/**
 * Standard cleaning - common operations
 */
const STANDARD_SETTINGS: CleanerSettings = {
  cleaning: {
    ...DEFAULT_CLEANER_SETTINGS.cleaning,
    removeNull: false,
    removeEmptyStrings: false,
    removeEmptyArrays: false,
    removeEmptyObjects: false,
    removeUndefined: true,
    trimStrings: true,
    removeWhitespaceOnly: true,
    deduplicateArrays: false,
    sortKeys: false,
    sortKeysDeep: false,
  },
  transform: {
    ...DEFAULT_CLEANER_SETTINGS.transform,
  },
};

/**
 * Aggressive cleaning - remove all empty values
 */
const AGGRESSIVE_SETTINGS: CleanerSettings = {
  cleaning: {
    ...DEFAULT_CLEANER_SETTINGS.cleaning,
    removeNull: true,
    removeEmptyStrings: true,
    removeEmptyArrays: true,
    removeEmptyObjects: true,
    removeUndefined: true,
    trimStrings: true,
    removeWhitespaceOnly: true,
    deduplicateArrays: true,
    sortKeys: false,
    sortKeysDeep: false,
  },
  transform: {
    ...DEFAULT_CLEANER_SETTINGS.transform,
  },
};

/**
 * API preparation - clean and normalize for API responses
 */
const API_SETTINGS: CleanerSettings = {
  cleaning: {
    ...DEFAULT_CLEANER_SETTINGS.cleaning,
    removeNull: false, // Keep nulls for API contracts
    removeEmptyStrings: false,
    removeEmptyArrays: false,
    removeEmptyObjects: false,
    removeUndefined: true,
    trimStrings: true,
    removeWhitespaceOnly: false,
    deduplicateArrays: false,
    sortKeys: true, // Consistent key order
    sortKeysDeep: true,
  },
  transform: {
    ...DEFAULT_CLEANER_SETTINGS.transform,
    keyCase: 'camelCase', // Standard API convention
    keyTransformDeep: true,
  },
};

/**
 * Storage optimization - minimize size
 */
const STORAGE_SETTINGS: CleanerSettings = {
  cleaning: {
    ...DEFAULT_CLEANER_SETTINGS.cleaning,
    removeNull: true,
    removeEmptyStrings: true,
    removeEmptyArrays: true,
    removeEmptyObjects: true,
    removeUndefined: true,
    trimStrings: true,
    removeWhitespaceOnly: true,
    deduplicateArrays: true,
    sortKeys: true,
    sortKeysDeep: true,
    minify: true,
  },
  transform: {
    ...DEFAULT_CLEANER_SETTINGS.transform,
  },
};

/**
 * All available presets
 */
export const CLEANER_PRESETS: CleanerPresetConfig[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Remove only undefined values. Safe for all use cases.',
    icon: 'fas fa-feather',
    settings: MINIMAL_SETTINGS,
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Trim strings and remove whitespace-only values.',
    icon: 'fas fa-balance-scale',
    settings: STANDARD_SETTINGS,
  },
  {
    id: 'aggressive',
    name: 'Aggressive',
    description: 'Remove all empty values, nulls, and duplicates.',
    icon: 'fas fa-broom',
    settings: AGGRESSIVE_SETTINGS,
  },
  {
    id: 'api',
    name: 'API Ready',
    description: 'Normalize for API use. Sort keys, convert to camelCase.',
    icon: 'fas fa-server',
    settings: API_SETTINGS,
  },
  {
    id: 'storage',
    name: 'Storage Optimized',
    description: 'Maximum compression. Remove all unnecessary data.',
    icon: 'fas fa-database',
    settings: STORAGE_SETTINGS,
  },
];

/**
 * Get preset by ID
 */
export function getPreset(id: CleanerPreset): CleanerPresetConfig | undefined {
  return CLEANER_PRESETS.find(p => p.id === id);
}

/**
 * Apply preset to settings
 */
export function applyPreset(presetId: CleanerPreset): CleanerSettings {
  const preset = getPreset(presetId);
  return preset?.settings ?? DEFAULT_CLEANER_SETTINGS;
}
