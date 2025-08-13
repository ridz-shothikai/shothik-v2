"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import AgentHeader from "./AgentHeader";
import ChatArea from "./ChatArea";
import PreviewPanel from "./PreviewPanel";
import { useSelector, useDispatch } from "react-redux";
import {
  setPresentationState,
  selectPresentation,
} from "../../redux/slice/presentationSlice";
import io from "socket.io-client";
import { useAgentContext } from "../../../components/agents/shared/AgentContextProvider";
import { Button, Dialog, DialogContent, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";

const PRIMARY_GREEN = "#07B37A";
const PHASES_ORDER = [
  "planning",
  "preferences",
  "content",
  "design",
  "validation",
];

const getLatestPhase = (completedPhasesSet) => {
  return (
    PHASES_ORDER.slice()
      .reverse()
      .find((phase) => completedPhasesSet.has(phase)) || null
  );
};

export default function PresentationAgentPage({ specificAgent }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { agentType, setAgentType } = useAgentContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const urlPresentationId =
    searchParams.get("id") || searchParams.get("presentation_id");

  const [currentPresentationId, setCurrentPresentationId] =
    useState(urlPresentationId);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState("chat");
  const [socket, setSocket] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const chatEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const presentationState = useSelector(selectPresentation);
  const {
    logs = [],
    slides = [],
    currentPhase = "planning",
    completedPhases = [],
    presentationBlueprint = null,
    status = "idle",
    totalSlides = 0,
  } = presentationState || {};

  console.log(status, "status");

  useEffect(() => {
    console.log(
      "[PresentationAgentPage] Initializing socket connection",
      "presentaton id ->",
      currentPresentationId
    );

    const token = localStorage.getItem("accessToken");
    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
      {
        auth: { token },
        forceNew: true,
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      }
    );

    socketInstance.on("connect", () => {
      console.log("[SOCKET] Connected:", socketInstance.id);
      setIsSocketConnected(true);

      // RECONNECTION LOGIC: If we have a presentation ID, rejoin the room
      if (currentPresentationId) {
        console.log(
          "[SOCKET] Reconnecting to presentation:",
          currentPresentationId
        );
        socketInstance.emit("joinPresentation", currentPresentationId);

        // If we don't have data or we're in a loading state, fetch current state
        if (!dataFetched || isLoading) {
          console.log(
            "[SOCKET] Fetching current presentation state after reconnection"
          );
          setIsLoading(true); // Starting the data polling again to start the streaming
          fetchPresentationData();
        }
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("[SOCKET] Disconnected");
      setIsSocketConnected(false);
    });

    socketInstance.on("error", (error) => {
      console.log("[SOCKET] Error:", error.message);
      if (
        error.message === "Authentication failed" ||
        error.message === "Unauthorized presentation access"
      ) {
        router.push("/agents");
      }
    });

    socketInstance.on(
      "presentationUpdate",
      ({ presentationId, logs, slides, status }) => {
        if (presentationId === currentPresentationId) {
          console.log(
            "[SOCKET] Updating presentation state for:",
            presentationId
          );
          // dispatch(
          //   setPresentationState((prev) => ({
          //     logs: [
          //       ...prev.logs,
          //       ...logs.filter(
          //         (newLog) =>
          //           !prev.logs.some((existing) => existing.id === newLog.id)
          //       ),
          //     ],
          //     slides,
          //     status,
          //   }))
          // );
          if (status === "completed" || status === "failed") {
            setIsLoading(false);
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          }
        } else {
          console.log(
            "[SOCKET] Ignoring update for different presentation:",
            presentationId
          );
        }
      }
    );

    socketInstance.on("joinedPresentation", (data) => {
      console.log("[SOCKET] Successfully joined presentation:", data);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("[SOCKET] Connection error:", error);
      setIsSocketConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      console.log("[SOCKET] Cleaning up socket connection");
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      socketInstance.disconnect();

      // Clear Redux state on unmount
      dispatch(
        setPresentationState({
          logs: [],
          slides: [],
          status: "idle",
          currentPhase: "planning",
          completedPhases: [],
          presentationBlueprint: null,
          title: "Generating",
          totalSlides: 0,
        })
      );  
    };
  }, []);

  useEffect(() => {
    if (urlPresentationId && urlPresentationId !== currentPresentationId) {
      console.log(
        "[PresentationAgentPage] New presentation ID detected:",
        urlPresentationId
      );

      dispatch(
        setPresentationState({
          logs: [],
          slides: [],
          status: "planning",
          currentPhase: "planning",
          completedPhases: [],
          presentationBlueprint: null,
          title: "Generating...",
          totalSlides: 0,
        })
      );
      setChatHistory([]);
      setDataFetched(false);
      setIsLoading(true);

      if (socket && isSocketConnected && currentPresentationId) {
        console.log(
          "[SOCKET] Leaving previous presentation room:",
          currentPresentationId
        );
        socket.emit("leavePresentation", currentPresentationId);
      }

      setCurrentPresentationId(urlPresentationId);

      if (socket && isSocketConnected) {
        console.log(
          "[SOCKET] Joining new presentation room:",
          urlPresentationId
        );
        socket.emit("joinPresentation", urlPresentationId);
      }
    }
  }, [
    urlPresentationId,
    currentPresentationId,
    socket,
    isSocketConnected,
    dispatch,
  ]);

  useEffect(() => {
    if (specificAgent && specificAgent !== agentType) {
      setAgentType(specificAgent);
    }
  }, [specificAgent, agentType, setAgentType]);

  const currentAgentType = specificAgent || agentType;

  useEffect(() => {
    if (currentAgentType === "presentation") {
      setSelectedNavItem("slides");
    } else {
      setSelectedNavItem("chat");
    }
  }, [currentAgentType]);

  useEffect(() => {
    const initialPrompt = sessionStorage.getItem("initialPrompt");
    if (initialPrompt && chatHistory.length === 0) {
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        message: initialPrompt,
        timestamp: new Date().toISOString(),
        isOptimistic: true,
      };
      // Add to local state immediately
      setOptimisticMessages((prev) => [...prev, optimisticMessage]);
      setIsLoading(true);
      sessionStorage.removeItem("initialPrompt");
    }
  }, [chatHistory.length]);

  useEffect(() => {
    if (currentPresentationId && !dataFetched) {
      console.log(
        "[PresentationAgentPage] Fetching initial data for:",
        currentPresentationId
      );
      fetchPresentationData();
    }
  }, [currentPresentationId, dataFetched]);

  useEffect(() => {
    // If the presentation is finished, ensure polling is stopped and loading is false.
    if (status === "completed" || status === "failed") {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (isLoading) {
        setIsLoading(false);
      }
      return;
    }

    // If there's no ID, stop polling.
    if (!currentPresentationId) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Start polling if we're loading OR status is processing
    const shouldStartPolling = isLoading || status === "processing";

    if (shouldStartPolling) {
      // Prevent starting a new poller if one is already running
      if (pollingIntervalRef.current) return;

      console.log(
        "[PresentationAgentPage] Starting polling for:",
        currentPresentationId
      );

      pollingIntervalRef.current = setInterval(() => {
        console.log(
          "[PresentationAgentPage] Polling for updates:",
          currentPresentationId
        );
        fetchPresentationData();
      }, 3000);
    } else {
      // Stop polling if we're not loading and status is not processing
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [currentPresentationId, isLoading, status]); //these dependencies shouldn't be changed frequently

      // (isLoading || status === "processing") && !isSocketConnected;
      // console.log(isSocketConnected, "isSocketConnected");

  const fetchPresentationData = async () => {
    if (!currentPresentationId) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URI || "";
      const token = localStorage.getItem("accessToken");

      const headers = {
        "Content-Type": "application/json",
        "X-Presentation-ID": currentPresentationId,
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${token}`,
      };

      const [logsResponse, slidesResponse] = await Promise.all([
        fetch(
          `${baseUrl}/presentation/logs/${currentPresentationId}?t=${Date.now()}`,
          {
            headers,
            cache: "no-cache",
          }
        ),
        fetch(
          `${baseUrl}/presentation/slides/${currentPresentationId}?t=${Date.now()}`,
          {
            headers,
            cache: "no-cache",
          }
        ),
      ]);

      if (logsResponse.ok || slidesResponse.ok) {
        const logsData = logsResponse.ok ? await logsResponse.json() : null;
        const slidesData = slidesResponse.ok
          ? await slidesResponse.json()
          : null;

        const currentUrlId =
          searchParams.get("id") || searchParams.get("presentation_id");
        if (currentPresentationId === currentUrlId) {
          const newStatus =
            logsData?.status || slidesData?.status || presentationState.status;

          const combinedState = {
            logs: logsData?.data || presentationState.logs || [],
            slides: slidesData?.data || presentationState.slides || [],
            status: newStatus,
            title:
              slidesData?.title || logsData?.title || presentationState.title,
            totalSlides:
              slidesData?.total_slides ||
              logsData?.total_slides ||
              presentationState.totalSlides,
            currentPhase: logsData?.status || presentationState.currentPhase,
            completedPhases:
              logsData?.completedPhases || presentationState.completedPhases,
          };

          dispatch(setPresentationState(combinedState));

          // Stop loading and polling if completed or failed
          if (newStatus === "completed" || newStatus === "failed") {
            setIsLoading(false);
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          }
        }
      } else {
        // throw new Error("Failed to fetch presentation data");
        console.log("Failed to fetch presentation data");
      }

      setDataFetched(true);
    } catch (error) {
      console.error(
        "[PresentationAgentPage] Error fetching presentation data:",
        error
      );
      setDataFetched(true);
      // Consider not redirecting immediately on a transient fetch error
      // router.push("/agents");
    }
  };

  const handleSend = async (promptText) => {
    const prompt = promptText || inputValue;
    if (!prompt.trim() || isLoading) return;

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      message: prompt,
      timestamp: new Date().toISOString(),
      isOptimistic: true,
    };

    setChatHistory([]);
    // Add to local state immediately
    setOptimisticMessages((prev) => [...prev, optimisticMessage]);
    setInputValue("");
    setIsLoading(true);

    // Reset status to processing to ensure polling starts
    dispatch(
      setPresentationState({
        ...presentationState,
        status: "processing",
      })
    );

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URI || "";
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${baseUrl}/presentation/chat/message/${urlPresentationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_query: prompt }),
        }
      );

      if (!response.ok) {
        // Handle different error status codes
        let errorMessage = "Failed to send message. Please try again.";

        if (response.status === 401) {
          errorMessage = "Session expired. Please log in again.";
        } else if (response.status === 403) {
          errorMessage =
            "You don't have permission to access this presentation.";
        } else if (response.status === 429) {
          errorMessage =
            "Too many requests. Please wait a moment and try again.";
        } else if (response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }

        // throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("[PresentationAgentPage] Failed to send message:", error);

      // Remove the optimistic message
      setOptimisticMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );

      // Reset loading state
      setIsLoading(false);

      // Reset status back to previous state
      dispatch(
        setPresentationState({
          ...presentationState,
          status: status || "idle",
        })
      );

      // Show error notification
      setSnackbar({
        open: true,
        message: error.message || "Failed to send message. Please try again.",
        severity: "error",
      });
    }
  };

  // Add this function to handle snackbar close
  const handleSnackbarClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleNavItemClick = (itemId) => {
    setSelectedNavItem(itemId);
    if (itemId === "slides") {
      router.push(
        "/agents/presentation" +
          (currentPresentationId ? `?id=${currentPresentationId}` : "")
      );
    } else if (itemId === "chat") {
      router.push(
        "/agents/super" +
          (currentPresentationId ? `?id=${currentPresentationId}` : "")
      );
    }
  };

  const handleApplyAutoFixes = () => {
    console.log("Applying auto-fixes...");
  };

  const handleRegenerateWithFeedback = () => {
    console.log("Regenerating with feedback...");
  };

  const handlePreviewOpen = () => setPreviewOpen(true);
  const handlePreviewClose = () => setPreviewOpen(false);

  // console.log(logs, "logs data");

  useEffect(() => {
    if (status === "failed") {
      setSnackbar({
        open: true,
        message: "Presentation generation failed. Please try again.",
        severity: "error",
      });
    }
  }, [status]);

  if (!currentPresentationId) {
    return (
      <Box
        sx={{
          height: "100dvh",
          // bgcolor: "white",
          // color: "#333",
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="error">
          No presentation ID found. Please start a new presentation.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/agents")}
          sx={{ mt: 2, bgcolor: PRIMARY_GREEN }}
        >
          Go Back to Agents
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: {
          xs: "90dvh", // height for mobile screens (extra-small)
          lg: "80dvh", // height for desktop screens (large)
          xl: "90dvh", // height for extra-large screens
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
      {/* <Box sx={{ flexShrink: 0 }}>
        <AgentHeader
          currentAgentType={currentAgentType}
          onBackClick={() => router.push("/agents")}
        />
      </Box> */}

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
          // Mobile Layout
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                p: 2,
                border: "1px solid #e0e0e0",
                cursor: "pointer",
                // bgcolor: "#fafafa",
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
                currentAgentType={currentAgentType}
                chatHistory={chatHistory}
                realLogs={logs}
                isLoading={isLoading}
                currentPhase={currentPhase}
                completedPhases={completedPhases}
                logsData={{ data: logs, status: currentPhase }}
                chatEndRef={chatEndRef}
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSend={handleSend}
                status={status}
                presentationId={urlPresentationId}
                optimisticMessages={optimisticMessages}
                setUploadedFiles={setUploadedFiles}
                setFileUrls={setFileUrls}
                uploadedFiles={uploadedFiles}
                fileUrls={fileUrls}
                hideInputField={false}
                simulationCompleted={false}
                showModal={showModal}
                setShowModal={setShowModal}
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
              {/* custom closing button on top of the dialog */}
              {/* <IconButton
                aria-label="close"
                onClick={handlePreviewClose}
                sx={{
                  position: "absolute",
                  right: 4,
                  top: 4,
                  color: '#000000',
                  padding: 1,
                  zIndex: 12
                }}
              >
                <CustomCloseIcon sx={{ fontSize: 24 }} />
              </IconButton> */}
              {/* <DialogContent sx={{ px: 0, pb: 0, pt: 2, overflow: "hidden" }}> */}
              <DialogContent sx={{ p: 0, overflow: "hidden" }}>
                <PreviewPanel
                  currentAgentType="presentation"
                  slidesData={{
                    data: slides,
                    status: status,
                    title: presentationState.title || "Generating...",
                    totalSlide: presentationState.totalSlides || 0,
                  }}
                  slidesLoading={isLoading}
                  presentationId={currentPresentationId}
                  currentPhase={currentPhase}
                  completedPhases={completedPhases}
                  presentationBlueprint={presentationBlueprint}
                  qualityMetrics={null}
                  validationResult={null}
                  isValidating={false}
                  onApplyAutoFixes={handleApplyAutoFixes}
                  onRegenerateWithFeedback={handleRegenerateWithFeedback}
                  title={presentationState.title || "Generating..."}
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
                currentAgentType={currentAgentType}
                chatHistory={chatHistory}
                realLogs={logs}
                isLoading={isLoading}
                currentPhase={currentPhase}
                completedPhases={completedPhases}
                logsData={{ data: logs, status: currentPhase }}
                chatEndRef={chatEndRef}
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSend={handleSend}
                status={status}
                presentationId={urlPresentationId}
                optimisticMessages={optimisticMessages}
                setUploadedFiles={setUploadedFiles}
                setFileUrls={setFileUrls}
                uploadedFiles={uploadedFiles}
                fileUrls={fileUrls}
                hideInputField={false}
                simulationCompleted={false}
                showModal={showModal}
                setShowModal={setShowModal}
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
                  title: presentationState.title || "Generating...",
                  totalSlide: presentationState.totalSlides || 0,
                }}
                slidesLoading={isLoading}
                presentationId={currentPresentationId}
                currentPhase={currentPhase}
                completedPhases={completedPhases}
                presentationBlueprint={presentationBlueprint}
                qualityMetrics={null}
                validationResult={null}
                isValidating={false}
                onApplyAutoFixes={handleApplyAutoFixes}
                onRegenerateWithFeedback={handleRegenerateWithFeedback}
                title={presentationState.title || "Generating..."}
              />
            </Box>
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%", bgcolor: theme.palette.background.paper }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export const CustomSlideshowIcon = ({ sx, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    {...props}
    style={{ ...sx }}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
  </svg>
);

const CustomCloseIcon = ({ sx, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    {...props}
    style={{ ...sx }}
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);