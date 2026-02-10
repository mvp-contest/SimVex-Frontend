"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface BoundingBoxHelperProps {
  box: THREE.Box3;
  color?: string;
  opacity?: number;
}

export default function BoundingBoxHelper({
  box,
  color = "#4a9eff",
  opacity = 0.6,
}: BoundingBoxHelperProps) {
  const geometry = useMemo(() => {
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    if (size.x <= 0 || size.y <= 0 || size.z <= 0) return null;

    const boxGeo = new THREE.BoxGeometry(size.x, size.y, size.z);
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    boxGeo.dispose();

    return { edges: edgesGeo, position: center.toArray() as [number, number, number] };
  }, [box]);

  if (!geometry) return null;

  return (
    <lineSegments position={geometry.position}>
      <primitive object={geometry.edges} attach="geometry" />
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthTest={false}
      />
    </lineSegments>
  );
}
