/**
 * Unescaper Presets - Pre-configured settings for common use cases
 */

import type { UnescaperSettings } from './converter';

export interface UnescaperPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<UnescaperSettings>;
}

export const UNESCAPER_PRESETS: UnescaperPreset[] = [
  {
    id: 'auto-format',
    name: 'Auto + Format',
    description: 'Auto-detect and format output',
    icon: 'fas fa-magic',
    settings: {
      unescapeMode: 'auto',
      formatOutput: true,
      indentation: 2,
      sortKeys: false,
      removeOuterQuotes: true,
    },
  },
  {
    id: 'single-layer',
    name: 'Single Layer',
    description: 'Unescape one level only',
    icon: 'fas fa-layer-group',
    settings: {
      unescapeMode: 'singleLayer',
      formatOutput: true,
      indentation: 2,
      removeOuterQuotes: true,
    },
  },
  {
    id: 'deep-unescape',
    name: 'Deep Unescape',
    description: 'Recursively unescape all layers',
    icon: 'fas fa-sitemap',
    settings: {
      unescapeMode: 'multiLayer',
      formatOutput: true,
      indentation: 2,
      maxDepth: 10,
      removeOuterQuotes: true,
    },
  },
  {
    id: 'json-string',
    name: 'JSON String',
    description: 'Parse as JSON string literal',
    icon: 'fas fa-quote-right',
    settings: {
      unescapeMode: 'jsonString',
      formatOutput: true,
      indentation: 2,
      removeOuterQuotes: true,
    },
  },
  {
    id: 'minified',
    name: 'Minified Output',
    description: 'Unescape without formatting',
    icon: 'fas fa-compress',
    settings: {
      unescapeMode: 'auto',
      formatOutput: false,
      removeOuterQuotes: true,
    },
  },
  {
    id: 'sorted-keys',
    name: 'Sorted Keys',
    description: 'Format with alphabetically sorted keys',
    icon: 'fas fa-sort-alpha-down',
    settings: {
      unescapeMode: 'auto',
      formatOutput: true,
      indentation: 2,
      sortKeys: true,
      removeOuterQuotes: true,
    },
  },
  {
    id: 'tabs',
    name: 'Tab Indentation',
    description: 'Format with tabs instead of spaces',
    icon: 'fas fa-indent',
    settings: {
      unescapeMode: 'auto',
      formatOutput: true,
      indentation: 'tab',
      sortKeys: false,
      removeOuterQuotes: true,
    },
  },
  {
    id: 'keep-quotes',
    name: 'Keep Quotes',
    description: 'Preserve outer quotation marks',
    icon: 'fas fa-quote-left',
    settings: {
      unescapeMode: 'singleLayer',
      formatOutput: false,
      removeOuterQuotes: false,
    },
  },
];

/**
 * Get preset by ID
 */
export function getPresetById(id: string): UnescaperPreset | undefined {
  return UNESCAPER_PRESETS.find(preset => preset.id === id);
}

/**
 * Get default preset
 */
export function getDefaultPreset(): UnescaperPreset {
  return UNESCAPER_PRESETS[0];
}
