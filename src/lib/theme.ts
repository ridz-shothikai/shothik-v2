import { createTheme } from '@mui/material/styles';

// Minimals Color Palette
const palette = {
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
  info: {
    lighter: '#CAFDF5',
    light: '#61F3F3',
    main: '#00B8D9',
    dark: '#006C9C',
    darker: '#003768',
  },
  success: {
    lighter: '#D3FCD2',
    light: '#77ED8B',
    main: '#22C55E',
    dark: '#118D57',
    darker: '#065E49',
  },
  warning: {
    lighter: '#FFF5CC',
    light: '#FFD666',
    main: '#FFAB00',
    dark: '#B76E00',
    darker: '#7A4100',
  },
  error: {
    lighter: '#FFE9D5',
    light: '#FFAC82',
    main: '#FF5630',
    dark: '#B71D18',
    darker: '#7A0916',
  },
  grey: {
    50: '#FCFDFD',
    100: '#F9FAFB',
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#1C252E',
    900: '#141A21',
  },
};

// Minimals Custom Shadows
const customShadows = {
  z1: '0 1px 2px 0 rgba(145, 158, 171, 0.16)',
  z4: '0 4px 8px 0 rgba(145, 158, 171, 0.16)',
  z8: '0 8px 16px 0 rgba(145, 158, 171, 0.16)',
  z12: '0 12px 24px -4px rgba(145, 158, 171, 0.16)',
  z16: '0 16px 32px -4px rgba(145, 158, 171, 0.16)',
  z20: '0 20px 40px -4px rgba(145, 158, 171, 0.16)',
  z24: '0 24px 48px 0 rgba(145, 158, 171, 0.16)',
  card: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
  dialog: '-40px 40px 80px -8px rgba(145, 158, 171, 0.24)',
  dropdown: '0 0 2px 0 rgba(145, 158, 171, 0.24), -20px 20px 40px -4px rgba(145, 158, 171, 0.24)',
  primary: '0 8px 16px 0 rgba(0, 167, 111, 0.24)',
  secondary: '0 8px 16px 0 rgba(24, 119, 242, 0.24)',
  info: '0 8px 16px 0 rgba(0, 184, 217, 0.24)',
  success: '0 8px 16px 0 rgba(34, 197, 94, 0.24)',
  warning: '0 8px 16px 0 rgba(255, 171, 0, 0.24)',
  error: '0 8px 16px 0 rgba(255, 86, 48, 0.24)',
};

// Minimals Typography
const typography = {
  fontFamily: '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  h1: {
    fontWeight: 800,
    fontSize: '2.5rem',
    lineHeight: 1.25,
    '@media (min-width:600px)': {
      fontSize: '3.25rem',
    },
    '@media (min-width:900px)': {
      fontSize: '3.625rem',
    },
    '@media (min-width:1200px)': {
      fontSize: '4rem',
    },
  },
  h2: {
    fontWeight: 800,
    fontSize: '2rem',
    lineHeight: 1.33,
    '@media (min-width:600px)': {
      fontSize: '2.5rem',
    },
    '@media (min-width:900px)': {
      fontSize: '2.75rem',
    },
    '@media (min-width:1200px)': {
      fontSize: '3rem',
    },
  },
  h3: {
    fontWeight: 700,
    fontSize: '1.5rem',
    lineHeight: 1.5,
    '@media (min-width:600px)': {
      fontSize: '1.625rem',
    },
    '@media (min-width:900px)': {
      fontSize: '1.875rem',
    },
    '@media (min-width:1200px)': {
      fontSize: '2rem',
    },
  },
  h4: {
    fontWeight: 700,
    fontSize: '1.25rem',
    lineHeight: 1.5,
    '@media (min-width:900px)': {
      fontSize: '1.5rem',
    },
  },
  h5: {
    fontWeight: 700,
    fontSize: '1.125rem',
    lineHeight: 1.5,
    '@media (min-width:600px)': {
      fontSize: '1.1875rem',
    },
  },
  h6: {
    fontWeight: 600,
    fontSize: '1.0625rem',
    lineHeight: 1.56,
    '@media (min-width:600px)': {
      fontSize: '1.125rem',
    },
  },
  subtitle1: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  subtitle2: {
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.57,
  },
  body1: {
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  body2: {
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.57,
  },
  caption: {
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.5,
  },
  overline: {
    fontWeight: 700,
    fontSize: '0.75rem',
    lineHeight: 1.5,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontWeight: 700,
    fontSize: '0.875rem',
    lineHeight: 1.71,
    textTransform: 'none' as const,
  },
};

