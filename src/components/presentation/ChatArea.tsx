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

// Individual message component with typing effect
const StreamingMessage = memo(({ log, isTyping, onTypingComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(!isTyping);
  const typingRef = useRef(null);
  const mountedRef = useRef(true);
  
  const fullText = log.parsed_output || '';

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Reset state when switching between typing and non-typing
  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(fullText);
      setIsComplete(true);
      return;
    }
    
    // Reset for typing
    setDisplayedText('');
    setIsComplete(false);
  }, [isTyping, fullText]);

  useEffect(() => {
    if (!isTyping || !fullText.trim()) {
      if (!fullText.trim() && isTyping) {
        setIsComplete(true);
        onTypingComplete?.();
      }
      return;
    }

    let currentIndex = 0;
    
    // Adaptive typing speed
    const getTypingSpeed = (textLength) => {
      const baseSpeed = 50;
      const minSpeed = 30;
      const maxSpeed = 80;
      
      if (textLength > 500) return Math.min(maxSpeed, baseSpeed + 15);
      if (textLength > 200) return baseSpeed + 8;
      return baseSpeed;
    };

    const typingSpeed = getTypingSpeed(fullText.length);

    const typeText = () => {
      if (!mountedRef.current) return;
      
      if (currentIndex < fullText.length) {
        const nextChar = fullText[currentIndex];
        setDisplayedText(prev => prev + nextChar);
        currentIndex++;
        
        // Pause longer for punctuation
        const isPunctuation = ['.', '!', '?'].includes(nextChar);
        const isComma = nextChar === ',';
        const isNewline = nextChar === '\n';
        
        let delay = typingSpeed;
        if (isPunctuation) delay = typingSpeed * 2.5;
        else if (isComma) delay = typingSpeed * 1.5;
        else if (isNewline) delay = typingSpeed * 0.5;
        
        typingRef.current = setTimeout(typeText, delay);
      } else {
        setIsComplete(true);
        setTimeout(() => {
          if (mountedRef.current) {
            onTypingComplete?.();
          }
        }, 100);
      }
    };

    // Start typing immediately
    typingRef.current = setTimeout(typeText, 100);

    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [fullText, isTyping, onTypingComplete]);

  const agentDisplayName = formatAgentName(log.agent_name);
  const timestamp = formatTimestamp(log.timestamp);

  return (
    <Box sx={{ mb: 3 }}>
      {/* Agent Header - Subtle like ChatGPT */}
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
      
      {/* Message Content - Clean like ChatGPT */}
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
          {isTyping && !isComplete && (
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
    handleTypingComplete
  } = useStreamingLogs(realLogs, isLoading);

  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef(true);
  
  // Handle auto-scroll with better logic
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (chatEndRef.current && autoScrollRef.current) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior, block: 'end' });
      }, 50);
    }
  }, []);

  // Check if user is near bottom
  const checkScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      autoScrollRef.current = isNearBottom;
    }
  }, []);

  // Auto-scroll when content changes
  useEffect(() => {
    scrollToBottom();
  }, [processedLogs.length, showThinking, scrollToBottom]);

  // Auto-scroll during typing
  useEffect(() => {
    if (currentlyTypingIndex >= 0) {
      const interval = setInterval(() => {
        if (autoScrollRef.current) {
          scrollToBottom('auto');
        }
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [currentlyTypingIndex, scrollToBottom]);

  // Debug logs
  useEffect(() => {
    console.log('ChatArea State:', {
      realLogsLength: realLogs?.length || 0,
      processedLogsLength: processedLogs.length,
      currentlyTypingIndex,
      showThinking,
      isLoading
    });
  }, [realLogs, processedLogs, currentlyTypingIndex, showThinking, isLoading]);

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
              isTyping={index === currentlyTypingIndex}
              onTypingComplete={index === currentlyTypingIndex ? handleTypingComplete : undefined}
            />
          ))}

          {/* Show thinking indicator at the end */}
          {showThinking && (
            <Box sx={{ mt: 1 }}>
              <TypingAnimation />
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