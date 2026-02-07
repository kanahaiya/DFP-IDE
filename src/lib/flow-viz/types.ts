/**
 * JSON to Flow Visualization Types
 * Type definitions for JSON flowchart visualization
 */

export type JsonValueType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

export type LayoutAlgorithm = 'tree' | 'radial' | 'horizontal';

export type ThemeColor = 'default' | 'colorful' | 'monochrome' | 'dark';

export interface FlowNode {
  id: string;
  type: 'json-node';
  position: { x: number; y: number };
  data: FlowNodeData;
}

export interface FlowNodeData {
  key: string;
  value: unknown;
  valueType: JsonValueType;
  isExpanded: boolean;
  depth: number;
  path: string;
  childCount: number;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type: 'smoothstep';
  animated?: boolean;
}

export interface FlowSettings {
  layout: LayoutAlgorithm;
  theme: ThemeColor;
  showTypes: boolean;
  showValues: boolean;
  showPath: boolean;
  maxDepth: number;
  nodeSpacingX: number;
  nodeSpacingY: number;
  animateEdges: boolean;
  collapsedByDefault: boolean;
}

export const DEFAULT_FLOW_SETTINGS: FlowSettings = {
  layout: 'tree',
  theme: 'default',
  showTypes: true,
  showValues: true,
  showPath: false,
  maxDepth: 10,
  nodeSpacingX: 200,
  nodeSpacingY: 100,
  animateEdges: false,
  collapsedByDefault: false,
};

export interface FlowGenerationResult {
  success: boolean;
  nodes: FlowNode[];
  edges: FlowEdge[];
  stats: FlowStats;
  errors: string[];
}

export interface FlowStats {
  totalNodes: number;
  totalEdges: number;
  maxDepth: number;
  objectCount: number;
  arrayCount: number;
  primitiveCount: number;
}

export interface FlowPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<FlowSettings>;
}

export const NODE_COLORS: Record<JsonValueType, string> = {
  object: '#3b82f6', // blue
  array: '#8b5cf6', // purple
  string: '#22c55e', // green
  number: '#f59e0b', // amber
  boolean: '#ef4444', // red
  null: '#6b7280', // gray
};
