"use client";

// components/ChatArea.tsx
import React, { useEffect, useRef, memo, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SearchIcon from "@mui/icons-material/Search";
import PaletteIcon from "@mui/icons-material/Palette";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import {
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import InteractiveChatMessage from "../../../components/agents/shared/InteractiveChatMessage";
import InputArea from "./InputArea";
import {
  useStreamingLogs,
  formatAgentName,
  formatTimestamp,
} from "../../hooks/useStreamingLogs";

const PRIMARY_GREEN = "#07B37A";

// UTILS function
// Parse tool outputs from markdown code blocks
const parseToolOutputs = (text: string) => {
  const toolOutputsMatch = text.match(/```tool_outputs\n(.*?)\n```/s);
  if (!toolOutputsMatch) return null;

  try {
    // Clean up the string and parse as JSON
    const cleanedJson = toolOutputsMatch[1].replace(/'/g, '"');
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.warn("Failed to parse tool outputs:", error);
    return null;
  }
};

// --- Sub-components for Structured Data ---

// Component for Tool Outputs logs
const ToolOutputsLog = memo(({ toolOutputs, statusText }) => (
  <Card
    variant="outlined"
    sx={{ mt: 1, borderColor: "#e0e0e0", borderRadius: 2 }}
  >
    <CardContent>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontWeight: "bold", color: "text.secondary" }}
      >
        Tool Outputs
      </Typography>
      {toolOutputs && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PaletteIcon color="action" /> Theme Configuration
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {Object.entries(toolOutputs).map(([key, value]) => (
              <Box
                key={key}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {key.includes("color") && (
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "4px",
                      bgcolor: value as string,
                      border: "1px solid #ccc",
                    }}
                  />
                )}
                <Typography variant="caption">{`${key.replace(
                  /_/g,
                  " "
                )}: `}</Typography>
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {value as string}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      {statusText && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {statusText}
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
));
ToolOutputsLog.displayName = "ToolOutputsLog";

// Component for Keyword Research logs
const KeywordResearchLog = memo(({ queries }) => (
  <Card
    variant="outlined"
    sx={{ mt: 1, borderColor: "#e0e0e0", borderRadius: 2 }}
  >
    <CardContent>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontWeight: "bold", color: "text.secondary" }}
      >
        Search Queries
      </Typography>
      <List dense>
        {queries.map((query, i) => (
          <ListItem key={i} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <SearchIcon fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2">{query}</Typography>}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
));
KeywordResearchLog.displayName = "KeywordResearchLog";

// Component for Presentation Plan logs
// Utility to check if a value is a non-empty object
const isNonEmptyObject = (value: any): boolean =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).length > 0;

// Utility to check if a value is a string
const isString = (value: any): boolean => typeof value === "string";

// Utility to check if a value is a non-empty array
const isNonEmptyArray = (value: any): boolean =>
  Array.isArray(value) && value.length > 0;

// Component for Presentation Plan logs
const PlanningLog = memo(({ plan }) => {
  if (!isNonEmptyObject(plan)) {
    return (
      <Card
        variant="outlined"
        sx={{ mt: 1, borderColor: "#e0e0e0", borderRadius: 2 }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Presentation Plan
          </Typography>
          <Typography variant="body2" color="error">
            Empty presentation plan data.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Check if global_theme has the expected direct properties (e.g., primary_color, header_font)
  const hasDirectThemeProperties =
    isNonEmptyObject(plan.global_theme) &&
    Object.keys(plan.global_theme).some((key) =>
      [
        "primary_color",
        "secondary_color",
        "background_color",
        "text_color",
        "accent_color",
        "header_font",
        "body_font",
      ].includes(key)
    );

  return (
    <Card
      variant="outlined"
      sx={{ mt: 1, borderColor: "#e0e0e0", borderRadius: 2 }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Presentation Plan
        </Typography>
        {hasDirectThemeProperties && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <PaletteIcon color="action" /> Global Theme
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {Object.entries(plan.global_theme).map(([key, value]) => {
                // Convert value to string safely
                const displayValue =
                  typeof value === "string"
                    ? value
                    : typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value);

                return (
                  <Box
                    key={key}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {key.includes("color") &&
                      typeof value === "string" &&
                      value.startsWith("#") && (
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "4px",
                            bgcolor: value,
                            border: "1px solid #ccc",
                          }}
                        />
                      )}
                    <Typography variant="caption">{`${key.replace(
                      /_/g,
                      " "
                    )}: `}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      {displayValue}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
        {isNonEmptyArray(plan.slides) && (
          <Box>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}
            >
              <SlideshowIcon color="action" /> Planned Slides
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {plan.slides.map((slide, i) => (
                <Card key={i} variant="outlined" sx={{ borderColor: "#eee" }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {isNonEmptyObject(slide.slide_data) &&
                      isString(slide.slide_data.headline)
                        ? slide.slide_data.headline
                        : "Untitled Slide"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {isNonEmptyObject(slide.slide_data) &&
                      isString(slide.slide_data.body_content)
                        ? `${slide.slide_data.body_content.substring(
                            0,
                            100
                          )}...`
                        : "No content available"}
                    </Typography>
                    <Chip
                      label={
                        isString(slide.slide_type)
                          ? slide.slide_type
                          : "Unknown"
                      }
                      size="small"
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
        {!hasDirectThemeProperties && !plan.slides && (
          <Typography variant="body2" color="text.secondary">
            No valid theme or slides data available.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
});
PlanningLog.displayName = "PlanningLog";

// Component for rendering HTML content in a sandboxed iframe
const HtmlContentLog = memo(({ htmlString }) => (
  <Box
    sx={{
      mt: 1,
      height: "400px",
      resize: "vertical",
      overflow: "auto",
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
    }}
  >
    <iframe
      srcDoc={htmlString}
      title="Generated Slide Preview"
      sandbox="allow-scripts" // Allows scripts to run but restricts other capabilities
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  </Box>
));
HtmlContentLog.displayName = "HtmlContentLog";

// Generic fallback for unknown object structures
const JsonLog = memo(({ data }) => (
  <Box
    sx={{
      mt: 1,
      p: 2,
      bgcolor: "#f5f5f5",
      borderRadius: 2,
      maxHeight: 300,
      overflowY: "auto",
    }}
  >
    <pre
      style={{
        margin: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        fontSize: "0.8rem",
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  </Box>
));
JsonLog.displayName = "JsonLog";

// --- Main Components ---

const TypingAnimation = memo(({ text = "Thinking..." }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 2, px: 1 }}>
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: PRIMARY_GREEN,
            animation: "typing 1s infinite",
            animationDelay: `${i * 0.2}s`,
            "@keyframes typing": {
              "0%, 60%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
              "30%": { opacity: 1, transform: "scale(1)" },
            },
          }}
        />
      ))}
    </Box>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ fontStyle: "italic" }}
    >
      {text}
    </Typography>
  </Box>
));
TypingAnimation.displayName = "TypingAnimation";

const StreamingMessage = memo(
  ({
    log,
    isTyping,
    onTypingComplete,
    logIndex,
    registerAnimationCallback,
    unregisterAnimationCallback,
    sessionStatus, // <<< ADD THIS PROP
  }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(!isTyping);
    const animationStateRef = useRef({
      isRunning: false,
      intervalId: null,
      forceCompleted: false,
    });
    const mountedRef = useRef(true);

    const isStringContent = typeof log.parsed_output === "string";
    const fullText = isStringContent ? log.parsed_output : "";
    const isHtmlContent =
      isStringContent && fullText.trim().startsWith("<!DOCTYPE html>");

    const isToolOutputContent =
      isStringContent && fullText.includes("```tool_outputs");

    // --- START OF MODIFICATION ---
    // Don't animate if the session is finished. This prevents re-animation on page revisit.
    const isSessionActive =
      sessionStatus !== "completed" && sessionStatus !== "failed" && sessionStatus !== "saved";
    const shouldAnimate =
      isStringContent &&
      !isHtmlContent &&
      !isToolOutputContent &&
      log.shouldAnimate !== false &&
      isTyping &&
      isSessionActive;
    // --- END OF MODIFICATION ---

    const prepareWords = useCallback((text: string) => {
      if (!text) return [];
      const parts = text.split(/(\s+)/);
      const words = [];
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].trim()) words.push({ text: parts[i], isSpace: false });
        else if (parts[i]) words.push({ text: parts[i], isSpace: true });
      }
      return words;
    }, []);

    const forceComplete = useCallback(() => {
      const state = animationStateRef.current;
      if (!state.isRunning || state.forceCompleted) return;

      state.forceCompleted = true;
      state.isRunning = false;
      if (state.intervalId) clearInterval(state.intervalId);

      if (mountedRef.current) {
        setDisplayedText(fullText);
        setIsComplete(true);
        setTimeout(() => {
          if (mountedRef.current) {
            unregisterAnimationCallback(logIndex);
            onTypingComplete?.(logIndex);
          }
        }, 50);
      }
    }, [fullText, logIndex, onTypingComplete, unregisterAnimationCallback]);

    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
        if (animationStateRef.current.intervalId)
          clearInterval(animationStateRef.current.intervalId);
      };
    }, []);

    useEffect(() => {
      if (!shouldAnimate) {
        if (isStringContent) setDisplayedText(fullText);
        setIsComplete(true);
        if (animationStateRef.current.intervalId)
          clearInterval(animationStateRef.current.intervalId);
        animationStateRef.current.isRunning = false;
        return;
      }

      setDisplayedText("");
      setIsComplete(false);
      if (animationStateRef.current.intervalId)
        clearInterval(animationStateRef.current.intervalId);
      animationStateRef.current = {
        isRunning: false,
        intervalId: null,
        forceCompleted: false,
      };
    }, [shouldAnimate, fullText, isStringContent]);

    useEffect(() => {
      if (
        !shouldAnimate ||
        !fullText.trim() ||
        animationStateRef.current.isRunning
      ) {
        if (!fullText.trim() && shouldAnimate) {
          setIsComplete(true);
          onTypingComplete?.(logIndex);
        }
        return;
      }

      const state = animationStateRef.current;
      const words = prepareWords(fullText);
      if (words.length === 0) {
        setIsComplete(true);
        onTypingComplete?.(logIndex);
        return;
      }

      state.isRunning = true;
      registerAnimationCallback(logIndex, forceComplete);

      let currentWordIndex = 0;
      const animateWords = () => {
        if (!mountedRef.current || !state.isRunning || state.forceCompleted)
          return;

        if (currentWordIndex < words.length) {
          const currentWords = words.slice(0, currentWordIndex + 1);
          setDisplayedText(currentWords.map((w) => w.text).join(""));
          currentWordIndex++;
        } else {
          state.isRunning = false;
          clearInterval(state.intervalId);
          state.intervalId = null;
          setIsComplete(true);
          setTimeout(() => {
            if (mountedRef.current && !state.forceCompleted) {
              unregisterAnimationCallback(logIndex);
              onTypingComplete?.(logIndex);
            }
          }, 50);
        }
      };

      const wordDelay = Math.max(30, 80 - Math.floor(words.length / 10));
      state.intervalId = setInterval(animateWords, wordDelay);

      return () => {
        state.isRunning = false;
        if (state.intervalId) clearInterval(state.intervalId);
        unregisterAnimationCallback(logIndex);
      };
    }, [
      fullText,
      shouldAnimate,
      onTypingComplete,
      logIndex,
      registerAnimationCallback,
      unregisterAnimationCallback,
      forceComplete,
      prepareWords,
    ]);

    const renderContent = () => {
      const output = log.parsed_output;
      if (typeof output === "object" && output !== null) {
        switch (log.agent_name) {
          case "keyword_research_agent":
            return <KeywordResearchLog queries={output.search_queries || []} />;
          case "planning_agent":
            return <PlanningLog plan={output} />;
          default:
            return <JsonLog data={output} />;
        }
      }

      if (isHtmlContent) {
        return <HtmlContentLog htmlString={fullText} />;
      }

      // NEW: Handle tool outputs in string content
      if (typeof output === "string" && output.includes("```tool_outputs")) {
        const toolOutputs = parseToolOutputs(output);
        const statusText = output
          .replace(/```tool_outputs\n.*?\n```\n?/s, "")
          .trim();

        if (toolOutputs) {
          return (
            <ToolOutputsLog toolOutputs={toolOutputs} statusText={statusText} />
          );
        }
      }

      return (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineHeight: 1.6,
            color: "#374151",
            fontSize: "0.95rem",
          }}
        >
          {displayedText}
          {shouldAnimate && !isComplete && (
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: "2px",
                height: "20px",
                bgcolor: PRIMARY_GREEN,
                ml: 0.5,
                animation: "blink 1s infinite",
                "@keyframes blink": {
                  "0%, 50%": { opacity: 1 },
                  "51%, 100%": { opacity: 0 },
                },
              }}
            />
          )}
        </Typography>
      );
    };

    return (
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.5,
            opacity: 0.7,
          }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: PRIMARY_GREEN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "8px",
              color: "white",
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            AI
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500, fontSize: "0.75rem" }}
          >
            {formatAgentName(log.agent_name)}
          </Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: "0.7rem" }}
          >
            {formatTimestamp(log.timestamp)}
          </Typography>
        </Box>
        <Box sx={{ ml: 0 }}>{renderContent()}</Box>
      </Box>
    );
  }
);
StreamingMessage.displayName = "StreamingMessage";

