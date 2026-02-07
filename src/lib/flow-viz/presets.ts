/**
 * Flow Visualization Presets
 * Pre-configured settings for common use cases
 */

import type { FlowPreset, FlowSettings } from './types';
import { DEFAULT_FLOW_SETTINGS } from './types';

export const FLOW_PRESETS: FlowPreset[] = [
  {
    id: 'overview',
    name: 'Overview',
    description: 'High-level structure view',
    icon: 'fa-eye',
    settings: {
      maxDepth: 3,
      showTypes: true,
      showValues: false,
      collapsedByDefault: true,
    },
  },
  {
    id: 'detailed',
    name: 'Detailed',
    description: 'Full structure with all values',
    icon: 'fa-search',
    settings: {
      maxDepth: 10,
      showTypes: true,
      showValues: true,
      showPath: true,
      collapsedByDefault: false,
    },
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Minimal spacing for dense data',
    icon: 'fa-compress',
    settings: {
      nodeSpacingX: 150,
      nodeSpacingY: 60,
      showTypes: false,
      showPath: false,
    },
  },
  {
    id: 'colorful',
    name: 'Colorful',
    description: 'Vibrant color-coded nodes',
    icon: 'fa-palette',
    settings: {
      theme: 'colorful',
      showTypes: true,
      animateEdges: true,
    },
  },
  {
    id: 'horizontal',
    name: 'Horizontal',
    description: 'Left-to-right flow layout',
    icon: 'fa-arrows-alt-h',
    settings: {
      layout: 'horizontal',
      nodeSpacingX: 250,
      nodeSpacingY: 80,
    },
  },
  {
    id: 'animated',
    name: 'Animated',
    description: 'Animated edges for data flow',
    icon: 'fa-play',
    settings: {
      animateEdges: true,
      showTypes: true,
    },
  },
];

/**
 * Apply preset to current settings
 */
export function applyFlowPreset(
  currentSettings: FlowSettings,
  presetId: string
): FlowSettings {
  const preset = FLOW_PRESETS.find((p) => p.id === presetId);
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
export function getFlowPresetById(presetId: string): FlowPreset | undefined {
  return FLOW_PRESETS.find((p) => p.id === presetId);
}

/**
 * Reset to default settings
 */
export function getDefaultFlowSettings(): FlowSettings {
  return { ...DEFAULT_FLOW_SETTINGS };
}
