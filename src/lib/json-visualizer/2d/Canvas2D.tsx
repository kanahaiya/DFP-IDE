'use client';

import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
  NodeTypes,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { JsonNode2D } from './nodes/JsonNode2D';
import type { VisualizerNode, VisualizerEdge, Position3D } from '../types';
import { NODE_TYPE_COLORS } from '../types';

interface Canvas2DProps {
  nodes: VisualizerNode[];
  edges: VisualizerEdge[];
  positions: Map<string, Position3D>;
  showTypes: boolean;
  showValues: boolean;
  selectedNodeId: string | null;
  onToggleExpand: (nodeId: string) => void;
  onSelectNode: (nodeId: string | null) => void;
  onHoverNode?: (nodeId: string | null) => void;
}

// Define custom node types
const nodeTypes: NodeTypes = {
  jsonNode: JsonNode2D,
};

export function Canvas2D({
  nodes,
  edges,
  positions,
  showTypes,
  showValues,
  selectedNodeId,
  onToggleExpand,
  onSelectNode,
  onHoverNode,
}: Canvas2DProps) {
  // Convert visualizer nodes to ReactFlow nodes
  const flowNodes: Node[] = useMemo(() => {
    return nodes.map((node) => {
      const position = positions.get(node.id) || { x: 0, y: 0 };
      return {
        id: node.id,
        type: 'jsonNode',
        position: { x: position.x, y: position.y },
        data: {
          node,
          showTypes,
          showValues,
          onToggleExpand,
          onSelect: onSelectNode,
        },
        selected: node.id === selectedNodeId,
      };
    });
  }, [nodes, positions, showTypes, showValues, selectedNodeId, onToggleExpand, onSelectNode]);

  // Convert visualizer edges to ReactFlow edges
  const flowEdges: Edge[] = useMemo(() => {
    return edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const edgeColor = sourceNode ? NODE_TYPE_COLORS[sourceNode.type] : '#888';

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: edgeColor,
          strokeWidth: 2,
          opacity: 0.6,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 15,
          height: 15,
        },
      };
    });
  }, [edges, nodes]);

  // ReactFlow state
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(flowNodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Update nodes when props change
  useEffect(() => {
    setRfNodes(flowNodes);
  }, [flowNodes, setRfNodes]);

  useEffect(() => {
    setRfEdges(flowEdges);
  }, [flowEdges, setRfEdges]);

  // Handle node click
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onSelectNode(node.id);
    },
    [onSelectNode]
  );

  // Handle pane click (deselect)
  const handlePaneClick = useCallback(() => {
    onSelectNode(null);
  }, [onSelectNode]);

  // Handle node mouse events
  const handleNodeMouseEnter = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onHoverNode?.(node.id);
    },
    [onHoverNode]
  );

  const handleNodeMouseLeave = useCallback(() => {
    onHoverNode?.(null);
  }, [onHoverNode]);

  // MiniMap node color
  const nodeColor = useCallback((node: Node) => {
    const vizNode = nodes.find((n) => n.id === node.id);
    return vizNode ? NODE_TYPE_COLORS[vizNode.type] : '#888';
  }, [nodes]);

  return (
    <div className="canvas-2d-container">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Controls />
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={3}
          zoomable
          pannable
          style={{
            backgroundColor: 'var(--card)',
            borderRadius: '8px',
          }}
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>

      <style jsx>{`
        .canvas-2d-container {
          width: 100%;
          height: 100%;
          background: var(--bg);
        }

        :global(.react-flow__node) {
          cursor: pointer;
        }

        :global(.react-flow__controls) {
          background: var(--card);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        :global(.react-flow__controls-button) {
          background: var(--card);
          border-color: var(--border);
          color: var(--text);
        }

        :global(.react-flow__controls-button:hover) {
          background: var(--hover);
        }

        :global(.react-flow__minimap) {
          border: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}
