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
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AgentThinkingLoader from "./AgentThinkingLoader";
import { useComponentTracking } from "../../../hooks/useComponentTracking";
import { trackingList } from "../../../libs/trackingList";
import { useRouter } from "next/navigation";
import { createSheetSimulationChatId } from "../../../libs/createSheetSimulationChatId";
import EmailModal from "../EmailCollectModal";
import { useRegisterUserToBetaListMutation } from "../../../redux/api/auth/authApi";

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
  borderColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[700]
      : theme.palette.grey[200],
  cursor: "pointer",
  transition: "all 0.3s ease",
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.background.paper,
  color:
    theme.palette.mode === "dark"
      ? theme.palette.grey[100]
      : theme.palette.text.primary,
  "&:hover": {
    borderColor:
      theme.palette.mode === "dark"
        ? theme.palette.grey[600]
        : theme.palette.grey[300],
  },
  "&.selected-emerald": {
    borderColor: "#10b981",
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(16, 185, 129, 0.2)" : "#ecfdf5",
    color: theme.palette.mode === "dark" ? "#34d399" : "#047857",
  },
  "&.selected-blue": {
    borderColor: "#3b82f6",
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(59, 130, 246, 0.2)" : "#eff6ff",
    color: theme.palette.mode === "dark" ? "#60a5fa" : "#1d4ed8",
  },
  "&.selected-purple": {
    borderColor: "#8b5cf6",
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(139, 92, 246, 0.2)" : "#f3e8ff",
    color: theme.palette.mode === "dark" ? "#a78bfa" : "#7c3aed",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    minHeight: "120px",
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : theme.palette.background.paper,
    "& fieldset": {
      borderColor:
        theme.palette.mode === "dark"
          ? theme.palette.grey[700]
          : theme.palette.grey[200],
    },
    "&:hover fieldset": {
      borderColor: "#10b981",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#10b981",
      borderWidth: "1px",
    },
    // Disabled state cursor styling
    "&.Mui-disabled": {
      cursor: "not-allowed !important",
      "& .MuiInputBase-input": {
        cursor: "not-allowed !important",
      },
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "14px",
    resize: "none",
    color: `${theme.palette.text.primary} !important`, // Use theme-aware color
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: `${theme.palette.text.primary} !important`, // Override Chrome's dimming with !important
    color: `${theme.palette.text.primary} !important`, // Override Firefox/other browsers with !important
    opacity: "1 !important", // Ensure full opacity
    cursor: "not-allowed !important", // Disabled cursor
  },
  // Additional fallback for better cross-browser support
  "& .MuiInputBase-root.Mui-disabled": {
    color: `${theme.palette.text.primary} !important`,
    cursor: "not-allowed !important",
    "& .MuiInputBase-input": {
      WebkitTextFillColor: `${theme.palette.text.primary} !important`,
      color: `${theme.palette.text.primary} !important`,
      opacity: "1 !important",
      cursor: "not-allowed !important",
    },
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
  borderColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[700]
      : theme.palette.grey[200],
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.background.paper,
  color:
    theme.palette.mode === "dark"
      ? theme.palette.grey[100]
      : theme.palette.text.primary,
  textAlign: "left",
  justifyContent: "flex-start",
  "&:hover": {
    borderColor: "#10b981",
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(16, 185, 129, 0.2)" : "#ecfdf5",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "14px",
    padding: theme.spacing(2, 2),
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  borderBottom: "1px solid",
  borderColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[700]
      : theme.palette.grey[200],
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.background.paper,
  color:
    theme.palette.mode === "dark"
      ? theme.palette.grey[100]
      : theme.palette.text.primary,
  "&.header-emerald": {
    borderColor: "#10b981",
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(16, 185, 129, 0.2)" : "#ecfdf5",
    color: theme.palette.mode === "dark" ? "#34d399" : "#047857",
  },
  "&.header-blue": {
    borderColor: "#3b82f6",
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(59, 130, 246, 0.2)" : "#eff6ff",
    color: theme.palette.mode === "dark" ? "#60a5fa" : "#1d4ed8",
  },
  "&.header-purple": {
    borderColor: "#8b5cf6",
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(139, 92, 246, 0.2)" : "#f3e8ff",
    color: theme.palette.mode === "dark" ? "#a78bfa" : "#7c3aed",
  },
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4, 3),
  },
}));

const ResultsBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(3),
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)"
      : "linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)",
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
      "Create a professional business presentation about Digital Marketing",
      "Create an academic presentation about AI in Education",
      "Create a presentation on Bangladesh Software Industry",
    ],
    chatId: [
      "12344e7c-21ca-414b-bab1-6129a2981bc3",
      "0af635b5-41cb-4d47-9fe0-a0eb91bd0384",
      "a1f51514-5fb4-4d90-8c6e-c26479a63f72",
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
      "Compare pricing of top 10 gyms of the world in a sheet",
      "List top 5 Italian restaurants with ratings",
      "Generate 10 school and contact notes",
    ],
    chatId: [
      "68c92076dc985a1ee342aa72", // for prod
      "68c9237adc985a1ee342aa75", // for prod
      "68c926eedc985a1ee342aa77", // for prod
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
    chatId: [
      "68ca4f4ee4baf23966d0d8de",
      "68ca4fe4e4baf23966d0d922",
      "68ca5154e4baf23966d0d975",
    ],
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
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // return to the slide simulation api
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
  const { componentRef, trackClick } = useComponentTracking(
    trackingList.LIVE_AGENT
  );

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
  const [userChatId, setUserChatId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [
    registerUserForBetaList,
    { isLoading: registerUserProcessing, isError: registerUserError },
  ] = useRegisterUserToBetaListMutation();

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // 'success', 'error', 'warning', 'info'
  });

  const router = useRouter();

  // Cycle through examples automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % selectedAgent.examples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedAgent]);

  const handleSubmit = async (idx) => {
    if (!userInput.trim()) return;

    mockAnalytics.trackAgentInteraction(
      selectedAgent.id,
      "demo_started",
      userInput.length
    );

    const simulationId = selectedAgent.chatId[userChatId];
    // console.log(selectedAgent.chatId[userChatId], "simulationId");
    // return;

    // Tracking simulation for GA4, GTM, and other
    trackClick(trackingList.LIVE_AGENT_SIMULATION, {
      agent: selectedAgent.id,
      userQuer: userInput,
    });

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

      if (selectedAgent?.id === "slides") {
        router.push(`/slide/replay?id=${simulationId}`);
      } else if (selectedAgent?.id === "sheet") {
        // await createSheetSimulationChatId(userInput, router, simulationId); // Previously we needed to create chat ID and then we needed to add token to add and work simulation. With new update now we only need simulation ID. No authentication needed.
        router.push(`/agents/sheets/?s_id=${simulationId}`);
      } else if (selectedAgent?.id === "deep-research") {
        router.push(`/agents/research/?r_id=${simulationId}`);
      }

      return;

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

  const useExample = (example, index) => {
    setUserInput(example);
    mockAnalytics.trackFeatureClick("example_used", "agent_demo");
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setUserChatId(index);
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

  const handleEmailSubmit = async (email) => {
    try {
      const result = await registerUserForBetaList({ email }).unwrap();

      console.log(result, "result");

      // Success toast
      setToast({
        open: true,
        message: "Successfully registered for beta! We'll be in touch soon.",
        severity: "success",
      });

      // Close the modal
      setShowModal(false);
    } catch (error) {
      // Error toast
      setToast({
        open: true,
        message:
          error?.data?.message || "Registration failed. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Box
        ref={componentRef}
        component="section"
        sx={{
          pt: { xs: 12, lg: 15 },
          // background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
          // background:
          // "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, rgba(16, 185, 129, 0.04) 100%)",
          // bgcolor: isDarkMode ? "" : "#FBFCFD",
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
                  color: isDarkMode ? theme.palette.text.primary : "#0f172a",
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
                  color: isDarkMode ? theme.palette.text.secondary : "#64748b",
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
                      color: isDarkMode ? "inherit" : "#64748b",
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
                              onClick={() => useExample(example, index)}
                            >
                              <Typography
                                sx={{
                                  fontSize: "inherit",
                                  textAlign: "left",
                                  color: isDarkMode ? "#FFF" : "inherit",
                                }}
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
              <Box
                sx={{
                  position: { lg: "sticky" },
                  top: { lg: "2rem" },
                  mt: {
                    lg: "3.75rem",
                  },
                }}
              >
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
                            color: isDarkMode ? "inherit" : "#374151",
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
                          // disabled={isProcessing}
                          disabled={true}
                          variant="outlined"
                        />
                      </Box>

                      <StyledButton
                        fullWidth={true}
                        variant="contained"
                        onClick={() => handleSubmit()}
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

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: {
                xs: "20px 0px 0px",
                sm: "30px 0px 0px",
                md: "40px 0px 0px",
                lg: "44px 0px 0px",
                xl: "48px 0px 0px",
              },
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                setShowModal(true);

                // tracking
                trackClick("cta_button", {
                  button_text: "Get early access",
                  position: "live_agent",
                });
              }}
              sx={{
                maxWidth: "fit-content",
                borderRadius: "0.5rem",
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 3,
                py: 1.3,
                bgcolor: "#00AB55",
                fontWeight: "400",
              }}
            >
              Get early access
            </Button>
          </Box>
        </StyledContainer>
      </Box>

      <EmailModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleEmailSubmit}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
