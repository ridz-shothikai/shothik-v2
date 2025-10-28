"use client";

import useResponsive from "@/hooks/useResponsive";
import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import InputArea from "../InputAreas";
import MessageBubble from "./MessageBubble";

export default function PresentationLogsUi({ logs = [] }) {
  const theme = useTheme();
  const scrollContainerRef = useRef(null);

  const isMobile = useResponsive("down", "md");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(null);
  const [fileUrls, setFileUrls] = useState(null);

  const onSend = () => {};

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // small timeout to allow render
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [logs]);

  return (
    // Container: column flex so logs area can be flex:1 and input stays fixed at bottom
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // must inherit from parent (PresentationAgentPageV2 ensures that)
        minHeight: 0, // allow children to shrink properly
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Scrollable logs area */}
      <Box
        ref={scrollContainerRef}
        sx={{
          flex: 1, // take remaining space
          overflowY: "auto",
          overflowX: "hidden",
          minHeight: 0,
          scrollBehavior: "smooth",
          p: 3,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: theme.palette.mode === "dark" ? "#555" : "#c1c1c1",
            borderRadius: "3px",
            "&:hover": {
              background: theme.palette.mode === "dark" ? "#777" : "#a8a8a8",
            },
          },
          scrollbarWidth: "thin",
          scrollbarColor:
            theme.palette.mode === "dark"
              ? "#555 transparent"
              : "#c1c1c1 transparent",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {logs?.length ? (
            logs.map((l, idx) => (
              // <Typography
              //   key={l.id ?? `${l.type}-${Math.random()}`}
              //   sx={{ py: 1 }}
              // >
              //   {l.text ?? "logs"} {/* render real text if available */}
              // </Typography>

              <MessageBubble key={l.id || idx} logs={l} />
            ))
          ) : (
            <Typography sx={{ color: theme.palette.text.secondary }}>
              No logs yet
            </Typography>
          )}
        </Box>
      </Box>

      {/* Input area pinned to bottom */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
          bgcolor:
            theme.palette.mode === "light"
              ? "white"
              : theme.palette.background.paper,
        }}
      >
        <InputArea
          currentAgentType={"presentation"}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={onSend}
          isLoading={isLoading}
          setUploadedFiles={setUploadedFiles}
          setFileUrls={setFileUrls}
          uploadedFiles={uploadedFiles}
          fileUrls={fileUrls}
        />
      </Box>
    </Box>
  );
}
