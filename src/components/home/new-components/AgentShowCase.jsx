"use client"

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  IconButton,
  Paper,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  SmartToy,
  Phone,
  People,
  AutoAwesome,
  ArrowForward,
  PlayArrow,
  Schedule,
  Bolt,
  Psychology,
  CheckCircle,
  Public,
  Code,
} from "@mui/icons-material";
import EmailModal from "../EmailCollectModal";
import { useComponentTracking } from "../../../hooks/useComponentTracking";
import { trackingList } from "../../../libs/trackingList";
import { useRegisterUserToBetaListMutation } from "../../../redux/api/auth/authApi";

// Styled components for custom styling
const GradientBox = styled(Box)(({ gradient }) => ({
  background: `linear-gradient(135deg, ${gradient})`,
}));

const GradientText = styled(Typography)(({ gradient }) => ({
  background: `linear-gradient(135deg, ${gradient})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  display: "inline-block",
}));

const GradientButton = styled(Button)(({ gradient }) => ({
  background: `linear-gradient(135deg, ${gradient})`,
  "&:hover": {
    background: `linear-gradient(135deg, ${gradient})`,
    opacity: 0.9,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.grey[800] : "#e5e7eb"}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 1px 3px 0 rgba(255, 255, 255, 0.1)"
      : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.background.paper,
}));

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#ffffff",
  border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.grey[700] : "#e5e7eb"}`,
  borderRadius: "50%",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#f9fafb",
    transform: "scale(1.1)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 10px 15px -3px rgba(255, 255, 255, 0.1)"
        : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  transition: "all 0.3s ease",
  color: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.text.primary,
}));

const TouchArea = styled(Box)({
  touchAction: "pan-y",
  userSelect: "none",
});

const agents = [
  {
    id: "research-agent",
    name: "Deep Research Agent",
    description:
      "Analyze 50+ research papers and extract key findings in minutes, not weeks",
    icon: <Psychology sx={{ fontSize: 24 }} />,
    gradient: "#059669, #0f766e",
    capabilities: [
      "Cross-reference 100+ academic sources",
      "Extract contradicting findings",
      "Generate synthesis reports",
      "Citation management",
    ],
    demoPrompt:
      "I need to analyze all recent research on CRISPR gene therapy for my medical thesis. Find contradictions and emerging trends.",
    output:
      "Analyzed 73 papers (2020-2024). Found 3 major contradictions in delivery methods. Identified 5 emerging trends in targeting mechanisms. Generated 12-page synthesis with proper citations.",
    stats: {
      timesSaved: "3-4 weeks",
      accuracy: "98%",
      automationLevel: "Full",
    },
    isRevolutionary: true,
  },
  {
    id: "browse-agent",
    name: "Browse For Me",
    description:
      "Research complex topics across hundreds of websites like having a personal research team",
    icon: <Public sx={{ fontSize: 24 }} />,
    gradient: "#0d9488, #059669",
    capabilities: [
      "Multi-site data extraction",
      "Comparative analysis",
      "Price monitoring",
      "Application tracking",
    ],
    demoPrompt:
      "Find the top 15 PhD programs in neuroscience that accept international students, compare funding, and track application deadlines.",
    output:
      "Researched 127 universities. Found 15 programs with full funding for international students. Created comparison table with deadlines, requirements, and contact info. Set up deadline alerts.",
    stats: {
      timesSaved: "2-3 weeks",
      accuracy: "96%",
      automationLevel: "Full",
    },
    isRevolutionary: true,
  },
  {
    id: "task-agent",
    name: "Task Automation",
    description:
      "Complete multi-step workflows that would take you days of manual work",
    icon: <SmartToy sx={{ fontSize: 24 }} />,
    gradient: "#047857, #0d9488",
    capabilities: [
      "Job application automation",
      "Scholarship applications",
      "Data entry workflows",
      "Follow-up sequences",
    ],
    demoPrompt:
      "Apply to 25 summer research internships in biotech. Customize each application and set up follow-up reminders.",
    output:
      "Applied to 25 positions. Customized cover letters for each. Submitted applications with transcripts. Created follow-up calendar. Secured 7 interview invitations.",
    stats: {
      timesSaved: "40+ hours",
      accuracy: "94%",
      automationLevel: "Full",
    },
    isRevolutionary: true,
  },
  {
    id: "call-agent",
    name: "Call For Me",
    description:
      "Make professional calls to gather information, schedule meetings, and handle negotiations",
    icon: <Phone sx={{ fontSize: 24 }} />,
    gradient: "#0f766e, #059669",
    capabilities: [
      "Information gathering calls",
      "Appointment scheduling",
      "Interview coordination",
      "Professional follow-ups",
    ],
    demoPrompt:
      "Contact 10 research professors about potential thesis supervision. Ask about their current projects and availability.",
    output:
      "Called 10 professors. Gathered project details from 8. Scheduled 5 meetings. Received 3 thesis topic suggestions. Created follow-up plan for interested supervisors.",
    stats: {
      timesSaved: "2+ weeks",
      accuracy: "92%",
      automationLevel: "Full",
    },
    isRevolutionary: true,
  },
  {
    id: "hire-agent",
    name: "Hire For Me",
    description:
      "Find, vet, and hire the perfect freelancers for your academic or personal projects",
    icon: <People sx={{ fontSize: 24 }} />,
    gradient: "#059669, #065f46",
    capabilities: [
      "Talent sourcing & vetting",
      "Portfolio evaluation",
      "Rate negotiation",
      "Project management",
    ],
    demoPrompt:
      "Hire a statistical analyst to help with my psychology research data analysis. Budget: $800, need SPSS expertise.",
    output:
      "Screened 23 analysts. Evaluated 5 portfolios. Interviewed top 3 candidates. Hired PhD statistician for $750. Project completed in 10 days with publication-ready results.",
    stats: {
      timesSaved: "3+ weeks",
      accuracy: "96%",
      automationLevel: "Full",
    },
    isRevolutionary: true,
  },
];

