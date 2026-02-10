"use client";

import { useRef, useState, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface CollisionPair {
  idA: string;
  idB: string;
  intersectionBox: THREE.Box3;
}

export interface BoundingBoxInfo {
  id: string;
  box: THREE.Box3;
}

export interface CollisionDetectionResult {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  boundingBoxes: BoundingBoxInfo[];
  collisions: CollisionPair[];
  collidingModelIds: Set<string>;
  collisionCount: number;
}

interface UseCollisionDetectionOptions {
  modelRefs: MutableRefObject<
    Record<string, MutableRefObject<THREE.Group | null>>
  >;
  modelIds: string[];
  frameSkip?: number;
}

export function useCollisionDetection({
  modelRefs,
  modelIds,
  frameSkip = 2,
}: UseCollisionDetectionOptions): CollisionDetectionResult {
  const [enabled, setEnabled] = useState(false);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBoxInfo[]>([]);
  const [collisions, setCollisions] = useState<CollisionPair[]>([]);
  const [collidingModelIds, setCollidingModelIds] = useState<Set<string>>(
    new Set()
  );

  const frameCounter = useRef(0);

  useFrame(() => {
    if (!enabled) return;

    frameCounter.current++;
    if (frameCounter.current % frameSkip !== 0) return;

    const refs = modelRefs.current;


    const boxes: BoundingBoxInfo[] = [];
    for (const id of modelIds) {
      const group = refs[id]?.current;
      if (!group) continue;
      const box = new THREE.Box3().setFromObject(group);
      if (box.isEmpty()) continue;
      boxes.push({ id, box });
    }

    if (boxes.length < 2) {
      setBoundingBoxes(boxes);
      if (collisions.length > 0) {
        setCollisions([]);
        setCollidingModelIds(new Set());
      }
      return;
    }


    const newCollisions: CollisionPair[] = [];
    const newCollidingIds = new Set<string>();

    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];

        if (a.box.intersectsBox(b.box)) {
          const intersectionBox = new THREE.Box3()
            .copy(a.box)
            .intersect(b.box);
          newCollisions.push({
            idA: a.id,
            idB: b.id,
            intersectionBox,
          });
          newCollidingIds.add(a.id);
          newCollidingIds.add(b.id);
        }
      }
    }

    setBoundingBoxes(boxes);
    setCollisions(newCollisions);
    setCollidingModelIds(newCollidingIds);
  });

  return {
    enabled,
    setEnabled,
    boundingBoxes,
    collisions,
    collidingModelIds,
    collisionCount: collisions.length,
  };
}
