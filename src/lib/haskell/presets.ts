import type { HaskellGeneratorSettings } from './types';

export interface HaskellPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<HaskellGeneratorSettings>;
}

export const HASKELL_PRESETS: HaskellPreset[] = [
  {
    id: 'generic-derive',
    name: 'Generic Derive',
    description: 'DeriveGeneric with Aeson instances',
    icon: 'fa-cogs',
    settings: {
      aesonStyle: 'generic',
      deriveGeneric: true,
      generateToJSON: true,
      generateFromJSON: true,
      fieldLabelModifier: true,
    },
  },
  {
    id: 'template-haskell',
    name: 'Template Haskell',
    description: 'Use deriveJSON TH',
    icon: 'fa-magic',
    settings: {
      aesonStyle: 'template-haskell',
      deriveGeneric: false,
      generateToJSON: true,
      generateFromJSON: true,
    },
  },
  {
    id: 'manual-instances',
    name: 'Manual Instances',
    description: 'Hand-written Aeson instances',
    icon: 'fa-hand-paper',
    settings: {
      aesonStyle: 'manual',
      deriveGeneric: true,
      generateToJSON: true,
      generateFromJSON: true,
      fieldLabelModifier: false,
    },
  },
  {
    id: 'strict-data',
    name: 'Strict Fields',
    description: 'Strict data with bang patterns',
    icon: 'fa-bolt',
    settings: {
      aesonStyle: 'generic',
      useStrictFields: true,
      deriveGeneric: true,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Types only, no instances',
    icon: 'fa-compress',
    settings: {
      aesonStyle: 'generic',
      generateToJSON: false,
      generateFromJSON: false,
      deriveGeneric: true,
      addDocComments: false,
    },
  },
];

export function applyPreset(current: HaskellGeneratorSettings, presetId: string): HaskellGeneratorSettings {
  const preset = HASKELL_PRESETS.find(p => p.id === presetId);
  if (!preset) return current;
  return { ...current, ...preset.settings };
}

export function getPresetById(presetId: string): HaskellPreset | undefined {
  return HASKELL_PRESETS.find(p => p.id === presetId);
}
