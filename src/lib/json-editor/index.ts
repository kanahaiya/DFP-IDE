/**
 * JSON Editor Library
 * Public API exports
 */

// Types
export * from './types';

// Path utilities
export {
  generateNodeId,
  pathToString,
  stringToPath,
  getValueAtPath,
  setValueAtPath,
  deleteAtPath,
  addPropertyAtPath,
  renameKeyAtPath,
  moveArrayItem,
  getNodeType,
  getDefaultValue,
  getTypeDisplayName,
  getTypeIcon,
  isValidKey,
  isPrimitive,
  countChildren,
  getParentPath,
  getKeyFromPath,
  isAncestor,
} from './pathUtils';

// Operations
export {
  buildTree,
  calculateVisibleNodes,
  toggleNodeExpansion,
  expandAllNodes,
  collapseAllNodes,
  selectNode,
  setNodeEditing,
  updateNodeValue,
  updateNodeKey,
  addNode,
  deleteNode,
  duplicateNode,
  moveNodeUp,
  moveNodeDown,
  changeNodeType,
  convertValue,
  getNodeStats,
} from './operations';

// Validator
export {
  parseJSON,
  validateJSON,
  validateJSONInput,
  isValidJSON,
  formatJSON,
  minifyJSON,
  autoFixJSON,
} from './validator';

// History
export {
  createHistoryState,
  recordAction,
  canUndo,
  canRedo,
  undo,
  redo,
  clearHistory,
  getActionDescription,
  getUndoStackSummary,
  getRedoStackSummary,
  estimateHistoryMemory,
  formatMemorySize,
  shouldTrimHistory,
  trimHistoryByMemory,
} from './history';

// Presets
export {
  EDITOR_PRESETS,
  getPreset,
  applyPreset,
  recommendPreset,
} from './presets';
export type { EditorPreset } from './presets';
