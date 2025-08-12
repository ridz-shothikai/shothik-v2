import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Stop,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import InputArea from "../presentation/InputAreas";
import {
  setActiveSheetIdForPolling,
  setSheetData,
  setSheetStatus,
  setSheetTitle,
} from "../../redux/slice/sheetSlice";
import { selectSheet } from "../../redux/slice/sheetSlice";
import { authenticateToSheetService } from "../../libs/sheetUtils";
import { useRouter, useSearchParams } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import MetadataDisplay from "./MetaDataDisplay";
import TypingAnimation from "../common/TypingAnimation";
import { useGetChatHistoryQuery } from "../../redux/api/sheet/sheetApi";

const USER_MESSAGE_COLOR = "#1976d2";
const PRIMARY_GREEN = "#07B37A";

// Updated MessageBubble component
const MessageBubble = ({
  message,
  isUser,
  timestamp,
  type = "info",
  metadata,
  theme,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      mb: 3, // Consistent margin-bottom with ChatArea
    }}
  >
    <Box sx={{ maxWidth: isUser ? "80%" : "90%" }}>
      {isUser ? (
        // User message styling (aligned with ChatArea)
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
              justifyContent: "flex-end",
              opacity: 0.7,
            }}
          >
            <Typography
              variant="caption"
              color={theme.palette.text.secondary}
              sx={{ fontSize: "0.7rem" }}
            >
              {new Date(timestamp).toLocaleTimeString()}
            </Typography>
            <Typography
              variant="caption"
              color={theme.palette.text.secondary}
              sx={{ fontWeight: 500, fontSize: "0.75rem" }}
            >
              You
            </Typography>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                bgcolor: USER_MESSAGE_COLOR,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <PersonIcon sx={{ fontSize: 12, color: "white" }} />
            </Box>
          </Box>
          <Box
            sx={{
              bgcolor: USER_MESSAGE_COLOR,
              color: "white",
              borderRadius: "18px 18px 4px 18px",
              px: 2,
              py: 1.5,
              maxWidth: "100%",
              wordBreak: "break-word",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.5,
                fontSize: "0.95rem",
              }}
            >
              {message}
            </Typography>
          </Box>
        </>
      ) : (
        // AI message styling (updated to match ChatArea)
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1.5,
              opacity: 0.7,
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                bgcolor: PRIMARY_GREEN,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "8px",
                color: "white",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              AI
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500, fontSize: "0.75rem" }}
            >
              Sheet AI
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontSize: "0.7rem" }}
            >
              {new Date(timestamp).toLocaleTimeString()}
            </Typography>
          </Box>
          <Paper
            elevation={1}
            sx={{
              boxShadow: "none",
              bgcolor:
                // theme.palette.mode === "dark"
                   theme.palette.background.default
                  // : "#FAFAFA",
              // p: 2,
              // bgcolor:
              //   type === "error"
              //     ? "error.light"
              //     : type === "success"
              //     ? "success.light"
              //     : "grey.100",
              // color:
              //   type === "error"
              //     ? "error.contrastText"
              //     : type === "success"
              //     ? "success.contrastText"
              //     : "text.primary",
              // borderRadius: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.6,
                fontSize: "0.95rem",
                color: theme.palette.mode === "dark" ? "white" : "text.primary",
              }}
            >
              {message}
            </Typography>
            {metadata && <MetadataDisplay metadata={metadata} />}
          </Paper>
        </Box>
      )}
    </Box>
  </Box>
);

const getStepMessage = (step, data) => {
  // First check if the data object has a custom message
  if (data?.message) {
    return data.message;
  }

  // Fallback to predefined messages for known steps
  const stepMessages = {
    context_analysis: "Analyzing conversation context...",
    validation: "Validating your request...",
    database_create: "Creating conversation record...",
    llm_processing: "Processing with AI model...",
    formatting: "Formatting the response...",
    memory_storage: "Storing conversation in memory...",
    database_update: "Updating conversation with response...",
    followup_analysis: "Analyzing follow-up intent...",
    followup_decision: "Determining response strategy...",
    validation_error: data?.error?.message || "Your requested prompt is not contextual enough. Please try again with more details.",
  };

  return stepMessages[step] || `Processing step: ${step}...`;
};

