// hooks/useResearchStream.js
import { useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startStreaming,
  addStreamEvent,
  updateStreamingMessage,
  finishResearch,
  setError,
} from "../redux/slice/researchCoreSlice";
import { addMessage } from "../redux/slice/researchChatSlice";

export const useResearchStream = () => {
  const dispatch = useDispatch();
  const { currentChatId } = useSelector((state) => state.researchChat);
  const { isStreaming, jobId } = useSelector((state) => state.researchCore);
  const abortControllerRef = useRef(null);

  console.log("currentChatId -->", currentChatId);

  const startResearch = useCallback(
    async (query, config = {}) => {
      if (!currentChatId) {
        dispatch(setError("No chat selected"));
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

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(
          "http://163.172.172.38:3040/api/research/create_research_queue",
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

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let finalAnswer = "";
        let finalSources = [];
        let finalImages = [];

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

                  console.log("Stream event:", event);

                  if (event.step === "error") {
                    throw new Error(event.error);
                  }

                  if (event.step) {
                    dispatch(addStreamEvent(event));
                  }
                  if (event.step === "completed") {
                    console.log("inside completed", event.step.data);
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

        // console.log("events data", finalAnswer, finalSources, finalImages);


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
            id: newJobId,
            query,
            answer: finalAnswer,
            sources: finalSources,
            images: finalImages,
            timestamp: new Date().toISOString(),
            _id: `temp-${Date.now()}`, // Temporary ID until server responds
          })
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          dispatch(setError(error.message));
        }
      }
    },
    [currentChatId, dispatch]
  );

  const cancelResearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    startResearch,
    cancelResearch,
    isStreaming,
    jobId,
  };
};
