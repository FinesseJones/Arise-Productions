// Studio Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'in-progress' | 'review' | 'completed' | 'archived';
  type: 'video' | 'animation' | '3d-render' | 'interactive' | 'vr' | 'ar';
  createdAt: Date;
  updatedAt: Date;
  collaborators: Collaborator[];
  assets: Asset[];
  timeline: TimelineEvent[];
  metadata: ProjectMetadata;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'director' | 'producer' | 'editor' | 'animator' | '3d-artist' | 'client';
  avatar?: string;
  permissions: Permission[];
}

export interface Asset {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image' | '3d-model' | 'texture' | 'scene' | 'script';
  url: string;
  thumbnailUrl?: string;
  fileSize: number;
  format: string;
  uploadedAt: Date;
  uploadedBy: string;
  tags: string[];
  metadata: AssetMetadata;
}

export interface AssetMetadata {
  dimensions?: { width: number; height: number; depth?: number };
  duration?: number;
  frameRate?: number;
  compression?: string;
  colorSpace?: string;
  [key: string]: any;
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'asset-added' | 'render-completed' | 'review-requested';
  timestamp: Date;
  userId: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface ProjectMetadata {
  budget?: number;
  deadline?: Date;
  clientRequirements?: string[];
  technicalSpecs?: TechnicalSpecs;
  renderSettings?: RenderSettings;
}

export interface TechnicalSpecs {
  resolution: '720p' | '1080p' | '4K' | '8K' | 'custom';
  aspectRatio: '16:9' | '21:9' | '4:3' | '1:1' | 'custom';
  frameRate: 24 | 30 | 60 | 120;
  colorProfile: 'sRGB' | 'DCI-P3' | 'Rec.2020';
  audioChannels: 'mono' | 'stereo' | '5.1' | '7.1' | 'atmos';
}

export interface RenderSettings {
  engine: 'unreal' | 'blender' | 'maya' | 'cinema4d' | 'custom';
  quality: 'draft' | 'preview' | 'production' | 'cinematic';
  samples: number;
  denoise: boolean;
  motionBlur: boolean;
  outputFormat: 'mp4' | 'mov' | 'avi' | 'exr' | 'png-sequence';
}

export interface Permission {
  action: 'view' | 'edit' | 'delete' | 'share' | 'render' | 'export';
  resource: 'project' | 'asset' | 'timeline' | 'settings';
}

// 3D Scene Types
export interface Scene3DConfig {
  backgroundColor: string;
  lighting: LightingConfig;
  camera: CameraConfig;
  environment?: EnvironmentConfig;
  postProcessing?: PostProcessingConfig;
}

export interface LightingConfig {
  ambientIntensity: number;
  directionalLights: DirectionalLight[];
  pointLights: PointLight[];
  spotLights: SpotLight[];
}

export interface DirectionalLight {
  position: [number, number, number];
  intensity: number;
  color: string;
  castShadows: boolean;
}

export interface PointLight {
  position: [number, number, number];
  intensity: number;
  color: string;
  distance: number;
}

export interface SpotLight {
  position: [number, number, number];
  target: [number, number, number];
  intensity: number;
  color: string;
  angle: number;
  penumbra: number;
}

export interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  near: number;
  far: number;
  controls: 'orbit' | 'first-person' | 'fly' | 'fixed';
}

export interface EnvironmentConfig {
  preset: 'studio' | 'sunset' | 'dawn' | 'night' | 'forest' | 'city' | 'custom';
  customHDR?: string;
  backgroundBlur: number;
}

export interface PostProcessingConfig {
  bloom: boolean;
  tonemap: 'linear' | 'reinhard' | 'cineon' | 'aces';
  colorGrading: ColorGrading;
  antialiasing: 'none' | 'fxaa' | 'smaa' | 'msaa';
}

export interface ColorGrading {
  exposure: number;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  temperature: number;
  tint: number;
}