"use client";
import { Box, Stack, Typography } from "@mui/material";
import * as motion from "motion/react-client";
import React, { useEffect, useRef, useState } from "react";
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

const ResearchComponent = () => {
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

  async function fetchWithStreaming(content) {
    try {
      const payload = {
        messages: [{ role: "user", content }],
        model: selectedModel,
        group: selectedGroup,
      };

      const invocationMessage = {
        role: "assistant",
        type: "tool-invocation",
        content: "",
      };
      const userMessage = { role: "user", type: "message", content: content };

      setOutputContend((prev) => {
        return [...prev, userMessage, invocationMessage];
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        if (value.startsWith("0:")) {
          setOutputContend((prev) => {
            return prev.map((item, index) => {
              const cleanedValue = value.replaceAll("0: ", "");
              if (index === prev.length - 1) {
                if (cleanedValue) {
                  return {
                    ...item,
                    content: item.content + cleanedValue,
                  };
                } else {
                  return item;
                }
              }
              return item;
            });
          });
        } else if (value.startsWith("inovation:")) {
          try {
            const content = JSON.parse(value.replace("inovation:", ""));
            console.log({ content });
            const TextMessage = {
              role: "assistant",
              type: "text",
              content: "",
            };
            setOutputContend((prev) => {
              const updatedPrev = [...prev];
              updatedPrev[prev.length - 1] = {
                ...updatedPrev[prev.length - 1],
                content,
              };

              return [...updatedPrev, TextMessage];
            });
          } catch (error) {
            throw error;
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async function handleSubmit(content = userInput) {
    try {
      setIsLoading(true);
      await fetchWithStreaming(content);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const history = outputContend[outputContend.length - 1]?.content;
    if (!history) return;
    (async () => {
      try {
        const res = await getResearchQuestion({ history }).unwrap();
        setSuggestedQuestions(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (bottomRef.current) {
        const bottomRefBottom =
          bottomRef.current.getBoundingClientRect().bottom;
        // console.log(bottomRefBottom);
        setIsBottomVisible(bottomRefBottom < 800);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // useEffect(() => {
  //   if (bottomRef.current) {
  //     bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  //   }
  // }, [outputContend]);

  const handleExampleClick = async (card) => {
    const exampleText = card.text;
    lastSubmittedQueryRef.current = exampleText;
    setHasSubmitted(true);
    setSuggestedQuestions([]);
  };

  const handleSuggestedQuestionClick = async (question) => {
    setSuggestedQuestions([]);
    handleSubmit(question);
  };

  const handleModelChange = (newModel) => {
    setSelectedModel(newModel);
    setSuggestedQuestions([]);
  };

  return (
    <>
      {!hasSubmitted ? (
        <Stack>
          <Typography
            component={motion.p}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            variant='h4'
            sx={{ textAlign: "center", mb: 2 }}
          >
            What do you want to explore?
          </Typography>
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
              handleSubmit={handleSubmit}
              fileInputRef={fileInputRef}
              inputRef={inputRef}
              selectedModel={selectedModel}
              setSelectedModel={handleModelChange}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
            />
            <SuggestionCards
              trendingQueries={trendingQueries}
              handleExampleClick={handleExampleClick}
            />
          </motion.div>
        </Stack>
      ) : null}

      <Stack gap={1} sx={{ mb: 5 }}>
        {outputContend.map((message, index) =>
          message.role === "user" ? (
            <UserMessage key={index} message={message} />
          ) : message.role === "assistant" ? (
            <RenderPart
              key={index}
              group={selectedGroup}
              isLoading={isLoading}
              data={message}
            />
          ) : null
        )}
        {suggestedQuestions.length ? (
          <Suggestion
            handleSuggestedQuestionClick={handleSuggestedQuestionClick}
            suggestedQuestions={suggestedQuestions}
          />
        ) : null}
      </Stack>
      <div ref={bottomRef} />
    </>
  );
};

function ResearchContend() {
  return (
    <Box sx={{ width: { xs: "100%", lg: "55%" }, mx: "auto", mt: 2 }}>
      <ResearchComponent />
    </Box>
  );
}

export default ResearchContend;
