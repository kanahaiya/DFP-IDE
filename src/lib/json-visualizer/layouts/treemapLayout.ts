/**
 * Treemap Layout Algorithm
 * Rectangular subdivision layout (2D only)
 */

import type {
  VisualizerGraph,
  Position3D,
  LayoutResult,
} from '../types';
import { getVisibleNodes, getDescendantCount } from '../parser';

interface TreemapLayoutOptions {
  width: number;
  height: number;
  padding: number;
  minCellSize: number;
}

const DEFAULT_OPTIONS: TreemapLayoutOptions = {
  width: 800,
  height: 600,
  padding: 4,
  minCellSize: 20,
};

interface TreemapRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Calculates the weight of a node for treemap sizing
 */
function calculateNodeWeight(
  graph: VisualizerGraph,
  nodeId: string
): number {
  const node = graph.nodes.get(nodeId);
  if (!node) return 1;

  // Weight based on descendant count + 1 (for self)
  return getDescendantCount(graph, nodeId) + 1;
}

/**
 * Squarified treemap algorithm
 * Attempts to create rectangles with aspect ratios close to 1
 */
function squarify(
  items: { id: string; weight: number }[],
  rect: TreemapRect,
  positions: Map<string, Position3D & { width: number; height: number }>,
  padding: number
): void {
  if (items.length === 0 || rect.width < 1 || rect.height < 1) return;

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) return;

  // Determine whether to split horizontally or vertically
  const isHorizontal = rect.width >= rect.height;

  let currentRow: typeof items = [];
  const remainingItems = [...items];
  const currentRect = { ...rect };

  while (remainingItems.length > 0) {
    const item = remainingItems[0];
    const testRow = [...currentRow, item];
    
    // Calculate worst aspect ratio for current row vs with new item
    const currentWorst = currentRow.length > 0 
      ? worstAspectRatio(currentRow, currentRect, totalWeight, isHorizontal)
      : Infinity;
    const testWorst = worstAspectRatio(testRow, currentRect, totalWeight, isHorizontal);

    if (currentRow.length === 0 || testWorst <= currentWorst) {
      // Adding item improves or maintains aspect ratio
      currentRow.push(item);
      remainingItems.shift();
    } else {
      // Lay out current row and start new row
      const rowRect = layoutRow(currentRow, currentRect, totalWeight, isHorizontal, positions, padding);
      
      // Update remaining rectangle
      if (isHorizontal) {
        currentRect.x += rowRect.width;
        currentRect.width -= rowRect.width;
      } else {
        currentRect.y += rowRect.height;
        currentRect.height -= rowRect.height;
      }
      
      currentRow = [];
    }
  }

  // Lay out final row
  if (currentRow.length > 0) {
    layoutRow(currentRow, currentRect, totalWeight, isHorizontal, positions, padding);
  }
}

/**
 * Calculates the worst aspect ratio in a row
 */
function worstAspectRatio(
  row: { id: string; weight: number }[],
  rect: TreemapRect,
  totalWeight: number,
  isHorizontal: boolean
): number {
  if (row.length === 0) return Infinity;

  const rowWeight = row.reduce((sum, item) => sum + item.weight, 0);
  const rowArea = (rowWeight / totalWeight) * rect.width * rect.height;

  const rowDimension = isHorizontal 
    ? rowArea / rect.height 
    : rowArea / rect.width;

  let worst = 0;
  row.forEach((item) => {
    const itemArea = (item.weight / totalWeight) * rect.width * rect.height;
    const itemDimension = itemArea / rowDimension;
    const aspectRatio = Math.max(
      rowDimension / itemDimension,
      itemDimension / rowDimension
    );
    worst = Math.max(worst, aspectRatio);
  });

  return worst;
}

/**
 * Lays out a row of items and returns the rectangle used
 */
function layoutRow(
  row: { id: string; weight: number }[],
  rect: TreemapRect,
  totalWeight: number,
  isHorizontal: boolean,
  positions: Map<string, Position3D & { width: number; height: number }>,
  padding: number
): TreemapRect {
  const rowWeight = row.reduce((sum, item) => sum + item.weight, 0);
  const rowArea = (rowWeight / totalWeight) * rect.width * rect.height;

  let rowRect: TreemapRect;
  
  if (isHorizontal) {
    const rowWidth = rowArea / rect.height;
    rowRect = { x: rect.x, y: rect.y, width: rowWidth, height: rect.height };
    
    let currentY = rect.y;
    row.forEach((item) => {
      const itemHeight = (item.weight / rowWeight) * rect.height;
      positions.set(item.id, {
        x: rect.x + padding,
        y: currentY + padding,
        z: 0,
        width: Math.max(0, rowWidth - padding * 2),
        height: Math.max(0, itemHeight - padding * 2),
      });
      currentY += itemHeight;
    });
  } else {
    const rowHeight = rowArea / rect.width;
    rowRect = { x: rect.x, y: rect.y, width: rect.width, height: rowHeight };
    
    let currentX = rect.x;
    row.forEach((item) => {
      const itemWidth = (item.weight / rowWeight) * rect.width;
      positions.set(item.id, {
        x: currentX + padding,
        y: rect.y + padding,
        z: 0,
        width: Math.max(0, itemWidth - padding * 2),
        height: Math.max(0, rowHeight - padding * 2),
      });
      currentX += itemWidth;
    });
  }

  return rowRect;
}

/**
 * Applies treemap layout to a graph (2D only)
 */
export function applyTreemapLayout(
  graph: VisualizerGraph,
  options: Partial<TreemapLayoutOptions> = {}
): LayoutResult & { sizes: Map<string, { width: number; height: number }> } {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const positions = new Map<string, Position3D & { width: number; height: number }>();

  // Get visible nodes
  const visibleNodes = getVisibleNodes(graph);

  if (visibleNodes.length === 0) {
    return {
      positions: new Map(),
      sizes: new Map(),
      bounds: { minX: 0, maxX: opts.width, minY: 0, maxY: opts.height, minZ: 0, maxZ: 0 },
    };
  }

  // Calculate weights for all visible nodes
  const items = visibleNodes.map((node) => ({
    id: node.id,
    weight: calculateNodeWeight(graph, node.id),
  }));

  // Sort by weight descending for better layout
  items.sort((a, b) => b.weight - a.weight);

  // Apply squarified treemap algorithm
  const rect: TreemapRect = {
    x: 0,
    y: 0,
    width: opts.width,
    height: opts.height,
  };

  squarify(items, rect, positions, opts.padding);

  // Extract sizes and create position-only map
  const sizes = new Map<string, { width: number; height: number }>();
  const positionsOnly = new Map<string, Position3D>();

  positions.forEach((pos, id) => {
    sizes.set(id, { width: pos.width, height: pos.height });
    positionsOnly.set(id, { x: pos.x, y: pos.y, z: 0 });
  });

  return {
    positions: positionsOnly,
    sizes,
    bounds: {
      minX: 0,
      maxX: opts.width,
      minY: 0,
      maxY: opts.height,
      minZ: 0,
      maxZ: 0,
    },
  };
}
