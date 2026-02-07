/**
 * JMESPath Library
 * Public API exports for JMESPath query tester functionality
 */

// Types
export type {
  JMESPathSettings,
  JMESPathResult,
  QueryHistoryItem,
  JMESPathPreset,
  JMESPathExample,
  SyntaxReference,
  ResultFormat,
} from './types';

export {
  DEFAULT_JMESPATH_SETTINGS,
  JMESPATH_SYNTAX,
  JMESPATH_FUNCTIONS,
} from './types';

// Executor
export {
  executeJMESPath,
  parseJSON,
  validateQuery,
  formatResultValue,
  resultToTable,
  isEmptyResult,
} from './executor';

// Presets
export {
  JMESPATH_PRESETS,
  applyJMESPathPreset,
  getJMESPathPreset,
} from './presets';

// Examples
export {
  JMESPATH_EXAMPLES,
  getJMESPathExample,
  getJMESPathExamplesByCategory,
  getJMESPathCategories,
} from './examples';
