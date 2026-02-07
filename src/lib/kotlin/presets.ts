/**
 * Kotlin Generator Presets
 */

import type { KotlinGeneratorSettings } from './types';
import { DEFAULT_KOTLIN_SETTINGS } from './types';

export interface KotlinPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<KotlinGeneratorSettings>;
}

export const KOTLIN_PRESETS: KotlinPreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard data class without serialization',
    settings: {
      ...DEFAULT_KOTLIN_SETTINGS,
    },
  },
  {
    id: 'kotlinx-serialization',
    name: 'Kotlinx Serialization',
    description: 'Data classes with @Serializable annotations',
    settings: {
      useDataClass: true,
      serializationLibrary: 'kotlinx',
      addSerialNames: true,
      addImports: true,
    },
  },
  {
    id: 'gson',
    name: 'Gson',
    description: 'Data classes with @SerializedName annotations',
    settings: {
      useDataClass: true,
      serializationLibrary: 'gson',
      addSerialNames: true,
      addImports: true,
    },
  },
  {
    id: 'moshi',
    name: 'Moshi',
    description: 'Data classes with @Json and @JsonClass annotations',
    settings: {
      useDataClass: true,
      serializationLibrary: 'moshi',
      addSerialNames: true,
      addImports: true,
    },
  },
  {
    id: 'jackson',
    name: 'Jackson',
    description: 'Data classes with @JsonProperty annotations',
    settings: {
      useDataClass: true,
      serializationLibrary: 'jackson',
      addSerialNames: true,
      addImports: true,
    },
  },
  {
    id: 'android-parcelable',
    name: 'Android Parcelize',
    description: 'Parcelable data classes for Android',
    settings: {
      useDataClass: true,
      generateParcelize: true,
      serializationLibrary: 'kotlinx',
      addSerialNames: true,
      addImports: true,
    },
  },
  {
    id: 'nullable',
    name: 'Nullable Properties',
    description: 'All properties nullable with default null',
    settings: {
      useDataClass: true,
      makePropertiesNullable: true,
      addDefaultValues: true,
    },
  },
  {
    id: 'documented',
    name: 'Documented',
    description: 'Add KDoc comments to classes',
    settings: {
      useDataClass: true,
      addKDoc: true,
    },
  },
  {
    id: 'mutable',
    name: 'Mutable (var)',
    description: 'Use var instead of val for mutable properties',
    settings: {
      useDataClass: true,
      useValProperties: false,
    },
  },
];

/**
 * Get a preset by ID
 */
export function getPresetById(id: string): KotlinPreset | undefined {
  return KOTLIN_PRESETS.find((preset) => preset.id === id);
}

/**
 * Apply a preset to current settings
 */
export function applyPreset(
  currentSettings: KotlinGeneratorSettings,
  presetId: string
): KotlinGeneratorSettings {
  const preset = getPresetById(presetId);
  if (!preset) {
    return currentSettings;
  }

  return {
    ...currentSettings,
    ...preset.settings,
  };
}
