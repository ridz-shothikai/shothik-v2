"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check localStorage for saved preference only on client
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("themeMode");
      if (saved === "light" || saved === "dark") {
        setMode(saved);
      } else {
        // No saved preference: decide default by user's local time (timezone-aware)
        // If local hour is between 19:00 and 06:00 => dark mode, otherwise light.
        try {
          // Use the browser timezone to compute the current hour in that zone.
          const tz =
            Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
          let now = new Date();
          // If a timezone is available, create a string for that timezone and parse hour
          if (tz) {
            // create a locale string for the timezone and extract hour
            const parts = new Intl.DateTimeFormat("en-US", {
              hour: "numeric",
              hour12: false,
              timeZone: tz,
            }).formatToParts(now);
            const hourPart = parts.find((p) => p.type === "hour")?.value;
            const hour = hourPart ? parseInt(hourPart, 10) : now.getHours();
            if (hour >= 19 || hour < 6) setMode("dark");
            else setMode("light");
          } else {
            const hour = now.getHours();
            if (hour >= 19 || hour < 6) setMode("dark");
            else setMode("light");
          }
        } catch (e) {
          // Fallback: use local hour
          const hour = new Date().getHours();
          if (hour >= 19 || hour < 6) setMode("dark");
          else setMode("light");
        }
      }
    }
    // Set mounted after we've determined the correct theme
    setMounted(true);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever mode changes, only on client
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem("themeMode", mode);
    }
  }, [mode, mounted]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return context;
}
