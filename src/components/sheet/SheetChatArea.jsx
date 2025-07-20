import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Send, Stop } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import InputArea from "../presentation/InputArea";
import {
  setSheetData,
  setSheetStatus,
  setSheetTitle,
} from "../../redux/slice/sheetSlice";
import { selectSheet } from "../../redux/slice/sheetSlice";
import { authenticateToSheetService } from "../../libs/sheetUtils";
import { useSearchParams } from "next/navigation";

// Simple message bubble component
const MessageBubble = ({ message, isUser, timestamp, type = "info" }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      mb: 2,
    }}
  >
    <Paper
      elevation={1}
      sx={{
        p: 2,
        maxWidth: "80%",
        bgcolor: isUser
          ? "primary.main"
          : type === "error"
          ? "error.light"
          : type === "success"
          ? "success.light"
          : "grey.100",
        color: isUser
          ? "white"
          : type === "error"
          ? "error.contrastText"
          : type === "success"
          ? "success.contrastText"
          : "text.primary",
        borderRadius: 2,
        borderBottomRightRadius: isUser ? 0 : 2,
        borderBottomLeftRadius: isUser ? 2 : 0,
      }}
    >
      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
        {message}
      </Typography>
      {timestamp && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            opacity: 0.7,
            fontSize: "0.75rem",
          }}
        >
          {new Date(timestamp).toLocaleTimeString()}
        </Typography>
      )}
    </Paper>
  </Box>
);

// Status indicator
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

export default function SheetChatArea({ currentAgentType }) {
  const dispatch = useDispatch();
  const sheetState = useSelector(selectSheet);
  const user = useSelector((state) => state.auth.user);
  const searchParams = useSearchParams();
  const currentChatId = searchParams.get("id");

  // Local state
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sheetAiToken, setSheetAiToken] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const initialPromptProcessedRef = useRef(false);
  const initializationAttemptedRef = useRef(false);

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      if (initializationAttemptedRef.current) return;
      initializationAttemptedRef.current = true;

      try {
        const token = localStorage.getItem("sheetai-token");
        if (!token) {
          throw new Error(
            "No authentication token found. Please log in again."
          );
        }

        setSheetAiToken(token);

        // Load chat history if we have a chat ID
        if (currentChatId) {
          await loadChatHistory(currentChatId, token);
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle initial load from session storage
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
          // Always remove the initial prompt from session storage
          sessionStorage.removeItem("initialSheetPrompt");
        }
      }
    };

    processInitialPrompt();
  }, [isInitialized, sheetAiToken]);

  // Load chat history from API
  const loadChatHistory = async (chatId, token) => {
    if (!chatId || isLoadingHistory) return;

    setIsLoadingHistory(true);
    try {
      const response = await fetch(
        `https://sheetai.pixigenai.com/api/conversation/get_chat_conversations/${chatId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load chat history: ${response.status}`);
      }

      const historyData = await response.json();

      // Convert API response to messages format
      const convertedMessages = [];

      historyData.forEach((item) => {
        // Add user message
        convertedMessages.push({
          id: `user-${item._id}`,
          message: item.prompt,
          isUser: true,
          timestamp: item.createdAt,
        });

        // Add AI response if exists
        if (item.response) {
          let responseMessage = "";

          if (item.response.rows && item.response.columns) {
            // If response contains sheet data
            responseMessage = `✅ Sheet generated successfully with ${item.response.rows.length} rows and ${item.response.columns.length} columns!`;

            // Update Redux store with the latest sheet data
            dispatch(setSheetData(item.response.rows));
            dispatch(setSheetTitle(item.prompt.substring(0, 50) + "..."));
            dispatch(setSheetStatus("completed"));
          } else {
            responseMessage = "Sheet generated successfully!";
          }

          convertedMessages.push({
            id: `ai-${item._id}`,
            message: responseMessage,
            isUser: false,
            timestamp: item.updatedAt,
            type: "success",
          });
        }
      });

      setChatHistory(convertedMessages);
      setMessages(convertedMessages);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      // Don't show error for history loading failure, just log it
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Handle message submission
  const handleMessage = async (messageText = inputValue) => {
    if (!messageText.trim() || isLoading || !sheetAiToken) {
      return;
    }

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
    dispatch(setSheetData(null));

    try {
      // Pass the currentChatId to the generation function
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

  // Handle sheet generation using streaming
  const handleSheetGeneration = async (prompt, chatId) => {
    try {
      // Create abort controller for this request
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
      const decoder = new TextDecoder();
      let buffer = "";
      let hasReceivedData = false;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        hasReceivedData = true;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        // Keep the last incomplete line in buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const data = JSON.parse(line);

            // Add streaming message to UI
            if (data.data?.message || data.message || data.step) {
              setMessages((prev) => [
                ...prev,
                {
                  id: `stream-${Date.now()}-${Math.random()}`,
                  message:
                    data.data?.message || data.message || `Step: ${data.step}`,
                  isUser: false,
                  timestamp: data.timestamp || new Date().toISOString(),
                  type: data.step === "error" ? "error" : "info",
                },
              ]);
            }

            // Handle completion
            if (data.step === "completed" && data.data?.response) {
              const responseData = data.data.response;

              // Update Redux store with sheet data
              if (responseData.columns && responseData.rows) {
                dispatch(setSheetData(responseData.rows));
                dispatch(setSheetTitle(prompt.substring(0, 50) + "..."));
                dispatch(setSheetStatus("completed"));

                setMessages((prev) => [
                  ...prev,
                  {
                    id: `success-${Date.now()}`,
                    message: `✅ Sheet generated successfully with ${responseData.rows.length} rows and ${responseData.columns.length} columns!`,
                    isUser: false,
                    timestamp: new Date().toISOString(),
                    type: "success",
                  },
                ]);
              } else {
                // Handle case where we have completion but no proper data structure
                dispatch(setSheetStatus("error"));
                throw new Error("Invalid response format from server");
              }
            }

            // Handle different response formats that might come from the API
            if (data.type === "final" && data.sheet_data) {
              dispatch(setSheetData(data.sheet_data));
              dispatch(setSheetTitle(prompt.substring(0, 50) + "..."));
              dispatch(setSheetStatus("completed"));

              setMessages((prev) => [
                ...prev,
                {
                  id: `success-${Date.now()}`,
                  message: `✅ Sheet generated successfully!`,
                  isUser: false,
                  timestamp: new Date().toISOString(),
                  type: "success",
                },
              ]);
            }

            // Handle error steps
            if (data.step === "error") {
              dispatch(setSheetStatus("error"));
              throw new Error(
                data.data?.message || data.message || "Generation failed"
              );
            }
          } catch (parseError) {
            console.warn("Failed to parse streaming data:", line, parseError);
            // Don't throw here, continue processing other lines
          }
        }
      }

      // If we didn't receive any data, that's an error
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

  // Stop streaming
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

  // Clear error
  const clearError = () => {
    setError(null);
    dispatch(setSheetStatus("idle"));
  };

  // Get user chats (you can use this for showing chat history)
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

  // Render authentication error
  if (!isInitialized && error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption">
              Make sure you have access to Sheet AI service and are properly
              logged in.
            </Typography>
          </Box>
        </Alert>
      </Box>
    );
  }

  // Render loading state during initialization
  if (!isInitialized) {
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
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", bgcolor: "white" }}>
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
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" onClose={clearError}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          scrollBehavior: "smooth",
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
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.message}
                isUser={message.isUser}
                timestamp={message.timestamp}
                type={message.type}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Input Area */}
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