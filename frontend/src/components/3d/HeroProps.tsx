'use client';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { RoomKit } from './roomKits';

// Animated Hero Prop for Centered Viewport
const Prop: React.FC<{ name: string; accent: string; position: [number, number, number] }> = ({
  name,
  accent,
  position,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && (name === 'diffusion-orb' || name === 'screenplay')) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  switch (name) {
    // 1. Audio Mixing Console & Soundboard
    case 'mixing-console':
    case 'audio-rack':
      return (
        <group position={position}>
          {/* Main Console Surface */}
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[2.2, 0.5, 1.0]} />
            <meshStandardMaterial color="#120c24" metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Angled Control Strip */}
          <mesh position={[0, 0.15, 0.05]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[2.0, 0.15, 0.8]} />
            <meshStandardMaterial color="#1e1438" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Illuminated Faders */}
          {[...Array(8)].map((_, i) => (
            <mesh key={i} position={[-0.7 + i * 0.2, 0.25, 0.05]} rotation={[-0.2, 0, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.1]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} metalness={0.9} />
            </mesh>
          ))}
        </group>
      );

    // 2. 4K Cinema Screening Monitor
    case 'screening-monitor':
    case 'grade-monitor':
      return (
        <group position={position}>
          {/* Stand */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.08, 0.3, 0.6, 16]} />
            <meshStandardMaterial color="#0c071a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Outer Bezel */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.6, 1.5, 0.1]} />
            <meshStandardMaterial color="#080412" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Glowing Screen Face */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[2.45, 1.35]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.4}
              metalness={0.5}
              roughness={0.2}
            />
          </mesh>
        </group>
      );

    // 3. Screenplay Manuscript Desk & Lamp
    case 'desk':
    case 'screenplay':
      return (
        <group position={position}>
          {/* Solid Wooden / Slate Desk */}
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[2.2, 0.6, 1.1]} />
            <meshStandardMaterial color="#1a102e" roughness={0.3} metalness={0.5} />
          </mesh>
          {/* Screenplay Fountain Manuscript Sheets */}
          <Float speed={1.5} floatIntensity={0.2}>
            <mesh position={[-0.3, 0.15, 0.1]} rotation={[-Math.PI / 2, 0, 0.1]}>
              <planeGeometry args={[0.85, 1.15]} />
              <meshStandardMaterial color="#fefce8" roughness={0.8} />
            </mesh>
          </Float>
          {/* Brass Desk Lamp */}
          <group position={[0.7, 0.1, -0.2]}>
            <mesh>
              <cylinderGeometry args={[0.12, 0.15, 0.04, 16]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.4]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.4, 0]} rotation={[0.3, 0, 0]}>
              <coneGeometry args={[0.15, 0.2, 16]} />
              <meshStandardMaterial color="#d97706" metalness={0.9} emissive="#fef08a" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </group>
      );

    // 4. 35mm Hollywood CineCamera Rig on Tripod
    case 'camera-rig':
    case 'dolly-track':
      return (
        <group position={position}>
          {/* Heavy Tripod Legs */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.1, 0.35, 0.8, 16]} />
            <meshStandardMaterial color="#0c071a" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Camera Body */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.8, 0.6, 0.9]} />
            <meshStandardMaterial color="#140c26" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Anamorphic Lens Barrel */}
          <mesh position={[0, 0.1, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.28, 0.45, 24]} />
            <meshStandardMaterial color="#080410" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Lens Glass Front */}
          <mesh position={[0, 0.1, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.2, 24]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.6} metalness={0.8} />
          </mesh>
        </group>
      );

    // 5. LookDev Art Easel & Swatches
    case 'easel':
    case 'swatches':
      return (
        <group position={position}>
          {/* Easel Stand */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, -0.06]}>
            <boxGeometry args={[1.6, 1.8, 0.08]} />
            <meshStandardMaterial color="#241638" roughness={0.4} metalness={0.4} />
          </mesh>
          {/* Color Swatch Grid */}
          <group position={[0, 0.1, 0.06]}>
            {[...Array(6)].map((_, i) => (
              <mesh key={i} position={[(i % 3) * 0.45 - 0.45, Math.floor(i / 3) * 0.45 - 0.22, 0]}>
                <boxGeometry args={[0.38, 0.38, 0.03]} />
                <meshStandardMaterial
                  color={['#f59e0b', '#a855f7', '#06b6d4', '#ec4899', '#34d399', accent][i]}
                  metalness={0.6}
                  roughness={0.25}
                />
              </mesh>
            ))}
          </group>
        </group>
      );

    // 6. Generative Diffusion Orb
    case 'diffusion-orb':
    case 'prompt-cards':
      return (
        <group position={position}>
          {/* Pedestal Stand */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.35, 0.5, 0.6, 24]} />
            <meshStandardMaterial color="#120c2b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Floating Glowing 3D Icosahedron */}
          <Float speed={2.5} floatIntensity={0.4}>
            <mesh ref={meshRef} position={[0, 0.1, 0]}>
              <icosahedronGeometry args={[0.7, 2]} />
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={0.65}
                roughness={0.15}
                metalness={0.8}
              />
            </mesh>
          </Float>
        </group>
      );

    // 7. Default Geometric Stage Hero
    default:
      return (
        <group position={position}>
          {/* Pedestal */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.45, 0.6, 0.6, 24]} />
            <meshStandardMaterial color="#140d2e" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Hero Prop Shape */}
          <Float speed={2} floatIntensity={0.3}>
            <mesh position={[0, 0.1, 0]}>
              <octahedronGeometry args={[0.6]} />
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={0.5}
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>
          </Float>
        </group>
      );
  }
};

export const HeroProps: React.FC<{ kit: RoomKit }> = ({ kit }) => {
  const n = kit.heroProps.length;
  return (
    <group position={[0, 0, 0]}>
      {/* Studio Cyclorama Back Wall */}
      <mesh position={[0, 2.0, -4]} receiveShadow>
        <planeGeometry args={[25, 10]} />
        <meshStandardMaterial color="#05030e" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Hero Props Centered in Viewport */}
      {kit.heroProps.map((name, i) => {
        const spread = (i - (n - 1) / 2) * 2.2;
        return <Prop key={name} name={name} accent={kit.accent} position={[spread, 0, -0.2]} />;
      })}
    </group>
  );
};

export default HeroProps;
