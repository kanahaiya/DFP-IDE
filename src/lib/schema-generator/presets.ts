/**
 * Schema Generator Presets
 * Pre-configured settings for common use cases
 */

import type { SchemaGeneratorPreset, SchemaGeneratorSettings } from './types';

export const SCHEMA_GENERATOR_PRESETS: SchemaGeneratorPreset[] = [
  {
    id: 'json-schema-strict',
    name: 'JSON Schema (Strict)',
    description: 'JSON Schema 2020-12 with all required',
    icon: 'fa-file-code',
    settings: {
      format: 'json-schema-2020-12',
      makeAllRequired: true,
      inferFormats: true,
    },
  },
  {
    id: 'typescript-strict',
    name: 'TypeScript (Strict)',
    description: 'TypeScript interfaces with required fields',
    icon: 'fa-code',
    settings: {
      format: 'typescript-interface',
      makeAllRequired: true,
      sortProperties: true,
    },
  },
  {
    id: 'typescript-optional',
    name: 'TypeScript (Optional)',
    description: 'TypeScript with all optional fields',
    icon: 'fa-code',
    settings: {
      format: 'typescript-interface',
      makeAllOptional: true,
    },
  },
  {
    id: 'zod-validation',
    name: 'Zod (Runtime)',
    description: 'Zod schema for runtime validation',
    icon: 'fa-shield-alt',
    settings: {
      format: 'zod',
      inferFormats: true,
    },
  },
  {
    id: 'graphql-types',
    name: 'GraphQL Types',
    description: 'GraphQL type definitions',
    icon: 'fa-project-diagram',
    settings: {
      format: 'graphql',
      makeAllRequired: false,
    },
  },
  {
    id: 'rust-serde',
    name: 'Rust (Serde)',
    description: 'Rust structs with serde derive',
    icon: 'fa-cog',
    settings: {
      format: 'rust',
      sortProperties: true,
    },
  },
];

/**
 * Apply preset to current settings
 */
export function applySchemaGeneratorPreset(
  currentSettings: SchemaGeneratorSettings,
  presetId: string
): SchemaGeneratorSettings {
  const preset = SCHEMA_GENERATOR_PRESETS.find(p => p.id === presetId);
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
export function getSchemaGeneratorPresetById(presetId: string): SchemaGeneratorPreset | undefined {
  return SCHEMA_GENERATOR_PRESETS.find(p => p.id === presetId);
}
