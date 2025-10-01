// Theme System for Finesse Jones Content Foundry Studios
export type ThemeVariant = 'original' | 'modern' | 'cinematic' | 'minimal';

export interface StudioTheme {
  name: string;
  description: string;
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    background: string[];
    surface: string[];
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    border: string;
    ring: string;
  };
  gradients: {
    hero: string;
    card: string;
    button: string;
    accent: string;
    background: string;
  };
  effects: {
    blur: string;
    shadow: string;
    glow: string;
  };
}

export const themes: Record<ThemeVariant, StudioTheme> = {
  original: {
    name: 'Original Studio',
    description: 'Purple, navy and gold cinematic theme with deep contrast',
    colors: {
      primary: ['#8B5CF6', '#7C3AED', '#6D28D9'], // Purple variants
      secondary: ['#1E293B', '#0F172A', '#020617'], // Navy/slate variants  
      accent: ['#F59E0B', '#D97706', '#B45309'], // Gold/amber variants
      background: ['#0F172A', '#1E293B', '#334155'], // Dark navy to slate
      surface: ['#1E293B/30', '#334155/20', '#475569/10'], // Semi-transparent layers
      text: {
        primary: '#FFFFFF',
        secondary: '#CBD5E1',
        accent: '#F59E0B'
      },
      border: '#F59E0B/20',
      ring: '#F59E0B/50'
    },
    gradients: {
      hero: 'from-slate-900 via-purple-900 to-slate-900',
      card: 'from-slate-700/30 via-purple-800/20 to-amber-800/10',
      button: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
      accent: 'from-blue-500 via-purple-500 to-amber-500',
      background: 'from-slate-900 via-slate-800 to-purple-900'
    },
    effects: {
      blur: 'backdrop-blur-sm',
      shadow: 'shadow-2xl shadow-purple-500/20',
      glow: 'shadow-lg shadow-amber-500/30'
    }
  },

  modern: {
    name: 'Modern Studio', 
    description: 'Clean yellow and slate theme with crisp contrast',
    colors: {
      primary: ['#EAB308', '#CA8A04', '#A16207'], // Yellow variants
      secondary: ['#1E293B', '#334155', '#475569'], // Slate variants
      accent: ['#3B82F6', '#2563EB', '#1D4ED8'], // Blue variants
      background: ['#0F172A', '#1E293B', '#334155'], // Dark slate
      surface: ['#1E293B/50', '#334155/30', '#475569/20'], // Semi-transparent layers
      text: {
        primary: '#FFFFFF',
        secondary: '#94A3B8',
        accent: '#EAB308'
      },
      border: '#EAB308/30',
      ring: '#EAB308/50'
    },
    gradients: {
      hero: 'from-slate-900 via-slate-800 to-slate-900',
      card: 'from-slate-800/50 via-slate-700/30 to-slate-600/20',
      button: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
      accent: 'from-white via-yellow-200 to-yellow-400',
      background: 'from-slate-900 via-slate-800 to-black'
    },
    effects: {
      blur: 'backdrop-blur-sm',
      shadow: 'shadow-xl shadow-slate-500/10',
      glow: 'shadow-lg shadow-yellow-500/20'
    }
  },

  cinematic: {
    name: 'Cinematic Studio',
    description: 'Film-inspired theme with warm and cool contrasts',
    colors: {
      primary: ['#DC2626', '#B91C1C', '#991B1B'], // Red variants
      secondary: ['#111827', '#1F2937', '#374151'], // Gray variants
      accent: ['#F59E0B', '#D97706', '#B45309'], // Amber variants
      background: ['#111827', '#1F2937', '#374151'], // Dark grays
      surface: ['#1F2937/40', '#374151/30', '#4B5563/20'], // Semi-transparent layers
      text: {
        primary: '#F9FAFB',
        secondary: '#D1D5DB',
        accent: '#F59E0B'
      },
      border: '#F59E0B/25',
      ring: '#DC2626/50'
    },
    gradients: {
      hero: 'from-gray-900 via-red-900/30 to-gray-900',
      card: 'from-gray-800/40 via-red-800/20 to-amber-800/10',
      button: 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
      accent: 'from-red-500 via-orange-500 to-amber-500',
      background: 'from-gray-900 via-gray-800 to-red-900/20'
    },
    effects: {
      blur: 'backdrop-blur-md',
      shadow: 'shadow-2xl shadow-red-500/15',
      glow: 'shadow-xl shadow-amber-500/25'
    }
  },

  minimal: {
    name: 'Minimal Studio',
    description: 'Clean and focused theme for maximum content clarity',
    colors: {
      primary: ['#6366F1', '#4F46E5', '#4338CA'], // Indigo variants
      secondary: ['#F8FAFC', '#F1F5F9', '#E2E8F0'], // Light grays
      accent: ['#10B981', '#059669', '#047857'], // Green variants
      background: ['#FFFFFF', '#F8FAFC', '#F1F5F9'], // Light backgrounds
      surface: ['#FFFFFF/80', '#F8FAFC/60', '#F1F5F9/40'], // Light semi-transparent layers
      text: {
        primary: '#0F172A',
        secondary: '#475569',
        accent: '#6366F1'
      },
      border: '#E2E8F0',
      ring: '#6366F1/30'
    },
    gradients: {
      hero: 'from-white via-slate-50 to-indigo-50',
      card: 'from-white/80 via-slate-50/60 to-indigo-50/40',
      button: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      accent: 'from-indigo-500 via-purple-500 to-green-500',
      background: 'from-white via-slate-50 to-slate-100'
    },
    effects: {
      blur: 'backdrop-blur-xs',
      shadow: 'shadow-lg shadow-slate-200',
      glow: 'shadow-md shadow-indigo-500/20'
    }
  }
};

export const defaultTheme: ThemeVariant = 'original';

// Theme utilities
export const getTheme = (variant: ThemeVariant = defaultTheme): StudioTheme => {
  return themes[variant];
};

export const getThemeColors = (variant: ThemeVariant = defaultTheme) => {
  return themes[variant].colors;
};

export const getThemeGradients = (variant: ThemeVariant = defaultTheme) => {
  return themes[variant].gradients;
};

// CSS class generators
export const generateThemeClasses = (variant: ThemeVariant = defaultTheme) => {
  const theme = getTheme(variant);
  
  return {
    // Background classes
    heroBackground: `bg-gradient-to-br ${theme.gradients.hero}`,
    cardBackground: `bg-gradient-to-br ${theme.gradients.card}`,
    pageBackground: `bg-gradient-to-br ${theme.gradients.background}`,
    
    // Text classes
    headingText: `text-${theme.colors.text.primary}`,
    bodyText: `text-${theme.colors.text.secondary}`,
    accentText: `text-[${theme.colors.text.accent}]`,
    
    // Button classes
    primaryButton: `bg-gradient-to-r ${theme.gradients.button} text-black font-semibold transition-all duration-200`,
    
    // Card classes
    card: `${theme.gradients.card} border border-[${theme.colors.border}] ${theme.effects.blur}`,
    
    // Effect classes
    glow: theme.effects.glow,
    shadow: theme.effects.shadow,
    blur: theme.effects.blur
  };
};