// hooks/useStreamingLogs.ts
import { useState, useEffect, useRef, useCallback } from 'react';

// Storage key for tracking animated logs
const ANIMATED_LOGS_KEY = 'streamingLogs_animated';

// Get animated logs from storage
const getAnimatedLogs = (): Set<string> => {
  try {
    const stored = JSON.parse(sessionStorage.getItem(ANIMATED_LOGS_KEY) || '[]');
    return new Set(stored);
  } catch {
    return new Set();
  }
};

// Save animated logs to storage
const saveAnimatedLogs = (animatedSet: Set<string>) => {
  try {
    sessionStorage.setItem(ANIMATED_LOGS_KEY, JSON.stringify([...animatedSet]));
  } catch {
    // Ignore storage errors
  }
};

// Generate unique ID for a log
const generateLogId = (log: any, index: number): string => {
  return `${log.agent_name}_${log.timestamp}_${index}_${log.parsed_output?.slice(0, 50)}`;
};

export const useStreamingLogs = (realLogs: any[], isLoading: boolean) => {
  const [processedLogs, setProcessedLogs] = useState([]);
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [currentlyTypingIndex, setCurrentlyTypingIndex] = useState(-1);
  const [showThinking, setShowThinking] = useState(false);
  
  const allLogsRef = useRef([]);
  const nextLogIndexRef = useRef(0);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef(null);
  const animatedLogsRef = useRef<Set<string>>(getAnimatedLogs());
  const sessionStatusRef = useRef<string>('processing'); // Track session status

  // Clear typing timeout
  const clearTypingTimeout = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  // Check if log should be animated
  const shouldAnimateLog = useCallback((log: any, index: number): boolean => {
    const logId = generateLogId(log, index);
    const hasBeenAnimated = animatedLogsRef.current.has(logId);
    
    // Don't animate if session is completed/failed
    if (sessionStatusRef.current === 'completed' || sessionStatusRef.current === 'failed') {
      return false;
    }
    
    // Don't animate if already animated
    return !hasBeenAnimated;
  }, []);

  // Mark log as animated
  const markLogAsAnimated = useCallback((log: any, index: number) => {
    const logId = generateLogId(log, index);
    animatedLogsRef.current.add(logId);
    saveAnimatedLogs(animatedLogsRef.current);
  }, []);

  // Start typing the next log in queue
  const startNextLog = useCallback(() => {
    const nextIndex = nextLogIndexRef.current;
    if (nextIndex < allLogsRef.current.length) {
      const nextLog = allLogsRef.current[nextIndex];
      
      // Ensure log exists and has content
      if (nextLog && nextLog.parsed_output && nextLog.parsed_output.trim()) {
        const shouldAnimate = shouldAnimateLog(nextLog, nextIndex);
        
        // Add the log to visible logs
        setVisibleLogs(prev => [...prev, { ...nextLog, shouldAnimate }]);
        
        if (shouldAnimate) {
          setCurrentlyTypingIndex(nextIndex);
          isTypingRef.current = true;
          // Hide thinking while actively typing
          setShowThinking(false);
        } else {
          // Skip animation, move to next immediately
          setCurrentlyTypingIndex(-1);
          isTypingRef.current = false;
        }
        
        nextLogIndexRef.current = nextIndex + 1;
        
        // If not animating, start next log immediately
        if (!shouldAnimate) {
          setTimeout(() => startNextLog(), 50);
        }
      } else {
        // Skip invalid log and try next
        nextLogIndexRef.current = nextIndex + 1;
        setTimeout(() => startNextLog(), 50);
      }
    } else {
      // No more logs to process
      setCurrentlyTypingIndex(-1);
      isTypingRef.current = false;
      
      // Show thinking if still loading or processing
      if (isLoading || sessionStatusRef.current === 'processing') {
        setShowThinking(true);
      } else {
        setShowThinking(false);
      }
    }
  }, [shouldAnimateLog, isLoading]);

  // Handle typing completion for current log
  const handleTypingComplete = useCallback((logIndex: number) => {
    if (logIndex >= 0 && logIndex < allLogsRef.current.length) {
      markLogAsAnimated(allLogsRef.current[logIndex], logIndex);
    }
    
    setCurrentlyTypingIndex(-1);
    isTypingRef.current = false;
    
    // Small delay before starting next log
    clearTypingTimeout();
    typingTimeoutRef.current = setTimeout(() => {
      startNextLog();
    }, 150); // Reduced delay for faster flow
  }, [startNextLog, clearTypingTimeout, markLogAsAnimated]);

  // Determine session status from logs
  const determineSessionStatus = useCallback((logs: any[]): string => {
    if (!logs || logs.length === 0) return 'processing';
    
    // Check if any log has status information
    const statusLog = logs.find(log => log.status);
    if (statusLog) {
      return statusLog.status;
    }
    
    // Fallback: if not loading and we have logs, assume completed
    if (!isLoading && logs.length > 0) {
      return 'completed';
    }
    
    return 'processing';
  }, [isLoading]);

  // Process new logs when they arrive
  useEffect(() => {
    if (!realLogs || realLogs.length === 0) {
      // Reset everything
      setProcessedLogs([]);
      setVisibleLogs([]);
      setCurrentlyTypingIndex(-1);
      setShowThinking(isLoading); // Show thinking if loading
      allLogsRef.current = [];
      nextLogIndexRef.current = 0;
      isTypingRef.current = false;
      sessionStatusRef.current = 'processing';
      clearTypingTimeout();
      return;
    }

    // Update session status
    sessionStatusRef.current = determineSessionStatus(realLogs);

    // Filter and prepare logs for display
    const validLogs = realLogs
      .filter(log => {
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
        startNextLog();
      }
    }
  }, [realLogs, startNextLog, clearTypingTimeout, determineSessionStatus, isLoading]);

  // Manage thinking indicator - FIXED LOGIC
  useEffect(() => {
    const hasUnprocessedLogs = nextLogIndexRef.current < allLogsRef.current.length;
    const isCurrentlyTyping = currentlyTypingIndex >= 0;
    const isProcessingOrFailed = sessionStatusRef.current === 'processing' || sessionStatusRef.current === 'failed';
    
    // Show thinking if:
    // 1. Currently loading and no logs yet
    // 2. Still processing/failed and not currently typing
    // 3. Has unprocessed logs and not currently typing
    if (isLoading && visibleLogs.length === 0) {
      setShowThinking(true);
    } else if (isProcessingOrFailed && !isCurrentlyTyping) {
      setShowThinking(true);
    } else if (hasUnprocessedLogs && !isCurrentlyTyping) {
      setShowThinking(true);
    } else if (isCurrentlyTyping) {
      // Never show thinking while typing
      setShowThinking(false);
    } else {
      // Default case - hide thinking if completed and nothing to process
      setShowThinking(false);
    }
  }, [isLoading, visibleLogs.length, currentlyTypingIndex]);

  // Clear animated logs when session resets
  useEffect(() => {
    if (!realLogs || realLogs.length === 0) {
      // Clear animated logs for new session
      animatedLogsRef.current.clear();
      saveAnimatedLogs(animatedLogsRef.current);
    }
  }, [realLogs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTypingTimeout();
    };
  }, [clearTypingTimeout]);

  return {
    processedLogs: visibleLogs,
    currentlyTypingIndex,
    showThinking,
    handleTypingComplete,
    sessionStatus: sessionStatusRef.current
  };
};

// Agent name formatting utility (unchanged)
export const formatAgentName = (agentName: string): string => {
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

// Timestamp formatting utility (unchanged)
export const formatTimestamp = (timestamp: string): string => {
  try {
    if (!timestamp) {
      return 'now';
    }
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (isNaN(date.getTime())) {
      return 'now';
    }
    
    if (diff < 60000) {
      return 'just now';
    }
    
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
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