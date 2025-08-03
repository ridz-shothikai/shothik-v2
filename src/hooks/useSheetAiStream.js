// hooks/useSheetAiStream.js
import { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import sheetAiStreamService from '../services/sheetAiStreamService';
import { setSheetState } from '../redux/slice/sheetSlice';

export const useSheetAiStream = () => {
  const dispatch = useDispatch();
  const sheetState = useSelector(state => state.sheet);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [error, setError] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [streamingStats, setStreamingStats] = useState({
    startTime: null,
    duration: 0,
    messagesReceived: 0,
    bytesReceived: 0
  });

  const streamingRef = useRef(false);
  const statsIntervalRef = useRef(null);

  // Start streaming with comprehensive callbacks
  const startStreaming = useCallback(async (chatId, prompt, userEmail) => {
    if (streamingRef.current) {
      console.warn('Stream already active');
      return;
    }

    try {
      setIsStreaming(true);
      setError(null);
      setConnectionState('connecting');
      streamingRef.current = true;
      
      const startTime = Date.now();
      setStreamingStats({
        startTime,
        duration: 0,
        messagesReceived: 0,
        bytesReceived: 0
      });

      // Start stats tracking
      statsIntervalRef.current = setInterval(() => {
        setStreamingStats(prev => ({
          ...prev,
          duration: Date.now() - startTime
        }));
      }, 1000);

      // Reset sheet state
      dispatch(setSheetState({
        logs: [],
        sheet: [],
        status: 'connecting',
        title: 'Connecting...'
      }));

      const eventSource = sheetAiStreamService.startConversationStream(
        null, // conversationId will be set by backend
        chatId,
        prompt,
        userEmail,
        {
          onOpen: () => {
            setConnectionState('connected');
            dispatch(setSheetState({
              status: 'connected',
              title: 'Connected - Initializing...'
            }));
          },

          onConnection: (data) => {
            console.log('Connection established:', data);
            setConnectionState('connected');
            dispatch(setSheetState({
              status: 'generating',
              title: 'Starting generation...'
            }));
          },

          onProgress: (data) => {
            console.log('Progress update:', data);
            setStreamingStats(prev => ({
              ...prev,
              messagesReceived: prev.messagesReceived + 1,
              bytesReceived: prev.bytesReceived + JSON.stringify(data).length
            }));

            dispatch(setSheetState({
              status: 'generating',
              title: data.message || 'Generating...'
            }));
          },

          onData: (data) => {
            console.log('Data received:', data);
            setStreamingStats(prev => ({
              ...prev,
              messagesReceived: prev.messagesReceived + 1,
              bytesReceived: prev.bytesReceived + JSON.stringify(data).length
            }));

            // Update sheet data
            if (data.sheet) {
              dispatch(setSheetState({
                sheet: data.sheet,
                status: 'generating',
                title: data.title || 'Generating sheet...'
              }));
            }
          },

          onLogs: (data) => {
            console.log('Logs received:', data);
            setStreamingStats(prev => ({
              ...prev,
              messagesReceived: prev.messagesReceived + 1
            }));

            // Update logs
            if (data.logs) {
              dispatch(setSheetState({
                logs: Array.isArray(data.logs) ? data.logs : [data.logs],
                status: 'generating'
              }));
            }
          },

          onSheetUpdate: (data) => {
            console.log('Sheet update:', data);
            setStreamingStats(prev => ({
              ...prev,
              messagesReceived: prev.messagesReceived + 1,
              bytesReceived: prev.bytesReceived + JSON.stringify(data).length
            }));

            // Update complete sheet state
            dispatch(setSheetState({
              sheet: data.sheet || [],
              logs: data.logs || [],
              status: 'generating',
              title: data.title || 'Updating sheet...'
            }));
          },

          onComplete: (data) => {
            console.log('Generation complete:', data);
            setIsStreaming(false);
            setConnectionState('disconnected');
            streamingRef.current = false;
            
            if (statsIntervalRef.current) {
              clearInterval(statsIntervalRef.current);
            }

            dispatch(setSheetState({
              sheet: data.sheet || sheetState.sheet,
              logs: data.logs || sheetState.logs,
              status: 'completed',
              title: data.title || 'Generation Complete'
            }));

            setCurrentConversationId(data.conversationId);
          },

          onError: (error) => {
            console.error('Stream error:', error);
            setError(error);
            setIsStreaming(false);
            setConnectionState('error');
            streamingRef.current = false;
            
            if (statsIntervalRef.current) {
              clearInterval(statsIntervalRef.current);
            }

            dispatch(setSheetState({
              status: 'error',
              title: 'Error occurred'
            }));
          },

          onDisconnect: () => {
            console.log('Stream disconnected');
            setConnectionState('disconnected');
            streamingRef.current = false;
            
            if (statsIntervalRef.current) {
              clearInterval(statsIntervalRef.current);
            }
          },

          onReconnecting: () => {
            console.log('Attempting to reconnect...');
            setConnectionState('reconnecting');
            dispatch(setSheetState({
              status: 'reconnecting',
              title: 'Reconnecting...'
            }));
          },

          onMaxReconnectAttemptsReached: () => {
            console.log('Max reconnection attempts reached');
            setError(new Error('Connection lost. Please try again.'));
            setIsStreaming(false);
            setConnectionState('failed');
            streamingRef.current = false;
            
            dispatch(setSheetState({
              status: 'failed',
              title: 'Connection Failed'
            }));
          }
        }
      );

      return eventSource;
    } catch (error) {
      console.error('Failed to start streaming:', error);
      setError(error);
      setIsStreaming(false);
      setConnectionState('error');
      streamingRef.current = false;
      
      dispatch(setSheetState({
        status: 'error',
        title: 'Failed to start'
      }));
      
      throw error;
    }
  }, [dispatch, sheetState.sheet, sheetState.logs]);

  // Stop streaming
  const stopStreaming = useCallback(async () => {
    try {
      if (currentConversationId) {
        await sheetAiStreamService.stopConversation(currentConversationId);
      }
      
      sheetAiStreamService.disconnect();
      setIsStreaming(false);
      setConnectionState('disconnected');
      streamingRef.current = false;
      
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }

      dispatch(setSheetState({
        status: 'cancelled',
        title: 'Generation Cancelled'
      }));
    } catch (error) {
      console.error('Failed to stop streaming:', error);
      setError(error);
    }
  }, [currentConversationId, dispatch]);

  // Health check
  const checkHealth = useCallback(async () => {
    try {
      const health = await sheetAiStreamService.healthCheck();
      return health;
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamingRef.current) {
        sheetAiStreamService.disconnect();
      }
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
    };
  }, []);

  // Monitor connection state
  useEffect(() => {
    const interval = setInterval(() => {
      const state = sheetAiStreamService.getConnectionState();
      setConnectionState(state);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    // State
    isStreaming,
    connectionState,
    error,
    streamingStats,
    sheetState,
    
    // Actions
    startStreaming,
    stopStreaming,
    checkHealth,
    clearError,
    
    // Utilities
    canStartStreaming: !isStreaming && connectionState !== 'connecting',
    canStopStreaming: isStreaming || connectionState === 'connected'
  };
};
