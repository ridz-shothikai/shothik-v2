"use client";

import { useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startStreaming,
  addStreamEvent,
  finishResearch,
  setError,
  setPollingMode,
  setConnectionStatus,
  setStreamingMode,
} from "../redux/slice/researchCoreSlice";
import { addMessage } from "../redux/slice/researchChatSlice";
import { useConnectionState } from "./useConnectionState";
import { QueueStatusService } from "../services/queueStatusService";
import store from "../redux/store";

export const useResearchStream = () => {
  const dispatch = useDispatch();
  const { currentChatId } = useSelector((state) => state.researchChat);
  const { isStreaming, jobId, isPolling, researches } = useSelector(
    (state) => state.researchCore
  );
  const abortControllerRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const {
    storeConnectionMetadata,
    getStoredMetadata,
    clearConnectionMetadata,
    isConnectionInterrupted,
  } = useConnectionState();

  // Recovery and polling logic

  const handleCompletedJob = useCallback(
    async (jobStatus) => {
      // CRITICAL: Clear polling state FIRST
      dispatch(setPollingMode(false));
      dispatch(setStreamingMode(false));

      // Clear interval if it still exists
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      // Check if this research already exists in state to prevent duplicates
      const currentState = store.getState();
      const existingResearches = currentState.researchCore.researches;
      const existingResearch = existingResearches?.find(
        (research) => research._id === jobStatus.result?._id
      );

      if (existingResearch) {
        console.log("Research already exists, skipping duplicate addition");
        clearConnectionMetadata();
        dispatch(setConnectionStatus("connected"));
        return;
      }

      const result = jobStatus.result;
      if (result) {
        // Add AI message for completed research
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: result.result,
          sources: result.sources || [],
          images: result.images || [],
          timestamp: new Date().toISOString(),
        };

        dispatch(addMessage(aiMessage));
        dispatch(
          finishResearch({
            id: result._id,
            query: result.query,
            result: result.result,
            sources: result.sources || [],
            images: result.images || [],
            timestamp: result.createdAt,
            _id: result._id,
          })
        );
      }

      clearConnectionMetadata();
      dispatch(setConnectionStatus("connected"));
    },
    [dispatch, clearConnectionMetadata]
  );

  const startPollingMode = useCallback(
    async (targetJobId) => {
      // Clear any existing polling first
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      dispatch(startStreaming({ jobId: targetJobId }));
      dispatch(setPollingMode(true));
      dispatch(setConnectionStatus("polling"));

      let pollCount = 0;
      const maxPolls = 300;
      let isPolling = false;
      let shouldContinuePolling = true;

      const poll = async () => {
        // CRITICAL: Check if polling should continue BEFORE doing anything
        if (!shouldContinuePolling || isPolling) return;

        isPolling = true;

        try {
          const jobStatus = await QueueStatusService.getJobStatus(targetJobId);

          // CRITICAL: Double-check after async call
          if (!shouldContinuePolling) {
            isPolling = false;
            return;
          }

          if (QueueStatusService.isJobCompleted(jobStatus)) {
            // CRITICAL: flag and clear interval BEFORE handling completion
            shouldContinuePolling = false;

            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            // Set polling to false in Redux BEFORE handling completion
            dispatch(setPollingMode(false));

            await handleCompletedJob(jobStatus);
            return;
          }

          if (QueueStatusService.isJobFailed(jobStatus)) {
            shouldContinuePolling = false;

            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            dispatch(setError("Research job failed"));
            dispatch(setPollingMode(false));
            dispatch(setConnectionStatus("failed"));
            clearConnectionMetadata();
            return;
          }

          // Update streaming indicator with current progress
          if (jobStatus?.progress) {
            dispatch(
              addStreamEvent({
                step: jobStatus.progress.step,
                data: jobStatus.progress.data,
                timestamp: jobStatus.progress.timestamp,
                researchId: jobStatus.progress.researchId,
              })
            );
          }

          pollCount++;

          if (pollCount === 30) {
            if (pollingIntervalRef.current && shouldContinuePolling) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = setInterval(poll, 5000);
            }
          }

          if (pollCount >= maxPolls) {
            shouldContinuePolling = false;

            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            dispatch(setError("Polling timeout - please refresh the page"));
            dispatch(setPollingMode(false));
            dispatch(setConnectionStatus("timeout"));
          }
        } catch (error) {
          console.error("Polling error:", error);
          reconnectAttemptsRef.current++;

          if (reconnectAttemptsRef.current >= 5) {
            shouldContinuePolling = false;

            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            dispatch(setError("Failed to reconnect to research stream"));
            dispatch(setPollingMode(false));
            dispatch(setConnectionStatus("failed"));
          }
        } finally {
          isPolling = false;
        }
      };

      // Start polling immediately
      await poll();

      // Only set interval if we should continue polling
      if (shouldContinuePolling) {
        pollingIntervalRef.current = setInterval(poll, 3000);
      }
    },
    [dispatch, handleCompletedJob, clearConnectionMetadata]
  ); 

  const checkAndRecoverConnection = useCallback(async () => {
    const storedJobId = sessionStorage.getItem("currentResearchJobId");
    if (!storedJobId) return false;

    try {
      const jobStatus = await QueueStatusService.getJobStatus(storedJobId);

      if (QueueStatusService.isJobCompleted(jobStatus)) {
        await handleCompletedJob(jobStatus);
        return true;
      }

      if (QueueStatusService.isJobActive(jobStatus)) {
        await startPollingMode(storedJobId);
        return true;
      }

      if (QueueStatusService.isJobFailed(jobStatus)) {
        dispatch(setError("Research job failed"));
        clearConnectionMetadata();
        return false;
      }
    } catch (error) {
      console.error("Failed to recover connection:", error);
    }

    return false;
  }, [dispatch, clearConnectionMetadata, startPollingMode, handleCompletedJob]);

  const startResearch = useCallback(
    async (query, config = {}) => {
      if (!currentChatId) {
        dispatch(setError("No chat selected"));
        return;
      }

      // Check if there's already an active research
      const hasActive = await QueueStatusService.hasActiveResearch();
      if (hasActive) {
        console.log("Active research detected, attempting recovery...");
        await checkAndRecoverConnection();
        return;
      }

      // Add human message
      const humanMessage = {
        id: Date.now().toString(),
        type: "human",
        content: query,
        timestamp: new Date().toISOString(),
      };
      dispatch(addMessage(humanMessage));

      // Start streaming
      const newJobId = `research-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;

      dispatch(startStreaming({ jobId: newJobId }));
      dispatch(setConnectionStatus("connecting"));

      // Store connection metadata immediately
      storeConnectionMetadata(newJobId);

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX}/deep-research/research/create_research_queue`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
              chat: currentChatId,
              query,
              config: {
                query_generator_model: "gemini-2.0-flash",
                reflection_model: "gemini-2.0-flash",
                answer_model: "gemini-2.0-flash",
                number_of_initial_queries:
                  config.effort === "low"
                    ? 1
                    : config.effort === "medium"
                    ? 2
                    : 3,
                max_research_loops:
                  config.effort === "low"
                    ? 1
                    : config.effort === "medium"
                    ? 2
                    : 3,
              },
            }),
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        dispatch(setConnectionStatus("connected"));

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let finalAnswer = "";
        let finalSources = [];
        let finalImages = [];
        let actualJobId = newJobId;

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const event = JSON.parse(line);

                  if (event.step === "error") {
                    throw new Error(event.error);
                  }

                  if (event.step) {
                    dispatch(addStreamEvent(event));

                    // Update stored metadata with latest step
                    if (event.data?.jobId) {
                      actualJobId = event.data.jobId;
                      storeConnectionMetadata(actualJobId, event.step);
                    }
                  }

                  if (event.step === "completed") {
                    finalAnswer = event.data.result || event.answer;
                    finalSources = event.data.sources || [];
                    finalImages = event.data.images || [];
                  }
                } catch (parseError) {
                  console.error("Failed to parse stream event:", parseError);
                }
              }
            }
          }
        }

        // Add AI message and finish research
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: finalAnswer,
          sources: finalSources,
          images: finalImages,
          timestamp: new Date().toISOString(),
        };

        dispatch(addMessage(aiMessage));
        dispatch(
          finishResearch({
            id: actualJobId,
            query,
            result: finalAnswer,
            sources: finalSources,
            images: finalImages,
            timestamp: new Date().toISOString(),
            _id: `temp-${Date.now()}`,
          })
        );

        // Clear metadata on successful completion
        clearConnectionMetadata();
      } catch (error) {
        if (error.name !== "AbortError") {
          dispatch(setError(error.message));
          dispatch(setConnectionStatus("failed"));

          // Don't clear metadata on error - might need for recovery
          console.log(
            "Stream error, metadata preserved for potential recovery"
          );
        }
      }
    },
    [
      currentChatId,
      dispatch,
      storeConnectionMetadata,
      clearConnectionMetadata,
      checkAndRecoverConnection,
    ]
  );

  const cancelResearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear interval and reset reference
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Update state
    dispatch(setPollingMode(false));
    dispatch(setConnectionStatus("disconnected"));
    reconnectAttemptsRef.current = 0;

    clearConnectionMetadata();
  }, [clearConnectionMetadata, dispatch]);

  const manualReconnect = useCallback(async () => {
    reconnectAttemptsRef.current = 0;
    dispatch(setConnectionStatus("reconnecting"));
    const recovered = await checkAndRecoverConnection();
    if (!recovered) {
      dispatch(setConnectionStatus("failed"));
    }
  }, [checkAndRecoverConnection, dispatch]);

  // Check for interrupted connections on hook initialization
  useEffect(() => {
    const checkInterrupted = async () => {
      if (isConnectionInterrupted()) {
        console.log("Interrupted connection detected, attempting recovery...");
        await checkAndRecoverConnection();
      }
    };

    checkInterrupted();
  }, [isConnectionInterrupted, checkAndRecoverConnection]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null; // Add this line
      }
      // Clear any stored connection metadata on unmount
      clearConnectionMetadata();
    };
  }, [clearConnectionMetadata]);

  return {
    startResearch,
    cancelResearch,
    manualReconnect,
    checkAndRecoverConnection,
    isStreaming,
    isPolling,
    jobId,
  };
};