// Main SheetChatArea component
export default function SheetChatArea({ currentAgentType, theme }) {
  const dispatch = useDispatch();
  const sheetState = useSelector(selectSheet);
  // console.log(sheetState, "sheet state");
  const user = useSelector((state) => state.auth.user);
  const searchParams = useSearchParams();
  const currentChatId = searchParams.get("id");
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sheetAiToken, setSheetAiToken] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  // const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [shouldPoll, setShouldPoll] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const initialPromptProcessedRef = useRef(false);
  const initializationAttemptedRef = useRef(false);

  // RTK Query hook with conditional polling STARTS
  const {
    data: chatData,
    isLoading: isLoadingHistory,
    isError,
    error: historyError,
    refetch,
  } = useGetChatHistoryQuery(currentChatId, {
    skip: !currentChatId || !sheetAiToken,
    pollingInterval:
      shouldPoll && sheetState.activeChatIdForPolling === currentChatId
        ? 3000
        : 0,
    refetchOnMountOrArgChange: true,
  });

  const hasAnyConversation = Boolean(chatData?.conversations?.length);

  console.log(chatData, "chatData");

  // Effect to control polling based on data completeness
  useEffect(() => {
    if (!chatData) return; // no data yet
    if (!hasAnyConversation) return; // <— bail out on the default-empty payload

    const isTarget = sheetState.activeChatIdForPolling === currentChatId;

    if (currentChatId && chatData?.isIncomplete) {
      if (!isTarget) {
        dispatch(setActiveSheetIdForPolling(currentChatId));
      }
      setShouldPoll(true);
    } else {
      if (isTarget) {
        dispatch(setActiveSheetIdForPolling(null));
      }
      setShouldPoll(false);
      // if (sheetState.status === "generating") {
      //   dispatch(setSheetStatus("idle"));
      // }
    }
  }, [
    chatData?.shouldSetGenerating,
    chatData?.isIncomplete,
    isLoadingHistory,
    currentChatId,
    sheetState.activeChatIdForPolling,
  ]);

  // Cleanup effect when component unmounts or chat changes:
  useEffect(() => {
    return () => {
      // Cleanup: if this was the active chat for polling, clear it
      if (sheetState.activeChatIdForPolling === currentChatId) {
        dispatch(setActiveSheetIdForPolling(null));
        dispatch(setSheetStatus("idle"));
        // sessionStorage.removeItem("activeChatId");
      }
    };
  }, [currentChatId, dispatch]);
  // RTK Query hook with conditional polling ENDS

  // Initialization and other useEffect hooks remain unchanged
  useEffect(() => {
    const initializeComponent = async () => {
      if (initializationAttemptedRef.current) return;
      initializationAttemptedRef.current = true;

      try {
        const token = localStorage.getItem("sheetai-token");
        if (!token) {
          router.push("/");
          throw new Error("Please log to use this service.");
        }
        setSheetAiToken(token);
        setIsInitialized(true);
        dispatch(setSheetStatus("idle"));
      } catch (error) {
        console.error("Initialization error:", error);
        setError(error.message);
        setIsInitialized(false);
      }
    };
    initializeComponent();
  }, [dispatch, currentChatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const processInitialPrompt = async () => {
      if (
        !isInitialized ||
        isLoading ||
        initialPromptProcessedRef.current ||
        !sheetAiToken
      ) {
        return;
      }
      const initialPrompt = sessionStorage.getItem("initialSheetPrompt");
      if (initialPrompt && initialPrompt.trim()) {
        console.log("Processing initial prompt:", initialPrompt);
        initialPromptProcessedRef.current = true;
        try {
          await handleMessage(initialPrompt);
        } catch (error) {
          console.error("Failed to process initial prompt:", error);
          initialPromptProcessedRef.current = false;
          setError("Failed to process initial request. Please try again.");
        } finally {
          sessionStorage.removeItem("initialSheetPrompt");
        }
      }
    };
    processInitialPrompt();
  }, [isInitialized, sheetAiToken]);

  // Handle chat history data changes
  useEffect(() => {
    // if(isLoading) return;
    if (!chatData) return; // nothing loaded yet
    if (!hasAnyConversation) return; // <— skip the “empty payload”

    const {
      conversations,
      shouldSetGenerating,
      recommendedStatus,
      lastConversation,
    } = chatData;

    const convertedMessages = [];

    const isActiveGen =
      sheetState.status === "generating" &&
      sheetState.activeChatIdForPolling === currentChatId;

    if (!isActiveGen) {
      dispatch(setSheetStatus(recommendedStatus));
    }

    // if (chatData.isIncomplete) {
    //   dispatch(setSheetStatus("generating"));
    // } else if (recommendedStatus === "completed") {
    //   dispatch(setSheetStatus("completed"));
    // } else if (recommendedStatus === "error") {
    //   dispatch(setSheetStatus("error"));
    // } else if (recommendedStatus === "cancelled") {
    //   dispatch(setSheetStatus("cancelled"));
    // }

    // Set Redux status based on API analysis
    // dispatch(setSheetStatus(recommendedStatus));

    // Add reconnection message if needed
    if (shouldSetGenerating) {
      const hasReconnectMessage = messages.some((msg) =>
        msg.id.includes("reconnecting")
      );
      // Uncomment if you want reconnection message
      // if (!hasReconnectMessage) {
      //   convertedMessages.push({
      //     id: `reconnecting-${Date.now()}`,
      //     message: "Reconnecting to generation in progress...",
      //     isUser: false,
      //     timestamp: new Date().toISOString(),
      //     type: "info",
      //   });
      // }
    }

    // Create save points structure
    const savePoints = conversations.map((item) => ({
      id: `savepoint-${item._id}`,
      title: item.prompt.substring(0, 50) + "...",
      prompt: item.prompt,
      timestamp: item.createdAt,
      generations: [
        {
          id: `gen-${item._id}`,
          title: "Generation 1",
          timestamp: item.updatedAt || item.createdAt,
          sheetData: item.response?.rows || null,
          status: item.response?.rows
            ? "completed"
            : shouldSetGenerating && item._id === lastConversation.id
            ? "generating"
            : "error",
          message: item.response?.rows
            ? "Sheet generated successfully"
            : shouldSetGenerating && item._id === lastConversation.id
            ? "Resuming generation..."
            : "No data generated",
          metadata: item.response?.metadata,
        },
      ],
      activeGenerationId: `gen-${item._id}`,
    }));

    // Dispatch to Redux
    dispatch({
      type: "sheet/initializeSavePoints",
      payload: {
        savePoints,
        activeSavePointId:
          savePoints.length > 0 ? savePoints[savePoints.length - 1].id : null,
      },
    });

    // Convert to messages
    conversations.forEach((item) => {
      convertedMessages.push({
        id: `user-${item._id}`,
        message: item.prompt,
        isUser: true,
        timestamp: item.createdAt,
      });

      if (item.events) {
        item.events.forEach((stepEvent) => {
          convertedMessages.push({
            id: `ai-${stepEvent._id}`,
            message: stepEvent.message,
            timestamp: stepEvent.timestamp,
            isUser: false,
          });
        });
      }

      // Set sheet data and title for completed conversations
      if (item.response?.rows && recommendedStatus === "completed") {
        dispatch(setSheetData(item.response.rows));
        dispatch(setSheetTitle(item.prompt.substring(0, 50) + "..."));
      }
    });

    // setMessages(convertedMessages);

    setMessages((prevMessages) => {
      const userMessageIds = new Set(convertedMessages.map((m) => m.id));
      const preservedMessages = prevMessages.filter(
        (m) => !userMessageIds.has(m.id)
      );
      return [...preservedMessages, ...convertedMessages];
    });
  }, [chatData, dispatch]);

  // Handle completion detection
  // useEffect(() => {
  //   if (!chatData?.isIncomplete && sheetState.status === "generating") {
  //     // Generation completed, add success message
  //     const lastConversation =
  //       chatData?.conversations?.[chatData.conversations.length - 1];
  //     if (lastConversation?.response?.rows) {
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           id: `completed-${Date.now()}`,
  //           message: "Sheet generation completed successfully!",
  //           isUser: false,
  //           timestamp: new Date().toISOString(),
  //           type: "success",
  //         },
  //       ]);
  //     }
  //   }
  // }, [chatData?.isIncomplete, sheetState.status]);

  // const loadChatHistory = async (chatId, token) => {
  //   if (!chatId || isLoadingHistory) return;
  //   setIsLoadingHistory(true);
  //   dispatch(setSheetStatus("generating"));
  //   dispatch(setSheetData(null));
  //   try {
  //     const response = await fetch(
  //       `https://sheetai.pixigenai.com/api/conversation/get_chat_conversations/${chatId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error(`Failed to load chat history: ${response.status}`);
  //     }
  //     const historyData = await response.json();
  //     const convertedMessages = [];

  //     // Create save points structure
  //     const savePoints = historyData.map((item, index) => ({
  //       id: `savepoint-${item._id}`,
  //       title: item.prompt.substring(0, 50) + "...",
  //       prompt: item.prompt,
  //       timestamp: item.createdAt,
  //       generations: [
  //         {
  //           id: `gen-${item._id}`,
  //           title: "Generation 1",
  //           timestamp: item.updatedAt || item.createdAt,
  //           sheetData: item.response?.rows || null,
  //           status: item.response?.rows ? "completed" : "error",
  //           message: item.response?.rows
  //             ? "Sheet generated successfully"
  //             : "No data generated",
  //           metadata: item.response?.metadata,
  //         },
  //       ],
  //       activeGenerationId: `gen-${item._id}`,
  //     }));

  //     // Dispatch to Redux to initialize save points
  //     dispatch({
  //       type: "sheet/initializeSavePoints",
  //       payload: {
  //         savePoints,
  //         activeSavePointId:
  //           savePoints.length > 0 ? savePoints[savePoints.length - 1].id : null,
  //       },
  //     });

  //     historyData.forEach((item) => {
  //       convertedMessages.push({
  //         id: `user-${item._id}`,
  //         message: item.prompt,
  //         isUser: true,
  //         timestamp: item.createdAt,
  //       });
  //       if (item.events) {
  //         item.events?.map((stepEvent) => {
  //           convertedMessages.push({
  //             id: `ai-${stepEvent._id}`,
  //             message: stepEvent.message,
  //             timestamp: stepEvent.timestamp,
  //             isUser: false,
  //           });
  //         });
  //       }

  //       if (item.response) {
  //         if (item.response.rows && item.response.columns) {
  //           // metadata = item.response.metadata;
  //           dispatch(setSheetData(item.response.rows));
  //           dispatch(setSheetTitle(item.prompt.substring(0, 50) + "..."));
  //           dispatch(setSheetStatus("completed"));
  //         }
  //       }
  //     });
  //     setChatHistory(convertedMessages);
  //     setMessages(convertedMessages);
  //   } catch (error) {
  //     console.error("Failed to load chat history:", error);
  //   } finally {
  //     setIsLoadingHistory(false);
  //   }
  // };

  const handleMessage = async (messageText = inputValue) => {
    if (!messageText.trim() || isLoading || !sheetAiToken) {
      return;
    }

    console.log("generating");
    setError(null);
    setIsLoading(true);
    dispatch(setSheetStatus("generating"));
    sessionStorage.setItem("activeChatId", currentChatId);
    dispatch(setActiveSheetIdForPolling(currentChatId));

    // Create user message with a predictable ID
    const userMessageId = `user-${Date.now()}`;
    const userMessage = {
      id: userMessageId,
      message: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      await handleSheetGeneration(messageText, currentChatId, userMessageId);
    } catch (error) {
      console.error("Failed to process message:", error);
      const errorMessage =
        error.message || "Failed to generate sheet. Please try again.";
      setError(errorMessage);
      dispatch(setSheetStatus("error"));

      // Remove the user message that failed to process
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessageId));

      // Show toast notification
      setToast({
        open: true,
        message:
          "Your message couldn't be processed. Please try rephrasing your request.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // THIS PART IS ONLY FOR SIMULATION STARTS

  const s_id = searchParams.get("s_id"); // simulation id
  const token = localStorage.getItem("sheetai-token");

  useEffect(() => {
    const runSimulation = async () => {
      // Only run simulation if we have s_id and component is properly initialized
      if (!s_id || !isInitialized || !sheetAiToken || isLoading) {
        return;
      }

      // Check if simulation has already been processed
      const simulationKey = `simulation-processed-${s_id}`;
      if (sessionStorage.getItem(simulationKey)) {
        console.log("Simulation already processed for s_id:", s_id);
        return;
      }

      // Mark simulation as being processed
      sessionStorage.setItem(simulationKey, "true");

      try {
        // Get simulation prompt
        const simulationPrompt = getSimulationPrompt(s_id); 

        if (!simulationPrompt) {
          console.error("No simulation prompt found for s_id:", s_id);
          return;
        }

        console.log("Running simulation with s_id:", s_id);

        // Set loading state
        setError(null);
        setIsLoading(true);
        dispatch(setSheetStatus("generating"));
        dispatch(setActiveSheetIdForPolling(currentChatId));

        // Create user message for simulation
        const userMessage = {
          id: `user-simulation-${s_id}-${Date.now()}`,
          message: simulationPrompt,
          isUser: true,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);

        // Run the sheet generation
        await handleSheetGeneration(
          simulationPrompt,
          currentChatId,
          userMessage.id
        );
      } catch (error) {
        console.error("Simulation failed:", error);
        setError("Simulation failed to run. Please try again.");
        dispatch(setSheetStatus("error"));
      } finally {
        setIsLoading(false);
      }
    };

    runSimulation();
  }, [s_id, isInitialized, sheetAiToken, currentChatId]);

  // Helper function to get simulation prompt based on s_id
  const getSimulationPrompt = (simulationId) => {
    // You can either:
    // 1. Have predefined prompts based on simulation ID
    const simulationPrompts = {
      "6899c971364813eab1a0a0ce": "Compare pricing of top 10 gyms in a sheet",
      "6899caacfe89e52d02b85587": "List top 5 Italian restaurants with ratings",
      "6899cba7364813eab1a0a104": "Generate 10 school and contact notes",
    };

    return simulationPrompts[simulationId] || null;
  };

  // THIS PART IS ONLY FOR SIMULATION ENDS

  // Updated handleSheetGeneration to show each SSE step
  const handleSheetGeneration = async (prompt, chatId, userMessageId) => {
    try {
      abortControllerRef.current = new AbortController();
      const response = await fetch(
        "https://sheetai.pixigenai.com/api/conversation/create_conversation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${sheetAiToken}`,
            Authorization: `Bearer ${token}`, // only for simulation
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            prompt: prompt,
            chat: chatId,
            ...(s_id && {isSimulated: true}),
            isSimulated: s_id ? true : false, // only for simulation
            ...(s_id && {simulatedChat: s_id}), // only for simulation
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      // console.log(response.body, "response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      // console.log(decoder, "decoder");
      let buffer = "";
      let hasReceivedData = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        hasReceivedData = true;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);

            // Check for validation error first
            if (data?.data?.error) {
              console.log(
                "Validation error detected, removing user message and showing toast"
              );

              // Remove the user message that couldn't be processed
              setMessages((prev) =>
                prev.filter((msg) => msg.id !== userMessageId)
              );

              // Show meaningful toast notification
              setToast({
                open: true,
                message:
                  data.data.error.message ||
                  "Your request couldn't be processed. Please provide more specific details about the spreadsheet you want to create.",
                severity: "warning",
              });

              setIsLoading(false);
              dispatch(setSheetStatus("completed"));
              dispatch(setActiveSheetIdForPolling(null));
              setShouldPoll(false);
              reader.cancel();
              return;
            }

            // Handle step-based messages (excluding validation_error since we handle it above)
            if (
              data.step &&
              data.step !== "completed" &&
              data.step !== "validation_error"
            ) {
              const stepMessage = getStepMessage(data.step, data.data);
              if (stepMessage) {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `step-${data.step}-${Date.now()}`,
                    message: stepMessage,
                    isUser: false,
                    timestamp: data.timestamp,
                    type: "info",
                  },
                ]);
              }
            }

            // Handle completion step. [FOR PRODUCTION]
            // else if (data.step === "completed") {
            //   const responseData = data?.data?.data;
            //   console.log(responseData, "data from SSE");

            //   const stepMessage = getStepMessage(data.step, data.data);
            //   if (stepMessage) {
            //     setMessages((prev) => [
            //       ...prev,
            //       {
            //         id: `step-${data.step}-${Date.now()}`,
            //         message: stepMessage,
            //         isUser: false,
            //         timestamp: data.timestamp,
            //         type: "info",
            //       },
            //     ]);
            //   }

            //   if (
            //     responseData?.response?.columns &&
            //     responseData?.response?.rows
            //   ) {
            //     // Update Redux store with sheet data
            //     dispatch(setSheetData(responseData.response.rows));
            //     dispatch(
            //       setSheetTitle(responseData.prompt.substring(0, 50) + "...")
            //     );
            //     dispatch(setSheetStatus("completed"));

            //     // Show success toast
            //     setToast({
            //       open: true,
            //       message: "Spreadsheet generated successfully!",
            //       severity: "success",
            //     });

            //     const newSavePoint = {
            //       id: `savepoint-${responseData._id}`,
            //       title: responseData.prompt.substring(0, 50) + "...",
            //       prompt: responseData.prompt,
            //       timestamp: responseData.createdAt,
            //       generations: [
            //         {
            //           id: `gen-${responseData._id}`,
            //           title: "Generation 1",
            //           timestamp:
            //             responseData.updatedAt || responseData.createdAt,
            //           sheetData: responseData.response.rows,
            //           status: "completed",
            //           message: "Sheet generated successfully",
            //           metadata: responseData.response.metadata,
            //         },
            //       ],
            //       activeGenerationId: `gen-${responseData._id}`,
            //     };

            //     dispatch({
            //       type: "sheet/addSavePoint",
            //       payload: newSavePoint,
            //     });
            //   }
            // }

            // FOR SIMULATION
            else if (data.step === "completed") {
              // First completed step - just has message
              if (data.data?.message && !data.data?.columns && !data.data?.rows) {
                const stepMessage = data.data.message;
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `step-${data.step}-message-${Date.now()}`,
                    message: stepMessage,
                    isUser: false,
                    timestamp: data.timestamp,
                    type: "info",
                  },
                ]);
              }
              
              // Second completed step - has the actual data
              else if (data.data?.columns && data.data?.rows) {
                console.log("Received actual sheet data:", data.data);
        
                // Update Redux store with sheet data
                dispatch(setSheetData(data.data.rows));
                dispatch(setSheetTitle(prompt.substring(0, 50) + "..."));
                dispatch(setSheetStatus("completed"));
        
                // Show success toast
                setToast({
                  open: true,
                  message: "Spreadsheet generated successfully!",
                  severity: "success",
                });
        
                // Create save point with the actual conversation data
                const conversationId = data.conversation;
                const chatId = data.chat;
                
                const newSavePoint = {
                  id: `savepoint-${conversationId}`,
                  title: prompt.substring(0, 50) + "...",
                  prompt: prompt,
                  timestamp: data.timestamp,
                  generations: [
                    {
                      id: `gen-${conversationId}`,
                      title: "Generation 1",
                      timestamp: data.timestamp,
                      sheetData: data.data.rows,
                      status: "completed",
                      message: "Sheet generated successfully",
                      metadata: data.data.metadata,
                    },
                  ],
                  activeGenerationId: `gen-${conversationId}`,
                };
        
                dispatch({
                  type: "sheet/addSavePoint",
                  payload: newSavePoint,
                });
        
                // Add final success message
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `final-success-${Date.now()}`,
                    message: `Successfully generated a ${data.data.metadata?.totalRows || 'spreadsheet'} with ${data.data.metadata?.columnCount || data.data.columns?.length || 'multiple'} columns!`,
                    isUser: false,
                    timestamp: data.timestamp,
                    type: "success",
                    metadata: data.data.metadata,
                  },
                ]);
              }
            }
          } catch (error) {
            console.error("Error parsing SSE data:", error, "Line:", line);
          }
        }
      }

      if (!hasReceivedData) {
        throw new Error("No data received from server");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Streaming aborted by user");
        return;
      }
      throw error;
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      dispatch(setSheetStatus("cancelled"));
      setMessages((prev) => [
        ...prev,
        {
          id: `cancelled-${Date.now()}`,
          message: "Generation cancelled by user.",
          isUser: false,
          timestamp: new Date().toISOString(),
          type: "info",
        },
      ]);
    }
  };

  const clearError = () => {
    setError(null);
    dispatch(setSheetStatus("completed"));
  };

  useEffect(() => {
    if (toast.open) {
      const timer = setTimeout(() => {
        setToast({ ...toast, open: false });
      }, 6000); // Hide after 6 seconds

      return () => clearTimeout(timer);
    }
  }, [toast.open]);

  if (!isInitialized && error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Make sure you are logged in.
            </Typography>
          </Box>
        </Alert>
      </Box>
    );
  }

  if (!isInitialized || isLoadingHistory) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress size={24} sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          {isLoadingHistory
            ? "Loading chat history..."
            : "Initializing Sheet AI..."}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderRight: "1px solid #e0e0e0",
          bgcolor: theme.palette.background.default,
          overflow: "hidden",
        }}
      >
        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error" onClose={clearError}>
              {error}
            </Alert>
          </Box>
        )}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: "3px",
              "&:hover": { background: "#a8a8a8" },
            },
            scrollbarWidth: "thin",
            scrollbarColor: "#c1c1c1 transparent",
          }}
        >
          <Box sx={{ p: 3 }}>
            {messages.length === 0 && !isLoadingHistory ? (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Welcome to Sheet Generator
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Describe what kind of spreadsheet you'd like to create.
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Example: "Create a budget tracker for personal expenses" or
                  "Generate a student grade sheet"
                </Typography>
              </Box>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message.message}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                    type={message.type}
                    metadata={message.metadata}
                    theme={theme}
                  />
                ))}
                {(isLoading ||
                  sheetState.status === "generating" ||
                  chatData?.isIncomplete) && (
                  <TypingAnimation
                    text={
                      chatData?.isIncomplete
                        ? "Generating"
                        : isLoading || sheetState.status === "generating"
                        ? "Generating"
                        : "Process failed"
                    }
                  />
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </Box>
        </Box>
        <Box
          sx={{
            borderTop: "1px solid #e0e0e0",
            bgcolor: "white",
            flexShrink: 0,
          }}
        >
          <InputArea
            currentAgentType={currentAgentType}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSend={handleMessage}
            isLoading={isLoading || sheetState.status === "generating"}
            disabled={
              !isInitialized ||
              isLoading ||
              !sheetAiToken ||
              sheetState.status === "generating"
            }
            placeholder={
              !isInitialized
                ? "Initializing..."
                : !sheetAiToken
                ? "Authentication required..."
                : isLoading || sheetState.status === "generating"
                ? "Generating sheet..."
                : "Describe the spreadsheet you want to create..."
            }
          />
        </Box>
      </Box>

      {toast.open && (
        <Box
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            maxWidth: "400px",
            minWidth: "300px",
          }}
        >
          <Alert
            severity={toast.severity}
            onClose={() => setToast({ ...toast, open: false })}
            sx={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              borderRadius: "8px",
              "& .MuiAlert-message": {
                fontSize: "0.875rem",
              },
            }}
          >
            {toast.message}
          </Alert>
        </Box>
      )}
    </>
  );
}