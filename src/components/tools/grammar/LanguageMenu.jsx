import {
  ExpandMoreOutlined,
  KeyboardArrowUpOutlined,
} from "@mui/icons-material";
import { Button, Stack, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import LanguageMenus from "../common/LanguageMenus";

const initLanguage = ["English", "Bangla"];

const LanguageMenu = ({ setLanguage, isLoading, language }) => {
  const [languageTabs, setlanguageTabs] = useState(initLanguage);
  const [showMenu, setShowMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  function handleLanguage(e) {
    setAnchorEl(e.target);
    setShowMenu(true);
  }

  function handleLanguageMenu(value) {
    setlanguageTabs((prev) => {
      if (!prev.includes(value)) {
        const newTabs = [...prev, value];
        return newTabs.length > 7 ? newTabs.slice(1) : newTabs;
      }
      return prev;
    });
    setLanguage(value);
  }

  return (
    <Stack direction='row' alignItems='center' spacing={{ xs: 2, sm: 4 }}>
      <Tabs
        onChange={(_, value) => setLanguage(value)}
        textColor='primary'
        value={language}
        sx={{
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        {languageTabs.map((tab) => (
          <Tab
            key={tab}
            value={tab}
            label={tab}
            disabled={isLoading}
            sx={{
              "&.MuiTab-root:hover": {
                color: "text.primary",
              },
            }}
          />
        ))}
      </Tabs>

      <Button
        disabled={isLoading}
        onClick={handleLanguage}
        size='small'
        endIcon={
          showMenu ? <KeyboardArrowUpOutlined /> : <ExpandMoreOutlined />
        }
        variant='text'
        sx={{ color: "text.secondary" }}
      >
        All
      </Button>

      <LanguageMenus
        anchorEl={anchorEl}
        handleClose={() => setShowMenu(false)}
        handleLanguageMenu={handleLanguageMenu}
        open={showMenu}
      />
    </Stack>
  );
};

export default LanguageMenu;
