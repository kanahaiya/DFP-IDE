/**
 * JSON Merge Library - Public API
 */

// Types
export type {
  MergeStrategy,
  DuplicateKeyStrategy,
  ArrayOrdering,
  NullHandling,
  IndentationType,
  MergeSettings,
  MergeInput,
  ValidationError,
  MergeConflict,
  MergeStats,
  MergeResult,
  ExportSettings,
  MergePreset,
  JsonPrimitive,
  JsonValue,
  JsonObject,
  JsonArray,
} from './types';

// Constants
export {
  DEFAULT_MERGE_SETTINGS,
  DEFAULT_EXPORT_SETTINGS,
  MERGE_PRESETS,
  isPlainObject,
  isArray,
  isPrimitive,
  getJsonType,
} from './types';

// Merge functions
export { mergeJSON } from './merger';

// Validation
export {
  validateJSON,
  validateAllInputs,
  isValidJSON,
  getSyntaxSuggestion,
} from './validator';
export type { ValidationResult } from './validator';

// Export utilities
export {
  formatOutput,
  exportToFile,
  copyToClipboard,
  getCharCount,
  getLineCount,
  getByteSize,
  formatByteSize,
  createPreview,
  isValidIndentation,
  getIndentationName,
} from './exporter';
