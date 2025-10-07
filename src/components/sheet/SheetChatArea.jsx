import PersonIcon from "@mui/icons-material/Person";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSnackbar from "../../hooks/useSnackbar";
import { useGetChatHistoryQuery } from "../../redux/api/sheet/sheetApi";
import {
  selectSheet,
  setActiveSheetIdForPolling,
  setSheetData,
  setSheetStatus,
  setSheetTitle,
} from "../../redux/slice/sheetSlice";
import TypingAnimation from "../common/TypingAnimation";
import InputArea from "../presentation/InputAreas";
import MetadataDisplay from "./MetaDataDisplay";
import { FooterCta } from "./SheetAgentPage";

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
              {/* {new Date(timestamp).toLocaleTimeString()} */}
              {new Date(timestamp).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
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
              {/* {new Date(timestamp).toLocaleTimeString()} */}
              {new Date(timestamp).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Typography>
          </Box>
          <Paper
            elevation={1}
            sx={{
              boxShadow: "none",
              bgcolor:
                // theme.palette.mode === "dark"
                theme.palette.background.default,
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
    validation_error:
      data?.error?.message ||
      "Your requested prompt is not contextual enough. Please try again with more details.",
  };

  return stepMessages[step] || `Processing step: ${step}...`;
};

// Main SheetChatArea component
export default function SheetChatArea({
  currentAgentType,
  theme,
  // isMobile,
  // these are for preview panel on mobile devices
  handlePreviewOpen,
}) {
  const dev_mode = process.env.NODE_ENV === "development";
  const dispatch = useDispatch();
  const sheetState = useSelector(selectSheet);
  // console.log(sheetState, "sheet state");
  const { accessToken: sheetAiToken } = useSelector((state) => state.auth); // Naming it for better understanding, sheet service uses accesstoken
  const searchParams = useSearchParams();
  const currentChatId = searchParams.get("id");
  const router = useRouter();
  const enqueueSnackbar = useSnackbar();

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  // const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [shouldPoll, setShouldPoll] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [showModal, setShowModal] = useState(false);
  const [simulationCompleted, setSimulationCompleted] = useState(false);
  const s_id = searchParams.get("s_id"); // simulation id

  // Determine the actual chat ID to use
  const actualChatId = s_id || currentChatId;
  const isSimulationMode = Boolean(s_id);

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
    skip: !currentChatId || (!sheetAiToken && !isSimulationMode), // when we have s_id -> simulation Id we don't need this query.
    pollingInterval:
      shouldPoll && sheetState.activeChatIdForPolling === actualChatId
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

    const isTarget = sheetState.activeChatIdForPolling === actualChatId;

    if (actualChatId && chatData?.isIncomplete) {
      if (!isTarget) {
        dispatch(setActiveSheetIdForPolling(actualChatId));
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
    actualChatId,
    sheetState.activeChatIdForPolling,
  ]);

  // Cleanup effect when component unmounts or chat changes:
  useEffect(() => {
    return () => {
      // Cleanup: if this was the active chat for polling, clear it
      if (sheetState.activeChatIdForPolling === actualChatId) {
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

      // For simulation mode, no token required - initialize directly
      if (isSimulationMode) {
        setIsInitialized(true);
        dispatch(setSheetStatus("generating"));
        return;
      }

      try {
        if (!sheetAiToken) {
          router.push("/");
          enqueueSnackbar("Please log in to use this service.", {
            variant: "error",
          });
        }
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
        !sheetAiToken ||
        isSimulationMode
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
  }, [isInitialized, sheetAiToken, isSimulationMode]);

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
        msg.id.includes("reconnecting"),
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
        (m) => !userMessageIds.has(m.id),
      );
      return [...preservedMessages, ...convertedMessages];
    });

    // for simulation only
    if (s_id) {
      setSimulationCompleted(true);
    }
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

  const handleSimulationGeneration = async (simulationChatId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX}/sheet/conversation/simulate_conversation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          chat: simulationChatId, // This will be the s_id from URL
        }),
        signal: abortControllerRef.current.signal,
      },
    );
    return response;
  };

  const handleUserSheetGeneration = async (prompt, chatId, token) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX}/sheet/conversation/create_conversation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          prompt: prompt,
          chat: chatId,
        }),
        signal: abortControllerRef.current.signal,
      },
    );
    return response;
  };

  const handleMessage = async (messageText = inputValue) => {
    if (
      !messageText.trim() ||
      isLoading ||
      (!isSimulationMode && !sheetAiToken)
    ) {
      return;
    }

    console.log("generating");
    setError(null);
    setIsLoading(true);
    dispatch(setSheetStatus("generating"));
    sessionStorage.setItem("activeChatId", actualChatId);
    dispatch(setActiveSheetIdForPolling(actualChatId));

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
      await handleSheetGeneration(messageText, actualChatId, userMessageId);
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
  useEffect(() => {
    const runSimulation = async () => {
      // Only run simulation if we have s_id and component is properly initialized
      if (!isSimulationMode || !isInitialized || isLoading) {
        return;
      }

      // Check if simulation has already been processed
      // const simulationKey = `simulation-processed-${s_id}`;
      // if (sessionStorage.getItem(simulationKey)) {
      //   console.log("Simulation already processed for s_id:", s_id);
      //   return;
      // }

      // Mark simulation as being processed
      // sessionStorage.setItem(simulationKey, "true");

      try {
        // Set loading state
        setError(null);
        setIsLoading(true);
        dispatch(setSheetStatus("generating"));
        dispatch(setActiveSheetIdForPolling(actualChatId));

        // const prompt = dev_mode ? getSimulationPromptDev(actualChatId) : getSimulationPromptProd(actualChatId);
        const prompt = getSimulationPrompt(actualChatId);

        // Create user message for simulation
        const userMessage = {
          id: `user-simulation-${s_id}-${Date.now()}`,
          message: prompt,
          isUser: true,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);

        // Run the sheet generation
        await handleSheetGeneration(prompt, actualChatId, userMessage.id);
      } catch (error) {
        console.error("Simulation failed:", error);
        setError("Simulation failed to run. Please try again.");
        dispatch(setSheetStatus("error"));
      } finally {
        setIsLoading(false);
      }
    };

    runSimulation();
  }, [isSimulationMode, isInitialized, actualChatId]);

  const getSimulationPrompt = (simulationId) => {
    const simulationPrompts = {
      "68c92076dc985a1ee342aa72":
        "Compare pricing of top 10 gyms of the world in a sheet",
      "68c9237adc985a1ee342aa75": "List top 5 Italian restaurants with ratings",
      "68c926eedc985a1ee342aa77": "Generate 10 school and contact notes",
    };

    return simulationPrompts[simulationId] || null;
  };

  // THIS PART IS ONLY FOR SIMULATION ENDS

  // Updated handleSheetGeneration to show each SSE step
  const handleSheetGeneration = async (prompt, chatId, userMessageId) => {
    try {
      abortControllerRef.current = new AbortController();
      const response = isSimulationMode
        ? await handleSimulationGeneration(actualChatId) // Using s_id for simulation
        : await handleUserSheetGeneration(prompt, actualChatId, sheetAiToken); // Using id for user specific prompt

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

            console.log(data, "SSE data");

            // Check for validation error first
            if (data?.data?.error) {
              console.log(
                "Validation error detected, removing user message and showing toast",
              );

              // Remove the user message that couldn't be processed
              setMessages((prev) =>
                prev.filter((msg) => msg.id !== userMessageId),
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
              console.log("Processing step:", data);

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
              console.log("Final completion data:", data);
              // First completed step - just has message
              if (
                data.data?.message &&
                !data.data?.columns &&
                !data.data?.rows
              ) {
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
              } else if (
                data.data?.columns.length > 0 &&
                data.data?.rows.length > 0
              ) {
                // Update Redux store with sheet data
                dispatch(setSheetData(data.data?.rows));
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
                  timestamp:
                    data?.updatedAt ||
                    data.timestamp ||
                    new Date().toISOString(),
                  generations: [
                    {
                      id: `gen-${conversationId}`,
                      title: "Generation 1",
                      timestamp:
                        data?.updatedAt ||
                        data.timestamp ||
                        new Date().toISOString(),
                      sheetData: data.response?.rows,
                      status: "completed",
                      message: "Sheet generated successfully",
                      metadata: data.response?.metadata,
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
                    message: `Successfully generated a ${
                      data.response?.metadata?.totalRows || "spreadsheet"
                    } with ${
                      data.response?.metadata?.columnCount ||
                      data.response?.columns?.length ||
                      "multiple"
                    } columns!`,
                    isUser: false,
                    timestamp:
                      data?.updatedAt ||
                      data.timestamp ||
                      new Date().toISOString(),
                    type: "success",
                    metadata: data.response?.metadata,
                  },
                ]);

                // for simulation only
                if (s_id) {
                  setSimulationCompleted(true);
                }
              }
            }
            // Lastly step - has the actual data || New update simulation doesn't sending data separately
            else if (!data.step) {
              console.log("Received actual sheet data:", data.data);

              // Update Redux store with sheet data
              dispatch(setSheetData(data.response?.rows));
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
                timestamp:
                  data?.updatedAt || data.timestamp || new Date().toISOString(),
                generations: [
                  {
                    id: `gen-${conversationId}`,
                    title: "Generation 1",
                    timestamp:
                      data?.updatedAt ||
                      data.timestamp ||
                      new Date().toISOString(),
                    sheetData: data.response?.rows,
                    status: "completed",
                    message: "Sheet generated successfully",
                    metadata: data.response?.metadata,
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
                  message: `Successfully generated a ${
                    data.response?.metadata?.totalRows || "spreadsheet"
                  } with ${
                    data.response?.metadata?.columnCount ||
                    data.response?.columns?.length ||
                    "multiple"
                  } columns!`,
                  isUser: false,
                  timestamp:
                    data?.updatedAt ||
                    data.timestamp ||
                    new Date().toISOString(),
                  type: "success",
                  metadata: data.response?.metadata,
                },
              ]);

              // for simulation only
              if (s_id) {
                setSimulationCompleted(true);
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
      console.error("Sheet generation error:", error);

      if (error.name === "AbortError") {
        console.log("Streaming aborted by user");
        // Clean up UI state for user cancellation
        dispatch(setSheetStatus("cancelled"));
        setMessages((prev) => [
          ...prev,
          {
            id: `cancelled-${Date.now()}`,
            message: "Generation was cancelled.",
            isUser: false,
            timestamp: new Date().toISOString(),
            type: "info",
          },
        ]);
        return;
      }

      // Handle different types of errors gracefully
      let errorMessage =
        "Something went wrong while generating your spreadsheet.";
      let errorType = "error";

      // Network errors
      if (
        error.message.includes("fetch") ||
        error.message.includes("Failed to fetch")
      ) {
        errorMessage =
          "Connection lost. Please check your internet and try again.";
        errorType = "warning";
      }
      // Server errors
      else if (error.message.includes("Server error")) {
        errorMessage =
          "Server is temporarily unavailable. Please try again in a moment.";
        errorType = "warning";
      }
      // Timeout errors
      else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try with a simpler request.";
        errorType = "warning";
      }
      // Parsing errors
      else if (
        error.message.includes("JSON") ||
        error.message.includes("parsing")
      ) {
        errorMessage =
          "Received invalid response from server. Please try again.";
        errorType = "error";
      }
      // Custom error messages from server
      else if (error.message) {
        errorMessage = error.message;
      }

      // Update Redux state
      dispatch(setSheetStatus("error"));
      dispatch(setActiveSheetIdForPolling(null));
      setShouldPoll(false);

      // Remove the failed user message
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessageId));

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          message: errorMessage,
          isUser: false,
          timestamp: new Date().toISOString(),
          type: errorType,
        },
      ]);

      // Show toast notification
      setToast({
        open: true,
        message: errorMessage,
        severity: errorType,
      });

      // Set component error state for additional UI feedback
      setError(errorMessage);
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

  if (!isInitialized && error && !isSimulationMode) {
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
            : isSimulationMode
              ? "Initializing Simulation..."
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
          position: "relative",
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
                  Describe what kind of spreadsheet you&apos;d like to create.
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Example: &quot;Create a budget tracker for personal
                  expenses&quot; or &quot;Generate a student grade sheet&quot;
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
        {/* for simulation only */}
        {isSimulationMode && (
          <Box
            sx={{
              pt: "20px",
            }}
          ></Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {isMobile && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "start",
                gap: "8px",
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                cursor: "pointer",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? theme.palette.action.hover
                    : "#e6f7ee",
              }}
              onClick={handlePreviewOpen}
            >
              <CustomTableChartIcon
                sx={{ color: theme.palette.primary.main, fontSize: 40 }}
              />
              <Box>
                <Typography variant="h6" sx={{ ml: 0.5 }}>
                  Preview Sheet Data
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 0.5 }}
                >
                  Click to open
                </Typography>
              </Box>
            </Box>
          )}
          {!isSimulationMode && (
            <Box
              sx={{
                borderTop: "1px solid #e0e0e0",
                bgcolor: "white",
                flexShrink: 0,
                width: "100%",
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
          )}
        </Box>
        {/* for simulation only */}
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

      {/* footer cta */}
      {/* // for simulation only */}
      {isSimulationMode && simulationCompleted && (
        <FooterCta
          isMobile={isMobile}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
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
