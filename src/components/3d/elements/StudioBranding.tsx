import React from 'react';
import { Text, Float } from '@react-three/drei';

interface StudioTextProps {
  text: string;
  position: [number, number, number];
  fontSize?: number;
  color?: string;
  floatSpeed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
}

export const StudioText: React.FC<StudioTextProps> = ({
  text,
  position,
  fontSize = 0.8,
  color = "#d4af37",
  floatSpeed = 0.8,
  rotationIntensity = 0.2,
  floatIntensity = 0.3
}) => {
  return (
    <Float 
      speed={floatSpeed} 
      rotationIntensity={rotationIntensity} 
      floatIntensity={floatIntensity}
    >
      <Text
        position={position}
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </Float>
  );
};

export const StudioLogo3D: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  return (
    <group scale={scale}>
      <StudioText
        text="FINESSE"
        position={[0, 0.5, 0]}
        fontSize={1.2}
        color="#d4af37"
        floatSpeed={0.8}
        rotationIntensity={0.1}
        floatIntensity={0.2}
      />
      <StudioText
        text="JONES"
        position={[0, -0.3, 0]}
        fontSize={0.8}
        color="#ffffff"
        floatSpeed={0.6}
        rotationIntensity={0.1}
        floatIntensity={0.15}
      />
      <StudioText
        text="CONTENT FOUNDRY STUDIOS"
        position={[0, -1, 0]}
        fontSize={0.3}
        color="#b8b8b8"
        floatSpeed={0.4}
        rotationIntensity={0.05}
        floatIntensity={0.1}
      />
    </group>
  );
};

export const ProjectTitle3D: React.FC<{ 
  title: string; 
  subtitle?: string;
  position?: [number, number, number];
}> = ({ title, subtitle, position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <StudioText
        text={title}
        position={[0, 0.5, 0]}
        fontSize={0.6}
        color="#d4af37"
        floatSpeed={0.5}
      />
      {subtitle && (
        <StudioText
          text={subtitle}
          position={[0, -0.3, 0]}
          fontSize={0.3}
          color="#ffffff"
          floatSpeed={0.3}
        />
      )}
    </group>
  );
};

export const StudioTagline: React.FC = () => {
  return (
    <group>
      <StudioText
        text="VISION-DRIVEN"
        position={[-3, 2, -2]}
        fontSize={0.4}
        color="#d4af37"
        floatSpeed={0.6}
        rotationIntensity={0.1}
      />
      <StudioText
        text="CREATOR-LED"
        position={[3, 1.5, -2]}
        fontSize={0.4}
        color="#d4af37"
        floatSpeed={0.7}
        rotationIntensity={0.1}
      />
      <StudioText
        text="BUILT TO EMPOWER BOLD"
        position={[0, -3, -2]}
        fontSize={0.35}
        color="#ffffff"
        floatSpeed={0.5}
        rotationIntensity={0.05}
      />
    </group>
  );
};