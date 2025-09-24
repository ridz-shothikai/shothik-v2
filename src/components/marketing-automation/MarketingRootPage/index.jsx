"use client";

import { Box, Container, Typography, useTheme } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import useResponsive from "../../../hooks/useResponsive";

const PRIMARY_GREEN = "#07B37A";

const MarketingRootPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useResponsive("down", "sm");
  const user = useSelector((state) => state.auth.user);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        bgcolor: isDarkMode ? "#161C24" : "white",
        color: isDarkMode ? "#eee" : "#333",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: `linear-gradient(45deg, ${PRIMARY_GREEN}, #00ff88)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Marketing Automation
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: PRIMARY_GREEN,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                  "100%": { opacity: 1 },
                },
              }}
            />
            <Typography variant="body2" sx={{ color: "#666" }}>
              4-Agent AI system ready to create presentations
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            maxWidth: 800,
            mx: "auto",
            bgcolor: isDarkMode ? "#161C24" : "#f8f9fa",
            borderRadius: 4,
            p: 3,
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typegraphy variant="h4" gutterBottom></Typegraphy>
        </Box>
      </Container>
    </Box>
  );
};

export default MarketingRootPage;
