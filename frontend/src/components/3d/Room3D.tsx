"use client";

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { StageKey } from '../../types/types';
import FloatingAriseLogo3D from './FloatingAriseLogo3D';

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

// Smooth Fly-To CineCamera Controller with Interactive Mouse Parallax
const CineCameraController: React.FC<{
  stageId: string;
  shotNumber: number;
  allowOrbit?: boolean;
}> = ({ stageId, shotNumber, allowOrbit = false }) => {
  const { camera } = useThree();
  const targetConfig = STAGE_CAMERA_VANTAGE[stageId] || STAGE_CAMERA_VANTAGE.script;
  
  // Calculate subtle shot-based offset for dynamic feel
  const baseTargetPos = useMemo(() => {
    const [x, y, z] = targetConfig.position;
    const shotOffset = ((shotNumber % 3) - 1) * 0.25;
    return new THREE.Vector3(x + shotOffset, y, z);
  }, [stageId, shotNumber, targetConfig]);

  const targetLook = useMemo(() => {
    const [lx, ly, lz] = targetConfig.target;
    return new THREE.Vector3(lx, ly, lz);
  }, [targetConfig]);

  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!allowOrbit) {
      // Dynamic Mouse Parallax (smooth 3D depth reaction)
      const mouseX = state.pointer.x * 0.6;
      const mouseY = state.pointer.y * 0.4;

      // Natural cinematic breathing motion
      const breathX = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
      const breathY = Math.cos(state.clock.elapsedTime * 0.7) * 0.06;

      const dynamicTarget = new THREE.Vector3(
        baseTargetPos.x + mouseX + breathX,
        baseTargetPos.y + mouseY + breathY,
        baseTargetPos.z
      );

      // Smooth interpolation for camera position
      const lerpFactor = Math.min(delta * 4.0, 0.12);
      camera.position.lerp(dynamicTarget, lerpFactor);

      // Dynamic LookAt with subtle mouse tracking
      const dynamicLookAt = new THREE.Vector3(
        targetLook.x + mouseX * 0.3,
        targetLook.y + mouseY * 0.2,
        targetLook.z
      );
      currentLookAt.current.lerp(dynamicLookAt, lerpFactor);
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

// 4K Dynamic Rotating Soundstage Floor & Animated Emitters
const DynamicSoundstageFloor: React.FC<{ stageId: string }> = ({ stageId }) => {
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);

  const primaryGold = '#f59e0b';
  const secondaryAmber = '#d97706';
  const royalPurple = '#7e22ce';

  useFrame((state, delta) => {
    if (ringRef1.current) ringRef1.current.rotation.z += delta * 0.15;
    if (ringRef2.current) ringRef2.current.rotation.z -= delta * 0.10;
    if (ringRef3.current) ringRef3.current.rotation.z += delta * 0.06;
  });

  return (
    <group position={[0, -2.2, 0]}>
      {/* Reflective Dark Stage Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#030108"
          roughness={0.15}
          metalness={0.92}
        />
      </mesh>

      {/* Cyber Grid Lines */}
      <gridHelper
        args={[80, 80, primaryGold, '#1f103d']}
        position={[0, 0.01, 0]}
      />

      {/* Animated Counter-Rotating Concentric Stage Rings */}
      <mesh ref={ringRef1} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.6, 3.8, 64]} />
        <meshBasicMaterial color={primaryGold} transparent opacity={0.65} />
      </mesh>

      <mesh ref={ringRef2} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[7.4, 7.6, 64]} />
        <meshBasicMaterial color={secondaryAmber} transparent opacity={0.45} />
      </mesh>

      <mesh ref={ringRef3} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[11.6, 11.8, 64]} />
        <meshBasicMaterial color={royalPurple} transparent opacity={0.35} />
      </mesh>

      {/* Stage Floor Center Golden Aperture Marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial
          color="#160d2e"
          emissive="#78350f"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
};

// Dynamic Animated Studio Spotlights (Sweeping Light Beams)
const SweepingStudioSpotlights: React.FC = () => {
  const spotLightRef1 = useRef<THREE.SpotLight>(null);
  const spotLightRef2 = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (spotLightRef1.current) {
      spotLightRef1.current.position.x = 6 + Math.sin(t * 0.4) * 2;
      spotLightRef1.current.position.z = 6 + Math.cos(t * 0.3) * 1.5;
    }
    if (spotLightRef2.current) {
      spotLightRef2.current.position.x = -6 + Math.cos(t * 0.35) * 2;
      spotLightRef2.current.position.z = 5 + Math.sin(t * 0.45) * 1.5;
    }
  });

  return (
    <>
      {/* Dynamic Key Spotlight (3200K Golden Amber) */}
      <spotLight
        ref={spotLightRef1}
        position={[7, 9, 6]}
        intensity={2.5}
        color="#fbbf24"
        angle={0.55}
        penumbra={0.7}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Dynamic Soft Fill Spotlight (Arise Royal Purple) */}
      <spotLight
        ref={spotLightRef2}
        position={[-7, 8, 5]}
        intensity={1.8}
        color="#c084fc"
        angle={0.65}
        penumbra={0.85}
      />

      {/* Rim / Back Edge Light (Electric Rose-Gold) */}
      <spotLight
        position={[0, 9, -7]}
        intensity={2.8}
        color="#f59e0b"
        angle={0.6}
        penumbra={0.75}
        castShadow
      />
    </>
  );
};

