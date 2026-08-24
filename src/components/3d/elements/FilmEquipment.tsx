import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
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

export const FilmCamera: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <FloatingElement position={position}>
    <boxGeometry args={[1, 0.8, 1.2]} />
    <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
  </FloatingElement>
);

export const CameraLens: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <FloatingElement position={position}>
    <cylinderGeometry args={[0.3, 0.4, 0.5, 8]} />
    <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
  </FloatingElement>
);

export const FilmReel: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <FloatingElement position={position}>
    <cylinderGeometry args={[0.8, 0.8, 0.1, 16]} />
    <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
  </FloatingElement>
);

export const Clapperboard: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <FloatingElement position={position}>
    <boxGeometry args={[1.5, 1, 0.1]} />
    <meshStandardMaterial color="#000" />
  </FloatingElement>
);

export const StudioLight: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <FloatingElement position={position}>
    <coneGeometry args={[0.5, 1.5, 8]} />
    <meshStandardMaterial color="#333" />
  </FloatingElement>
);

export const DigitalScreen: React.FC<{ 
  position: [number, number, number];
  emissiveColor?: string;
  emissiveIntensity?: number;
}> = ({ position, emissiveColor = "#0080ff", emissiveIntensity = 0.2 }) => (
  <FloatingElement position={position}>
    <planeGeometry args={[2, 1.2]} />
    <meshStandardMaterial 
      color="#fff" 
      emissive={emissiveColor} 
      emissiveIntensity={emissiveIntensity}
      transparent
      opacity={0.8}
    />
  </FloatingElement>
);

export const FilmEquipmentSet: React.FC = () => {
  return (
    <group>
      <FilmCamera position={[-4, 2, 0]} />
      <CameraLens position={[-3.8, 2, 0.7]} />
      <FilmReel position={[4, 1, 0]} />
      <Clapperboard position={[0, -2, 2]} />
      <DigitalScreen position={[2, 3, -1]} />
      <StudioLight position={[-2, 4, 1]} />
    </group>
  );
};