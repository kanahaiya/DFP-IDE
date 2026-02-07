/**
 * Parquet Generator Presets
 * Pre-configured settings for common use cases
 */

import type { ParquetPreset, ParquetGeneratorSettings } from './types';
import { DEFAULT_PARQUET_SETTINGS } from './types';

export const PARQUET_PRESETS: ParquetPreset[] = [
  {
    id: 'analytics',
    name: 'Analytics Optimized',
    description: 'Best for analytical queries with high compression',
    icon: 'fa-chart-line',
    settings: {
      compression: 'ZSTD',
      rowGroupSize: 100000,
      useDictionaryEncoding: true,
    },
  },
  {
    id: 'streaming',
    name: 'Streaming Data',
    description: 'Optimized for real-time streaming workloads',
    icon: 'fa-stream',
    settings: {
      compression: 'SNAPPY',
      rowGroupSize: 10000,
      useDictionaryEncoding: false,
    },
  },
  {
    id: 'archive',
    name: 'Archive Storage',
    description: 'Maximum compression for cold storage',
    icon: 'fa-archive',
    settings: {
      compression: 'GZIP',
      rowGroupSize: 1000000,
      useDictionaryEncoding: true,
    },
  },
  {
    id: 'fast-read',
    name: 'Fast Read',
    description: 'Optimized for fast query performance',
    icon: 'fa-bolt',
    settings: {
      compression: 'LZ4',
      rowGroupSize: 50000,
      useDictionaryEncoding: true,
    },
  },
  {
    id: 'uncompressed',
    name: 'No Compression',
    description: 'Fastest write, no compression overhead',
    icon: 'fa-file',
    settings: {
      compression: 'UNCOMPRESSED',
      rowGroupSize: 100000,
      useDictionaryEncoding: false,
    },
  },
  {
    id: 'spark-default',
    name: 'Spark Default',
    description: 'Apache Spark default settings',
    icon: 'fa-fire',
    settings: {
      compression: 'SNAPPY',
      rowGroupSize: 134217728,
      useDictionaryEncoding: true,
      pageSize: 1048576,
    },
  },
];

/**
 * Apply preset to current settings
 */
export function applyParquetPreset(
  currentSettings: ParquetGeneratorSettings,
  presetId: string
): ParquetGeneratorSettings {
  const preset = PARQUET_PRESETS.find((p) => p.id === presetId);
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
export function getParquetPresetById(presetId: string): ParquetPreset | undefined {
  return PARQUET_PRESETS.find((p) => p.id === presetId);
}

/**
 * Reset to default settings
 */
export function getDefaultParquetSettings(): ParquetGeneratorSettings {
  return { ...DEFAULT_PARQUET_SETTINGS };
}
