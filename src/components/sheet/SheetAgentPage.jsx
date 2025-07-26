"use client";

import {
  Box,
  Dialog,
  DialogContent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SheetChatArea from "./SheetChatArea";
import SheetDataArea from "./SheetDataArea";
import { useEffect, useState } from "react";

export default function SheetAgentPage({ specificAgent, sheetId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const initialPrompt = sessionStorage.getItem("initialPrompt");
    if (initialPrompt) {
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        message: initialPrompt,
        timestamp: new Date().toISOString(),
        isOptimistic: true,
      };
      setOptimisticMessages((prev) => [...prev, optimisticMessage]);
      setIsLoading(true);
      sessionStorage.removeItem("initialPrompt");
    }
  }, []);

  const handlePreviewOpen = () => setPreviewOpen(true);
  const handlePreviewClose = () => setPreviewOpen(false);

  return (
    <Box
      sx={{
        height: {
          xs: "90dvh",
          lg: "80dvh",
          xl: "85dvh",
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
        {isMobile ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                cursor: "pointer",
                bgcolor: theme.palette.action.hover,
              }}
              onClick={handlePreviewOpen}
            >
              <CustomTableChartIcon
                sx={{ color: theme.palette.primary.main, fontSize: 30 }}
              />
              <Typography variant="h6" sx={{ ml: 0.5 }}>
                Preview Sheet Data
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <SheetChatArea
                currentAgentType={specificAgent}
                isLoading={isLoading}
                theme={theme}
              />
            </Box>
            <Dialog
              open={previewOpen}
              onClose={handlePreviewClose}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  height: "80vh",
                  maxHeight: "80vh",
                  position: "relative",
                  bgcolor: theme.palette.background.default,
                },
              }}
            >
              <DialogContent sx={{ p: 0, overflow: "hidden" }}>
                <SheetDataArea
                  isLoading={isLoading}
                  sheetId={sheetId}
                  theme={theme}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : (
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
              }}
            >
              <SheetChatArea
                currentAgentType={specificAgent}
                isLoading={isLoading}
                theme={theme}
              />
            </Box>
            <Box
              sx={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <SheetDataArea
                isLoading={isLoading}
                sheetId={sheetId}
                theme={theme}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

const CustomTableChartIcon = ({ sx, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    {...props}
    style={{ ...sx }}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M10 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v-2H5V5h5V3zm9 0h-5v2h5v14h-5v2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v2h4v-2zm0-4h-4v2h4V9zm0-4h-4v2h4V5z" />
  </svg>
);
