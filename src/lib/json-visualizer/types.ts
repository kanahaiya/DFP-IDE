/**
 * JSON Visualizer - Shared Types for 2D/3D Modes
 */

// ============================================================================
// Core JSON Types
// ============================================================================

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject { [key: string]: JsonValue }
export type JsonArray = JsonValue[];

// ============================================================================
// Node Types
// ============================================================================

export type NodeDataType = 
  | 'object' 
  | 'array' 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'null';

export interface VisualizerNode {
  id: string;
  key: string;
  value: JsonValue;
  type: NodeDataType;
  path: (string | number)[];
  depth: number;
  childrenIds: string[];
  parentId: string | null;
  isExpanded: boolean;
  isHighlighted: boolean;
  isSelected: boolean;
  
  // Computed layout positions (set by layout algorithms)
  x: number;
  y: number;
  z: number; // Used in 3D mode
  
  // Visual properties
  size: number;
  color: string;
}

export interface VisualizerEdge {
  id: string;
  source: string;
  target: string;
  type: 'parent-child' | 'reference';
}

export interface VisualizerGraph {
  nodes: Map<string, VisualizerNode>;
  edges: VisualizerEdge[];
  rootId: string;
  stats: GraphStats;
}

export interface GraphStats {
  totalNodes: number;
  maxDepth: number;
  objectCount: number;
  arrayCount: number;
  stringCount: number;
  numberCount: number;
  booleanCount: number;
  nullCount: number;
}

// ============================================================================
// Visualization Modes & Layouts
// ============================================================================

export type VisualizationMode = '2d' | '3d';

export type LayoutType = 
  | 'tree' 
  | 'force' 
  | 'radial' 
  | 'treemap'; // treemap is 2D only

export type TreeOrientation = 'horizontal' | 'vertical';

// ============================================================================
// Settings
// ============================================================================

export interface VisualizerSettings {
  // Mode & Layout
  mode: VisualizationMode;
  layout: LayoutType;
  treeOrientation: TreeOrientation;
  
  // Display
  defaultExpandDepth: number;
  maxVisibleDepth: number;
  showValues: boolean;
  showTypes: boolean;
  showPaths: boolean;
  colorByType: boolean;
  
  // Node sizing
  nodeSizeByChildren: boolean;
  minNodeSize: number;
  maxNodeSize: number;
  
  // Layout-specific
  nodeSpacing: number;
  levelSpacing: number;
  forceStrength: number;
  
  // 3D-specific
  autoRotate: boolean;
  rotationSpeed: number;
  cameraFov: number;
  ambientLightIntensity: number;
  
  // Performance
  enableAnimation: boolean;
  animationDuration: number;
  maxNodes: number;
}

export const DEFAULT_VISUALIZER_SETTINGS: VisualizerSettings = {
  // Mode & Layout
  mode: '2d',
  layout: 'tree',
  treeOrientation: 'horizontal',
  
  // Display
  defaultExpandDepth: 3,
  maxVisibleDepth: 10,
  showValues: true,
  showTypes: true,
  showPaths: false,
  colorByType: true,
  
  // Node sizing
  nodeSizeByChildren: true,
  minNodeSize: 20,
  maxNodeSize: 60,
  
  // Layout-specific
  nodeSpacing: 80,
  levelSpacing: 150,
  forceStrength: -300,
  
  // 3D-specific
  autoRotate: false,
  rotationSpeed: 0.5,
  cameraFov: 75,
  ambientLightIntensity: 0.5,
  
  // Performance
  enableAnimation: true,
  animationDuration: 300,
  maxNodes: 5000,
};

// ============================================================================
// Color Scheme
// ============================================================================

export const NODE_TYPE_COLORS: Record<NodeDataType, string> = {
  object: '#4F46E5',   // Indigo
  array: '#059669',    // Emerald
  string: '#D97706',   // Amber
  number: '#7C3AED',   // Violet
  boolean: '#DC2626',  // Red
  null: '#6B7280',     // Gray
};

