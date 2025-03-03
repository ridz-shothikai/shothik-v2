import { Box } from "@mui/material";
import { HEADER, NAV } from "../../config/config/nav";
import { useSettingsContext } from "../../hooks/SettingsContext";
import useResponsive from "../../hooks/useResponsive";
// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main({ children, sx, ...other }) {
  const { themeLayout } = useSettingsContext();
  const isNavMini = themeLayout === "mini";
  const isDesktop = useResponsive("up", "sm");

  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,
        pt: `${HEADER.H_MOBILE + SPACING}px`,
        ...(isDesktop && {
          px: 2,
          pt: `${HEADER.H_DASHBOARD_DESKTOP + SPACING}px`,
          width: `calc(100% - ${NAV.W_DASHBOARD}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_DASHBOARD_MINI}px)`,
            ml: { sm: "95px" },
          }),
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
