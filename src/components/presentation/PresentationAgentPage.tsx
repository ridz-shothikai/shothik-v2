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
import { Button, Typography } from "@mui/material";

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

  const presentationState = useSelector(selectPresentation);
  const {
    logs = [],
    slides = [],
    currentPhase = "planning",
    completedPhases = [],
    presentationBlueprint = null,
    status = "idle",
  } = presentationState || {};

  useEffect(() => {
    console.log("[PresentationAgentPage] Initializing socket connection");

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
    });

    socketInstance.on("disconnect", () => {
      console.log("[SOCKET] Disconnected");
      setIsSocketConnected(false);
    });

    socketInstance.on("error", (error) => {
      console.error("[SOCKET] Error:", error.message);
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
          dispatch(setPresentationState({ logs, slides, status }));
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
      const initialMessage = {
        id: Date.now(),
        sender: "user",
        content: initialPrompt,
        timestamp: new Date(),
      };
      setChatHistory([initialMessage]);
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
    if (status === "saved" || status === "failed") { // 'svaed' is when presentation is saved on shothik DB. 'failed' is when the presentation failed to generate.
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (isLoading) {
        setIsLoading(false);
      }
      return;
    }

    // If there's no ID or we are not in a loading state, stop polling.
    if (!currentPresentationId || !isLoading) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Prevent starting a new poller if one is already running
    if (pollingIntervalRef.current) return;

    pollingIntervalRef.current = setInterval(() => {
      console.log(
        "[PresentationAgentPage] Polling for updates:",
        currentPresentationId
      );
      fetchPresentationData();
    }, 3000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [currentPresentationId, isLoading, status]); //these dependencies shouldn't be changed frequently
  

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
          const combinedState = {
            logs: logsData?.data || presentationState.logs || [],
            slides: slidesData?.data || presentationState.slides || [],
            status:
              logsData?.status ||
              slidesData?.status ||
              presentationState.status,
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

          if (
            combinedState.status === "completed" ||
            combinedState.status === "failed"
          ) {
            setIsLoading(false);
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          }
        }
      } else {
        throw new Error("Failed to fetch presentation data");
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

    const newMessage = {
      id: Date.now(),
      sender: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setChatHistory([newMessage]);
    setInputValue("");
    setIsLoading(true);
    setDataFetched(false);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URI || "";
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${baseUrl}/presentation/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const newPresentationId =
          responseData.presentationId || responseData.data?.presentationId;

        if (newPresentationId) {
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

          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          if (socket && isSocketConnected && currentPresentationId) {
            console.log(
              "[SOCKET] Leaving previous presentation room:",
              currentPresentationId
            );
            socket.emit("leavePresentation", currentPresentationId);
          }

          setCurrentPresentationId(newPresentationId);
          if (socket && isSocketConnected) {
            console.log(
              "[SOCKET] Joining new presentation room:",
              newPresentationId
            );
            socket.emit("joinPresentation", newPresentationId);
          }

          router.push(`/agents/presentation?id=${newPresentationId}`, {
            scroll: false,
          });
        }
      } else {
        console.error(
          "[PresentationAgentPage] Failed to initiate presentation:",
          response.status
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error(
        "[PresentationAgentPage] Failed to initiate presentation:",
        error
      );
      setIsLoading(false);
    }
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

  if (!currentPresentationId) {
    return (
      <Box
        sx={{
          height: "100dvh",
          bgcolor: "white",
          color: "#333",
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
        height: "100dvh",
        bgcolor: "white",
        color: "#333",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <AgentHeader
        currentAgentType={currentAgentType}
        onBackClick={() => router.push("/agents")}
      />

      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gridTemplateRows: "1fr",
          height: "calc(100vh - 120px)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
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
          />
        </Box>

        <Box
          sx={{
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PreviewPanel
            currentAgentType="presentation"
            slidesData={{
              data: slides,
              status: status,
              title: presentationState.title || "Generating...",
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
    </Box>
  );
}
