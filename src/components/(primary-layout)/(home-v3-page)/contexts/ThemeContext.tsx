'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  ThemeMode,
  ThemePreference,
  THEME_CONFIG,
  resolveThemeMode,
  getSystemPreference,
  getCookieValue,
  parseThemePreference,
  getTimeBasedTheme,
  getNextTransition,
} from '../lib/theme-utils';

interface ThemeContextType {
  // Current theme mode being displayed (light or dark)
  mode: ThemeMode;
  // User's preference (auto, light, or dark)
  preference: ThemePreference;
  // Whether theme system is mounted and hydrated
  mounted: boolean;
  // Set theme preference (auto, light, or dark)
  setPreference: (pref: ThemePreference) => void;
  // Toggle between light and dark (cycles: light → dark → auto → light)
  toggleTheme: () => void;
  // Next auto transition info (only relevant in auto mode)
  nextTransition: ReturnType<typeof getNextTransition> | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode; // Server-provided initial theme
}

export function ThemeProvider({ children, initialMode = 'light' }: ThemeProviderProps) {
  // User's preference: 'auto', 'light', or 'dark'
  const [preference, setPreferenceState] = useState<ThemePreference>('auto');
  // Actual theme mode being applied: 'light' or 'dark'
  // Initialize with server-provided mode to prevent hydration mismatch
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  // Track if component is mounted (for SSR)
  const [mounted, setMounted] = useState(false);
  // Track system preference
  const [systemPref, setSystemPref] = useState<'light' | 'dark' | null>(null);
  // Next transition info for auto mode
  const [nextTransition, setNextTransition] = useState<ReturnType<typeof getNextTransition> | null>(null);

  /**
   * Initialize theme from cookie on mount
   * Best Practice: Read from cookie first, then localStorage as fallback
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get preference from cookie (set by middleware)
    const cookieValue = getCookieValue(document.cookie, THEME_CONFIG.THEME_COOKIE_NAME);
    const savedPreference = parseThemePreference(cookieValue);
    
    // Get system preference
    const sysPref = getSystemPreference();
    setSystemPref(sysPref);
    
    // Set initial preference
    setPreferenceState(savedPreference);
    
    // Resolve actual mode
    const resolvedMode = resolveThemeMode(savedPreference, sysPref);
    setMode(resolvedMode);
    
    // Apply initial dark class for Tailwind
    if (resolvedMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Calculate next transition if in auto mode
    if (savedPreference === 'auto') {
      setNextTransition(getNextTransition());
    }
    
    // Mark as mounted
    setMounted(true);
  }, []);

  /**
   * Update mode when preference changes
   * Best Practice: Separate preference from mode for flexibility
   */
  useEffect(() => {
    if (!mounted) return;
    
    const resolvedMode = resolveThemeMode(preference, systemPref);
    setMode(resolvedMode);
    
    // Update data-theme attribute AND dark class for Tailwind
    document.documentElement.setAttribute('data-theme', resolvedMode);
    document.documentElement.style.colorScheme = resolvedMode;
    
    // Tailwind dark mode: toggle .dark class on documentElement
    if (resolvedMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update next transition info
    if (preference === 'auto') {
      setNextTransition(getNextTransition());
    } else {
      setNextTransition(null);
    }
    
    // Save preference to cookie
    document.cookie = `${THEME_CONFIG.THEME_COOKIE_NAME}=${preference}; Path=/; Max-Age=${THEME_CONFIG.THEME_COOKIE_MAX_AGE}; SameSite=lax`;
    
    // Save resolved mode to cookie (for SSR on next page load)
    document.cookie = `${THEME_CONFIG.THEME_MODE_COOKIE_NAME}=${resolvedMode}; Path=/; Max-Age=${THEME_CONFIG.THEME_COOKIE_MAX_AGE}; SameSite=lax`;
  }, [preference, systemPref, mounted]);

  /**
   * Auto-update theme every minute when in auto mode
   * Best Practice: Use intervals for time-based logic
   */
  useEffect(() => {
    if (!mounted || preference !== 'auto') return;
    
    // Check every minute if theme should change
    const interval = setInterval(() => {
      const newMode = getTimeBasedTheme();
      if (newMode !== mode) {
        setMode(newMode);
        document.documentElement.setAttribute('data-theme', newMode);
        document.documentElement.style.colorScheme = newMode;
        
        // Tailwind dark mode: toggle .dark class
        if (newMode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Update mode cookie for SSR
        document.cookie = `${THEME_CONFIG.THEME_MODE_COOKIE_NAME}=${newMode}; Path=/; Max-Age=${THEME_CONFIG.THEME_COOKIE_MAX_AGE}; SameSite=lax`;
      }
      // Update next transition info
      setNextTransition(getNextTransition());
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [mounted, preference, mode]);

  /**
   * Listen to system preference changes
   * Best Practice: Respect OS-level theme changes
   */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    const handleChange = () => {
      const newSysPref = getSystemPreference();
      setSystemPref(newSysPref);
    };
    
    // Modern browsers support addEventListener
    if (darkModeQuery.addEventListener) {
      darkModeQuery.addEventListener('change', handleChange);
      lightModeQuery.addEventListener('change', handleChange);
      
      return () => {
        darkModeQuery.removeEventListener('change', handleChange);
        lightModeQuery.removeEventListener('change', handleChange);
      };
    }
    // Fallback for older browsers
    else if (darkModeQuery.addListener) {
      darkModeQuery.addListener(handleChange);
      lightModeQuery.addListener(handleChange);
      
      return () => {
        darkModeQuery.removeListener(handleChange);
        lightModeQuery.removeListener(handleChange);
      };
    }
  }, []);

  /**
   * Set theme preference
   * Best Practice: Single source of truth for theme state
   */
  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
  }, []);

  /**
   * Toggle theme (cycles through light → dark → auto)
   * Best Practice: Provide easy toggle for users
   */
  const toggleTheme = useCallback(() => {
    setPreferenceState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'auto';
      return 'light';
    });
  }, []);

  const value: ThemeContextType = {
    mode,
    preference,
    mounted,
    setPreference,
    toggleTheme,
    nextTransition,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
}
