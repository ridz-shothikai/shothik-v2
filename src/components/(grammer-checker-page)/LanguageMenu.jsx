// LanguageMenu.jsx
"use client";
import useResponsive from "@/hooks/useResponsive";
import {
  ExpandMoreOutlined,
  KeyboardArrowUpOutlined,
} from "@mui/icons-material";
import { Box, useTheme } from "@mui/material";
import { useState } from "react";
import LanguageMenus from "../tools/common/LanguageMenus";

const initLanguage = [
  "English (US)",
  "English (UK)",
  "English (CA)",
  "English (AU)",
  "Bangla",
];

const LanguageMenu = ({ language, setLanguage, isLoading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useResponsive("down", "sm");
  const showMenu = Boolean(anchorEl);
  const theme = useTheme();

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (value) => {
    setLanguage(value);
    handleClose();
  };

  if (isMobile) {
    // mobile: single button
    return (
      <>
        <button
          className="flex items-center gap-2 px-4 py-2"
          onClick={handleOpen}
          disabled={isLoading}
        >
          <span>{language}</span> <ExpandMoreOutlined />
        </button>
        <LanguageMenus
          selectedLanguage={language}
          anchorEl={anchorEl}
          open={showMenu}
          handleClose={handleClose}
          handleLanguageMenu={handleSelect}
        />
      </>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <button
        className="flex items-center gap-2 px-4 py-2"
        onClick={handleOpen}
        disabled={isLoading}
      >
        <span>{language}</span>{" "}
        {showMenu ? <KeyboardArrowUpOutlined /> : <ExpandMoreOutlined />}
      </button>
      <LanguageMenus
        selectedLanguage={language}
        anchorEl={anchorEl}
        open={showMenu}
        handleClose={handleClose}
        handleLanguageMenu={handleSelect}
      />
    </Box>
  );
};

export default LanguageMenu;
