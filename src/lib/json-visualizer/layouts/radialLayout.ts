/**
 * Radial Layout Algorithm
 * Circular/spherical layout for both 2D and 3D modes
 */

import type {
  VisualizerGraph,
  Position3D,
  LayoutResult,
  VisualizationMode,
} from '../types';
import { getVisibleNodes } from '../parser';

interface RadialLayoutOptions {
  mode: VisualizationMode;
  levelSpacing: number;
  startAngle: number;
  endAngle: number;
  rotateLabels: boolean;
}

const DEFAULT_OPTIONS: RadialLayoutOptions = {
  mode: '2d',
  levelSpacing: 100,
  startAngle: 0,
  endAngle: Math.PI * 2,
  rotateLabels: true,
};

// RadialNode interface for future enhancements
// interface RadialNode {
//   id: string;
//   depth: number;
//   startAngle: number;
//   endAngle: number;
//   childCount: number;
// }

/**
 * Calculates the angular span needed for a subtree
 */
function calculateSubtreeSpan(
  graph: VisualizerGraph,
  nodeId: string,
  visibleNodeIds: Set<string>
): number {
  const node = graph.nodes.get(nodeId);
  if (!node) return 0;

  const visibleChildren = node.childrenIds.filter((id) => visibleNodeIds.has(id));
  if (visibleChildren.length === 0) {
    return 1; // Leaf nodes have a span of 1
  }

  return visibleChildren.reduce(
    (sum, childId) => sum + calculateSubtreeSpan(graph, childId, visibleNodeIds),
    0
  );
}

/**
 * Recursively positions nodes in radial layout
 */
function positionRadialNode(
  graph: VisualizerGraph,
  nodeId: string,
  depth: number,
  startAngle: number,
  angularSpan: number,
  visibleNodeIds: Set<string>,
  positions: Map<string, Position3D>,
  options: RadialLayoutOptions,
  subtreeSpans: Map<string, number>
): void {
  const node = graph.nodes.get(nodeId);
  if (!node) return;

  const radius = depth * options.levelSpacing;
  const midAngle = startAngle + angularSpan / 2;

  let x: number, y: number, z: number;

  if (options.mode === '3d') {
    // 3D spherical layout
    // Use phi (horizontal angle) and theta (vertical angle)
    const phi = midAngle; // Horizontal rotation
    const theta = Math.PI / 2 - (depth * 0.3); // Tilt based on depth
    
    x = radius * Math.sin(theta) * Math.cos(phi);
    y = radius * Math.cos(theta);
    z = radius * Math.sin(theta) * Math.sin(phi);
  } else {
    // 2D circular layout
    x = radius * Math.cos(midAngle);
    y = radius * Math.sin(midAngle);
    z = 0;
  }

  positions.set(nodeId, { x, y, z });

  // Position children
  const visibleChildren = node.childrenIds.filter((id) => visibleNodeIds.has(id));
  if (visibleChildren.length === 0) return;

  const totalSpan = visibleChildren.reduce(
    (sum, childId) => sum + (subtreeSpans.get(childId) || 1),
    0
  );

  let currentAngle = startAngle;

  visibleChildren.forEach((childId) => {
    const childSpan = subtreeSpans.get(childId) || 1;
    const childAngularSpan = (childSpan / totalSpan) * angularSpan;

    positionRadialNode(
      graph,
      childId,
      depth + 1,
      currentAngle,
      childAngularSpan,
      visibleNodeIds,
      positions,
      options,
      subtreeSpans
    );

    currentAngle += childAngularSpan;
  });
}

/**
 * Applies radial layout to a graph
 */
export function applyRadialLayout(
  graph: VisualizerGraph,
  options: Partial<RadialLayoutOptions> = {}
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

  // Calculate subtree spans for all visible nodes
  const subtreeSpans = new Map<string, number>();
  visibleNodes.forEach((node) => {
    subtreeSpans.set(
      node.id,
      calculateSubtreeSpan(graph, node.id, visibleNodeIds)
    );
  });

  // Position root at center
  positions.set(graph.rootId, { x: 0, y: 0, z: 0 });

  // Position children of root
  const rootNode = graph.nodes.get(graph.rootId);
  if (rootNode) {
    const visibleChildren = rootNode.childrenIds.filter((id) => visibleNodeIds.has(id));
    
    if (visibleChildren.length > 0) {
      const totalSpan = visibleChildren.reduce(
        (sum, childId) => sum + (subtreeSpans.get(childId) || 1),
        0
      );

      let currentAngle = opts.startAngle;
      const angularRange = opts.endAngle - opts.startAngle;

      visibleChildren.forEach((childId) => {
        const childSpan = subtreeSpans.get(childId) || 1;
        const childAngularSpan = (childSpan / totalSpan) * angularRange;

        positionRadialNode(
          graph,
          childId,
          1,
          currentAngle,
          childAngularSpan,
          visibleNodeIds,
          positions,
          opts,
          subtreeSpans
        );

        currentAngle += childAngularSpan;
      });
    }
  }

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
 * Applies 3D radial (spherical) layout specifically
 */
export function apply3DRadialLayout(
  graph: VisualizerGraph,
  options: Partial<Omit<RadialLayoutOptions, 'mode'>> = {}
): LayoutResult {
  return applyRadialLayout(graph, { ...options, mode: '3d' });
}
