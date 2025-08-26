import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Send as SendIcon,
  Link as LinkIcon,
  GpsFixed as GpsFixedIcon,
  Close,
  Mic as MicIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {useResearchStream} from "../../../hooks/useResearchStream"

const PRIMARY_GREEN = "#07B37A";

const ChatInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedNavItem, setSelectedNavItem] = useState("slides"); // Default to slides for demo
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Loading states
  const [isInitiatingPresentation, setIsInitiatingPresentation] =
    useState(false);
  const [isInitiatingSheet, setIsInitiatingSheet] = useState(false);
  // const [isUploading, setIsUploading] = useState(false);
  const [isInitiatingResearch, setIsInitiatingResearch] = useState(false);

  // REDUX
  const dispatch = useDispatch();
  const [effort, setEffort] = useState("medium");
  const [model, setModel] = useState("gemini-2.5-pro");
  const { uploadedFiles, isUploading } = useSelector((state) => state.researchUi);
  const { isStreaming } = useSelector((state) => state.researchCore);

  const { startResearch, cancelResearch } = useResearchStream();


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isStreaming) return;

    console.log("Submitting research query:", inputValue);
    // return;
    try {
      await startResearch(inputValue, { effort, model });
      setInputValue("");
    } catch (error) {
      console.error("Research failed:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Simulate file upload
    document.getElementById("file-upload-input")?.click();
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file, index) => ({
      filename: file.name,
      file: file,
      id: Date.now() + index,
    }));
    setCurrentFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index, filename) => {
    setCurrentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileExtension = (filename) => {
    return filename.split(".").pop() || "file";
  };

  const truncateFilename = (filename, maxLength = 25) => {
    if (filename.length <= maxLength) return filename;
    const extension = getFileExtension(filename);
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf("."));
    const truncatedName = nameWithoutExt.substring(
      0,
      maxLength - extension.length - 4
    );
    return `${truncatedName}...${extension}`;
  };

  const hasFiles = currentFiles.length;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto",
        py: 2,
        // backgroundColor: "#F4F6F8",
      }}
    >
      <Box
        sx={{
          maxWidth: 1000,
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
            placeholder="Ask a followup..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            // disabled={isStreaming || isUploading}
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
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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
                isInitiatingResearch ||
                isStreaming
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

        {/* uploaded files preview STARTS */}
        {/* {hasFiles > 0 && (
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
        )} */}
      </Box>
    </Box>
  );
};

export default ChatInput;
