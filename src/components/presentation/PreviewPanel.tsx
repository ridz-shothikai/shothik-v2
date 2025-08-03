"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
} from "@mui/material";
import SlidePreview from "./SlidePreview";
import { Chart, registerables } from "chart.js";
import AppLink from "../common/AppLink";

// Register Chart.js components
Chart.register(...registerables);

const PRIMARY_GREEN = "#07B37A";

export default function PreviewPanel({
  currentAgentType,
  slidesData,
  slidesLoading,
  presentationId,
  currentPhase,
  completedPhases,
  presentationBlueprint,
  qualityMetrics,
  validationResult,
  isValidating,
  onApplyAutoFixes,
  onRegenerateWithFeedback,
  title,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [previewTab, setPreviewTab] = useState("preview");
  const [slideTabs, setSlideTabs] = useState({});

  const handleSlideTabChange = (slideIndex, newValue) => {
    setSlideTabs((prev) => ({
      ...prev,
      [slideIndex]: newValue,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: isDark ? "background.default" : "white",
        color: isDark ? "text.primary" : "inherit",
        height: "100%",
        maxHeight: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          minHeight: 0,
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": {
            background: isDark ? "#2b2b2b" : "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: isDark ? "#555" : "#c1c1c1",
            borderRadius: "4px",
            "&:hover": {
              background: isDark ? "#666" : "#a8a8a8",
            },
          },
          scrollbarWidth: "thin",
          scrollbarColor: isDark ? "#555 #2b2b2b" : "#c1c1c1 #f1f1f1",
        }}
      >
        {previewTab === "preview" && (
          <Box>
            {currentAgentType === "presentation" ? (
              <>
                {/* Sticky Header */}
                <Box
                  sx={{
                    position: "sticky",
                    top: 0,
                    bgcolor: isDark ? "background.paper" : "white",
                    zIndex: 10,
                    borderBottom: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
                    px: 3,
                    pt: 3,
                    pb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                      color: isDark ? "text.primary" : "#333",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      minWidth: 0,
                    }}
                  >
                    {slidesData?.status !== "failed"
                      ? title || slidesData?.title || "Generating..."
                      : "Presentation generation failed"}
                  </Typography>

                  {(slidesData?.status === "completed" ||
                    slidesData?.status === "saved") && (
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "0.8rem",
                          sm: "0.9rem",
                          md: "1rem",
                        },
                        color: isDark ? "text.secondary" : "#666",
                      }}
                    >
                      <AppLink
                        href={`/slides?project_id=${presentationId}`}
                        newTab
                        underline="hover"
                        color="primary"
                        fontSize="14px"
                        whiteSpace="nowrap"
                      >
                        View & Export
                      </AppLink>
                    </Typography>
                  )}
                </Box>

                {/* Scrollable Content */}
                <Box sx={{ p: 3, pt: 0 }}>
                  {slidesData?.data?.length === 0 &&
                  slidesData.status !== "failed" ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : slidesData?.data?.length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 2,
                        pt: 2,
                      }}
                    >
                      {slidesData?.data.map((slide, index) => (
                        <SlidePreview
                          key={slide.slide_index}
                          slide={slide}
                          index={index}
                          activeTab={slideTabs[index] || "preview"}
                          onTabChange={handleSlideTabChange}
                          totalSlides={
                            slidesData?.totalSlide || slidesData?.data?.length
                          }
                          theme={theme}
                          isDarkMode={isDark}
                        />
                      ))}

                      {slidesLoading && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            p: 4,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", mt: 8, p: 3 }}>
                      <Typography color={isDark ? "text.secondary" : "#666"}>
                        No slides generated
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: "center", mt: 8, p: 3 }}>
                <Typography color={isDark ? "text.secondary" : "#666"}>
                  Agent output will appear here
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
