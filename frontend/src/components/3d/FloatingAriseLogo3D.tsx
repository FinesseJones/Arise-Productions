"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { ARISE_LOGO_SRC } from '../../constants/branding';

interface FloatingAriseLogo3DProps {
  position?: [number, number, number];
  scale?: number;
  showSubtitle?: boolean;
}

export const FloatingAriseLogo3D: React.FC<FloatingAriseLogo3DProps> = ({
  position = [0, 0.4, 0],
  scale = 1.0,
}) => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const flareBeamRef = useRef<THREE.Mesh>(null);
  const sparklesRef = useRef<THREE.Points>(null);

  // Load Arise Pictures Logo Texture
  const logoTexture = useLoader(THREE.TextureLoader, ARISE_LOGO_SRC);
  useMemo(() => {
    if (logoTexture) {
      logoTexture.colorSpace = THREE.SRGBColorSpace;
      logoTexture.generateMipmaps = true;
      logoTexture.minFilter = THREE.LinearFilter;
      logoTexture.magFilter = THREE.LinearFilter;
    }
  }, [logoTexture]);

  // Floating Golden Sparkle Particles around the Letters
  const particleCount = 100;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    return pos;
  }, []);

  // 5 Extruded 3D Depth Layers along the Z-axis
  const depthLayers = useMemo(() => [
    { z: 0.00, opacity: 1.0, emissiveIntensity: 0.9, color: "#fffbeb" },
    { z: -0.04, opacity: 0.85, emissiveIntensity: 0.6, color: "#fde047" },
    { z: -0.08, opacity: 0.70, emissiveIntensity: 0.4, color: "#f59e0b" },
    { z: -0.12, opacity: 0.55, emissiveIntensity: 0.3, color: "#d97706" },
    { z: -0.16, opacity: 0.40, emissiveIntensity: 0.2, color: "#78350f" },
  ], []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Fluid 3D Floating, Swaying & Turntable Rotation
    if (masterGroupRef.current) {
      const floatY = Math.sin(t * 1.8) * 0.14;
      const swayZ = Math.sin(t * 1.0) * 0.04;
      const rotateY = Math.sin(t * 0.8) * 0.25;

      masterGroupRef.current.position.y = position[1] + floatY;
      masterGroupRef.current.rotation.y = rotateY;
      masterGroupRef.current.rotation.z = swayZ;

      // Dynamic Background Drop Shadow moves with parallax depth
      if (shadowRef.current) {
        shadowRef.current.position.y = position[1] + floatY * 0.6 - 0.35;
        shadowRef.current.position.x = position[0] + 0.25 + rotateY * 0.5;
        shadowRef.current.rotation.z = swayZ * 0.5;
      }
    }

    // Horizontal Anamorphic Optical Flare Pulse
    if (flareBeamRef.current) {
      const sX = 1 + Math.sin(t * 4.0) * 0.18;
      flareBeamRef.current.scale.set(sX, 1, 1);
      (flareBeamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.65 + Math.sin(t * 5.0) * 0.25;
    }

    // Orbiting Sparkles
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y += delta * 0.2;
      sparklesRef.current.rotation.z = Math.sin(t * 0.6) * 0.08;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Dynamic 3D Floating Arise Pictures Logo with Extruded Depth */}
      <Float speed={2.4} rotationIntensity={0.15} floatIntensity={0.25}>
        <group ref={masterGroupRef}>
          {/* Layered 3D Depth Slices of the Logo (Extrusion Effect) */}
          {depthLayers.map((layer, idx) => (
            <mesh key={idx} position={[0, 0, layer.z]}>
              <planeGeometry args={[3.2, 3.2]} />
              <meshBasicMaterial
                map={logoTexture}
                transparent={true}
                blending={THREE.AdditiveBlending}
                opacity={layer.opacity}
                color={layer.color}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          ))}

          {/* Cinematic Horizontal Anamorphic Flare Streak */}
          <mesh ref={flareBeamRef} position={[0, 0.05, 0.08]}>
            <planeGeometry args={[4.8, 0.22]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent={true}
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      </Float>

      {/* Dynamic Background Drop Shadow Projected Behind Floating Letters */}
      <mesh ref={shadowRef} position={[0.25, -0.35, -0.65]}>
        <planeGeometry args={[3.3, 3.3]} />
        <meshBasicMaterial
          map={logoTexture}
          transparent={true}
          opacity={0.75}
          color="#020108"
          depthWrite={false}
        />
      </mesh>

      {/* 100 Orbiting Golden Sparkles & Floating Embers */}
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
          size={0.06}
          color="#fef08a"
          transparent={true}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default FloatingAriseLogo3D;
