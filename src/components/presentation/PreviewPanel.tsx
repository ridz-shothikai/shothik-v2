"use client";

// components/PreviewPanel.tsx
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
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
  const [previewTab, setPreviewTab] = useState("preview");
  const [slideTabs, setSlideTabs] = useState({});

  const handleSlideTabChange = (slideIndex, newValue) => {
    setSlideTabs((prev) => ({
      ...prev,
      [slideIndex]: newValue,
    }));
  };

  // console.log(slidesData, "slidesData in PreviewPanel");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
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
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "4px",
            "&:hover": { background: "#a8a8a8" },
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#c1c1c1 #f1f1f1",
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
                    bgcolor: "white",
                    zIndex: 10,
                    borderBottom: "1px solid #e0e0e0",
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
                      color: "#333",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      minWidth: 0,
                    }}
                  >
                    {title || slidesData?.title || "Generating..."}
                  </Typography>

                  {slidesData?.status === "completed" ||
                    slidesData?.status ===
                      "saved" && (
                        <Typography
                          color="#666"
                          sx={{
                            fontSize: {
                              xs: "0.8rem",
                              sm: "0.9rem",
                              md: "1rem",
                            },
                          }}
                        >
                          <AppLink
                            href={`/slides?project_id=${presentationId}`}
                            newTab
                            underline="hover"
                            color="primary"
                          >
                            View & Export
                          </AppLink>
                        </Typography>
                      )}
                </Box>

                {/* Scrollable Content */}
                <Box sx={{ p: 3, pt: 0 }}>
                  {slidesData?.data?.length === 0 ? (
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
                            slidesData?.total_slides || slidesData?.data?.length
                          }
                        />
                      ))}

                      {/* loading indicator */}
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
                    <Card
                      sx={{
                        bgcolor: "#f8f9fa",
                        height: 400,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #e0e0e0",
                        boxShadow: 1,
                        my: 4,
                      }}
                    >
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="h6" color="#666">
                          Generating slides...
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: "center", mt: 8, p: 3 }}>
                <Typography color="#666">
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