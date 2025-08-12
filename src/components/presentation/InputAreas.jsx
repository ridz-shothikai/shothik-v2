// components/InputArea.jsx
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import PersonIcon from "@mui/icons-material/Person";
import { Grid, useTheme } from "@mui/system";
import { AttachFile, Close } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useUploadPresentationFilesMutation } from "../../redux/api/presentation/presentationApi";
import { Alert, Card, CardContent, Chip, Snackbar, Tooltip } from "@mui/material";

const PRIMARY_GREEN = "#07B37A";

export default function InputArea({
  currentAgentType,
  inputValue,
  setInputValue,
  onSend,
  isLoading,
  setUploadedFiles,
  setFileUrls,
  uploadedFiles,
  fileUrls,
}) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const { user } = useSelector((state) => state.auth);
  const [uploadFiles, { isLoading: isUploading, error: uploadError }] =
    useUploadPresentationFilesMutation();

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showToast = (message, severity = "error") => {
    setToast({ open: true, message, severity });
  };

  // Updated click handler
  const handleClick = () => {
    // Trigger file input click
    document.getElementById("file-upload-input-slides").click();
  };

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

    const uploadData = {
      files, // Array of File objects
      userId: user._id,
    };

    console.log("Upload data:", {
      filesCount: files.length,
      userId: user._id,
      fileNames: files.map((f) => f.name),
    });

    try {
      // Show loading state
      showToast("Uploading files...", "info");

      const result = await uploadFiles(uploadData).unwrap();

      console.log("Upload successful:", result);
      showToast(`${files.length} file(s) uploaded successfully`, "success");

      if (result?.success) {
        setUploadedFiles((prev) => [...prev, ...result.data]);
        setFileUrls((prev) => [
          ...prev,
          ...result.data.map((file) => file.signed_url),
        ]);
      }

      // Clear the file input
      event.target.value = "";
    } catch (error) {
      // console.error("Upload failed:", error);

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
      setUploadedFiles([]); // Reset on error

      // Clear the file input on error
      event.target.value = "";
    }
  };

  const truncateFilename = (filename, maxLength = 20) => {
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
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
  };

  // Get file extension
  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          bgcolor:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "#f8f9fa",
        }}
      >
        <Box
          sx={{
            bgcolor:
            theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "#f8f9fa",
            borderRadius: 4,
            p: 3,
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            position: "relative"
          }}
          >

          {/* uploaded files preview STARTS */}
          {uploadedFiles?.length > 0 && (
            <Grid container spacing={1} sx={{ pt: { xs: 1, md: 2, xl: 3 }}}>
              {uploadedFiles?.map((file, index) => {
                const extension = getFileExtension(file.filename);
                const truncatedName = truncateFilename(file.filename);
  
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={12}
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
                        maxWidth: "120px"
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
                            pr: 2,
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={
                currentAgentType === "presentation"
                  ? "Create a presentation about..."
                  : "Ask anything, create anything..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "transparent",
                  color: "#333",
                  fontSize: "1rem",
                  border: "none",
                  "& fieldset": { border: "none" },
                  "& input": { color: "#333" },
                  "& textarea": { color: "#333" },
                },
                "& .MuiOutlinedInput-input::placeholder": {
                  color: "#999",
                  opacity: 1,
                },
              }}
            />
            {/* <IconButton
            sx={{ color: "#666", "&:hover": { color: PRIMARY_GREEN } }}
          >
            <MicIcon />
          </IconButton> */}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* This will be needed later */}
            {/* <input
              id="file-upload-input-slides"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            <Button
              startIcon={<AttachFile />}
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
            </Button> */}

            <IconButton
              onClick={() => onSend()}
              disabled={!inputValue.trim() || isLoading || isUploading}
              sx={{
                bgcolor: PRIMARY_GREEN,
                color: "white",
                width: 40,
                height: 40,
                "&:hover": { bgcolor: "#06A36D" },
                "&.Mui-disabled": { bgcolor: "#ddd", color: "#999" },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

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
    </>
  );
}
