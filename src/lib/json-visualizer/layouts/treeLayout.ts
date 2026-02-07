/**
 * Tree Layout Algorithm
 * Hierarchical tree layout for both 2D and 3D modes
 */

import type {
  VisualizerGraph,
  Position3D,
  LayoutResult,
  TreeOrientation,
  VisualizationMode,
} from '../types';
import { getVisibleNodes } from '../parser';

interface TreeLayoutOptions {
  mode: VisualizationMode;
  orientation: TreeOrientation;
  nodeSpacing: number;
  levelSpacing: number;
  centerRoot: boolean;
}

const DEFAULT_OPTIONS: TreeLayoutOptions = {
  mode: '2d',
  orientation: 'horizontal',
  nodeSpacing: 80,
  levelSpacing: 150,
  centerRoot: true,
};

/**
 * Calculates subtree width (number of leaf nodes)
 */
function calculateSubtreeWidth(
  graph: VisualizerGraph,
  nodeId: string,
  visibleNodeIds: Set<string>
): number {
  const node = graph.nodes.get(nodeId);
  if (!node) return 0;

  // If not expanded or no visible children, count as 1
  const visibleChildren = node.childrenIds.filter((id) => visibleNodeIds.has(id));
  if (visibleChildren.length === 0) {
    return 1;
  }

  // Sum widths of all visible children
  return visibleChildren.reduce(
    (sum, childId) => sum + calculateSubtreeWidth(graph, childId, visibleNodeIds),
    0
  );
}

/**
 * Recursively positions nodes in tree layout
 */
function positionNode(
  graph: VisualizerGraph,
  nodeId: string,
  x: number,
  y: number,
  z: number,
  visibleNodeIds: Set<string>,
  positions: Map<string, Position3D>,
  options: TreeLayoutOptions,
  subtreeWidths: Map<string, number>
): void {
  const node = graph.nodes.get(nodeId);
  if (!node) return;

  positions.set(nodeId, { x, y, z });

  const visibleChildren = node.childrenIds.filter((id) => visibleNodeIds.has(id));
  if (visibleChildren.length === 0) return;

  // Calculate total width of all children
  const totalWidth = visibleChildren.reduce(
    (sum, childId) => sum + (subtreeWidths.get(childId) || 1),
    0
  );

  // Calculate starting position
  let currentOffset = -((totalWidth - 1) * options.nodeSpacing) / 2;

  // Position each child
  visibleChildren.forEach((childId) => {
    const childWidth = subtreeWidths.get(childId) || 1;
    const childOffset = currentOffset + ((childWidth - 1) * options.nodeSpacing) / 2;

    let childX: number, childY: number, childZ: number;

    if (options.mode === '3d') {
      // 3D tree layout - spread in XZ plane, depth in Y
      childX = x + childOffset;
      childY = y - options.levelSpacing;
      childZ = z;
    } else if (options.orientation === 'horizontal') {
      // 2D horizontal tree (left to right)
      childX = x + options.levelSpacing;
      childY = y + childOffset;
      childZ = 0;
    } else {
      // 2D vertical tree (top to bottom)
      childX = x + childOffset;
      childY = y + options.levelSpacing;
      childZ = 0;
    }

    positionNode(
      graph,
      childId,
      childX,
      childY,
      childZ,
      visibleNodeIds,
      positions,
      options,
      subtreeWidths
    );

    currentOffset += childWidth * options.nodeSpacing;
  });
}

/**
 * Applies tree layout to a graph
 */
export function applyTreeLayout(
  graph: VisualizerGraph,
  options: Partial<TreeLayoutOptions> = {}
): LayoutResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const positions = new Map<string, Position3D>();

  // Get visible nodes
  const visibleNodes = getVisibleNodes(graph);
  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));

  if (visibleNodes.length === 0) {
    return {
      positions,
      bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 },
    };
  }

  // Calculate subtree widths for all visible nodes
  const subtreeWidths = new Map<string, number>();
  visibleNodes.forEach((node) => {
    subtreeWidths.set(
      node.id,
      calculateSubtreeWidth(graph, node.id, visibleNodeIds)
    );
  });

  // Position nodes starting from root
  const rootPosition: Position3D = opts.mode === '3d' 
    ? { x: 0, y: 200, z: 0 } // 3D starts from top
    : { x: 0, y: 0, z: 0 };

  positionNode(
    graph,
    graph.rootId,
    rootPosition.x,
    rootPosition.y,
    rootPosition.z,
    visibleNodeIds,
    positions,
    opts,
    subtreeWidths
  );

  // Calculate bounds
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  positions.forEach((pos) => {
    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x);
    minY = Math.min(minY, pos.y);
    maxY = Math.max(maxY, pos.y);
    minZ = Math.min(minZ, pos.z);
    maxZ = Math.max(maxZ, pos.z);
  });

  return {
    positions,
    bounds: {
      minX: isFinite(minX) ? minX : 0,
      maxX: isFinite(maxX) ? maxX : 0,
      minY: isFinite(minY) ? minY : 0,
      maxY: isFinite(maxY) ? maxY : 0,
      minZ: isFinite(minZ) ? minZ : 0,
      maxZ: isFinite(maxZ) ? maxZ : 0,
    },
  };
}

/**
 * Applies 3D tree layout specifically
 */
export function apply3DTreeLayout(
  graph: VisualizerGraph,
  options: Partial<Omit<TreeLayoutOptions, 'mode'>> = {}
): LayoutResult {
  return applyTreeLayout(graph, { ...options, mode: '3d' });
}
