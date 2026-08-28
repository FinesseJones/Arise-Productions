'use client';
import React, { useRef, useMemo, useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows, OrbitControls, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { StageKey } from '../../types/types';
import { roomKits } from './roomKits';
import HeroProps from './HeroProps';

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

// WebGL Context Loss Recovery Manager (prevents black screen on GPU exhaustion)
const WebGLContextManager: React.FC<{ onContextLost?: () => void; onContextRestored?: () => void }> = ({
  onContextLost,
  onContextRestored,
}) => {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault(); // Prevents Three.js / browser from permanently destroying the context
      console.warn('[Room3D] WebGL Context Lost! Preventing default and initiating recovery...');
      if (onContextLost) onContextLost();
    };

    const handleContextRestored = () => {
      console.log('[Room3D] WebGL Context successfully Restored!');
      if (onContextRestored) onContextRestored();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl, onContextLost, onContextRestored]);

  return null;
};

// 4K Dynamic Rotating Soundstage Floor with PBR Physical Reflectance
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
    <group position={[0, -2.15, 0]}>
      {/* Reflective Dark Stage Floor Plane with Real PBR Clearcoat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshPhysicalMaterial
          color="#04020a"
          roughness={0.16}
          metalness={0.90}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Cyber Grid Lines */}
      <gridHelper
        args={[80, 80, primaryGold, '#1f103d']}
        position={[0, 0.01, 0]}
      />

      {/* Animated Counter-Rotating Concentric Stage Rings */}
      <mesh ref={ringRef1} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.6, 3.8, 48]} />
        <meshBasicMaterial color={primaryGold} transparent opacity={0.65} />
      </mesh>

      <mesh ref={ringRef2} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[7.4, 7.6, 48]} />
        <meshBasicMaterial color={secondaryAmber} transparent opacity={0.45} />
      </mesh>

      <mesh ref={ringRef3} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[11.6, 11.8, 48]} />
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

// Procedural Lightformer Rig Fallback (guarantees zero black void)
const ProceduralLightformers: React.FC<{ light: { key: string; fill: string }; perf: boolean }> = ({ light, perf }) => (
  <Environment resolution={perf ? 64 : 128}>
    <Lightformer intensity={1.2} position={[0, 4, 3]} scale={[8, 4, 1]} color={light.key} />
    <Lightformer intensity={0.8} position={[-4, 2, 2]} scale={[4, 4, 1]} color={light.fill} />
    <Lightformer intensity={0.5} position={[4, 2, -3]} scale={[4, 4, 1]} color="#ffffff" />
  </Environment>
);

// Resilient HDRI Environment Loader with Fallback
interface HDRIProps {
  light: { key: string; fill: string };
  perf: boolean;
}

interface HDRIState {
  hasError: boolean;
}

class SafeHDRIEnvironment extends Component<HDRIProps, HDRIState> {
  constructor(props: HDRIProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): HDRIState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[Room3D] HDRI Load notice, falling back to procedural rig:', error);
  }

  render(): ReactNode {
    const { light, perf } = this.props;
    if (this.state.hasError) {
      return <ProceduralLightformers light={light} perf={perf} />;
    }

    return (
      <React.Suspense fallback={<ProceduralLightformers light={light} perf={perf} />}>
        <Environment files="./hdri/studio.hdr" resolution={perf ? 64 : 128} />
      </React.Suspense>
    );
  }
}

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
  quality = 'performance',
}) => {
  const [recoveryKey, setRecoveryKey] = useState<number>(0);
  const kit = roomKits[stageId] || roomKits.script;
  const light = LIGHT[kit.lightTemp] || LIGHT.warm;
  const perf = quality === 'performance';

  const handleContextLost = () => {
    // Graceful recovery trigger
    setTimeout(() => setRecoveryKey((k) => k + 1), 500);
  };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#05030a] overflow-hidden rounded-2xl">
      <Canvas
        key={`stage-canvas-${stageId}-${recoveryKey}`}
        shadows={false}
        dpr={perf ? [1, 1.2] : [1, 1.5]}
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          alpha: false,
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{ position: [0, 1.2, 5.8], fov: 50 }}
      >
        <color attach="background" args={['#060410']} />
        
        {/* WebGL Context Loss Recovery Manager */}
        <WebGLContextManager onContextLost={handleContextLost} />

        {/* Priority 3: Exponential Atmospheric Depth Fog */}
        <fogExp2 attach="fog" args={['#060312', 0.038]} />

        {/* Priority 1: Real Local Bundled HDRI with Zero-Failure Procedural Fallback */}
        <SafeHDRIEnvironment light={light} perf={perf} />

        {/* Subtle Atmospheric Dust Motes */}
        <Sparkles
          count={perf ? 18 : 35}
          scale={14}
          size={1.6}
          speed={0.3}
          opacity={0.28}
          color={kit.accent}
        />

        <ambientLight intensity={0.45} color="#e9d5ff" />
        <directionalLight
          position={[6, 8, 6]}
          intensity={1.5}
          color={light.key}
        />
        <pointLight position={[-6, 4, 4]} intensity={1.0} color={light.fill} />
        <spotLight position={[0, 7, -6]} intensity={2.0} color={kit.accent} angle={0.65} penumbra={0.8} />

        {/* Interactive Camera Controller with Mouse Parallax & Orbit */}
        <CineCameraController stageId={stageId} shotNumber={shotNumber} allowOrbit={allowOrbit} />

        {/* 3D Soundstage Floor with Reflectance */}
        <DynamicSoundstageFloor stageId={stageId} />

        {!perf && (
          <ContactShadows
            position={[0, -2.14, 0]}
            opacity={0.5}
            scale={24}
            blur={2.0}
            far={4}
            color="#000000"
          />
        )}

        {/* Procedural Room Props from Kit with PBR meshPhysicalMaterial */}
        <HeroProps kit={kit} />

        {/* Optional Custom Room Overlays */}
        {children}

        {/* Priority 5: Lightweight High-FPS Postprocessing Stack (Bloom + Vignette) */}
        <EffectComposer enabled multisampling={0}>
          <Bloom
            intensity={perf ? 0.2 : 0.35}
            luminanceThreshold={0.75}
            luminanceSmoothing={0.6}
            mipmapBlur
          />
          {!perf ? (
            <DepthOfField focusDistance={0.02} focalLength={0.035} bokehScale={1.1} />
          ) : null}
          <Vignette eskil={false} offset={0.3} darkness={0.6} />
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
