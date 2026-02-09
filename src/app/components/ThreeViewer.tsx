"use client";

import { useRef, useEffect, useState, type MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, TransformControls, Outlines } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ModelData {
  id: string;
  url: string;
  type: 'gltf' | 'obj' | 'stl';
  name: string;
}

interface ThreeViewerProps {
  models: ModelData[];
}

interface ModelProps {
  url: string;
  type: 'gltf' | 'obj' | 'stl';
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
  meshRef: MutableRefObject<THREE.Group | null>;
}

function Model({ url, type, position, isSelected, onClick, meshRef }: ModelProps) {
  const [model, setModel] = useState<THREE.Object3D | THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let loader: GLTFLoader | OBJLoader | STLLoader;
    
    switch (type) {
      case 'gltf':
        loader = new GLTFLoader();
        loader.load(
          url,
          (gltf: GLTF) => setModel(gltf.scene),
          undefined,
          (error: unknown) => console.error('Error loading GLTF:', error)
        );
        break;
      case 'obj':
        loader = new OBJLoader();
        loader.load(
          url,
          (obj: THREE.Group) => setModel(obj),
          undefined,
          (error: unknown) => console.error('Error loading OBJ:', error)
        );
        break;
      case 'stl':
        loader = new STLLoader();
        loader.load(
          url,
          (geometry: THREE.BufferGeometry) => {
            const material = new THREE.MeshStandardMaterial({
              color: isSelected ? 0x4a9eff : 0x888888,
              metalness: 0.3,
              roughness: 0.4
            });
            const mesh = new THREE.Mesh(geometry, material);
            setModel(mesh);
          },
          undefined,
          (error: unknown) => console.error('Error loading STL:', error)
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
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <primitive object={model}>
        {hovered && !isSelected && (
          <Outlines thickness={3} color="#4a9eff" />
        )}
        {isSelected && (
          <Outlines thickness={5} color="#ff9500" />
        )}
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformRef = useRef<any>(null);
  const [mode, setMode] = useState<'translate' | 'rotate' | 'scale'>('translate');

  const selectedMeshRef = selectedModel ? modelRefsRef.current[selectedModel] : null;

  useEffect(() => {
    if (transformRef.current && orbitRef.current) {
      const controls = transformRef.current;
      const orbit = orbitRef.current;

      const callback = (event: { value: boolean; target: unknown }) => {
        orbit.enabled = !event.value;
      };

      controls.addEventListener('dragging-changed', callback);
      return () => controls.removeEventListener('dragging-changed', callback);
    }
  }, [selectedModel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'g' || e.key === 'G') setMode('translate');
      if (e.key === 'r' || e.key === 'R') setMode('rotate');
      if (e.key === 's' || e.key === 'S') setMode('scale');
      if (e.key === 'Escape') onDeselect();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      {/* eslint-disable react-hooks/refs */}
      {selectedModel && selectedMeshRef?.current && (
        <TransformControls
          ref={transformRef}
          mode={mode}
          object={selectedMeshRef.current}
        />
      )}
      {/* eslint-enable react-hooks/refs */}
    </>
  );
}

export default function ThreeViewer({ models }: ThreeViewerProps) {
  const [modelPositions, setModelPositions] = useState<Record<string, [number, number, number]>>({});
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  const modelRefs = useRef<Record<string, MutableRefObject<THREE.Group | null>>>({});

  useEffect(() => {
    const positions: Record<string, [number, number, number]> = {};
    const newRefs: Record<string, MutableRefObject<THREE.Group | null>> = {};

    models.forEach((model, index) => {
      const angle = (index / models.length) * Math.PI * 2;
      const radius = Math.min(2, models.length * 0.3);
      positions[model.id] = [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ];
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

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Grid */}
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
        
        {/* Models */}
        {/* eslint-disable-next-line react-hooks/refs */}
        {models.map((model) => (
          <Model
            key={model.id}
            url={model.url}
            type={model.type}
            position={modelPositions[model.id] || [0, 0, 0]}
            isSelected={selectedModel === model.id}
            onClick={() => {
              console.log('Model clicked:', model.id);
              setSelectedModel(model.id);
            }}
            meshRef={modelRefs.current[model.id] || { current: null }}
          />
        ))}
        
        {/* Default cube if no models */}
        {models.length === 0 && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#4a9eff" metalness={0.3} roughness={0.4} />
          </mesh>
        )}
      </Canvas>
      
      {/* Info overlay */}
      {models.length > 0 && (
        <div className="absolute top-4 left-4">
          <button
            onClick={() => setShowControls(!showControls)}
            className="bg-[#12141b]/90 border border-[#333b45] rounded-lg px-3 py-2 hover:bg-[#1e2127] transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-300">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-slate-300 text-xs font-semibold">Controls</span>
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none" 
              className={`text-slate-400 transition-transform ${showControls ? 'rotate-180' : ''}`}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {showControls && (
            <div className="mt-2 bg-[#12141b]/90 border border-[#333b45] rounded-lg p-3 animate-fadeIn">
              <div className="text-slate-400 text-xs space-y-1">
                <p>• <span className="text-[#4a9eff]">Hover</span> = Blue outline</p>
                <p>• <span className="text-[#ff9500]">Click</span> = Select (orange)</p>
                <p>• <span className="text-slate-300">G</span> = Move</p>
                <p>• <span className="text-slate-300">R</span> = Rotate</p>
                <p>• <span className="text-slate-300">S</span> = Scale</p>
                <p>• Click empty space to deselect</p>
              </div>
              <p className="text-slate-500 text-xs mt-2 pt-2 border-t border-[#333b45]">{models.length} model{models.length > 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
