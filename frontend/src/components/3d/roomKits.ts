export type LightTemp = 'warm' | 'cool' | 'magenta';

export interface RoomKit {
  id: string;
  label: string;
  accent: string;
  lightTemp: LightTemp;
  heroProps: string[];
  panels: string[];
}

export const roomKits: Record<string, RoomKit> = {
  // 1. Script / Screenplay
  script: {
    id: 'script',
    label: 'ScriptBreak',
    accent: '#f59e0b',
    lightTemp: 'warm',
    heroProps: ['screenplay', 'desk', 'lamp'],
    panels: ['fountain-editor', 'ai-doctor'],
  },
  screenplay: {
    id: 'script',
    label: 'ScriptBreak',
    accent: '#f59e0b',
    lightTemp: 'warm',
    heroProps: ['screenplay', 'desk', 'lamp'],
    panels: ['fountain-editor', 'ai-doctor'],
  },

  // 2. Narrative Structure / Corkboard
  structure: {
    id: 'structure',
    label: 'Cork Board',
    accent: '#a855f7',
    lightTemp: 'cool',
    heroProps: ['corkwall', 'index-cards', 'string-lines'],
    panels: ['beat-board'],
  },
  plot: {
    id: 'structure',
    label: 'Plot Engine',
    accent: '#a855f7',
    lightTemp: 'cool',
    heroProps: ['corkwall', 'index-cards', 'string-lines'],
    panels: ['beat-board'],
  },
  acts: {
    id: 'structure',
    label: '3-Act Wall',
    accent: '#a855f7',
    lightTemp: 'cool',
    heroProps: ['corkwall', 'index-cards', 'string-lines'],
    panels: ['beat-board'],
  },
  beats: {
    id: 'structure',
    label: 'Beat Matrix',
    accent: '#a855f7',
    lightTemp: 'cool',
    heroProps: ['corkwall', 'index-cards', 'string-lines'],
    panels: ['beat-board'],
  },

  // 3. Plan / Master Canvas / LookDev / Architecture
  plan: {
    id: 'plan',
    label: 'Master Canvas',
    accent: '#a855f7',
    lightTemp: 'cool',
    heroProps: ['easel', 'swatches', 'material-spheres'],
    panels: ['palette', 'moodboard'],
  },
  architecture: {
    id: 'plan',
    label: 'Spatial Architecture',
    accent: '#38bdf8',
    lightTemp: 'cool',
    heroProps: ['easel', 'swatches', 'material-spheres'],
    panels: ['palette', 'moodboard'],
  },
  characters: {
    id: 'plan',
    label: 'Cast & Characters',
    accent: '#e879f9',
    lightTemp: 'magenta',
    heroProps: ['easel', 'swatches', 'diffusion-orb'],
    panels: ['palette', 'moodboard'],
  },
  cast: {
    id: 'plan',
    label: 'Cast & Characters',
    accent: '#e879f9',
    lightTemp: 'magenta',
    heroProps: ['easel', 'swatches', 'diffusion-orb'],
    panels: ['palette', 'moodboard'],
  },

  // 4. Previs / Blockout
  previs: {
    id: 'previs',
    label: 'Blockout',
    accent: '#06b6d4',
    lightTemp: 'cool',
    heroProps: ['camera-rig', 'dolly-track', 'light-stand'],
    panels: ['lens-controls'],
  },

  // 5. Motion / Kinematics
  motion: {
    id: 'motion',
    label: 'Motion Previs',
    accent: '#06b6d4',
    lightTemp: 'cool',
    heroProps: ['skeleton', 'mocap-markers'],
    panels: ['solve-controls'],
  },

  // 6. Boards / Storyboard
  boards: {
    id: 'boards',
    label: 'Storyboard Ref.',
    accent: '#f59e0b',
    lightTemp: 'warm',
    heroProps: ['storyboard-grid', 'pencil'],
    panels: ['shot-grid'],
  },

  // 7. Prompt / Neural Diffusion
  prompt: {
    id: 'prompt',
    label: 'Slate',
    accent: '#34d399',
    lightTemp: 'cool',
    heroProps: ['diffusion-orb', 'prompt-cards'],
    panels: ['prompt-pack'],
  },
  ideas: {
    id: 'prompt',
    label: 'Idea Lab',
    accent: '#fbbf24',
    lightTemp: 'warm',
    heroProps: ['diffusion-orb', 'screenplay'],
    panels: ['prompt-pack'],
  },

  // 8. Dailies / Screening
  dailies: {
    id: 'dailies',
    label: 'Circle Take',
    accent: '#ec4899',
    lightTemp: 'magenta',
    heroProps: ['screening-monitor', 'takes-stack'],
    panels: ['takes', 'scopes'],
  },
  screening: {
    id: 'dailies',
    label: 'Screening Suite',
    accent: '#ec4899',
    lightTemp: 'magenta',
    heroProps: ['screening-monitor', 'takes-stack'],
    panels: ['takes', 'scopes'],
  },

  // 9. Sound / Audio / Atmos
  sound: {
    id: 'sound',
    label: 'Stem Studio',
    accent: '#ec4899',
    lightTemp: 'magenta',
    heroProps: ['mixing-console', 'waveforms', 'speakers'],
    panels: ['stem-faders'],
  },
  audio: {
    id: 'sound',
    label: 'Stem Studio',
    accent: '#ec4899',
    lightTemp: 'magenta',
    heroProps: ['mixing-console', 'waveforms', 'speakers'],
    panels: ['stem-faders'],
  },

  // 10. Edit / Color / DaVinci
  edit: {
    id: 'edit',
    label: 'DaVinci MCP',
    accent: '#e11d48',
    lightTemp: 'magenta',
    heroProps: ['timeline', 'color-wheels', 'grade-monitor'],
    panels: ['edl-timeline'],
  },
  color: {
    id: 'edit',
    label: 'DaVinci MCP',
    accent: '#e11d48',
    lightTemp: 'magenta',
    heroProps: ['timeline', 'color-wheels', 'grade-monitor'],
    panels: ['edl-timeline'],
  },
  vault: {
    id: 'edit',
    label: 'Studio Vault',
    accent: '#f59e0b',
    lightTemp: 'warm',
    heroProps: ['timeline', 'screening-monitor'],
    panels: ['edl-timeline'],
  },
  distribution: {
    id: 'edit',
    label: 'Distribution Deck',
    accent: '#10b981',
    lightTemp: 'cool',
    heroProps: ['timeline', 'screening-monitor'],
    panels: ['edl-timeline'],
  },
  suites: {
    id: 'plan',
    label: 'Production Suites',
    accent: '#a855f7',
    lightTemp: 'cool',
    heroProps: ['easel', 'swatches', 'material-spheres'],
    panels: ['palette'],
  },
};

export default roomKits;
