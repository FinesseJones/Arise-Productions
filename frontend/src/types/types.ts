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

export function getMockProjectState(): ProjectStatus {
  return {
    projectId: 'proj-titanic',
    projectName: 'Titanic - Found Footage',
    slug: 'titanic-found-footage',
    version: 1,
    shots: [
      {
        shotNumber: 1,
        title: 'Opening Monologue - Dawn',
        status: {
          script: { statusChar: '🟢', state: 'COMPLETE' },
          structure: { statusChar: '🟢', state: 'COMPLETE' },
          plan: { statusChar: '🟡', state: 'IN_PROGRESS' },
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
        shotNumber: 2,
        title: 'Corridor Chase & Encounter',
        status: {
          script: { statusChar: '🟢', state: 'COMPLETE' },
          structure: { statusChar: '?', state: 'UNSTARTED' },
          plan: { statusChar: '?', state: 'UNSTARTED' },
          previs: { statusChar: '?', state: 'UNSTARTED' },
          motion: { statusChar: '?', state: 'UNSTARTED' },
          boards: { statusChar: '?', state: 'UNSTARTED' },
          prompt: { statusChar: '?', state: 'UNSTARTED' },
          dailies: { statusChar: '?', state: 'UNSTARTED' },
          sound: { statusChar: '🟡', state: 'IN_PROGRESS' },
          edit: { statusChar: '?', state: 'UNSTARTED' },
        },
      },
      {
        shotNumber: 3,
        title: 'Final Resolution - Sunset',
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