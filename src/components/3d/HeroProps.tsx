'use client';
import React from 'react';
import { Float } from '@react-three/drei';
import { RoomKit } from './roomKits';

// Cinematic PBR Prop Geometries Grounded on Floor (y = 0 relative to parent floor at -2.15)
const Prop: React.FC<{ name: string; accent: string; position: [number, number, number] }> = ({
  name,
  accent,
  position,
}) => {
  switch (name) {
    // 1. Audio Mixing Console & Soundboard
    case 'mixing-console':
      return (
        <group position={position}>
          {/* Desk Stand / Ground Legs */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.8, 0.9]} />
            <meshPhysicalMaterial
              color="#0d091e"
              metalness={0.85}
              roughness={0.22}
              clearcoat={0.6}
              clearcoatRoughness={0.15}
              envMapIntensity={1.5}
            />
          </mesh>
          {/* Console Surface Angled Wedge */}
          <mesh position={[0, 0.85, 0.05]} rotation={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[2.3, 0.14, 0.85]} />
            <meshPhysicalMaterial
              color="#171233"
              metalness={0.92}
              roughness={0.18}
              clearcoat={0.8}
              envMapIntensity={1.8}
            />
          </mesh>
          {/* Illuminated Fader Strips & VU Meter Knobs */}
          {[...Array(10)].map((_, i) => (
            <mesh key={i} position={[-0.95 + i * 0.21, 0.95, 0.05]} rotation={[-0.2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.1]} />
              <meshPhysicalMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={0.8}
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>
          ))}
        </group>
      );

    // 2. 4K Screening Monitor & Color Grading Display
    case 'screening-monitor':
    case 'grade-monitor':
      return (
        <group position={position}>
          {/* Heavy Floor Pedestal Stand */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.08, 0.35, 0.9, 32]} />
            <meshPhysicalMaterial
              color="#100b24"
              metalness={0.95}
              roughness={0.15}
              clearcoat={0.7}
              envMapIntensity={1.6}
            />
          </mesh>
          {/* Monitor Frame */}
          <mesh position={[0, 1.25, 0]} castShadow>
            <boxGeometry args={[3.0, 1.7, 0.12]} />
            <meshPhysicalMaterial
              color="#0a0618"
              metalness={0.92}
              roughness={0.16}
              clearcoat={0.9}
              clearcoatRoughness={0.1}
              envMapIntensity={1.8}
            />
          </mesh>
          {/* Physical Glass Screen with Cinema Display Texture */}
          <mesh position={[0, 1.25, 0.07]}>
            <planeGeometry args={[2.85, 1.55]} />
            <meshPhysicalMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.35}
              roughness={0.08}
              metalness={0.2}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              envMapIntensity={2.2}
            />
          </mesh>
        </group>
      );

    // 3. Screenplay Artisan Writing Desk & Lamp
    case 'desk':
    case 'screenplay':
      return (
        <group position={position}>
          {/* Solid Wooden Desk Grounded on Floor */}
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.84, 1.2]} />
            <meshPhysicalMaterial
              color="#1e1333"
              roughness={0.32}
              metalness={0.4}
              clearcoat={0.7}
              clearcoatRoughness={0.2}
              envMapIntensity={1.3}
            />
          </mesh>
          {/* Screenplay Fountain Manuscript Sheets */}
          <mesh position={[-0.3, 0.86, 0.1]} rotation={[-Math.PI / 2, 0, 0.15]} castShadow>
            <planeGeometry args={[0.9, 1.25]} />
            <meshPhysicalMaterial
              color="#faf5ea"
              roughness={0.75}
              metalness={0.05}
              clearcoat={0.2}
            />
          </mesh>
          {/* Brass Desk Lamp */}
          <group position={[0.7, 0.85, -0.3]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.15, 0.18, 0.05, 16]} />
              <meshPhysicalMaterial color="#d97706" metalness={0.95} roughness={0.12} clearcoat={0.8} envMapIntensity={2.0} />
            </mesh>
            <mesh position={[0, 0.25, 0]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.5]} />
              <meshPhysicalMaterial color="#d97706" metalness={0.95} roughness={0.12} />
            </mesh>
            <mesh position={[0, 0.5, 0]} rotation={[0.4, 0, 0]} castShadow>
              <coneGeometry args={[0.18, 0.25, 16]} />
              <meshPhysicalMaterial color="#b45309" metalness={0.9} roughness={0.2} />
            </mesh>
            <pointLight position={[0, 0.45, 0.1]} intensity={1.8} color="#fef08a" distance={3} />
          </group>
        </group>
      );

    // 4. 35mm Hollywood CineCamera Rig on Dolly Track
    case 'camera-rig':
    case 'dolly-track':
      return (
        <group position={position}>
          {/* Dolly Track Floor Rails */}
          <mesh position={[0, 0.04, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.04, 0.04, 3.2, 16]} />
            <meshPhysicalMaterial color="#334155" metalness={0.95} roughness={0.15} envMapIntensity={1.8} />
          </mesh>
          {/* Heavy Cine Tripod Base */}
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.4, 1.1, 16]} />
            <meshPhysicalMaterial color="#090518" metalness={0.9} roughness={0.2} clearcoat={0.6} />
          </mesh>
          {/* Cinema Camera Body (Matte Obsidian) */}
          <mesh position={[0, 1.25, 0]} castShadow>
            <boxGeometry args={[0.9, 0.6, 1.0]} />
            <meshPhysicalMaterial color="#130e28" metalness={0.88} roughness={0.18} clearcoat={0.8} envMapIntensity={2.0} />
          </mesh>
          {/* 35mm Anamorphic Lens Barrel */}
          <mesh position={[0, 1.25, 0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.32, 0.55, 32]} />
            <meshPhysicalMaterial color="#080414" metalness={0.96} roughness={0.08} clearcoat={1.0} envMapIntensity={2.5} />
          </mesh>
          {/* Lens Glass Element Reflection */}
          <mesh position={[0, 1.25, 0.98]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.24, 32]} />
            <meshPhysicalMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.5}
              roughness={0.02}
              metalness={0.2}
              clearcoat={1.0}
              envMapIntensity={3.0}
            />
          </mesh>
        </group>
      );

    // 5. LookDev Art Easel & Color Swatches
    case 'easel':
    case 'swatches':
      return (
        <group position={position}>
          {/* Tripod Easel Stand */}
          <mesh position={[0, 0.8, 0]} rotation={[0, 0, -0.08]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.6, 0.08]} />
            <meshPhysicalMaterial color="#221838" roughness={0.4} metalness={0.3} clearcoat={0.5} envMapIntensity={1.2} />
          </mesh>
          {/* Moodboard / Color Swatch Palette Grid */}
          <group position={[0, 0.9, 0.06]}>
            {[...Array(6)].map((_, i) => (
              <mesh key={i} position={[(i % 3) * 0.45 - 0.45, Math.floor(i / 3) * 0.45 - 0.22, 0]} castShadow>
                <boxGeometry args={[0.38, 0.38, 0.04]} />
                <meshPhysicalMaterial
                  color={['#f59e0b', '#a855f7', '#06b6d4', '#ec4899', '#34d399', accent][i]}
                  metalness={0.5}
                  roughness={0.2}
                  clearcoat={0.8}
                  envMapIntensity={1.8}
                />
              </mesh>
            ))}
          </group>
        </group>
      );

    // 6. Corkboard & Narrative Index Wall
    case 'corkwall':
    case 'index-cards':
      return (
        <group position={position}>
          {/* Ground Stand Legs */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.25, 0.9, 16]} />
            <meshPhysicalMaterial color="#1a1233" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Cork Frame Board */}
          <mesh position={[0, 1.25, 0]} castShadow>
            <boxGeometry args={[2.6, 1.6, 0.08]} />
            <meshPhysicalMaterial color="#382414" roughness={0.85} metalness={0.1} />
          </mesh>
          {/* Pinned 3-Act Index Cards */}
          <group position={[0, 1.25, 0.05]}>
            {[...Array(8)].map((_, i) => (
              <mesh key={i} position={[(i % 4) * 0.55 - 0.82, Math.floor(i / 4) * 0.55 - 0.28, 0]} castShadow>
                <boxGeometry args={[0.48, 0.38, 0.02]} />
                <meshPhysicalMaterial
                  color={['#fef08a', '#fbcfe8', '#bae6fd', '#dcfce7', '#fed7aa', '#e9d5ff', '#fef08a', accent][i]}
                  roughness={0.7}
                  metalness={0.05}
                  clearcoat={0.2}
                />
              </mesh>
            ))}
          </group>
        </group>
      );

    // 7. Kinematic Skeletal Node Rig
    case 'skeleton':
    case 'mocap-markers':
      return (
        <group position={position}>
          {/* Ground Calibration Plate */}
          <mesh position={[0, 0.02, 0]} receiveShadow>
            <cylinderGeometry args={[0.8, 0.85, 0.04, 32]} />
            <meshPhysicalMaterial color="#110d26" metalness={0.9} roughness={0.15} envMapIntensity={1.8} />
          </mesh>
          {/* Dynamic Kinematic Spine & Joints */}
          {[
            [0, 1.6, 0],   // Head
            [0, 1.2, 0],   // Chest
            [0, 0.8, 0],   // Pelvis
            [-0.45, 1.1, 0], // Left Shoulder
            [0.45, 1.1, 0],  // Right Shoulder
            [-0.3, 0.4, 0],  // Left Knee
            [0.3, 0.4, 0],   // Right Knee
          ].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]} castShadow>
              <sphereGeometry args={[0.11, 24, 24]} />
              <meshPhysicalMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={0.85}
                metalness={0.95}
                roughness={0.08}
                clearcoat={1.0}
                envMapIntensity={2.5}
              />
            </mesh>
          ))}
        </group>
      );

    // 8. Generative Diffusion Orb with Float & Floor Pedestal
    case 'diffusion-orb':
    case 'prompt-cards':
      return (
        <group position={position}>
          {/* Pedestal Stand */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.4, 0.6, 0.8, 32]} />
            <meshPhysicalMaterial color="#120c2b" metalness={0.9} roughness={0.2} clearcoat={0.7} envMapIntensity={1.6} />
          </mesh>
          {/* Floating Refractive Diffusion Orb */}
          <Float speed={2.5} floatIntensity={0.5} floatingRange={[0.05, 0.2]}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <icosahedronGeometry args={[0.65, 3]} />
              <meshPhysicalMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={0.75}
                roughness={0.08}
                metalness={0.3}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
                transmission={0.4}
                ior={1.5}
                envMapIntensity={2.8}
              />
            </mesh>
          </Float>
        </group>
      );

    // 9. Multi-Track Timeline & Grade Wheels
    case 'timeline':
    case 'color-wheels':
      return (
        <group position={position}>
          {/* Pedestal Base */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 0.8, 0.8]} />
            <meshPhysicalMaterial color="#0f0a22" metalness={0.88} roughness={0.22} clearcoat={0.6} envMapIntensity={1.5} />
          </mesh>
          {/* Multi-Track Color Coded Video Blocks */}
          {['#7c3aed', '#db2777', '#06b6d4', accent].map((c, i) => (
            <mesh key={i} position={[i * 0.6 - 0.9, 0.86, 0]} castShadow>
              <boxGeometry args={[0.52, 0.1, 0.6]} />
              <meshPhysicalMaterial color={c} metalness={0.8} roughness={0.2} clearcoat={0.8} envMapIntensity={1.8} />
            </mesh>
          ))}
        </group>
      );

    // 10. Default Grounded Pedestal
    default:
      return (
        <group position={position}>
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.65, 0.7, 32]} />
            <meshPhysicalMaterial color="#150f33" metalness={0.9} roughness={0.2} clearcoat={0.6} envMapIntensity={1.5} />
          </mesh>
          <Float speed={1.8} floatIntensity={0.35}>
            <mesh position={[0, 1.1, 0]} castShadow>
              <octahedronGeometry args={[0.5]} />
              <meshPhysicalMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={0.6}
                roughness={0.12}
                metalness={0.85}
                clearcoat={1.0}
                envMapIntensity={2.2}
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
    <group position={[0, -2.15, 0]}>
      {/* Curved Studio Cyclorama Back Wall & Seamless Floor Grounding */}
      <mesh position={[0, 3.5, -6]} receiveShadow>
        <planeGeometry args={[40, 14]} />
        <meshPhysicalMaterial
          color="#060312"
          roughness={0.35}
          metalness={0.4}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Bespoke Props for this Room Kit */}
      {kit.heroProps.map((name, i) => {
        const spread = (i - (n - 1) / 2) * 2.8;
        return <Prop key={name} name={name} accent={kit.accent} position={[spread, 0, -0.4]} />;
      })}
    </group>
  );
};

export default HeroProps;
