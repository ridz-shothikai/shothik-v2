"use client";

import useResponsive from "@/hooks/useResponsive";
import { Box, Typography, useTheme } from "@mui/material";
import { useRef, useState } from "react";
import InputArea from "../InputAreas";

export default function PresentationLogsUi({ logs = [] }) {
  console.log(logs, "LOGS");
  const theme = useTheme();
  const scrollContainerRef = useRef();

  const isMobile = useResponsive("down", "md");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(null);
  const [fileUrls, setFileUrls] = useState(null);

  const onSend = () => {};

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxHeight: "100%",
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.default,
          overflow: "hidden",
        }}
      >
        <Box
          ref={scrollContainerRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
            scrollBehavior: "smooth",
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
          <Box
            sx={{
              p: 3,
              minHeight: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {logs?.map((l) => {
              return (
                <Typography key={l.id} sx={{ py: 1 }}>
                  logs
                </Typography>
              );
            })}
          </Box>

          <Box
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              maxHeight: isMobile ? "400px" : "300px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box>
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
        </Box>
      </Box>
    </>
  );
}
