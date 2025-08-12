"use client";

import {
  Box,
  Dialog,
  DialogContent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { CustomSlideshowIcon } from "../../../../components/presentation/PresentationAgentPage";
import ChatArea from "../../../../components/presentation/ChatArea";
import PreviewPanel from "../../../../components/presentation/PreviewPanel";
import { useSearchParams } from "next/navigation";

const PRIMARY_GREEN = "#07B37A";

export default function SlideReplay() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [slides, setSlides] = useState([]);
  const [title, setTitle] = useState(null);
  const [status, setStatus] = useState("idle");
  const [slideDataLoading, setSlideDataLoading] = useState(false);
  const [totalSlides, setTotalSlides] = useState(0);

  const [logsStatus, setLogsStatus] = useState("processing");
  const [logsData, setLogsData] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreviewOpen = () => setPreviewOpen(true);
  const handlePreviewClose = () => setPreviewOpen(false);

  useEffect(() => {
    runSlideSimulation(
      setSlides,
      setStatus,
      setSlideDataLoading,
      setTitle,
      setTotalSlides,
      id
    );
    runLogsSimulation(setLogsData, setLogsStatus, setLogsLoading, id);
  }, []);

//   console.log(logsData, "logsData");
  //   console.log(slides, "slides");

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
              onClick={handlePreviewOpen}
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
              {slides.length > 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "0.75rem",
                      sm: "0.875rem",
                      md: "1rem",
                      lg: "1.1rem",
                      xl: "1.2rem",
                    },
                    mt: "3px",
                  }}
                >
                  {slides.length} slide{slides.length > 1 ? "s" : ""} available
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ChatArea
                currentAgentType={"slides"}
                chatHistory={[]}
                realLogs={logsData}
                isLoading={logsLoading}
                currentPhase={"planning"}
                completedPhases={[]}
                logsData={{ data: logsData, status: logsStatus }}
                chatEndRef={chatEndRef}
                inputValue={""}
                status={logsStatus}
                hideInputField={true}
              />
            </Box>
            <Dialog
              open={previewOpen}
              onClose={handlePreviewClose}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: { height: "80vh", maxHeight: "80vh", position: "relative" },
              }}
            >
              <DialogContent sx={{ p: 0, overflow: "hidden" }}>
                <PreviewPanel
                  currentAgentType="presentation"
                  slidesData={{
                    data: slides,
                    status: status,
                    title: title || "Generating...",
                    totalSlide: totalSlides || 0,
                  }}
                  slidesLoading={slideDataLoading}
                  presentationId={"ahsdkjasfhkja"}
                  title={title || "Generating..."}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : (
          // Desktop Layout
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
              }}
            >
              <ChatArea
                currentAgentType={"slides"}
                chatHistory={[]}
                realLogs={logsData}
                isLoading={logsLoading}
                currentPhase={"planning"}
                completedPhases={[]}
                logsData={{ data: logsData, status: logsStatus }}
                chatEndRef={chatEndRef}
                inputValue={""}
                status={logsStatus}
                hideInputField={true}
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
              <PreviewPanel
                currentAgentType="presentation"
                slidesData={{
                  data: slides,
                  status: status,
                  title: title || "Generating...",
                  totalSlide: totalSlides || 0,
                }}
                slidesLoading={slideDataLoading}
                presentationId={"ahsdkjasfhkja"}
                title={title || "Generating..."}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

async function runSlideSimulation(
  setSlides,
  setStatus,
  setSlideDataLoading,
  setTitle,
  setTotalSlides,
  slideId
) {
  const abortController = new AbortController();

  try {
    setStatus("processing");
    setSlideDataLoading(true);

    const response = await fetch(
      `http://163.172.176.81:8030/simulation_slides/${slideId}`,
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

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
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
          console.log(data, "slide data");

          // Store slides in state
          if (data.slides) {
            setSlides((prev) => [...prev, data.slides]);
          }

          if (data.title) {
            setTitle(data.title);
          }

          if (data.total_slides) {
            setTotalSlides(data?.total_slides)
          }

            if (data.status === "completed") {
              // Watch for completion
              setStatus("completed");
              setSlideDataLoading(false);
              abortController.abort();
              return; // Stop reading
            }
        } catch (err) {
          console.log("JSON parse error", err);
        }
      }
    }
  } catch (error) {
    console.log("Simulation error:", error);
    setStatus("error");
    setSlideDataLoading(false);
    abortController.abort();
  }
}

async function runLogsSimulation(setLogsData, setLogsStatus, setLogsLoading, slideId) {
  const abortController = new AbortController();

  setLogsStatus("processing");
  setLogsLoading(true);

  try {
    const response = await fetch(
      `http://163.172.176.81:8030/simulation-logs/${slideId}`,
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

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
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
        //   console.log(data, "logs data");
          // Store slides in state
          if (data.logs) {
            setLogsData((prev) => [...prev, data.logs]);
          }

          //   // Watch for completion
          if (data.status === "completed") {
            setLogsStatus("completed");
            setLogsLoading(false);
            abortController.abort();
            return; // Stop reading
          }
        } catch (err) {
          console.log("JSON parse error", err);
        }
      }
    }
  } catch (error) {
    console.log("Logs data fetching error :", error);
    setLogsStatus("failed");
    setLogsLoading(false);
  }
}
