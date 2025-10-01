import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Import modular 3D components
import { FilmEquipmentSet } from './elements/FilmEquipment';
import { StudioLogo3D, StudioTagline } from './elements/StudioBranding';
import { ParticleEffectsSet } from './elements/ParticleEffects';
import type { Scene3DConfig } from '@/types/studio';

interface Scene3DProps {
  config?: Partial<Scene3DConfig>;
  interactive?: boolean;
  autoRotate?: boolean;
  showControls?: boolean;
  performance?: 'low' | 'medium' | 'high';
}

const DynamicCamera: React.FC<{ autoRotate: boolean; interactive: boolean }> = ({ 
  autoRotate, 
  interactive 
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame((state) => {
    if (cameraRef.current && autoRotate && !interactive) {
      const time = state.clock.elapsedTime;
      cameraRef.current.position.x = Math.sin(time * 0.1) * 12;
      cameraRef.current.position.y = Math.cos(time * 0.15) * 8;
      cameraRef.current.position.z = 15 + Math.sin(time * 0.05) * 5;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <PerspectiveCamera 
      ref={cameraRef} 
      makeDefault 
      position={[0, 0, 15]} 
      fov={60}
      near={0.1}
      far={1000}
    />
  );
};

const SceneLighting: React.FC<{ config?: Scene3DConfig }> = ({ config }) => {
  return (
    <>
      {/* Ambient Light */}
      <ambientLight 
        intensity={config?.lighting?.ambientIntensity || 0.4} 
        color="#ffffff"
      />
      
      {/* Key Light */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill Light */}
      <directionalLight 
        position={[-5, 5, 5]} 
        intensity={0.6}
        color="#b8d4ff"
      />
      
      {/* Rim Light */}
      <pointLight 
        position={[0, 0, -10]} 
        intensity={0.8} 
        color="#d4af37"
        distance={30}
      />
      
      {/* Accent Lights */}
      <pointLight 
        position={[-8, 4, 2]} 
        intensity={0.4} 
        color="#ff6b35"
        distance={15}
      />
      <pointLight 
        position={[8, -2, 4]} 
        intensity={0.3} 
        color="#4ecdc4"
        distance={12}
      />
    </>
  );
};

const SceneContent: React.FC<{ 
  config?: Scene3DConfig;
  performance: 'low' | 'medium' | 'high';
}> = ({ config, performance }) => {
  const particleCount = performance === 'high' ? 200 : performance === 'medium' ? 100 : 50;
  
  return (
    <>
      {/* Main Studio Elements */}
      <group>
        <FilmEquipmentSet />
        <StudioLogo3D scale={0.8} />
        <StudioTagline />
      </group>
      
      {/* Particle Effects */}
      {performance !== 'low' && <ParticleEffectsSet />}
      
      {/* Background Elements */}
      <mesh position={[0, 0, -15]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color={config?.backgroundColor || "#0a0a0a"} 
          transparent 
          opacity={0.6}
        />
      </mesh>
      
      {/* Ground Plane */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#111" 
          transparent 
          opacity={0.3}
        />
      </mesh>
    </>
  );
};

const LoadingFallback: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-yellow-400 text-lg font-semibold">Loading Studio...</p>
      </div>
    </div>
  );
};

export const Scene3D: React.FC<Scene3DProps> = ({ 
  config,
  interactive = false,
  autoRotate = true,
  showControls = false,
  performance = 'medium'
}) => {
  const dpr = performance === 'high' ? [1, 2] : performance === 'medium' ? [1, 1.5] : [0.5, 1];
  
  return (
    <div className="w-full h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          dpr={dpr as [number, number]}
          shadows={performance !== 'low'}
          gl={{ 
            antialias: performance === 'high',
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <DynamicCamera autoRotate={autoRotate} interactive={interactive} />
          
          {/* Controls */}
          {(showControls || interactive) && (
            <OrbitControls
              enablePan={interactive}
              enableZoom={interactive}
              enableRotate={interactive}
              autoRotate={!interactive && autoRotate}
              autoRotateSpeed={0.5}
              minDistance={5}
              maxDistance={50}
            />
          )}
          
          {/* Lighting */}
          <SceneLighting config={config} />
          
          {/* Environment */}
          <Environment 
            preset={config?.environment?.preset || "studio"}
            background={false}
            blur={config?.environment?.backgroundBlur || 0.6}
          />
          
          {/* Scene Content */}
          <SceneContent config={config} performance={performance} />
          
          {/* Fog */}
          <fog attach="fog" args={['#000', 20, 50]} />
        </Canvas>
      </Suspense>
      
      {/* Scene Controls Overlay */}
      {showControls && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
          <p className="mb-2 font-semibold">Scene Controls</p>
          <ul className="space-y-1 text-xs">
            <li>• Mouse: Rotate view</li>
            <li>• Scroll: Zoom in/out</li>
            <li>• Drag: Pan camera</li>
          </ul>
        </div>
      )}
    </div>
  );
};
