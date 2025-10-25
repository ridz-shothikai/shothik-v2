"use client";

import { selectPresentation } from "@/redux/slice/presentationSlice";
import { Box, useTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PreviewPanel from "./PreviewPanel";
import PresentationLogsUi from "./v2/PresentationLogsUi";

export default function PresentationAgentPageV2({ presentationId }) {
  const dispatch = useDispatch();
  const presentationState = useSelector(selectPresentation);
  const theme = useTheme();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  console.log(presentationState, "SLIDE DAATA ON REDUX");

  const config = {
    baseUrl: process.env.NEXT_PUBLIC_API_URI_SLIDE, // "https://03dbbfed1354.ngrok-free.app", // "https://17b9c083b988.ngrok-free.app",
    statusCheckInterval: 15000, // Check status every 15 seconds
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    heartbeatTimeout: 30000,
  };

  // const presentation = useGetSlideDataByStream(config);

  // useEffect(() => {
  //   if (presentationId) {
  //     dispatch(setCurrentSlideId({ presentationId }));
  //   }
  // }, [presentationId, dispatch]);

  return (
    <Box
      sx={{
        height: {
          xs: "90dvh", // height for mobile screens (extra-small)
          lg: "calc(100dvh - 70px)",
        },
        // bgcolor: "white",
        // color: "#333",
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
