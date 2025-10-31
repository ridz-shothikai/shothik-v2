import { CssBaseline } from "@mui/material";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import customShadows from "./customShadows";
import GlobalStyles from "./globalStyles";
import componentsOverride from "./overrides";
import palette from "./palette";
import shadows from "./shadows";
import typography from "./typography";

// ----------------------------------------------------------------------

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.settings);
  const themeOptions = useMemo(
    () => ({
      palette: palette(theme),
      typography,
      shape: { borderRadius: 8 },
      shadows: shadows(theme),
      customShadows: customShadows(theme),
    }),
    [theme],
  );

  const muitheme = createTheme(themeOptions);

  muitheme.components = componentsOverride(muitheme);

  return (
    <MUIThemeProvider theme={muitheme}>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </StyledEngineProvider>
    </MUIThemeProvider>
  );
}
