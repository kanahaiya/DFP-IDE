/**
 * Avro Generator Presets
 * Pre-configured settings for common use cases
 */

import type { AvroPreset, AvroGeneratorSettings } from './types';
import { DEFAULT_AVRO_SETTINGS } from './types';

export const AVRO_PRESETS: AvroPreset[] = [
  {
    id: 'kafka-standard',
    name: 'Kafka Standard',
    description: 'Optimized for Apache Kafka with Schema Registry',
    icon: 'fa-stream',
    settings: {
      namespace: 'com.kafka.events',
      useSnakeCase: true,
      useUnionForNullable: true,
      inferLogicalTypes: true,
    },
  },
  {
    id: 'spark-compatible',
    name: 'Spark Compatible',
    description: 'Compatible with Apache Spark DataFrames',
    icon: 'fa-bolt',
    settings: {
      useSnakeCase: true,
      useUnionForNullable: true,
      inferLogicalTypes: true,
      includeDefaults: true,
    },
  },
  {
    id: 'bigquery-export',
    name: 'BigQuery Export',
    description: 'Optimized for Google BigQuery imports',
    icon: 'fa-database',
    settings: {
      namespace: 'com.google.bigquery',
      useSnakeCase: true,
      inferLogicalTypes: true,
      generateDoc: true,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal Schema',
    description: 'Minimal schema without extras',
    icon: 'fa-compress',
    settings: {
      namespace: '',
      useSnakeCase: false,
      generateDoc: false,
      inferLogicalTypes: false,
      includeDefaults: false,
    },
  },
  {
    id: 'documented',
    name: 'Fully Documented',
    description: 'Include all documentation fields',
    icon: 'fa-file-alt',
    settings: {
      generateDoc: true,
      useSnakeCase: true,
      inferLogicalTypes: true,
    },
  },
  {
    id: 'flink-streaming',
    name: 'Flink Streaming',
    description: 'Optimized for Apache Flink streaming',
    icon: 'fa-water',
    settings: {
      namespace: 'org.apache.flink',
      useSnakeCase: true,
      useUnionForNullable: true,
      inferLogicalTypes: true,
    },
  },
];

/**
 * Apply preset to current settings
 */
export function applyAvroPreset(
  currentSettings: AvroGeneratorSettings,
  presetId: string
): AvroGeneratorSettings {
  const preset = AVRO_PRESETS.find(p => p.id === presetId);
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
export function getAvroPresetById(presetId: string): AvroPreset | undefined {
  return AVRO_PRESETS.find(p => p.id === presetId);
}

/**
 * Reset to default settings
 */
export function getDefaultAvroSettings(): AvroGeneratorSettings {
  return { ...DEFAULT_AVRO_SETTINGS };
}
