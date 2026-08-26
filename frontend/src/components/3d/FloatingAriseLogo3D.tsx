"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ARISE_LOGO_SRC } from '../../constants/branding';

interface FloatingAriseLogo3DProps {
  position?: [number, number, number];
  scale?: number;
  showText?: boolean;
  textTitle?: string;
  textSubtitle?: string;
}

export const FloatingAriseLogo3D: React.FC<FloatingAriseLogo3DProps> = ({
  position = [0, 0.6, 0],
  scale = 1.0,
  showText = false,
  textTitle = "ARISE PICTURES",
  textSubtitle = "THE AI CONTENT FOUNDRY",
}) => {
  const logoGroupRef = useRef<THREE.Group>(null);
  const flareBeamRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const emberPointsRef = useRef<THREE.Points>(null);

  // Load Arise Pictures Logo Texture with anisotropic filtering
  const logoTexture = useLoader(THREE.TextureLoader, ARISE_LOGO_SRC);
  useMemo(() => {
    if (logoTexture) {
      logoTexture.colorSpace = THREE.SRGBColorSpace;
      logoTexture.generateMipmaps = true;
      logoTexture.minFilter = THREE.LinearMipmapLinearFilter;
      logoTexture.magFilter = THREE.LinearFilter;
    }
  }, [logoTexture]);

  // Floating Golden Sparkle Particles around the Logo
  const particleCount = 80;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.8 + (Math.random() - 0.5) * 0.8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Continuous 3D Floating, Swaying & Turntable Rotation
    if (logoGroupRef.current) {
      logoGroupRef.current.rotation.y += delta * 0.35;
      logoGroupRef.current.position.y = position[1] + Math.sin(t * 1.8) * 0.15;
      logoGroupRef.current.rotation.z = Math.sin(t * 0.9) * 0.05;
      logoGroupRef.current.rotation.x = Math.cos(t * 0.7) * 0.04;
    }

    // Anamorphic Flare Shimmer & Pulse
    if (flareBeamRef.current) {
      const flareScaleX = 1 + Math.sin(t * 4) * 0.15;
      const flareOpacity = 0.6 + Math.sin(t * 5) * 0.2;
      flareBeamRef.current.scale.set(flareScaleX, 1, 1);
      (flareBeamRef.current.material as THREE.MeshBasicMaterial).opacity = flareOpacity;
    }

    // Counter-rotating Golden Energy Rings
    if (ringRef1.current) ringRef1.current.rotation.z += delta * 0.5;
    if (ringRef2.current) ringRef2.current.rotation.z -= delta * 0.35;

    // Orbiting Gold Embers
    if (emberPointsRef.current) {
      emberPointsRef.current.rotation.y -= delta * 0.25;
      emberPointsRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* 3D Floating Arise Pictures Logo Plaque */}
      <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={logoGroupRef}>
          {/* 3D Gold Chamfered Plaque Casing */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[2.5, 2.5, 0.14]} />
            <meshStandardMaterial
              color="#0d0722"
              emissive="#78350f"
              emissiveIntensity={0.3}
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>

          {/* Front Face: Arise Pictures Logo Image */}
          <mesh position={[0, 0, 0.075]} rotation={[0, 0, 0]}>
            <planeGeometry args={[2.42, 2.42]} />
            <meshStandardMaterial
              map={logoTexture}
              roughness={0.2}
              metalness={0.3}
              emissive="#f59e0b"
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Back Face: Arise Pictures Logo Image */}
          <mesh position={[0, 0, -0.075]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[2.42, 2.42]} />
            <meshStandardMaterial
              map={logoTexture}
              roughness={0.2}
              metalness={0.3}
              emissive="#f59e0b"
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Polished Gold Bevel Frame Borders */}
          <mesh position={[0, 1.25, 0]}>
            <boxGeometry args={[2.56, 0.06, 0.18]} />
            <meshStandardMaterial color="#fef08a" metalness={1.0} roughness={0.1} />
          </mesh>
          <mesh position={[0, -1.25, 0]}>
            <boxGeometry args={[2.56, 0.06, 0.18]} />
            <meshStandardMaterial color="#fef08a" metalness={1.0} roughness={0.1} />
          </mesh>
          <mesh position={[-1.25, 0, 0]}>
            <boxGeometry args={[0.06, 2.56, 0.18]} />
            <meshStandardMaterial color="#fef08a" metalness={1.0} roughness={0.1} />
          </mesh>
          <mesh position={[1.25, 0, 0]}>
            <boxGeometry args={[0.06, 2.56, 0.18]} />
            <meshStandardMaterial color="#fef08a" metalness={1.0} roughness={0.1} />
          </mesh>

          {/* Cinematic Horizontal Anamorphic Optical Flare Beam */}
          <mesh ref={flareBeamRef} position={[0, 0.1, 0.1]}>
            <planeGeometry args={[3.6, 0.25]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </Float>

      {/* Orbiting Concentric Holographic Energy Rings */}
      <mesh ref={ringRef1} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.22, 48]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={ringRef2} position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[2.5, 2.62, 48]} />
        <meshBasicMaterial color="#d97706" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* 80 Orbiting Gold Embers / Cinematic Sparkles */}
      <points ref={emberPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#fef08a"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Optional 3D Typography */}
      {showText && (
        <group position={[0, -1.8, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.24}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
          >
            {textTitle}
          </Text>
          <Text
            position={[0, -0.24, 0]}
            fontSize={0.12}
            color="#e9d5ff"
            anchorX="center"
            anchorY="middle"
          >
            {textSubtitle}
          </Text>
        </group>
      )}
    </group>
  );
};

export default FloatingAriseLogo3D;
