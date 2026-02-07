'use client';

import { create } from 'zustand';
import type {
  FormatterSettings,
  FormatResult,
  ValidationError,
  FormatStats,
  TreeNode,
  ViewMode,
} from '@/lib/formatter/types';
import {
  DEFAULT_FORMATTER_SETTINGS,
  FORMATTER_PRESETS,
} from '@/lib/formatter/types';
import { formatJSON, minifyJSON } from '@/lib/formatter/formatter';
import { validateJSON } from '@/lib/formatter/validator';
import { parseJSONToTree, expandAll, collapseAll, expandToDepth } from '@/lib/formatter/treeParser';

// ============================================================================
// State Interface
// ============================================================================

interface JsonFormatterState {
  // Input/Output
  input: string;
  output: string;
  
  // Result
  result: FormatResult | null;
  
  // Settings
  settings: FormatterSettings;
  
  // Validation
  errors: ValidationError[];
  isValid: boolean;
  
  // Stats
  stats: FormatStats | null;
  
  // Tree View
  treeRoot: TreeNode | null;
  expandedNodes: Set<string>;
  selectedNodeId: string | null;
  searchQuery: string;
  matchedNodeIds: string[];
  currentMatchIndex: number;
  
  // UI State
  isProcessing: boolean;
  activeTab: 'format' | 'clean' | 'presets' | 'tree';
  
  // Actions - Input/Output
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setResult: (result: FormatResult | null) => void;
  
  // Actions - Settings
  updateSettings: (updates: Partial<FormatterSettings>) => void;
  resetSettings: () => void;
  applyPreset: (presetId: string) => void;
  setViewMode: (mode: ViewMode) => void;
  
  // Actions - Processing
  format: () => void;
  minify: () => void;
  validate: () => void;
  
  // Actions - Tree View
  updateTree: () => void;
  toggleNode: (nodeId: string) => void;
  expandAllNodes: () => void;
  collapseAllNodes: () => void;
  expandToLevel: (level: number) => void;
  selectNode: (nodeId: string | null) => void;
  setSearchQuery: (query: string) => void;
  nextMatch: () => void;
  prevMatch: () => void;
  
  // Actions - UI
  setIsProcessing: (isProcessing: boolean) => void;
  setActiveTab: (tab: 'format' | 'clean' | 'presets' | 'tree') => void;
  
  // Actions - Reset
  resetAll: () => void;
  clearInput: () => void;
}

// ============================================================================
// Store
// ============================================================================

