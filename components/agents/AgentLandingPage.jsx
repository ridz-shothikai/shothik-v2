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
import SendIcon from "@mui/icons-material/Send";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import TableChartIcon from "@mui/icons-material/TableChart";
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
  Tooltip,
} from "@mui/material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import { useAgentContext } from "./shared/AgentContextProvider";

import { useDispatch, useSelector } from "react-redux";
import { setResearchToken, setSheetToken, setShowLoginModal } from "../../src/redux/slice/auth";
import {handleResearchRequest, handleSheetGenerationRequest, handleSlideCreation} from "./super-agent/agentPageUtils"
import { Snackbar, Alert } from "@mui/material";
import {
  Close as CloseIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  AccessTime as AccessTimeIcon,
  Close,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import useResponsive from "../../src/hooks/useResponsive";
import { setAgentHistoryMenu } from "../../src/redux/slice/tools";
import { useGetMyChatsQuery } from "../../src/redux/api/sheet/sheetApi";
import useSheetAiToken from "../../src/hooks/useRegisterSheetService";
import ChatSidebar from "./ChatSidebar";
import { LinkIcon } from "lucide-react";
import SearchDropdown from "./SearchDropDown";
import useNavItemFiles from "../../src/hooks/useNavItemFiles";
import { useFetchAllPresentationsQuery, useUploadPresentationFilesMutation } from "../../src/redux/api/presentation/presentationApi";
import {useResearchAiToken} from "../../src/hooks/useRegisterResearchService";
import ModelSelectForResearch from "./ModelSelectForResearch";

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
    id: "research",
    label: "Deep research",
    icon: <ManageSearchIcon />,
    isNew: true,
    isComingSoon: false,
    isDisabled: false,
  },
  {
    id: "browse",
    label: "Browse for me",
    icon: <AutoModeIcon />,
    isNew: false,
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
  const { accessToken, sheetToken } = useSelector((state) => state.auth);
  const {
    data: myChats,
    isLoading: SheetDataLoading,
    error,
    refetch: refetchChatHistory,
  } = useGetMyChatsQuery();
  const {
    data: slidesChats,
    isLoading: SlideDataLoading,
    error: SlideDataLoadingError,
  } = useFetchAllPresentationsQuery();
  const [uploadFilesForSlides, { isLoading: isUploading, error: uploadError }] =
    useUploadPresentationFilesMutation();
  // const [initiatePresentation, { isLoading: isInitiatingPresentation }] =
  //   useCreatePresentationMutation();
  // console.log(myChats, "myChats");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isInitiatingPresentation, setIsInitiatingPresentation] =
    useState(false);
  const [isInitiatingSheet, setIsInitiatingSheet] = useState(false);
  const [isInitiatingResearch, setIsInitiatingResearch] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // console.log(selectedNavItem, "-selectedNavItem");

  // Add this state to your component
  // const [uploadedFiles, setUploadedFiles] = useState([]);
  // const [fileUrls, setFileUrls] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    currentFiles,
    currentUrls,
    addFiles,
    removeFile,
    clearCurrentNavItem, // if needed
    clearAllNavItems, // if needed
    hasFiles,
  } = useNavItemFiles(selectedNavItem);

  // RESEARCH STATES
  const [researchModel, setResearchModel] = useState("gemini-2.0-flash");
  const [topLevel, setTopLevel] = useState(3); // used for cofig -> 1.number_of_initial_queries, 2.max_research_loops

  // console.log(currentFiles, "<-currentFiles", currentUrls, "<- currentUrls");

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (type) => {
    console.log(`Selected: ${type}`);
    // You can trigger file picker logic here
    handleClose();
  };

  // console.log(slidesChats, "slides data");
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // console.log(isNavbarExpanded, "isNavbarExpanded");

  const toggleDrawer = (open) => () => {
    dispatch(setAgentHistoryMenu(open)); // will be used on Navbar to handle navbar expansion
  };

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useResponsive("down", "sm");

  const user = useSelector((state) => state.auth.user);

  /**
   * When we come to the agents page if user is not registered to our services, make them register it.
   */
  const { sheetAIToken, refreshSheetAIToken } = useSheetAiToken();
  const {researchAIToken, refreshResearchAiToken} = useResearchAiToken();

  // for saving sheet token to redux state
  useEffect(() => {
    // We will save token on redux and based on that we will generate users sheet chat data
    if (!sheetAIToken) return;

    dispatch(setSheetToken(sheetAIToken));

    // if sheet token saved to our local storage then we can try to refetch again to get the user sheet chat data
    refetchChatHistory();
    console.log("chat data refetched");
  }, [sheetAIToken]);

  // for saving research token to redux state
  useEffect(() => {
    // We will save token on redux and based on that we will generate users sheet chat data
    if (!researchAIToken) return;

    dispatch(setResearchToken(researchAIToken));

    // if research token saved to our local storage then we can try to refetch again to get the user research chat data
    // console.log("chat data for research refetched");
  }, [researchAIToken])

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
            currentUrls,
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
            showToast,
            refreshSheetAIToken
          );
        case "research":
          return await handleResearchRequest(
            inputValue,
            researchModel,
            topLevel,
            setIsInitiatingResearch,
            setLoginDialogOpen,
            setIsSubmitting,
            showToast,
            refreshResearchAiToken,
            router
          );
        case "browse":
          return console.log("browse route");
        default:
          return console.log("all agents route");
      }
    } catch (error) {
      // console.error("[AgentLandingPage] Error initiating presentation:", error);
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
  const showToast = (message, severity = "error") => {
    setToast({ open: true, message, severity });
  };

  // Updated click handler
  const handleClick = () => {
    // Trigger file input click
    document.getElementById("file-upload-input").click();
  };

  // File upload handler
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    console.log(
      "Selected files:",
      files.map((f) => ({ name: f.name, type: f.type, size: f.size }))
    );

    // Check file type and size
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB
    const invalidFiles = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (invalid type: ${file.type})`);
      } else if (file.size > maxSize) {
        invalidFiles.push(
          `${file.name} (too large: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
        );
      }
    }

    if (invalidFiles.length > 0) {
      showToast(`Invalid files: ${invalidFiles.join(", ")}`, "error");
      return;
    }

    // Validate user
    if (!user?._id) {
      showToast("User not authenticated", "error");
      return;
    }

    let uploadData;

    switch (selectedNavItem) {
      case "slides": {
        uploadData = {
          files, // Array of File objects
          userId: user._id,
        };
        // console.log("Upload data:", {
        //   filesCount: files.length,
        //   userId: user._id,
        //   fileNames: files.map((f) => f.name),
        // });
        return await FileUploadForSlides(event, uploadData, files);
      }
      case "sheets":
        return await FileUploadForSheets();
      case "research":
        return await FileUploadForDeepResearch();
      case "browse":
        return await FileUploadForBrowserAgents();
      default:
        return showToast("Invalid type of agents. Try again", "info");
    }
  };

  const truncateFilename = (filename, maxLength = 30) => {
    if (filename.length <= maxLength) return filename;
    const extension = getFileExtension(filename);
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf("."));
    const truncatedName = nameWithoutExt.substring(
      0,
      maxLength - extension.length - 4
    );
    return `${truncatedName}...${extension}`;
  };

  const handleRemoveFile = (index, filename) => {
    // const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    // setUploadedFiles(updatedFiles);

    removeFile(index);
  };

  // Get file extension
  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  // console.log(fileUrls, "File urls");

  const FileUploadForSlides = async (event, uploadData, files) => {
    try {
      // Show loading state
      showToast("Uploading files...", "info");

      const result = await uploadFilesForSlides(uploadData).unwrap();

      // console.log("Upload successful:", result);

      if (result?.success) {
        // setUploadedFiles((prev) => [...prev, ...result.data]);
        // setFileUrls((prev) => [
        //   ...prev,
        //   ...result.data.map((file) => file.signed_url),
        // ]);
        const newUrls = result.data.map((file) => file.signed_url);
        addFiles(result.data, newUrls);
        showToast(`${files.length} file(s) uploaded successfully`, "success");
      }

      // Clear the file input
      event.target.value = "";
    } catch (error) {
      console.error("Upload failed:", error);

      // More detailed error messages
      let errorMessage = "Failed to upload files. Please try again.";

      if (error.status === "FETCH_ERROR") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.status === 400) {
        errorMessage = "Bad request. Please check file format and try again.";
      } else if (error.status === 413) {
        errorMessage =
          "Files too large. Please reduce file size and try again.";
      } else if (error.data) {
        errorMessage = error.data.message || errorMessage;
      }

      showToast(errorMessage, "error");
      // setUploadedFiles([]); // Reset on error

      // Clear the file input on error
      event.target.value = "";
    }
  };

  const FileUploadForSheets = async () => {};

  const FileUploadForDeepResearch = async () => {};

  const FileUploadForBrowserAgents = async () => {};

  // console.log(researchModel, researchLoops, "research model");

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
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        toggleDrawer={toggleDrawer}
        isMobile={isMobile}
        isNavbarExpanded={isNavbarExpanded}
        isDarkMode={isDarkMode}
        isLoading={SheetDataLoading}
        error={error}
        router={router}
        myChats={myChats}
        SlideDataLoading={SlideDataLoading}
        slidesChats={slidesChats?.data}
        SlideDataLoadingError={SlideDataLoadingError}
      />

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
            Shothik Agent
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
            <Grid
              container
              spacing={2}
              sx={{ maxWidth: 1000, mx: "auto", width: "100%" }}
            >
              {QUICK_START_TEMPLATES.map((template) => (
                <Grid item xs={12} sm={6} md={3} key={template.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      width: "100%",
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
            {/* <IconButton
              sx={{
                color: "#666",
                "&:hover": { color: PRIMARY_GREEN },
              }}
            >
              <MicIcon />
            </IconButton> */}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedNavItem === "research" && (
                <SearchDropdown
                  setResearchModel={setResearchModel}
                  setTopLevel={setTopLevel}
                />
              )}
              {/* Hidden file input for slide file selection */}
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                multiple
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              {(selectedNavItem === "slides" ||
                selectedNavItem === "research") && (
                <Button
                  startIcon={<LinkIcon />}
                  onClick={handleClick}
                  sx={{
                    color: "#666",
                    textTransform: "none",
                    "&:hover": {
                      color: PRIMARY_GREEN,
                      bgcolor: "rgba(7, 179, 122, 0.1)",
                    },
                  }}
                >
                  Attach
                </Button>
              )}

              {/* <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => handleSelect("image")}>
                  <ListItemIcon>
                    <ImageIcon fontSize="small" />
                  </ListItemIcon>
                  Image
                </MenuItem>
                <MenuItem onClick={() => handleSelect("document")}>
                  <ListItemIcon>
                    <DescriptionIcon fontSize="small" />
                  </ListItemIcon>
                  Document
                </MenuItem>
              </Menu> */}

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

            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: 2,
              }}
            >
              <IconButton
                onClick={handleSubmit}
                disabled={
                  !inputValue.trim() ||
                  isInitiatingPresentation ||
                  isInitiatingSheet ||
                  isUploading ||
                  isInitiatingResearch
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

              {/* for research only */}
              {/* {
                selectedNavItem === "research" && <ModelSelectForResearch/>
              } */}
            </Box>
          </Box>

          {/* uploaded files preview STARTS */}
          {hasFiles > 0 && (
            <Grid container spacing={1} sx={{ pt: { xs: 1, md: 2, xl: 3 } }}>
              {currentFiles?.map((file, index) => {
                const extension = getFileExtension(file.filename);
                const truncatedName = truncateFilename(file.filename);

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={`${file.filename}-${index}`}
                  >
                    <Card
                      sx={{
                        position: "relative",
                        bgcolor: isDarkMode ? "#1e1e1e" : "#fff",
                        border: `1px solid ${isDarkMode ? "#333" : "#e0e0e0"}`,
                        borderRadius: 2,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          boxShadow: isDarkMode
                            ? "0 4px 12px rgba(7, 179, 122, 0.2)"
                            : "0 4px 12px rgba(0,0,0,0.1)",
                          borderColor: PRIMARY_GREEN,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        {/* Remove button */}
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFile(index, file.filename)}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "#999",
                            bgcolor: isDarkMode
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.05)",
                            width: 24,
                            height: 24,
                            "&:hover": {
                              bgcolor: "#f44336",
                              color: "white",
                            },
                          }}
                        >
                          <Close fontSize="small" />
                        </IconButton>

                        {/* File icon and info */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Tooltip title={file.filename}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: isDarkMode ? "#fff" : "#333",
                                  lineHeight: 1.3,
                                  mb: 0.5,
                                  wordBreak: "break-word",
                                }}
                              >
                                {truncatedName}
                              </Typography>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* File extension chip */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Chip
                            label={extension.toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: PRIMARY_GREEN,
                              color: "white",
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              height: 20,
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
          {/* uploaded files preview ENDS */}
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