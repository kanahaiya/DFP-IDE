/**
 * JSON Visualizer - Zustand Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEFAULT_VISUALIZER_SETTINGS,
  VISUALIZER_PRESETS,
  parseJsonToGraph,
  toggleNodeExpansion,
  expandToDepth,
  collapseAll,
  selectNode,
  getVisibleNodes,
  getVisibleEdges,
  applyLayout,
  getNodePathString,
} from '@/lib/json-visualizer';
import type {
  VisualizerGraph,
  VisualizerNode,
  VisualizerEdge,
  VisualizerSettings,
  VisualizationMode,
  LayoutType,
  TreeOrientation,
  SearchOptions,
  SearchResult,
  Position3D,
  LayoutResult,
} from '@/lib/json-visualizer';

// ============================================================================
// State Interface
// ============================================================================

interface JsonVisualizerState {
  // Input
  jsonInput: string;
  parseError: string | null;
  
  // Graph data
  graph: VisualizerGraph | null;
  visibleNodes: VisualizerNode[];
  visibleEdges: VisualizerEdge[];
  
  // Layout
  layoutResult: LayoutResult | null;
  positions: Map<string, Position3D>;
  
  // Selection
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  
  // Settings
  settings: VisualizerSettings;
  
  // Search
  searchOptions: SearchOptions;
  searchResults: SearchResult[];
  currentSearchIndex: number;
  
  // UI State
  isLoading: boolean;
  isPanelCollapsed: boolean;
  
  // Actions - Input
  setJsonInput: (input: string) => void;
  loadSample: (sampleData: object) => void;
  loadFromUrl: (url: string) => Promise<void>;
  clearInput: () => void;
  
  // Actions - Graph
  parseAndVisualize: () => void;
  toggleExpansion: (nodeId: string) => void;
  expandAll: () => void;
  collapseAllNodes: () => void;
  expandToLevel: (depth: number) => void;
  
  // Actions - Selection
  selectNodeById: (nodeId: string | null) => void;
  setHoveredNode: (nodeId: string | null) => void;
  
  // Actions - Settings
  setMode: (mode: VisualizationMode) => void;
  setLayout: (layout: LayoutType) => void;
  setTreeOrientation: (orientation: TreeOrientation) => void;
  updateSettings: (updates: Partial<VisualizerSettings>) => void;
  resetSettings: () => void;
  applyPreset: (presetId: string) => void;
  
  // Actions - Search
  setSearchQuery: (query: string) => void;
  updateSearchOptions: (options: Partial<SearchOptions>) => void;
  performSearch: () => void;
  nextSearchResult: () => void;
  prevSearchResult: () => void;
  clearSearch: () => void;
  
  // Actions - UI
  togglePanel: () => void;
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_JSON_INPUT = JSON.stringify(
  {
    name: "JSON Visualizer",
    version: "1.0.0",
    features: {
      modes: ["2D", "3D"],
      layouts: ["tree", "force", "radial", "treemap"],
      export: ["PNG", "SVG", "GLTF"]
    },
    data: [
      { id: 1, label: "Node 1", active: true },
      { id: 2, label: "Node 2", active: false },
      { id: 3, label: "Node 3", active: true }
    ],
    metadata: {
      created: "2024-01-01",
      author: "Developer",
      settings: null
    }
  },
  null,
  2
);

const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  query: '',
  matchCase: false,
  matchWholeWord: false,
  useRegex: false,
  searchKeys: true,
  searchValues: true,
};

// ============================================================================
// Store Implementation
// ============================================================================

export const useJsonVisualizerStore = create<JsonVisualizerState>()(
  persist(
    (set, get) => ({
      // Initial State
      jsonInput: DEFAULT_JSON_INPUT,
      parseError: null,
      graph: null,
      visibleNodes: [],
      visibleEdges: [],
      layoutResult: null,
      positions: new Map(),
      selectedNodeId: null,
      hoveredNodeId: null,
      settings: DEFAULT_VISUALIZER_SETTINGS,
      searchOptions: DEFAULT_SEARCH_OPTIONS,
      searchResults: [],
      currentSearchIndex: -1,
      isLoading: false,
      isPanelCollapsed: false,

      // ========================================================================
      // Input Actions
      // ========================================================================
      
      setJsonInput: (input) => {
        set({ jsonInput: input, parseError: null });
        // Auto-parse on input change
        setTimeout(() => get().parseAndVisualize(), 100);
      },

      loadSample: (sampleData) => {
        const input = JSON.stringify(sampleData, null, 2);
        set({ jsonInput: input, parseError: null });
        get().parseAndVisualize();
      },

      loadFromUrl: async (url) => {
        set({ isLoading: true, parseError: null });
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          const data = await response.json();
          const input = JSON.stringify(data, null, 2);
          set({ jsonInput: input, isLoading: false });
          get().parseAndVisualize();
        } catch (e) {
          set({
            parseError: `Failed to load URL: ${e instanceof Error ? e.message : 'Unknown error'}`,
            isLoading: false,
          });
        }
      },

      clearInput: () => {
        set({
          jsonInput: '',
          graph: null,
          visibleNodes: [],
          visibleEdges: [],
          layoutResult: null,
          positions: new Map(),
          selectedNodeId: null,
          hoveredNodeId: null,
          searchResults: [],
          currentSearchIndex: -1,
          parseError: null,
        });
      },

      // ========================================================================
      // Graph Actions
      // ========================================================================

      parseAndVisualize: () => {
        const { jsonInput, settings } = get();
        
        if (!jsonInput.trim()) {
          set({
            graph: null,
            visibleNodes: [],
            visibleEdges: [],
            layoutResult: null,
            positions: new Map(),
            parseError: null,
          });
          return;
        }

        try {
          // Parse JSON to graph
          const graph = parseJsonToGraph(jsonInput, settings.defaultExpandDepth);
          
          // Get visible nodes/edges
          const visibleNodes = getVisibleNodes(graph);
          const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
          const visibleEdges = getVisibleEdges(graph, visibleNodeIds);
          
          // Apply layout
          const layoutResult = applyLayout(graph, {
            mode: settings.mode,
            layout: settings.layout,
            treeOrientation: settings.treeOrientation,
            nodeSpacing: settings.nodeSpacing,
            levelSpacing: settings.levelSpacing,
            forceStrength: settings.forceStrength,
          });

          set({
            graph,
            visibleNodes,
            visibleEdges,
            layoutResult,
            positions: layoutResult.positions,
            parseError: null,
          });
        } catch (e) {
          set({
            parseError: e instanceof Error ? e.message : 'Failed to parse JSON',
            graph: null,
            visibleNodes: [],
            visibleEdges: [],
          });
        }
      },

      toggleExpansion: (nodeId) => {
        const { graph, settings } = get();
        if (!graph) return;

        const newGraph = toggleNodeExpansion(graph, nodeId);
        const visibleNodes = getVisibleNodes(newGraph);
        const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
        const visibleEdges = getVisibleEdges(newGraph, visibleNodeIds);

        // Re-apply layout
        const layoutResult = applyLayout(newGraph, {
          mode: settings.mode,
          layout: settings.layout,
          treeOrientation: settings.treeOrientation,
          nodeSpacing: settings.nodeSpacing,
          levelSpacing: settings.levelSpacing,
          forceStrength: settings.forceStrength,
        });

        set({
          graph: newGraph,
          visibleNodes,
          visibleEdges,
          layoutResult,
          positions: layoutResult.positions,
        });
      },

      expandAll: () => {
        const { graph, settings } = get();
        if (!graph) return;

        const newGraph = expandToDepth(graph, Infinity);
        const visibleNodes = getVisibleNodes(newGraph);
        const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
        const visibleEdges = getVisibleEdges(newGraph, visibleNodeIds);

        const layoutResult = applyLayout(newGraph, {
          mode: settings.mode,
          layout: settings.layout,
          treeOrientation: settings.treeOrientation,
          nodeSpacing: settings.nodeSpacing,
          levelSpacing: settings.levelSpacing,
          forceStrength: settings.forceStrength,
        });

        set({
          graph: newGraph,
          visibleNodes,
          visibleEdges,
          layoutResult,
          positions: layoutResult.positions,
        });
      },

      collapseAllNodes: () => {
        const { graph, settings } = get();
        if (!graph) return;

        const newGraph = collapseAll(graph);
        const visibleNodes = getVisibleNodes(newGraph);
        const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
        const visibleEdges = getVisibleEdges(newGraph, visibleNodeIds);

        const layoutResult = applyLayout(newGraph, {
          mode: settings.mode,
          layout: settings.layout,
          treeOrientation: settings.treeOrientation,
          nodeSpacing: settings.nodeSpacing,
          levelSpacing: settings.levelSpacing,
          forceStrength: settings.forceStrength,
        });

        set({
          graph: newGraph,
          visibleNodes,
          visibleEdges,
          layoutResult,
          positions: layoutResult.positions,
        });
      },

      expandToLevel: (depth) => {
        const { graph, settings } = get();
        if (!graph) return;

        const newGraph = expandToDepth(graph, depth);
        const visibleNodes = getVisibleNodes(newGraph);
        const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
        const visibleEdges = getVisibleEdges(newGraph, visibleNodeIds);

        const layoutResult = applyLayout(newGraph, {
          mode: settings.mode,
          layout: settings.layout,
          treeOrientation: settings.treeOrientation,
          nodeSpacing: settings.nodeSpacing,
          levelSpacing: settings.levelSpacing,
          forceStrength: settings.forceStrength,
        });

        set({
          graph: newGraph,
          visibleNodes,
          visibleEdges,
          layoutResult,
          positions: layoutResult.positions,
        });
      },

      // ========================================================================
      // Selection Actions
      // ========================================================================

      selectNodeById: (nodeId) => {
        const { graph } = get();
        if (!graph) {
          set({ selectedNodeId: nodeId });
          return;
        }

        const newGraph = selectNode(graph, nodeId, true);
        set({ graph: newGraph, selectedNodeId: nodeId });
      },

      setHoveredNode: (nodeId) => {
        set({ hoveredNodeId: nodeId });
      },

      // ========================================================================
      // Settings Actions
      // ========================================================================

      setMode: (mode) => {
        set((state) => ({
          settings: { ...state.settings, mode },
        }));
        get().parseAndVisualize();
      },

      setLayout: (layout) => {
        set((state) => ({
          settings: { ...state.settings, layout },
        }));
        get().parseAndVisualize();
      },

      setTreeOrientation: (orientation) => {
        set((state) => ({
          settings: { ...state.settings, treeOrientation: orientation },
        }));
        get().parseAndVisualize();
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
        get().parseAndVisualize();
      },

      resetSettings: () => {
        set({ settings: DEFAULT_VISUALIZER_SETTINGS });
        get().parseAndVisualize();
      },

      applyPreset: (presetId) => {
        const preset = VISUALIZER_PRESETS.find((p) => p.id === presetId);
        if (!preset) return;

        set((state) => ({
          settings: { ...state.settings, ...preset.settings },
        }));
        get().parseAndVisualize();
      },

      // ========================================================================
      // Search Actions
      // ========================================================================

      setSearchQuery: (query) => {
        set((state) => ({
          searchOptions: { ...state.searchOptions, query },
        }));
        if (query) {
          get().performSearch();
        } else {
          get().clearSearch();
        }
      },

      updateSearchOptions: (options) => {
        set((state) => ({
          searchOptions: { ...state.searchOptions, ...options },
        }));
        if (get().searchOptions.query) {
          get().performSearch();
        }
      },

      performSearch: () => {
        const { graph, searchOptions } = get();
        if (!graph || !searchOptions.query) {
          set({ searchResults: [], currentSearchIndex: -1 });
          return;
        }

        const results: SearchResult[] = [];
        const query = searchOptions.matchCase
          ? searchOptions.query
          : searchOptions.query.toLowerCase();

        graph.nodes.forEach((node) => {
          const keyToSearch = searchOptions.matchCase ? node.key : node.key.toLowerCase();
          
          // Search in keys
          if (searchOptions.searchKeys && keyToSearch.includes(query)) {
            results.push({
              nodeId: node.id,
              path: getNodePathString(node),
              matchType: 'key',
              matchedText: node.key,
            });
          }

          // Search in values (strings only)
          if (searchOptions.searchValues && typeof node.value === 'string') {
            const valueToSearch = searchOptions.matchCase
              ? node.value
              : node.value.toLowerCase();
            if (valueToSearch.includes(query)) {
              results.push({
                nodeId: node.id,
                path: getNodePathString(node),
                matchType: 'value',
                matchedText: node.value,
              });
            }
          }
        });

        set({
          searchResults: results,
          currentSearchIndex: results.length > 0 ? 0 : -1,
        });

        // Select first result
        if (results.length > 0) {
          get().selectNodeById(results[0].nodeId);
        }
      },

      nextSearchResult: () => {
        const { searchResults, currentSearchIndex } = get();
        if (searchResults.length === 0) return;

        const nextIndex = (currentSearchIndex + 1) % searchResults.length;
        set({ currentSearchIndex: nextIndex });
        get().selectNodeById(searchResults[nextIndex].nodeId);
      },

      prevSearchResult: () => {
        const { searchResults, currentSearchIndex } = get();
        if (searchResults.length === 0) return;

        const prevIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
        set({ currentSearchIndex: prevIndex });
        get().selectNodeById(searchResults[prevIndex].nodeId);
      },

      clearSearch: () => {
        set({
          searchOptions: { ...get().searchOptions, query: '' },
          searchResults: [],
          currentSearchIndex: -1,
        });
      },

      // ========================================================================
      // UI Actions
      // ========================================================================

      togglePanel: () => {
        set((state) => ({ isPanelCollapsed: !state.isPanelCollapsed }));
      },
    }),
    {
      name: 'json-visualizer-store',
      partialize: (state) => ({
        jsonInput: state.jsonInput,
        settings: state.settings,
        searchOptions: {
          ...state.searchOptions,
          query: '', // Don't persist search query
        },
        isPanelCollapsed: state.isPanelCollapsed,
      }),
    }
  )
);
