export interface Stage {
    id: string;
    number: number;
    name: string;
    description: string;
}

export const stages: Stage[] = [
    { id: 'script', number: 1, name: 'ScriptBreak', description: 'Scenes, bibles, shot lists, and prompt packs.' },
    { id: 'structure', number: 2, name: 'Cork Board', description: 'Act arcs, scene list, and fountain analysis.' },
    { id: 'plan', number: 3, name: 'Master Canvas', description: 'Master handoff package for assets and prompts.' },
    { id: 'previs', number: 4, name: 'Blockout', description: 'Blocking, camera choreography, and motion reference.' },
    { id: 'motion', number: 5, name: 'Motion Previs Studio', description: 'Pose/camera solve from real footage to feed Blockout.' },
    { id: 'boards', number: 6, name: 'Storyboard Reference Studio', description: 'Animatics, PDF boards, and generative prompts.' },
    { id: 'prompt', number: 7, name: 'Slate', description: 'Continuity-locked prompts for all media types.' },
    { id: 'dailies', number: 8, name: 'Circle Take', description: 'Review takes, quality gates, and reshoot list generation.' },
    { id: 'audio', number: 9, name: 'Stem Studio', description: 'Separated dialogue, music, and effects stems.' },
    { id: 'edit', number: 10, name: 'DaVinci MCP', description: 'Agent-driven cut, color, and final quality control.' },
];


// --- End of file ---