export const useJsonFormatterStore = create<JsonFormatterState>((set, get) => ({
  // Initial state
  input: '',
  output: '',
  result: null,
  settings: DEFAULT_FORMATTER_SETTINGS,
  errors: [],
  isValid: false,
  stats: null,
  treeRoot: null,
  expandedNodes: new Set<string>(),
  selectedNodeId: null,
  searchQuery: '',
  matchedNodeIds: [],
  currentMatchIndex: 0,
  isProcessing: false,
  activeTab: 'format',
  
  // Input/Output actions
  setInput: (input) => set({ input }),
  
  setOutput: (output) => set({ output }),
  
  setResult: (result) => set({
    result,
    output: result?.output || '',
    stats: result?.stats || null,
    errors: result?.errors || [],
    isValid: result?.success ?? false,
  }),
  
  // Settings actions
  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates },
  })),
  
  resetSettings: () => set({ settings: DEFAULT_FORMATTER_SETTINGS }),
  
  applyPreset: (presetId) => set((state) => {
    const preset = FORMATTER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return state;
    
    return {
      settings: { ...state.settings, ...preset.settings },
    };
  }),
  
  setViewMode: (mode) => set((state) => ({
    settings: { ...state.settings, viewMode: mode },
  })),
  
  // Processing actions
  format: () => {
    const { input, settings } = get();
    if (!input.trim()) {
      set({ result: null, output: '', errors: [], isValid: false });
      return;
    }
    
    set({ isProcessing: true });
    
    try {
      const result = formatJSON(input, settings);
      set({
        result,
        output: result.output,
        stats: result.stats,
        errors: result.errors,
        isValid: result.success,
        isProcessing: false,
      });
    } catch (error) {
      set({
        errors: [{
          line: 1,
          column: 1,
          message: (error as Error).message,
          severity: 'error',
        }],
        isValid: false,
        isProcessing: false,
      });
    }
  },
  
  minify: () => {
    const { input } = get();
    if (!input.trim()) {
      set({ result: null, output: '', errors: [], isValid: false });
      return;
    }
    
    set({ isProcessing: true });
    
    try {
      const result = minifyJSON(input);
      set({
        result,
        output: result.output,
        stats: result.stats,
        errors: result.errors,
        isValid: result.success,
        isProcessing: false,
      });
    } catch (error) {
      set({
        errors: [{
          line: 1,
          column: 1,
          message: (error as Error).message,
          severity: 'error',
        }],
        isValid: false,
        isProcessing: false,
      });
    }
  },
  
  validate: () => {
    const { input } = get();
    if (!input.trim()) {
      set({ errors: [], isValid: false });
      return;
    }
    
    const result = validateJSON(input);
    set({
      errors: result.errors,
      isValid: result.isValid,
    });
  },
  
  // Tree View actions
  updateTree: () => {
    const { input } = get();
    if (!input.trim()) {
      set({ treeRoot: null, expandedNodes: new Set() });
      return;
    }
    
    try {
      const root = parseJSONToTree(input);
      if (root) {
        // Expand first two levels by default
        const expanded = expandToDepth(root, 2);
        set({ treeRoot: root, expandedNodes: expanded });
      }
    } catch {
      set({ treeRoot: null, expandedNodes: new Set() });
    }
  },
  
  toggleNode: (nodeId) => set((state) => {
    const newExpanded = new Set(state.expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    return { expandedNodes: newExpanded };
  }),
  
  expandAllNodes: () => set((state) => {
    if (!state.treeRoot) return state;
    return { expandedNodes: expandAll(state.treeRoot) };
  }),
  
  collapseAllNodes: () => set({
    expandedNodes: collapseAll(),
  }),
  
  expandToLevel: (level) => set((state) => {
    if (!state.treeRoot) return state;
    return { expandedNodes: expandToDepth(state.treeRoot, level) };
  }),
  
  selectNode: (nodeId) => set({
    selectedNodeId: nodeId,
  }),
  
  setSearchQuery: (query) => {
    const { treeRoot } = get();
    if (!treeRoot || !query.trim()) {
      set({ searchQuery: query, matchedNodeIds: [], currentMatchIndex: 0 });
      return;
    }
    
    // Simple search implementation
    const matches: string[] = [];
    function searchNode(node: TreeNode): void {
      const keyMatch = node.key.toLowerCase().includes(query.toLowerCase());
      const valueMatch = typeof node.value === 'string' && 
        node.value.toLowerCase().includes(query.toLowerCase());
      
      if (keyMatch || valueMatch) {
        matches.push(node.id);
      }
      
      node.children.forEach(searchNode);
    }
    
    searchNode(treeRoot);
    set({ searchQuery: query, matchedNodeIds: matches, currentMatchIndex: 0 });
  },
  
  nextMatch: () => set((state) => {
    if (state.matchedNodeIds.length === 0) return state;
    const nextIndex = (state.currentMatchIndex + 1) % state.matchedNodeIds.length;
    return { currentMatchIndex: nextIndex };
  }),
  
  prevMatch: () => set((state) => {
    if (state.matchedNodeIds.length === 0) return state;
    const prevIndex = state.currentMatchIndex === 0 
      ? state.matchedNodeIds.length - 1 
      : state.currentMatchIndex - 1;
    return { currentMatchIndex: prevIndex };
  }),
  
  // UI actions
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // Reset actions
  resetAll: () => set({
    input: '',
    output: '',
    result: null,
    settings: DEFAULT_FORMATTER_SETTINGS,
    errors: [],
    isValid: false,
    stats: null,
    treeRoot: null,
    expandedNodes: new Set(),
    selectedNodeId: null,
    searchQuery: '',
    matchedNodeIds: [],
    currentMatchIndex: 0,
    isProcessing: false,
    activeTab: 'format',
  }),
  
  clearInput: () => set({
    input: '',
    output: '',
    result: null,
    errors: [],
    isValid: false,
    stats: null,
    treeRoot: null,
    expandedNodes: new Set(),
  }),
}));

// ============================================================================
// Selectors
// ============================================================================

export const selectHasInput = (state: JsonFormatterState) =>
  state.input.trim() !== '';

export const selectHasOutput = (state: JsonFormatterState) =>
  state.output.trim() !== '';

export const selectHasErrors = (state: JsonFormatterState) =>
  state.errors.length > 0;

export const selectCurrentMatchNode = (state: JsonFormatterState) =>
  state.matchedNodeIds.length > 0 
    ? state.matchedNodeIds[state.currentMatchIndex] 
    : null;

export const selectMatchInfo = (state: JsonFormatterState) =>
  state.matchedNodeIds.length > 0
    ? `${state.currentMatchIndex + 1}/${state.matchedNodeIds.length}`
    : '';

// Re-export types for convenience
export type { FormatterSettings, FormatResult, ValidationError, FormatStats };