// Create Light Theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: palette.primary,
    secondary: palette.secondary,
    info: palette.info,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    grey: palette.grey,
    text: {
      primary: palette.grey[800],
      secondary: palette.grey[600],
      disabled: palette.grey[500],
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    divider: palette.grey[300],
    action: {
      hover: palette.grey[200],
    },
  },
  typography,
  shadows: [
    'none',
    customShadows.z1,
    customShadows.z1,
    customShadows.z1,
    customShadows.z4,
    customShadows.z4,
    customShadows.z4,
    customShadows.z4,
    customShadows.z8,
    customShadows.z8,
    customShadows.z8,
    customShadows.z8,
    customShadows.z12,
    customShadows.z12,
    customShadows.z12,
    customShadows.z12,
    customShadows.z16,
    customShadows.z16,
    customShadows.z16,
    customShadows.z16,
    customShadows.z20,
    customShadows.z20,
    customShadows.z20,
    customShadows.z20,
    customShadows.z24,
  ] as any,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
        },
        sizeLarge: {
          height: 48,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: customShadows.card,
          borderRadius: 16,
        },
      },
    },
  },
});

// Dark Mode Custom Shadows
const darkCustomShadows = {
  z1: '0 1px 2px 0 rgba(0, 0, 0, 0.24)',
  z4: '0 4px 8px 0 rgba(0, 0, 0, 0.24)',
  z8: '0 8px 16px 0 rgba(0, 0, 0, 0.24)',
  z12: '0 12px 24px -4px rgba(0, 0, 0, 0.24)',
  z16: '0 16px 32px -4px rgba(0, 0, 0, 0.24)',
  z20: '0 20px 40px -4px rgba(0, 0, 0, 0.24)',
  z24: '0 24px 48px 0 rgba(0, 0, 0, 0.24)',
  card: '0 0 2px 0 rgba(0, 0, 0, 0.2), 0 12px 24px -4px rgba(0, 0, 0, 0.12)',
  dialog: '-40px 40px 80px -8px rgba(0, 0, 0, 0.24)',
  dropdown: '0 0 2px 0 rgba(0, 0, 0, 0.24), -20px 20px 40px -4px rgba(0, 0, 0, 0.24)',
  primary: '0 8px 16px 0 rgba(0, 167, 111, 0.24)',
  secondary: '0 8px 16px 0 rgba(24, 119, 242, 0.24)',
  info: '0 8px 16px 0 rgba(0, 184, 217, 0.24)',
  success: '0 8px 16px 0 rgba(34, 197, 94, 0.24)',
  warning: '0 8px 16px 0 rgba(255, 171, 0, 0.24)',
  error: '0 8px 16px 0 rgba(255, 86, 48, 0.24)',
};

// Create Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: palette.primary,
    secondary: palette.secondary,
    info: palette.info,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    grey: palette.grey,
    text: {
      primary: '#FFFFFF',
      secondary: palette.grey[500],
      disabled: palette.grey[600],
    },
    background: {
      default: '#141A21',
      paper: '#1C252E',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
    },
  },
  typography,
  shadows: [
    'none',
    darkCustomShadows.z1,
    darkCustomShadows.z1,
    darkCustomShadows.z1,
    darkCustomShadows.z4,
    darkCustomShadows.z4,
    darkCustomShadows.z4,
    darkCustomShadows.z4,
    darkCustomShadows.z8,
    darkCustomShadows.z8,
    darkCustomShadows.z8,
    darkCustomShadows.z8,
    darkCustomShadows.z12,
    darkCustomShadows.z12,
    darkCustomShadows.z12,
    darkCustomShadows.z12,
    darkCustomShadows.z16,
    darkCustomShadows.z16,
    darkCustomShadows.z16,
    darkCustomShadows.z16,
    darkCustomShadows.z20,
    darkCustomShadows.z20,
    darkCustomShadows.z20,
    darkCustomShadows.z20,
    darkCustomShadows.z24,
  ] as any,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
        },
        sizeLarge: {
          height: 48,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: darkCustomShadows.card,
          borderRadius: 16,
        },
      },
    },
  },
});

// Extend themes with custom shadows
export const minimalsLightTheme = {
  ...lightTheme,
  customShadows,
};

export const minimalsDarkTheme = {
  ...darkTheme,
  customShadows: darkCustomShadows,
};

// Export light theme as default for backward compatibility
export const minimalsTheme = minimalsLightTheme;

export { customShadows };
