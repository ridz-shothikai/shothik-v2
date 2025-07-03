// components/ChatArea.tsx
import React, { useEffect, useRef, memo, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InteractiveChatMessage from '../../../components/agents/shared/InteractiveChatMessage';
import InputArea from './InputArea';
import { useStreamingLogs, formatAgentName, formatTimestamp } from '../../hooks/useStreamingLogs';

const PRIMARY_GREEN = '#07B37A';

// Typing animation component for "Thinking..."
const TypingAnimation = memo(({ text = "Thinking..." }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2, px: 1 }}>
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: PRIMARY_GREEN,
            animation: 'typing 1s infinite',
            animationDelay: `${i * 0.2}s`,
            '@keyframes typing': {
              '0%, 60%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
              '30%': { opacity: 1, transform: 'scale(1)' },
            },
          }}
        />
      ))}
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
      {text}
    </Typography>
  </Box>
));

TypingAnimation.displayName = 'TypingAnimation';

// Enhanced streaming message component with force completion support
const StreamingMessage = memo(({ 
  log, 
  isTyping, 
  onTypingComplete, 
  logIndex,
  registerAnimationCallback,
  unregisterAnimationCallback 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(!isTyping);
  
  // Refs for background-safe animation with force completion
  const animationStateRef = useRef({
    isRunning: false,
    startTime: 0,
    currentWordIndex: 0,
    words: [],
    intervalId: null,
    lastUpdateTime: 0,
    forceCompleted: false
  });
  
  const mountedRef = useRef(true);
  
  const fullText = log.parsed_output || '';
  const shouldAnimate = log.shouldAnimate !== false && isTyping;

  // Split text into words for word-by-word animation
  const prepareWords = useCallback((text: string) => {
    if (!text) return [];
    
    // Split by spaces but preserve spacing information
    const parts = text.split(/(\s+)/);
    const words = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].trim()) {
        // It's a word
        words.push({ text: parts[i], isSpace: false });
      } else if (parts[i]) {
        // It's whitespace
        words.push({ text: parts[i], isSpace: true });
      }
    }
    
    return words;
  }, []);

  // Force completion function
  const forceComplete = useCallback(() => {
    const state = animationStateRef.current;
    
    if (!state.isRunning || state.forceCompleted) {
      return;
    }
    
    console.log('Force completing animation for log:', logIndex);
    
    state.forceCompleted = true;
    state.isRunning = false;
    
    // Clear any running interval
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
    
    // Immediately show full text
    if (mountedRef.current) {
      setDisplayedText(fullText);
      setIsComplete(true);
      
      // Notify completion after a small delay
      setTimeout(() => {
        if (mountedRef.current) {
          unregisterAnimationCallback(logIndex);
          onTypingComplete?.(logIndex);
        }
      }, 50);
    }
  }, [fullText, logIndex, onTypingComplete, unregisterAnimationCallback]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (animationStateRef.current.intervalId) {
        clearInterval(animationStateRef.current.intervalId);
      }
    };
  }, []);

  // Reset state when switching between typing and non-typing
  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedText(fullText);
      setIsComplete(true);
      
      // Clear any running animation
      if (animationStateRef.current.intervalId) {
        clearInterval(animationStateRef.current.intervalId);
        animationStateRef.current.intervalId = null;
      }
      animationStateRef.current.isRunning = false;
      animationStateRef.current.forceCompleted = false;
      return;
    }
    
    // Reset for typing
    setDisplayedText('');
    setIsComplete(false);
    
    // Clear any existing animation
    if (animationStateRef.current.intervalId) {
      clearInterval(animationStateRef.current.intervalId);
    }
    
    // Prepare animation state
    animationStateRef.current = {
      isRunning: false,
      startTime: Date.now(),
      currentWordIndex: 0,
      words: prepareWords(fullText),
      intervalId: null,
      lastUpdateTime: Date.now(),
      forceCompleted: false
    };
  }, [shouldAnimate, fullText, prepareWords]);

  // Enhanced animation with force completion support
  useEffect(() => {
    if (!shouldAnimate || !fullText.trim() || animationStateRef.current.isRunning) {
      if (!fullText.trim() && shouldAnimate) {
        setIsComplete(true);
        onTypingComplete?.(logIndex);
      }
      return;
    }

    const state = animationStateRef.current;
    const words = state.words;
    
    if (words.length === 0) {
      setIsComplete(true);
      onTypingComplete?.(logIndex);
      return;
    }

    state.isRunning = true;
    state.startTime = Date.now();
    state.currentWordIndex = 0;
    state.lastUpdateTime = Date.now();
    state.forceCompleted = false;

    // Register force completion callback
    registerAnimationCallback(logIndex, forceComplete);

    // Calculate adaptive timing - faster for better responsiveness
    const getWordDelay = (wordCount: number): number => {
      const baseDelay = 60; // Reduced base delay (was 80)
      const minDelay = 30;  // Reduced minimum delay (was 40)
      const maxDelay = 120; // Reduced maximum delay (was 150)
      
      if (wordCount > 100) return minDelay;
      if (wordCount > 50) return Math.max(minDelay, baseDelay - 15);
      if (wordCount < 10) return Math.min(maxDelay, baseDelay + 20);
      
      return baseDelay;
    };

    const wordDelay = getWordDelay(words.length);

    // Enhanced animation with force completion checks
    const animateWords = () => {
      if (!mountedRef.current || !state.isRunning || state.forceCompleted) {
        return;
      }

      const now = Date.now();
      const timeSinceLastUpdate = now - state.lastUpdateTime;
      
      // Check if enough time has passed for next word
      if (timeSinceLastUpdate >= wordDelay) {
        if (state.currentWordIndex < words.length && !state.forceCompleted) {
          // Add next word
          const currentWords = words.slice(0, state.currentWordIndex + 1);
          const newText = currentWords.map(w => w.text).join('');
          
          setDisplayedText(newText);
          state.currentWordIndex++;
          state.lastUpdateTime = now;
          
        } else {
          // Animation complete naturally
          state.isRunning = false;
          if (state.intervalId) {
            clearInterval(state.intervalId);
            state.intervalId = null;
          }
          
          setIsComplete(true);
          
          // Small delay before notifying completion
          setTimeout(() => {
            if (mountedRef.current && !state.forceCompleted) {
              unregisterAnimationCallback(logIndex);
              onTypingComplete?.(logIndex);
            }
          }, 50);
        }
      }
    };

    // Start animation with higher frequency for better responsiveness
    state.intervalId = setInterval(animateWords, 15); // Reduced from 20ms

    return () => {
      state.isRunning = false;
      if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
      }
      unregisterAnimationCallback(logIndex);
    };
  }, [fullText, shouldAnimate, onTypingComplete, logIndex, registerAnimationCallback, unregisterAnimationCallback, forceComplete]);

  // Enhanced visibility change handler with force completion
  useEffect(() => {
    const handleVisibilityChange = () => {
      const state = animationStateRef.current;
      
      // If animation was running and tab becomes visible, force completion
      if (!document.hidden && state.isRunning && shouldAnimate && !state.forceCompleted) {
        console.log('Tab became visible, force completing animation for log:', logIndex);
        forceComplete();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [shouldAnimate, logIndex, forceComplete]);

  const agentDisplayName = formatAgentName(log.agent_name);
  const timestamp = formatTimestamp(log.timestamp);

  return (
    <Box sx={{ mb: 3 }}>
      {/* Agent Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: 1.5,
        opacity: 0.7 
      }}>
        <Box sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          bgcolor: PRIMARY_GREEN,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '8px',
          color: 'white',
          fontWeight: 'bold',
          flexShrink: 0
        }}>
          AI
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
          {agentDisplayName}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
          {timestamp}
        </Typography>
      </Box>
      
      {/* Message Content */}
      <Box sx={{ ml: 0 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word',
            lineHeight: 1.6,
            color: '#374151',
            fontSize: '0.95rem',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {displayedText}
          {shouldAnimate && !isComplete && (
            <Box 
              component="span" 
              sx={{ 
                display: 'inline-block',
                width: '2px',
                height: '20px',
                bgcolor: PRIMARY_GREEN,
                ml: 0.5,
                animation: 'blink 1s infinite',
                '@keyframes blink': {
                  '0%, 50%': { opacity: 1 },
                  '51%, 100%': { opacity: 0 },
                },
              }} 
            />
          )}
        </Typography>
      </Box>
    </Box>
  );
});

StreamingMessage.displayName = 'StreamingMessage';

export default function ChatArea({ 
  currentAgentType, 
  chatHistory, 
  realLogs, 
  isLoading, 
  currentPhase, 
  completedPhases, 
  logsData, 
  chatEndRef,
  inputValue,
  setInputValue,
  onSend
}) {
  const {
    processedLogs,
    currentlyTypingIndex,
    showThinking,
    handleTypingComplete,
    sessionStatus,
    isBackgroundProcessing,
    registerAnimationCallback,
    unregisterAnimationCallback,
    forceCompleteCurrentAnimation
  } = useStreamingLogs(realLogs, isLoading);

  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef(true);
  const lastLogCountRef = useRef(0);
  
  // Enhanced auto-scroll with better performance
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (chatEndRef.current && autoScrollRef.current) {
      // Use different strategies based on typing state
      const scrollBehavior = currentlyTypingIndex >= 0 ? 'auto' : behavior;
      
      requestAnimationFrame(() => {
        chatEndRef.current?.scrollIntoView({ 
          behavior: scrollBehavior, 
          block: 'end' 
        });
      });
    }
  }, [currentlyTypingIndex]);

  // Check if user is near bottom
  const checkScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      autoScrollRef.current = isNearBottom;
    }
  }, []);

  // Auto-scroll when new content appears
  useEffect(() => {
    if (processedLogs.length > lastLogCountRef.current || showThinking) {
      scrollToBottom();
      lastLogCountRef.current = processedLogs.length;
    }
  }, [processedLogs.length, showThinking, scrollToBottom]);

  // Smooth scrolling during typing - using setInterval for background safety
  useEffect(() => {
    if (currentlyTypingIndex >= 0) {
      const scrollInterval = setInterval(() => {
        if (autoScrollRef.current) {
          scrollToBottom('auto');
        }
      }, 200); // Reduced frequency but background-safe
      
      return () => clearInterval(scrollInterval);
    }
  }, [currentlyTypingIndex, scrollToBottom]);

  // Enhanced typing completion handler
  const handleTypingCompleteWithIndex = useCallback((logIndex: number) => {
    handleTypingComplete(logIndex);
  }, [handleTypingComplete]);

  // Debug logs (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ChatArea State:', {
        realLogsLength: realLogs?.length || 0,
        processedLogsLength: processedLogs.length,
        currentlyTypingIndex,
        showThinking,
        isLoading,
        sessionStatus,
        isBackgroundProcessing,
        documentHidden: document.hidden
      });
    }
  }, [realLogs, processedLogs, currentlyTypingIndex, showThinking, isLoading, sessionStatus, isBackgroundProcessing]);

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxHeight: '100%',
      borderRight: '1px solid #e0e0e0',
      bgcolor: '#fafafa',
      overflow: 'hidden',
    }}>
      {/* Messages Display Area */}
      <Box 
        ref={scrollContainerRef}
        onScroll={checkScrollPosition}
        sx={{ 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { 
            background: '#c1c1c1', 
            borderRadius: '3px',
            '&:hover': { background: '#a8a8a8' } 
          },
          scrollbarWidth: 'thin',
          scrollbarColor: '#c1c1c1 transparent',
        }}
      >
        <Box sx={{ p: 3, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Initial empty state */}
          {chatHistory.length === 0 && processedLogs.length === 0 && !showThinking && (
            <Box sx={{ 
              textAlign: 'center', 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              minHeight: '300px' 
            }}>
              <SmartToyIcon sx={{ fontSize: 48, color: '#ddd', mb: 2 }} />
              <Typography variant="h6" color="#999" sx={{ mb: 1 }}>
                {currentAgentType === 'presentation' ? 'Presentation Agent' : 'Super Agent'}
              </Typography>
              <Typography variant="body2" color="#666">
                Start a conversation to see AI responses stream in real-time
              </Typography>
            </Box>
          )}
          
          {/* Display user's sent messages */}
          {chatHistory.map((message) => (
            <InteractiveChatMessage 
              key={message.id} 
              message={message} 
              onResponse={() => {}} 
              onFeedback={() => {}} 
              onPreferenceUpdate={() => {}} 
            />
          ))}

          {/* Display streaming messages with enhanced callbacks */}
          {processedLogs.map((log, index) => (
            <StreamingMessage
              key={log.id}
              log={log}
              logIndex={index}
              isTyping={index === currentlyTypingIndex}
              onTypingComplete={handleTypingCompleteWithIndex}
              registerAnimationCallback={registerAnimationCallback}
              unregisterAnimationCallback={unregisterAnimationCallback}
            />
          ))}

          {/* Show thinking indicator */}
          {showThinking && sessionStatus !== 'completed' && sessionStatus !== 'failed' && (
            <Box sx={{ mt: 1 }}>
              <TypingAnimation 
                text={
                  sessionStatus === 'failed' ? 'Processing failed...' :
                  isLoading ? 'Thinking...' : 'Processing...'
                }
              />
            </Box>
          )}

          <div ref={chatEndRef} />
        </Box>
      </Box>
      
      {/* Input Area */}
      <Box sx={{ 
        borderTop: '1px solid #e0e0e0',
        bgcolor: 'white',
        flexShrink: 0,
        maxHeight: '300px',
        overflow: 'hidden',
      }}>
        <InputArea
          currentAgentType={currentAgentType}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={onSend}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
}