"use client";

import React from "react";
import { Box, Typography, Chip, Container, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import { useComponentTracking } from "../../../hooks/useComponentTracking";
import { trackingList } from "../../../libs/trackingList";

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#0F766E", // Teal-700
  color: "white",
  fontWeight: 500,
  fontSize: "0.875rem",
  height: "36px",
  borderRadius: "18px",
  padding: theme.spacing(0, 1),
  "& .MuiChip-icon": {
    color: "white",
    fontSize: "16px",
    marginLeft: "4px",
  },
  "& .MuiChip-label": {
    paddingLeft: "8px",
    paddingRight: "12px",
  },
}));

const AgenticHeroSection = () => {
  const { componentRef } = useComponentTracking(
    trackingList.STOP_WORKING_SECTION
  );

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  return (
    <Container maxWidth="xl">
      <Box
        ref={componentRef}
        sx={{
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: { xs: "flex-start", sm: "center" },
          textAlign: { xs: "left", sm: "center" },
          pt: { xs: 6, sm: 8, md: 10, lg: 12 },
          pb: { xs: 6, md: 8 },
          px: { xs: 0, sm: 0, md: 2, lg: 4 },
        }}
      >
        {/* Welcome Badge */}
        <Box sx={{ mb: { xs: 2, sm: 2, lg: 2.5, xl: 3.5 } }}>
          <StyledChip
            icon={<StarIcon />}
            label="Welcome to the Agentic Era"
            variant="filled"
          />
        </Box>

        {/* Main Heading */}
        <Box sx={{ maxWidth: "900px", mb: { xs: 2, sm: 2, lg: 2.5, xl: 3.5 } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "2.25rem",
                sm: "3.25rem",
                // md: "3.25rem",
                lg: "4rem",
                xl: "4.5rem",
              },
              fontWeight: 700,
              lineHeight: 1.1,
              color: isDarkMode ? "" : "#374151", // Gray-700
              mb: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Stop{" "}
            <Box
              component="span"
              sx={{
                color: "#059669", // Emerald-600
              }}
            >
              Working
            </Box>
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "2.25rem",
                sm: "3.25rem",
                // md: "3.25rem",
                lg: "4rem",
                xl: "4.5rem",
              },
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#059669", // Emerald-600
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            Start Commanding
          </Typography>
        </Box>

        {/* Description Text */}
        <Box sx={{ maxWidth: "800px" }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.1rem",
                lg: "1.25rem",
                xl: "1.375rem",
              },
              lineHeight: 1.6,
              color: "#6B7280", // Gray-500
              fontWeight: 400,
              textAlign: { xs: "left", sm: "center" },
              maxWidth: { xs: "500px", sm: "100%" },
            }}
          >
            Tell our agents what you need. They'll research 100+ papers, apply
            to dozens of programs, make professional calls, and hire experts for
            you. Stop spending weeks on tasks that should take minutes.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default AgenticHeroSection;
