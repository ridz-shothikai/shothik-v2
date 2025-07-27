import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import PersonIcon from "@mui/icons-material/Person";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import TableChartIcon from "@mui/icons-material/TableChart";
import DownloadIcon from "@mui/icons-material/Download";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import GroupIcon from "@mui/icons-material/Group";
// import CloseIcon from "@mui/icons-material/Close";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import PaletteIcon from "@mui/icons-material/Palette";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TrainingIcon from "@mui/icons-material/ModelTraining";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  useTheme,
  ListItemIcon,
  Stack,
  CircularProgress,
} from "@mui/material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import { useAgentContext } from "./shared/AgentContextProvider";
import { useCreatePresentationMutation } from "../../src/redux/api/presentation/presentationApi";
import { setPresentationState } from "../../src/redux/slice/presentationSlice";
import { useDispatch, useSelector } from "react-redux";
import { LoginModal } from "../../src/components/auth/AuthModal";
import { setShowLoginModal } from "../../src/redux/slice/auth";
import {createPresentationServer} from '../../src/services/createPresentationServer';
import {handleSheetGenerationRequest, handleSlideCreation} from "./super-agent/agentPageUtils"
import { setSheetState } from "../../src/redux/slice/sheetSlice";
import { Snackbar, Alert } from "@mui/material";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Close as CloseIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import useResponsive from "../../src/hooks/useResponsive";
import { setAgentHistoryMenu } from "../../src/redux/slice/tools";
import Link from "next/link";
import { useGetMyChatsQuery } from "../../src/redux/api/sheet/sheetApi";
import { format } from "date-fns";

const PRIMARY_GREEN = "#07B37A";

const NAVIGATION_ITEMS = [
  {
    id: "slides",
    label: "AI Slides",
    icon: <SlideshowIcon />,
    isNew: true,
    isComingSoon: false,
    isDisabled: false,
  },
  {
    id: "sheets",
    label: "AI Sheets",
    icon: <TableChartIcon />,
    isNew: true,
    isComingSoon: false,
    isDisabled: false,
  },
  // {
  //   id: "download",
  //   label: "Download For Me",
  //   icon: <DownloadIcon />,
  //   isNew: true,
  // },
  // { id: "chat", label: "AI Chat", icon: <ChatIcon /> },
  {
    id: "call",
    label: "Deep research",
    icon: <ManageSearchIcon />,
    isComingSoon: true,
    isDisabled: true,
  },
  {
    id: "agents",
    label: "Browse for me",
    icon: <AutoModeIcon />,
    isComingSoon: true,
    isDisabled: true,
  },
];

const QUICK_START_TEMPLATES = [
  {
    id: "business",
    title: "Business Presentation",
    description: "Professional presentation for business meetings",
    icon: <BusinessIcon />,
    prompt: "Create a professional business presentation about",
    color: "#1976d2",
    examples: ["quarterly results", "product launch", "market analysis"],
  },
  {
    id: "academic",
    title: "Academic Research",
    description: "Educational content with citations and research",
    icon: <SchoolIcon />,
    prompt: "Create an academic presentation about",
    color: "#9c27b0",
    examples: ["climate change", "machine learning", "historical events"],
  },
  {
    id: "product",
    title: "Product Launch",
    description: "Engaging presentation for new product reveals",
    icon: <RocketLaunchIcon />,
    prompt: "Create a product launch presentation for",
    color: "#ff9800",
    examples: ["mobile app", "SaaS platform", "hardware device"],
  },
  {
    id: "training",
    title: "Training Material",
    description: "Educational content for team training",
    icon: <TrainingIcon />,
    prompt: "Create training materials about",
    color: PRIMARY_GREEN,
    examples: ["onboarding process", "software tools", "best practices"],
  },
];

const ONBOARDING_STEPS = [
  {
    title: "🎯 Smart Planning",
    description:
      "Our Planner Agent analyzes your requirements and creates a custom blueprint for your presentation",
  },
  {
    title: "🎨 Personal Design",
    description:
      "Choose your colors, styles, and branding preferences for a truly customized look",
  },
  {
    title: "🔍 AI Research",
    description:
      "Content Generation Agent researches and creates accurate, up-to-date information",
  },
  {
    title: "✅ Quality Assured",
    description:
      "Every presentation is validated by our QA Agent for accuracy, design, and compliance",
  },
];

