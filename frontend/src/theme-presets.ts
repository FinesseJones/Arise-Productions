// ==============================================================================
// ARISE PRODUCTION - THEME PRESETS
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    surface: string;
    surfaceHighlight: string;
    primary: string;
    secondary: string;
    accent: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
}

export const themePresets: ThemePreset[] = [
  {
    id: 'arise-default',
    name: 'Arise Default',
    description: 'Original Arise Production Studio theme with amethyst and rose copper accents',
    colors: {
      background: '#080512',
      surface: '#140e2e',
      surfaceHighlight: '#1a142e',
      primary: '#8b5cf6',
      secondary: '#f43f5e',
      accent: '#fde047',
      text: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
        muted: '#94a3b8',
      },
      status: {
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
    },
  },
  {
    id: 'davinci-resolve',
    name: 'DaVinci Resolve',
    description: 'Professional color grading theme inspired by Blackmagic DaVinci Resolve',
    colors: {
      background: '#1a1a1a',
      surface: '#2a2a2a',
      surfaceHighlight: '#333333',
      primary: '#ff6b00',
      secondary: '#ff9500',
      accent: '#00d4ff',
      text: {
        primary: '#ffffff',
        secondary: '#cccccc',
        muted: '#999999',
      },
      status: {
        success: '#00ff00',
        warning: '#ffaa00',
        error: '#ff0000',
        info: '#00aaff',
      },
    },
  },
  {
    id: 'premiere-pro',
    name: 'Adobe Premiere Pro',
    description: 'Professional video editing theme inspired by Adobe Premiere Pro',
    colors: {
      background: '#232323',
      surface: '#2d2d2d',
      surfaceHighlight: '#3a3a3a',
      primary: '#9999ff',
      secondary: '#ff9900',
      accent: '#00ffff',
      text: {
        primary: '#ffffff',
        secondary: '#cccccc',
        muted: '#888888',
      },
      status: {
        success: '#00ff00',
        warning: '#ffcc00',
        error: '#ff4444',
        info: '#44aaff',
      },
    },
  },
  {
    id: 'avid-media-composer',
    name: 'Avid Media Composer',
    description: 'Professional editing theme inspired by Avid Media Composer',
    colors: {
      background: '#1e1e1e',
      surface: '#2e2e2e',
      surfaceHighlight: '#3e3e3e',
      primary: '#ff6600',
      secondary: '#3399ff',
      accent: '#ffcc00',
      text: {
        primary: '#ffffff',
        secondary: '#cccccc',
        muted: '#888888',
      },
      status: {
        success: '#00cc00',
        warning: '#ffaa00',
        error: '#ff3333',
        info: '#3399ff',
      },
    },
  },
  {
    id: 'unreal-engine',
    name: 'Unreal Engine',
    description: 'Game engine theme inspired by Unreal Engine editor',
    colors: {
      background: '#1a1a1a',
      surface: '#252525',
      surfaceHighlight: '#303030',
      primary: '#ffffff',
      secondary: '#ff6b00',
      accent: '#00d4ff',
      text: {
        primary: '#ffffff',
        secondary: '#cccccc',
        muted: '#888888',
      },
      status: {
        success: '#00ff00',
        warning: '#ffaa00',
        error: '#ff0000',
        info: '#00aaff',
      },
    },
  },
];

export const applyTheme = (theme: ThemePreset) => {
  const root = document.documentElement;
  
  // Apply CSS variables
  root.style.setProperty('--bg-nebula', theme.colors.background);
  root.style.setProperty('--bg-card', theme.colors.surface);
  root.style.setProperty('--surface-1', theme.colors.background);
  root.style.setProperty('--surface-2', theme.colors.surface);
  root.style.setProperty('--surface-3', theme.colors.surfaceHighlight);
  root.style.setProperty('--surface-4', theme.colors.surfaceHighlight);
  
  root.style.setProperty('--text-primary', theme.colors.text.primary);
  root.style.setProperty('--text-secondary', theme.colors.text.secondary);
  root.style.setProperty('--text-muted', theme.colors.text.muted);
  
  root.style.setProperty('--status-success', theme.colors.status.success);
  root.style.setProperty('--status-warning', theme.colors.status.warning);
  root.style.setProperty('--status-error', theme.colors.status.error);
  root.style.setProperty('--status-info', theme.colors.status.info);
  
  root.style.setProperty('--amethyst', theme.colors.primary);
  root.style.setProperty('--rose-copper', theme.colors.secondary);
  root.style.setProperty('--starlight-gold', theme.colors.accent);
  
  // Persist to localStorage
  localStorage.setItem('arise-theme', theme.id);
};

export const loadSavedTheme = () => {
  const savedThemeId = localStorage.getItem('arise-theme');
  if (savedThemeId) {
    const theme = themePresets.find((t) => t.id === savedThemeId);
    if (theme) {
      applyTheme(theme);
      return theme;
    }
  }
  // Default to Arise theme
  applyTheme(themePresets[0]);
  return themePresets[0];
};
