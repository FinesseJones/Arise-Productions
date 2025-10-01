import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Environment, PerspectiveCamera, useScroll } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface FloatingElementProps {
  position: [number, number, number];
  children: React.ReactNode;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ position, children }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.01;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        {children}
      </mesh>
    </Float>
  );
};

const Camera3D: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame((state) => {
    if (cameraRef.current) {
      cameraRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
      cameraRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.15) * 0.2;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={60} />;
};

const FilmElements: React.FC = () => {
  return (
    <>
      {/* Film Camera */}
      <FloatingElement position={[-4, 2, 0]}>
        <boxGeometry args={[1, 0.8, 1.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </FloatingElement>

      {/* Lens */}
      <FloatingElement position={[-3.8, 2, 0.7]}>
        <cylinderGeometry args={[0.3, 0.4, 0.5, 8]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </FloatingElement>

      {/* Film Reel */}
      <FloatingElement position={[4, 1, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
      </FloatingElement>

      {/* Director's Clapperboard */}
      <FloatingElement position={[0, -2, 2]}>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <meshStandardMaterial color="#000" />
      </FloatingElement>

      {/* Floating Screens */}
      <FloatingElement position={[2, 3, -1]}>
        <planeGeometry args={[2, 1.2]} />
        <meshStandardMaterial 
          color="#fff" 
          emissive="#0080ff" 
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </FloatingElement>

      {/* Studio Light */}
      <FloatingElement position={[-2, 4, 1]}>
        <coneGeometry args={[0.5, 1.5, 8]} />
        <meshStandardMaterial color="#333" />
      </FloatingElement>

      {/* Floating Text - Studio Name */}
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.3}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.8}
          color="#d4af37"
          anchorX="center"
          anchorY="middle"
        >
          FINESSE
        </Text>
      </Float>

      <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          position={[0, -1, 0]}
          fontSize={0.5}
          color="#fff"
          anchorX="center"
          anchorY="middle"
        >
          DIGITAL STUDIO
        </Text>
      </Float>
    </>
  );
};

const ParticleField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={pointsRef}>
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
        size={0.02}
        color="#d4af37"
        transparent
        opacity={0.6}
      />
    </points>
  );
};

export const Scene3D: React.FC = () => {
  return (
    <div className="w-full h-screen relative">
      <Canvas dpr={[1, 2]} shadows>
        <Camera3D />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d4af37" />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* 3D Elements */}
        <FilmElements />
        <ParticleField />
        
        {/* Background */}
        <mesh position={[0, 0, -10]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            transparent 
            opacity={0.8}
          />
        </mesh>
      </Canvas>
    </div>
  );
};