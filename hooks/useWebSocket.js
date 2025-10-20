import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  const { 
    maxReconnectAttempts = 5,
    reconnectInterval = 3000,
    onOpen,
    onMessage,
    onClose,
    onError 
  } = options;

  const connect = () => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        onOpen?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          onMessage?.(data);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        onClose?.();
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (err) => {
        setError(err);
        onError?.(err);
      };
    } catch (err) {
      setError(err);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (ws.current) {
      ws.current.close();
    }
  };

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [url]);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    disconnect
  };
};

// Hook specifically for presentation agent updates
export const usePresentationWebSocket = (sessionId) => {
  const [currentPhase, setCurrentPhase] = useState('planning');
  const [completedPhases, setCompletedPhases] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [agentMessages, setAgentMessages] = useState([]);

  const handleMessage = (data) => {
    switch (data.type) {
      case 'phase_started':
        setCurrentPhase(data.phase);
        break;
      case 'phase_completed':
        setCompletedPhases(prev => [...prev, data.phase]);
        break;
      case 'progress_update':
        setProgressPercentage(data.percentage);
        break;
      case 'agent_message':
        setAgentMessages(prev => [...prev, data.message]);
        break;
      case 'presentation_complete':
        setCurrentPhase('completed');
        setCompletedPhases(['planning', 'preferences', 'content', 'design', 'validation']);
        setProgressPercentage(100);
        break;
    }
  };

  const wsUrl = `ws://localhost:8000/ws/presentation/${sessionId}`;
  
  const { isConnected, sendMessage, error } = useWebSocket(wsUrl, {
    onMessage: handleMessage,
    onError: (err) => console.error('Presentation WebSocket error:', err)
  });

  return {
    isConnected,
    currentPhase,
    completedPhases,
    progressPercentage,
    agentMessages,
    sendMessage,
    error
  };
}; 