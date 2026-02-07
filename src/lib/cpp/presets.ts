import type { CppGeneratorSettings } from './types';

export interface CppPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<CppGeneratorSettings>;
}

export const CPP_PRESETS: CppPreset[] = [
  {
    id: 'nlohmann-modern',
    name: 'nlohmann Modern C++',
    description: 'C++17 with nlohmann/json, std::optional',
    icon: 'fa-rocket',
    settings: {
      library: 'nlohmann',
      cppStandard: 'cpp17',
      outputMode: 'struct',
      useOptional: true,
      generateConstructors: true,
      addSerializationMacros: true,
      headerGuardStyle: 'pragma',
    },
  },
  {
    id: 'rapidjson-perf',
    name: 'RapidJSON Performance',
    description: 'High-performance with RapidJSON',
    icon: 'fa-bolt',
    settings: {
      library: 'rapidjson',
      cppStandard: 'cpp11',
      outputMode: 'struct',
      useOptional: false,
      generateConstructors: true,
      addSerializationMacros: false,
    },
  },
  {
    id: 'boost-describe',
    name: 'Boost.JSON + Describe',
    description: 'Boost ecosystem with reflection',
    icon: 'fa-cogs',
    settings: {
      library: 'boost',
      cppStandard: 'cpp20',
      outputMode: 'struct',
      useOptional: true,
      addSerializationMacros: true,
    },
  },
  {
    id: 'legacy-cpp11',
    name: 'Legacy C++11',
    description: 'Compatible with older compilers',
    icon: 'fa-history',
    settings: {
      library: 'jsoncpp',
      cppStandard: 'cpp11',
      outputMode: 'class',
      useOptional: false,
      generateGettersSetters: true,
      headerGuardStyle: 'ifndef',
    },
  },
  {
    id: 'header-only',
    name: 'Header-Only',
    description: 'Single header file, easy integration',
    icon: 'fa-file-code',
    settings: {
      library: 'nlohmann',
      cppStandard: 'cpp17',
      outputMode: 'header-only',
      generateConstructors: true,
      addSerializationMacros: true,
      headerGuardStyle: 'pragma',
    },
  },
];

export function applyPreset(current: CppGeneratorSettings, presetId: string): CppGeneratorSettings {
  const preset = CPP_PRESETS.find(p => p.id === presetId);
  if (!preset) return current;
  return { ...current, ...preset.settings };
}

export function getPresetById(presetId: string): CppPreset | undefined {
  return CPP_PRESETS.find(p => p.id === presetId);
}
