"use client";

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { StageKey } from '../../types/types';

export interface Room3DProps {
  stageId: StageKey;
  roomName: string;
  projectName: string;
  shotNumber: number;
  children?: React.ReactNode;
  allowOrbit?: boolean;
}

// Target Camera Positions & LookAt Targets for each of the 10 Stages
const STAGE_CAMERA_VANTAGE: Record<
  string,
  { position: [number, number, number]; target: [number, number, number]; fov: number }
> = {
  script: { position: [0, 1.2, 5.8], target: [0, 0, 0], fov: 50 },
  structure: { position: [-1.8, 1.6, 6.2], target: [-0.4, 0.2, 0], fov: 52 },
  plan: { position: [1.4, 2.2, 5.6], target: [0.2, 0.4, 0], fov: 48 },
  previs: { position: [0, 0.8, 4.6], target: [0, 0.1, 0], fov: 45 },
  motion: { position: [2.2, 1.4, 5.5], target: [0.4, 0, 0], fov: 50 },
  boards: { position: [-1.5, 1.0, 6.0], target: [-0.3, 0.1, 0], fov: 52 },
  prompt: { position: [0, 1.8, 5.2], target: [0, 0.3, 0], fov: 48 },
  dailies: { position: [0, 0.5, 5.8], target: [0, 0.1, 0], fov: 50 },
  sound: { position: [-1.2, 1.5, 5.4], target: [-0.2, 0.3, 0], fov: 48 },
  edit: { position: [1.2, 1.1, 5.2], target: [0.3, 0.2, 0], fov: 48 },
};

// Smooth Fly-To CineCamera Controller
const CineCameraController: React.FC<{
  stageId: string;
  shotNumber: number;
  allowOrbit?: boolean;
}> = ({ stageId, shotNumber, allowOrbit = false }) => {
  const { camera } = useThree();
  const targetConfig = STAGE_CAMERA_VANTAGE[stageId] || STAGE_CAMERA_VANTAGE.script;
  
  // Calculate subtle shot-based offset for dynamic feel
  const targetPos = useMemo(() => {
    const [x, y, z] = targetConfig.position;
    const shotOffset = ((shotNumber % 3) - 1) * 0.2;
    return new THREE.Vector3(x + shotOffset, y, z);
  }, [stageId, shotNumber, targetConfig]);

  const targetLook = useMemo(() => {
    const [lx, ly, lz] = targetConfig.target;
    return new THREE.Vector3(lx, ly, lz);
  }, [targetConfig]);

  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!allowOrbit) {
      // Smooth interpolation for position (~0.8s ease)
      const lerpFactor = Math.min(delta * 4.5, 0.12);
      camera.position.lerp(targetPos, lerpFactor);

      // Subtle breathing motion for cinematic vitality
      const breathX = Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
      const breathY = Math.cos(state.clock.elapsedTime * 0.6) * 0.03;
      camera.position.x += breathX * 0.01;
      camera.position.y += breathY * 0.01;

      // Smooth lookAt interpolation
      currentLookAt.current.lerp(targetLook, lerpFactor);
      camera.lookAt(currentLookAt.current);
    }
  });

  return allowOrbit ? (
    <OrbitControls
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 + 0.1}
      minDistance={2}
      maxDistance={15}
    />
  ) : null;
};

// Soundstage Architectural Floor Grid with Ambient Glow
const SoundstageFloor: React.FC<{ stageId: string }> = ({ stageId }) => {
  const gridColor = useMemo(() => {
    switch (stageId) {
      case 'script':
        return '#f59e0b';
      case 'previs':
      case 'motion':
        return '#06b6d4';
      case 'edit':
      case 'dailies':
        return '#ec4899';
      default:
        return '#8b5cf6';
    }
  }, [stageId]);

  return (
    <group position={[0, -2.2, 0]}>
      {/* Reflective Dark Stage Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#04020a"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Cyber Grid Lines */}
      <gridHelper
        args={[50, 50, gridColor, '#1f1342']}
        position={[0, 0.01, 0]}
      />

      {/* Center Soundstage Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.8, 3.9, 64]} />
        <meshBasicMaterial color={gridColor} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[7.8, 7.9, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

// Atmospheric Volumetric Dust & Floating Studio Nodes
const StudioAtmosphere: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 120;

  const [positions] = useState(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    return pos;
  });

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#fbbf24"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 3D Spatial Soundstage Markers & Trussing
const SoundstageTrussing: React.FC<{ stageId: string; roomName: string }> = ({
  stageId,
  roomName,
}) => {
  return (
    <group position={[0, 4.2, -4]}>
      {/* Overhead Lighting Truss Beam */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[16, 0.25, 0.25]} />
        <meshStandardMaterial color="#1a1433" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Stage Number Floating Holo-Sign */}
      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.1}>
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.45}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
        >
          {`STAGE: ${roomName.toUpperCase()}`}
        </Text>
        <Text
          position={[0, -1.0, 0]}
          fontSize={0.2}
          color="#c084fc"
          anchorX="center"
          anchorY="middle"
        >
          ARISE 3D SOUNDSTAGE • 60 FPS SPATIAL ENVIRONMENT
        </Text>
      </Float>
    </group>
  );
};

export const Room3D: React.FC<Room3DProps> = ({
  stageId,
  roomName,
  projectName,
  shotNumber,
  children,
  allowOrbit = false,
}) => {
  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#05030a] overflow-hidden select-none rounded-2xl">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 1.2, 5.8], fov: 50 }}
        className="w-full h-full"
      >
        {/* Background Depth Fog */}
        <color attach="background" args={['#060410']} />
        <fog attach="fog" args={['#060410', 8, 26]} />

        {/* 3-Point Hollywood Studio Lighting */}
        <ambientLight intensity={0.45} color="#e9d5ff" />
        
        {/* Key Light (3200K Golden Amber) */}
        <directionalLight
          position={[6, 8, 6]}
          intensity={1.6}
          color="#fef08a"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Fill Light (Deep Purple Soft Fill) */}
        <pointLight position={[-6, 4, 4]} intensity={1.2} color="#a855f7" />

        {/* Rim / Back Light (Electric Rose / Cyan Edge) */}
        <spotLight
          position={[0, 7, -6]}
          intensity={2.2}
          color="#ec4899"
          angle={0.6}
          penumbra={0.8}
        />

        {/* Camera Fly-to Navigation Controller */}
        <CineCameraController
          stageId={stageId}
          shotNumber={shotNumber}
          allowOrbit={allowOrbit}
        />

        {/* 3D Soundstage Environment */}
        <SoundstageFloor stageId={stageId} />
        <StudioAtmosphere />
        <SoundstageTrussing stageId={stageId} roomName={roomName} />

        {/* Bespoke 3D Stage Elements or Children */}
        {children}
      </Canvas>
    </div>
  );
};

export default Room3D;
