import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeVariant, getTheme, generateThemeClasses, defaultTheme } from '@/themes';

interface ThemeContextType {
  currentTheme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;
  theme: ReturnType<typeof getTheme>;
  classes: ReturnType<typeof generateThemeClasses>;
  toggleTheme: () => void;
  availableThemes: ThemeVariant[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode; initialTheme?: ThemeVariant }> = ({ 
  children, 
  initialTheme = defaultTheme 
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>(initialTheme);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('studio-theme') as ThemeVariant;
    if (savedTheme && ['original', 'modern', 'cinematic', 'minimal'].includes(savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('studio-theme', currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: ThemeVariant) => {
    setCurrentTheme(theme);
  };

  const toggleTheme = () => {
    const themes: ThemeVariant[] = ['original', 'modern', 'cinematic', 'minimal'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const theme = getTheme(currentTheme);
  const classes = generateThemeClasses(currentTheme);

  const value = {
    currentTheme,
    setTheme,
    theme,
    classes,
    toggleTheme,
    availableThemes: ['original', 'modern', 'cinematic', 'minimal'] as ThemeVariant[]
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme selector component
export const ThemeSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentTheme, setTheme, availableThemes, theme } = useTheme();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-white/70">Theme:</span>
      <select
        value={currentTheme}
        onChange={(e) => setTheme(e.target.value as ThemeVariant)}
        className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white backdrop-blur-sm focus:outline-none focus:border-white/40"
      >
        {availableThemes.map((themeVariant) => {
          const themeConfig = getTheme(themeVariant);
          return (
            <option key={themeVariant} value={themeVariant} className="bg-slate-800 text-white">
              {themeConfig.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

// Theme preview component
export const ThemePreview: React.FC<{ variant: ThemeVariant; onClick?: () => void }> = ({ 
  variant, 
  onClick 
}) => {
  const theme = getTheme(variant);
  const classes = generateThemeClasses(variant);

  return (
    <div 
      className={`w-24 h-16 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${classes.pageBackground} ${classes.shadow}`}
      onClick={onClick}
      title={theme.description}
    >
      <div className="w-full h-full rounded-lg p-2 flex flex-col justify-between">
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradients.accent}`} />
        <div className="space-y-1">
          <div className={`w-full h-1 rounded bg-gradient-to-r ${theme.gradients.button} opacity-60`} />
          <div className={`w-3/4 h-1 rounded bg-gradient-to-r ${theme.gradients.card} opacity-40`} />
        </div>
      </div>
    </div>
  );
};