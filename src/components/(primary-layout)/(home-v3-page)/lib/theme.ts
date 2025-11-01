/**
 * Legacy theme file - No longer used after migration to shadcn/ui + Tailwind CSS
 * 
 * Theme is now handled by:
 * - Tailwind config (tailwind.config.ts) for color tokens
 * - CSS variables in app/globals.css for theme colors
 * - ThemeContext in lib/contexts/ThemeContext.tsx for dark/light mode switching
 * 
 * This file is kept for reference but exports empty objects.
 * Can be safely deleted after confirming no imports remain.
 */

// Minimals Color Palette (reference only - now in Tailwind config)
export const palette = {
  primary: {
    lighter: '#C8FAD6',
    light: '#5BE49B',
    main: '#00A76F',
    dark: '#007867',
    darker: '#004B50',
  },
  secondary: {
    lighter: '#D6E9FF',
    light: '#84C0FF',
    main: '#1877F2',
    dark: '#0E4F9F',
    darker: '#073A75',
  },
};

// Empty exports for backward compatibility (no longer functional)
export const minimalsLightTheme = {};
export const minimalsDarkTheme = {};
export const minimalsTheme = {};
export const customShadows = {};
