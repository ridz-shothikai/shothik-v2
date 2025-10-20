"use client";

import {
  Box,
  Dialog,
  DialogContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ChatArea from "../../../../components/presentation/ChatArea";
import PreviewPanel from "../../../../components/presentation/PreviewPanel";

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

  const [simulationCompleted, setSimulationCompleted] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const handlePreviewOpen = () => setPreviewOpen(true);
  const handlePreviewClose = () => setPreviewOpen(false);

  useEffect(() => {
    runSlideSimulation(
      setSlides,
      setStatus,
      setSlideDataLoading,
      setTitle,
      setTotalSlides,
      id,
    );
    runLogsSimulation(
      setLogsData,
      setLogsStatus,
      setLogsLoading,
      id,
      setSimulationCompleted,
    );
  }, []);

  //   console.log(logsData, "logsData");
  //   console.log(slides, "slides");

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
        {isMobile ? (
          <>
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
                simulationCompleted={simulationCompleted}
                setShowModal={setShowModal}
                showModal={showModal}
                // these are for preview panel on mobile devices
                handlePreviewOpen={handlePreviewOpen}
                slides={slides}
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
                simulationCompleted={simulationCompleted}
                setShowModal={setShowModal}
                showModal={showModal}
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
  slideId,
) {
  const abortController = new AbortController();

  try {
    setStatus("processing");
    setSlideDataLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX}/slide/simulation_slides/${slideId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        signal: abortController.signal,
      },
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
            setTotalSlides(data?.total_slides);
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

async function runLogsSimulation(
  setLogsData,
  setLogsStatus,
  setLogsLoading,
  slideId,
  setSimulationCompleted,
) {
  const abortController = new AbortController();

  setLogsStatus("processing");
  setLogsLoading(true);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX}/slide/simulation-logs/${slideId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        signal: abortController.signal,
      },
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
            setSimulationCompleted(true);
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
