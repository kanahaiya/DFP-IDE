'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useJsonVisualizerStore } from '@/store/jsonVisualizer';

// Dynamic imports for heavy 2D/3D components
const Canvas2D = dynamic(
  () => import('@/lib/json-visualizer/2d').then((mod) => ({ default: mod.Canvas2D })),
  {
    ssr: false,
    loading: () => <CanvasLoader />,
  }
);

const Canvas3D = dynamic(
  () => import('@/lib/json-visualizer/3d').then((mod) => ({ default: mod.Canvas3D })),
  {
    ssr: false,
    loading: () => <CanvasLoader />,
  }
);

function CanvasLoader() {
  return (
    <div className="canvas-loader">
      <div className="loader-content">
        <div className="loader-spinner" />
        <span>Loading visualization...</span>
      </div>
      <style jsx>{`
        .canvas-loader {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
        }
        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
        }
        .loader-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function VisualizerCanvas() {
  const {
    graph,
    visibleNodes,
    visibleEdges,
    positions,
    selectedNodeId,
    settings,
    toggleExpansion,
    selectNodeById,
    setHoveredNode,
  } = useJsonVisualizerStore();

  // Empty state
  if (!graph || visibleNodes.length === 0) {
    return (
      <div className="empty-canvas">
        <div className="empty-content">
          <i className="fas fa-project-diagram" />
          <h3>No Data to Visualize</h3>
          <p>Enter valid JSON in the input panel to see the visualization.</p>
        </div>
        <style jsx>{`
          .empty-canvas {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg);
          }
          .empty-content {
            text-align: center;
            color: var(--text-secondary);
          }
          .empty-content i {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.3;
          }
          .empty-content h3 {
            margin: 0 0 8px 0;
            color: var(--text);
          }
          .empty-content p {
            margin: 0;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  // Render appropriate canvas based on mode
  if (settings.mode === '3d') {
    return (
      <Canvas3D
        nodes={visibleNodes}
        edges={visibleEdges}
        positions={positions}
        showLabels={true}
        showTypes={settings.showTypes}
        selectedNodeId={selectedNodeId}
        autoRotate={settings.autoRotate}
        rotationSpeed={settings.rotationSpeed}
        onSelectNode={selectNodeById}
        onHoverNode={setHoveredNode}
      />
    );
  }

  return (
    <Canvas2D
      nodes={visibleNodes}
      edges={visibleEdges}
      positions={positions}
      showTypes={settings.showTypes}
      showValues={settings.showValues}
      selectedNodeId={selectedNodeId}
      onToggleExpand={toggleExpansion}
      onSelectNode={selectNodeById}
      onHoverNode={setHoveredNode}
    />
  );
}
