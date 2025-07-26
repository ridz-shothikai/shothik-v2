
"use client";

import {
  ExpandMoreOutlined,
  KeyboardArrowUpOutlined,
} from "@mui/icons-material";
import { Button, Stack, Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import useResponsive from "../../../hooks/useResponsive";
import LanguageMenus from "../common/LanguageMenus";

const initLanguage = [
  "English (US)",
  "English (UK)",
  "English (CA)",
  "English (AU)",
  "Bangla",
];

const LanguageMenu = ({ setLanguage, isLoading, language }) => {
  const [languageTabs, setLanguageTabs] = useState(initLanguage);
  const [showMenu, setShowMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useResponsive("down", "sm");
  const maxTabs = isMobile ? 3 : 5;

  const handleLanguage = (e) => {
    setAnchorEl(e.currentTarget);
    setShowMenu(true);
  };

  const handleLanguageMenu = (value) => {
    setLanguageTabs((prev) => {
      const filtered = prev.filter((l) => l !== value);
      return [value, ...filtered].slice(0, maxTabs);
    });
    setLanguage(value);
    setShowMenu(false);
  };

  // Always ensure the selected language appears in the tabs
  const displayTabs = languageTabs.includes(language)
    ? languageTabs
    : [language, ...languageTabs].slice(0, maxTabs);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={{ xs: 2, sm: 4 }}
      sx={{ px: 2, width: "100%" }}
    >
      {/* Only the tabs scroll horizontally */}
      <Box sx={{ overflowX: "auto", whiteSpace: "nowrap", maxWidth: "100%" }}>
        <Tabs
          value={language}
          onChange={(_, v) => setLanguage(v)}
          variant="standard"
          textColor="primary"
          sx={{
            minHeight: 48,
            "& .MuiTabs-flexContainer": { flexWrap: "nowrap" },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          {displayTabs.map((tab) => (
            <Tab
              key={tab}
              value={tab}
              label={tab}
              disabled={isLoading}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "common.white",
                  borderRadius: "8px 8px 0 0",
                  borderBottom: "2px solid",
                  borderColor: "grey.300",
                  marginBottom: "-2px",
                  px: 2, // horizontal padding for selected tab
                },
                "&.MuiTab-root": { display: "inline-flex" },
                "&.MuiTab-root:hover": { color: "text.primary" },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* “All” button pinned immediately after the last tab */}
      <Box sx={{ flexShrink: 0, ml: 2 }}>
        <Button
          disabled={isLoading}
          onClick={handleLanguage}
          size="small"
          variant="text"
          sx={{ color: "text.secondary" }}
          endIcon={
            showMenu ? <KeyboardArrowUpOutlined /> : <ExpandMoreOutlined />
          }
        >
          All
        </Button>

        <LanguageMenus
          selectedLanguage={language}
          anchorEl={anchorEl}
          open={showMenu}
          handleClose={() => setShowMenu(false)}
          handleLanguageMenu={handleLanguageMenu}
        />
      </Box>
    </Stack>
  );
};

export default LanguageMenu;

