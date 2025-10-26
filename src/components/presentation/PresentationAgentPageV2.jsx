"use client";

import { selectPresentation } from "@/redux/slice/presentationSlice";
import { Box, useTheme } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePresentationSocket from "../../hooks/usePresentationSocket";
import PreviewPanel from "./PreviewPanel";
import PresentationLogsUi from "./v2/PresentationLogsUi";

export default function PresentationAgentPageV2({ presentationId }) {
  const dispatch = useDispatch();
  const presentationState = useSelector(selectPresentation);
  const theme = useTheme();

  console.log(presentationState, "SLIDE DATA ON REDUX");

  const token = localStorage.getItem("accessToken");
  const API_URL = process.env.NEXT_PUBLIC_API_URI_SLIDE;

  // Start the presentation (moved to useEffect)
  useEffect(() => {
    const startPresentation = async () => {
      try {
        const response = await fetch(
          `${API_URL}/start-presentation/${presentationId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        console.log(data, "SUBSCRIBE RESPONSE FOR PRESENTATION");
      } catch (error) {
        console.log("Error starting presentation:", error);
      }
    };

    if (presentationId && token) {
      startPresentation();
    }
  }, [presentationId, token, API_URL]);

  // Callback to handle agent output messages
  const handleAgentOutput = useCallback(
    (message) => {
      console.log("Processing agent_output:", message);
    },
    [dispatch],
  );

  // Initialize socket with the callback
  const { subscribe } = usePresentationSocket(
    presentationId,
    token,
    handleAgentOutput,
  );

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
      <div className="grid !w-[100%] grid-cols-1 items-center gap-5 bg-gray-50 lg:grid-cols-2">
        <PresentationLogsUi logs={presentationState.logs} />
        <PreviewPanel
          currentAgentType={"presentation"}
          slidesData={presentationState.slides}
          slidesLoading={false}
          presentationId={presentationState.slideCurrentId}
          title={presentationState.title}
        />
      </div>
    </Box>
  );
}
