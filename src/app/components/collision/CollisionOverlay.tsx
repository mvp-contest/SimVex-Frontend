"use client";

import type {
  CollisionPair,
  BoundingBoxInfo,
} from "@/hooks/useCollisionDetection";
import BoundingBoxHelper from "./BoundingBoxHelper";
import OverlapRegion from "./OverlapRegion";

interface CollisionOverlayProps {
  enabled: boolean;
  boundingBoxes: BoundingBoxInfo[];
  collisions: CollisionPair[];
  collidingModelIds: Set<string>;
}

export default function CollisionOverlay({
  enabled,
  boundingBoxes,
  collisions,
  collidingModelIds,
}: CollisionOverlayProps) {
  if (!enabled) return null;

  return (
    <group name="collision-overlay">
      {}
      {boundingBoxes.map(({ id, box }) => (
        <BoundingBoxHelper
          key={`bbox-${id}`}
          box={box}
          color={collidingModelIds.has(id) ? "#ef4444" : "#4a9eff"}
          opacity={collidingModelIds.has(id) ? 0.8 : 0.4}
        />
      ))}

      {}
      {collisions.map(({ idA, idB, intersectionBox }) => (
        <OverlapRegion
          key={`overlap-${idA}-${idB}`}
          box={intersectionBox}
        />
      ))}
    </group>
  );
}
