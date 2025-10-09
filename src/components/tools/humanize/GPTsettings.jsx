import { History, Keyboard, Settings } from "@mui/icons-material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Box, Drawer, IconButton, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import useResponsive from "../../../hooks/useResponsive";
import SettingsSidebar from "../paraphrase/settings/SettingsSidebar";
import GPTsettingSidebar from "./GPTsettingSidebar";

export default function GPTsettings({
  setHumanizeInput,
  allHumanizeHistory,
  refetchHistory,
}) {
  const mobile = useResponsive("down", "lg");
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Box
        sx={{
          maxHeight: { xs: "90vh", lg: "638px" },
          mt: 1,
          // make full-width on mobile
          width: mobile ? "100%" : "fit-content",
          // add a bit of padding so it doesn't touch the screen edge
          px: mobile ? 2 : 0,
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
        }}
      >
        {/* Center icons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            // left-align the full-width buttons on mobile
            alignItems: mobile ? "flex-start" : "center",
            width: mobile ? "100%" : "auto",
          }}
        >
          <Box id="gpt-history">
            <ActionButton
              id="gpt-history"
              title="History"
              icon={History}
              onClick={() => setShowSidebar("gpt-history")}
              disabled={false}
              crown={true}
              mobile={mobile}
            />
          </Box>
        </Box>

        {/* Settings icons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            mt: 2,
            // same here: stretch full width and left-align
            alignItems: mobile ? "flex-start" : "center",
            width: mobile ? "100%" : "auto",
          }}
        >
          {" "}
          <Box id="gpt_settings">
            <ActionButton
              title="Settings"
              id="gpt_settings_button"
              icon={Settings}
              onClick={() => setShowSidebar("settings")}
              disabled={false}
              mobile={mobile}
            />
          </Box>
          <Box id="gpt_feedback">
            <ActionButton
              id="gpt_feedback_button"
              title="Feedback"
              icon={FeedbackIcon}
              onClick={() => setShowSidebar("feedback")}
              disabled={false}
              mobile={mobile}
            />
          </Box>
          <Box id="gpt_shortcuts">
            <ActionButton
              id="gpt_shortcuts_button"
              title="Hotkeys"
              icon={Keyboard}
              onClick={() => setShowSidebar("shortcuts")}
              disabled={false}
              mobile={mobile}
            />
          </Box>
        </Box>
      </Box>

      <Drawer
        anchor="right"
        open={!!showSidebar}
        onClose={() => setShowSidebar(false)}
        variant="temporary"
        sx={{
          "& .MuiDrawer-paper": {
            width: mobile ? "100%" : "auto",
            maxWidth: mobile ? "100%" : "380px",
            minWidth: mobile ? "100%" : "400px",
          },
        }}
      >
        {["gpt-history"].includes(showSidebar) && (
          <GPTsettingSidebar
            open={showSidebar}
            onClose={() => setShowSidebar((prev) => !prev)}
            active={showSidebar}
            setActive={setShowSidebar}
            setHumanizeInput={setHumanizeInput}
            allHumanizeHistory={allHumanizeHistory}
            refetchHistory={refetchHistory}
          />
        )}

        {["settings", "feedback", "shortcuts"].includes(showSidebar) && (
          <SettingsSidebar
            open={showSidebar}
            onClose={() => setShowSidebar((prev) => !prev)}
            tab={showSidebar}
            setTab={setShowSidebar}
            mobile={mobile}
            fromComp="humanize"
          />
        )}
      </Drawer>
    </>
  );
}

// INNER USED COMPONENT
function ActionButton({
  id,
  title,
  icon: Icon,
  onClick,
  disabled,
  crown = false,
  mobile,
}) {
  const theme = useTheme();
  const words = title.split(" ");
  const containerStyles = mobile
    ? {
        flexDirection: "row",
        flexWrap: "nowrap",
        width: "100%", // full-width button
        alignItems: "center", // center vertically
        justifyContent: "flex-start", // left-align icon+text
        gap: theme.spacing(1),
        padding: theme.spacing(1),
      }
    : { flexDirection: "column", gap: 0 };

  return (
    <Box
      onClick={!disabled ? onClick : undefined}
      sx={{
        // full-width row on mobile, fixed circle otherwise
        width: mobile ? "100%" : "5rem",
        height: mobile ? "auto" : "5rem",
        borderRadius: mobile ? theme.shape.borderRadius : "50%",
        display: "flex",
        ...containerStyles,
        justifyContent: mobile ? "flex-start" : "center",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.2s",
        "&:hover": {
          bgcolor: disabled ? "transparent" : theme.palette.action.hover,
        },
        userSelect: "none",
      }}
    >
      {/* icon + optional crown */}
      <Box
        sx={{
          position: "relative",
          // on mobile, no bottom margin; on desktop, a tiny gap
          mb: mobile ? 0 : 0.5,
          // push text over on mobile only
          mr: mobile ? (theme) => theme.spacing(1) : 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton
          id={id}
          size="large"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onClick();
          }}
          disabled={disabled}
          sx={{
            p: 0,
            color: theme.palette.text.primary,
          }}
        >
          <Icon sx={{ fontSize: "1.5rem" }} />
        </IconButton>
        {crown && (
          <Box
            component="img"
            src="/premium_crown.svg"
            alt="premium crown"
            sx={{
              position: "absolute",
              // mobile: bottom‐right; desktop: top‐right
              ...(mobile
                ? { bottom: 0, right: 0, transform: "translate(50%, 50%)" }
                : { bottom: 10, right: 15, transform: "none" }),
              width: 16,
              height: 16,
              pointerEvents: "none",
            }}
          />
        )}
      </Box>

      {/* split title into separate lines */}
      <Typography
        variant="caption"
        align="center"
        sx={{
          fontSize: 12,
          color: theme.palette.text.primary,
          whiteSpace: mobile ? "nowrap" : "pre-line",
          lineHeight: 1.2,
        }}
      >
        {mobile
          ? title
          : words.map((w, i) => (
              <React.Fragment key={i}>
                {w}
                {i < words.length - 1 && "\n"}
              </React.Fragment>
            ))}
      </Typography>
    </Box>
  );
}
