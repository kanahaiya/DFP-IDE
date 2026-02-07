/**
 * Decoder Presets - One-click configurations for common decoding scenarios
 */

import type { DecoderSettings, DecodingType } from './converter';

export interface DecoderPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<DecoderSettings>;
}

export const DECODER_PRESETS: DecoderPreset[] = [
  {
    id: 'auto-detect',
    name: 'Auto Detect',
    description: 'Automatically detect encoding type and decode recursively',
    icon: 'fas fa-magic',
    settings: {
      decodingType: 'auto',
      autoDetect: true,
      recursiveDecode: true,
      formatOutput: true,
    },
  },
  {
    id: 'url-decode',
    name: 'URL Decode',
    description: 'Decode URL/percent-encoded strings',
    icon: 'fas fa-link',
    settings: {
      decodingType: 'url',
      autoDetect: false,
      recursiveDecode: false,
      formatOutput: true,
    },
  },
  {
    id: 'url-recursive',
    name: 'URL Multi-Layer',
    description: 'Decode multiple layers of URL encoding',
    icon: 'fas fa-layer-group',
    settings: {
      decodingType: 'url',
      autoDetect: false,
      recursiveDecode: true,
      maxIterations: 5,
      formatOutput: true,
    },
  },
  {
    id: 'base64-decode',
    name: 'Base64 Decode',
    description: 'Decode Base64 and URL-safe Base64 strings',
    icon: 'fas fa-key',
    settings: {
      decodingType: 'base64',
      autoDetect: false,
      recursiveDecode: false,
      formatOutput: true,
    },
  },
  {
    id: 'jwt-decode',
    name: 'JWT Payload',
    description: 'Decode JWT token payload (Base64 URL-safe)',
    icon: 'fas fa-id-badge',
    settings: {
      decodingType: 'base64',
      autoDetect: false,
      recursiveDecode: false,
      formatOutput: true,
      indentation: 2,
    },
  },
  {
    id: 'hex-decode',
    name: 'Hex Decode',
    description: 'Decode hexadecimal byte strings',
    icon: 'fas fa-hashtag',
    settings: {
      decodingType: 'hex',
      autoDetect: false,
      recursiveDecode: false,
      formatOutput: true,
    },
  },
  {
    id: 'html-decode',
    name: 'HTML Entity Decode',
    description: 'Decode HTML numeric and named entities',
    icon: 'fas fa-code',
    settings: {
      decodingType: 'htmlEntity',
      autoDetect: false,
      recursiveDecode: false,
      formatOutput: true,
    },
  },
  {
    id: 'unescape',
    name: 'Unescape JSON',
    description: 'Remove escape sequences from JSON strings',
    icon: 'fas fa-compress-alt',
    settings: {
      decodingType: 'unescape',
      autoDetect: false,
      recursiveDecode: true,
      maxIterations: 3,
      formatOutput: true,
    },
  },
  {
    id: 'full-decode',
    name: 'Full Decode',
    description: 'Auto-detect and decode all layers with formatting',
    icon: 'fas fa-search',
    settings: {
      decodingType: 'auto',
      autoDetect: true,
      recursiveDecode: true,
      maxIterations: 10,
      formatOutput: true,
      indentation: 2,
      sortKeys: false,
    },
  },
  {
    id: 'decode-sort',
    name: 'Decode & Sort',
    description: 'Auto-detect, decode, and sort JSON keys alphabetically',
    icon: 'fas fa-sort-alpha-down',
    settings: {
      decodingType: 'auto',
      autoDetect: true,
      recursiveDecode: true,
      formatOutput: true,
      indentation: 2,
      sortKeys: true,
    },
  },
];

/**
 * Get preset by ID
 */
export function getPresetById(id: string): DecoderPreset | undefined {
  return DECODER_PRESETS.find(preset => preset.id === id);
}

/**
 * Get default preset
 */
export function getDefaultPreset(): DecoderPreset {
  return DECODER_PRESETS[0];
}

/**
 * Get presets by decoding type
 */
export function getPresetsByType(type: DecodingType): DecoderPreset[] {
  return DECODER_PRESETS.filter(preset => preset.settings.decodingType === type);
}