// The rest of the ChatArea component remains largely the same...
export default function ChatArea({
  currentAgentType,
  chatHistory,
  realLogs,
  isLoading,
  currentPhase,
  completedPhases,
  logsData,
  chatEndRef,
  inputValue,
  setInputValue,
  onSend,
}) {
  const {
    processedLogs,
    currentlyTypingIndex,
    showThinking,
    handleTypingComplete,
    sessionStatus,
    isBackgroundProcessing,
    registerAnimationCallback,
    unregisterAnimationCallback,
  } = useStreamingLogs(realLogs, isLoading);

  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef(true);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (chatEndRef.current && autoScrollRef.current) {
      requestAnimationFrame(() => {
        chatEndRef.current?.scrollIntoView({ behavior, block: "end" });
      });
    }
  }, []);

  const checkScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      autoScrollRef.current = scrollTop + clientHeight >= scrollHeight - 100;
    }
  }, []);

  useEffect(() => {
    if (processedLogs.length !== 0 || showThinking) {
      scrollToBottom();
    }
  }, [processedLogs.length, showThinking, scrollToBottom]);

  useEffect(() => {
    if (currentlyTypingIndex >= 0) {
      const scrollInterval = setInterval(() => {
        if (autoScrollRef.current) scrollToBottom("auto");
      }, 200);
      return () => clearInterval(scrollInterval);
    }
  }, [currentlyTypingIndex, scrollToBottom]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100%",
        borderRight: "1px solid #e0e0e0",
        bgcolor: "#fafafa",
        overflow: "hidden",
      }}
    >
      <Box
        ref={scrollContainerRef}
        onScroll={checkScrollPosition}
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          minHeight: 0,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "3px",
            "&:hover": { background: "#a8a8a8" },
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#c1c1c1 transparent",
        }}
      >
        <Box
          sx={{
            p: 3,
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {chatHistory.length === 0 &&
            processedLogs.length === 0 &&
            !showThinking && (
              <Box
                sx={{
                  textAlign: "center",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <SmartToyIcon sx={{ fontSize: 48, color: "#ddd", mb: 2 }} />
                <Typography variant="h6" color="#999" sx={{ mb: 1 }}>
                  {currentAgentType === "presentation"
                    ? "Presentation Agent"
                    : "Super Agent"}
                </Typography>
                <Typography variant="body2" color="#666">
                  Start a conversation to see AI responses stream in real-time
                </Typography>
              </Box>
            )}

          {chatHistory.map((message) => (
            <InteractiveChatMessage
              key={message.id}
              message={message}
              onResponse={() => {}}
              onFeedback={() => {}}
              onPreferenceUpdate={() => {}}
            />
          ))}

          {processedLogs.map((log, index) => (
            <StreamingMessage
              key={log.id}
              log={log}
              logIndex={index}
              isTyping={index === currentlyTypingIndex}
              onTypingComplete={handleTypingComplete}
              registerAnimationCallback={registerAnimationCallback}
              unregisterAnimationCallback={unregisterAnimationCallback}
              sessionStatus={sessionStatus} // <<< PASS THE PROP
            />
          ))}

          {showThinking &&
            sessionStatus !== "completed" &&
            sessionStatus !== "failed" &&
            sessionStatus !== "saved" && (
              <Box sx={{ mt: 1 }}>
                <TypingAnimation
                  text={
                    sessionStatus === "failed"
                      ? "Processing failed..."
                      : isLoading
                      ? "Thinking..."
                      : "Processing..."
                  }
                />
              </Box>
            )}

          <div ref={chatEndRef} />
        </Box>
      </Box>

      <Box
        sx={{
          borderTop: "1px solid #e0e0e0",
          bgcolor: "white",
          flexShrink: 0,
          maxHeight: "300px",
          overflow: "hidden",
        }}
      >
        <InputArea
          currentAgentType={currentAgentType}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={onSend}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
}