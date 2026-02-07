/**
 * Excel Export Presets - Pre-configured export options
 */

import type { ExcelExportSettings, ExportPreset } from './types';
import { DEFAULT_EXPORT_SETTINGS, EXPORT_PRESETS } from './types';

// ============================================================================
// Preset Functions
// ============================================================================

/**
 * Get all available presets
 */
export function getAllPresets(): ExportPreset[] {
  return EXPORT_PRESETS;
}

/**
 * Get preset by ID
 */
export function getPresetById(id: string): ExportPreset | undefined {
  return EXPORT_PRESETS.find(p => p.id === id);
}

/**
 * Apply preset to current settings
 */
export function applyPreset(
  currentSettings: ExcelExportSettings,
  presetId: string
): ExcelExportSettings {
  const preset = getPresetById(presetId);
  if (!preset) return currentSettings;
  
  return {
    ...currentSettings,
    ...preset.settings,
  };
}

/**
 * Get default settings
 */
export function getDefaultSettings(): ExcelExportSettings {
  return { ...DEFAULT_EXPORT_SETTINGS };
}

/**
 * Create custom preset
 */
export function createCustomPreset(
  id: string,
  name: string,
  description: string,
  settings: Partial<ExcelExportSettings>
): ExportPreset {
  return {
    id,
    name,
    description,
    icon: 'fas fa-cog',
    settings,
  };
}

/**
 * Suggest preset based on data characteristics
 */
export function suggestPreset(
  rowCount: number,
  columnCount: number,
  hasNestedObjects: boolean
): string {
  // Large datasets - suggest simple for performance
  if (rowCount > 10000) {
    return 'simple';
  }
  
  // Complex nested data - suggest full featured
  if (hasNestedObjects && columnCount > 10) {
    return 'full-featured';
  }
  
  // Default to simple
  return 'simple';
}

/**
 * Validate preset settings
 */
export function validatePresetSettings(settings: Partial<ExcelExportSettings>): boolean {
  // Check format
  if (settings.format !== undefined) {
    const validFormats = ['xlsx', 'xls', 'csv'];
    if (!validFormats.includes(settings.format)) {
      return false;
    }
  }
  
  // Check flatten depth
  if (settings.flattenDepth !== undefined) {
    if (settings.flattenDepth < 1 || settings.flattenDepth > 10) {
      return false;
    }
  }
  
  // Check sheet name
  if (settings.sheetName !== undefined) {
    if (settings.sheetName.length === 0 || settings.sheetName.length > 31) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get preset description for UI
 */
export function getPresetDescription(presetId: string): string {
  const preset = getPresetById(presetId);
  if (!preset) return '';
  
  const features: string[] = [];
  
  if (preset.settings.format) {
    features.push(preset.settings.format.toUpperCase());
  }
  
  if (preset.settings.boldHeaders) {
    features.push('bold headers');
  }
  
  if (preset.settings.freezeHeaders) {
    features.push('frozen header');
  }
  
  if (preset.settings.enableAutoFilter) {
    features.push('auto-filter');
  }
  
  return features.length > 0 ? `(${features.join(', ')})` : '';
}

/**
 * Get presets for quick access
 */
export function getQuickAccessPresets(): ExportPreset[] {
  return EXPORT_PRESETS.filter(p => 
    ['simple', 'full-featured', 'csv-export'].includes(p.id)
  );
}
