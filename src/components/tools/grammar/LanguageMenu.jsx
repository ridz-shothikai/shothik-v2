
// LanguageMenu.jsx
"use client";
import { ExpandMoreOutlined, KeyboardArrowUpOutlined } from "@mui/icons-material";
import { Button, Tabs, Tab, Box } from "@mui/material";
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

const LanguageMenu = ({ language, setLanguage, isLoading }) => {
  const [languageTabs, setLanguageTabs] = useState(initLanguage);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useResponsive("down", "sm");
  const maxTabs = isMobile ? 3 : 5;
  const showMenu = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (value) => {
    // promote selected to front, keep maxTabs
    setLanguageTabs((prev) => {
      const filtered = prev.filter((l) => l !== value);
      return [value, ...filtered].slice(0, maxTabs);
    });
    setLanguage(value);
    handleClose();
  };

  // desktop: what you had before
  const displayTabs = languageTabs.includes(language)
    ? languageTabs
    : [language, ...languageTabs].slice(0, maxTabs);

  if (isMobile) {
    // mobile: single button
    return (
      <>
        <Button
          onClick={handleOpen}
          disabled={isLoading}
          endIcon={<ExpandMoreOutlined />}
          sx={{ textTransform: "none", width: "100%", justifyContent: "space-between" }}
        >
          {language}
        </Button>
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
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", }}>
      <Tabs
        value={language}
        onChange={(_, v) => setLanguage(v)}
        variant="standard"
        textColor="primary"
        sx={{
          flex: 1,
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
                borderRadius: "12px 12px 0 0",
                border: "1px solid",
                borderColor: "divider",
                // marginBottom: "-2px",
                px: 2,
              },
              "&.MuiTab-root": { display: "inline-flex" },
              "&.MuiTab-root:hover": { color: "text.primary" },
            }}
          />
        ))}
      </Tabs>
      <Button id="language_x_button" onClick={()=>{
        handleClose();
      }} sx={{opacity:0, zIndex: -99, width:0, height: 0}}></Button>


      <Button
        onClick={handleOpen}
        disabled={isLoading}
        endIcon={showMenu ? <KeyboardArrowUpOutlined /> : <ExpandMoreOutlined />}
        sx={{ color: "text.secondary", ml: 1 }}
        id="language_all_button"
      >
        All
      </Button>
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

