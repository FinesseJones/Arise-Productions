/**
 * Status tracking for a single shot (Shot 1, Shot 2, etc.) across all 10 stages.
 * Example: One shot might be complete (green dot) at Blockout (Stage 4) 
 * but still needs work (yellow dot) at the Circle Take stage (Stage 7).
 */
export type ShotStatus = {
    // Stage 1: Script (ScriptBreak)
    script: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
    // Stage 2: Structure (Cork Board)
    structure: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
    // Stage 3: Plan (Master Canvas)
    plan: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
    // Stage 4: Previs (Blockout)
    previs: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
    // Stage 5: Motion (Motion Previs Studio)
    motion: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
    // Stage 6: Boards (Storybook Reference Studio)
    boards: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
    // Stage 7: Prompt (Slate)
    prompt: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
    // Stage 8: Dailies (Circle Take)
    dailies: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
    // Stage 9: Sound (Stem Studio)
    sound: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
    // Stage 10: Edit/Finish (DaVinci MCP)
    edit: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
};

export interface ProjectStatus {
    projectName: string;
    // The shot list manifest, containing status for every shot.
    shots: {
        shotNumber: number;
        title: string;
        status: {
            [`script`]: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
            [`structure`]: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
            [`plan`]: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
            [`previs`]: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
            [`motion`]: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
            [`boards`]: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
            [`prompt`]: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
            [`dailies`]: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
            [`sound`]: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
            [`edit`]: { statusChar: "🟢" | "🟡" | "🔴" | "?" };
        };
    };
}