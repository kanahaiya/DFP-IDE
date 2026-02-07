/**
 * JSON Visualizer - Parser
 * Converts JSON data to a graph structure for visualization
 */

import type {
  JsonValue,
  JsonObject,
  JsonArray,
  VisualizerNode,
  VisualizerEdge,
  VisualizerGraph,
  GraphStats,
  NodeDataType,
} from './types';
import { NODE_TYPE_COLORS as COLORS } from './types';

let nodeIdCounter = 0;

/**
 * Resets the node ID counter (useful for testing or fresh parses)
 */
export function resetNodeIdCounter(): void {
  nodeIdCounter = 0;
}

/**
 * Generates a unique node ID
 */
function generateNodeId(): string {
  return `node-${nodeIdCounter++}`;
}

/**
 * Determines the data type of a JSON value
 */
export function getNodeType(value: JsonValue): NodeDataType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'null';
}

/**
 * Gets the default color for a node type
 */
export function getNodeColor(type: NodeDataType): string {
  return COLORS[type] || '#6B7280';
}

/**
 * Calculates node size based on number of children
 */
export function calculateNodeSize(
  childCount: number,
  minSize: number = 20,
  maxSize: number = 60
): number {
  if (childCount === 0) return minSize;
  const size = minSize + Math.log2(childCount + 1) * 10;
  return Math.min(maxSize, Math.max(minSize, size));
}

/**
 * Recursively parses JSON into a node structure
 */
function parseNode(
  value: JsonValue,
  key: string,
  path: (string | number)[],
  depth: number,
  parentId: string | null,
  nodes: Map<string, VisualizerNode>,
  edges: VisualizerEdge[],
  defaultExpandDepth: number
): string {
  const id = generateNodeId();
  const type = getNodeType(value);
  const childrenIds: string[] = [];

  // Create the node (positions will be set by layout algorithm)
  const node: VisualizerNode = {
    id,
    key,
    value,
    type,
    path: [...path],
    depth,
    childrenIds,
    parentId,
    isExpanded: depth < defaultExpandDepth,
    isHighlighted: false,
    isSelected: false,
    x: 0,
    y: 0,
    z: 0,
    size: 20, // Will be updated after children are counted
    color: getNodeColor(type),
  };

  nodes.set(id, node);

  // Create edge from parent to this node
  if (parentId) {
    edges.push({
      id: `edge-${parentId}-${id}`,
      source: parentId,
      target: id,
      type: 'parent-child',
    });
  }

  // Process children for objects and arrays
  if (type === 'object' && value !== null) {
    const obj = value as JsonObject;
    Object.entries(obj).forEach(([childKey, childValue]) => {
      const childId = parseNode(
        childValue,
        childKey,
        [...path, childKey],
        depth + 1,
        id,
        nodes,
        edges,
        defaultExpandDepth
      );
      childrenIds.push(childId);
    });
  } else if (type === 'array') {
    const arr = value as JsonArray;
    arr.forEach((childValue, index) => {
      const childId = parseNode(
        childValue,
        `[${index}]`,
        [...path, index],
        depth + 1,
        id,
        nodes,
        edges,
        defaultExpandDepth
      );
      childrenIds.push(childId);
    });
  }

  // Update node size based on children count
  node.size = calculateNodeSize(childrenIds.length);

  return id;
}

/**
 * Calculates statistics for the graph
 */
function calculateStats(nodes: Map<string, VisualizerNode>): GraphStats {
  const stats: GraphStats = {
    totalNodes: 0,
    maxDepth: 0,
    objectCount: 0,
    arrayCount: 0,
    stringCount: 0,
    numberCount: 0,
    booleanCount: 0,
    nullCount: 0,
  };

  nodes.forEach((node) => {
    stats.totalNodes++;
    stats.maxDepth = Math.max(stats.maxDepth, node.depth);

    switch (node.type) {
      case 'object':
        stats.objectCount++;
        break;
      case 'array':
        stats.arrayCount++;
        break;
      case 'string':
        stats.stringCount++;
        break;
      case 'number':
        stats.numberCount++;
        break;
      case 'boolean':
        stats.booleanCount++;
        break;
      case 'null':
        stats.nullCount++;
        break;
    }
  });

  return stats;
}

/**
 * Parses JSON string or value into a visualizer graph
 */
