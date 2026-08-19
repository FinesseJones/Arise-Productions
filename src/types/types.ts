export interface ProjectStatus {
    title: string;
    shots: {
        shotId: string;
        title: string;
        // Array of size 10. Each element must contain the explicit statusChar.
        status: Array<{ statusChar: '🟢' | '🟡' | '🔴' | '⚫' | '?' }>; 
        reshoot: boolean;
    }[];
}

// Initial mock state, ensuring every stage has a detailed status object
const getMockProjectState = (): ProjectStatus => {
    const initialStatus: Array<{ statusChar: '🟢' | '🟡' | '🔴' | '⚫' | '?' }> = Array(10).fill(null).map(() => ({ statusChar: '⚫' }));
    
    return {
        title: "Project Status: The Great Adventure",
        shots: [
            { shotId: "S-001", title: "Opening Shot (City)", status: [{ statusChar: '🟡' }, { statusChar: '🟢' }, { statusChar: '🟢' }, { statusChar: '⚫' }, { statusChar: '🔴' }, { statusChar: '🟢' }, { statusChar: '🟡' }, { statusChar: '⚫' }, { statusChar: '⚫' }, { statusChar: '⚫' }], reshoot: false },
            { shotId: "S-002", title: "Protagonist Intro", status: [{ statusChar: '🟢' }, { statusChar: '🟢' }, { statusChar: '🟢' }, { statusChar: '🟢' }, { statusChar: '🟢' }, { statusChar: '🟢' }, { statusChar: '🟢' }, { statusChar: '⚫' }, { statusChar: '⚫' }, { statusChar: '⚫' }], reshoot: false },
            { shotId: "S-003", title: "Conflict Setup (Mountain)", status: [{ statusChar: '🟢' }, { statusChar: '🟡' }, { statusChar: '🔴' }, { statusChar: '⚫' }, { statusChar: '🟡' }, { statusChar: '🟡' }, { statusChar: '⚫' }, { statusChar: '⚫' }, { statusChar: '⚫' }, { statusChar: '⚫' }], reshoot: true },
            { shotId: "S-004", title: "Climax (Chase)", status: [{ statusChar: '🟡' }, { statusChar: '⚫' }, { statusChar: '🟢' }, { statusChar: '🟡' }, { statusChar: '🟢' }, { statusChar: '⚫' }, { statusChar: '⚫' }, { statusChar: '⚫' }, { statusChar: '🔴' }, { statusChar: '⚫' }], reshoot: false },
        ]
    };
};
export { getMockProjectState };

// --- End of file ---