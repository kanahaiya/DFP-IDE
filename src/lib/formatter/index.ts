/**
 * JSON Formatter library public API
 */

// Types
export type {
  ViewMode,
  IndentationType,
  FormatterSettings,
  ErrorSeverity,
  ValidationError,
  ValidationResult,
  NodeType,
  TreeNode,
  TreeViewState,
  SizeMetrics,
  FormatStats,
  FormatResult,
  SortOrder,
  FilterCriteria,
  ManipulationOptions,
  FormatterPreset,
  JsonPrimitive,
  JsonValue,
  JsonObject,
  JsonArray,
} from './types';

// Constants
export {
  DEFAULT_FORMATTER_SETTINGS,
  FORMATTER_PRESETS,
  isPlainObject,
  isArray,
  isPrimitive,
  getNodeType,
} from './types';

// Formatter functions
export {
  formatJSON,
  minifyJSON,
  quickFormat,
  quickMinify,
  getByteSize,
  formatBytes,
  calculateSizeMetrics,
} from './formatter';

// Validator functions
export {
  validateJSON,
  isLikelyJSON,
  getLineCount,
  getCharacterCount,
  findMatchingBracket,
  getFixSuggestions,
  tryAutoFix,
} from './validator';

// Tree parser functions
export {
  parseJSONToTree,
  parseToTreeNode,
  resetNodeIdCounter,
  findNodeById,
  findNodeByPath,
  getAllNodeIds,
  toggleNodeExpansion,
  expandAll,
  collapseAll,
  expandToDepth,
  searchTree,
  getParentChain,
  getJSONPathDot,
  getJSONPathBracket,
  getValueAtPath,
  treeNodeToValue,
  treeToJSONString,
  getTreeStats,
} from './treeParser';

// Manipulator functions
export {
  DEFAULT_MANIPULATION_OPTIONS,
  sortObjectKeys,
  sortArrayValues,
  removeNulls,
  removeEmptyStrings,
  removeEmptyArrays,
  removeEmptyObjects,
  removeDuplicates,
  convertStringNumbers,
  trimStrings,
  filterData,
  manipulateJSON,
  escapeJSONStrings,
  unescapeJSONStrings,
} from './manipulator';

// Preset functions
export {
  getAllPresets,
  getPresetById,
  applyPreset,
  getDefaultSettings,
  createCustomPreset,
  suggestPreset,
  validatePresetSettings,
  getQuickAccessPresets,
  getPresetDescription,
} from './presets';
