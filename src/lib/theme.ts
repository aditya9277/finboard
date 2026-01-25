/**
 * FinBoard Theme Configuration
 * 
 * Modern color palette inspired by Groww's clean aesthetics
 * Default theme: Light
 * Dark theme: Navy/Slate instead of grey
 */

export const colors = {
  // Primary brand colors
  primary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main primary (emerald)
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  
  // Accent colors for CTAs
  accent: {
    teal: '#00d09c',    // Groww green
    emerald: '#10b981',
    blue: '#3b82f6',
  },
  
  // Light theme colors
  light: {
    bg: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      card: '#ffffff',
      hover: '#f1f5f9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#94a3b8',
      inverse: '#ffffff',
    },
    border: {
      default: '#e2e8f0',
      subtle: '#f1f5f9',
      focus: '#10b981',
    },
  },
  
  // Dark theme colors (Navy/Slate palette - NOT grey)
  dark: {
    bg: {
      primary: '#0f172a',    // Slate-900
      secondary: '#1e293b',  // Slate-800
      tertiary: '#334155',   // Slate-700
      card: '#1e293b',
      hover: '#334155',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      muted: '#64748b',
      inverse: '#0f172a',
    },
    border: {
      default: '#334155',
      subtle: '#1e293b',
      focus: '#10b981',
    },
  },
} as const;

// Semantic color mappings for components
export const semanticColors = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// CSS custom properties generator
export const getCSSVariables = (theme: 'light' | 'dark') => {
  const palette = theme === 'dark' ? colors.dark : colors.light;
  return {
    '--bg-primary': palette.bg.primary,
    '--bg-secondary': palette.bg.secondary,
    '--bg-tertiary': palette.bg.tertiary,
    '--bg-card': palette.bg.card,
    '--bg-hover': palette.bg.hover,
    '--text-primary': palette.text.primary,
    '--text-secondary': palette.text.secondary,
    '--text-muted': palette.text.muted,
    '--border-default': palette.border.default,
    '--border-subtle': palette.border.subtle,
    '--accent-primary': colors.accent.teal,
  };
};

// Theme class names helper
export const themeClasses = {
  light: {
    page: 'bg-slate-50',
    card: 'bg-white border-slate-200 shadow-sm',
    cardHover: 'hover:shadow-md hover:border-slate-300',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    border: 'border-slate-200',
    input: 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400',
    button: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  },
  dark: {
    page: 'bg-slate-900',
    card: 'bg-slate-800 border-slate-700',
    cardHover: 'hover:bg-slate-750 hover:border-slate-600',
    text: 'text-slate-50',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-500',
    border: 'border-slate-700',
    input: 'bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500',
    button: 'bg-slate-700 hover:bg-slate-600 text-slate-200',
  },
} as const;

export type ThemeMode = 'light' | 'dark';
