"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface OverlapRegionProps {
  box: THREE.Box3;
  color?: string;
  opacity?: number;
}

export default function OverlapRegion({
  box,
  color = "#ef4444",
  opacity = 0.25,
}: OverlapRegionProps) {
  const { position, size } = useMemo(() => {
    const center = new THREE.Vector3();
    const dimensions = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(dimensions);
    return {
      position: center.toArray() as [number, number, number],
      size: dimensions.toArray() as [number, number, number],
    };
  }, [box]);

  if (size[0] <= 0.001 || size[1] <= 0.001 || size[2] <= 0.001) return null;

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
