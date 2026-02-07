/**
 * Preset configurations for JSON to C# converter
 */

import type { CSharpPreset } from './types';

export const CSHARP_PRESETS: CSharpPreset[] = [
  {
    id: 'newtonsoft-modern',
    name: 'Newtonsoft (Modern)',
    description: 'Json.NET with modern C# features',
    settings: {
      serializerLibrary: 'newtonsoft',
      addJsonPropertyAttributes: true,
      useNullableTypes: true,
      fileScopedNamespace: true,
      useInitOnlySetters: true,
    },
  },
  {
    id: 'system-text-json',
    name: 'System.Text.Json',
    description: 'Built-in .NET JSON serializer',
    settings: {
      serializerLibrary: 'system.text.json',
      addJsonPropertyAttributes: true,
      useNullableTypes: true,
      fileScopedNamespace: true,
    },
  },
  {
    id: 'plain-classes',
    name: 'Plain Classes',
    description: 'No JSON attributes',
    settings: {
      serializerLibrary: 'none',
      addJsonPropertyAttributes: false,
      useNullableTypes: false,
      fileScopedNamespace: true,
    },
  },
  {
    id: 'records',
    name: 'C# Records',
    description: 'Modern record types (C# 9+)',
    settings: {
      serializerLibrary: 'system.text.json',
      addJsonPropertyAttributes: true,
      useRecords: true,
      usePrimaryConstructor: true,
      useNullableTypes: true,
      fileScopedNamespace: true,
    },
  },
  {
    id: 'immutable',
    name: 'Immutable',
    description: 'Init-only setters for immutability',
    settings: {
      serializerLibrary: 'newtonsoft',
      addJsonPropertyAttributes: true,
      useNullableTypes: true,
      useInitOnlySetters: true,
      sealClasses: true,
      fileScopedNamespace: true,
    },
  },
  {
    id: 'legacy',
    name: 'Legacy (.NET Framework)',
    description: 'Compatible with older .NET versions',
    settings: {
      serializerLibrary: 'newtonsoft',
      addJsonPropertyAttributes: true,
      useNullableTypes: false,
      fileScopedNamespace: false,
      useInitOnlySetters: false,
      useRecords: false,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Bare minimum, no extras',
    settings: {
      serializerLibrary: 'none',
      addJsonPropertyAttributes: false,
      useNullableTypes: false,
      fileScopedNamespace: true,
      useRecords: false,
    },
  },
];
