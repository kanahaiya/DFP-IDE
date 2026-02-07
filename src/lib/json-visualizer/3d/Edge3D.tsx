'use client';

import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { NodeDataType } from '../types';
import { NODE_TYPE_COLORS_3D } from '../types';

interface Edge3DProps {
  sourcePosition: [number, number, number];
  targetPosition: [number, number, number];
  sourceType: NodeDataType;
  isHighlighted: boolean;
  animated?: boolean;
}

export function Edge3D({
  sourcePosition,
  targetPosition,
  sourceType,
  isHighlighted,
}: Edge3DProps) {
  const color = NODE_TYPE_COLORS_3D[sourceType];

  // Create curve points for the edge
  const points = useMemo(() => {
    const start = new THREE.Vector3(...sourcePosition);
    const end = new THREE.Vector3(...targetPosition);
    
    // Create a curved path
    const midPoint = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5);
    
    // Add some curve by offsetting the midpoint
    const direction = new THREE.Vector3().subVectors(end, start);
    const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
    midPoint.add(perpendicular.multiplyScalar(direction.length() * 0.1));

    const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
    return curve.getPoints(20).map(p => [p.x, p.y, p.z] as [number, number, number]);
  }, [sourcePosition, targetPosition]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={isHighlighted ? 3 : 1.5}
      opacity={isHighlighted ? 0.9 : 0.4}
      transparent
    />
  );
}
