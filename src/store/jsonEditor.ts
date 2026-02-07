/**
 * JSON Editor Zustand Store
 * State management with undo/redo support
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  JsonValue,
  EditorMode,
  EditorSettings,
  FlattenedTree,
  ValidationResult,
  ClipboardData,
  SearchOptions,
  SearchResult,
  HistoryState,
  NodeType,
} from '@/lib/json-editor/types';
import { DEFAULT_EDITOR_SETTINGS } from '@/lib/json-editor/types';
import {
  buildTree,
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
  getNodeStats,
} from '@/lib/json-editor/operations';
import {
  parseJSON,
  validateJSONInput,
  formatJSON,
  minifyJSON,
} from '@/lib/json-editor/validator';
import {
  createHistoryState,
  recordAction,
  canUndo,
  canRedo,
  undo,
  redo,
  clearHistory,
} from '@/lib/json-editor/history';
import { pathToString } from '@/lib/json-editor/pathUtils';
import { applyPreset } from '@/lib/json-editor/presets';

/**
 * Editor State Interface
 */
interface JSONEditorState {
  // Data
  data: JsonValue;
  rawInput: string;
  tree: FlattenedTree;
  
  // Mode
  mode: EditorMode;
  
  // Selection
  selectedNodeId: string | null;
  editingNodeId: string | null;
  
  // Validation
  validation: ValidationResult;
  
  // Clipboard
  clipboard: ClipboardData | null;
  
  // Search
  searchOptions: SearchOptions;
  searchResults: SearchResult[];
  currentSearchIndex: number;
  
  // History (undo/redo)
  history: HistoryState;
  
  // Settings
  settings: EditorSettings;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Statistics
  stats: ReturnType<typeof getNodeStats> | null;
  
  // Actions
  setRawInput: (input: string) => void;
  parseAndLoad: (input: string) => void;
  setData: (data: JsonValue, recordHistory?: boolean) => void;
  setMode: (mode: EditorMode) => void;
  
  // Node operations
  toggleExpansion: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  selectNode: (nodeId: string | null) => void;
  startEditing: (nodeId: string) => void;
  stopEditing: () => void;
  
  // Value operations
  setValue: (nodeId: string, value: JsonValue) => void;
  setKey: (nodeId: string, newKey: string) => void;
  addProperty: (parentNodeId: string, key: string, type: NodeType) => void;
  deleteProperty: (nodeId: string) => void;
  duplicateProperty: (nodeId: string) => void;
  moveUp: (nodeId: string) => void;
  moveDown: (nodeId: string) => void;
  changeType: (nodeId: string, newType: NodeType) => void;
  
  // Clipboard
  copy: (nodeId: string) => void;
  cut: (nodeId: string) => void;
  paste: (targetNodeId: string) => void;
  
  // Search
  setSearchOptions: (options: Partial<SearchOptions>) => void;
  search: () => void;
  nextResult: () => void;
  prevResult: () => void;
  clearSearch: () => void;
  
  // History
  undoAction: () => void;
  redoAction: () => void;
  clearHistoryState: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Settings
  updateSettings: (settings: Partial<EditorSettings>) => void;
  applyPreset: (presetId: string) => void;
  resetSettings: () => void;
  
  // Import/Export
  formatData: () => void;
  minifyData: () => void;
  
  // Utility
  reset: () => void;
  validate: () => void;
}

/**
 * Default JSON sample data
 */
const DEFAULT_DATA: JsonValue = {
  name: "JSON Editor",
  version: "1.0.0",
  description: "A visual JSON editor with tree view",
  features: [
    "Tree view editing",
    "In-place value editing",
    "Undo/Redo support",
    "Search functionality"
  ],
  settings: {
    theme: "dark",
    autoSave: true,
    fontSize: 14
  },
  active: true,
  count: 42
};

const DEFAULT_RAW_INPUT = JSON.stringify(DEFAULT_DATA, null, 2);

/**
 * Create initial search options
 */
const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  query: '',
  matchCase: false,
  matchWholeWord: false,
  searchKeys: true,
  searchValues: true,
  useRegex: false,
};

/**
 * JSON Editor Store
 */
