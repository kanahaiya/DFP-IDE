'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { VisualizerNode, NodeDataType } from '../../types';
import { NODE_TYPE_COLORS_3D } from '../../types';
import { formatValueForDisplay } from '../../parser';

interface JsonNode3DProps {
  node: VisualizerNode;
  position: [number, number, number];
  showLabel: boolean;
  showTypes: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (nodeId: string) => void;
  onHover?: (nodeId: string | null) => void;
}

// Shape mapping for different node types
const NODE_SHAPES: Record<NodeDataType, 'sphere' | 'box' | 'octahedron' | 'cone' | 'cylinder' | 'torus'> = {
  object: 'box',
  array: 'cylinder',
  string: 'sphere',
  number: 'octahedron',
  boolean: 'cone',
  null: 'torus',
};

export function JsonNode3D({
  node,
  position,
  showLabel,
  showTypes,
  isSelected,
  isHighlighted,
  onSelect,
  onHover,
}: JsonNode3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = useMemo(() => NODE_TYPE_COLORS_3D[node.type], [node.type]);
  const shape = NODE_SHAPES[node.type];
  
  // Calculate size based on number of children
  const size = useMemo(() => {
    const baseSize = 0.5;
    const childFactor = Math.log2(node.childrenIds.length + 1) * 0.2;
    return baseSize + childFactor;
  }, [node.childrenIds.length]);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0] * 0.1) * 0.1;
      
      // Pulse when selected
      if (isSelected) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
      }
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(node.id);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover?.(node.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(null);
    document.body.style.cursor = 'auto';
  };

  // Render geometry based on type
  const renderGeometry = () => {
    switch (shape) {
      case 'box':
        return <boxGeometry args={[size, size, size]} />;
      case 'cylinder':
        return <cylinderGeometry args={[size * 0.5, size * 0.5, size, 16]} />;
      case 'sphere':
        return <sphereGeometry args={[size * 0.6, 16, 16]} />;
      case 'octahedron':
        return <octahedronGeometry args={[size * 0.7]} />;
      case 'cone':
        return <coneGeometry args={[size * 0.5, size, 16]} />;
      case 'torus':
        return <torusGeometry args={[size * 0.4, size * 0.15, 8, 16]} />;
      default:
        return <sphereGeometry args={[size * 0.6, 16, 16]} />;
    }
  };

  const labelText = showTypes ? `${node.key} (${node.type})` : node.key;

  return (
    <group position={position}>
      {/* Main mesh */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={color}
          emissive={isSelected || hovered ? color : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0}
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={isHighlighted ? 1 : 0.85}
        />
      </mesh>

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.2, size * 1.4, 32]} />
          <meshBasicMaterial color="#FFD700" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Label */}
      {showLabel && (
        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
        >
          <Text
            position={[0, size + 0.3, 0]}
            fontSize={0.25}
            color="#FFFFFF"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {labelText}
          </Text>
        </Billboard>
      )}

      {/* Hover tooltip with details */}
      {hovered && (
        <Html
          position={[0, size + 0.8, 0]}
          center
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div className="node-tooltip">
            <div className="tooltip-key">{node.key}</div>
            <div className="tooltip-type" style={{ color }}>
              {node.type}
            </div>
            {node.type !== 'object' && node.type !== 'array' && (
              <div className="tooltip-value">
                {formatValueForDisplay(node.value, 50)}
              </div>
            )}
            {(node.type === 'object' || node.type === 'array') && (
              <div className="tooltip-children">
                {node.childrenIds.length} {node.type === 'array' ? 'items' : 'properties'}
              </div>
            )}
          </div>
        </Html>
      )}

      <style jsx global>{`
        .node-tooltip {
          background: rgba(0, 0, 0, 0.85);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          min-width: 100px;
          backdrop-filter: blur(4px);
        }

        .tooltip-key {
          font-weight: 600;
          color: white;
          margin-bottom: 4px;
        }

        .tooltip-type {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 500;
        }

        .tooltip-value {
          margin-top: 4px;
          font-family: 'Fira Code', monospace;
          color: #A0A0A0;
          font-size: 11px;
        }

        .tooltip-children {
          margin-top: 4px;
          color: #888;
          font-size: 10px;
        }
      `}</style>
    </group>
  );
}
