"use client";

import { ICON } from "@/config/config/nav";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  alpha,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ----------------------------------------------------------------------

export default function NavList({ data, layout, onCloseNav }) {
  const pathname = usePathname();
  const isActive = pathname === data.path;
  const { title, path, icon, iconColor } = data;

  return (
    <ListItemButton
      data-umami-event={`Nav: ${title}`}
      component={Link}
      href={path}
      id={data?.id}
      onClick={() => {
        if (onCloseNav) onCloseNav();
        else return;
      }}
      sx={(theme) => {
        const isLight = theme.palette.mode === "light";
        const activeStyle = {
          color: !isLight ? "primary.light" : "primary.main",
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        };

        return {
          position: "relative",
          textTransform: "capitalize",
          px: layout === "compact" ? 0.5 : 2,
          mb: 0.5,
          color: "text.secondary",
          width: layout === "compact" ? 72 : "100%",
          minWidth: layout === "compact" ? 72 : "100%",
          borderRadius: 1,
          display: "flex",
          flexDirection: layout === "compact" ? "column" : "row",
          // flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          ...(isActive && {
            ...activeStyle,
            "&:hover": activeStyle,
          }),
        };
      }}
    >
      {icon && (
        <ListItemIcon
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: ICON.NAV_ITEM,
            height: ICON.NAV_ITEM,
            color: iconColor,
            marginRight: layout === "compact" ? 0 : "16px",
          }}
        >
          {icon}
        </ListItemIcon>
      )}

      <ListItemText>
        <Typography
          sx={{
            fontSize: layout === "compact" ? 12 : 16,
            textAlign: layout === "compact" ? "center" : "start",
            flexGrow: 1,
            whiteSpace: layout === "compact" ? "wrap" : "nowrap",
          }}
          variant={isActive ? "subtitle2" : "body2"}
        >
          {title === "AI Detector" ? (
            <>
              AI
              <br
                style={{
                  display: `${layout === "compact" ? "block" : "none"}`,
                }}
              />{" "}
              Detector
            </>
          ) : (
            title
          )}
        </Typography>
      </ListItemText>
    </ListItemButton>
  );
}
