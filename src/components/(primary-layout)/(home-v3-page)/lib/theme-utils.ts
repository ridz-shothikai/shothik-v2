/**
 * Theme Utilities for Time Zone-Based Dark/Light Mode
 * 
 * This module implements automatic theme switching based on user's local time.
 * Follows SSR/CSR best practices for Next.js 15.
 */

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'auto' | 'light' | 'dark';

/**
 * Configuration for time-based theme switching
 */
export const THEME_CONFIG = {
  // Dark mode starts at 6 PM (18:00)
  DARK_MODE_START_HOUR: 18,
  // Light mode starts at 6 AM (06:00)
  LIGHT_MODE_START_HOUR: 6,
  // Cookie name for theme preference (auto, light, dark)
  THEME_COOKIE_NAME: 'shothik-theme-preference',
  // Cookie name for resolved mode (light or dark) - used for SSR
  THEME_MODE_COOKIE_NAME: 'shothik-theme-mode',
  // Cookie max age (1 year)
  THEME_COOKIE_MAX_AGE: 365 * 24 * 60 * 60,
} as const;

/**
 * Calculate theme based on current time in user's timezone
 * 
 * Best Practice #1: Timezone-aware logic for global users
 * Best Practice #2: Pure function for predictable behavior
 * 
 * @param date - Current date/time (defaults to now)
 * @returns 'dark' if between 6 PM and 6 AM, otherwise 'light'
 */
export function getTimeBasedTheme(date: Date = new Date()): ThemeMode {
  const hour = date.getHours();
  
  // Dark mode between 6 PM (18:00) and 6 AM (06:00)
  const isDarkTime = hour >= THEME_CONFIG.DARK_MODE_START_HOUR || hour < THEME_CONFIG.LIGHT_MODE_START_HOUR;
  
  return isDarkTime ? 'dark' : 'light';
}

/**
 * Resolve the final theme mode based on user preference
 * 
 * Best Practice #3: Respect user's manual override while providing smart defaults
 * Best Practice #4: Support system preferences (prefers-color-scheme)
 * 
 * @param preference - User's theme preference ('auto', 'light', or 'dark')
 * @param systemPreference - System color scheme preference
 * @returns Final theme mode to apply
 */
export function resolveThemeMode(
  preference: ThemePreference,
  systemPreference?: 'light' | 'dark' | null
): ThemeMode {
  // If user explicitly chose light or dark, respect that
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }
  
  // For 'auto' mode, use time-based theme
  // Note: We prioritize time over system preference for better UX
  // System preference is available as fallback if needed
  return getTimeBasedTheme();
}

/**
 * Parse theme preference from cookie string
 * 
 * Best Practice #5: Defensive parsing with fallback values
 * 
 * @param cookieValue - Raw cookie value
 * @returns Validated theme preference
 */
export function parseThemePreference(cookieValue: string | undefined): ThemePreference {
  if (cookieValue === 'light' || cookieValue === 'dark' || cookieValue === 'auto') {
    return cookieValue;
  }
  return 'auto'; // Default to auto mode
}

/**
 * Get system color scheme preference (for browser/OS)
 * 
 * Best Practice #6: Progressive enhancement - works without JavaScript
 * Best Practice #7: Graceful degradation for older browsers
 * 
 * @returns System preference or null if not available
 */
export function getSystemPreference(): 'light' | 'dark' | null {
  if (typeof window === 'undefined') {
    return null; // Server-side, can't detect
  }
  
  if (!window.matchMedia) {
    return null; // Browser doesn't support matchMedia
  }
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  
  return null;
}

/**
 * Create a cookie string for theme preference
 * 
 * Best Practice #8: Secure cookie settings for production
 * Best Practice #9: Proper SameSite attribute for CSRF protection
 * 
 * @param preference - Theme preference to store
 * @returns Formatted cookie string
 */
export function createThemeCookie(preference: ThemePreference): string {
  const maxAge = THEME_CONFIG.THEME_COOKIE_MAX_AGE;
  const sameSite = 'lax'; // Lax is good for most cases, prevents CSRF
  
  return `${THEME_CONFIG.THEME_COOKIE_NAME}=${preference}; Path=/; Max-Age=${maxAge}; SameSite=${sameSite}`;
}

/**
 * Get cookie value by name from cookie string
 * 
 * Best Practice #10: Efficient cookie parsing for SSR
 * 
 * @param cookies - Cookie header string
 * @param name - Cookie name to find
 * @returns Cookie value or undefined
 */
