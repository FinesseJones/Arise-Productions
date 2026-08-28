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
  script: {
    id: 'script',
    label: 'ScriptBreak',
    accent: '#f59e0b',
    lightTemp: 'warm',
    heroProps: ['screenplay', 'desk', 'lamp'],
    panels: ['fountain-editor', 'ai-doctor'],
  },
  structure: {
    id: 'structure',
    label: 'Cork Board',
    accent: '#a855f7',
    lightTemp: 'cool',
    heroProps: ['corkwall', 'index-cards', 'string-lines'],
    panels: ['beat-board'],
  },
  plan: {
    id: 'plan',
    label: 'Master Canvas',
    accent: '#a855f7',
    lightTemp: 'cool',
    heroProps: ['easel', 'swatches', 'material-spheres'],
    panels: ['palette', 'moodboard'],
  },
  previs: {
    id: 'previs',
    label: 'Blockout',
    accent: '#06b6d4',
    lightTemp: 'cool',
    heroProps: ['camera-rig', 'dolly-track', 'light-stand'],
    panels: ['lens-controls'],
  },
  motion: {
    id: 'motion',
    label: 'Motion Previs',
    accent: '#06b6d4',
    lightTemp: 'cool',
    heroProps: ['skeleton', 'mocap-markers'],
    panels: ['solve-controls'],
  },
  boards: {
    id: 'boards',
    label: 'Storyboard Ref.',
    accent: '#f59e0b',
    lightTemp: 'warm',
    heroProps: ['storyboard-grid', 'pencil'],
    panels: ['shot-grid'],
  },
  prompt: {
    id: 'prompt',
    label: 'Slate',
    accent: '#34d399',
    lightTemp: 'cool',
    heroProps: ['diffusion-orb', 'prompt-cards'],
    panels: ['prompt-pack'],
  },
  dailies: {
    id: 'dailies',
    label: 'Circle Take',
    accent: '#ec4899',
    lightTemp: 'magenta',
    heroProps: ['screening-monitor', 'takes-stack'],
    panels: ['takes', 'scopes'],
  },
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
  edit: {
    id: 'edit',
    label: 'DaVinci MCP',
    accent: '#e11d48',
    lightTemp: 'magenta',
    heroProps: ['timeline', 'color-wheels', 'grade-monitor'],
    panels: ['edl-timeline'],
  },
};

export default roomKits;
