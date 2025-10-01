export interface Project {
  id: number;
  title: string;
  description?: string;
  genre?: string;
  status: ProjectStatus;
  created_at: Date;
  updated_at: Date;
  metadata: Record<string, any>;
}

export type ProjectStatus = 
  | 'development' 
  | 'pre_production' 
  | 'production' 
  | 'post_production' 
  | 'distribution' 
  | 'completed';

export interface ProjectAsset {
  id: number;
  project_id: number;
  asset_type: string;
  asset_name: string;
  file_path?: string;
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Script {
  id: number;
  project_id: number;
  title: string;
  content: string;
  format: 'fountain' | 'fdx' | 'pdf';
  version: number;
  created_at: Date;
  updated_at: Date;
}

export interface Character {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  age_range?: string;
  casting_notes?: string;
  metadata: Record<string, any>;
  created_at: Date;
}

export interface ProductionSchedule {
  id: number;
  project_id: number;
  schedule_type: string;
  schedule_data: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface AISession {
  id: number;
  project_id: number;
  agent_type: string;
  session_data: Record<string, any>;
  created_at: Date;
}
