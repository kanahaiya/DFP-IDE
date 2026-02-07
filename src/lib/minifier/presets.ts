/**
 * Preset configurations for JSON Minifier tool
 */

import type { MinifierPreset, MinifierSettings } from './types';
import { MINIFIER_PRESETS, DEFAULT_MINIFIER_SETTINGS } from './types';

/**
 * Get all available presets
 */
export function getAllPresets(): MinifierPreset[] {
  return MINIFIER_PRESETS;
}

/**
 * Get preset by ID
 */
export function getPresetById(id: string): MinifierPreset | undefined {
  return MINIFIER_PRESETS.find(preset => preset.id === id);
}

/**
 * Apply preset to current settings
 */
export function applyPreset(
  currentSettings: MinifierSettings,
  presetId: string
): MinifierSettings {
  const preset = getPresetById(presetId);
  if (!preset) {
    return currentSettings;
  }
  
  return {
    ...currentSettings,
    ...preset.settings,
  };
}

/**
 * Get default settings
 */
export function getDefaultSettings(): MinifierSettings {
  return { ...DEFAULT_MINIFIER_SETTINGS };
}

/**
 * Create custom preset
 */
export function createCustomPreset(
  id: string,
  name: string,
  description: string,
  settings: Partial<MinifierSettings>
): MinifierPreset {
  return {
    id,
    name,
    description,
    icon: 'fas fa-cog',
    settings,
  };
}

/**
 * Get preset suggestions based on input characteristics
 */
export function suggestPreset(
  isMinified: boolean,
  hasNulls: boolean,
  size: number
): string {
  // If already minified, suggest beautify
  if (isMinified) {
    return 'readable';
  }
  
  // Large file with nulls - suggest compact clean
  if (size > 100000 && hasNulls) {
    return 'compact-clean';
  }
  
  // Default to production minify
  return 'production';
}

/**
 * Get presets by mode
 */
export function getPresetsByMode(mode: 'minify' | 'beautify'): MinifierPreset[] {
  return MINIFIER_PRESETS.filter(preset => preset.settings.mode === mode);
}

/**
 * Validate preset settings
 */
export function validatePresetSettings(
  settings: Partial<MinifierSettings>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (settings.indentation !== undefined) {
    const validIndents = [2, 3, 4, 'tab'];
    if (!validIndents.includes(settings.indentation)) {
      errors.push('Invalid indentation value');
    }
  }
  
  if (settings.mode !== undefined) {
    if (!['minify', 'beautify'].includes(settings.mode)) {
      errors.push('Invalid mode value');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
