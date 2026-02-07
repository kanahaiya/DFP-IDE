/**
 * Protobuf Generator Presets
 * Pre-configured settings for common use cases
 */

import type { ProtobufPreset, ProtobufGeneratorSettings } from './types';
import { DEFAULT_PROTOBUF_SETTINGS } from './types';

export const PROTOBUF_PRESETS: ProtobufPreset[] = [
  {
    id: 'proto3-standard',
    name: 'Proto3 Standard',
    description: 'Modern proto3 syntax with snake_case fields',
    icon: 'fa-cube',
    settings: {
      syntax: 'proto3',
      useSnakeCase: true,
      useOptionalForNullable: true,
    },
  },
  {
    id: 'proto2-compatible',
    name: 'Proto2 Compatible',
    description: 'Legacy proto2 syntax for older systems',
    icon: 'fa-history',
    settings: {
      syntax: 'proto2',
      useSnakeCase: true,
      useOptionalForNullable: false,
    },
  },
  {
    id: 'grpc-service',
    name: 'gRPC Service',
    description: 'Optimized for gRPC service definitions',
    icon: 'fa-server',
    settings: {
      syntax: 'proto3',
      useSnakeCase: true,
      generateComments: true,
      includeJsonName: true,
    },
  },
  {
    id: 'json-preserving',
    name: 'JSON Preserving',
    description: 'Preserve original JSON field names',
    icon: 'fa-code',
    settings: {
      syntax: 'proto3',
      useSnakeCase: false,
      includeJsonName: true,
      generateComments: true,
    },
  },
  {
    id: 'compact',
    name: 'Compact Output',
    description: 'Minimal schema without comments',
    icon: 'fa-compress',
    settings: {
      syntax: 'proto3',
      useSnakeCase: true,
      generateComments: false,
      includeJsonName: false,
      indentation: 2,
    },
  },
  {
    id: 'documented',
    name: 'Fully Documented',
    description: 'Include all comments and annotations',
    icon: 'fa-file-alt',
    settings: {
      syntax: 'proto3',
      generateComments: true,
      includeJsonName: true,
      useSnakeCase: true,
    },
  },
];

/**
 * Apply preset to current settings
 */
export function applyProtobufPreset(
  currentSettings: ProtobufGeneratorSettings,
  presetId: string
): ProtobufGeneratorSettings {
  const preset = PROTOBUF_PRESETS.find(p => p.id === presetId);
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
export function getProtobufPresetById(presetId: string): ProtobufPreset | undefined {
  return PROTOBUF_PRESETS.find(p => p.id === presetId);
}

/**
 * Reset to default settings
 */
export function getDefaultProtobufSettings(): ProtobufGeneratorSettings {
  return { ...DEFAULT_PROTOBUF_SETTINGS };
}
