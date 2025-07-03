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
  const sessionStatusRef = useRef<string>('processing');
  const backgroundProcessingRef = useRef(false);
  
  // NEW: Track currently animating log and provide force completion callback
  const currentAnimationRef = useRef<{
    logIndex: number;
    forceComplete: (() => void) | null;
  }>({ logIndex: -1, forceComplete: null });

  // Clear typing timeout
  const clearTypingTimeout = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  // NEW: Force complete current animation
  const forceCompleteCurrentAnimation = useCallback(() => {
    if (currentAnimationRef.current.logIndex >= 0 && currentAnimationRef.current.forceComplete) {
      console.log('Forcing completion of animation for log:', currentAnimationRef.current.logIndex);
      currentAnimationRef.current.forceComplete();
      // Reset animation tracking
      currentAnimationRef.current = { logIndex: -1, forceComplete: null };
    }
  }, []);

  // Check if log should be animated
  const shouldAnimateLog = useCallback((log: any, index: number): boolean => {
    const logId = generateLogId(log, index);
    const hasBeenAnimated = animatedLogsRef.current.has(logId);
    
    // Don't animate if session is completed/failed and not currently processing new logs
    if ((sessionStatusRef.current === 'completed' || sessionStatusRef.current === 'failed') 
        && !backgroundProcessingRef.current) {
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

  // NEW: Register animation callback for force completion
  const registerAnimationCallback = useCallback((logIndex: number, forceComplete: () => void) => {
    currentAnimationRef.current = { logIndex, forceComplete };
  }, []);

  // NEW: Unregister animation callback when animation completes
  const unregisterAnimationCallback = useCallback((logIndex: number) => {
    if (currentAnimationRef.current.logIndex === logIndex) {
      currentAnimationRef.current = { logIndex: -1, forceComplete: null };
    }
  }, []);

  // Enhanced start next log with force completion
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
          backgroundProcessingRef.current = true;
          // Hide thinking while actively typing
          setShowThinking(false);
        } else {
          // Skip animation, move to next immediately
          setCurrentlyTypingIndex(-1);
          isTypingRef.current = false;
        }
        
        nextLogIndexRef.current = nextIndex + 1;
        
        // If not animating, start next log immediately with background-safe timing
        if (!shouldAnimate) {
          const nextLogTimer = setInterval(() => {
            clearInterval(nextLogTimer);
            startNextLog();
          }, 30);
        }
      } else {
        // Skip invalid log and try next
        nextLogIndexRef.current = nextIndex + 1;
        const nextLogTimer = setInterval(() => {
          clearInterval(nextLogTimer);
          startNextLog();
        }, 30);
      }
    } else {
      // No more logs to process
      setCurrentlyTypingIndex(-1);
      isTypingRef.current = false;
      backgroundProcessingRef.current = false;
      
      // Show thinking if still loading or processing
      if (isLoading || sessionStatusRef.current === 'processing') {
        setShowThinking(true);
      } else {
        setShowThinking(false);
      }
    }
  }, [shouldAnimateLog, isLoading]);

  // Enhanced typing completion handler
  const handleTypingComplete = useCallback((logIndex: number) => {
    if (logIndex >= 0 && logIndex < allLogsRef.current.length) {
      markLogAsAnimated(allLogsRef.current[logIndex], logIndex);
    }
    
    // Unregister animation callback
    unregisterAnimationCallback(logIndex);
    
    setCurrentlyTypingIndex(-1);
    isTypingRef.current = false;
    
    // Use setInterval for background-safe timing
    clearTypingTimeout();
    const nextLogTimer = setInterval(() => {
      clearInterval(nextLogTimer);
      startNextLog();
    }, 50); // Faster transition between logs
    
    typingTimeoutRef.current = nextLogTimer;
  }, [startNextLog, clearTypingTimeout, markLogAsAnimated, unregisterAnimationCallback]);

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

  // Enhanced visibility change handler for better background processing
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - mark that we're in background processing mode
        backgroundProcessingRef.current = true;
      } else {
        // Tab is visible - force complete current animation and catch up
        forceCompleteCurrentAnimation();
        
        // Check if we need to catch up on animations
        const hasUnprocessedLogs = nextLogIndexRef.current < allLogsRef.current.length;
        const isCurrentlyTyping = currentlyTypingIndex >= 0;
        
        if (hasUnprocessedLogs && !isCurrentlyTyping && !isTypingRef.current) {
          // Force start next log processing when tab becomes visible
          const catchUpTimer = setInterval(() => {
            clearInterval(catchUpTimer);
            startNextLog();
          }, 50);
        }
        
        // Reset background processing flag after a delay
        const resetTimer = setInterval(() => {
          clearInterval(resetTimer);
          backgroundProcessingRef.current = false;
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentlyTypingIndex, startNextLog, forceCompleteCurrentAnimation]);

  // ENHANCED: Process new logs with immediate animation completion
  useEffect(() => {
    if (!realLogs || realLogs.length === 0) {
      // Reset everything
      setProcessedLogs([]);
      setVisibleLogs([]);
      setCurrentlyTypingIndex(-1);
      setShowThinking(isLoading);
      allLogsRef.current = [];
      nextLogIndexRef.current = 0;
      isTypingRef.current = false;
      backgroundProcessingRef.current = false;
      sessionStatusRef.current = 'processing';
      currentAnimationRef.current = { logIndex: -1, forceComplete: null };
      clearTypingTimeout();
      return;
    }

    // Update session status
    const newStatus = determineSessionStatus(realLogs);
    const statusChanged = sessionStatusRef.current !== newStatus;
    sessionStatusRef.current = newStatus;

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

    // Check for new logs
    const hasNewLogs = validLogs.length > allLogsRef.current.length;
    const hasStatusChange = statusChanged && (newStatus === 'completed' || newStatus === 'failed');
    
    if (hasNewLogs || hasStatusChange) {
      // NEW: If new logs arrived and there's a current animation, force complete it
      if (hasNewLogs && isTypingRef.current) {
        console.log('New logs detected, forcing completion of current animation');
        forceCompleteCurrentAnimation();
      }
      
      allLogsRef.current = validLogs;
      setProcessedLogs(validLogs);
      
      // If we have new logs or processing just completed, ensure animations continue
      if (hasNewLogs) {
        // Mark that we're processing new content
        backgroundProcessingRef.current = true;
        
        // Start typing if not already typing and we have logs to show
        if (!isTypingRef.current && nextLogIndexRef.current < validLogs.length) {
          // Use background-safe timing
          const startTimer = setInterval(() => {
            clearInterval(startTimer);
            startNextLog();
          }, 50);
        }
      }
      
      // If processing completed, ensure all logs are displayed
      if (hasStatusChange && (newStatus === 'completed' || newStatus === 'failed')) {
        // Force completion of any remaining animations after a delay
        const completeTimer = setInterval(() => {
          clearInterval(completeTimer);
          
          // Force complete current animation first
          forceCompleteCurrentAnimation();
          
          // If there are still unprocessed logs, process them quickly
          while (nextLogIndexRef.current < validLogs.length) {
            const logIndex = nextLogIndexRef.current;
            const log = validLogs[logIndex];
            
            if (log && log.parsed_output && log.parsed_output.trim()) {
              // Add remaining logs without animation
              setVisibleLogs(prev => [...prev, { ...log, shouldAnimate: false }]);
              markLogAsAnimated(log, logIndex);
            }
            
            nextLogIndexRef.current++;
          }
          
          // Clean up states
          setCurrentlyTypingIndex(-1);
          isTypingRef.current = false;
          backgroundProcessingRef.current = false;
          currentAnimationRef.current = { logIndex: -1, forceComplete: null };
          setShowThinking(false);
        }, 300);
      }
    }
  }, [realLogs, startNextLog, clearTypingTimeout, determineSessionStatus, isLoading, markLogAsAnimated, forceCompleteCurrentAnimation]);

  // Enhanced thinking indicator logic
  useEffect(() => {
    const hasUnprocessedLogs = nextLogIndexRef.current < allLogsRef.current.length;
    const isCurrentlyTyping = currentlyTypingIndex >= 0;
    const isProcessingOrFailed = sessionStatusRef.current === 'processing' || sessionStatusRef.current === 'failed';
    const isBackgroundProcessing = backgroundProcessingRef.current;
    
    // Show thinking if:
    // 1. Currently loading and no logs yet
    // 2. Still processing/failed and not currently typing
    // 3. Has unprocessed logs and not currently typing
    // 4. Background processing is active
    if (isLoading && visibleLogs.length === 0) {
      setShowThinking(true);
    } else if (isProcessingOrFailed && !isCurrentlyTyping && !isBackgroundProcessing) {
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
      backgroundProcessingRef.current = false;
      currentAnimationRef.current = { logIndex: -1, forceComplete: null };
    };
  }, [clearTypingTimeout]);

  // Enhanced background processing monitor
  useEffect(() => {
    let monitorInterval: NodeJS.Timeout;
    
    if (backgroundProcessingRef.current || document.hidden) {
      // Monitor background processing every 100ms
      monitorInterval = setInterval(() => {
        const hasUnprocessedLogs = nextLogIndexRef.current < allLogsRef.current.length;
        const isCurrentlyTyping = isTypingRef.current;
        
        // If we have unprocessed logs and nothing is typing, restart processing
        if (hasUnprocessedLogs && !isCurrentlyTyping) {
          startNextLog();
        }
        
        // Auto-cleanup if nothing to process
        if (!hasUnprocessedLogs && !isCurrentlyTyping) {
          backgroundProcessingRef.current = false;
          clearInterval(monitorInterval);
        }
      }, 100);
    }
    
    return () => {
      if (monitorInterval) {
        clearInterval(monitorInterval);
      }
    };
  }, [startNextLog]);

  return {
    processedLogs: visibleLogs,
    currentlyTypingIndex,
    showThinking,
    handleTypingComplete,
    sessionStatus: sessionStatusRef.current,
    isBackgroundProcessing: backgroundProcessingRef.current,
    // NEW: Expose animation control functions
    registerAnimationCallback,
    unregisterAnimationCallback,
    forceCompleteCurrentAnimation
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