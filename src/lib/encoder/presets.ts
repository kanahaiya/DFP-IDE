/**
 * Encoder Presets - One-click configurations for common encoding scenarios
 */

import type { EncoderSettings, EncodingType } from './converter';

export interface EncoderPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<EncoderSettings>;
}

export const ENCODER_PRESETS: EncoderPreset[] = [
  {
    id: 'url-safe',
    name: 'URL Safe',
    description: 'URL encoding for query parameters and form data',
    icon: 'fas fa-link',
    settings: {
      encodingType: 'url',
      minifyFirst: true,
      spaceAsPlus: false,
    },
  },
  {
    id: 'url-form',
    name: 'Form Data',
    description: 'URL encoding with spaces as + for form submissions',
    icon: 'fas fa-wpforms',
    settings: {
      encodingType: 'url',
      minifyFirst: true,
      spaceAsPlus: true,
    },
  },
  {
    id: 'base64-standard',
    name: 'Base64 Standard',
    description: 'Standard Base64 with padding for data URIs and basic auth',
    icon: 'fas fa-key',
    settings: {
      encodingType: 'base64',
      minifyFirst: true,
      urlSafe: false,
      includePadding: true,
    },
  },
  {
    id: 'base64-jwt',
    name: 'Base64 JWT/URL',
    description: 'URL-safe Base64 without padding for JWT tokens',
    icon: 'fas fa-id-badge',
    settings: {
      encodingType: 'base64url',
      minifyFirst: true,
      urlSafe: true,
      includePadding: false,
    },
  },
  {
    id: 'hex-lowercase',
    name: 'Hex Lowercase',
    description: 'Lowercase hexadecimal representation',
    icon: 'fas fa-hashtag',
    settings: {
      encodingType: 'hex',
      minifyFirst: true,
      uppercase: false,
      hexPrefix: 'none',
      hexDelimiter: 'none',
    },
  },
  {
    id: 'hex-debug',
    name: 'Hex Debug',
    description: 'Uppercase hex with 0x prefix and spaces for debugging',
    icon: 'fas fa-bug',
    settings: {
      encodingType: 'hex',
      minifyFirst: false,
      uppercase: true,
      hexPrefix: '0x',
      hexDelimiter: 'space',
    },
  },
  {
    id: 'hex-escape',
    name: 'Hex Escape',
    description: 'Hex with \\x prefix for programming strings',
    icon: 'fas fa-code',
    settings: {
      encodingType: 'hex',
      minifyFirst: true,
      uppercase: false,
      hexPrefix: '\\x',
      hexDelimiter: 'none',
    },
  },
  {
    id: 'html-safe',
    name: 'HTML Safe',
    description: 'HTML entity encoding for embedding in HTML attributes',
    icon: 'fas fa-code',
    settings: {
      encodingType: 'htmlEntity',
      minifyFirst: true,
    },
  },
  {
    id: 'ascii-only',
    name: 'ASCII Only',
    description: 'Unicode escape non-ASCII characters for compatibility',
    icon: 'fas fa-font',
    settings: {
      encodingType: 'unicode',
      minifyFirst: true,
      escapeAll: false,
      escapeNonAscii: true,
    },
  },
  {
    id: 'unicode-full',
    name: 'Full Unicode',
    description: 'Escape all characters to \\uXXXX format',
    icon: 'fas fa-globe',
    settings: {
      encodingType: 'unicode',
      minifyFirst: true,
      escapeAll: true,
      escapeNonAscii: true,
    },
  },
];

/**
 * Get preset by ID
 */
export function getPresetById(id: string): EncoderPreset | undefined {
  return ENCODER_PRESETS.find(preset => preset.id === id);
}

/**
 * Get default preset
 */
export function getDefaultPreset(): EncoderPreset {
  return ENCODER_PRESETS[0];
}

/**
 * Get presets by encoding type
 */
export function getPresetsByType(type: EncodingType): EncoderPreset[] {
  return ENCODER_PRESETS.filter(preset => preset.settings.encodingType === type);
}
