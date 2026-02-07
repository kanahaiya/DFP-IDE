/**
 * Escaper Presets - Pre-configured settings for common use cases
 */

import type { EscaperSettings } from './converter';

export interface EscaperPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<EscaperSettings>;
}

export const ESCAPER_PRESETS: EscaperPreset[] = [
  {
    id: 'standard',
    name: 'Standard JSON',
    description: 'Basic JSON escaping with quotes',
    icon: 'fas fa-code',
    settings: {
      escapeMode: 'standard',
      outputFormat: 'string',
      escapeSlash: false,
      unicodeEscape: false,
      wrapInQuotes: true,
    },
  },
  {
    id: 'minified',
    name: 'Minified String',
    description: 'Compact escaped string without whitespace',
    icon: 'fas fa-compress',
    settings: {
      escapeMode: 'standard',
      outputFormat: 'minified',
      escapeSlash: false,
      unicodeEscape: false,
      wrapInQuotes: true,
    },
  },
  {
    id: 'javascript',
    name: 'JavaScript String',
    description: 'For embedding in JS code',
    icon: 'fab fa-js',
    settings: {
      escapeMode: 'javascript',
      outputFormat: 'minified',
      escapeSlash: true,
      unicodeEscape: false,
      wrapInQuotes: true,
    },
  },
  {
    id: 'url-query',
    name: 'URL Query',
    description: 'For URL query parameters',
    icon: 'fas fa-link',
    settings: {
      escapeMode: 'urlSafe',
      outputFormat: 'minified',
      wrapInQuotes: false,
    },
  },
  {
    id: 'html-attribute',
    name: 'HTML Attribute',
    description: 'Safe for HTML data attributes',
    icon: 'fas fa-code',
    settings: {
      escapeMode: 'htmlSafe',
      outputFormat: 'minified',
      escapeSlash: false,
      unicodeEscape: false,
      wrapInQuotes: true,
    },
  },
  {
    id: 'ascii-only',
    name: 'ASCII Only',
    description: 'Unicode escape all non-ASCII chars',
    icon: 'fas fa-font',
    settings: {
      escapeMode: 'standard',
      outputFormat: 'string',
      escapeSlash: false,
      unicodeEscape: true,
      escapeNonAscii: true,
      wrapInQuotes: true,
    },
  },
  {
    id: 'readable',
    name: 'Readable Format',
    description: 'Pretty-printed with indentation',
    icon: 'fas fa-align-left',
    settings: {
      escapeMode: 'standard',
      outputFormat: 'formatted',
      escapeSlash: false,
      unicodeEscape: false,
      wrapInQuotes: true,
      indentation: 2,
    },
  },
  {
    id: 'no-quotes',
    name: 'No Outer Quotes',
    description: 'Escaped content without wrapper quotes',
    icon: 'fas fa-quote-right',
    settings: {
      escapeMode: 'standard',
      outputFormat: 'string',
      escapeSlash: false,
      unicodeEscape: false,
      wrapInQuotes: false,
    },
  },
];

/**
 * Get preset by ID
 */
export function getPresetById(id: string): EscaperPreset | undefined {
  return ESCAPER_PRESETS.find(preset => preset.id === id);
}

/**
 * Get default preset
 */
export function getDefaultPreset(): EscaperPreset {
  return ESCAPER_PRESETS[0];
}
