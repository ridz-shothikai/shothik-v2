'use client';

import { ThemeProvider } from "../../contexts/ThemeContext";
import { ThemeMode } from "../../lib/theme-utils";

/**
 * ClientThemeProvider - Client component for Tailwind dark mode
 * 
 * This component integrates:
 * - Custom ThemeProvider for time-based theme switching
 * - Proper SSR/CSR synchronization with server-provided initial theme
 * - Tailwind CSS dark mode via class strategy
 * 
 * Best Practice: Accept server-computed initial values to prevent hydration mismatch
 */
export default function ClientThemeProvider({ 
  children,
  initialMode
}: { 
  children: React.ReactNode;
  initialMode: ThemeMode;
}) {
  return (
    <ThemeProvider initialMode={initialMode}>
      {children}
    </ThemeProvider>
  );
}
