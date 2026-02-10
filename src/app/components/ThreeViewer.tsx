"use client";

import { useRef, useEffect, useState, useCallback, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Grid,
    PerspectiveCamera,
    TransformControls,
    Outlines,
} from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useCollisionDetection } from "@/hooks/useCollisionDetection";
import CollisionOverlay from "./collision/CollisionOverlay";

interface ModelData {
    id: string;
    url: string;
    type: "gltf" | "obj" | "stl";
    name: string;
}

export interface ThreeViewerProps {
    models: ModelData[];
    onCollisionData?: (data: { count: number; collidingIds: Set<string> }) => void;
    onPartSelect?: (partName: string) => void;
}

interface ModelProps {
    url: string;
    type: "gltf" | "obj" | "stl";
    position: [number, number, number];
    isSelected: boolean;
    isColliding: boolean;
    onClick: () => void;
    meshRef: MutableRefObject<THREE.Group | null>;
}

function Model({ url, type, position, isSelected, isColliding, onClick, meshRef }: ModelProps) {
    const [model, setModel] = useState<THREE.Object3D | THREE.Mesh | null>(null);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        let loader: GLTFLoader | OBJLoader | STLLoader;

        switch (type) {
            case "gltf":
                loader = new GLTFLoader();
                loader.load(
                    url,
                    (gltf: GLTF) => setModel(gltf.scene),
                    undefined,
                    (error: unknown) => console.error("Error loading GLTF:", error),
                );
                break;
            case "obj":
                loader = new OBJLoader();
                loader.load(
                    url,
                    (obj: THREE.Group) => setModel(obj),
                    undefined,
                    (error: unknown) => console.error("Error loading OBJ:", error),
                );
                break;
            case "stl":
                loader = new STLLoader();
                loader.load(
                    url,
                    (geometry: THREE.BufferGeometry) => {
                        const material = new THREE.MeshStandardMaterial({
                            color: isSelected ? 0x4a9eff : 0x888888,
                            metalness: 0.3,
                            roughness: 0.4,
                        });
                        const mesh = new THREE.Mesh(geometry, material);
                        setModel(mesh);
                    },
                    undefined,
                    (error: unknown) => console.error("Error loading STL:", error),
                );
                break;
        }
    }, [url, type, isSelected]);

    if (!model) return null;

    return (
        <group
            ref={meshRef}
            position={position}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
                document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
                setHovered(false);
                document.body.style.cursor = "default";
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <primitive object={model}>
                {hovered && !isSelected && !isColliding && (
                    <Outlines thickness={3} color="#4a9eff" />
                )}
                {isSelected && <Outlines thickness={5} color="#ff9500" />}
                {isColliding && !isSelected && <Outlines thickness={4} color="#ef4444" />}
            </primitive>
        </group>
    );
}

interface SceneControlsProps {
    selectedModel: string | null;
    onDeselect: () => void;
    modelRefsRef: MutableRefObject<Record<string, MutableRefObject<THREE.Group | null>>>;
}

function SceneControls({ selectedModel, onDeselect, modelRefsRef }: SceneControlsProps) {
    const orbitRef = useRef<any>(null);
    const transformRef = useRef<any>(null);
    const [mode, setMode] = useState<"translate" | "rotate" | "scale">("translate");

    const selectedMeshRef = selectedModel ? modelRefsRef.current[selectedModel] : null;

    useEffect(() => {
        if (transformRef.current && orbitRef.current) {
            const controls = transformRef.current;
            const orbit = orbitRef.current;

            const callback = (event: { value: boolean; target: unknown }) => {
                orbit.enabled = !event.value;
            };

            controls.addEventListener("dragging-changed", callback);
            return () => controls.removeEventListener("dragging-changed", callback);
        }
    }, [selectedModel]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "g" || e.key === "G") setMode("translate");
            if (e.key === "r" || e.key === "R") setMode("rotate");
            if (e.key === "s" || e.key === "S") setMode("scale");
            if (e.key === "Escape") onDeselect();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onDeselect]);

    return (
        <>
            <OrbitControls
                ref={orbitRef}
                enableDamping
                dampingFactor={0.05}
                minDistance={0.5}
                maxDistance={50}
                zoomSpeed={1.5}
            />
            {selectedModel && selectedMeshRef?.current && (
                <TransformControls
                    ref={transformRef}
                    mode={mode}
                    object={selectedMeshRef.current}
                />
            )}
        </>
    );
}