export function parseJsonToGraph(
  input: string | JsonValue,
  defaultExpandDepth: number = 3
): VisualizerGraph {
  resetNodeIdCounter();

  let jsonValue: JsonValue;

  if (typeof input === 'string') {
    try {
      jsonValue = JSON.parse(input);
    } catch (e) {
      throw new Error(`Invalid JSON: ${e instanceof Error ? e.message : 'Parse error'}`);
    }
  } else {
    jsonValue = input;
  }

  const nodes = new Map<string, VisualizerNode>();
  const edges: VisualizerEdge[] = [];

  const rootId = parseNode(
    jsonValue,
    'root',
    [],
    0,
    null,
    nodes,
    edges,
    defaultExpandDepth
  );

  const stats = calculateStats(nodes);

  return {
    nodes,
    edges,
    rootId,
    stats,
  };
}

/**
 * Gets all visible nodes (respecting expansion state)
 */
export function getVisibleNodes(graph: VisualizerGraph): VisualizerNode[] {
  const visible: VisualizerNode[] = [];
  const queue: string[] = [graph.rootId];

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId) continue;

    const node = graph.nodes.get(nodeId);
    if (!node) continue;

    visible.push(node);

    if (node.isExpanded && node.childrenIds.length > 0) {
      queue.push(...node.childrenIds);
    }
  }

  return visible;
}

/**
 * Gets all visible edges (edges between visible nodes)
 */
export function getVisibleEdges(
  graph: VisualizerGraph,
  visibleNodeIds: Set<string>
): VisualizerEdge[] {
  return graph.edges.filter(
    (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
  );
}

/**
 * Toggles expansion state of a node
 */
export function toggleNodeExpansion(
  graph: VisualizerGraph,
  nodeId: string
): VisualizerGraph {
  const node = graph.nodes.get(nodeId);
  if (!node) return graph;

  const newNodes = new Map(graph.nodes);
  newNodes.set(nodeId, { ...node, isExpanded: !node.isExpanded });

  return { ...graph, nodes: newNodes };
}

/**
 * Expands all nodes up to a certain depth
 */
export function expandToDepth(
  graph: VisualizerGraph,
  maxDepth: number
): VisualizerGraph {
  const newNodes = new Map<string, VisualizerNode>();

  graph.nodes.forEach((node, id) => {
    newNodes.set(id, { ...node, isExpanded: node.depth < maxDepth });
  });

  return { ...graph, nodes: newNodes };
}

/**
 * Collapses all nodes except root
 */
export function collapseAll(graph: VisualizerGraph): VisualizerGraph {
  const newNodes = new Map<string, VisualizerNode>();

  graph.nodes.forEach((node, id) => {
    newNodes.set(id, { ...node, isExpanded: id === graph.rootId });
  });

  return { ...graph, nodes: newNodes };
}

/**
 * Selects a node and highlights path to root
 */
export function selectNode(
  graph: VisualizerGraph,
  nodeId: string | null,
  highlightPath: boolean = true
): VisualizerGraph {
  const newNodes = new Map<string, VisualizerNode>();
  const pathToRoot = new Set<string>();

  // Build path to root if highlighting
  if (nodeId && highlightPath) {
    let currentId: string | null = nodeId;
    while (currentId) {
      pathToRoot.add(currentId);
      const node = graph.nodes.get(currentId);
      currentId = node?.parentId ?? null;
    }
  }

  graph.nodes.forEach((node, id) => {
    newNodes.set(id, {
      ...node,
      isSelected: id === nodeId,
      isHighlighted: pathToRoot.has(id),
    });
  });

  return { ...graph, nodes: newNodes };
}

/**
 * Gets the path string for a node (e.g., "root.users[0].name")
 */
export function getNodePathString(node: VisualizerNode): string {
  if (node.path.length === 0) return 'root';

  return 'root' + node.path.map((segment) => {
    if (typeof segment === 'number') {
      return `[${segment}]`;
    }
    return `.${segment}`;
  }).join('');
}

/**
 * Formats a JSON value for display
 */
export function formatValueForDisplay(
  value: JsonValue,
  maxLength: number = 50
): string {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    const display = value.length > maxLength 
      ? value.substring(0, maxLength) + '...' 
      : value;
    return `"${display}"`;
  }
  if (Array.isArray(value)) {
    return `Array (${value.length})`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    return `Object (${keys.length})`;
  }
  return String(value);
}

/**
 * Gets the count of descendants for a node
 */
export function getDescendantCount(
  graph: VisualizerGraph,
  nodeId: string
): number {
  let count = 0;
  const queue: string[] = [nodeId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId) continue;

    const node = graph.nodes.get(currentId);
    if (!node) continue;

    count += node.childrenIds.length;
    queue.push(...node.childrenIds);
  }

  return count;
}
