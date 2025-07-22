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
import InputArea from "../presentation/InputArea";
import {
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
              color="text.disabled"
              sx={{ fontSize: "0.7rem" }}
            >
              {new Date(timestamp).toLocaleTimeString()}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
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
              boxShadow: 'none',
              bgcolor: "#FAFAFA"
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

// StatusIndicator (unchanged, but included for completeness)
const StatusIndicator = ({ isLoading, error, sheetStatus }) => {
  if (error) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "error.main",
          }}
        />
        <Typography variant="caption" color="error">
          Error occurred
        </Typography>
      </Box>
    );
  }
  if (isLoading || sheetStatus === "generating") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={8} />
        <Typography variant="caption" color="primary">
          Generating sheet...
        </Typography>
      </Box>
    );
  }
  if (sheetStatus === "completed") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "success.main",
          }}
        />
        <Typography variant="caption" color="success.main">
          Sheet generated successfully
        </Typography>
      </Box>
    );
  }
  if (sheetStatus === "cancelled") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "warning.main",
          }}
        />
        <Typography variant="caption" color="warning.main">
          Generation cancelled
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: "success.main",
        }}
      />
      <Typography variant="caption" color="text.secondary">
        Ready
      </Typography>
    </Box>
  );
};

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
  };

  return stepMessages[step] || `Processing step: ${step}...`;
};

// Main SheetChatArea component
export default function SheetChatArea({ currentAgentType }) {
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
    pollingInterval: shouldPoll ? 3000 : 0,
    refetchOnMountOrArgChange: true,
  });

  // Effect to control polling based on data completeness
  useEffect(() => {
    if (chatData?.shouldSetGenerating && !isLoadingHistory) {
      setShouldPoll(true);
    } else {
      setShouldPoll(false);
    }
  }, [chatData?.shouldSetGenerating, isLoadingHistory]);
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
    if (!chatData || !chatData.conversations) return;

    const {
      conversations,
      shouldSetGenerating,
      recommendedStatus,
      lastConversation,
    } = chatData;

    const convertedMessages = [];

    // Set Redux status based on API analysis
    dispatch(setSheetStatus(recommendedStatus));

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

    setMessages(convertedMessages);
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
    const userMessage = {
      id: `user-${Date.now()}`,
      message: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    dispatch(setSheetStatus("generating"));
    // dispatch(setSheetData(null));
    try {
      await handleSheetGeneration(messageText, currentChatId);
    } catch (error) {
      console.error("Failed to process message:", error);
      const errorMessage =
        error.message || "Failed to generate sheet. Please try again.";
      setError(errorMessage);
      dispatch(setSheetStatus("error"));
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          message: errorMessage,
          isUser: false,
          timestamp: new Date().toISOString(),
          type: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Updated handleSheetGeneration to show each SSE step
  const handleSheetGeneration = async (prompt, chatId) => {
    try {
      abortControllerRef.current = new AbortController();
      const response = await fetch(
        "https://sheetai.pixigenai.com/api/conversation/create_conversation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sheetAiToken}`,
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            prompt: prompt,
            chat: chatId,
          }),
          signal: abortControllerRef.current.signal,
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let hasReceivedData = false;

      console.log(response.body, "response body");

      while (true) {
        const { value, done } = await reader.read();
        console.log(value, "stream value");
        if (done) break;
        hasReceivedData = true;
        buffer += decoder.decode(value, { stream: true });
        buffer += decoder.decode();
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);

            // Handle step-based messages
            if (data.step && data.step !== "completed") {
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

            // Handle completion step
            else if (data.step === "completed") {
              const responseData = data?.data?.data; // Note the nested structure
              console.log(responseData, "data from SSE");

              if (
                responseData?.response?.columns &&
                responseData?.response?.rows
              ) {
                // Update Redux store with sheet data
                dispatch(setSheetData(responseData.response.rows));
                dispatch(
                  setSheetTitle(responseData.prompt.substring(0, 50) + "...")
                );
                dispatch(setSheetStatus("completed"));

                const newSavePoint = {
                  id: `savepoint-${responseData._id}`,
                  title: responseData.prompt.substring(0, 50) + "...",
                  prompt: responseData.prompt,
                  timestamp: responseData.createdAt,
                  generations: [
                    {
                      id: `gen-${responseData._id}`,
                      title: "Generation 1",
                      timestamp:
                        responseData.updatedAt || responseData.createdAt,
                      sheetData: responseData.response.rows,
                      status: "completed",
                      message: "Sheet generated successfully",
                      metadata: responseData.response.metadata,
                    },
                  ],
                  activeGenerationId: `gen-${responseData._id}`,
                };

                dispatch({
                  type: "sheet/addSavePoint",
                  payload: newSavePoint,
                });
              }
            }

            // Handle final response object (the one without "step" property)
            else if (!data.step && data._id && data.response) {
              // This is the final response object, we can ignore it since we already processed it in the "completed" step. OR do something later
              // console.log("Final response object received:", data);
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
    dispatch(setSheetStatus("idle"));
  };

  // Use it to show user specific chats
  const getUserChats = async () => {
    try {
      if (!sheetAiToken) return [];
      const response = await fetch(
        "https://sheetai.pixigenai.com/api/chat/get_my_chats",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sheetAiToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user chats");
      }
      const chats = await response.json();
      return chats;
    } catch (error) {
      console.error("Failed to get user chats:", error);
      return [];
    }
  };

  if (!isInitialized && error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption">
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRight: "1px solid #e0e0e0",
        bgcolor: "#fafafa",
        overflow: "hidden",
      }}
    >
      {/* Sheet header if needed */}
      {/* <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", bgcolor: "white" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Sheet Generator
          </Typography>
          {(isLoading || sheetState.status === "generating") && (
            <IconButton
              size="small"
              onClick={handleStopStreaming}
              color="error"
            >
              <Stop />
            </IconButton>
          )}
        </Box>
        <StatusIndicator
          isLoading={isLoading}
          error={error}
          sheetStatus={sheetState.status}
        />
      </Box> */}
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
  );
}