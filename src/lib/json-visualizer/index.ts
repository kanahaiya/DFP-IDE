/**
 * JSON Visualizer - Public API
 */

// Types
export type {
  JsonPrimitive,
  JsonValue,
  JsonObject,
  JsonArray,
  NodeDataType,
  VisualizerNode,
  VisualizerEdge,
  VisualizerGraph,
  GraphStats,
  VisualizationMode,
  LayoutType,
  TreeOrientation,
  VisualizerSettings,
  SearchOptions,
  SearchResult,
  FilterOptions,
  ExportFormat2D,
  ExportFormat3D,
  ExportOptions,
  NodeClickEvent,
  NodeHoverEvent,
  Position2D,
  Position3D,
  LayoutResult,
  VisualizerPreset,
} from './types';

// Constants
export {
  DEFAULT_VISUALIZER_SETTINGS,
  NODE_TYPE_COLORS,
  NODE_TYPE_COLORS_3D,
  VISUALIZER_PRESETS,
} from './types';

// Parser functions
export {
  parseJsonToGraph,
  getVisibleNodes,
  getVisibleEdges,
  toggleNodeExpansion,
  expandToDepth,
  collapseAll,
  selectNode,
  getNodePathString,
  formatValueForDisplay,
  getDescendantCount,
  getNodeType,
  getNodeColor,
  calculateNodeSize,
  resetNodeIdCounter,
} from './parser';

// Layout algorithms
export {
  applyLayout,
  applyTreeLayout,
  apply3DTreeLayout,
  applyForceLayout,
  apply3DForceLayout,
  applyRadialLayout,
  apply3DRadialLayout,
  applyTreemapLayout,
} from './layouts';
export type { LayoutOptions } from './layouts';
