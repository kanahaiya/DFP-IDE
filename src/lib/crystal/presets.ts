/**
 * Preset configurations for JSON to Crystal converter
 */

import type { CrystalPreset } from './types';

export const CRYSTAL_PRESETS: CrystalPreset[] = [
  {
    id: 'json-serializable',
    name: 'JSON::Serializable',
    description: 'Standard Crystal JSON serialization',
    settings: {
      useJsonSerializable: true,
      includeJsonKey: true,
      outputType: 'class',
      useNilableTypes: true,
    },
  },
  {
    id: 'struct',
    name: 'Struct',
    description: 'Value type struct',
    settings: {
      outputType: 'struct',
      useJsonSerializable: true,
      includeJsonKey: true,
      useNilableTypes: true,
    },
  },
  {
    id: 'strict',
    name: 'Strict Types',
    description: 'Non-nullable types with strict checking',
    settings: {
      useJsonSerializable: true,
      useNilableTypes: false,
      useStrictTypes: true,
    },
  },
  {
    id: 'plain',
    name: 'Plain Class',
    description: 'Simple class without JSON serialization',
    settings: {
      useJsonSerializable: false,
      generateInitializer: true,
      outputType: 'class',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Minimal output with properties only',
    settings: {
      useJsonSerializable: false,
      includeJsonKey: false,
      generateInitializer: false,
      outputType: 'class',
    },
  },
];
