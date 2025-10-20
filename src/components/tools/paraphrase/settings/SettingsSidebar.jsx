// SettingsSidebar.jsx
import {
  Close,
  ChatBubbleOutline as FeedbackIcon,
  Keyboard as KeyboardIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";

import GPTsettingsTab from "../../humanize/GPTsettingsTab";
import FeedbackTab from "./FeedbackTab";
import SettingsTab from "./SettingsTab";
import ShortcutsTab from "./ShortcutsTab";

const tabs = [
  { id: "settings", icon: <SettingsIcon /> },
  { id: "feedback", icon: <FeedbackIcon /> },
  { id: "shortcuts", icon: <KeyboardIcon /> },
];

const SettingsSidebar = ({
  open,
  onClose,
  tab = "settings",
  setTab,
  mobile = false,
  fromComp = "paraphrase", // This flag is to maintain different sesstings on same component. ENUM: [paraphrase, humanize, ai-detector, grammar-fix, translator]
}) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "auto", sm: "calc(100vh - 90px)" },
        borderLeft: mobile ? "none" : "1px solid",
        borderColor: mobile ? "transparent" : "divider",
        bgcolor: "background.paper",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* Top Nav */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          pt: 2,
          pb: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexGrow: 1,
          }}
        >
          {tabs.map((t) => (
            <Box
              key={t.id}
              onClick={() => setTab(t.id)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                flex: 1,
              }}
            >
              <IconButton
                size="large"
                disableRipple
                sx={{
                  color: tab === t.id ? "success.main" : "text.secondary",
                }}
              >
                {React.cloneElement(t.icon, { fontSize: "inherit" })}
              </IconButton>
              {tab === t.id && (
                <Box
                  sx={{
                    width: 24,
                    borderBottom: 2,
                    borderColor: "success.main",
                    mt: 0.5,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>

        {/* Close Button */}
        <IconButton
          id="settings_sidebar_x_button"
          size="small"
          onClick={onClose}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Tab Content */}
      <Box sx={{ px: 2 }}>
        {tab === "settings" && fromComp === "paraphrase" ? (
          <SettingsTab />
        ) : tab === "settings" && fromComp === "humanize" ? (
          <GPTsettingsTab />
        ) : null // default
        }
        {tab === "feedback" && <FeedbackTab />}
        {tab === "shortcuts" && <ShortcutsTab fromComp={fromComp} />}
      </Box>
    </Box>
  );
};

export default SettingsSidebar;
