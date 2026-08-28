'use client';
import React, { useRef, useMemo, Suspense, Component, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { StageKey } from '../../types/types';
import { roomKits } from './roomKits';
import HeroProps from './HeroProps';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

// --- Step 4: HDRI fallback helpers ---
function ProceduralLightingFallback() {
  return (<>
    <ambientLight intensity={0.4} />
    <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
    <hemisphereLight args={['#ffffff', '#444444', 0.6]} />
  </>)
}
class EnvErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err: unknown) { console.error('HDRI failed, using procedural lighting:', err) }
  render() { return this.state.hasError ? this.props.fallback : this.props.children }
}



// Target Camera Positions & LookAt Targets for each of the Stages
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
      const mouseX = state.pointer.x * 0.5;
      const mouseY = state.pointer.y * 0.3;

      const breathX = Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
      const breathY = Math.cos(state.clock.elapsedTime * 0.7) * 0.04;

      const dynamicTarget = new THREE.Vector3(
        baseTargetPos.x + mouseX + breathX,
        baseTargetPos.y + mouseY + breathY,
        baseTargetPos.z
      );

      const lerpFactor = Math.min(delta * 3.5, 0.1);
      camera.position.lerp(dynamicTarget, lerpFactor);

      const dynamicLookAt = new THREE.Vector3(
        targetLook.x + mouseX * 0.2,
        targetLook.y + mouseY * 0.15,
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

// Dynamic Soundstage Floor with PBR Reflectance
const DynamicSoundstageFloor: React.FC<{ stageId: string }> = ({ stageId }) => {
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);

  const kit = roomKits[stageId] || roomKits.script;
  const primaryGold = kit.accent || '#f59e0b';
  const secondaryAmber = '#d97706';
  const royalPurple = '#7e22ce';

  useFrame((state, delta) => {
    if (ringRef1.current) ringRef1.current.rotation.z += delta * 0.12;
    if (ringRef2.current) ringRef2.current.rotation.z -= delta * 0.08;
    if (ringRef3.current) ringRef3.current.rotation.z += delta * 0.05;
  });

  return (
    <group position={[0, -1.0, 0]}>
      {/* Reflective Dark Stage Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#04020a"
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* Cyber Grid Lines */}
      <gridHelper
        args={[60, 60, primaryGold, '#1f103d']}
        position={[0, 0.01, 0]}
      />

      {/* Animated Counter-Rotating Rings */}
      <mesh ref={ringRef1} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[2.8, 3.0, 48]} />
        <meshBasicMaterial color={primaryGold} transparent opacity={0.65} />
      </mesh>

      <mesh ref={ringRef2} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[5.6, 5.8, 48]} />
        <meshBasicMaterial color={secondaryAmber} transparent opacity={0.45} />
      </mesh>

      <mesh ref={ringRef3} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[8.8, 9.0, 48]} />
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
  shotNumber,
  allowOrbit = false,
  quality = 'performance',
}) => {
  const kit = roomKits[stageId] || roomKits.script;
  const light = LIGHT[kit.lightTemp] || LIGHT.warm;

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#05030a] overflow-hidden rounded-2xl flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0.8, 4.4], fov: 48 }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          depth: true,
          stencil: false,
        }}
        className="w-full h-full"
      >
        <color attach="background" args={['#060410']} />

        {/* Step 4 — HDRI environment */}
        <EnvErrorBoundary fallback={<ProceduralLightingFallback />}>
          <Suspense fallback={<ProceduralLightingFallback />}>
            <Environment files="/hdri/studio.hdr" resolution={64} />
          </Suspense>
        </EnvErrorBoundary>


        {/* Step 5 — Fog + Sparkles */}
        <fogExp2 attach="fog" args={['#0a0a0a', 0.012]} />
        <Sparkles count={40} scale={6} size={2} speed={0.2} opacity={0.4} />

        {/* 3-Point Hollywood Studio Lighting */}
        <ambientLight intensity={0.75} color="#ffffff" />
        <directionalLight position={[5, 7, 5]} intensity={1.8} color={light.key} />
        <pointLight position={[-5, 3, 3]} intensity={1.2} color={light.fill} />
        <pointLight position={[0, 5, -4]} intensity={1.8} color={kit.accent} />

        {/* Interactive Camera Controller with Mouse Parallax & Orbit */}
        <CineCameraController stageId={stageId} shotNumber={shotNumber} allowOrbit={allowOrbit} />

        {/* 3D Soundstage Floor Grounded */}
        <DynamicSoundstageFloor stageId={stageId} />

        {/* Real Grounded Hero Props from Kit Centered at Eye Level */}
        <HeroProps kit={kit} />

        {/* Step 6 — postprocessing: Bloom + Vignette only */}
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.6} luminanceThreshold={0.8} luminanceSmoothing={0.2} mipmapBlur />
          <Vignette eskil={false} offset={0.3} darkness={0.6} />
        </EffectComposer>

      </Canvas>

      {/* 4K 60FPS Spatial Soundstage Watermark */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none flex items-center space-x-2 bg-[#090518]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-[10px] font-mono text-amber-200 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
        <span className="font-bold">ARISE 4K UHD</span>
        <span className="text-purple-400">•</span>
        <span className="text-amber-300 font-semibold">{kit.label.toUpperCase()}</span>
        <span className="text-purple-400">•</span>
        <span className="text-slate-400 font-mono">[STAGE 1: PROPS & LIGHTS]</span>
      </div>
    </div>
  );
};

export default Room3D;
