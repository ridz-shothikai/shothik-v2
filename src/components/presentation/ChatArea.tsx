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

// Enhanced message component with improved typing effect
const StreamingMessage = memo(({ log, isTyping, onTypingComplete, logIndex }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(!isTyping);
  const typingRef = useRef(null);
  const mountedRef = useRef(true);
  const startTimeRef = useRef(Date.now());
  const lastFrameRef = useRef(Date.now());
  
  const fullText = log.parsed_output || '';
  const shouldAnimate = log.shouldAnimate !== false && isTyping;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Reset state when switching between typing and non-typing
  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedText(fullText);
      setIsComplete(true);
      return;
    }
    
    // Reset for typing
    setDisplayedText('');
    setIsComplete(false);
    startTimeRef.current = Date.now();
  }, [shouldAnimate, fullText]);

  useEffect(() => {
    if (!shouldAnimate || !fullText.trim()) {
      if (!fullText.trim() && shouldAnimate) {
        setIsComplete(true);
        onTypingComplete?.(logIndex);
      }
      return;
    }

    let currentIndex = 0;
    
    // Much faster, adaptive typing speed
    const getTypingSpeed = (textLength: number): number => {
      const baseSpeed = 15; // Reduced from 50 to 15 (much faster)
      const minSpeed = 8;   // Reduced from 30 to 8
      const maxSpeed = 25;  // Reduced from 80 to 25
      
      if (textLength > 500) return Math.min(maxSpeed, baseSpeed + 5);
      if (textLength > 200) return baseSpeed + 3;
      return baseSpeed;
    };

    const typingSpeed = getTypingSpeed(fullText.length);

    // Use requestAnimationFrame for smoother, window-focus-independent animation
    const typeText = () => {
      if (!mountedRef.current) return;
      
      const now = Date.now();
      const elapsed = now - lastFrameRef.current;
      
      if (currentIndex < fullText.length && elapsed >= typingSpeed) {
        const nextChar = fullText[currentIndex];
        setDisplayedText(prev => prev + nextChar);
        currentIndex++;
        lastFrameRef.current = now;
        
        // Continue with next frame
        typingRef.current = requestAnimationFrame(typeText);
      } else if (currentIndex < fullText.length) {
        // Not enough time elapsed, continue
        typingRef.current = requestAnimationFrame(typeText);
      } else {
        // Completed typing
        setIsComplete(true);
        setTimeout(() => {
          if (mountedRef.current) {
            onTypingComplete?.(logIndex);
          }
        }, 50);
      }
    };

    // Start typing with requestAnimationFrame
    lastFrameRef.current = Date.now();
    typingRef.current = requestAnimationFrame(typeText);

    return () => {
      if (typingRef.current) {
        cancelAnimationFrame(typingRef.current);
      }
    };
  }, [fullText, shouldAnimate, onTypingComplete, logIndex]);

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
    sessionStatus
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

  // Smooth scrolling during typing
  useEffect(() => {
    if (currentlyTypingIndex >= 0) {
      const interval = setInterval(() => {
        if (autoScrollRef.current) {
          scrollToBottom('auto');
        }
      }, 300); // Increased frequency for smoother scrolling
      
      return () => clearInterval(interval);
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
        sessionStatus
      });
    }
  }, [realLogs, processedLogs, currentlyTypingIndex, showThinking, isLoading, sessionStatus]);

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

          {/* Display streaming messages */}
          {processedLogs.map((log, index) => (
            <StreamingMessage
              key={log.id}
              log={log}
              logIndex={index}
              isTyping={index === currentlyTypingIndex}
              onTypingComplete={handleTypingCompleteWithIndex}
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