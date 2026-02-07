/**
 * Go generator presets
 */

import type { GoPreset } from './types';

export const GO_PRESETS: GoPreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard Go structs with JSON tags',
    settings: {
      includeJsonTags: true,
      includeOmitempty: false,
      usePointerForNullable: false,
      inlineNestedStructs: false,
      indentation: 'tab',
    }
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Optimized for REST API response parsing',
    settings: {
      includeJsonTags: true,
      includeOmitempty: true,
      usePointerForNullable: true,
      inlineNestedStructs: false,
      indentation: 'tab',
      addComments: true,
    }
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'With BSON tags for MongoDB integration',
    settings: {
      includeJsonTags: true,
      includeBsonTags: true,
      includeOmitempty: true,
      usePointerForNullable: true,
      indentation: 'tab',
    }
  },
  {
    id: 'config',
    name: 'Config File',
    description: 'For configuration with JSON and YAML support',
    settings: {
      includeJsonTags: true,
      includeYamlTags: true,
      includeOmitempty: false,
      usePointerForNullable: false,
      indentation: 'tab',
      addComments: true,
    }
  },
  {
    id: 'xml-api',
    name: 'XML API',
    description: 'With XML tags for SOAP/XML API integration',
    settings: {
      includeJsonTags: true,
      includeXmlTags: true,
      includeOmitempty: false,
      usePointerForNullable: false,
      indentation: 'tab',
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean structs without tags',
    settings: {
      includeJsonTags: false,
      includeOmitempty: false,
      usePointerForNullable: false,
      inlineNestedStructs: false,
      indentation: 'tab',
    }
  },
];

/**
 * Get preset by ID
 */
export function getGoPreset(id: string): GoPreset | undefined {
  return GO_PRESETS.find(p => p.id === id);
}
