/**
 * Status tracking for a single shot across all 10 MCP production stages.
 */
export type StageStatusChar = "🟢" | "🟡" | "🔴" | "⚪" | "?";
export type StageState = "COMPLETE" | "IN_PROGRESS" | "FAILED" | "BLOCKED" | "UNSTARTED";

export type StageKey =
  | 'script'
  | 'structure'
  | 'plan'
  | 'previs'
  | 'motion'
  | 'boards'
  | 'prompt'
  | 'dailies'
  | 'sound'
  | 'edit';

export interface StageStatusRecord {
  statusChar: StageStatusChar;
  state?: StageState;
  progress?: number;
  updated_at?: string | null;
}

export interface ShotEntry {
  shotNumber: number;
  title: string;
  status: {
    script: StageStatusRecord;
    structure: StageStatusRecord;
    plan: StageStatusRecord;
    previs: StageStatusRecord;
    motion: StageStatusRecord;
    boards: StageStatusRecord;
    prompt: StageStatusRecord;
    dailies: StageStatusRecord;
    sound: StageStatusRecord;
    edit: StageStatusRecord;
  };
}

export interface ProjectStatus {
  projectId?: string;
  projectName: string;
  slug?: string;
  version?: number;
  updated_at?: string;
  shots: ShotEntry[];
}

export function createFreshProjectState(title = 'Arise Production', format = 'long_form'): ProjectStatus {
  return {
    projectId: `proj-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    projectName: title,
    slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    version: 1,
    shots: [
      {
        shotNumber: 1,
        title: `${title} - Scene 1: Inciting Sequence`,
        status: {
          script: { statusChar: '🟢', state: 'COMPLETE' },
          structure: { statusChar: '🟢', state: 'COMPLETE' },
          plan: { statusChar: '🟡', state: 'IN_PROGRESS' },
          previs: { statusChar: '🟡', state: 'IN_PROGRESS' },
          motion: { statusChar: '?', state: 'UNSTARTED' },
          boards: { statusChar: '?', state: 'UNSTARTED' },
          prompt: { statusChar: '?', state: 'UNSTARTED' },
          dailies: { statusChar: '?', state: 'UNSTARTED' },
          sound: { statusChar: '?', state: 'UNSTARTED' },
          edit: { statusChar: '?', state: 'UNSTARTED' },
        },
      },
      {
        shotNumber: 2,
        title: `${title} - Scene 2: Core Narrative Tension`,
        status: {
          script: { statusChar: '🟢', state: 'COMPLETE' },
          structure: { statusChar: '🟡', state: 'IN_PROGRESS' },
          plan: { statusChar: '?', state: 'UNSTARTED' },
          previs: { statusChar: '?', state: 'UNSTARTED' },
          motion: { statusChar: '?', state: 'UNSTARTED' },
          boards: { statusChar: '?', state: 'UNSTARTED' },
          prompt: { statusChar: '?', state: 'UNSTARTED' },
          dailies: { statusChar: '?', state: 'UNSTARTED' },
          sound: { statusChar: '?', state: 'UNSTARTED' },
          edit: { statusChar: '?', state: 'UNSTARTED' },
        },
      },
      {
        shotNumber: 3,
        title: `${title} - Scene 3: Climax & Resolution`,
        status: {
          script: { statusChar: '?', state: 'UNSTARTED' },
          structure: { statusChar: '?', state: 'UNSTARTED' },
          plan: { statusChar: '?', state: 'UNSTARTED' },
          previs: { statusChar: '?', state: 'UNSTARTED' },
          motion: { statusChar: '?', state: 'UNSTARTED' },
          boards: { statusChar: '?', state: 'UNSTARTED' },
          prompt: { statusChar: '?', state: 'UNSTARTED' },
          dailies: { statusChar: '?', state: 'UNSTARTED' },
          sound: { statusChar: '?', state: 'UNSTARTED' },
          edit: { statusChar: '?', state: 'UNSTARTED' },
        },
      },
    ],
  };
}

export function getMockProjectState(title = 'Arise Production'): ProjectStatus {
  return createFreshProjectState(title);
}