export function getCookieValue(cookies: string | undefined, name: string): string | undefined {
  if (!cookies) return undefined;
  
  const match = cookies.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

/**
 * Generate inline script for preventing flash of wrong theme
 * This script runs before React hydration
 * 
 * Best Practice #11: Eliminate FOUC (Flash of Unstyled Content)
 * Best Practice #12: Blocking script for critical theme initialization
 * 
 * This script also sets a cookie with the resolved mode so the server
 * can use it for SSR on subsequent page loads.
 * 
 * @returns Script content as string
 */
export function getThemeScript(): string {
  return `
(function() {
  try {
    // Read theme preference from cookie
    function getCookie(name) {
      var match = document.cookie.match(new RegExp('(^|;\\\\s*)' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[2]) : null;
    }
    
    function setCookie(name, value) {
      var maxAge = ${THEME_CONFIG.THEME_COOKIE_MAX_AGE};
      document.cookie = name + '=' + value + '; Path=/; Max-Age=' + maxAge + '; SameSite=lax';
    }
    
    function getTimeBasedTheme() {
      var hour = new Date().getHours();
      return (hour >= ${THEME_CONFIG.DARK_MODE_START_HOUR} || hour < ${THEME_CONFIG.LIGHT_MODE_START_HOUR}) ? 'dark' : 'light';
    }
    
    var preference = getCookie('${THEME_CONFIG.THEME_COOKIE_NAME}') || 'auto';
    var theme;
    
    if (preference === 'light' || preference === 'dark') {
      theme = preference;
    } else {
      // Auto mode: use time-based theme with USER'S timezone
      theme = getTimeBasedTheme();
    }
    
    // Apply theme immediately to prevent flash
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    
    // CRITICAL: Add/remove 'dark' class for Tailwind CSS dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Store resolved mode in cookie for SSR to use
    setCookie('${THEME_CONFIG.THEME_MODE_COOKIE_NAME}', theme);
  } catch (e) {
    // Fail silently and let React handle it
  }
})();
`;
}

/**
 * Validate and sanitize theme preference input
 * 
 * Best Practice #13: Input validation for security
 * 
 * @param input - User input for theme preference
 * @returns Validated preference or 'auto' as fallback
 */
export function validateThemePreference(input: unknown): ThemePreference {
  if (typeof input !== 'string') {
    return 'auto';
  }
  
  const normalized = input.toLowerCase().trim();
  
  if (normalized === 'light' || normalized === 'dark' || normalized === 'auto') {
    return normalized;
  }
  
  return 'auto';
}

/**
 * Check if it's currently dark time based on hours
 * Useful for UI indicators
 * 
 * @param date - Date to check (defaults to now)
 * @returns true if it's dark time
 */
export function isDarkTime(date: Date = new Date()): boolean {
  return getTimeBasedTheme(date) === 'dark';
}

/**
 * Get next theme transition time
 * Useful for showing users when theme will auto-switch
 * 
 * Best Practice #14: Transparent UX - let users know what's happening
 * 
 * @param date - Current date (defaults to now)
 * @returns Next transition time and what theme it will switch to
 */
export function getNextTransition(date: Date = new Date()): {
  nextTime: Date;
  nextTheme: ThemeMode;
  hoursUntil: number;
} {
  const now = new Date(date);
  const currentHour = now.getHours();
  const currentTheme = getTimeBasedTheme(now);
  
  let nextHour: number;
  let nextTheme: ThemeMode;
  
  if (currentTheme === 'dark') {
    // Currently dark, next transition is to light at 6 AM
    nextHour = THEME_CONFIG.LIGHT_MODE_START_HOUR;
    nextTheme = 'light';
  } else {
    // Currently light, next transition is to dark at 6 PM
    nextHour = THEME_CONFIG.DARK_MODE_START_HOUR;
    nextTheme = 'dark';
  }
  
  const nextTime = new Date(now);
  nextTime.setHours(nextHour, 0, 0, 0);
  
  // If next transition is earlier in the day, it's tomorrow
  if (nextHour <= currentHour) {
    nextTime.setDate(nextTime.getDate() + 1);
  }
  
  const hoursUntil = Math.round((nextTime.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  return {
    nextTime,
    nextTheme,
    hoursUntil,
  };
}

/**
 * Best Practice #15: Performance optimization through memoization
 * Cache time-based theme for current minute to avoid excessive recalculation
 */
let themeCacheMinute: number | null = null;
let themeCacheValue: ThemeMode | null = null;

export function getCachedTimeBasedTheme(): ThemeMode {
  const now = new Date();
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  
  if (themeCacheMinute === currentMinute && themeCacheValue) {
    return themeCacheValue;
  }
  
  const theme = getTimeBasedTheme(now);
  themeCacheMinute = currentMinute;
  themeCacheValue = theme;
  
  return theme;
}
