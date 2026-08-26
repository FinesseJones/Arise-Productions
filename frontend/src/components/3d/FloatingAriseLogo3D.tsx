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
  showText = true,
  textTitle = "ARISE PRODUCTIONS",
  textSubtitle = "THE AI CONTENT FOUNDRY, LLC",
}) => {
  const logoGroupRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const outerHaloRef = useRef<THREE.Points>(null);

  // Load Arise Logo Texture with anisotropic filtering
  const logoTexture = useLoader(THREE.TextureLoader, ARISE_LOGO_SRC);
  useMemo(() => {
    if (logoTexture) {
      logoTexture.colorSpace = THREE.SRGBColorSpace;
      logoTexture.generateMipmaps = true;
      logoTexture.minFilter = THREE.LinearMipmapLinearFilter;
      logoTexture.magFilter = THREE.LinearFilter;
    }
  }, [logoTexture]);

  // Floating Golden Particles around the Logo Medallion
  const particleCount = 60;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.6 + (Math.random() - 0.5) * 0.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Continuous 3D slow turntable rotation & breathing
    if (logoGroupRef.current) {
      logoGroupRef.current.rotation.y += delta * 0.45;
      logoGroupRef.current.position.y = position[1] + Math.sin(t * 1.6) * 0.12;
      logoGroupRef.current.rotation.z = Math.sin(t * 0.8) * 0.04;
    }

    // Counter-rotating holographic energy rings
    if (ringRef1.current) ringRef1.current.rotation.z += delta * 0.6;
    if (ringRef2.current) ringRef2.current.rotation.z -= delta * 0.4;

    if (outerHaloRef.current) {
      outerHaloRef.current.rotation.y -= delta * 0.2;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Dynamic 3D Floating Arise Logo Group */}
      <Float speed={2.2} rotationIntensity={0.15} floatIntensity={0.25}>
        <group ref={logoGroupRef}>
          {/* 3D Gold Extruded Bevel Medallion Outer Casing */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.22, 1.22, 0.16, 48]} />
            <meshStandardMaterial
              color="#d97706"
              emissive="#78350f"
              emissiveIntensity={0.4}
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>

          {/* Front Face: Arise Productions Logo Graphic */}
          <mesh position={[0, 0, 0.085]} rotation={[0, 0, 0]}>
            <circleGeometry args={[1.16, 48]} />
            <meshStandardMaterial
              map={logoTexture}
              roughness={0.2}
              metalness={0.4}
              emissive="#fbbf24"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Back Face: Arise Productions Logo Graphic */}
          <mesh position={[0, 0, -0.085]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[1.16, 48]} />
            <meshStandardMaterial
              map={logoTexture}
              roughness={0.2}
              metalness={0.4}
              emissive="#fbbf24"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Golden Rim Highlight Ring */}
          <mesh position={[0, 0, 0.088]}>
            <ringGeometry args={[1.15, 1.22, 48]} />
            <meshStandardMaterial color="#fef08a" metalness={1.0} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, -0.088]} rotation={[0, Math.PI, 0]}>
            <ringGeometry args={[1.15, 1.22, 48]} />
            <meshStandardMaterial color="#fef08a" metalness={1.0} roughness={0.1} />
          </mesh>
        </group>
      </Float>

      {/* Orbiting Concentric Holographic Energy Rings */}
      <mesh ref={ringRef1} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.65, 1.78, 48]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={ringRef2} position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[2.05, 2.18, 48]} />
        <meshBasicMaterial color="#d97706" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>

      {/* Orbiting Golden Sparkle Particles */}
      <points ref={outerHaloRef}>
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
          size={0.05}
          color="#fef08a"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 3D Floating Typography Below Logo */}
      {showText && (
        <group position={[0, -1.6, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.22}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
          >
            {textTitle}
          </Text>
          <Text
            position={[0, -0.22, 0]}
            fontSize={0.11}
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
