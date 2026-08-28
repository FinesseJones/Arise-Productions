'use client';
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { StageKey } from '../../types/types';
import { roomKits } from './roomKits';

// Guaranteed baseline test cube & floor
const LitHeroCube: React.FC<{ accent: string }> = ({ accent }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.6;
      meshRef.current.rotation.y += delta * 0.9;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Centered Lit Rotating Cube */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial
          color={accent || '#f59e0b'}
          metalness={0.7}
          roughness={0.25}
          emissive={accent || '#f59e0b'}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Cyber Grid Floor */}
      <gridHelper args={[30, 30, accent || '#f59e0b', '#2a164d']} position={[0, -1.8, 0]} />

      {/* Solid Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.81, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#060312" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
};

export interface Room3DProps {
  stageId: StageKey;
  roomName: string;
  projectName: string;
  shotNumber: number;
  children?: React.ReactNode;
  allowOrbit?: boolean;
  quality?: 'high' | 'performance';
}

export const Room3D: React.FC<Room3DProps> = ({
  stageId,
  roomName,
  shotNumber,
  allowOrbit = false,
  quality = 'performance',
}) => {
  const kit = roomKits[stageId] || roomKits.script;

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#05030a] overflow-hidden rounded-2xl flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 1.4, 4.8], fov: 50 }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          depth: true,
          stencil: false,
        }}
        className="w-full h-full"
      >
        <color attach="background" args={['#070414']} />
        
        {/* Simple Standard Lighting with Zero Postprocessing/HDRI Overhead */}
        <ambientLight intensity={0.9} color="#ffffff" />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#fef08a" />
        <pointLight position={[-5, 4, 3]} intensity={1.2} color={kit.accent || '#ec4899'} />
        <pointLight position={[5, -2, -3]} intensity={0.8} color="#06b6d4" />

        {/* Baseline Rotating Lit Cube */}
        <LitHeroCube accent={kit.accent} />

        {allowOrbit && <OrbitControls enableDamping />}
      </Canvas>

      {/* 4K 60FPS Spatial Soundstage Watermark */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none flex items-center space-x-2 bg-[#090518]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-[10px] font-mono text-amber-200 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
        <span className="font-bold">BASELINE 3D ENGINE ACTIVE</span>
        <span className="text-purple-400">•</span>
        <span className="text-amber-300 font-semibold">{kit.label.toUpperCase()}</span>
        <span className="text-purple-400">•</span>
        <span className="text-slate-400 font-mono">[LIT CUBE TEST]</span>
      </div>
    </div>
  );
};

export default Room3D;
