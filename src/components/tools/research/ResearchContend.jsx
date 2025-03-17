"use client";
import { useChat } from "@ai-sdk/react";
import {
  ArrowForward,
  BorderColor,
  Close,
  FormatAlignLeft,
  Person,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as motion from "motion/react-client";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useSnackbar from "../../../hooks/useSnackbar";
import {
  useGetResearchQuestionMutation,
  useResearchTrendingQuery,
} from "../../../redux/api/tools/toolsApi";
import FormComponent from "./form-component";
import RenderPart from "./RenderPart";
import { SuggestionCards } from "./SuggetionCard";

const ResearchContend = () => {
  const [selectedModel, setSelectedModel] = useState("shothik-brain-1.0");
  const [editingMessageIndex, setEditingMessageIndex] = useState(-1);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [isBottomVisible, setIsBottomVisible] = useState(false);
  const { themeLayout } = useSelector((state) => state.settings);
  const { accessToken } = useSelector((state) => state.auth);
  const [getResearchQuestion] = useGetResearchQuestionMutation();
  const { data: trendingQueries } = useResearchTrendingQuery();
  const [selectedGroup, setSelectedGroup] = useState("web");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const isNavMini = themeLayout === "mini";
  const lastSubmittedQueryRef = useRef();
  const enqueueSnackbar = useSnackbar();
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const chatOptions = {
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
  };

  const {
    status,
    input,
    messages,
    setInput,
    append,
    handleSubmit,
    setMessages,
    reload,
    stop,
  } = useChat(chatOptions);
  const isLoading = status === "streaming";

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

  const lastUserMessageIndex = messages.length - 1;

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

  const handleMessageEdit = (index) => {
    setIsEditingMessage(true);
    setEditingMessageIndex(index);
    setInput(messages[index].content);
  };

  const handleMessageUpdate = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Create new messages array up to the edited message
      const newMessages = messages.slice(0, editingMessageIndex + 1);
      // Update the edited message
      newMessages[editingMessageIndex] = {
        ...newMessages[editingMessageIndex],
        content: input.trim(),
      };
      // Set the new messages array
      setMessages(newMessages);
      // Reset editing state
      setIsEditingMessage(false);
      setEditingMessageIndex(-1);
      // Store the edited message for reference
      lastSubmittedQueryRef.current = input.trim();
      // Clear input
      setInput("");
      // Reset suggested questions
      setSuggestedQuestions([]);
      // Trigger a new chat completion without appending
      reload();
    } else {
      enqueueSnackbar("Please enter a valid message.", { variant: "error" });
    }
  };

  const handleModelChange = (newModel) => {
    setSelectedModel(newModel);
    setSuggestedQuestions([]);
    reload({ body: { model: newModel } });
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 0 },
        marginTop: 2,
        position: "relative",
        minHeight: "calc(100vh - 100px)",
        ...(!hasSubmitted && {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }),
      }}
    >
      <Box sx={{ width: { xs: "100%", lg: "55%" }, mx: "auto" }}>
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
              input={input}
              setInput={setInput}
              attachments={attachments}
              setAttachments={setAttachments}
              hasSubmitted={hasSubmitted}
              setHasSubmitted={setHasSubmitted}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
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
          {messages.map((message, index) => (
            <Box key={index}>
              {message.role === "user" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Box>
                    <IconButton
                      color='text.secondary'
                      aria-label='User'
                      sx={{
                        bgcolor: "rgba(73, 149, 87, 0.04)",
                        borderRadius: "5px",
                      }}
                      disabled={isLoading}
                    >
                      <Person size={20} />
                    </IconButton>
                  </Box>
                  <Box sx={{ width: "100%" }}>
                    {isEditingMessage && editingMessageIndex === index ? (
                      <form onSubmit={handleMessageUpdate} className='w-full'>
                        <Box
                          sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder='Edit your message...'
                            variant='outlined'
                            size='small'
                            fullWidth
                            slotProps={{
                              input: {
                                style: {
                                  fontSize: "0.875rem",
                                  paddingRight: "5rem",
                                  width: "100%",
                                },
                              },
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "divider",
                                },
                                "&:hover fieldset": {
                                  borderColor: "divider",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "divider",
                                },
                              },
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              right: 1,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <IconButton
                              type='button'
                              color='text.secondary'
                              aria-label='Close'
                              sx={{
                                bgcolor: "background.paper",
                                borderRadius: "5px",
                              }}
                              onClick={() => {
                                setIsEditingMessage(false);
                                setEditingMessageIndex(-1);
                                setInput("");
                              }}
                              disabled={isLoading}
                            >
                              <Close sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton
                              type='submit'
                              color='text.secondary'
                              aria-label='Submit'
                              sx={{
                                bgcolor: "background.paper",
                                borderRadius: "5px",
                              }}
                              disabled={isLoading}
                            >
                              <ArrowForward sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </form>
                    ) : (
                      <Stack
                        alignItems='center'
                        justifyContent='space-between'
                        flexDirection='row'
                        gap={1}
                        sx={{ width: "100%" }}
                      >
                        <Box>
                          <Typography>{message.content}</Typography>
                          <Stack gap={1}>
                            {message.experimental_attachments?.map(
                              (attachment, attachmentIndex) => (
                                <Box sx={{ mt: 1 }} key={attachmentIndex}>
                                  {attachment.contentType.startsWith(
                                    "image/"
                                  ) && (
                                    <Avatar
                                      src={attachment.url}
                                      alt={`Attachment ${attachmentIndex + 1}`}
                                      sx={{
                                        width: 150,
                                        height: 100,
                                        borderRadius: 2,
                                        objectFit: "fill",
                                      }}
                                    />
                                  )}
                                </Box>
                              )
                            )}
                          </Stack>
                        </Box>
                        {!isEditingMessage &&
                          index === lastUserMessageIndex && (
                            <IconButton
                              color='text.secondary'
                              aria-label='Edit'
                              size='small'
                              sx={{
                                bgcolor: "rgba(73, 149, 87, 0.04)",
                                borderRadius: "5px",
                              }}
                              onClick={() => handleMessageEdit(index)}
                              disabled={isLoading}
                            >
                              <BorderColor size={16} />
                            </IconButton>
                          )}
                      </Stack>
                    )}
                  </Box>
                </motion.div>
              )}

              {message.role === "assistant" &&
                message.parts?.map((part, partIndex) => (
                  <RenderPart
                    key={partIndex}
                    part={part}
                    index={index}
                    partIndex={partIndex}
                    parts={message.parts}
                  />
                ))}
            </Box>
          ))}
          {suggestedQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <Box display='flex' alignItems='center' gap={2} my={2}>
                <FormatAlignLeft fontSize='small' color='text.secondary' />
                <Typography variant='h6'>Suggested questions</Typography>
              </Box>

              <Box display='flex' flexDirection='column' gap={1}>
                {suggestedQuestions?.map((question, index) => (
                  <Typography
                    key={index}
                    sx={{
                      borderRadius: "1.5rem",
                      fontWeight: "medium",
                      padding: "0.5rem 1rem",
                      backgroundColor: "background.paper",
                      color: "text.secondary",
                      cursor: "pointer",
                      width: "fit-content",
                    }}
                    onClick={() => handleSuggestedQuestionClick(question)}
                  >
                    {question}
                  </Typography>
                ))}
              </Box>
            </motion.div>
          )}
        </Stack>
      </Box>
      <div ref={bottomRef} />

      <Box sx={{ position: "relative" }}>
        {hasSubmitted && (
          <Box
            sx={{
              width: {
                xl: !isBottomVisible ? (isNavMini ? "53%" : "50%") : "55%",
                lg: !isBottomVisible ? (isNavMini ? "50%" : "45%") : "55%",
                sm: !isBottomVisible
                  ? `calc(100vw - ${isNavMini ? "150" : "300"}px)`
                  : "100%",
                xs: "100%",
              },
              position: isBottomVisible ? "static" : "fixed",
              ...(!isBottomVisible
                ? {
                    bottom: 0,
                    left: {
                      xl: isNavMini ? "53%" : "57%",
                      lg: isNavMini ? "54%" : "60%",
                      sm: isNavMini ? "57%" : "69%",
                      md: isNavMini ? "55%" : "65%",
                      xs: 0,
                    },
                    transform: {
                      lg: "translateX(-52%)",
                      sm: "translateX(-52%)",
                      xs: 0,
                    },
                    zIndex: 1000,
                  }
                : { mx: "auto" }),
              padding: 2,
            }}
          >
            <FormComponent
              input={input}
              setInput={setInput}
              attachments={attachments}
              setAttachments={setAttachments}
              hasSubmitted={hasSubmitted}
              setHasSubmitted={setHasSubmitted}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
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
              showExperimentalModels={false}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResearchContend;
