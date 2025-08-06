"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  FileText,
  Phone,
  Users,
  ChevronRight,
  Zap,
  Bot,
  Sheet,
  BrainCog,
} from "lucide-react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AgentThinkingLoader from "./AgentThinkingLoader";

// Styled components to match Tailwind styles
const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: "1200px !important",
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up("lg")]: {
    maxWidth: "1400px !important",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  border: "2px solid",
  borderColor: theme.palette.grey[200],
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.grey[300],
  },
  "&.selected-emerald": {
    borderColor: "#10b981",
    backgroundColor: "#ecfdf5",
    color: "#047857",
  },
  "&.selected-blue": {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
  },
  "&.selected-purple": {
    borderColor: "#8b5cf6",
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    minHeight: "120px",
    "& fieldset": {
      borderColor: theme.palette.grey[200],
    },
    "&:hover fieldset": {
      borderColor: "#10b981",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#10b981",
      borderWidth: "1px",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "14px",
    resize: "none",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  textTransform: "none",
  fontSize: "14px",
  fontWeight: 500,
  padding: theme.spacing(1.5, 3),
  backgroundColor: "#10b981",
  "&:hover": {
    backgroundColor: "#059669",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "16px",
    padding: theme.spacing(2, 3),
  },
}));

const ExampleButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  textTransform: "none",
  fontSize: "12px",
  padding: theme.spacing(1.5, 2),
  border: "1px solid",
  borderColor: theme.palette.grey[200],
  backgroundColor: "white",
  color: theme.palette.text.primary,
  textAlign: "left",
  justifyContent: "flex-start",
  "&:hover": {
    borderColor: "#10b981",
    backgroundColor: "#ecfdf5",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "14px",
    padding: theme.spacing(2, 2),
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  borderBottom: "1px solid",
  borderColor: theme.palette.grey[200],
  "&.header-emerald": {
    borderColor: "#10b981",
    backgroundColor: "#ecfdf5",
    color: "#047857",
  },
  "&.header-blue": {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
  },
  "&.header-purple": {
    borderColor: "#8b5cf6",
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
  },
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4, 3),
  },
}));

const ResultsBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(3),
  background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)",
  borderRadius: "12px",
  border: "1px solid #10b981",
}));

// interface AgentDemo {
//   id: string;
//   name: string;
//   icon: React.ReactNode;
//   color: string;
//   placeholder: string;
//   examples: string[];
//   description: string;
//   processingMessage: string;
// }

const agentDemos = [
  {
    id: "slides",
    name: "AI Slides Agent",
    icon: <FileText size={24} />,
    color: "emerald",
    placeholder: "Select an example...",
    examples: [
      "Create a pitch deck for an AI startup targeting Series A investors",
      "Make slides about sustainable fashion for university students",
      "Build a training presentation on remote work best practices",
    ],
    description:
      "Creates complete presentations with research, design, and content",
    processingMessage:
      "Researching topic, designing slides, writing content...",
  },
  {
    id: "sheet",
    name: "AI Sheet Agent",
    icon: <Sheet size={24} />,
    color: "blue",
    placeholder: "Select an example...",
    examples: [
      "Compare pricing of 10 gyms in a sheet",
      "List top 5 Italian restaurants with ratings",
      "Generate 10 school and add contact notes",
    ],
    description:
      "Performs real-world research and structures the data in smart sheets",
    processingMessage:
      "Researching deeply, organizing data, formatting your sheet...",
  },
  {
    id: "deep-research",
    name: "Deep Research Agent",
    icon: <BrainCog size={24} />,
    color: "purple",
    placeholder: "Research deeply about...",
    examples: [
      "Find all recent studies on intermittent fasting and longevity",
      "Compare pricing, pros, and cons of top 5 project management tools",
      "Investigate the latest laws on crypto trading in the US and Europe",
    ],
    description:
      "Performs thorough research, analyzes findings, and delivers structured insights",
    processingMessage:
      "Reading sources, verifying facts, organizing your research brief...",
  },
];

// Mock API function
const mockApiRequest = async (method, endpoint, data) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    json: async () => ({
      result: `Mock response for ${
        data.topic || data.text
      }: This is a demonstration of how the ${endpoint
        .split("/")
        .pop()} agent would work. In a real implementation, this would return detailed results based on your request.`,
    }),
  };
};

