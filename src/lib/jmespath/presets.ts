/**
 * JMESPath Presets
 * Pre-configured settings for different use cases
 */

import type { JMESPathPreset, JMESPathSettings } from './types';
import { DEFAULT_JMESPATH_SETTINGS } from './types';

export const JMESPATH_PRESETS: JMESPathPreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Balanced settings for general use',
    icon: 'fas fa-cog',
    settings: { ...DEFAULT_JMESPATH_SETTINGS },
  },
  {
    id: 'aws-cli',
    name: 'AWS CLI',
    description: 'Optimized for AWS CLI output parsing',
    icon: 'fab fa-aws',
    settings: {
      autoExecute: true,
      debounceMs: 200,
      resultFormat: 'json',
      showExecutionTime: true,
      prettyPrint: true,
      indentSize: 2,
    },
  },
  {
    id: 'debug',
    name: 'Debug Mode',
    description: 'Show detailed execution information',
    icon: 'fas fa-bug',
    settings: {
      autoExecute: true,
      debounceMs: 100,
      resultFormat: 'json',
      showExecutionTime: true,
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
      showExecutionTime: true,
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
      showExecutionTime: true,
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
      showExecutionTime: false,
      prettyPrint: false,
      indentSize: 0,
    },
  },
];

/**
 * Apply preset to current settings
 */
export function applyJMESPathPreset(
  currentSettings: JMESPathSettings,
  presetId: string
): JMESPathSettings {
  const preset = JMESPATH_PRESETS.find(p => p.id === presetId);
  if (!preset) {
    return currentSettings;
  }
  return { ...currentSettings, ...preset.settings };
}

/**
 * Get preset by ID
 */
export function getJMESPathPreset(presetId: string): JMESPathPreset | undefined {
  return JMESPATH_PRESETS.find(p => p.id === presetId);
}
