'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider, useThemeMode } from "./../../contexts/ThemeContext";
import { minimalsLightTheme, minimalsDarkTheme } from './../../lib/theme';

function ThemeContent({ children }: { children: React.ReactNode }) {
  const { mode, mounted } = useThemeMode();
  const theme = mode === 'dark' ? minimalsDarkTheme : minimalsLightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {/* Always render children but with opacity transition for smooth mounting */}
      <div style={{ 
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.1s ease-in'
      }}>
        {children}
      </div>
    </MuiThemeProvider>
  );
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider>
        <ThemeContent>{children}</ThemeContent>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
