/**
 * Swift generator presets
 */

import type { SwiftPreset } from './types';

export const SWIFT_PRESETS: SwiftPreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard Codable struct with CodingKeys',
    settings: {
      outputType: 'struct',
      codableOption: 'codable',
      generateCodingKeys: true,
      useVar: false,
      markOptional: true,
      indentation: 4,
    }
  },
  {
    id: 'swiftui',
    name: 'SwiftUI Model',
    description: 'Observable class for SwiftUI with @Published',
    settings: {
      outputType: 'class',
      codableOption: 'codable',
      generateCodingKeys: true,
      useVar: true,
      markOptional: true,
      addPublished: true,
      indentation: 4,
    }
  },
  {
    id: 'api-client',
    name: 'API Client',
    description: 'Decodable structs for API responses',
    settings: {
      outputType: 'struct',
      accessModifier: 'public',
      codableOption: 'decodable',
      generateCodingKeys: true,
      useVar: false,
      markOptional: true,
      indentation: 4,
    }
  },
  {
    id: 'data-model',
    name: 'Data Model',
    description: 'Full-featured class with init method',
    settings: {
      outputType: 'finalClass',
      codableOption: 'codable',
      generateCodingKeys: true,
      useVar: true,
      markOptional: true,
      generateInit: true,
      indentation: 4,
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple struct without Codable',
    settings: {
      outputType: 'struct',
      codableOption: 'none',
      generateCodingKeys: false,
      useVar: false,
      markOptional: true,
      indentation: 4,
    }
  },
];

/**
 * Get preset by ID
 */
export function getSwiftPreset(id: string): SwiftPreset | undefined {
  return SWIFT_PRESETS.find(p => p.id === id);
}