// Mock analytics functions
const mockAnalytics = {
  trackAgentInteraction: (id, action, length) =>
    console.log("Track:", id, action, length),
  trackFeatureClick: (feature, context) =>
    console.log("Click:", feature, context),
  trackError: (type, message, context) =>
    console.log("Error:", type, message, context),
};

export default function InteractiveAgentDemo() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedAgent, setSelectedAgent] = useState(agentDemos[0]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // Cycle through examples automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % selectedAgent.examples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedAgent]);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    mockAnalytics.trackAgentInteraction(
      selectedAgent.id,
      "demo_started",
      userInput.length
    );

    setIsProcessing(true);
    setShowResults(false);
    setError("");
    setAiResponse("");

    try {
      let response;

      switch (selectedAgent.id) {
        case "slides":
          response = await mockApiRequest("POST", "/api/agents/outline", {
            topic: userInput,
            type: "presentation",
          });
          break;

        case "call":
          response = await mockApiRequest("POST", "/api/agents/research", {
            topic: `Phone call strategy for: ${userInput}`,
            domain: "business communication",
          });
          break;

        case "hire":
          response = await mockApiRequest("POST", "/api/agents/research", {
            topic: `Hiring plan for: ${userInput}`,
            domain: "human resources",
          });
          break;

        default:
          response = await mockApiRequest("POST", "/api/agents/improve", {
            text: userInput,
            improvements: ["clarity", "structure", "engagement"],
          });
      }

      const data = await response.json();
      setAiResponse(data.result);
      setShowResults(true);

      mockAnalytics.trackAgentInteraction(
        selectedAgent.id,
        "demo_completed",
        data.result.length
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
      mockAnalytics.trackError(
        "agent_demo_error",
        errorMessage,
        selectedAgent.id
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const useExample = (example) => {
    setUserInput(example);
    mockAnalytics.trackFeatureClick("example_used", "agent_demo");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setUserInput("");
    setShowResults(false);
    setError("");
    mockAnalytics.trackFeatureClick(
      `agent_${agent.id}_selected`,
      "agent_selector"
    );
  };

  return (
    <Box
      component="section"
      sx={{
        pt: { xs: 12, lg: 15 },
        // background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
        // background:
        // "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, rgba(16, 185, 129, 0.04) 100%)",
        bgcolor: isDarkMode ? "" : "#FBFCFD",
        minHeight: "100vh",
      }}
    >
      <StyledContainer>
        {/* Header */}
        <Box textAlign="center" mb={{ xs: 6, lg: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: {
                  xs: "2rem",
                  sm: "2.5rem",
                  lg: "3rem",
                  xl: "3.75rem",
                },
                fontWeight: 300,
                color: isDarkMode ? "" : "#0f172a",
                mb: { xs: 2, lg: 3 },
                px: 2,
              }}
            >
              Try an Agent{" "}
              <Box component="span" sx={{ color: "#10b981" }}>
                Live
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                color: isDarkMode ? "" : "#64748b",
                maxWidth: "768px",
                mx: "auto",
                px: 2,
                fontWeight: 400,
              }}
            >
              Experience the future of AI. Pick an agent, give it a task, and
              watch it work in real-time.
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={{ xs: 4, lg: 6 }} alignItems="flex-start">
          {/* Agent Selection */}
          <Grid item xs={12} lg={6}>
            <Box>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  fontWeight: 600,
                  color: isDarkMode ? "" : "#0f172a",
                  mb: { xs: 2, lg: 3 },
                }}
              >
                Choose Your Agent
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {agentDemos.map((agent) => (
                  <motion.div
                    key={agent.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <StyledPaper
                      className={
                        selectedAgent.id === agent.id
                          ? `selected-${agent.color}`
                          : ""
                      }
                      onClick={() => handleAgentSelect(agent)}
                      elevation={0}
                      sx={{ p: { xs: 2, sm: 3 } }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 1.5, sm: 2 },
                        }}
                      >
                        <Paper
                          elevation={selectedAgent.id === agent.id ? 2 : 0}
                          sx={{
                            p: { xs: 1, sm: 1.5 },
                            borderRadius: "12px",
                            backgroundColor:
                              selectedAgent.id === agent.id
                                ? "white"
                                : "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: isDarkMode ? "#000" : "inherit",
                            "& svg": {
                              color: isDarkMode ? "#000" : "inherit",
                            },
                          }}
                        >
                          {agent.icon}
                        </Paper>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            component="h4"
                            sx={{
                              fontSize: { xs: "1rem", sm: "1.125rem" },
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            {agent.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              opacity: 0.8,
                              lineHeight: 1.6,
                            }}
                          >
                            {agent.description}
                          </Typography>
                        </Box>
                        {selectedAgent.id === agent.id && (
                          <ChevronRight size={isMobile ? 16 : 20} />
                        )}
                      </Box>
                    </StyledPaper>
                  </motion.div>
                ))}
              </Box>

              {/* Example Prompts */}
              <Box sx={{ mt: 4 }}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: isDarkMode? "inherit" : "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 2,
                  }}
                >
                  Try These Examples
                </Typography>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedAgent.id}-${currentExample}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {selectedAgent.examples.map((example, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.01 }}
                          style={{
                            opacity: index === currentExample ? 1 : 0.6,
                          }}
                        >
                          <ExampleButton
                            fullWidth={true}
                            onClick={() => useExample(example)}
                          >
                            <Typography
                              sx={{ fontSize: "inherit", textAlign: "left", color: isDarkMode ? "#000" : "inherit" }}
                            >
                              "{example}"
                            </Typography>
                          </ExampleButton>
                        </motion.div>
                      ))}
                    </Box>
                  </motion.div>
                </AnimatePresence>
              </Box>
            </Box>
          </Grid>

          {/* Interactive Demo */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ position: { lg: "sticky" }, top: { lg: "2rem" } }}>
              <Paper
                elevation={8}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "#e2e8f0",
                  overflow: "hidden",
                }}
              >
                {/* Agent Header */}
                <HeaderSection className={`header-${selectedAgent.color}`}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1.5, sm: 2 },
                    }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        p: { xs: 1, sm: 1.5 },
                        backgroundColor: "white",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "inherit",
                        "& svg": {
                          color: "inherit",
                        },
                      }}
                    >
                      {selectedAgent.icon}
                    </Paper>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        component="h3"
                        sx={{
                          fontSize: { xs: "1.125rem", sm: "1.25rem" },
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedAgent.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          opacity: 0.8,
                        }}
                      >
                        Ready to help
                      </Typography>
                    </Box>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Bot size={isMobile ? 20 : 24} />
                    </motion.div>
                  </Box>
                </HeaderSection>

                {/* Input Area */}
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box>
                      <Typography
                        component="label"
                        sx={{
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          fontWeight: 500,
                          color: isDarkMode?  "inherit" : "#374151",
                          mb: 1,
                          display: "block",
                        }}
                      >
                        What would you like {selectedAgent.name} to do?
                      </Typography>
                      <StyledTextField
                        fullWidth={true}
                        multiline
                        rows={4}
                        inputRef={inputRef}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={selectedAgent.placeholder}
                        disabled={isProcessing}
                        variant="outlined"
                      />
                    </Box>

                    <StyledButton
                      fullWidth={true}
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={!userInput.trim() || isProcessing}
                      startIcon={
                        isProcessing ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Sparkles size={20} />
                          </motion.div>
                        ) : (
                          <Send size={20} />
                        )
                      }
                    >
                      {isProcessing ? "Agent Working..." : "Try Now"}
                    </StyledButton>
                  </Box>

                  {/* Processing Status */}
                  <AnimatePresence>
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6"
                      >
                        <AgentThinkingLoader
                          message={`${selectedAgent.name} is working...`}
                          steps={[
                            "Analyzing your request",
                            selectedAgent.processingMessage,
                            "Preparing results",
                          ]}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Results */}
                  <AnimatePresence>
                    {showResults && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <ResultsBox>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5,
                            }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                backgroundColor: "#10b981",
                                borderRadius: "8px",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {selectedAgent.icon}
                            </Paper>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  color: "#0f172a",
                                  mb: 1.5,
                                }}
                              >
                                {selectedAgent.name} Results
                              </Typography>
                              {error ? (
                                <Paper
                                  elevation={0}
                                  sx={{
                                    p: 1.5,
                                    backgroundColor: "#fef2f2",
                                    border: "1px solid #fecaca",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "0.875rem",
                                      color: "#dc2626",
                                    }}
                                  >
                                    {error}
                                  </Typography>
                                </Paper>
                              ) : (
                                <Typography
                                  sx={{
                                    color: "#374151",
                                    whiteSpace: "pre-wrap",
                                    lineHeight: 1.6,
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {aiResponse}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </ResultsBox>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </StyledContainer>
    </Box>
  );
}
