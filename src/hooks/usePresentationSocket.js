/**
 * Presentation Socket Hook
 *
 * Manages WebSocket connection for presentation generation.
 * Handles event parsing and Redux state updates.
 *
 * @module usePresentationSocket
 */

import {
  addLog,
  selectPresentation,
  setMetadata,
  setSessionData,
  setStatus,
  updateLog,
  updateSlide,
} from "@/redux/slice/presentationSlice";
import {
  parseAgentOutput,
  parseConnectedEvent,
  parseTerminalEvent,
} from "@/utils/presentationDataParser";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

/**
 * Custom hook for managing presentation WebSocket connection
 *
 * @param {string} pId - Presentation ID
 * @param {string} token - Authentication token
 * @returns {Object} Socket utilities and connection status
 */
export default function usePresentationSocket(pId, token) {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const messageBufferRef = useRef([]);
  const isProcessingRef = useRef(false);

  // IMPORTANT: Use ref to avoid stale closure issues
  const presentationStateRef = useRef(null);
  const presentation = useSelector(selectPresentation);

  // Update ref whenever state changes (doesn't cause re-render)
  useEffect(() => {
    presentationStateRef.current = presentation;
  }, [presentation]);

  /**
   * Process a single agent_output message
   */
  const processAgentOutputMessage = useCallback(
    (message) => {
      console.log("[Socket] Processing agent_output:", {
        author: message.author,
        type: message.type,
      });

      try {
        // Use ref to get current state
        const parsed = parseAgentOutput(message, presentationStateRef.current);

        console.log("[Socket] Parsed result:", parsed);

        // Dispatch actions based on parsed type
        switch (parsed.type) {
          case "log":
            dispatch(addLog(parsed.data));
            break;

          case "log_with_metadata":
            dispatch(addLog(parsed.data));
            if (parsed.metadata) {
              dispatch(setMetadata(parsed.metadata));
            }
            break;

          case "browser_worker":
            // FIXED: Check updateType, not type
            if (parsed.updateType === "update") {
              console.log(
                "[Socket] Updating browser worker log at index:",
                parsed.logIndex,
              );
              dispatch(
                updateLog({
                  logIndex: parsed.logIndex,
                  logEntry: parsed.logEntry,
                }),
              );
            } else if (parsed.updateType === "create") {
              console.log(
                "[Socket] Creating new browser worker log:",
                parsed.logEntry.author,
              );
              dispatch(addLog(parsed.logEntry));
            }

            if (parsed.isComplete) {
              console.log(
                "[Socket] ✅ Browser worker completed:",
                parsed.logEntry.author,
              );
            }
            break;

          case "slide":
            // FIXED: Check updateType properly
            console.log("[Socket] Processing slide:", {
              updateType: parsed.updateType,
              slideNumber: parsed.slideEntry.slideNumber,
              hasThinking: !!parsed.slideEntry.thinking,
              hasHtml: !!parsed.slideEntry.htmlContent,
              isComplete: parsed.slideEntry.isComplete,
            });

            dispatch(
              updateSlide({
                type: parsed.updateType, // 'create' or 'update'
                slideIndex: parsed.slideIndex,
                slideEntry: parsed.slideEntry,
              }),
            );

            if (parsed.slideEntry.isComplete) {
              console.log(
                "[Socket] ✅ Slide completed:",
                parsed.slideEntry.slideNumber,
              );
            }
            break;

          default:
            console.warn("[Socket] Unknown parsed type:", parsed.type);
        }
      } catch (error) {
        console.error("[Socket] Error processing agent_output:", error);
        console.error("[Socket] Message that caused error:", message);
      }
    },
    [dispatch],
  );

  /**
   * Process buffered messages sequentially
   * FIXED: Stable dependencies
   */
  const processBuffer = useCallback(() => {
    if (isProcessingRef.current || messageBufferRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;

    console.log(
      `[Socket] Processing ${messageBufferRef.current.length} buffered messages`,
    );

    while (messageBufferRef.current.length > 0) {
      const message = messageBufferRef.current.shift();

      try {
        processAgentOutputMessage(message);
      } catch (error) {
        console.error("[Socket] Error processing buffered message:", error);
      }
    }

    isProcessingRef.current = false;
  }, [processAgentOutputMessage]); // Now stable since processAgentOutputMessage is stable

  /**
   * Initialize WebSocket connection
   * FIXED: Stable dependencies - only pId, token, dispatch
   */
  useEffect(() => {
    if (!pId || !token) {
      console.warn("[Socket] ⚠️ Missing pId or token");
      return;
    }

    const base = process.env.NEXT_PUBLIC_API_URI_SLIDE;
    if (!base) {
      console.error("[Socket] ❌ NEXT_PUBLIC_API_URI_SLIDE not configured");
      return;
    }

    console.log("[Socket] 🔌 Initializing NEW socket connection:", { pId });

    const socket = io(base, {
      transports: ["websocket", "polling"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: true,
      query: {
        p_id: pId,
        token: token,
      },
    });

    socketRef.current = socket;

    // All event handlers here...
    socket.on("connect", () => {
      console.log("[Socket] ✅ CONNECTED:", socket.id);
      dispatch(setStatus({ status: "streaming" }));
      setTimeout(() => processBuffer(), 100);
    });

    socket.on("connected", (payload) => {
      console.log("[Socket] 🎉 Server welcome:", payload);
      const sessionData = parseConnectedEvent(payload);
      dispatch(setSessionData(sessionData));
    });

    socket.on("agent_output", (message) => {
      console.log("[Socket] 📨 AGENT OUTPUT:", message.author);
      if (message.type === "terminal" || message.event === "completed") {
        const terminalData = parseTerminalEvent(message);
        dispatch(
          setStatus({
            status: terminalData.status,
            presentationStatus: terminalData.status,
          }),
        );

        setTimeout(() => socket?.disconnect(), 1000);
      } else {
        messageBufferRef.current.push(message);
        processBuffer();
      }
    });

    socket.on("message", (data) => {});

    socket.on("disconnect", (reason) => {
      console.log("[Socket] 🔌 Disconnected:", reason);
    });

    // Connect
    console.log("[Socket] 🚀 Connecting...");
    socket.connect();

    // Cleanup
    return () => {
      console.log("[Socket] 🧹 Cleanup - disconnecting");

      if (messageBufferRef.current.length > 0) {
        processBuffer();
      }

      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      messageBufferRef.current = [];
    };
  }, [pId, token, dispatch]);

  /**
   * Subscribe to presentation updates
   * @param {string} p_id - Presentation ID to subscribe to
   */
  const subscribe = useCallback((p_id) => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      console.warn("[Socket] ⚠️ Cannot subscribe - socket not connected");
      return;
    }

    console.log("[Socket] 📤 Subscribing to:", p_id);
    socket.emit("subscribe_presentation", { p_id });
  }, []);

  /**
   * Send ping to keep connection alive
   */
  const sendPing = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected) return;

    socket.emit("ping", { timestamp: new Date().toISOString() });
  }, []);

  /**
   * Manually disconnect socket
   */
  const disconnect = useCallback(() => {
    const socket = socketRef.current;
    if (socket) {
      console.log("[Socket] 🔌 Manual disconnect");
      socket.disconnect();
    }
  }, []);

  return {
    subscribe,
    sendPing,
    disconnect,
    socketRef,
    isConnected: socketRef.current?.connected || false,
  };
}
