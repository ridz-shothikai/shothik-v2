"use client";

import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CheckCircle,
  ViewInAr,
  AccountBalance,
  Public,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useComponentTracking } from "../../../hooks/useComponentTracking";
import { trackingList } from "../../../libs/trackingList";

const timelineData = [
  {
    year: "2022",
    title: "Company Founded",
    description: "Started with a vision to democratize AI in fintech",
    icon: CheckCircle,
    bgColor: "#f1f8e9",
    cardIcon: "/journey/j-1.svg",
  },
  {
    year: "2023",
    title: "First AI Agent Deployed",
    description: "Launched our flagship risk assessment AI agent",
    icon: ViewInAr,
    bgColor: "#ffffff",
    cardIcon: "/journey/j-2.svg",
  },
  {
    year: "2024",
    title: "500+ Institutions",
    description: "Reached milestone of serving 500+ financial institutions",
    icon: AccountBalance,
    bgColor: "#f1f8e9",
    cardIcon: "/journey/j-3.svg",
  },
  {
    year: "2025",
    title: "Global Expansion",
    description:
      "Expanding to serve financial institutions across 25+ countries",
    icon: Public,
    bgColor: "#ffffff",
    cardIcon: "/journey/j-4.svg",
  },
];

const JourneyTimeline = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { componentRef } = useComponentTracking(
    trackingList.JOURNEY_SECTION
  );

  return (
    <Box
      ref={componentRef}
      component="section"
      sx={{
        pt: { xs: 2, sm: 3, xl: 4 },
        pb: { xs: 7, sm: 9, xl: 12 },
        // backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              textAlign: "center",
              maxWidth: "600px",
              mx: "auto",
              mb: { xs: 5, md: 10 },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", lg: "3rem" },
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              Our Journey
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "0.95rem", md: "1rem", lg: "1.25rem" },
                color: theme.palette.text.secondary,
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              From startup to industry leader, see how we've grown to become the
              trusted AI platform for financial institutions worldwide.
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ position: "relative", maxWidth: "800px", mx: "auto" }}>
          {/* Timeline line - positioned absolutely */}
          <Box
            sx={{
              position: "absolute",
              left: "9px",
              top: "0px",
              bottom: "80px",
              width: "3px",
              backgroundColor: theme.palette.divider,
              borderRadius: "99999px",
              zIndex: 1,
              height: "100%",
            }}
          />

          {/* Timeline items */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 4, lg: 5, xl: 6 },
              position: "relative",
            }}
          >
            {timelineData?.map((data, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  position: "relative",
                }}
              >
                {/* Timeline dot */}
                <Box
                  sx={{
                    position: "relative",
                    top: {
                      xs: "20px",
                      sm: "24px",
                      md: "28px",
                      lg: "30px",
                      xl: "40px",
                    },
                    zIndex: 2,
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#10B981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `4px solid ${theme.palette.background.default}`,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    top: {
                      xs: "24px",
                      sm: "24px",
                      md: "28px",
                      lg: "30px",
                      xl: "40px",
                    },
                    zIndex: 2,
                    mt: 1,
                    ml: {
                      xs: "10px",
                      sm: "34px",
                      md: "40px",
                      lg: "60px",
                      xl: "70px",
                    },
                    mr: { xs: "0px", md: "10px" },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", lg: "14px", xl: "16px" },
                      color: theme.palette.text.secondary,
                      mb: 1,
                      lineHeight: 1.3,
                    }}
                  >
                    {data.year}
                  </Typography>
                </Box>
                {/* Content card */}
                <Box
                  sx={{
                    ml: 4,
                    flex: 1,
                    p: { xs: 2, md: 3, xl: 4 },
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: { xs: "12px", lg: "16px" },
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: "12px", lg: "16px", xl: "20px" },
                    alignItems: { xs: "center", sm: "flex-start" },
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      border: `1px solid ${theme.palette.action.hover}`,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {/* Icon container */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: { xs: "12px", lg: "16px", xl: "20px" },
                      backgroundColor: theme.palette.background.default,
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                      flexShrink: 0,
                      minWidth: { xs: "52px", lg: "60px", xl: "68px" },
                      minHeight: { xs: "52px", lg: "60px", xl: "68px" },
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: theme.palette.background.default,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
                      },
                    }}
                  >
                    <Image
                      src={data?.cardIcon}
                      alt={data?.title}
                      width={28}
                      height={28}
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "28px",
                        maxHeight: "28px",
                      }}
                    />
                  </Box>

                  {/* Text content */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "16px", lg: "18px", xl: "20px" },
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        mb: 1,
                        lineHeight: 1.3,
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      {data.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", lg: "16px" },
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6,
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      {data.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default JourneyTimeline;
