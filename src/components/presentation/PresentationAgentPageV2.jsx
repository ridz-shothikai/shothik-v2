"use client";

import { selectPresentation } from "@/redux/slice/presentationSlice";
import { Box, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import usePresentationOrchestrator from "../../hooks/orchestrator/usePresentationOrchestrator";
import PreviewPanel from "./PreviewPanel";
import PresentationLogsUi from "./v2/PresentationLogsUi";

export default function PresentationAgentPageV2({ presentationId }) {
  const presentationState = useSelector(selectPresentation);
  const theme = useTheme();

  // Initialize orchestrator - handles all status-based logic
  const { hookStatus, error, retry, currentStatus, socketConnected } =
    usePresentationOrchestrator(presentationId);

  console.log("[Page] Presentation state:", {
    hookStatus,
    currentStatus,
    socketConnected,
    logsCount: presentationState.logs.length,
    slidesCount: presentationState.slides.length,
    status: presentationState.status,
  });

  /**
   * Render error state
   */
  if (hookStatus === "error" || presentationState.status === "failed") {
  }

  /**
   * Render loading state for initial status check
   */
  if (hookStatus === "checking" || hookStatus === "idle") {
  }

  /**
   * Render loading state for history loading
   */
  if (hookStatus === "loading_history") {
  }

  /**
   * Render main interface
   * Shows when: streaming, ready, or has data to display
   */

  return (
    <Box
      sx={{
        height: {
          xs: "90dvh",
          lg: "calc(100dvh - 70px)",
        },
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gridTemplateRows: "1fr",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              borderRight: `1px solid ${theme.palette.divider}`,
              height: "100%",
            }}
          >
            <PresentationLogsUi logs={presentationState.logs} />
          </Box>
          <Box
            sx={{
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <PreviewPanel
              currentAgentType={"presentation"}
              slidesData={presentationState.slides}
              slidesLoading={false}
              presentationId={presentationState.slideCurrentId}
              title={presentationState.title}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
