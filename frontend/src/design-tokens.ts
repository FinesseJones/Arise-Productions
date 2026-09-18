// ==============================================================================
// ARISE PRODUCTION - DESIGN TOKENS
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

export const tokens = {
  // Spacing tokens
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    // 4K-optimized
    '4k-compact': '0.5rem',
    '4k-normal': '1rem',
    '4k-comfortable': '1.5rem',
    '4k-spacious': '2rem',
  },

  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    subtle: '0 2px 8px rgba(0,0,0,0.1)',
    medium: '0 4px 16px rgba(0,0,0,0.15)',
    strong: '0 8px 32px rgba(0,0,0,0.25)',
    studio: '0 8px 32px rgba(59, 130, 246, 0.25)',
    '3d': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-out',
    normal: '300ms ease-out',
    slow: '500ms ease-out',
  },

  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modal: 400,
    popover: 500,
    tooltip: 600,
  },

  // Production-specific colors
  production: {
    timeline: '#1a1a1a',
    timelineTrack: '#2a2a2a',
    timelinePlayhead: '#ff6b00',
    viewport: '#0d0d0d',
    viewportHighlight: '#1e1e1e',
    mediaBin: '#151515',
    mediaItemSelected: '#2a2a2a',
    inspector: '#121212',
    inspectorSection: '#1a1a1a',
  },

  // Status colors (WCAG AA compliant)
  status: {
    recording: '#ef4444',
    ready: '#22c55e',
    render: '#f59e0b',
    complete: '#3b82f6',
    warning: '#eab308',
    error: '#dc2626',
  },

  // Typography
  typography: {
    // 4K-optimized font sizes
    '4k-xs': '14px',
    '4k-sm': '16px',
    '4k-base': '18px',
    '4k-lg': '20px',
    '4k-xl': '24px',
    '4k-2xl': '32px',
    '4k-3xl': '40px',
    '4k-4xl': '48px',
  },

  // Breakpoints
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1280px',
    '3xl': '1920px',
    '4xl': '2560px',
  },

  // Aspect ratios
  aspectRatio: {
    '16:9': '16 / 9',
    '2.39:1': '2.39 / 1',
    '9:16': '9 / 16',
    '1:1': '1 / 1',
    '4:3': '4 / 3',
  },
} as const;

export type TokenName = keyof typeof tokens;