export const NODE_TYPE_COLORS_3D: Record<NodeDataType, string> = {
  object: '#6366F1',   // Indigo lighter for 3D
  array: '#10B981',    // Emerald
  string: '#F59E0B',   // Amber
  number: '#8B5CF6',   // Violet
  boolean: '#EF4444',  // Red
  null: '#9CA3AF',     // Gray
};

// ============================================================================
// Search & Filter
// ============================================================================

export interface SearchOptions {
  query: string;
  matchCase: boolean;
  matchWholeWord: boolean;
  useRegex: boolean;
  searchKeys: boolean;
  searchValues: boolean;
}

export interface SearchResult {
  nodeId: string;
  path: string;
  matchType: 'key' | 'value';
  matchedText: string;
}

export interface FilterOptions {
  types: NodeDataType[];
  minDepth: number;
  maxDepth: number;
  hasChildren: boolean | null;
}

// ============================================================================
// Export Options
// ============================================================================

export type ExportFormat2D = 'png' | 'svg' | 'json';
export type ExportFormat3D = 'png' | 'gltf' | 'json';

export interface ExportOptions {
  format: ExportFormat2D | ExportFormat3D;
  width: number;
  height: number;
  backgroundColor: string;
  includeMetadata: boolean;
  quality: number; // 0-1 for PNG
}

// ============================================================================
// Event Types
// ============================================================================

export interface NodeClickEvent {
  nodeId: string;
  node: VisualizerNode;
  event: MouseEvent;
}

export interface NodeHoverEvent {
  nodeId: string | null;
  node: VisualizerNode | null;
}

// ============================================================================
// Layout Position Types
// ============================================================================

export interface Position2D {
  x: number;
  y: number;
}

export interface Position3D extends Position2D {
  z: number;
}

export interface LayoutResult {
  positions: Map<string, Position3D>;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
}

// ============================================================================
// Preset Types
// ============================================================================

export interface VisualizerPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<VisualizerSettings>;
}

export const VISUALIZER_PRESETS: VisualizerPreset[] = [
  {
    id: 'default-2d',
    name: 'Default 2D',
    description: 'Standard 2D tree visualization',
    settings: {
      mode: '2d',
      layout: 'tree',
      treeOrientation: 'horizontal',
      defaultExpandDepth: 3,
      colorByType: true,
    },
  },
  {
    id: 'default-3d',
    name: 'Default 3D',
    description: 'Immersive 3D tree visualization',
    settings: {
      mode: '3d',
      layout: 'tree',
      autoRotate: true,
      defaultExpandDepth: 3,
      colorByType: true,
    },
  },
  {
    id: 'force-graph',
    name: 'Force Graph',
    description: 'Physics-based force-directed layout',
    settings: {
      mode: '2d',
      layout: 'force',
      forceStrength: -400,
      enableAnimation: true,
    },
  },
  {
    id: 'radial',
    name: 'Radial Tree',
    description: 'Circular/radial layout',
    settings: {
      mode: '2d',
      layout: 'radial',
      levelSpacing: 100,
    },
  },
  {
    id: 'compact',
    name: 'Compact View',
    description: 'Condensed visualization for large data',
    settings: {
      mode: '2d',
      layout: 'tree',
      nodeSpacing: 40,
      levelSpacing: 80,
      showValues: false,
      defaultExpandDepth: 2,
    },
  },
  {
    id: 'detailed',
    name: 'Detailed View',
    description: 'Show all information',
    settings: {
      mode: '2d',
      layout: 'tree',
      showValues: true,
      showTypes: true,
      showPaths: true,
      defaultExpandDepth: 5,
    },
  },
  {
    id: '3d-force',
    name: '3D Force Graph',
    description: '3D physics-based visualization',
    settings: {
      mode: '3d',
      layout: 'force',
      autoRotate: false,
      forceStrength: -500,
    },
  },
  {
    id: '3d-radial',
    name: '3D Radial',
    description: '3D spherical radial layout',
    settings: {
      mode: '3d',
      layout: 'radial',
      autoRotate: true,
      rotationSpeed: 0.3,
    },
  },
];
