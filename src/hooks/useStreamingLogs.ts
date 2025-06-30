// hooks/useStreamingLogs.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export const useStreamingLogs = (realLogs, isLoading) => {
  const [processedLogs, setProcessedLogs] = useState([]);
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [currentlyTypingIndex, setCurrentlyTypingIndex] = useState(-1);
  const [showThinking, setShowThinking] = useState(false);
  
  const allLogsRef = useRef([]);
  const nextLogIndexRef = useRef(0);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef(null);

  // Clear typing timeout
  const clearTypingTimeout = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  // Start typing the next log in queue
  const startNextLog = useCallback(() => {
    const nextIndex = nextLogIndexRef.current;
    if (nextIndex < allLogsRef.current.length) {
      const nextLog = allLogsRef.current[nextIndex];
      
      // Ensure log exists and has content
      if (nextLog && nextLog.parsed_output && nextLog.parsed_output.trim()) {
        // Add the log to visible logs
        setVisibleLogs(prev => [...prev, nextLog]);
        setCurrentlyTypingIndex(nextIndex);
        setShowThinking(false);
        isTypingRef.current = true;
        nextLogIndexRef.current = nextIndex + 1;
      } else {
        // Skip invalid log and try next
        nextLogIndexRef.current = nextIndex + 1;
        setTimeout(() => startNextLog(), 100);
      }
    } else {
      // No more logs to process
      setCurrentlyTypingIndex(-1);
      isTypingRef.current = false;
      if (!isLoading) {
        setShowThinking(false);
      }
    }
  }, [isLoading]);

  // Handle typing completion for current log
  const handleTypingComplete = useCallback(() => {
    setCurrentlyTypingIndex(-1);
    isTypingRef.current = false;
    
    // Small delay before starting next log
    clearTypingTimeout();
    typingTimeoutRef.current = setTimeout(() => {
      startNextLog();
    }, 300);
  }, [startNextLog, clearTypingTimeout]);

  // Process new logs when they arrive
  useEffect(() => {
    if (!realLogs || realLogs.length === 0) {
      // Reset everything
      setProcessedLogs([]);
      setVisibleLogs([]);
      setCurrentlyTypingIndex(-1);
      setShowThinking(false);
      allLogsRef.current = [];
      nextLogIndexRef.current = 0;
      isTypingRef.current = false;
      clearTypingTimeout();
      return;
    }

    // Filter and prepare logs for display
    const validLogs = realLogs
      .filter(log => {
        // More robust filtering
        return log && 
               log.parsed_output && 
               typeof log.parsed_output === 'string' &&
               log.parsed_output.trim().length > 0 &&
               log.agent_name !== 'browser_agent';
      })
      .map((log, index) => ({
        ...log,
        id: `log-${index}-${log.timestamp || Date.now()}`,
        timestamp: log.timestamp || new Date().toISOString()
      }));

    // Only process if we have new logs
    const hasNewLogs = validLogs.length > allLogsRef.current.length;
    
    if (hasNewLogs) {
      allLogsRef.current = validLogs;
      setProcessedLogs(validLogs);
      
      // Start typing if not already typing and we have logs to show
      if (!isTypingRef.current && nextLogIndexRef.current < validLogs.length) {
        setShowThinking(false);
        startNextLog();
      }
    }
  }, [realLogs, startNextLog, clearTypingTimeout]);

  // Manage thinking indicator
  useEffect(() => {
    const hasUnprocessedLogs = nextLogIndexRef.current < allLogsRef.current.length;
    const isCurrentlyTyping = currentlyTypingIndex >= 0;
    
    if (isLoading) {
      if (visibleLogs.length === 0) {
        // Initial loading state
        setShowThinking(true);
      } else if (hasUnprocessedLogs && !isCurrentlyTyping) {
        // Waiting for next message to type
        setShowThinking(true);
      } else if (!hasUnprocessedLogs && !isCurrentlyTyping) {
        // Loading but no pending messages
        setShowThinking(true);
      } else {
        // Currently typing
        setShowThinking(false);
      }
    } else {
      // Not loading
      if (hasUnprocessedLogs && !isCurrentlyTyping) {
        // Brief thinking before next message
        setShowThinking(true);
      } else {
        setShowThinking(false);
      }
    }
  }, [isLoading, visibleLogs.length, currentlyTypingIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTypingTimeout();
    };
  }, [clearTypingTimeout]);

  return {
    processedLogs: visibleLogs, // Return only visible logs
    currentlyTypingIndex,
    showThinking,
    handleTypingComplete
  };
};

// Agent name formatting utility
export const formatAgentName = (agentName) => {
  if (!agentName || typeof agentName !== 'string') {
    return 'AI Assistant';
  }

  const agentNames = {
    'presentation_spec_extractor_agent': 'Spec Extractor',
    'vibe_estimator_agent': 'Vibe Estimator', 
    'planning_agent': 'Planning Agent',
    'keyword_research_agent': 'Keyword Research',
    'content_synthesizer_agent': 'Content Synthesizer',
    'slide_generator_agent': 'Slide Generator',
    'search_query': 'Search Query',
    'browser_agent': 'Browser Agent',
    'validation_agent': 'Validation Agent',
    'quality_checker_agent': 'Quality Checker',
    'unknown_agent': 'AI Assistant'
  };
  
  const formatted = agentNames[agentName] || 
         agentName.replace(/_/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase())
                  .replace(' Agent', '');
                  
  return formatted;
};

// Timestamp formatting utility
export const formatTimestamp = (timestamp) => {
  try {
    if (!timestamp) {
      return 'now';
    }
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // If invalid date, return current time
    if (isNaN(date.getTime())) {
      return 'now';
    }
    
    // If less than 1 minute ago, show "just now"
    if (diff < 60000) {
      return 'just now';
    }
    
    // If less than 1 hour ago, show minutes
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    
    // If same day, show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    // Otherwise show date and time
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric', 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.warn('Error formatting timestamp:', error);
    return 'now';
  }
};