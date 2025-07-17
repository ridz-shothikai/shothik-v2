"use client";

import { Box } from "@mui/material";
import SheetChatArea from "./SheetChatArea";
import SheetDataArea from "./SheetDataArea";
import { useEffect, useState } from "react";

export default function SheetAgentPage({ specificAgent, sheetId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticMessage, setOptimisticMessages] = useState([]);

  useEffect(() => {
    const initialPrompt = sessionStorage.getItem("initialPrompt");
    // if (initialPrompt && chatHistory.length === 0) {
    //   const optimisticMessage = {
    //     id: `temp-${Date.now()}`,
    //     role: "user",
    //     message: initialPrompt,
    //     timestamp: new Date().toISOString(),
    //     isOptimistic: true,
    //   };
    // Add to local state immediately
    setOptimisticMessages((prev) => [...prev, optimisticMessage]);
    //   setIsLoading(true);
    sessionStorage.removeItem("initialPrompt");
    // }
    //   }, [chatHistory.length]);
  }, []);

  return (
    <Box
      sx={{
        height: {
          xs: "90dvh", // height for mobile screens (extra-small)
          lg: "80dvh", // height for desktop screens (large)
          xl: "85dvh", // height for extra-large screens
        },
        bgcolor: "white",
        color: "#333",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: {
            xs: "column", // Stack vertically on mobile
            md: "row", // Side by side on tablet and desktop
          },
          overflow: "hidden",
          minHeight: 0,
          gap: 1, // Add small gap between components
        }}
      >
        {/* Chat Area - Left side on desktop, top on mobile */}
        <Box
          sx={{
            flex: {
              xs: 1, // Full width on mobile
              md: "0 0 40%", // 40% width on tablet and desktop
            },
            minHeight: {
              xs: "50%", // At least 50% height on mobile
              md: "100%", // Full height on tablet and desktop
            },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRight: {
              xs: "none",
              md: "1px solid #e0e0e0", // Add border separator on desktop
            },
            borderBottom: {
              xs: "1px solid #e0e0e0", // Add border separator on mobile
              md: "none",
            },
          }}
        >
          <SheetChatArea
            currentAgentType={specificAgent}
            isLoading={isLoading}
          />
        </Box>

        {/* Sheet Data Area - Right side on desktop, bottom on mobile */}
        <Box
          sx={{
            flex: {
              xs: 1, // Full width on mobile
              md: "0 0 60%", // 60% width on tablet and desktop
            },
            minHeight: {
              xs: "50%", // At least 50% height on mobile
              md: "100%", // Full height on tablet and desktop
            },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <SheetDataArea isLoading={isLoading} />
        </Box>
      </Box>
    </Box>
  );
}