// Collision detection manager - runs inside Canvas for useFrame access
interface CollisionManagerProps {
    modelRefs: MutableRefObject<Record<string, MutableRefObject<THREE.Group | null>>>;
    modelIds: string[];
    enabled: boolean;
    onCollisionCountChange: (count: number) => void;
    onCollidingIdsChange: (ids: Set<string>) => void;
}

function CollisionManager({
    modelRefs,
    modelIds,
    enabled,
    onCollisionCountChange,
    onCollidingIdsChange,
}: CollisionManagerProps) {
    const collision = useCollisionDetection({
        modelRefs,
        modelIds,
        frameSkip: 2,
    });

    useEffect(() => {
        collision.setEnabled(enabled);
    }, [enabled, collision]);

    useEffect(() => {
        onCollisionCountChange(collision.collisionCount);
    }, [collision.collisionCount, onCollisionCountChange]);

    useEffect(() => {
        onCollidingIdsChange(collision.collidingModelIds);
    }, [collision.collidingModelIds, onCollidingIdsChange]);

    return (
        <CollisionOverlay
            enabled={collision.enabled}
            boundingBoxes={collision.boundingBoxes}
            collisions={collision.collisions}
            collidingModelIds={collision.collidingModelIds}
        />
    );
}

export default function ThreeViewer({ models, onCollisionData, onPartSelect }: ThreeViewerProps) {
    const [modelPositions, setModelPositions] = useState<Record<string, [number, number, number]>>(
        {},
    );
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [showControls, setShowControls] = useState(false);
    const modelRefs = useRef<Record<string, MutableRefObject<THREE.Group | null>>>({});

    const [collisionEnabled, setCollisionEnabled] = useState(false);
    const [collisionCount, setCollisionCount] = useState(0);
    const [collidingIds, setCollidingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement).tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;
            if ((e.key === "c" || e.key === "C") && models.length >= 2) {
                setCollisionEnabled((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [models.length]);

    const handleCollisionCountChange = useCallback(
        (count: number) => {
            setCollisionCount(count);
            onCollisionData?.({ count, collidingIds });
        },
        [onCollisionData, collidingIds],
    );

    const handleCollidingIdsChange = useCallback(
        (ids: Set<string>) => {
            setCollidingIds(ids);
            onCollisionData?.({ count: 0, collidingIds: ids });
        },
        [onCollisionData],
    );

    useEffect(() => {
        const positions: Record<string, [number, number, number]> = {};
        const newRefs: Record<string, MutableRefObject<THREE.Group | null>> = {};

        models.forEach((model, index) => {
            const angle = (index / models.length) * Math.PI * 2;
            const radius = Math.min(2, models.length * 0.3);
            positions[model.id] = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
            if (!modelRefs.current[model.id]) {
                newRefs[model.id] = { current: null };
            } else {
                newRefs[model.id] = modelRefs.current[model.id];
            }
        });

        modelRefs.current = newRefs;
        setModelPositions(positions);
    }, [models]);

    return (
        <div className="relative w-full h-full">
            <Canvas
                shadows
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setSelectedModel(null);
                    }
                }}
                onPointerMissed={() => setSelectedModel(null)}
            >
                <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={60} />
                <SceneControls
                    selectedModel={selectedModel}
                    onDeselect={() => setSelectedModel(null)}
                    modelRefsRef={modelRefs}
                />

                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, -10, -5]} intensity={0.5} />

                <Grid
                    args={[40, 40]}
                    cellSize={0.5}
                    cellThickness={0.5}
                    cellColor="#6b7280"
                    sectionSize={2}
                    sectionThickness={1}
                    sectionColor="#4b5563"
                    fadeDistance={50}
                    fadeStrength={1}
                    followCamera={false}
                    infiniteGrid
                />

                {models.map((model) => (
                    <Model
                        key={model.id}
                        url={model.url}
                        type={model.type}
                        position={modelPositions[model.id] || [0, 0, 0]}
                        isSelected={selectedModel === model.id}
                        isColliding={collisionEnabled && collidingIds.has(model.id)}
                        onClick={() => {
                            setSelectedModel(model.id);
                            onPartSelect?.(model.name);
                        }}
                        meshRef={modelRefs.current[model.id] || { current: null }}
                    />
                ))}

                {models.length >= 2 && (
                    <CollisionManager
                        modelRefs={modelRefs}
                        modelIds={models.map((m) => m.id)}
                        enabled={collisionEnabled}
                        onCollisionCountChange={handleCollisionCountChange}
                        onCollidingIdsChange={handleCollidingIdsChange}
                    />
                )}

                {models.length === 0 && (
                    <mesh castShadow receiveShadow>
                        <boxGeometry args={[2, 2, 2]} />
                        <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.4} />
                    </mesh>
                )}
            </Canvas>

            {models.length > 0 && (
                <div className="absolute top-4 left-4 z-10">
                    <button
                        onClick={() => setShowControls(!showControls)}
                        className="bg-(--color-card-bg)/90 border border-(--color-border-primary) rounded-lg px-3 py-2 hover:bg-(--color-input-bg) transition-colors flex items-center gap-2 backdrop-blur-sm"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="text-(--color-text-light)"
                        >
                            <path
                                d="M8 2v12M2 8h12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="text-(--color-text-light) text-xs font-semibold">
                            Controls
                        </span>
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            className={`text-(--color-text-muted) transition-transform ${showControls ? "rotate-180" : ""}`}
                        >
                            <path
                                d="M2 4l4 4 4-4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    {showControls && (
                        <div className="mt-2 bg-(--color-card-bg)/90 border border-(--color-border-primary) rounded-lg p-3 animate-fadeIn backdrop-blur-sm min-w-[200px]">
                            <div className="text-(--color-text-muted) text-xs space-y-1">
                                <p>
                                    • <span className="text-(--color-accent-blue)">Hover</span> =
                                    Blue outline
                                </p>
                                <p>
                                    • <span className="text-(--color-status-warning)">Click</span> =
                                    Select (orange)
                                </p>
                                <p>
                                    • <span className="text-(--color-text-light)">G</span> = Move
                                </p>
                                <p>
                                    • <span className="text-(--color-text-light)">R</span> = Rotate
                                </p>
                                <p>
                                    • <span className="text-(--color-text-light)">S</span> = Scale
                                </p>
                                <p>
                                    • <span className="text-(--color-text-light)">Esc</span> =
                                    Deselect
                                </p>
                            </div>

                            {models.length >= 2 && (
                                <div className="mt-2 pt-2 border-t border-(--color-border-primary)">
                                    <button
                                        onClick={() => setCollisionEnabled(!collisionEnabled)}
                                        className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-(--color-input-bg) transition-colors group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className={
                                                    collisionEnabled
                                                        ? "text-(--color-accent-blue)"
                                                        : "text-(--color-text-muted)"
                                                }
                                            >
                                                <path
                                                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M9 12l2 2 4-4"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span
                                                className={`text-xs font-medium ${collisionEnabled ? "text-(--color-text-light)" : "text-(--color-text-muted) group-hover:text-(--color-text-light)"}`}
                                            >
                                                Collision Detection
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {collisionEnabled && (
                                                <span
                                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                                        collisionCount > 0
                                                            ? "bg-red-500/20 text-red-400"
                                                            : "bg-green-500/20 text-green-400"
                                                    }`}
                                                >
                                                    {collisionCount > 0
                                                        ? `${collisionCount} hit${collisionCount > 1 ? "s" : ""}`
                                                        : "Clear"}
                                                </span>
                                            )}
                                            <div
                                                className={`w-7 h-4 rounded-full transition-colors relative ${collisionEnabled ? "bg-(--color-accent-blue)" : "bg-(--color-text-muted)/30"}`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${collisionEnabled ? "translate-x-3.5" : "translate-x-0.5"}`}
                                                />
                                            </div>
                                        </div>
                                    </button>
                                    <p className="text-(--color-text-muted) text-[10px] mt-1 px-2">
                                        Press{" "}
                                        <span className="text-(--color-text-light) font-medium">
                                            C
                                        </span>{" "}
                                        to toggle
                                    </p>
                                </div>
                            )}

                            <p className="text-(--color-text-secondary) text-xs mt-2 pt-2 border-t border-(--color-border-primary)">
                                {models.length} model{models.length > 1 ? "s" : ""}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
