/**
 * Dart generator presets
 */

import type { DartPreset } from './types';

export const DART_PRESETS: DartPreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Plain Dart class with fromJson/toJson',
    settings: {
      codeStyle: 'plain',
      useFinal: true,
      useRequired: true,
      generateFromJson: true,
      generateToJson: true,
      generateCopyWith: false,
      indentation: 2,
    }
  },
  {
    id: 'flutter-model',
    name: 'Flutter Model',
    description: 'Full-featured model with copyWith and equality',
    settings: {
      codeStyle: 'plain',
      useFinal: true,
      useRequired: true,
      generateFromJson: true,
      generateToJson: true,
      generateCopyWith: true,
      generateToString: true,
      generateEquality: true,
      indentation: 2,
    }
  },
  {
    id: 'freezed',
    name: 'Freezed',
    description: 'Immutable with freezed package annotations',
    settings: {
      codeStyle: 'freezed',
      useFinal: true,
      useRequired: true,
      generateFromJson: true,
      generateToJson: true,
      indentation: 2,
    }
  },
  {
    id: 'json-serializable',
    name: 'JSON Serializable',
    description: 'With json_serializable package annotations',
    settings: {
      codeStyle: 'jsonSerializable',
      useFinal: true,
      useRequired: true,
      generateFromJson: true,
      generateToJson: true,
      indentation: 2,
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple class without serialization',
    settings: {
      codeStyle: 'plain',
      useFinal: false,
      useRequired: false,
      generateFromJson: false,
      generateToJson: false,
      generateCopyWith: false,
      indentation: 2,
    }
  },
];

export function getDartPreset(id: string): DartPreset | undefined {
  return DART_PRESETS.find(p => p.id === id);
}
