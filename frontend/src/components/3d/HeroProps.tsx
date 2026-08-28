'use client';
import React from 'react';
import { Float } from '@react-three/drei';
import { RoomKit } from './roomKits';

const Prop: React.FC<{ name: string; accent: string; position: [number, number, number] }> = ({ name, accent, position }) => {
  switch (name) {
    case 'mixing-console':
      return (
        <group position={position}>
          <mesh castShadow>
            <boxGeometry args={[2.2, 0.15, 1]} />
            <meshStandardMaterial color="#15132a" metalness={0.7} roughness={0.3} />
          </mesh>
          {[...Array(8)].map((_, i) => (
            <mesh key={i} position={[-0.9 + i * 0.26, 0.12, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.12]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} />
            </mesh>
          ))}
        </group>
      );
    case 'screening-monitor':
    case 'grade-monitor':
      return (
        <group position={position}>
          <mesh castShadow>
            <boxGeometry args={[3, 1.7, 0.12]} />
            <meshStandardMaterial color="#0a0818" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <planeGeometry args={[2.8, 1.5]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
        </group>
      );
    case 'easel':
      return (
        <mesh position={position} rotation={[0, 0, -0.12]} castShadow>
          <boxGeometry args={[1.6, 2, 0.08]} />
          <meshStandardMaterial color="#2a2140" roughness={0.6} />
        </mesh>
      );
    case 'swatches':
      return (
        <group position={position}>
          {[...Array(5)].map((_, i) => (
            <mesh key={i} position={[i * 0.42 - 0.84, 0, 0]}>
              <boxGeometry args={[0.36, 0.5, 0.04]} />
              <meshStandardMaterial color={['#1b2a4a', '#e08a3c', '#f2e3c6', '#efd06a', accent][i]} />
            </mesh>
          ))}
        </group>
      );
    case 'camera-rig':
      return (
        <group position={position}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.5, 0.9]} />
            <meshStandardMaterial color="#1a1433" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.28, 0.5]} />
            <meshStandardMaterial color="#0a0818" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      );
    case 'waveforms':
      return (
        <group position={position}>
          {[...Array(12)].map((_, i) => {
            const h = 0.3 + Math.abs(Math.sin(i)) * 1.2;
            return (
              <mesh key={i} position={[i * 0.2 - 1.1, h / 2, 0]}>
                <boxGeometry args={[0.1, h, 0.1]} />
                <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
              </mesh>
            );
          })}
        </group>
      );
    case 'skeleton':
      return (
        <group position={position}>
          {[[0, 1.4, 0], [0, 0.9, 0], [-0.4, 0.5, 0], [0.4, 0.5, 0], [0, 0.3, 0]].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
            </mesh>
          ))}
        </group>
      );
    case 'timeline':
      return (
        <group position={position}>
          {['#7c3aed', '#db2777', '#06b6d4', accent].map((c, i) => (
            <mesh key={i} position={[i * 0.9 - 1.3, 0, 0]}>
              <boxGeometry args={[0.8, 0.4, 0.1]} />
              <meshStandardMaterial color={c} />
            </mesh>
          ))}
        </group>
      );
    case 'storyboard-grid':
      return (
        <group position={position}>
          {[...Array(6)].map((_, i) => (
            <mesh key={i} position={[(i % 3) * 1 - 1, Math.floor(i / 3) * 0.8 - 0.4, 0]}>
              <boxGeometry args={[0.9, 0.7, 0.05]} />
              <meshStandardMaterial color="#15132a" metalness={0.4} roughness={0.5} />
            </mesh>
          ))}
        </group>
      );
    case 'diffusion-orb':
      return (
        <Float speed={2} floatIntensity={0.4}>
          <mesh position={position}>
            <icosahedronGeometry args={[0.7, 2]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} roughness={0.2} metalness={0.5} />
          </mesh>
        </Float>
      );
    case 'screenplay':
      return (
        <Float speed={1.5} floatIntensity={0.3}>
          <mesh position={position} rotation={[-0.2, 0.1, 0]} castShadow>
            <boxGeometry args={[1.3, 1.8, 0.06]} />
            <meshStandardMaterial color="#f5f0e6" roughness={0.9} />
          </mesh>
        </Float>
      );
    default: // pedestal + accent shape so no room is ever empty
      return (
        <group position={position}>
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.6, 0.3]} />
            <meshStandardMaterial color="#15132a" metalness={0.6} roughness={0.4} />
          </mesh>
          <Float speed={1.5} floatIntensity={0.3}>
            <mesh position={[0, 0.8, 0]}>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} />
            </mesh>
          </Float>
        </group>
      );
  }
};

export const HeroProps: React.FC<{ kit: RoomKit }> = ({ kit }) => {
  const n = kit.heroProps.length;
  return (
    <group position={[0, -1.4, 0]}>
      {kit.heroProps.map((name, i) => {
        const spread = (i - (n - 1) / 2) * 2.6;
        return <Prop key={name} name={name} accent={kit.accent} position={[spread, 0, -0.5]} />;
      })}
    </group>
  );
};

export default HeroProps;
