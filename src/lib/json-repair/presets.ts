/**
 * JSON Repair Presets
 * Pre-configured settings for different repair scenarios
 */

import type { RepairSettings, RepairMode } from './types';
import { DEFAULT_REPAIR_SETTINGS } from './types';

export interface RepairPreset {
  id: RepairMode;
  name: string;
  description: string;
  icon: string;
  settings: RepairSettings;
}

/**
 * Strict mode - Only fix obvious, safe errors
 * Best for: Production data where accuracy is critical
 */
const STRICT_SETTINGS: RepairSettings = {
  ...DEFAULT_REPAIR_SETTINGS,
  mode: 'strict',
  
  // Only fix the safest issues
  fixSingleQuotes: true,
  fixCurlyQuotes: true,
  addMissingQuotes: false, // Too risky
  
  fixTrailingCommas: true,
  fixMissingCommas: false, // Too risky
  fixMissingColons: false, // Too risky
  
  fixBrackets: false, // Too risky
  
  fixBooleans: true,
  fixNulls: true,
  fixUndefined: false,
  fixNaN: false,
  fixInfinity: false,
  
  removeComments: true,
  unwrapJSONP: false,
  fixMongoDB: false,
  fixEscapes: false,
  mergeStrings: false,
};

/**
 * Standard mode - Balance between safety and completeness
 * Best for: General JSON repair
 */
const STANDARD_SETTINGS: RepairSettings = {
  ...DEFAULT_REPAIR_SETTINGS,
  mode: 'standard',
};

/**
 * Lenient mode - Aggressive repair, fix everything possible
 * Best for: Severely broken JSON, manual editing errors
 */
const LENIENT_SETTINGS: RepairSettings = {
  ...DEFAULT_REPAIR_SETTINGS,
  mode: 'lenient',
  
  // Enable all fixes
  fixSingleQuotes: true,
  fixCurlyQuotes: true,
  addMissingQuotes: true,
  
  fixTrailingCommas: true,
  fixMissingCommas: true,
  fixMissingColons: true,
  
  fixBrackets: true,
  
  fixBooleans: true,
  fixNulls: true,
  fixUndefined: true,
  fixNaN: true,
  fixInfinity: true,
  
  removeComments: true,
  unwrapJSONP: true,
  fixMongoDB: true,
  fixEscapes: true,
  mergeStrings: true,
};

/**
 * LLM Output mode - Optimized for AI-generated JSON
 * Best for: ChatGPT, Claude, and other LLM outputs
 */
const LLM_SETTINGS: RepairSettings = {
  ...DEFAULT_REPAIR_SETTINGS,
  mode: 'llm',
  
  // Common LLM output issues
  fixSingleQuotes: true, // LLMs sometimes use single quotes
  fixCurlyQuotes: true, // Copy-paste from rich text
  addMissingQuotes: true, // LLMs sometimes forget quotes
  
  fixTrailingCommas: true, // LLMs often add trailing commas
  fixMissingCommas: true, // LLMs sometimes forget commas
  fixMissingColons: true,
  
  fixBrackets: true, // LLMs may truncate or miss brackets
  
  fixBooleans: true, // LLMs sometimes capitalize booleans
  fixNulls: true, // LLMs sometimes use NULL or None
  fixUndefined: true, // LLMs may use undefined
  fixNaN: false,
  fixInfinity: false,
  
  removeComments: true, // LLMs sometimes add comments
  unwrapJSONP: false,
  fixMongoDB: false,
  fixEscapes: true, // LLMs may have escape issues
  mergeStrings: true, // LLMs sometimes split strings
};

/**
 * All available presets
 */
export const REPAIR_PRESETS: RepairPreset[] = [
  {
    id: 'strict',
    name: 'Strict Mode',
    description: 'Safe fixes only. Best for production data.',
    icon: 'fas fa-shield-alt',
    settings: STRICT_SETTINGS,
  },
  {
    id: 'standard',
    name: 'Standard Mode',
    description: 'Balanced repair for general use.',
    icon: 'fas fa-balance-scale',
    settings: STANDARD_SETTINGS,
  },
  {
    id: 'lenient',
    name: 'Lenient Mode',
    description: 'Aggressive repair for broken JSON.',
    icon: 'fas fa-tools',
    settings: LENIENT_SETTINGS,
  },
  {
    id: 'llm',
    name: 'LLM Output Mode',
    description: 'Optimized for AI-generated JSON.',
    icon: 'fas fa-robot',
    settings: LLM_SETTINGS,
  },
];

/**
 * Get preset by ID
 */
export function getPreset(id: RepairMode): RepairPreset | undefined {
  return REPAIR_PRESETS.find(p => p.id === id);
}

/**
 * Apply preset to current settings
 */
export function applyPreset(
  currentSettings: RepairSettings,
  presetId: RepairMode
): RepairSettings {
  const preset = getPreset(presetId);
  if (!preset) return currentSettings;
  
  return {
    ...preset.settings,
    // Preserve user's output preferences
    formatOutput: currentSettings.formatOutput,
    indentation: currentSettings.indentation,
  };
}

/**
 * Get recommended preset based on input characteristics
 */
export function recommendPreset(input: string): RepairMode {
  // Check for LLM-like patterns
  const hasComments = /\/\/|\/\*/.test(input);
  const hasMarkdownCodeBlock = /```json?/.test(input);
  const hasTrailingCommas = /,\s*[}\]]/.test(input);
  const hasWrongBooleans = /\b(True|False)\b/.test(input);
  
  if (hasMarkdownCodeBlock || (hasComments && hasTrailingCommas)) {
    return 'llm';
  }
  
  // Check for MongoDB patterns
  const hasMongoDB = /(?:ObjectId|NumberLong|ISODate)\s*\(/.test(input);
  if (hasMongoDB) {
    return 'lenient';
  }
  
  // Check for severely broken JSON
  const openBraces = (input.match(/{/g) || []).length;
  const closeBraces = (input.match(/}/g) || []).length;
  const openBrackets = (input.match(/\[/g) || []).length;
  const closeBrackets = (input.match(/]/g) || []).length;
  
  if (Math.abs(openBraces - closeBraces) > 1 || Math.abs(openBrackets - closeBrackets) > 1) {
    return 'lenient';
  }
  
  // Check for simple issues
  const hasSingleQuotes = /'[^']*'/.test(input);
  const hasCurlyQuotes = /[""'']/.test(input);
  
  if ((hasSingleQuotes || hasCurlyQuotes || hasWrongBooleans) && !hasComments) {
    return 'strict';
  }
  
  // Default to standard
  return 'standard';
}

/**
 * Export index file
 */
export { STRICT_SETTINGS, STANDARD_SETTINGS, LENIENT_SETTINGS, LLM_SETTINGS };
