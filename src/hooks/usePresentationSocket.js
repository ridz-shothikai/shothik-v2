// hooks/usePresentationSocket.ts
import { useCallback, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function usePresentationSocket(pId, token, onAgentOutput) {
  const socketRef = useRef(null);
  const messageBufferRef = useRef([]);
  const isProcessingRef = useRef(false);

  // Process buffered messages
  const processBuffer = useCallback(() => {
    if (isProcessingRef.current || messageBufferRef.current.length === 0)
      return;

    isProcessingRef.current = true;

    while (messageBufferRef.current.length > 0) {
      const message = messageBufferRef.current.shift();
      console.log("📦 Processing buffered message:", message);

      if (onAgentOutput) {
        try {
          onAgentOutput(message);
        } catch (error) {
          console.error("❌ Error processing message:", error);
        }
      }
    }

    isProcessingRef.current = false;
  }, [onAgentOutput]);

  useEffect(() => {
    if (!pId || !token) {
      console.warn("⚠️ Missing pId or token");
      return;
    }

    const base = process.env.NEXT_PUBLIC_API_URI_SLIDE;
    if (!base) {
      console.error("❌ NEXT_PUBLIC_API_URI_SLIDE not configured");
      return;
    }

    console.log("🔌 Creating socket connection:", { pId, base });

    // Create socket with proper configuration
    const socket = io(base, {
      transports: ["websocket", "polling"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: true, // Force new connection
      query: {
        p_id: pId,
        token: token,
      },
    });

    socketRef.current = socket;

    // 🔥 CRITICAL: Register agent_output handler FIRST, before any other events
    socket.onAny((eventName, ...args) => {
      console.log(`🎯 [ANY EVENT] ${eventName}:`, args);
    });

    socket.on("agent_output", (message) => {
      console.log("📨 !!!! AGENT OUTPUT RECEIVED !!!!", message);

      // Buffer the message immediately
      messageBufferRef.current.push(message);

      // Process buffer
      processBuffer();
    });

    // Other event handlers
    socket.on("connect", () => {
      console.log("✅ Socket CONNECTED:", socket.id);
      console.log("   - Transport:", socket.io.engine.transport.name);
      console.log("   - Query params:", { p_id: pId });

      // Process any buffered messages after connection
      setTimeout(processBuffer, 100);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", {
        message: error.message,
        type: error.type,
        description: error.description,
      });
    });

    socket.on("connected", (payload) => {
      console.log("🎉 Server welcome:", payload);
    });

    socket.on("subscribed", (data) => {
      console.log("✅ Subscribed:", data);
    });

    socket.on("message", (data) => {
      console.log("📬 Message:", data);
    });

    socket.on("error", (err) => {
      console.error("❌ Socket error:", err);
    });

    socket.on("disconnect", (reason, details) => {
      console.log("🔌 Disconnected:", reason, details);

      // If server disconnects us, try manual reconnect
      if (reason === "io server disconnect") {
        console.log("🔄 Server kicked us, reconnecting...");
        setTimeout(() => {
          socket.connect();
        }, 1000);
      }
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Reconnection attempt #${attemptNumber}`);
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ Reconnection error:", error);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ All reconnection attempts failed");
    });

    // Connect
    console.log("🚀 Initiating connection...");
    socket.connect();

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up socket");

      // Process any remaining buffered messages
      processBuffer();

      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      messageBufferRef.current = [];
    };
  }, [pId, token, onAgentOutput, processBuffer]);

  const subscribe = useCallback((p_id) => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      console.warn("⚠️ Cannot subscribe - socket not connected");
      return;
    }

    console.log("📤 Subscribing to:", p_id);
    socket.emit("subscribe_presentation", { p_id });
  }, []);

  const sendPing = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected) return;

    socket.emit("ping", { timestamp: new Date().toISOString() });
  }, []);

  return {
    subscribe,
    sendPing,
    socketRef,
    isConnected: socketRef.current?.connected || false,
  };
}
