import type { ElmGeneratorSettings } from './types';

export interface ElmPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<ElmGeneratorSettings>;
}

export const ELM_PRESETS: ElmPreset[] = [
  {
    id: 'full-pipeline',
    name: 'Full + Pipeline',
    description: 'Types, decoders, encoders with pipeline',
    icon: 'fa-stream',
    settings: {
      outputMode: 'full',
      generateTypeAliases: true,
      generateDecoders: true,
      generateEncoders: true,
      usePipeline: true,
      addComments: true,
    },
  },
  {
    id: 'types-only',
    name: 'Types Only',
    description: 'Just type aliases',
    icon: 'fa-shapes',
    settings: {
      outputMode: 'types-only',
      generateTypeAliases: true,
      generateDecoders: false,
      generateEncoders: false,
    },
  },
  {
    id: 'decoders-only',
    name: 'With Decoders',
    description: 'Types and decoders only',
    icon: 'fa-download',
    settings: {
      outputMode: 'with-decoders',
      generateTypeAliases: true,
      generateDecoders: true,
      generateEncoders: false,
      usePipeline: true,
    },
  },
  {
    id: 'no-pipeline',
    name: 'No Pipeline',
    description: 'Standard Decode.mapN style',
    icon: 'fa-layer-group',
    settings: {
      outputMode: 'full',
      usePipeline: false,
      generateTypeAliases: true,
      generateDecoders: true,
      generateEncoders: true,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Types and decoders, no comments',
    icon: 'fa-compress',
    settings: {
      outputMode: 'with-decoders',
      generateTypeAliases: true,
      generateDecoders: true,
      generateEncoders: false,
      addComments: false,
    },
  },
];

export function applyPreset(current: ElmGeneratorSettings, presetId: string): ElmGeneratorSettings {
  const preset = ELM_PRESETS.find(p => p.id === presetId);
  if (!preset) return current;
  return { ...current, ...preset.settings };
}

export function getPresetById(presetId: string): ElmPreset | undefined {
  return ELM_PRESETS.find(p => p.id === presetId);
}