export default function AgentShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [slideDirection, setSlideDirection] = useState("left");
  const [showModal, setShowModal] = useState(false);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const currentAgent = agents[currentIndex];

  const { componentRef, trackClick } = useComponentTracking(
    trackingList.CAROUSEL_SECTION
  );

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // 'success', 'error', 'warning', 'info'
  });

    const [
      registerUserForBetaList,
      { isLoading: registerUserProcessing, isError: registerUserError },
    ] = useRegisterUserToBetaListMutation();

  const nextAgent = () => {
    setSlideDirection("left");
    setCurrentIndex((prev) => (prev + 1) % agents.length);
  };

  const prevAgent = () => {
    setSlideDirection("right");
    setCurrentIndex((prev) => (prev - 1 + agents.length) % agents.length);
  };

  const handlePlayDemo = (agentId) => {
    setIsPlaying(agentId);
    setTimeout(() => setIsPlaying(null), 4000);
  };

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextAgent();
    } else if (isRightSwipe) {
      prevAgent();
    }
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextAgent, 8000);
    return () => clearInterval(timer);
  }, []);

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
        sx={{
          pb: { xs: 8, md: 12 },
          bgcolor: isDarkMode ? "inherit" : "white",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          {/* Carousel Navigation */}
          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 8,
            }}
          >
            <AnimatedIconButton onClick={prevAgent}>
              <ArrowForward
                sx={{ transform: "rotate(180deg)", fontSize: 20 }}
              />
            </AnimatedIconButton>

            <Box sx={{ display: "flex", gap: 1 }}>
              {agents.map((_, index) => (
                <IndicatorButton
                  key={index}
                  active={index === currentIndex ? "true" : "false"}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </Box>

            <AnimatedIconButton onClick={nextAgent}>
              <ArrowForward sx={{ fontSize: 20 }} />
            </AnimatedIconButton>
          </Box> */}

          {/* Demo Section with Swipe Support */}
          <TouchArea
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Slide
              key={currentIndex}
              direction={slideDirection}
              in
              timeout={600}
              mountOnEnter
              unmountOnExit
            >
              <StyledCard>
                {/* Demo Header */}
                <GradientBox
                  gradient={currentAgent.gradient}
                  sx={{ color: "white", p: 4 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 3,
                      flexDirection: { xs: "column", md: "row" },
                      gap: { xs: 3, md: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        textAlign: { xs: "center", md: "left" },
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {currentAgent.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "1.5rem", md: "2rem" },
                          }}
                        >
                          {currentAgent.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: "rgba(255, 255, 255, 0.9)",
                            fontSize: { xs: "0.9rem", md: "1.1rem" },
                          }}
                        >
                          {currentAgent.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      data-umami-event={`Watch Agent Work: ${currentAgent.name}`}
                      onClick={() => handlePlayDemo(currentAgent.id)}
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        px: 3,
                        py: 1.5,
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.3)",
                        },
                      }}
                      startIcon={<PlayArrow />}
                    >
                      Watch Agent Work
                    </Button>
                  </Box>

                  {/* Stats */}
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Schedule />
                          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            {currentAgent.stats.timesSaved}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                          Time Saved
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Bolt />
                          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            {currentAgent.stats.accuracy}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                          Success Rate
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Psychology />
                          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            {currentAgent.stats.automationLevel}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                          Automation
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </GradientBox>

                {/* Demo Content */}
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={4}>
                    {/* Input */}
                    <Grid item xs={12} lg={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: isDarkMode
                            ? theme.palette.text.primary
                            : theme.palette.text.primary,
                        }}
                      >
                        <Code sx={{ color: "#10b981" }} />
                        Your Command
                      </Typography>
                      <Paper
                        sx={{
                          bgcolor: isDarkMode
                            ? theme.palette.grey[800]
                            : "#f8fafc",
                          p: 3,
                          border: `1px solid ${
                            isDarkMode ? theme.palette.grey[700] : "#e2e8f0"
                          }`,
                          borderRadius: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            color: isDarkMode
                              ? theme.palette.grey[300]
                              : "#334155",
                            fontStyle: "italic",
                            lineHeight: 1.6,
                          }}
                        >
                          {currentAgent.demoPrompt}
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Output */}
                    <Grid item xs={12} lg={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: isDarkMode
                            ? theme.palette.text.primary
                            : theme.palette.text.primary,
                        }}
                      >
                        <AutoAwesome sx={{ color: "#a855f7" }} />
                        Agent Execution
                      </Typography>
                      <Paper
                        sx={{
                          bgcolor: isDarkMode
                            ? theme.palette.grey[800]
                            : "#ecfdf5",
                          p: 3,
                          border: `1px solid ${
                            isDarkMode ? theme.palette.grey[700] : "#bbf7d0"
                          }`,
                          borderRadius: 1.5,
                        }}
                      >
                        {isPlaying === currentAgent.id ? (
                          <Fade in>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                color: "#047857",
                              }}
                            >
                              <Psychology
                                sx={{
                                  animation: "spin 1s linear infinite",
                                  "@keyframes spin": {
                                    "0%": { transform: "rotate(0deg)" },
                                    "100%": { transform: "rotate(360deg)" },
                                  },
                                }}
                              />
                              <Typography
                                sx={{ fontSize: "1.1rem", fontWeight: 500 }}
                              >
                                Agent is working...
                              </Typography>
                            </Box>
                          </Fade>
                        ) : (
                          <Typography
                            sx={{
                              color: isDarkMode
                                ? theme.palette.grey[300]
                                : "#334155",
                              lineHeight: 1.6,
                            }}
                          >
                            {currentAgent.output}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Capabilities */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Agent Capabilities
                    </Typography>
                    <Grid container spacing={2}>
                      {currentAgent.capabilities.map((capability, index) => (
                        <Grid item xs={12} sm={6} lg={3} key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: isDarkMode
                                ? theme.palette.grey[400]
                                : "#475569",
                            }}
                          >
                            <CheckCircle
                              sx={{
                                fontSize: 16,
                                color: "#059669",
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: isDarkMode
                                  ? theme.palette.grey[300]
                                  : "text.secondary",
                              }}
                            >
                              {capability}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* CTA */}
                  <Box
                    sx={{
                      mt: 4,
                      pt: 3,
                      borderTop: `1px solid ${
                        isDarkMode ? theme.palette.grey[700] : "#e2e8f0"
                      }`,
                    }}
                  >
                    <GradientButton
                      data-umami-event={`Try Now Agent: ${currentAgent.name}`}
                      gradient={currentAgent.gradient}
                      fullWidth
                      sx={{
                        color: "white",
                        fontSize: "1.1rem",
                        py: 2,
                        textTransform: "none",
                      }}
                      endIcon={<ArrowForward />}
                      onClick={() => {
                        setShowModal(true);

                        // tracking
                        trackClick(trackingList.CTA_BUTTON, {
                          button_text: "Try now",
                          position: "agent_show_case_section",
                        });
                      }}
                    >
                      Try Now
                    </GradientButton>
                  </Box>
                </CardContent>
              </StyledCard>
            </Slide>
          </TouchArea>

          {/* Bottom CTA */}
          <Fade in timeout={600} style={{ transitionDelay: "800ms" }}>
            <Box sx={{ textAlign: "center", mt: 10 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: isDarkMode ? "#FFF" : "#0f172a",
                }}
              >
                Ready to Command the Future?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: isDarkMode ? theme.palette.grey[400] : "#64748b",
                  mb: 4,
                }}
              >
                Leave it to us. Stop working for your tools. Make them work for
                you.
              </Typography>
              <GradientButton
                data-umami-event="Command Your AI Writing Team"
                gradient="#059669, #0d9488"
                sx={{
                  color: "white",
                  fontSize: "1.1rem",
                  px: 4,
                  py: 2,
                  textTransform: "none",
                }}
                endIcon={<Public />}
                onClick={() => {
                  setShowModal(true);

                  // tracking
                  trackClick(trackingList.CTA_BUTTON, {
                    button_text: "Command Your AI Writing Team",
                    position: "agent_show_case_section",
                  });
                }}
              >
                Command Your AI Writing Team
              </GradientButton>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* email collect modal */}
      <EmailModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleEmailSubmit}
      />

      {/* Toast notification */}
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
