'use client';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { StageKey } from '../../types/types';
import { roomKits } from './roomKits';
import HeroProps from './HeroProps';

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
  audio: { position: [-1.2, 1.5, 5.4], target: [-0.2, 0.3, 0], fov: 48 },
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
      const mouseX = state.pointer.x * 0.6;
      const mouseY = state.pointer.y * 0.4;

      const breathX = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
      const breathY = Math.cos(state.clock.elapsedTime * 0.7) * 0.06;

      const dynamicTarget = new THREE.Vector3(
        baseTargetPos.x + mouseX + breathX,
        baseTargetPos.y + mouseY + breathY,
        baseTargetPos.z
      );

      const lerpFactor = Math.min(delta * 4.0, 0.12);
      camera.position.lerp(dynamicTarget, lerpFactor);

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

  const kit = roomKits[stageId] || roomKits.script;
  const primaryGold = kit.accent || '#f59e0b';
  const secondaryAmber = '#d97706';
  const royalPurple = '#7e22ce';

  useFrame((state, delta) => {
    if (ringRef1.current) ringRef1.current.rotation.z += delta * 0.15;
    if (ringRef2.current) ringRef2.current.rotation.z -= delta * 0.10;
    if (ringRef3.current) ringRef3.current.rotation.z += delta * 0.06;
  });

  return (
    <group position={[0, -2.15, 0]}>
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
    </group>
  );
};

const LIGHT: Record<string, { key: string; fill: string }> = {
  warm: { key: '#fef08a', fill: '#f59e0b' },
  cool: { key: '#dbeafe', fill: '#06b6d4' },
  magenta: { key: '#fbcfe8', fill: '#ec4899' },
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
  projectName,
  shotNumber,
  children,
  allowOrbit = false,
  quality = 'high',
}) => {
  const kit = roomKits[stageId] || roomKits.script;
  const light = LIGHT[kit.lightTemp] || LIGHT.warm;
  const perf = quality === 'performance';

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#05030a] overflow-hidden rounded-2xl">
      <Canvas
        shadows={!perf}
        dpr={perf ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        camera={{ position: [0, 1.2, 5.8], fov: 50 }}
      >
        <color attach="background" args={['#060410']} />
        <fog attach="fog" args={['#060410', 9, 30]} />

        {/* Procedural HDRI — reflections with no external file to fail on */}
        <Environment resolution={perf ? 128 : 256}>
          <Lightformer intensity={1.2} position={[0, 3, 2]} scale={[8, 4, 1]} color={light.key} />
          <Lightformer intensity={0.7} position={[-4, 1, 2]} scale={[3, 3, 1]} color={light.fill} />
          <Lightformer intensity={0.5} position={[4, 1, -3]} scale={[3, 3, 1]} color="#ffffff" />
        </Environment>

        <ambientLight intensity={0.35} color="#e9d5ff" />
        <directionalLight
          position={[6, 8, 6]}
          intensity={1.5}
          color={light.key}
          castShadow={!perf}
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-6, 4, 4]} intensity={1.0} color={light.fill} />
        <spotLight position={[0, 7, -6]} intensity={2} color={kit.accent} angle={0.6} penumbra={0.8} />

        {/* Interactive Camera Controller with Mouse Parallax & Orbit */}
        <CineCameraController stageId={stageId} shotNumber={shotNumber} allowOrbit={allowOrbit} />

        {/* 3D Soundstage Floor */}
        <DynamicSoundstageFloor stageId={stageId} />

        {!perf && (
          <ContactShadows
            position={[0, -2.15, 0]}
            opacity={0.5}
            scale={30}
            blur={2.4}
            far={6}
            color="#000000"
          />
        )}

        {/* Procedural Room Props from Kit */}
        <HeroProps kit={kit} />

        {/* Optional Custom Room Overlays */}
        {children}

        {/* Igloo Postprocessing Stack */}
        <EffectComposer enabled>
          <Bloom
            intensity={perf ? 0.4 : 0.7}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          {!perf ? (
            <DepthOfField focusDistance={0.012} focalLength={0.05} bokehScale={2.2} />
          ) : (
            <></>
          )}
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
          {!perf ? <Noise opacity={0.025} /> : <></>}
        </EffectComposer>
      </Canvas>

      {/* 4K 60FPS Spatial Soundstage Watermark with Arise Golden Phoenix Icon */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none flex items-center space-x-2 bg-[#090518]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-[10px] font-mono text-amber-200 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
        <span className="font-bold">ARISE 4K UHD</span>
        <span className="text-purple-400">•</span>
        <span className="text-amber-300 font-semibold">{kit.label.toUpperCase()}</span>
        <span className="text-purple-400">•</span>
        <span className="text-slate-400 font-mono">[{quality.toUpperCase()}]</span>
      </div>
    </div>
  );
};

export default Room3D;