// Atmospheric Volumetric Dust & Floating Golden Embers
const StudioAtmosphere: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 220;

  const [positions] = useState(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 28;
    }
    return pos;
  });

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.03;
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
        size={0.04}
        color="#fde047"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 3D Soundstage Walls & Overhead Rigging Truss with Golden Phoenix Badge
const SoundstageEnvironmentTruss: React.FC<{ stageId: string; roomName: string }> = ({
  stageId,
  roomName,
}) => {
  const trussRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (trussRef.current) {
      trussRef.current.position.y = 4.4 + Math.sin(state.clock.elapsedTime * 0.6) * 0.03;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Overhead Lighting Truss Beam */}
      <group ref={trussRef} position={[0, 4.4, -4]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[20, 0.28, 0.28]} />
          <meshStandardMaterial color="#1a1130" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 3D Floating Stage Holo-Sign with Dynamic Arise Logo */}
        <React.Suspense fallback={null}>
          <FloatingAriseLogo3D position={[0, 0.4, -0.5]} scale={0.55} showText={false} />
        </React.Suspense>

        <Float speed={2.0} rotationIntensity={0.08} floatIntensity={0.15}>
          <Text
            position={[0, -0.6, 0]}
            fontSize={0.48}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
          >
            {`STAGE: ${roomName.toUpperCase()}`}
          </Text>
          <Text
            position={[0, -1.05, 0]}
            fontSize={0.18}
            color="#e9d5ff"
            anchorX="center"
            anchorY="middle"
          >
            ARISE PRODUCTION • 4K 60FPS SPATIAL SOUNDSTAGE
          </Text>
        </Float>
      </group>

      {/* Perimeter Acoustic Soundstage Wall Panels with Rim Glow */}
      <mesh position={[-14, 2, -10]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.2, 10, 16]} />
        <meshStandardMaterial color="#0c071d" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[14, 2, -10]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[0.2, 10, 16]} />
        <meshStandardMaterial color="#0c071d" roughness={0.8} metalness={0.3} />
      </mesh>
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
    <div className="relative w-full h-full min-h-[380px] bg-[#04020a] overflow-hidden select-none rounded-2xl border border-amber-500/20 shadow-2xl">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.25;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        camera={{ position: [0, 1.2, 5.8], fov: 50 }}
        className="w-full h-full"
      >
        {/* Background Depth Fog in Arise Deep Obsidian */}
        <color attach="background" args={['#05030e']} />
        <fog attach="fog" args={['#05030e', 6, 26]} />

        {/* Ambient Stage Fill */}
        <ambientLight intensity={0.5} color="#e9d5ff" />

        {/* Dynamic Sweeping Spotlights */}
        <SweepingStudioSpotlights />

        {/* Interactive Camera Controller with Mouse Parallax */}
        <CineCameraController
          stageId={stageId}
          shotNumber={shotNumber}
          allowOrbit={allowOrbit}
        />

        {/* 3D Soundstage Animated Floor & Atmosphere */}
        <DynamicSoundstageFloor stageId={stageId} />
        <StudioAtmosphere />
        <SoundstageEnvironmentTruss stageId={stageId} roomName={roomName} />

        {/* Bespoke 3D Room Stage Props & Geometries */}
        {children}
      </Canvas>

      {/* 4K 60FPS Spatial Soundstage Watermark with Arise Golden Phoenix Icon */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none flex items-center space-x-2 bg-[#090518]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-[10px] font-mono text-amber-200 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
        <span className="font-bold">ARISE 4K UHD</span>
        <span className="text-purple-400">•</span>
        <span>60 FPS DYNAMIC 3D SOUNDSTAGE</span>
      </div>
    </div>
  );
};

export default Room3D;
