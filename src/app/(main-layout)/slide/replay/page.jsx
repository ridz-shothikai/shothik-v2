"use client";

import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { CustomSlideshowIcon } from "../../../../components/presentation/PresentationAgentPage";

const PRIMARY_GREEN = "#07B37A";

export default function SlideReplay() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [slides, setSlides] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    runSlideLogsSimulation(setSlides, setStatus);
  }, []);

  return (
    <Box
      sx={{
        height: {
          xs: "90dvh",
          lg: "80dvh",
          xl: "90dvh",
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
                border: "1px solid #e0e0e0",
                cursor: "pointer",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[900]
                    : "#e6f7ee",
              }}
              //   onClick={handlePreviewOpen}
            >
              <CustomSlideshowIcon
                sx={{ color: PRIMARY_GREEN, fontSize: 30 }}
              />
              <Typography
                variant="h6"
                sx={{
                  ml: 0.5,
                }}
              >
                Preview Slides
              </Typography>
            </Box>
          </>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}

async function runSlideLogsSimulation() {
  const abortController = new AbortController();

  try {
    const response = await fetch(
      "http://163.172.176.81:8030/simulation_slides/12344e7c-21ca-414b-bab1-6129a2981bc3",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        signal: abortController.signal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    // console.log(response, "response data");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    console.log(decoder, "decoder");

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const data = JSON.parse(line);

          console.log(data, "streaming data");
        } catch (error) {
          console.log(error);
        }
      }
    }
  } catch (error) {
    console.log(error, "simulation error");
    abortController.abort();
  } finally {
    abortController.abort();
  }
}
