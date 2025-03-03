import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { NAV } from "../../../config/config/nav";
import { useSettingsContext } from "../../../hooks/SettingsContext";
import useResponsive from "../../../hooks/useResponsive";
import { bgBlur } from "../../../resource/cssStyles";

// ----------------------------------------------------------------------

export default function NavToggleButton({ sx, ...other }) {
  const theme = useTheme();
  const { themeLayout, onToggleLayout } = useSettingsContext();
  const isDesktop = useResponsive("up", "sm");

  if (!isDesktop) {
    return null;
  }

  return (
    <IconButton
      size='small'
      onClick={onToggleLayout}
      sx={{
        p: 0.5,
        top: 50,
        position: "fixed",
        left: NAV.W_DASHBOARD - 12,
        zIndex: theme.zIndex.appBar + 1,
        border: `dashed 1px ${theme.palette.divider}`,
        ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        "&:hover": {
          bgcolor: "background.default",
        },
        ...sx,
      }}
      {...other}
    >
      {themeLayout === "vertical" ? (
        <ChevronLeft fontSize='small' />
      ) : (
        <ChevronRight fontSize='small' />
      )}
    </IconButton>
  );
}
