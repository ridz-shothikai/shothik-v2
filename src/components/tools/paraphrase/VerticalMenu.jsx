"use client"
// components/VerticalMenu.jsx
import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { CheckCircleOutline, History, Settings, Keyboard } from "@mui/icons-material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PlagiarismSidebar from './plagiarism/Sidebar'; // adjust import path as needed

const ICON_SIZE = "2rem";

const VerticalMenu = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Box
        sx={{
          // position: "absolute",
          maxHeight: "90vh",
          width: 'fit-content',
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
        }}
      >{showSidebar ? 
      <PlagiarismSidebar open={showSidebar} onClose={() => setShowSidebar(false)} /> :<>
        {/* Top spacer */}
        {/* <Box sx={{ flexGrow: 1 }} /> */}

        {/* Center icons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
          {/* Check Plagiarism */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Tooltip title="Check Plagiarism">
              <IconButton size="large" onClick={() => setShowSidebar(true)}>
                <CheckCircleOutline sx={{ fontSize: ICON_SIZE }} />
              </IconButton>
            </Tooltip>
            <Typography variant="caption" align="center" component="div">
              Check<br />Plagiarism
            </Typography>
          </Box>

          {/* History */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Tooltip title="History">
              <IconButton size="large">
                <History sx={{ fontSize: ICON_SIZE }} />
              </IconButton>
            </Tooltip>
            <Typography variant="caption">History</Typography>
          </Box>
        </Box>

        {/* Bottom spacer */}
        {/* <Box sx={{ flexGrow: 1 }} /> */}

        {/* Bottom icons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
          {/* Settings */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Tooltip title="Settings">
              <IconButton size="large">
                <Settings sx={{ fontSize: ICON_SIZE }} />
              </IconButton>
            </Tooltip>
            <Typography variant="caption">Settings</Typography>
          </Box>

          {/* Feedback */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Tooltip title="Feedback">
              <IconButton size="large">
                <FeedbackIcon sx={{ fontSize: ICON_SIZE }} />
              </IconButton>
            </Tooltip>
            <Typography variant="caption">Feedback</Typography>
          </Box>

          {/* Hotkeys */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Tooltip title="Hotkeys">
              <IconButton size="large">
                <Keyboard sx={{ fontSize: ICON_SIZE }} />
              </IconButton>
            </Tooltip>
            <Typography variant="caption">Hotkeys</Typography>
          </Box>
        </Box>
        </>}
      </Box>

      {/* Sidebar toggled internally */}
    </>
  );
};

export default VerticalMenu;

