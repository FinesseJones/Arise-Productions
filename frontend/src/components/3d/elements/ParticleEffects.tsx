import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  color?: string;
  size?: number;
  opacity?: number;
  speed?: number;
  spread?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 150,
  color = "#d4af37",
  size = 0.02,
  opacity = 0.6,
  speed = 0.001,
  spread = 25
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      
      // Velocity
      velocities[i * 3] = (Math.random() - 0.5) * 0.001;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    
    return { positions, velocities };
  }, [count, spread]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += speed;
      pointsRef.current.rotation.x += speed * 0.5;
      
      // Animate individual particles
      const positionAttribute = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const x = positionAttribute.array[i * 3];
        const y = positionAttribute.array[i * 3 + 1];
        const z = positionAttribute.array[i * 3 + 2];
        
        // Simple wave motion
        positionAttribute.array[i * 3 + 1] = y + Math.sin(state.clock.elapsedTime + x) * 0.01;
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        vertexColors={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const FloatingOrbs: React.FC<{ count?: number }> = ({ count = 8 }) => {
  const orbsRef = useRef<THREE.Group>(null);
  
  const orbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 15
      ] as [number, number, number],
      radius: 0.1 + Math.random() * 0.2,
      speed: 0.5 + Math.random() * 0.5,
      color: `hsl(${45 + Math.random() * 30}, 80%, ${50 + Math.random() * 30}%)`
    }));
  }, [count]);

  useFrame((state) => {
    if (orbsRef.current) {
      orbsRef.current.children.forEach((orb, i) => {
        const orbData = orbs[i];
        orb.position.y = orbData.position[1] + Math.sin(state.clock.elapsedTime * orbData.speed) * 2;
        orb.position.x = orbData.position[0] + Math.cos(state.clock.elapsedTime * orbData.speed * 0.7) * 1.5;
        (orb as THREE.Mesh).rotation.x += 0.01;
        (orb as THREE.Mesh).rotation.y += 0.02;
      });
    }
  });

  return (
    <group ref={orbsRef}>
      {orbs.map((orb) => (
        <mesh key={orb.id} position={orb.position}>
          <sphereGeometry args={[orb.radius, 16, 16]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.color}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export const EnergyCube: React.FC<{ position?: [number, number, number] }> = ({
  position = [0, 0, 0]
}) => {
  const cubeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.3;
      cubeRef.current.rotation.y += delta * 0.4;
      cubeRef.current.rotation.z += delta * 0.2;
      
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      cubeRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={cubeRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#d4af37"
        emissive="#d4af37"
        emissiveIntensity={0.2}
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

export const ParticleEffectsSet: React.FC = () => {
  return (
    <group>
      <ParticleField count={100} color="#d4af37" size={0.015} />
      <ParticleField 
        count={50} 
        color="#ffffff" 
        size={0.008} 
        speed={0.0005} 
        spread={30} 
      />
      <FloatingOrbs count={6} />
      <EnergyCube position={[0, 5, -5]} />
    </group>
  );
};