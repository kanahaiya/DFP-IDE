/**
 * JSON Editor Type Definitions
 * Core types for the visual JSON tree editor
 */

/**
 * JSON value types
 */
export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonObject 
  | JsonArray;

export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

/**
 * Node types in the tree
 */
export type NodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

/**
 * Tree node representation
 */
export interface TreeNode {
  id: string;
  key: string;
  value: JsonValue;
  type: NodeType;
  path: string[];
  depth: number;
  parentId: string | null;
  childrenIds: string[];
  isExpanded: boolean;
  isEditing: boolean;
  isSelected: boolean;
}

/**
 * Flattened tree structure for efficient rendering
 */
export interface FlattenedTree {
  nodes: Map<string, TreeNode>;
  rootId: string;
  visibleNodeIds: string[];
}

/**
 * Editor mode
 */
export type EditorMode = 'tree' | 'code';

/**
 * Validation error
 */
export interface EditorValidationError {
  path: string[];
  type: 'syntax' | 'type' | 'duplicate' | 'schema' | 'structure';
  message: string;
  suggestion?: string;
  line?: number;
  column?: number;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: EditorValidationError[];
  warnings: EditorValidationError[];
}

/**
 * Editor settings
 */
export interface EditorSettings {
  // Display settings
  indentSize: number;
  showLineNumbers: boolean;
  showTypes: boolean;
  showPath: boolean;
  
  // Editing settings
  autoValidate: boolean;
  validateOnBlur: boolean;
  confirmDelete: boolean;
  
  // Performance settings
  maxHistorySize: number;
  virtualScrollThreshold: number;
  debounceMs: number;
  
  // JSON options
  parseMode: 'strict' | 'lenient';
  allowComments: boolean;
  allowTrailingCommas: boolean;
}

/**
 * Default editor settings
 */
export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  indentSize: 2,
  showLineNumbers: true,
  showTypes: true,
  showPath: true,
  autoValidate: true,
  validateOnBlur: true,
  confirmDelete: true,
  maxHistorySize: 50,
  virtualScrollThreshold: 1000,
  debounceMs: 300,
  parseMode: 'strict',
  allowComments: false,
  allowTrailingCommas: false,
};

/**
 * History action for undo/redo
 */
export interface HistoryAction {
  id: string;
  timestamp: number;
  type: 'setValue' | 'setKey' | 'addProperty' | 'deleteProperty' | 'moveProperty' | 'paste' | 'import';
  description: string;
  previousState: JsonValue;
  newState: JsonValue;
  path: string[];
}

/**
 * History state
 */
export interface HistoryState {
  past: HistoryAction[];
  future: HistoryAction[];
  currentIndex: number;
}

/**
 * Clipboard data
 */
export interface ClipboardData {
  type: 'node' | 'value';
  key?: string;
  value: JsonValue;
  nodeType: NodeType;
}

/**
 * Search options
 */
export interface SearchOptions {
  query: string;
  matchCase: boolean;
  matchWholeWord: boolean;
  searchKeys: boolean;
  searchValues: boolean;
  useRegex: boolean;
}

/**
 * Search result
 */
export interface SearchResult {
  nodeId: string;
  path: string[];
  matchType: 'key' | 'value';
  matchText: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Context menu action
 */
export interface ContextMenuAction {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  action?: () => void;
  submenu?: ContextMenuAction[];
}

/**
 * Node statistics
 */
export interface NodeStats {
  totalNodes: number;
  objectCount: number;
  arrayCount: number;
  stringCount: number;
  numberCount: number;
  booleanCount: number;
  nullCount: number;
  maxDepth: number;
  fileSize: number;
}

/**
 * Import/Export format
 */
export type ImportExportFormat = 'json' | 'json5';

/**
 * Export options
 */
export interface ExportOptions {
  format: ImportExportFormat;
  minified: boolean;
  indentSize: number;
  sortKeys: boolean;
}
