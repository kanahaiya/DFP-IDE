/**
 * JSON Formatter Presets - Pre-configured formatting options
 */

import type { FormatterSettings, FormatterPreset } from './types';
import { DEFAULT_FORMATTER_SETTINGS, FORMATTER_PRESETS } from './types';

// ============================================================================
// Preset Functions
// ============================================================================

/**
 * Get all available presets
 */
export function getAllPresets(): FormatterPreset[] {
  return FORMATTER_PRESETS;
}

/**
 * Get preset by ID
 */
export function getPresetById(id: string): FormatterPreset | undefined {
  return FORMATTER_PRESETS.find(p => p.id === id);
}

/**
 * Apply preset to current settings
 */
export function applyPreset(
  currentSettings: FormatterSettings,
  presetId: string
): FormatterSettings {
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
export function getDefaultSettings(): FormatterSettings {
  return { ...DEFAULT_FORMATTER_SETTINGS };
}

/**
 * Create custom preset
 */
export function createCustomPreset(
  id: string,
  name: string,
  description: string,
  settings: Partial<FormatterSettings>
): FormatterPreset {
  return {
    id,
    name,
    description,
    icon: 'fas fa-cog',
    settings,
  };
}

/**
 * Suggest preset based on input characteristics
 */
export function suggestPreset(input: string): string {
  try {
    const parsed = JSON.parse(input);
    const str = JSON.stringify(parsed);
    
    // If already minified (no newlines), suggest readable
    if (!input.includes('\n') || input.trim().length === str.length) {
      return 'readable';
    }
    
    // If deeply nested, suggest expanded
    const depth = getMaxDepth(parsed);
    if (depth > 3) {
      return 'expanded';
    }
    
    // Check for nulls or empty values
    if (hasNullsOrEmpty(parsed)) {
      return 'clean';
    }
    
    return 'readable';
  } catch {
    return 'readable';
  }
}

/**
 * Get maximum nesting depth
 */
function getMaxDepth(data: unknown, currentDepth: number = 0): number {
  if (data === null || typeof data !== 'object') {
    return currentDepth;
  }
  
  let maxDepth = currentDepth;
  
  if (Array.isArray(data)) {
    for (const item of data) {
      maxDepth = Math.max(maxDepth, getMaxDepth(item, currentDepth + 1));
    }
  } else {
    for (const value of Object.values(data)) {
      maxDepth = Math.max(maxDepth, getMaxDepth(value, currentDepth + 1));
    }
  }
  
  return maxDepth;
}

/**
 * Check if data has nulls or empty values
 */
function hasNullsOrEmpty(data: unknown): boolean {
  if (data === null || data === '') return true;
  
  if (Array.isArray(data)) {
    if (data.length === 0) return true;
    return data.some(item => hasNullsOrEmpty(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const values = Object.values(data);
    if (values.length === 0) return true;
    return values.some(value => hasNullsOrEmpty(value));
  }
  
  return false;
}

/**
 * Validate preset settings
 */
export function validatePresetSettings(settings: Partial<FormatterSettings>): boolean {
  // Check indentation
  if (settings.indentation !== undefined) {
    const validIndentations = [2, 3, 4, 'tab'];
    if (!validIndentations.includes(settings.indentation)) {
      return false;
    }
  }
  
  // Check view mode
  if (settings.viewMode !== undefined) {
    const validModes = ['code', 'tree', 'split'];
    if (!validModes.includes(settings.viewMode)) {
      return false;
    }
  }
  
  // Check quote style
  if (settings.quoteStyle !== undefined) {
    const validStyles = ['double', 'single'];
    if (!validStyles.includes(settings.quoteStyle)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get presets for quick access bar
 */
export function getQuickAccessPresets(): FormatterPreset[] {
  return FORMATTER_PRESETS.filter(p => 
    ['readable', 'compact', 'sorted', 'clean'].includes(p.id)
  );
}

/**
 * Get preset description for UI
 */
export function getPresetDescription(presetId: string): string {
  const preset = getPresetById(presetId);
  if (!preset) return '';
  
  const settings: string[] = [];
  
  if (preset.settings.indentation) {
    const indent = preset.settings.indentation === 'tab' 
      ? 'tabs' 
      : `${preset.settings.indentation} spaces`;
    settings.push(indent);
  }
  
  if (preset.settings.sortKeys) {
    settings.push('sorted keys');
  }
  
  if (preset.settings.removeNulls) {
    settings.push('no nulls');
  }
  
  if (preset.settings.removeEmptyStrings) {
    settings.push('no empty strings');
  }
  
  return settings.length > 0 ? `(${settings.join(', ')})` : '';
}
