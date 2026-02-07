import type { RubyGeneratorSettings } from './types';

export interface RubyPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<RubyGeneratorSettings>;
}

export const RUBY_PRESETS: RubyPreset[] = [
  {
    id: 'modern-hash',
    name: 'Modern Hash',
    description: 'Ruby 1.9+ symbol key syntax',
    icon: 'fa-gem',
    settings: {
      outputMode: 'hash',
      hashSyntax: 'symbols',
      stringQuote: 'single',
      addFrozenStringLiteral: true,
    },
  },
  {
    id: 'classic-hash',
    name: 'Classic Hash',
    description: 'Hashrocket syntax for compatibility',
    icon: 'fa-history',
    settings: {
      outputMode: 'hash',
      hashSyntax: 'rockets',
      stringQuote: 'double',
      addFrozenStringLiteral: false,
    },
  },
  {
    id: 'poro-class',
    name: 'PORO Class',
    description: 'Plain Old Ruby Object class',
    icon: 'fa-cube',
    settings: {
      outputMode: 'class',
      generateAccessors: true,
      generateInitialize: true,
      generateToJson: true,
      generateFromJson: true,
    },
  },
  {
    id: 'struct',
    name: 'Struct',
    description: 'Ruby Struct with keyword_init',
    icon: 'fa-boxes',
    settings: {
      outputMode: 'struct',
      generateToJson: true,
    },
  },
  {
    id: 'data-class',
    name: 'Data Class',
    description: 'Ruby 3.2+ Data.define',
    icon: 'fa-database',
    settings: {
      outputMode: 'data',
    },
  },
  {
    id: 'rails-style',
    name: 'Rails Style',
    description: 'Ruby on Rails conventions',
    icon: 'fa-train',
    settings: {
      outputMode: 'class',
      hashSyntax: 'symbols',
      stringQuote: 'single',
      generateAccessors: true,
      generateInitialize: true,
      addFrozenStringLiteral: true,
    },
  },
];

export function applyPreset(current: RubyGeneratorSettings, presetId: string): RubyGeneratorSettings {
  const preset = RUBY_PRESETS.find(p => p.id === presetId);
  if (!preset) return current;
  return { ...current, ...preset.settings };
}

export function getPresetById(presetId: string): RubyPreset | undefined {
  return RUBY_PRESETS.find(p => p.id === presetId);
}