export default function AgentLandingPage() {
  const router = useRouter();
  const { setAgentType } = useAgentContext();
  const [inputValue, setInputValue] = useState("");
  const [selectedNavItem, setSelectedNavItem] = useState("slides");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.tools.agentHistoryMenu);
  const isNavbarExpanded = useSelector((state) => state.tools.isNavVertical);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { data: myChats, isLoading, error } = useGetMyChatsQuery();
  // const [initiatePresentation, { isLoading: isInitiatingPresentation }] =
  //   useCreatePresentationMutation();
  // console.log(myChats, "myChats");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isInitiatingPresentation, setIsInitiatingPresentation] = useState(false);
  const [isInitiatingSheet, setIsInitiatingSheet] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // console.log(isNavbarExpanded, "isNavbarExpanded");

  const toggleDrawer = (open) => () => {
    dispatch(setAgentHistoryMenu(open)); // will be used on Navbar to handle navbar expansion
  };

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useResponsive("down", "sm");

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const hasVisited = localStorage.getItem("shothik_has_visited");
    if (!hasVisited) {
      setIsFirstTimeUser(true);
      setShowOnboarding(true);
      localStorage.setItem("shothik_has_visited", "true");
    }
  }, []);

  const handleSubmit = async () => {
    
    if (!inputValue.trim() || isSubmitting) return;
    
    setIsSubmitting(true);

    // for sheet
    const email = user?.email;
    
    try {
      switch (selectedNavItem) {
        case "slides":
          return await handleSlideCreation(
            inputValue,
            setAgentType,
            dispatch,
            setLoginDialogOpen,
            setIsSubmitting,
            setIsInitiatingPresentation,
            router,
            showToast
          );
        case "sheets":
          return await handleSheetGenerationRequest(
            inputValue,
            setAgentType,
            dispatch,
            setLoginDialogOpen,
            setIsSubmitting,
            setIsInitiatingSheet,
            router,
            email,
            showToast
          );
        case "download":
          return console.log("download route");
        case "chat":
          return console.log("chat route");
        case "call":
          return console.log("call route");
        default:
          return console.log("all agents route");
      }
    } catch (error) {
      console.error("[AgentLandingPage] Error initiating presentation:", error);
      // alert("Failed to create presentation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavItemClick = (itemId) => {
    setSelectedNavItem(itemId);
    if (itemId === "slides") {
      setInputValue("Create a presentation about ");
    } else if (itemId === "sheets") {
      setInputValue("Create a list for ");
    } else if (itemId === "download") {
      setInputValue("Download information about ");
    } else {
      setInputValue("");
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedNavItem("slides");
    setInputValue(template.prompt + " ");
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  // to show toast
  const showToast = (message, severity = 'error') => {
    setToast({ open: true, message, severity });
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        bgcolor: isDarkMode ? "#161C24" : "white",
        color: isDarkMode ? "#eee" : "#333",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ============== FOR AGENTS USAGE HISTORY STARTS ================ */}
      {/* Menu Button (Top Left) */}
      {accessToken && (
        <IconButton
          onClick={toggleDrawer(true)}
          sx={{
            position: "absolute",
            top: 3,
            left: 10,
            color: isDarkMode ? "#eee" : "#333",
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          zIndex: 1102,
          "& .MuiDrawer-paper": {
            position: "absolute",
            left: isMobile ? 0 : isNavbarExpanded ? 273 : 100,
            width: { xs: "100vw", sm: 320, md: 360 },
            maxWidth: { xs: "100vw", sm: "calc(100vw - 320px)" },
            bgcolor: isDarkMode ? "#1e272e" : "#fff",
            color: isDarkMode ? "#eee" : "#333",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              My Chats
            </Typography>

            <IconButton
              onClick={toggleDrawer(false)}
              size="small"
              sx={{
                color: isDarkMode ? "#eee" : "#333",
              }}
              aria-label="Close sidebar"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: { xs: 1, sm: 2 },
            }}
          >
            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 100,
                }}
              >
                <CircularProgress size={24} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 2 }}
                >
                  Loading chats...
                </Typography>
              </Box>
            )}

            {error && (
              <Typography variant="body1" color="text.secondary">
                No chats found
              </Typography>
            )}

            {!isLoading && myChats?.length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 200,
                  textAlign: "center",
                }}
              >
                <ChatBubbleOutlineIcon
                  sx={{
                    fontSize: 48,
                    color: "text.disabled",
                    mb: 2,
                  }}
                />
                <Typography variant="body1" color="text.secondary">
                  No chats yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{ mt: 0.5 }}
                >
                  Start a new conversation to see it here
                </Typography>
              </Box>
            )}

            {myChats && myChats.length > 0 && (
              <Stack spacing={1}>
                {myChats.map((chat) => (
                  <Card
                    key={chat._id || chat.id}
                    elevation={0}
                    onClick={() => router.push(`/agents/sheets?id=${chat._id}`)}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      border: 1,
                      borderColor: "divider",
                      "&:hover": {
                        bgcolor: "action.hover",
                        borderColor: "primary.main",
                        elevation: 1,
                      },
                      "&:active": {
                        transform: "scale(0.98)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        "&:last-child": {
                          pb: { xs: 1.5, sm: 2 },
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          lineHeight: 1.3,
                        }}
                        title={chat.name}
                      >
                        {chat.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: "0.75rem", sm: "0.8rem" },
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 14 }} />
                        {format(
                          new Date(chat.createdAt),
                          "dd/MM/yyyy, hh:mm a"
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* ============== FOR AGENTS USAGE HISTORY ENDS ================ */}

      <Modal
        open={showOnboarding}
        onClose={handleCloseOnboarding}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Card
          sx={{
            maxWidth: 600,
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto",
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: PRIMARY_GREEN }}
              >
                Welcome to Shothik AI
              </Typography>
              <IconButton onClick={handleCloseOnboarding} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Experience the world's most advanced AI presentation generation
              system powered by 7 specialized agents working together.
            </Typography>

            <Stepper orientation="vertical" sx={{ mb: 3 }}>
              {ONBOARDING_STEPS.map((step, index) => (
                <Step key={index} active={true} completed={false}>
                  <StepLabel>
                    <Typography variant="h6" sx={{ color: "#333" }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleCloseOnboarding}
                sx={{
                  bgcolor: PRIMARY_GREEN,
                  "&:hover": { bgcolor: "#06A36D" },
                  px: 4,
                  py: 1.5,
                }}
              >
                Get Started
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Modal>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: `linear-gradient(45deg, ${PRIMARY_GREEN}, #00ff88)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Shothik Super Agent
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: PRIMARY_GREEN,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                  "100%": { opacity: 1 },
                },
              }}
            />
            <Typography variant="body2" sx={{ color: "#666" }}>
              4-Agent AI system ready to create presentations
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            mb: 4,
          }}
        >
          {NAVIGATION_ITEMS.map((item) => (
            <Button
              key={item.id}
              variant={selectedNavItem === item.id ? "contained" : "outlined"}
              startIcon={item.icon}
              onClick={() => handleNavItemClick(item.id)}
              disabled={item.isDisabled}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                position: "relative",
                borderColor:
                  selectedNavItem === item.id ? PRIMARY_GREEN : "#ddd",
                bgcolor:
                  selectedNavItem === item.id ? PRIMARY_GREEN : "transparent",
                color: selectedNavItem === item.id ? "white" : "#666",
                "&:hover": {
                  borderColor: PRIMARY_GREEN,
                  bgcolor:
                    selectedNavItem === item.id
                      ? PRIMARY_GREEN
                      : "rgba(7, 179, 122, 0.1)",
                  color: selectedNavItem === item.id ? "white" : PRIMARY_GREEN,
                },
              }}
            >
              {item.label}
              {item.isNew && (
                <Chip
                  label="New"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    bgcolor: "#ff4444",
                    color: "white",
                    fontSize: "0.7rem",
                    height: 18,
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              )}
              {item.isComingSoon && (
                <Chip
                  label="Coming soon"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    bgcolor: "#ff4444",
                    color: "white",
                    fontSize: "0.7rem",
                    height: 18,
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              )}
            </Button>
          ))}
        </Box>

        {selectedNavItem === "slides" && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: 2,
                color: isDarkMode ? "#fff" : "#333",
              }}
            >
              Quick Start Templates
            </Typography>
            <Grid container spacing={2} sx={{ maxWidth: 1000, mx: "auto" }}>
              {QUICK_START_TEMPLATES.map((template) => (
                <Grid item xs={12} sm={6} md={3} key={template.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      border: "1px solid #e0e0e0",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: template.color,
                        boxShadow: `0 4px 8px ${template.color}20`,
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent sx={{ textAlign: "center", p: 2 }}>
                      <Box sx={{ color: template.color, mb: 1 }}>
                        {template.icon}
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {template.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, fontSize: "0.8rem" }}
                      >
                        {template.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          justifyContent: "center",
                        }}
                      >
                        {template.examples.slice(0, 2).map((example) => (
                          <Chip
                            key={example}
                            label={example}
                            size="small"
                            sx={{
                              fontSize: "0.7rem",
                              height: 20,
                              bgcolor: `${template.color}10`,
                              color: template.color,
                              border: `1px solid ${template.color}30`,
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box
          sx={{
            maxWidth: 800,
            mx: "auto",
            bgcolor: isDarkMode ? "#161C24" : "#f8f9fa",
            borderRadius: 4,
            p: 3,
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={
                selectedNavItem === "slides"
                  ? "Create a presentation about..."
                  : "Ask anything, create anything..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "transparent",
                  color: "#333",
                  fontSize: "1.1rem",
                  border: "none",
                  "& fieldset": {
                    border: "none",
                  },
                  "& input": {
                    color: "#333",
                  },
                  "& textarea": {
                    color: isDarkMode ? "#fff" : "#333",
                  },
                },
                "& .MuiOutlinedInput-input::placeholder": {
                  color: "#999",
                  opacity: 1,
                },
              }}
            />
            <IconButton
              sx={{
                color: "#666",
                "&:hover": { color: PRIMARY_GREEN },
              }}
            >
              <MicIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                startIcon={<PersonIcon />}
                sx={{
                  color: "#666",
                  textTransform: "none",
                  "&:hover": {
                    color: PRIMARY_GREEN,
                    bgcolor: "rgba(7, 179, 122, 0.1)",
                  },
                }}
              >
                Personalize
              </Button>
              {isFirstTimeUser && (
                <Button
                  startIcon={<GpsFixedIcon />}
                  onClick={() => setShowOnboarding(true)}
                  sx={{
                    color: PRIMARY_GREEN,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "rgba(7, 179, 122, 0.1)",
                    },
                  }}
                >
                  Quick Tour
                </Button>
              )}
            </Box>

            <IconButton
              onClick={handleSubmit}
              disabled={
                !inputValue.trim() ||
                isInitiatingPresentation ||
                isInitiatingSheet
              }
              sx={{
                bgcolor: PRIMARY_GREEN,
                color: "white",
                width: 40,
                height: 40,
                "&:hover": {
                  bgcolor: "#06A36D",
                },
                "&.Mui-disabled": {
                  bgcolor: "#ddd",
                  color: "#999",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 4,
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: isDarkMode ? "#fff" : "#666", mb: 2 }}
          >
            {selectedNavItem === "slides"
              ? "Popular presentation topics:"
              : "Try these popular requests:"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {selectedNavItem === "slides"
              ? [
                  "Create a presentation about AI trends in 2024",
                  "Present our Q4 financial results",
                  "Explain machine learning to beginners",
                  "Product roadmap for next year",
                ]
              : [
                  "Summarize the latest tech news",
                  "Help me write a professional email",
                  "Generate a business plan outline",
                  "Create a marketing strategy",
                ].map((prompt) => (
                  <Chip
                    key={prompt}
                    label={prompt}
                    onClick={() => setInputValue(prompt)}
                    sx={{
                      bgcolor: "rgba(7, 179, 122, 0.1)",
                      color: PRIMARY_GREEN,
                      border: `1px solid ${PRIMARY_GREEN}33`,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "rgba(7, 179, 122, 0.2)",
                      },
                    }}
                  />
                ))}
          </Box>
        </Box>

        {selectedNavItem === "slides" && (
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{ color: isDarkMode ? "#fff" : "#333", mb: 3 }}
            >
              Powered by 7 AI Agents
            </Typography>
            <Grid container spacing={3} sx={{ maxWidth: 800, mx: "auto" }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center" }}>
                  <GpsFixedIcon
                    sx={{ fontSize: 40, color: PRIMARY_GREEN, mb: 1 }}
                  />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Smart Planning
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI analyzes your needs
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center" }}>
                  <PaletteIcon
                    sx={{ fontSize: 40, color: PRIMARY_GREEN, mb: 1 }}
                  />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Custom Design
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your style, your brand
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center" }}>
                  <FactCheckIcon
                    sx={{ fontSize: 40, color: PRIMARY_GREEN, mb: 1 }}
                  />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Quality Assured
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI validates everything
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>

      <LoginDialog
        loginDialogOpen={loginDialogOpen}
        setLoginDialogOpen={setLoginDialogOpen}
      />

      {/* snackbar for toast messages */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};


// Note: This code is for alerting user to login for using agentic services
const LoginDialog = ({ loginDialogOpen , setLoginDialogOpen}) => {
  const dispatch = useDispatch();
  return (
  <Dialog
    open={loginDialogOpen}
    onClose={() => setLoginDialogOpen(false)}
    aria-labelledby="login-dialog-title"
    aria-describedby="login-dialog-description"
  >
    <DialogTitle id="login-dialog-title">Authentication Required</DialogTitle>
    <DialogContent>
      <DialogContentText id="login-dialog-description">
        You need to be logged in to create a presentation. Please log in to
        continue.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setLoginDialogOpen(false)} color="secondary">
        Cancel
      </Button>
        <Button
          onClick={() => {
            dispatch(setShowLoginModal(true));
            setLoginDialogOpen(false);
          }}
          color="primary"
          variant="contained"
        >
          Login
        </Button>
    </DialogActions>
  </Dialog>
  );
};