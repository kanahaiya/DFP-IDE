/**
 * JSONPath Library
 * Public API exports for JSONPath tester functionality
 */

// Types
export type {
  JSONPathSettings,
  JSONPathResult,
  JSONPathMatch,
  QueryHistoryItem,
  JSONPathPreset,
  JSONPathExample,
  SyntaxReference,
  ResultFormat,
} from './types';

export {
  DEFAULT_JSONPATH_SETTINGS,
  JSONPATH_SYNTAX,
} from './types';

// Executor
export {
  executeJSONPath,
  parseJSON,
  validateQuery,
  formatResultValue,
  extractValues,
  matchesToTable,
} from './executor';

// Presets
export {
  JSONPATH_PRESETS,
  applyJSONPathPreset,
  getJSONPathPreset,
} from './presets';

// Examples
export {
  JSONPATH_EXAMPLES,
  getJSONPathExample,
  getJSONPathExamplesByCategory,
  getJSONPathCategories,
} from './examples';
