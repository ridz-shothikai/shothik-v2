import { cookies } from 'next/headers';
import { THEME_CONFIG, ThemeMode } from "../../lib/theme-utils";
import ClientThemeProvider from './ClientThemeProvider';

/**
 * ThemeRegistry - Server Component that reads theme from cookies
 * 
 * This component:
 * 1. Runs on the server (no 'use client' directive)
 * 2. Reads the RESOLVED theme mode from cookies (set by client-side script)
 * 3. Passes initial mode to client provider to prevent FOUC
 * 4. Falls back to 'light' for first-time visitors
 * 
 * Best Practice: For timezone-sensitive features (like time-based themes),
 * the client must resolve the mode and store it in a cookie for SSR to use.
 * This ensures SSR uses the user's timezone, not the server's timezone.
 */
export default async function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // Read the resolved theme mode from cookies (set by blocking script)
  const cookieStore = await cookies();
  const modeCookie = cookieStore.get(THEME_CONFIG.THEME_MODE_COOKIE_NAME);
  
  // Use cookie value if valid, otherwise default to light
  // The blocking script will correct this on first load
  let initialMode: ThemeMode = 'light';
  if (modeCookie?.value === 'dark' || modeCookie?.value === 'light') {
    initialMode = modeCookie.value;
  }
  
  return (
    <ClientThemeProvider initialMode={initialMode}>
      {children}
    </ClientThemeProvider>
  );
}
