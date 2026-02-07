/**
 * Layout Algorithms - Public API
 */

export { applyTreeLayout, apply3DTreeLayout } from './treeLayout';
export { applyForceLayout, apply3DForceLayout } from './forceLayout';
export { applyRadialLayout, apply3DRadialLayout } from './radialLayout';
export { applyTreemapLayout } from './treemapLayout';

import type {
  VisualizerGraph,
  LayoutResult,
  LayoutType,
  VisualizationMode,
  TreeOrientation,
} from '../types';

import { applyTreeLayout } from './treeLayout';
import { applyForceLayout } from './forceLayout';
import { applyRadialLayout } from './radialLayout';
import { applyTreemapLayout } from './treemapLayout';

export interface LayoutOptions {
  mode: VisualizationMode;
  layout: LayoutType;
  treeOrientation?: TreeOrientation;
  nodeSpacing?: number;
  levelSpacing?: number;
  forceStrength?: number;
  width?: number;
  height?: number;
}

/**
 * Applies the specified layout to a graph
 */
export function applyLayout(
  graph: VisualizerGraph,
  options: LayoutOptions
): LayoutResult {
  const { mode, layout } = options;

  switch (layout) {
    case 'tree':
      return applyTreeLayout(graph, {
        mode,
        orientation: options.treeOrientation || 'horizontal',
        nodeSpacing: options.nodeSpacing || 80,
        levelSpacing: options.levelSpacing || 150,
      });

    case 'force':
      return applyForceLayout(graph, {
        mode,
        strength: options.forceStrength || -300,
      });

    case 'radial':
      return applyRadialLayout(graph, {
        mode,
        levelSpacing: options.levelSpacing || 100,
      });

    case 'treemap':
      // Treemap is 2D only, return tree layout for 3D
      if (mode === '3d') {
        return applyTreeLayout(graph, { mode: '3d' });
      }
      const result = applyTreemapLayout(graph, {
        width: options.width || 800,
        height: options.height || 600,
      });
      return {
        positions: result.positions,
        bounds: result.bounds,
      };

    default:
      return applyTreeLayout(graph, { mode });
  }
}
