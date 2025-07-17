
/**
 * Ultra-simplified theme system - 2 themes only
 * Zero animations, maximum performance, WCAG AAA compliance
 */

export type ThemeMode = 'light' | 'dark';

export const THEME_CONFIG = {
  light: {
    name: 'Light Simple',
    class: '',
    description: 'High contrast light theme - WCAG AAA compliant',
    backgroundColor: 'rgb(250, 250, 250)' // Soft White instead of pure white
  },
  dark: {
    name: 'Dark Simple', 
    class: 'dark',
    description: 'High contrast dark theme - WCAG AAA compliant',
    backgroundColor: 'rgb(15, 15, 15)'
  }
} as const;

export const setTheme = (mode: ThemeMode): void => {
  const root = document.documentElement;
  
  // Remove all theme classes
  root.classList.remove('dark');
  
  // Add new theme class if not light
  if (mode === 'dark') {
    root.classList.add('dark');
  }
  
  // Set CSS custom property for background color
  root.style.setProperty('--theme-background', THEME_CONFIG[mode].backgroundColor || 'rgb(250, 250, 250)');
  
  // Store preference
  localStorage.setItem('theme-preference', mode);
};

export const getTheme = (): ThemeMode => {
  const stored = localStorage.getItem('theme-preference') as ThemeMode;
  if (stored && stored in THEME_CONFIG) {
    return stored;
  }
  
  // Default to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const initializeTheme = (): void => {
  const theme = getTheme();
  setTheme(theme);
};

// Auto-initialize on import
if (typeof window !== 'undefined') {
  initializeTheme();
}
