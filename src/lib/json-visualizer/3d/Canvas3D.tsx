'use client';

import React, { Suspense, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { JsonNode3D } from './nodes/JsonNode3D';
import { Edge3D } from './Edge3D';
import type { VisualizerNode, VisualizerEdge, Position3D } from '../types';

interface Canvas3DProps {
  nodes: VisualizerNode[];
  edges: VisualizerEdge[];
  positions: Map<string, Position3D>;
  showLabels: boolean;
  showTypes: boolean;
  selectedNodeId: string | null;
  autoRotate: boolean;
  rotationSpeed: number;
  onSelectNode: (nodeId: string | null) => void;
  onHoverNode?: (nodeId: string | null) => void;
}

interface SceneProps extends Omit<Canvas3DProps, 'autoRotate' | 'rotationSpeed'> {
  autoRotate: boolean;
  rotationSpeed: number;
}

// Scene component that contains all 3D elements
function Scene({
  nodes,
  edges,
  positions,
  showLabels,
  showTypes,
  selectedNodeId,
  autoRotate,
  rotationSpeed,
  onSelectNode,
  onHoverNode,
}: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Auto-rotation
  useFrame(() => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed * 0.01;
    }
  });

  // Find highlighted nodes (path from selected to root)
  const highlightedNodeIds = useMemo(() => {
    const highlighted = new Set<string>();
    if (selectedNodeId) {
      let currentId: string | null = selectedNodeId;
      while (currentId) {
        highlighted.add(currentId);
        const node = nodes.find((n) => n.id === currentId);
        currentId = node?.parentId ?? null;
      }
    }
    return highlighted;
  }, [selectedNodeId, nodes]);

  // Click handler for background
  const handleBackgroundClick = useCallback(() => {
    onSelectNode(null);
  }, [onSelectNode]);

  return (
    <group ref={groupRef}>
      {/* Background click plane */}
      <mesh
        position={[0, 0, -100]}
        onClick={handleBackgroundClick}
        visible={false}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Render edges */}
      {edges.map((edge) => {
        const sourcePos = positions.get(edge.source);
        const targetPos = positions.get(edge.target);
        const sourceNode = nodes.find((n) => n.id === edge.source);

        if (!sourcePos || !targetPos || !sourceNode) return null;

        const isHighlighted = highlightedNodeIds.has(edge.source) && highlightedNodeIds.has(edge.target);

        return (
          <Edge3D
            key={edge.id}
            sourcePosition={[sourcePos.x * 0.02, sourcePos.y * 0.02, sourcePos.z * 0.02]}
            targetPosition={[targetPos.x * 0.02, targetPos.y * 0.02, targetPos.z * 0.02]}
            sourceType={sourceNode.type}
            isHighlighted={isHighlighted}
            animated={isHighlighted}
          />
        );
      })}

      {/* Render nodes */}
      {nodes.map((node) => {
        const pos = positions.get(node.id);
        if (!pos) return null;

        // Scale positions for 3D space
        const scaledPos: [number, number, number] = [
          pos.x * 0.02,
          pos.y * 0.02,
          pos.z * 0.02,
        ];

        return (
          <JsonNode3D
            key={node.id}
            node={node}
            position={scaledPos}
            showLabel={showLabels}
            showTypes={showTypes}
            isSelected={node.id === selectedNodeId}
            isHighlighted={highlightedNodeIds.has(node.id)}
            onSelect={onSelectNode}
            onHover={onHoverNode}
          />
        );
      })}
    </group>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#4F46E5" wireframe />
    </mesh>
  );
}

// Camera controls component
function CameraController({ autoRotate }: { autoRotate: boolean }) {
  const { camera } = useThree();

  // Set initial camera position
  React.useEffect(() => {
    camera.position.set(5, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.05}
      enableZoom
      enablePan
      minDistance={2}
      maxDistance={100}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
    />
  );
}

export function Canvas3D({
  nodes,
  edges,
  positions,
  showLabels,
  showTypes,
  selectedNodeId,
  autoRotate,
  rotationSpeed,
  onSelectNode,
  onHoverNode,
}: Canvas3DProps) {
  return (
    <div className="canvas-3d-container">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 60, near: 0.1, far: 1000 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <directionalLight position={[0, 10, 0]} intensity={0.5} />

        {/* Background */}
        <color attach="background" args={['#0a0a0f']} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />

        {/* Grid helper */}
        <Grid
          position={[0, -3, 0]}
          args={[50, 50]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#1a1a2e"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#2a2a4e"
          fadeDistance={50}
          fadeStrength={1}
        />

        {/* Camera controls */}
        <CameraController autoRotate={autoRotate} />

        {/* Scene content */}
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            nodes={nodes}
            edges={edges}
            positions={positions}
            showLabels={showLabels}
            showTypes={showTypes}
            selectedNodeId={selectedNodeId}
            autoRotate={false} // Rotation handled in Scene
            rotationSpeed={rotationSpeed}
            onSelectNode={onSelectNode}
            onHoverNode={onHoverNode}
          />
        </Suspense>
      </Canvas>

      <style jsx>{`
        .canvas-3d-container {
          width: 100%;
          height: 100%;
          background: #0a0a0f;
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
