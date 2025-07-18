import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Paper, IconButton, Tooltip, Alert } from "@mui/material";
import { Send, Stop, Refresh } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import InputArea from "../presentation/InputArea";
import { useSheetAiChat } from "../../hooks/useSheetAiChat";
import { useSheetAiStream } from "../../hooks/useSheetAiStream";
import { selectSheet } from "../../redux/slice/sheetSlice";

// Message component for chat display
const MessageBubble = ({ message, isUser, timestamp }) => (
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
        bgcolor: isUser ? "primary.main" : "grey.100",
        color: isUser ? "white" : "text.primary",
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

// Status indicator component
const StatusIndicator = ({ status, connectionState, isStreaming }) => {
  const getStatusColor = () => {
    if (isStreaming) return "info.main";
    if (status === "error") return "error.main";
    if (status === "completed") return "success.main";
    return "text.secondary";
  };

  const getStatusText = () => {
    if (isStreaming) return `Streaming (${connectionState})`;
    if (status === "error") return "Error occurred";
    if (status === "completed") return "Generation complete";
    return "Ready";
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: getStatusColor(),
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {getStatusText()}
      </Typography>
    </Box>
  );
};

export default function SheetChatArea({ currentAgentType, isLoading }) {
  const dispatch = useDispatch();
  const sheetState = useSelector(selectSheet);
  
  // Custom hooks
  const { 
    chats, 
    loading: chatLoading, 
    error: chatError, 
    createChat, 
    getMyChats 
  } = useSheetAiChat();
  
  const {
    isStreaming,
    connectionState,
    error: streamError,
    streamingStats,
    startStreaming,
    stopStreaming,
    clearError,
    canStartStreaming,
    canStopStreaming
  } = useSheetAiStream();

  // Local state
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isProcessingInitialPrompt, setIsProcessingInitialPrompt] = useState(false);

  const user = useSelector((state) => state.auth.user);
  // Refs
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const initialPromptProcessedRef = useRef(false);

  // Initialize user email and check authentication
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Get user email from localStorage or user context
        const email = user.email;
        setUserEmail(email);
        
        // Check if user is authenticated with Sheet AI
        const sheetToken = localStorage.getItem('sheet-token');
        if (!sheetToken) {
          await handleSheetAiAuth(email);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize user:', error);
        setAuthError('Failed to initialize authentication');
      }
    };

    initializeUser();
  }, []);

  // Handle Sheet AI authentication (register/login)
  const handleSheetAiAuth = async (email) => {
    try {
      // First try to register (in case user doesn't exist)
      const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/sheet/auth/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: email.split('@')[0], // Use email prefix as name
          email 
        })
      });

      if (registerResponse.ok) {
        console.log('User registered successfully');
      }

      // Then login to get the sheet token
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/sheet/auth/login`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!loginResponse.ok) {
        throw new Error('Failed to login to Sheet AI');
      }

      const loginResult = await loginResponse.json();
      if (loginResult.success && loginResult.data.access_token) {
        localStorage.setItem('sheet-token', loginResult.data.access_token);
        console.log('Sheet AI authentication successful');
      }
    } catch (error) {
      console.error('Sheet AI authentication error:', error);
      setAuthError('Failed to authenticate with Sheet AI service');
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle initial prompt from session storage - FIXED VERSION
  useEffect(() => {
    const processInitialPrompt = async () => {
      // Prevent multiple processing
      if (initialPromptProcessedRef.current || isProcessingInitialPrompt) {
        return;
      }

      const initialPrompt = sessionStorage.getItem("initialSheetPrompt");
      
      if (initialPrompt && isInitialized && !currentChatId && canStartStreaming) {
        console.log('Processing initial prompt:', initialPrompt);
        
        initialPromptProcessedRef.current = true;
        setIsProcessingInitialPrompt(true);
        
        try {
          await handleInitialPrompt(initialPrompt);
        } catch (error) {
          console.error('Failed to process initial prompt:', error);
          initialPromptProcessedRef.current = false; // Reset on error
        } finally {
          setIsProcessingInitialPrompt(false);
          sessionStorage.removeItem("initialSheetPrompt");
        }
      }
    };

    processInitialPrompt();
  }, [isInitialized, currentChatId, canStartStreaming]);

  // Handle initial prompt processing
  const handleInitialPrompt = async (prompt) => {
    return;
    try {
      // Create a new chat first
      const newChat = await createChat(`Sheet Generation - ${Date.now()}`, userEmail);
      if (!newChat.localChatId) {
        throw new Error('Failed to create chat');
      }
      
      setCurrentChatId(newChat.localChatId);
      
      // Add user message to UI
      const userMessage = {
        id: `user-${Date.now()}`,
        message: prompt,
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      
      setMessages([userMessage]);

      console.log('Created new chat:', newChat.localChatId);
      
      // Start streaming with the new chat ID
      await handleStartStreaming(newChat.localChatId, prompt);
    } catch (error) {
      console.error('Failed to handle initial prompt:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        message: 'Failed to process initial prompt. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    }
  };

  // Handle new message submission - SIMPLIFIED VERSION
  const handleNewMessage = async () => {
    if (!inputValue.trim() || !canStartStreaming || !isInitialized || isProcessingInitialPrompt) {
      return;
    }

    try {
      let chatId = currentChatId;
      
      // Create new chat if none exists
      if (!chatId) {
        const newChat = await createChat(`Chat - ${Date.now()}`, userEmail);
        if (!newChat.localChatId) {
          throw new Error('Failed to create chat');
        }
        chatId = newChat.localChatId;
        setCurrentChatId(chatId);
      }

      // Add user message to UI
      const userMessage = {
        id: `user-${Date.now()}`,
        message: inputValue,
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Clear input immediately
      const currentInput = inputValue;
      setInputValue("");
      
      // Start streaming
      await handleStartStreaming(chatId, currentInput);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        message: 'Failed to send message. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    }
  };

  // Handle streaming start - PREVENT DUPLICATE CALLS
  const handleStartStreaming = useCallback(async (chatId, prompt) => {
    // Prevent multiple simultaneous streaming attempts
    if (isStreaming || !canStartStreaming) {
      console.warn('Streaming already in progress or not available');
      return;
    }

    try {
      console.log('Starting streaming for chat:', chatId, 'with prompt:', prompt);
      
      await startStreaming(chatId, prompt, userEmail);
      
      // Add system message about generation starting
      setMessages(prev => [...prev, {
        id: `system-${Date.now()}`,
        message: 'Starting sheet generation...',
        isUser: false,
        timestamp: new Date().toISOString(),
        isSystem: true
      }]);
      
    } catch (error) {
      console.error('Failed to start streaming:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        message: 'Failed to start generation. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    }
  }, [isStreaming, canStartStreaming, startStreaming, userEmail]);

  // Handle streaming stop
  const handleStopStreaming = async () => {
    try {
      await stopStreaming();
      
      setMessages(prev => [...prev, {
        id: `system-${Date.now()}`,
        message: 'Generation cancelled by user.',
        isUser: false,
        timestamp: new Date().toISOString(),
        isSystem: true
      }]);
      
    } catch (error) {
      console.error('Failed to stop streaming:', error);
    }
  };

  // Handle retry
  const handleRetry = () => {
    clearError();
    if (messages.length > 0) {
      const lastUserMessage = messages.filter(m => m.isUser).pop();
      if (lastUserMessage && currentChatId) {
        handleStartStreaming(currentChatId, lastUserMessage.message);
      }
    }
  };

  // Update messages when sheet state changes
  useEffect(() => {
    if (sheetState.status === 'completed' && sheetState.title) {
      setMessages(prev => {
        const hasCompletionMessage = prev.some(m => m.isCompletion);
        if (!hasCompletionMessage) {
          return [...prev, {
            id: `completion-${Date.now()}`,
            message: `✅ ${sheetState.title}\n\nSheet generation completed successfully!`,
            isUser: false,
            timestamp: new Date().toISOString(),
            isCompletion: true
          }];
        }
        return prev;
      });
    }
  }, [sheetState.status, sheetState.title]);

  // Render authentication error
  if (authError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {authError}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Please refresh the page to try again.
        </Typography>
      </Box>
    );
  }

  // Render loading state
  if (!isInitialized) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Initializing Sheet AI...
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
        maxHeight: "100%",
        borderRight: "1px solid #e0e0e0",
        bgcolor: "#fafafa",
        overflow: "hidden",
      }}
    >
      {/* Header with status */}
      <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", bgcolor: "white" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Sheet Generator
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {(streamError || chatError) && (
              <Tooltip title="Retry last operation">
                <IconButton size="small" onClick={handleRetry}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            )}
            {canStopStreaming && (
              <Tooltip title="Stop generation">
                <IconButton size="small" onClick={handleStopStreaming} color="error">
                  <Stop />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        <StatusIndicator 
          status={sheetState.status} 
          connectionState={connectionState}
          isStreaming={isStreaming}
        />
      </Box>

      {/* Error displays */}
      {(streamError || chatError) && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" onClose={clearError}>
            {streamError?.message || chatError?.message || 'An error occurred'}
          </Alert>
        </Box>
      )}

      {/* Streaming stats (debug info) */}
      {isStreaming && streamingStats.startTime && (
        <Box sx={{ p: 1, bgcolor: "info.light", color: "info.contrastText" }}>
          <Typography variant="caption">
            Streaming: {Math.floor(streamingStats.duration / 1000)}s | 
            Messages: {streamingStats.messagesReceived} | 
            Bytes: {(streamingStats.bytesReceived / 1024).toFixed(1)}KB
          </Typography>
        </Box>
      )}

      {/* Messages area */}
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
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
        <Box sx={{ p: 3, minHeight: "100%", display: "flex", flexDirection: "column" }}>
          {messages.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Welcome to Sheet Generator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start by describing what kind of spreadsheet you'd like to create.
              </Typography>
            </Box>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.message}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Input area */}
      <Box
        sx={{
          borderTop: "1px solid #e0e0e0",
          bgcolor: "white",
          flexShrink: 0,
          maxHeight: "300px",
          overflow: "hidden",
        }}
      >
        <InputArea
          currentAgentType={currentAgentType}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={handleNewMessage}
          isLoading={isStreaming || chatLoading || isProcessingInitialPrompt}
          disabled={!canStartStreaming || !isInitialized || isProcessingInitialPrompt}
          placeholder={
            !isInitialized 
              ? "Initializing..." 
              : isProcessingInitialPrompt
                ? "Processing initial prompt..."
              : isStreaming 
                ? "Generation in progress..." 
                : "Describe the spreadsheet you want to create..."
          }
        />
      </Box>
    </Box>
  );
}