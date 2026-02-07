/**
 * Flow Layout Engine
 * Generates nodes and edges from JSON data with different layout algorithms
 */

import type {
  JsonValueType,
  FlowNode,
  FlowEdge,
  FlowNodeData,
  FlowSettings,
  FlowGenerationResult,
  FlowStats,
} from './types';
import { DEFAULT_FLOW_SETTINGS } from './types';

/**
 * Determine the JSON value type
 */
function getValueType(value: unknown): JsonValueType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const type = typeof value;
  if (type === 'object') return 'object';
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'boolean') return 'boolean';
  return 'string';
}

/**
 * Count children of a value
 */
function countChildren(value: unknown): number {
  if (value === null || typeof value !== 'object') return 0;
  if (Array.isArray(value)) return value.length;
  return Object.keys(value).length;
}

/**
 * Generate unique node ID
 */
function generateNodeId(path: string): string {
  return `node-${path.replace(/[^a-zA-Z0-9]/g, '-')}`;
}

/**
 * Generate nodes and edges recursively
 */
function generateNodesAndEdges(
  value: unknown,
  key: string,
  path: string,
  depth: number,
  settings: FlowSettings,
  nodes: FlowNode[],
  edges: FlowEdge[],
  stats: FlowStats,
  parentId: string | null
): void {
  // Check max depth
  if (depth > settings.maxDepth) return;

  const nodeId = generateNodeId(path);
  const valueType = getValueType(value);
  const childCount = countChildren(value);

  // Update stats
  if (valueType === 'object') stats.objectCount++;
  else if (valueType === 'array') stats.arrayCount++;
  else stats.primitiveCount++;

  stats.maxDepth = Math.max(stats.maxDepth, depth);

  // Create node data
  const nodeData: FlowNodeData = {
    key,
    value: valueType === 'object' || valueType === 'array' ? null : value,
    valueType,
    isExpanded: !settings.collapsedByDefault,
    depth,
    path,
    childCount,
  };

  // Calculate position based on layout
  const position = calculatePosition(nodes.length, depth, settings);

  // Create node
  const node: FlowNode = {
    id: nodeId,
    type: 'json-node',
    position,
    data: nodeData,
  };

  nodes.push(node);
  stats.totalNodes++;

  // Create edge from parent
  if (parentId) {
    const edge: FlowEdge = {
      id: `edge-${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      type: 'smoothstep',
      animated: settings.animateEdges,
    };
    edges.push(edge);
    stats.totalEdges++;
  }

  // Process children
  if (valueType === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    Object.entries(obj).forEach(([childKey, childValue]) => {
      generateNodesAndEdges(
        childValue,
        childKey,
        `${path}.${childKey}`,
        depth + 1,
        settings,
        nodes,
        edges,
        stats,
        nodeId
      );
    });
  } else if (valueType === 'array') {
    const arr = value as unknown[];
    arr.forEach((item, index) => {
      generateNodesAndEdges(
        item,
        `[${index}]`,
        `${path}[${index}]`,
        depth + 1,
        settings,
        nodes,
        edges,
        stats,
        nodeId
      );
    });
  }
}

/**
 * Calculate node position based on layout algorithm
 */
function calculatePosition(
  nodeIndex: number,
  depth: number,
  settings: FlowSettings
): { x: number; y: number } {
  switch (settings.layout) {
    case 'horizontal':
      return {
        x: depth * settings.nodeSpacingX,
        y: nodeIndex * settings.nodeSpacingY,
      };
    case 'radial': {
      const angle = (nodeIndex * 0.5) % (2 * Math.PI);
      const radius = depth * settings.nodeSpacingX;
      return {
        x: Math.cos(angle) * radius + 500,
        y: Math.sin(angle) * radius + 500,
      };
    }
    case 'tree':
    default:
      return {
        x: depth * settings.nodeSpacingX,
        y: nodeIndex * settings.nodeSpacingY,
      };
  }
}

/**
 * Apply tree layout with proper spacing
 */
function applyTreeLayout(nodes: FlowNode[], settings: FlowSettings): void {
  const nodesByDepth: Map<number, FlowNode[]> = new Map();

  // Group nodes by depth
  nodes.forEach((node) => {
    const depth = node.data.depth;
    if (!nodesByDepth.has(depth)) {
      nodesByDepth.set(depth, []);
    }
    nodesByDepth.get(depth)!.push(node);
  });

  // Position nodes at each depth
  nodesByDepth.forEach((depthNodes, depth) => {
    depthNodes.forEach((node, index) => {
      node.position = {
        x: depth * settings.nodeSpacingX,
        y: index * settings.nodeSpacingY,
      };
    });
  });
}

/**
 * Main function to convert JSON to flow diagram
 */
export function jsonToFlow(
  json: string,
  settings: Partial<FlowSettings> = {}
): FlowGenerationResult {
  const fullSettings: FlowSettings = {
    ...DEFAULT_FLOW_SETTINGS,
    ...settings,
  };

  const errors: string[] = [];

  // Parse JSON
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch (e) {
    return {
      success: false,
      nodes: [],
      edges: [],
      stats: {
        totalNodes: 0,
        totalEdges: 0,
        maxDepth: 0,
        objectCount: 0,
        arrayCount: 0,
        primitiveCount: 0,
      },
      errors: [`Invalid JSON: ${(e as Error).message}`],
    };
  }

  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  const stats: FlowStats = {
    totalNodes: 0,
    totalEdges: 0,
    maxDepth: 0,
    objectCount: 0,
    arrayCount: 0,
    primitiveCount: 0,
  };

  // Generate nodes and edges
  generateNodesAndEdges(data, 'root', 'root', 0, fullSettings, nodes, edges, stats, null);

  // Apply layout
  applyTreeLayout(nodes, fullSettings);

  return {
    success: true,
    nodes,
    edges,
    stats,
    errors,
  };
}

/**
 * Search for nodes containing text
 */
export function searchNodes(nodes: FlowNode[], searchText: string): string[] {
  if (!searchText.trim()) return [];

  const lowerSearch = searchText.toLowerCase();
  return nodes
    .filter((node) => {
      const keyMatch = node.data.key.toLowerCase().includes(lowerSearch);
      const valueMatch =
        node.data.value !== null &&
        String(node.data.value).toLowerCase().includes(lowerSearch);
      const pathMatch = node.data.path.toLowerCase().includes(lowerSearch);
      return keyMatch || valueMatch || pathMatch;
    })
    .map((node) => node.id);
}

/**
 * Get node path breadcrumb
 */
export function getNodePath(path: string): string[] {
  return path.split('.').filter((p) => p && p !== 'root');
}