export const useJSONEditorStore = create<JSONEditorState>()(
  persist(
    (set, get) => ({
      // Initial state
      data: DEFAULT_DATA,
      rawInput: DEFAULT_RAW_INPUT,
      tree: buildTree(DEFAULT_DATA),
      mode: 'tree',
      selectedNodeId: null,
      editingNodeId: null,
      validation: { isValid: true, errors: [], warnings: [] },
      clipboard: null,
      searchOptions: DEFAULT_SEARCH_OPTIONS,
      searchResults: [],
      currentSearchIndex: -1,
      history: createHistoryState(),
      settings: DEFAULT_EDITOR_SETTINGS,
      isLoading: false,
      error: null,
      stats: getNodeStats(DEFAULT_DATA),
      
      // Set raw input (for code view)
      setRawInput: (input: string) => {
        set({ rawInput: input });
        
        // Auto-validate if enabled
        const { settings } = get();
        if (settings.autoValidate) {
          const validation = validateJSONInput(input, settings);
          set({ validation });
        }
      },
      
      // Parse and load JSON from string
      parseAndLoad: (input: string) => {
        const { settings, data: previousData, history } = get();
        
        const { data, error } = parseJSON(input, settings);
        
        if (error) {
          set({
            validation: { isValid: false, errors: [error], warnings: [] },
            error: error.message,
          });
          return;
        }
        
        if (data === null) {
          set({
            validation: { isValid: true, errors: [], warnings: [] },
            error: null,
          });
          return;
        }
        
        const tree = buildTree(data);
        const stats = getNodeStats(data);
        
        // Record in history
        const newHistory = recordAction(
          history,
          'import',
          'Imported JSON data',
          previousData,
          data,
          [],
          settings.maxHistorySize
        );
        
        set({
          data,
          rawInput: input,
          tree,
          validation: { isValid: true, errors: [], warnings: [] },
          history: newHistory,
          stats,
          error: null,
          selectedNodeId: null,
          editingNodeId: null,
        });
      },
      
      // Set data directly
      setData: (data: JsonValue, recordHistory: boolean = true) => {
        const { history, settings, data: previousData } = get();
        
        const tree = buildTree(data);
        const rawInput = formatJSON(data, settings.indentSize);
        const stats = getNodeStats(data);
        
        let newHistory = history;
        if (recordHistory) {
          newHistory = recordAction(
            history,
            'setValue',
            'Updated data',
            previousData,
            data,
            [],
            settings.maxHistorySize
          );
        }
        
        set({
          data,
          rawInput,
          tree,
          history: newHistory,
          stats,
          error: null,
        });
      },
      
      // Set editor mode
      setMode: (mode: EditorMode) => {
        const { data, rawInput, settings } = get();
        
        // When switching from code to tree, parse the raw input
        if (mode === 'tree') {
          const { data: parsedData, error } = parseJSON(rawInput, settings);
          
          if (error) {
            set({
              validation: { isValid: false, errors: [error], warnings: [] },
              error: error.message,
            });
            return;
          }
          
          if (parsedData !== null) {
            const tree = buildTree(parsedData);
            const stats = getNodeStats(parsedData);
            set({
              mode,
              data: parsedData,
              tree,
              stats,
              validation: { isValid: true, errors: [], warnings: [] },
              error: null,
            });
            return;
          }
        }
        
        // When switching to code, format the data
        if (mode === 'code') {
          const formatted = formatJSON(data, settings.indentSize);
          set({
            mode,
            rawInput: formatted,
          });
          return;
        }
        
        set({ mode });
      },
      
      // Toggle node expansion
      toggleExpansion: (nodeId: string) => {
        const { tree } = get();
        const newTree = toggleNodeExpansion(tree, nodeId);
        set({ tree: newTree });
      },
      
      // Expand all nodes
      expandAll: () => {
        const { tree } = get();
        const newTree = expandAllNodes(tree);
        set({ tree: newTree });
      },
      
      // Collapse all nodes
      collapseAll: () => {
        const { tree } = get();
        const newTree = collapseAllNodes(tree);
        set({ tree: newTree });
      },
      
      // Select a node
      selectNode: (nodeId: string | null) => {
        const { tree } = get();
        const newTree = selectNode(tree, nodeId);
        set({ tree: newTree, selectedNodeId: nodeId });
      },
      
      // Start editing a node
      startEditing: (nodeId: string) => {
        const { tree } = get();
        const newTree = setNodeEditing(tree, nodeId, true);
        set({ tree: newTree, editingNodeId: nodeId });
      },
      
      // Stop editing
      stopEditing: () => {
        const { tree, editingNodeId } = get();
        if (editingNodeId) {
          const newTree = setNodeEditing(tree, editingNodeId, false);
          set({ tree: newTree, editingNodeId: null });
        }
      },
      
      // Set node value
      setValue: (nodeId: string, value: JsonValue) => {
        const { data, tree, history, settings } = get();
        const node = tree.nodes.get(nodeId);
        if (!node) return;
        
        const previousData = data;
        const result = updateNodeValue(data, tree, nodeId, value);
        
        const newHistory = recordAction(
          history,
          'setValue',
          `Changed value at ${pathToString(node.path)}`,
          previousData,
          result.data,
          node.path,
          settings.maxHistorySize
        );
        
        const stats = getNodeStats(result.data);
        const rawInput = formatJSON(result.data, settings.indentSize);
        
        set({
          data: result.data,
          tree: result.tree,
          rawInput,
          history: newHistory,
          stats,
          editingNodeId: null,
        });
      },
      
      // Set node key (rename)
      setKey: (nodeId: string, newKey: string) => {
        const { data, tree, history, settings } = get();
        const node = tree.nodes.get(nodeId);
        if (!node) return;
        
        const previousData = data;
        const result = updateNodeKey(data, tree, nodeId, newKey);
        
        const newHistory = recordAction(
          history,
          'setKey',
          `Renamed key at ${pathToString(node.path)}`,
          previousData,
          result.data,
          node.path,
          settings.maxHistorySize
        );
        
        const rawInput = formatJSON(result.data, settings.indentSize);
        
        set({
          data: result.data,
          tree: result.tree,
          rawInput,
          history: newHistory,
          editingNodeId: null,
        });
      },
      
      // Add property
      addProperty: (parentNodeId: string, key: string, type: NodeType) => {
        const { data, tree, history, settings } = get();
        const parentNode = tree.nodes.get(parentNodeId);
        if (!parentNode) return;
        
        const defaultValues: Record<NodeType, JsonValue> = {
          string: '',
          number: 0,
          boolean: false,
          null: null,
          object: {},
          array: [],
        };
        
        const previousData = data;
        const result = addNode(data, tree, parentNodeId, key, defaultValues[type]);
        
        const newHistory = recordAction(
          history,
          'addProperty',
          `Added ${key} at ${pathToString(parentNode.path)}`,
          previousData,
          result.data,
          [...parentNode.path, key],
          settings.maxHistorySize
        );
        
        const stats = getNodeStats(result.data);
        const rawInput = formatJSON(result.data, settings.indentSize);
        
        set({
          data: result.data,
          tree: result.tree,
          rawInput,
          history: newHistory,
          stats,
        });
      },
      
      // Delete property
      deleteProperty: (nodeId: string) => {
        const { data, tree, history, settings } = get();
        const node = tree.nodes.get(nodeId);
        if (!node) return;
        
        const previousData = data;
        const result = deleteNode(data, tree, nodeId);
        
        const newHistory = recordAction(
          history,
          'deleteProperty',
          `Deleted ${node.key} at ${pathToString(node.path)}`,
          previousData,
          result.data,
          node.path,
          settings.maxHistorySize
        );
        
        const stats = getNodeStats(result.data);
        const rawInput = formatJSON(result.data, settings.indentSize);
        
        set({
          data: result.data,
          tree: result.tree,
          rawInput,
          history: newHistory,
          stats,
          selectedNodeId: null,
        });
      },
      
      // Duplicate property
      duplicateProperty: (nodeId: string) => {
        const { data, tree, history, settings } = get();
        const node = tree.nodes.get(nodeId);
        if (!node) return;
        
        const previousData = data;
        const result = duplicateNode(data, tree, nodeId);
        
        const newHistory = recordAction(
          history,
          'addProperty',
          `Duplicated ${node.key}`,
          previousData,
          result.data,
          node.path,
          settings.maxHistorySize
        );
        
        const stats = getNodeStats(result.data);
        const rawInput = formatJSON(result.data, settings.indentSize);
        
        set({
          data: result.data,
          tree: result.tree,
          rawInput,
          history: newHistory,
          stats,
        });
      },
      
      // Move up
      moveUp: (nodeId: string) => {
        const { data, tree, history, settings } = get();
        const node = tree.nodes.get(nodeId);
        if (!node) return;
        
        const previousData = data;
        const result = moveNodeUp(data, tree, nodeId);
        
        if (result.data === data) return; // No change
        
        const newHistory = recordAction(
          history,
          'moveProperty',
          `Moved ${node.key} up`,
          previousData,
          result.data,
          node.path,
          settings.maxHistorySize
        );
        
        const rawInput = formatJSON(result.data, settings.indentSize);
        
        set({
          data: result.data,
          tree: result.tree,
          rawInput,
          history: newHistory,
        });
      },
      
      // Move down
      moveDown: (nodeId: string) => {
        const { data, tree, history, settings } = get();
        const node = tree.nodes.get(nodeId);
        if (!node) return;
        
        const previousData = data;
        const result = moveNodeDown(data, tree, nodeId);
        
        if (result.data === data) return; // No change
        
        const newHistory = recordAction(
          history,
          'moveProperty',
          `Moved ${node.key} down`,
          previousData,
          result.data,
          node.path,
          settings.maxHistorySize
        );
        
        const rawInput = formatJSON(result.data, settings.indentSize);
        
        set({
          data: result.data,
          tree: result.tree,
          rawInput,
          history: newHistory,
        });
      },
      
      // Change type
      changeType: (nodeId: string, newType: NodeType) => {
        const { data, tree, history, settings } = get();
        const node = tree.nodes.get(nodeId);
        if (!node) return;
        
        const previousData = data;
        const result = changeNodeType(data, tree, nodeId, newType);
        
        const newHistory = recordAction(
          history,
          'setValue',
          `Changed type to ${newType} at ${pathToString(node.path)}`,
          previousData,
          result.data,
          node.path,
          settings.maxHistorySize
        );
        
        const stats = getNodeStats(result.data);
        const rawInput = formatJSON(result.data, settings.indentSize);
        
        set({
          data: result.data,
          tree: result.tree,
          rawInput,
          history: newHistory,
          stats,
        });
      },
      
      // Copy node
      copy: (nodeId: string) => {
        const { tree } = get();
        const node = tree.nodes.get(nodeId);
        if (!node) return;
        
        const clipboardData: ClipboardData = {
          type: 'node',
          key: node.key,
          value: JSON.parse(JSON.stringify(node.value)),
          nodeType: node.type,
        };
        
        set({ clipboard: clipboardData });
      },
      
      // Cut node
      cut: (nodeId: string) => {
        const { tree } = get();
        const node = tree.nodes.get(nodeId);
        if (!node || node.path.length === 0) return; // Can't cut root
        
        // Copy first
        get().copy(nodeId);
        // Then delete
        get().deleteProperty(nodeId);
      },
      
      // Paste node
      paste: (targetNodeId: string) => {
        const { clipboard, tree } = get();
        if (!clipboard) return;
        
        const targetNode = tree.nodes.get(targetNodeId);
        if (!targetNode) return;
        
        // Can only paste into objects or arrays
        if (targetNode.type !== 'object' && targetNode.type !== 'array') return;
        
        const key = targetNode.type === 'array' 
          ? targetNode.childrenIds.length.toString()
          : clipboard.key || 'pasted';
        
        get().addProperty(targetNodeId, key, clipboard.nodeType);
        
        // Find the newly added node and set its value
        const { tree: newTree } = get();
        const newPath = [...targetNode.path, key];
        
        // Update the value of the pasted node
        newTree.nodes.forEach((node, id) => {
          if (pathToString(node.path) === pathToString(newPath)) {
            get().setValue(id, clipboard.value);
          }
        });
      },
      
      // Search options
      setSearchOptions: (options: Partial<SearchOptions>) => {
        set((state) => ({
          searchOptions: { ...state.searchOptions, ...options },
        }));
      },
      
      // Perform search
      search: () => {
        const { tree, searchOptions } = get();
        
        if (!searchOptions.query.trim()) {
          set({ searchResults: [], currentSearchIndex: -1 });
          return;
        }
        
        const results: SearchResult[] = [];
        const query = searchOptions.matchCase 
          ? searchOptions.query 
          : searchOptions.query.toLowerCase();
        
        tree.nodes.forEach((node) => {
          // Search keys
          if (searchOptions.searchKeys) {
            const key = searchOptions.matchCase ? node.key : node.key.toLowerCase();
            const index = key.indexOf(query);
            if (index !== -1) {
              results.push({
                nodeId: node.id,
                path: node.path,
                matchType: 'key',
                matchText: node.key,
                startIndex: index,
                endIndex: index + query.length,
              });
            }
          }
          
          // Search values (for primitives)
          if (searchOptions.searchValues && node.type !== 'object' && node.type !== 'array') {
            const valueStr = searchOptions.matchCase 
              ? String(node.value) 
              : String(node.value).toLowerCase();
            const index = valueStr.indexOf(query);
            if (index !== -1) {
              results.push({
                nodeId: node.id,
                path: node.path,
                matchType: 'value',
                matchText: String(node.value),
                startIndex: index,
                endIndex: index + query.length,
              });
            }
          }
        });
        
        set({ 
          searchResults: results, 
          currentSearchIndex: results.length > 0 ? 0 : -1 
        });
      },
      
      // Next search result
      nextResult: () => {
        const { searchResults, currentSearchIndex } = get();
        if (searchResults.length === 0) return;
        
        const newIndex = (currentSearchIndex + 1) % searchResults.length;
        set({ currentSearchIndex: newIndex });
        
        // Select and expand to the result
        const result = searchResults[newIndex];
        get().selectNode(result.nodeId);
      },
      
      // Previous search result
      prevResult: () => {
        const { searchResults, currentSearchIndex } = get();
        if (searchResults.length === 0) return;
        
        const newIndex = currentSearchIndex <= 0 
          ? searchResults.length - 1 
          : currentSearchIndex - 1;
        set({ currentSearchIndex: newIndex });
        
        // Select and expand to the result
        const result = searchResults[newIndex];
        get().selectNode(result.nodeId);
      },
      
      // Clear search
      clearSearch: () => {
        set({
          searchOptions: DEFAULT_SEARCH_OPTIONS,
          searchResults: [],
          currentSearchIndex: -1,
        });
      },
      
      // Undo
      undoAction: () => {
        const { history, settings } = get();
        const result = undo(history);
        
        if (result.action) {
          const data = result.action.previousState;
          const tree = buildTree(data);
          const stats = getNodeStats(data);
          const rawInput = formatJSON(data, settings.indentSize);
          
          set({
            data,
            tree,
            rawInput,
            history: result.history,
            stats,
          });
        }
      },
      
      // Redo
      redoAction: () => {
        const { history, settings } = get();
        const result = redo(history);
        
        if (result.action) {
          const data = result.action.newState;
          const tree = buildTree(data);
          const stats = getNodeStats(data);
          const rawInput = formatJSON(data, settings.indentSize);
          
          set({
            data,
            tree,
            rawInput,
            history: result.history,
            stats,
          });
        }
      },
      
      // Clear history
      clearHistoryState: () => {
        set({ history: clearHistory() });
      },
      
      // Can undo
      canUndo: () => canUndo(get().history),
      
      // Can redo
      canRedo: () => canRedo(get().history),
      
      // Update settings
      updateSettings: (newSettings: Partial<EditorSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      
      // Apply preset
      applyPreset: (presetId: string) => {
        const { settings } = get();
        const newSettings = applyPreset(settings, presetId);
        set({ settings: newSettings });
      },
      
      // Reset settings
      resetSettings: () => {
        set({ settings: DEFAULT_EDITOR_SETTINGS });
      },
      
      // Format data
      formatData: () => {
        const { data, settings } = get();
        const rawInput = formatJSON(data, settings.indentSize);
        set({ rawInput });
      },
      
      // Minify data
      minifyData: () => {
        const { data } = get();
        const rawInput = minifyJSON(data);
        set({ rawInput });
      },
      
      // Validate
      validate: () => {
        const { rawInput, settings } = get();
        const validation = validateJSONInput(rawInput, settings);
        set({ validation });
      },
      
      // Reset
      reset: () => {
        set({
          data: DEFAULT_DATA,
          rawInput: DEFAULT_RAW_INPUT,
          tree: buildTree(DEFAULT_DATA),
          mode: 'tree',
          selectedNodeId: null,
          editingNodeId: null,
          validation: { isValid: true, errors: [], warnings: [] },
          clipboard: null,
          searchOptions: DEFAULT_SEARCH_OPTIONS,
          searchResults: [],
          currentSearchIndex: -1,
          history: createHistoryState(),
          stats: getNodeStats(DEFAULT_DATA),
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'json-editor-store',
      partialize: (state) => ({
        settings: state.settings,
        // Don't persist data or history for privacy
      }),
    }
  )
);
