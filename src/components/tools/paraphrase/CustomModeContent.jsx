// src/components/tools/paraphrase/CustomModeContent.jsx
import { Add, Close, Delete, Edit } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

/**
 * Reusable content component for creating/editing custom modes
 * Used in both modal and popover contexts
 */
const CustomModeContent = ({
  mode = "create", // 'create' or 'edit'
  existingModeName = "",
  recentModes = [],
  recommendedModes = [],
  onSubmit,
  onDelete,
  onClose,
  error = null,
  isLoading = false,
  showHeader = true,
  showActions = true,
}) => {
  const [modeName, setModeName] = useState(existingModeName);
  const [localError, setLocalError] = useState(null);

  console.log(modeName, "modeName in CustomModeContent");

  useEffect(() => {
    setModeName(existingModeName);
  }, [existingModeName]);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setModeName(value);
    setLocalError(null);
  };

  const handleSubmit = () => {
    const trimmed = modeName.trim();

    if (!trimmed) {
      setLocalError("Please enter a mode name");
      return;
    }

    if (trimmed.length < 2) {
      setLocalError("Mode name must be at least 2 characters");
      return;
    }

    if (trimmed.length > 30) {
      setLocalError("Mode name must be less than 30 characters");
      return;
    }

    onSubmit(trimmed);
  };

  const handleQuickSelect = (name) => {
    setModeName(name);
    setLocalError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {showHeader && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {mode === "create" ? "Create Custom Mode" : "Edit Custom Mode"}
          </Typography>
          {onClose && (
            <IconButton size="small" onClick={onClose}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}

      {/* Input Field */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Mode Name"
          placeholder="e.g., Conversational, Technical"
          value={modeName}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          error={Boolean(localError)}
          helperText={
            localError || "Enter a descriptive name for your custom mode"
          }
          autoFocus
          disabled={isLoading}
          InputProps={{
            endAdornment: isLoading && <CircularProgress size={20} />,
          }}
        />
      </Box>

      {/* Error Alert */}
      {localError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setLocalError(null)}
        >
          {localError}
        </Alert>
      )}

      {/* Recent Modes */}
      {recentModes.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 1, fontSize: 12 }}
          >
            Recently Used
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {recentModes.map((recent, index) => (
              <Chip
                key={index}
                label={recent}
                size="small"
                onClick={() => handleQuickSelect(recent)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: "primary.lighter" },
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Recommended Modes */}
      {recommendedModes.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 1, fontSize: 12 }}
          >
            Recommended Modes
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {recommendedModes.map((recommended, index) => (
              <Chip
                key={index}
                label={recommended}
                size="small"
                variant="outlined"
                onClick={() => handleQuickSelect(recommended)}
                icon={<Add fontSize="small" />}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "primary.lighter",
                    borderColor: "primary.main",
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Action Buttons */}
      {showActions && (
        <>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Box>
              {mode === "edit" && onDelete && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={onDelete}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              )}
            </Box>
            <Stack direction="row" spacing={1}>
              {onClose && (
                <Button
                  variant="outlined"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={mode === "create" ? <Add /> : <Edit />}
                onClick={handleSubmit}
                disabled={!modeName.trim() || isLoading}
              >
                {mode === "create" ? "Create Mode" : "Update Mode"}
              </Button>
            </Stack>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default CustomModeContent;
