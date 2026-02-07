/**
 * Force-Directed Layout Algorithm
 * Physics-based layout for both 2D and 3D modes
 */

import type {
  VisualizerGraph,
  Position3D,
  LayoutResult,
  VisualizationMode,
} from '../types';
import { getVisibleNodes, getVisibleEdges } from '../parser';

interface ForceLayoutOptions {
  mode: VisualizationMode;
  strength: number;
  linkDistance: number;
  iterations: number;
  centerForce: number;
  repulsionForce: number;
}

const DEFAULT_OPTIONS: ForceLayoutOptions = {
  mode: '2d',
  strength: -300,
  linkDistance: 100,
  iterations: 300,
  centerForce: 0.1,
  repulsionForce: 100,
};

interface ForceNode {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  fixed: boolean;
}

/**
 * Simple force-directed layout simulation
 * This is a basic implementation; for production, d3-force could be used
 */
export function applyForceLayout(
  graph: VisualizerGraph,
  options: Partial<ForceLayoutOptions> = {}
): LayoutResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const positions = new Map<string, Position3D>();

  // Get visible nodes and edges
  const visibleNodes = getVisibleNodes(graph);
  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = getVisibleEdges(graph, visibleNodeIds);

  if (visibleNodes.length === 0) {
    return {
      positions,
      bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 },
    };
  }

  // Initialize force nodes with random positions
  const forceNodes: Map<string, ForceNode> = new Map();
  visibleNodes.forEach((node, index) => {
    const angle = (index / visibleNodes.length) * Math.PI * 2;
    const radius = 200 + node.depth * 50;
    
    forceNodes.set(node.id, {
      id: node.id,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: opts.mode === '3d' ? (Math.random() - 0.5) * 200 : 0,
      vx: 0,
      vy: 0,
      vz: 0,
      fixed: node.id === graph.rootId, // Fix root at center
    });
  });

  // Fix root at center
  const rootForceNode = forceNodes.get(graph.rootId);
  if (rootForceNode) {
    rootForceNode.x = 0;
    rootForceNode.y = 0;
    rootForceNode.z = 0;
  }

  // Run simulation
  const damping = 0.9;
  const minDistance = 30;

  for (let i = 0; i < opts.iterations; i++) {
    const alpha = 1 - i / opts.iterations; // Cooling factor

    // Apply repulsion between all nodes
    visibleNodes.forEach((nodeA) => {
      const forceA = forceNodes.get(nodeA.id);
      if (!forceA || forceA.fixed) return;

      visibleNodes.forEach((nodeB) => {
        if (nodeA.id === nodeB.id) return;
        const forceB = forceNodes.get(nodeB.id);
        if (!forceB) return;

        const dx = forceA.x - forceB.x;
        const dy = forceA.y - forceB.y;
        const dz = opts.mode === '3d' ? forceA.z - forceB.z : 0;
        
        let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distance < minDistance) distance = minDistance;

        const force = (opts.repulsionForce * alpha) / (distance * distance);

        forceA.vx += (dx / distance) * force;
        forceA.vy += (dy / distance) * force;
        if (opts.mode === '3d') {
          forceA.vz += (dz / distance) * force;
        }
      });
    });

    // Apply attraction along edges
    visibleEdges.forEach((edge) => {
      const sourceNode = forceNodes.get(edge.source);
      const targetNode = forceNodes.get(edge.target);
      if (!sourceNode || !targetNode) return;

      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      const dz = opts.mode === '3d' ? targetNode.z - sourceNode.z : 0;
      
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (distance === 0) return;

      const force = ((distance - opts.linkDistance) * alpha) / distance * 0.5;

      if (!sourceNode.fixed) {
        sourceNode.vx += dx * force;
        sourceNode.vy += dy * force;
        if (opts.mode === '3d') {
          sourceNode.vz += dz * force;
        }
      }

      if (!targetNode.fixed) {
        targetNode.vx -= dx * force;
        targetNode.vy -= dy * force;
        if (opts.mode === '3d') {
          targetNode.vz -= dz * force;
        }
      }
    });

    // Apply center force
    forceNodes.forEach((node) => {
      if (node.fixed) return;
      node.vx -= node.x * opts.centerForce * alpha;
      node.vy -= node.y * opts.centerForce * alpha;
      if (opts.mode === '3d') {
        node.vz -= node.z * opts.centerForce * alpha;
      }
    });

    // Update positions
    forceNodes.forEach((node) => {
      if (node.fixed) return;
      
      node.vx *= damping;
      node.vy *= damping;
      node.vz *= damping;

      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;
    });
  }

  // Extract final positions
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  forceNodes.forEach((node, id) => {
    positions.set(id, { x: node.x, y: node.y, z: node.z });
    minX = Math.min(minX, node.x);
    maxX = Math.max(maxX, node.x);
    minY = Math.min(minY, node.y);
    maxY = Math.max(maxY, node.y);
    minZ = Math.min(minZ, node.z);
    maxZ = Math.max(maxZ, node.z);
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
 * Applies 3D force layout specifically
 */
export function apply3DForceLayout(
  graph: VisualizerGraph,
  options: Partial<Omit<ForceLayoutOptions, 'mode'>> = {}
): LayoutResult {
  return applyForceLayout(graph, { ...options, mode: '3d' });
}
