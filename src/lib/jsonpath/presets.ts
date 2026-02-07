/**
 * JSONPath Presets
 * Pre-configured settings for different use cases
 */

import type { JSONPathPreset, JSONPathSettings } from './types';
import { DEFAULT_JSONPATH_SETTINGS } from './types';

export const JSONPATH_PRESETS: JSONPathPreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Balanced settings for general use',
    icon: 'fas fa-cog',
    settings: { ...DEFAULT_JSONPATH_SETTINGS },
  },
  {
    id: 'debug',
    name: 'Debug Mode',
    description: 'Show paths and detailed information',
    icon: 'fas fa-bug',
    settings: {
      autoExecute: true,
      debounceMs: 100,
      resultFormat: 'json',
      showPaths: true,
      wrapResults: true,
      prettyPrint: true,
      indentSize: 2,
    },
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Optimized for large files with minimal overhead',
    icon: 'fas fa-bolt',
    settings: {
      autoExecute: false,
      debounceMs: 500,
      resultFormat: 'json',
      showPaths: false,
      wrapResults: false,
      prettyPrint: false,
      indentSize: 0,
    },
  },
  {
    id: 'table',
    name: 'Table View',
    description: 'Display results in a table format',
    icon: 'fas fa-table',
    settings: {
      autoExecute: true,
      debounceMs: 300,
      resultFormat: 'table',
      showPaths: true,
      wrapResults: true,
      prettyPrint: true,
      indentSize: 2,
    },
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Minimal output without extra formatting',
    icon: 'fas fa-compress-alt',
    settings: {
      autoExecute: true,
      debounceMs: 300,
      resultFormat: 'json',
      showPaths: false,
      wrapResults: false,
      prettyPrint: false,
      indentSize: 0,
    },
  },
];

/**
 * Apply preset to current settings
 */
export function applyJSONPathPreset(
  currentSettings: JSONPathSettings,
  presetId: string
): JSONPathSettings {
  const preset = JSONPATH_PRESETS.find(p => p.id === presetId);
  if (!preset) {
    return currentSettings;
  }
  return { ...currentSettings, ...preset.settings };
}

/**
 * Get preset by ID
 */
export function getJSONPathPreset(presetId: string): JSONPathPreset | undefined {
  return JSONPATH_PRESETS.find(p => p.id === presetId);
}
