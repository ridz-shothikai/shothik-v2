import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { NAV } from "../../../config/config/nav";
import useResponsive from "../../../hooks/useResponsive";
import { toggleThemeLayout } from "../../../redux/slice/settings";
import { bgBlur } from "../../../resource/cssStyles";
import { setIsNavVertical } from "../../../redux/slice/tools";

// ----------------------------------------------------------------------

export default function NavToggleButton({ sx, ...other }) {
  const theme = useTheme();
  const { themeLayout } = useSelector((state) => state.settings);
  const isDesktop = useResponsive("up", "sm");
  const dispatch = useDispatch();
  const isVerticalNav = useSelector((state) => state.tools.isNavVertical);

  if (!isDesktop) {
    return null;
  }

  return (
    <IconButton
      size="small"
      onClick={() => {
        dispatch(toggleThemeLayout());
        dispatch(setIsNavVertical(!isVerticalNav));
      }}
      sx={{
        p: 0.5,
        top: 50,
        position: "fixed",
        left: NAV.W_DASHBOARD - 12,
        zIndex: 1104,
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
        <ChevronLeft fontSize="small" />
      ) : (
        <ChevronRight fontSize="small" />
      )}
    </IconButton>
  );
}
