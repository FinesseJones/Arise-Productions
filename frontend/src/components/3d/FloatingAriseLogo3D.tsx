"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingAriseLogo3DProps {
  position?: [number, number, number];
  scale?: number;
}

// Individual 3D Beveled Floating Letter with Extruded Depth & Drop Shadow
const Letter3D: React.FC<{
  char: string;
  xOffset: number;
  fontSize: number;
  letterIndex: number;
  isMain?: boolean;
}> = ({ char, xOffset, fontSize, letterIndex, isMain = true }) => {
  const letterGroupRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Group>(null);

  // 6 Extruded depth layer offsets to give genuine physical 3D thickness
  const depthLayers = useMemo(() => [
    { z: 0.00, color: "#fffbeb", emissive: "#d97706", emissiveIntensity: 0.75 },
    { z: -0.03, color: "#fde047", emissive: "#b45309", emissiveIntensity: 0.55 },
    { z: -0.06, color: "#f59e0b", emissive: "#92400e", emissiveIntensity: 0.40 },
    { z: -0.09, color: "#d97706", emissive: "#78350f", emissiveIntensity: 0.30 },
    { z: -0.12, color: "#b45309", emissive: "#451a03", emissiveIntensity: 0.20 },
    { z: -0.15, color: "#78350f", emissive: "#1e0b02", emissiveIntensity: 0.10 },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const wavePhase = letterIndex * 0.4;

    if (letterGroupRef.current) {
      // Independent floating wave motion for each letter
      const floatY = Math.sin(t * 2.0 + wavePhase) * (isMain ? 0.12 : 0.05);
      const swayZ = Math.cos(t * 1.4 + wavePhase) * (isMain ? 0.04 : 0.015);
      const rotateY = Math.sin(t * 1.0 + wavePhase) * (isMain ? 0.08 : 0.03);

      letterGroupRef.current.position.y = floatY;
      letterGroupRef.current.rotation.y = rotateY;
      letterGroupRef.current.rotation.z = swayZ;

      // Drop shadow responds dynamically with parallax depth
      if (shadowRef.current) {
        shadowRef.current.position.y = floatY * 0.5 - 0.22;
        shadowRef.current.position.x = xOffset + 0.14 + rotateY * 0.3;
        shadowRef.current.scale.set(
          1 + floatY * 0.15,
          1 + floatY * 0.15,
          1
        );
      }
    }
  });

  return (
    <group position={[xOffset, 0, 0]}>
      {/* 3D Extruded Front Letter Group */}
      <group ref={letterGroupRef}>
        {/* Layered Extruded 3D Depth Meshes */}
        {depthLayers.map((layer, idx) => (
          <Text
            key={idx}
            position={[0, 0, layer.z]}
            fontSize={fontSize}
            color={layer.color}
            anchorX="center"
            anchorY="middle"
          >
            {char}
            <meshStandardMaterial
              color={layer.color}
              emissive={layer.emissive}
              emissiveIntensity={layer.emissiveIntensity}
              metalness={0.95}
              roughness={0.15}
            />
          </Text>
        ))}

        {/* Polished Golden Chamfer Rim Outline on Front Face */}
        <Text
          position={[0, 0, 0.01]}
          fontSize={fontSize}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.0}
          strokeWidth={0.015}
          strokeColor="#fffbeb"
        >
          {char}
        </Text>
      </group>

      {/* Dynamic 3D Drop Shadow Projected in the Background */}
      <group ref={shadowRef} position={[0, -0.22, -0.6]}>
        <Text
          position={[0, 0, 0]}
          fontSize={fontSize * 1.04}
          color="#000000"
          fillOpacity={0.7}
          anchorX="center"
          anchorY="middle"
        >
          {char}
          <meshBasicMaterial color="#020108" transparent opacity={0.7} />
        </Text>
      </group>
    </group>
  );
};

export const FloatingAriseLogo3D: React.FC<FloatingAriseLogo3DProps> = ({
  position = [0, 0.4, 0],
  scale = 1.0,
}) => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const sparklesRef = useRef<THREE.Points>(null);

  // Main "A-R-I-S-E" Letter Coordinates
  const mainLetters = useMemo(() => [
    { char: 'A', x: -1.75 },
    { char: 'R', x: -0.85 },
    { char: 'I', x: -0.05 },
    { char: 'S', x: 0.75 },
    { char: 'E', x: 1.65 },
  ], []);

  // Subtitle "P-R-O-D-U-C-T-I-O-N-S" Letter Coordinates
  const subLetters = useMemo(() => [
    { char: 'P', x: -1.90 },
    { char: 'R', x: -1.52 },
    { char: 'O', x: -1.14 },
    { char: 'D', x: -0.76 },
    { char: 'U', x: -0.38 },
    { char: 'C', x: 0.00 },
    { char: 'T', x: 0.38 },
    { char: 'I', x: 0.76 },
    { char: 'O', x: 1.14 },
    { char: 'N', x: 1.52 },
    { char: 'S', x: 1.90 },
  ], []);

  // 100 Floating Golden Sparkle Particles around the Letters
  const particleCount = 100;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Master group gentle breathing and overall 3D sway
    if (masterGroupRef.current) {
      masterGroupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.08;
      masterGroupRef.current.rotation.y = Math.sin(t * 0.6) * 0.12;
    }

    // Sparkles drift
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y += delta * 0.15;
      sparklesRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group ref={masterGroupRef} position={position} scale={scale}>
      {/* 3D Main Floating Letters: A - R - I - S - E */}
      <group position={[0, 0.45, 0]}>
        {mainLetters.map((item, idx) => (
          <Letter3D
            key={idx}
            char={item.char}
            xOffset={item.x}
            fontSize={1.25}
            letterIndex={idx}
            isMain={true}
          />
        ))}
      </group>

      {/* 3D Subtitle Floating Letters: P - R - O - D - U - C - T - I - O - N - S */}
      <group position={[0, -0.65, 0]}>
        {subLetters.map((item, idx) => (
          <Letter3D
            key={idx}
            char={item.char}
            xOffset={item.x}
            fontSize={0.28}
            letterIndex={idx + 5}
            isMain={false}
          />
        ))}
      </group>

      {/* 100 Floating Gold Dust Embers & Sparkles */}
      <points ref={sparklesRef}>
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
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Background Soft Shadow Catcher Plane */}
      <mesh position={[0, 0, -0.75]}>
        <planeGeometry args={[8, 4]} />
        <meshBasicMaterial color="#05030c" transparent opacity={0.25} />
      </mesh>
    </group>
  );
};

export default FloatingAriseLogo3D;
