/**
 * Preset configurations for JSON to Objective-C converter
 */

import type { ObjCPreset } from './types';

export const OBJC_PRESETS: ObjCPreset[] = [
  {
    id: 'modern-arc',
    name: 'Modern ARC',
    description: 'Modern Objective-C with ARC and nullability',
    settings: {
      memoryManagement: 'arc',
      useNullabilityAnnotations: true,
      generateInitWithDictionary: true,
      generateToDictionary: true,
    },
  },
  {
    id: 'nscoding',
    name: 'NSCoding',
    description: 'With NSCoding protocol conformance',
    settings: {
      memoryManagement: 'arc',
      conformToNSCoding: true,
      conformToNSSecureCoding: true,
      generateInitWithDictionary: true,
      generateToDictionary: true,
    },
  },
  {
    id: 'header-only',
    name: 'Header Only',
    description: 'Generate header file only',
    settings: {
      outputFormat: 'header-only',
      useNullabilityAnnotations: true,
    },
  },
  {
    id: 'immutable',
    name: 'Immutable',
    description: 'Readonly properties for immutable objects',
    settings: {
      useReadonlyProperties: true,
      memoryManagement: 'arc',
      generateInitWithDictionary: true,
    },
  },
  {
    id: 'legacy',
    name: 'Legacy (MRC)',
    description: 'Manual reference counting for legacy projects',
    settings: {
      memoryManagement: 'mrc',
      useNullabilityAnnotations: false,
      generateInitWithDictionary: true,
      generateToDictionary: true,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Properties only, no methods',
    settings: {
      generateInitWithDictionary: false,
      generateToDictionary: false,
      generateDescription: false,
    },
  },
];
