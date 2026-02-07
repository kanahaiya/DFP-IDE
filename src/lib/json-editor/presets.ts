/**
 * JSON Editor Presets
 * Predefined configurations for common use cases
 */

import type { EditorSettings } from './types';
import { DEFAULT_EDITOR_SETTINGS } from './types';

/**
 * Preset definition
 */
export interface EditorPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<EditorSettings>;
}

/**
 * Available presets
 */
export const EDITOR_PRESETS: EditorPreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard settings for most use cases',
    icon: 'fas fa-sliders-h',
    settings: DEFAULT_EDITOR_SETTINGS,
  },
  {
    id: 'strict',
    name: 'Strict JSON',
    description: 'RFC 8259 compliant, strict parsing',
    icon: 'fas fa-shield-alt',
    settings: {
      parseMode: 'strict',
      allowComments: false,
      allowTrailingCommas: false,
      autoValidate: true,
      confirmDelete: true,
    },
  },
  {
    id: 'lenient',
    name: 'Lenient',
    description: 'Allow comments and trailing commas',
    icon: 'fas fa-feather',
    settings: {
      parseMode: 'lenient',
      allowComments: true,
      allowTrailingCommas: true,
      autoValidate: true,
      confirmDelete: false,
    },
  },
  {
    id: 'compact',
    name: 'Compact View',
    description: 'Minimal UI, hide type indicators',
    icon: 'fas fa-compress',
    settings: {
      showTypes: false,
      showPath: false,
      showLineNumbers: false,
      indentSize: 2,
    },
  },
  {
    id: 'detailed',
    name: 'Detailed View',
    description: 'Show all information and indicators',
    icon: 'fas fa-info-circle',
    settings: {
      showTypes: true,
      showPath: true,
      showLineNumbers: true,
      indentSize: 2,
    },
  },
  {
    id: 'large-file',
    name: 'Large Files',
    description: 'Optimized for files with many nodes',
    icon: 'fas fa-file-code',
    settings: {
      virtualScrollThreshold: 500,
      debounceMs: 500,
      autoValidate: false,
      validateOnBlur: true,
      maxHistorySize: 20,
    },
  },
  {
    id: 'quick-edit',
    name: 'Quick Edit',
    description: 'Fast editing without confirmations',
    icon: 'fas fa-bolt',
    settings: {
      confirmDelete: false,
      autoValidate: true,
      validateOnBlur: false,
      debounceMs: 150,
    },
  },
  {
    id: 'config-files',
    name: 'Config Files',
    description: 'For editing configuration files (JSON5 support)',
    icon: 'fas fa-cog',
    settings: {
      parseMode: 'lenient',
      allowComments: true,
      allowTrailingCommas: true,
      indentSize: 2,
      showTypes: true,
    },
  },
];

/**
 * Get preset by ID
 */
export function getPreset(id: string): EditorPreset | undefined {
  return EDITOR_PRESETS.find((preset) => preset.id === id);
}

/**
 * Apply preset to current settings
 */
export function applyPreset(
  currentSettings: EditorSettings,
  presetId: string
): EditorSettings {
  const preset = getPreset(presetId);
  if (!preset) return currentSettings;
  
  return {
    ...currentSettings,
    ...preset.settings,
  };
}

/**
 * Get recommended preset based on data characteristics
 */
export function recommendPreset(
  nodeCount: number,
  maxDepth: number,
  hasComments: boolean = false
): string {
  // For very large files
  if (nodeCount > 1000) {
    return 'large-file';
  }
  
  // For files with comments
  if (hasComments) {
    return 'config-files';
  }
  
  // For deeply nested files
  if (maxDepth > 5) {
    return 'detailed';
  }
  
  // Default
  return 'default';
}
