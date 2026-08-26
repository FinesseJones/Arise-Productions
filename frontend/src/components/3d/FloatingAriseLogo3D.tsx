"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingAriseLogo3DProps {
  position?: [number, number, number];
  scale?: number;
  showSubtitle?: boolean;
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

  // 6 Extruded depth layer offsets to give real 3D solid thickness
  const depthLayers = useMemo(() => [
    { z: 0.00, color: "#fffbeb", emissive: "#d97706", emissiveIntensity: 0.7, opacity: 1.0 },
    { z: -0.03, color: "#fde047", emissive: "#b45309", emissiveIntensity: 0.5, opacity: 1.0 },
    { z: -0.06, color: "#f59e0b", emissive: "#92400e", emissiveIntensity: 0.4, opacity: 1.0 },
    { z: -0.09, color: "#d97706", emissive: "#78350f", emissiveIntensity: 0.3, opacity: 1.0 },
    { z: -0.12, color: "#b45309", emissive: "#451a03", emissiveIntensity: 0.2, opacity: 1.0 },
    { z: -0.15, color: "#78350f", emissive: "#1e0b02", emissiveIntensity: 0.1, opacity: 1.0 },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const wavePhase = letterIndex * 0.45;

    if (letterGroupRef.current) {
      // Independent floating wave motion for each letter
      const floatY = Math.sin(t * 2.2 + wavePhase) * (isMain ? 0.12 : 0.06);
      const swayZ = Math.cos(t * 1.5 + wavePhase) * (isMain ? 0.04 : 0.02);
      const rotateY = Math.sin(t * 1.2 + wavePhase) * 0.08;

      letterGroupRef.current.position.y = floatY;
      letterGroupRef.current.rotation.y = rotateY;
      letterGroupRef.current.rotation.z = swayZ;

      // Drop shadow responds dynamically with parallax depth
      if (shadowRef.current) {
        shadowRef.current.position.y = floatY * 0.5 - 0.2;
        shadowRef.current.position.x = xOffset + 0.12 + rotateY * 0.4;
        shadowRef.current.scale.set(
          1 + floatY * 0.2,
          1 + floatY * 0.2,
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
            font="https://fonts.gstatic.com/s/cinzel/v23/8vIJ7ww63mVu7gt79HT7vX5ntN6V.woff"
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

        {/* Golden Chamfer Rim Outline on Top Face */}
        <Text
          position={[0, 0, 0.01]}
          fontSize={fontSize}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.0}
          strokeWidth={0.012}
          strokeColor="#fffbeb"
          font="https://fonts.gstatic.com/s/cinzel/v23/8vIJ7ww63mVu7gt79HT7vX5ntN6V.woff"
        >
          {char}
        </Text>
      </group>

      {/* Dynamic 3D Drop Shadow Projected in the Background */}
      <group ref={shadowRef} position={[0, -0.2, -0.6]}>
        <Text
          position={[0, 0, 0]}
          fontSize={fontSize * 1.05}
          color="#000000"
          fillOpacity={0.7}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/cinzel/v23/8vIJ7ww63mVu7gt79HT7vX5ntN6V.woff"
        >
          {char}
          <meshBasicMaterial color="#020108" transparent opacity={0.65} />
        </Text>
      </group>
    </group>
  );
};

export const FloatingAriseLogo3D: React.FC<FloatingAriseLogo3DProps> = ({
  position = [0, 0.4, 0],
  scale = 1.0,
  showSubtitle = true,
}) => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const flareBeamRef = useRef<THREE.Mesh>(null);
  const flareCoreRef = useRef<THREE.Mesh>(null);
  const sparklesRef = useRef<THREE.Points>(null);

  // Main "A-R-I-S-E" Letter Coordinates
  const mainLetters = useMemo(() => [
    { char: 'A', x: -1.8 },
    { char: 'R', x: -0.9 },
    { char: 'I', x: -0.05 },
    { char: 'S', x: 0.8 },
    { char: 'E', x: 1.7 },
  ], []);

  // Subtitle "P-I-C-T-U-R-E-S" Letter Coordinates
  const subLetters = useMemo(() => [
    { char: 'P', x: -1.75 },
    { char: 'I', x: -1.25 },
    { char: 'C', x: -0.75 },
    { char: 'T', x: -0.25 },
    { char: 'U', x: 0.25 },
    { char: 'R', x: 0.75 },
    { char: 'E', x: 1.25 },
    { char: 'S', x: 1.75 },
  ], []);

  // Floating Golden Sparkle Particles around the Letters
  const particleCount = 100;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Master group gentle breathing
    if (masterGroupRef.current) {
      masterGroupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.08;
    }

    // Horizontal Anamorphic Optical Flare Pulse
    if (flareBeamRef.current) {
      const sX = 1 + Math.sin(t * 3.5) * 0.15;
      flareBeamRef.current.scale.set(sX, 1, 1);
      (flareBeamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.65 + Math.sin(t * 4) * 0.2;
    }

    if (flareCoreRef.current) {
      flareCoreRef.current.rotation.z += delta * 1.5;
      const s = 1 + Math.sin(t * 5) * 0.25;
      flareCoreRef.current.scale.set(s, s, 1);
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

      {/* Cinematic Horizontal Anamorphic Flare Beam passing through center */}
      <mesh ref={flareBeamRef} position={[0, 0.45, 0.08]}>
        <planeGeometry args={[5.2, 0.16]} />
        <meshBasicMaterial
          color="#fde047"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Central Glint Sunburst Flare */}
      <mesh ref={flareCoreRef} position={[-0.05, 0.45, 0.09]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3D Subtitle Floating Letters: P I C T U R E S */}
      {showSubtitle && (
        <group position={[0, -0.65, 0]}>
          {subLetters.map((item, idx) => (
            <Letter3D
              key={idx}
              char={item.char}
              xOffset={item.x}
              fontSize={0.34}
              letterIndex={idx + 5}
              isMain={false}
            />
          ))}
        </group>
      )}

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
        <meshBasicMaterial color="#05030c" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default FloatingAriseLogo3D;
