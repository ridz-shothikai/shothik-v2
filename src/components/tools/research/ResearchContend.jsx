"use client";
import { useChat } from "@ai-sdk/react";
import { Box, Stack, Typography } from "@mui/material";
import * as motion from "motion/react-client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useSnackbar from "../../../hooks/useSnackbar";
import {
  useGetResearchQuestionMutation,
  useResearchTrendingQuery,
} from "../../../redux/api/tools/toolsApi";
import FormComponent from "./form-component";
import RenderPart from "./RenderPart";
import Suggestion from "./Suggestion";
import { SuggestionCards } from "./SuggetionCard";
import UserMessage from "./UserMessage";

const ResearchContend = () => {
  const [selectedModel, setSelectedModel] = useState("shothik-brain-1.0");
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isBottomVisible, setIsBottomVisible] = useState(false);
  const { accessToken } = useSelector((state) => state.auth);
  const [getResearchQuestion] = useGetResearchQuestionMutation();
  const { data: trendingQueries } = useResearchTrendingQuery();
  const [selectedGroup, setSelectedGroup] = useState("web");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [outputContend, setOutputContend] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [userInput, setUserInput] = useState("");
  const lastSubmittedQueryRef = useRef();
  const enqueueSnackbar = useSnackbar();
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const chatOptions = useMemo(
    () => ({
      api: process.env.NEXT_PUBLIC_API_URI + "/research",
      maxSteps: 5,
      experimental_throttle: 500,
      body: {
        model: selectedModel,
        group: selectedGroup,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      onFinish: async (message, { finishReason }) => {
        console.log("[finish reason]:", finishReason);
        if (
          message.content &&
          (finishReason === "stop" || finishReason === "length")
        ) {
          const newHistory = [
            { role: "user", content: lastSubmittedQueryRef.current },
            { role: "assistant", content: message.content },
          ];
          const data = await getResearchQuestion({
            history: newHistory,
          }).unwrap();
          console.log("question: ", data);
          setSuggestedQuestions(data.questions);
        }
      },
      onError: (error) => {
        console.error("Chat error:", error.cause, error.message);
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
        });
      },
    }),
    [accessToken, selectedModel, selectedGroup]
  );

  const { messages, append, reload, stop } = useChat(chatOptions);

  async function fetchWithStreaming() {
    try {
      setIsLoading(true);
      const payload = {
        messages: [{ role: "user", content: userInput }],
        model: selectedModel,
        group: selectedGroup,
      };

      setOutputContend((prev) => {
        return [...prev, { role: "user", content: userInput, images: [] }];
      });

      const url = process.env.NEXT_PUBLIC_API_URI + "/research";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw { message: error.message, error: error.error };
      }

      const stream = response.body;
      const decoder = new TextDecoderStream();
      const reader = stream.pipeThrough(decoder).getReader();

      setIsLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        if (value.startsWith("0:")) {
          setOutputContend((prev) => {
            return prev.map((item, index) => {
              const cleanedValue = value.replaceAll("0: ", "");

              console.log(cleanedValue);
              if (index === prev.length - 1) {
                if (cleanedValue) {
                  return {
                    ...item,
                    data: item.data + cleanedValue,
                  };
                } else {
                  return item;
                }
              }
              return item;
            });
          });
        } else {
          try {
            if (value.startsWith("inovation:")) {
              const data = JSON.parse(value.replace("inovation:", ""));
              const message = {
                role: "assistant",
                type: "tool-invocation",
                data,
              };
              setOutputContend((prev) => {
                return [
                  ...prev,
                  message,
                  { role: "assistant", type: "text", data: "" },
                ];
              });
            }
          } catch (error) {
            throw error;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (bottomRef.current) {
        const bottomRefBottom =
          bottomRef.current.getBoundingClientRect().bottom;
        console.log(bottomRefBottom);
        setIsBottomVisible(bottomRefBottom < 800);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const handleExampleClick = async (card) => {
    const exampleText = card.text;
    lastSubmittedQueryRef.current = exampleText;
    setHasSubmitted(true);
    setSuggestedQuestions([]);
    await append({
      content: exampleText.trim(),
      role: "user",
    });
  };

  const handleSuggestedQuestionClick = async (question) => {
    setHasSubmitted(true);
    setSuggestedQuestions([]);
    await append({
      content: question.trim(),
      role: "user",
    });
  };
  const handleModelChange = (newModel) => {
    setSelectedModel(newModel);
    setSuggestedQuestions([]);
    reload({ body: { model: newModel } });
  };

  const memoizedMessages = useMemo(() => {
    // Create a shallow copy
    const msgs = [...messages];

    return msgs.filter((message) => {
      // Keep all user messages
      if (message.role === "user") return true;

      // For assistant messages
      if (message.role === "assistant") {
        // Keep messages that have tool invocations
        if (message.parts?.some((part) => part.type === "tool-invocation")) {
          return true;
        }
        // Keep messages that have text parts but no tool invocations
        if (
          message.parts?.some((part) => part.type === "text") ||
          !message.parts?.some((part) => part.type === "tool-invocation")
        ) {
          return true;
        }
        return false;
      }
      return false;
    });
  }, [messages]);

  return (
    <Box sx={{ width: { xs: "100%", lg: "55%" }, mx: "auto", mt: 2 }}>
      {!hasSubmitted && (
        <Typography variant='h4' sx={{ textAlign: "center", mb: 2 }}>
          What do you want to explore?
        </Typography>
      )}
      {!hasSubmitted && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <FormComponent
            input={userInput}
            setInput={setUserInput}
            attachments={attachments}
            setAttachments={setAttachments}
            hasSubmitted={hasSubmitted}
            setHasSubmitted={setHasSubmitted}
            isLoading={isLoading}
            handleSubmit={fetchWithStreaming}
            fileInputRef={fileInputRef}
            inputRef={inputRef}
            stop={stop}
            messages={messages}
            append={append}
            selectedModel={selectedModel}
            setSelectedModel={handleModelChange}
            resetSuggestedQuestions={() => setSuggestedQuestions([])}
            lastSubmittedQueryRef={lastSubmittedQueryRef}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            showExperimentalModels={true}
          />
          <SuggestionCards
            trendingQueries={trendingQueries}
            handleExampleClick={handleExampleClick}
          />
        </motion.div>
      )}

      <Stack gap={1} sx={{ mb: 5 }}>
        {outputContend.map((message, index) =>
          message.role === "user" ? (
            <UserMessage key={index} message={message} />
          ) : (
            <RenderPart
              key={index}
              group={selectedGroup}
              isLoading={isLoading}
              data={message}
            />
          )
        )}
        {suggestedQuestions.length ? (
          <Suggestion
            handleSuggestedQuestionClick={handleSuggestedQuestionClick}
            suggestedQuestions={suggestedQuestions}
          />
        ) : null}
      </Stack>
      <div ref={bottomRef} />
    </Box>
  );
};

export default ResearchContend;
