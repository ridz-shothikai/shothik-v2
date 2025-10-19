"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Snackbar,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  useCreatePrivateShareMutation,
  useCreatePublicShareMutation,
} from "../../redux/api/shareAgent/shareAgentApi";

const ShareAgentModal = ({ open, onClose, agentId, agentData, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Advanced settings
  const [settings, setSettings] = useState({
    requireSignIn: false,
    allowCopy: true,
    allowExport: true,
    trackViews: true,
    password: "",
    expiryDate: "",
  });

  const [createPrivateShare, { isLoading: isPrivateLoading }] = useCreatePrivateShareMutation();
  const [createPublicShare, { isLoading: isPublicLoading }] = useCreatePublicShareMutation();

  // Reset tab when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Reset state when switching tabs
    setEmails([]);
    setCurrentEmail("");
    setMessage("");
    setShareLink("");
  };

  const handleAddEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (currentEmail && emailRegex.test(currentEmail)) {
      if (!emails.includes(currentEmail)) {
        setEmails([...emails, currentEmail]);
        setCurrentEmail("");
      } else {
        showSnackbar("Email already added", "warning");
      }
    } else {
      showSnackbar("Please enter a valid email address", "error");
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      showSnackbar("Link copied to clipboard!", "success");
    } catch (err) {
      showSnackbar("Failed to copy link", "error");
    }
  };

  const handlePrivateShare = async () => {
    if (emails.length === 0) {
      showSnackbar("Please add at least one email address", "error");
      return;
    }

    try {
      const response = await createPrivateShare({
        agentId,
        emails,
        message: message || undefined,
        content: agentData || {}, // Send the research content
        settings: {
          ...settings,
          expiryDate: settings.expiryDate || undefined,
          password: settings.password || undefined,
        },
      }).unwrap();

      if (response.success) {
        setShareLink(response.data.shareLink);
        showSnackbar(
          `Successfully sent to ${response.data.emailsSent} recipient(s)!`,
          "success"
        );
        // Don't close the modal so user can copy the link
      }
    } catch (error) {
      console.error("Error creating private share:", error);
      showSnackbar(
        error?.data?.error || "Failed to create private share",
        "error"
      );
    }
  };

  const handlePublicShare = async () => {
    try {
      const response = await createPublicShare({
        agentId,
        message: message || undefined,
        content: agentData || {}, // Send the research content
        settings: {
          ...settings,
          expiryDate: settings.expiryDate || undefined,
          password: settings.password || undefined,
        },
      }).unwrap();

      if (response.success) {
        setShareLink(response.data.shareLink);
        showSnackbar("Public share link created!", "success");
      }
    } catch (error) {
      console.error("Error creating public share:", error);
      showSnackbar(
        error?.data?.error || "Failed to create public share",
        "error"
      );
    }
  };

  const handleSettingChange = (setting) => (event) => {
    setSettings({
      ...settings,
      [setting]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    });
  };

  const handleClose = () => {
    // Reset all state
    setActiveTab(0);
    setEmails([]);
    setCurrentEmail("");
    setMessage("");
    setShareLink("");
    setSettings({
      requireSignIn: false,
      allowCopy: true,
      allowExport: true,
      trackViews: true,
      password: "",
      expiryDate: "",
    });
    setShowAdvanced(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: "500px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" component="div" fontWeight={600}>
            Share AI Research
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab
              icon={<EmailIcon />}
              label="Private (Email)"
              iconPosition="start"
            />
            <Tab
              icon={<LinkIcon />}
              label="Public Link"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <DialogContent sx={{ pt: 3, px: 3 }}>
          {/* Private Share Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Share this research privately by sending an email invitation
              </Typography>

              {/* Email Input */}
              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Add email addresses"
                  placeholder="Enter email and press Enter"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleAddEmail}
                          edge="end"
                          disabled={!currentEmail}
                        >
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText="Press Enter or click + to add"
                />
              </Box>

              {/* Email Chips */}
              {emails.length > 0 && (
                <Box mb={3} display="flex" flexWrap="wrap" gap={1}>
                  {emails.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      onDelete={() => handleRemoveEmail(email)}
                      deleteIcon={<DeleteIcon />}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}

              {/* Custom Message */}
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Custom message (optional)"
                placeholder="Add a personal message to your email..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Box>
          )}

          {/* Public Link Tab */}
          {activeTab === 1 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Anyone with this link can view your research. You can customize access settings below.
                </Typography>
              </Alert>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description (optional)"
                placeholder="Add a description for this shared link..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Box>
          )}

          {/* Share Link Display */}
          {shareLink && (
            <Box
              mt={3}
              p={2}
              sx={{
                bgcolor: "success.light",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "success.main",
              }}
            >
              <Typography variant="subtitle2" color="success.dark" gutterBottom>
                ✓ Share link created successfully!
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <TextField
                  fullWidth
                  value={shareLink}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Tooltip title="Copy link">
                  <IconButton onClick={handleCopyLink} color="primary">
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}

          {/* Advanced Settings */}
          <Box mt={3}>
            <Button
              startIcon={<SettingsIcon />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ mb: 2 }}
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Settings
            </Button>

            {showAdvanced && (
              <Box
                p={2}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  bgcolor: "background.paper",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.requireSignIn}
                      onChange={handleSettingChange("requireSignIn")}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2">Require sign-in</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Viewers must be logged in to access
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowCopy}
                      onChange={handleSettingChange("allowCopy")}
                    />
                  }
                  label="Allow copying content"
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowExport}
                      onChange={handleSettingChange("allowExport")}
                    />
                  }
                  label="Allow exporting"
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.trackViews}
                      onChange={handleSettingChange("trackViews")}
                    />
                  }
                  label="Track views"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  type="password"
                  label="Password protection (optional)"
                  value={settings.password}
                  onChange={handleSettingChange("password")}
                  sx={{ mb: 2 }}
                  helperText="Leave empty for no password"
                />

                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Expiry date (optional)"
                  value={settings.expiryDate}
                  onChange={handleSettingChange("expiryDate")}
                  InputLabelProps={{ shrink: true }}
                  helperText="Leave empty for no expiration"
                />
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          {activeTab === 0 && (
            <Button
              variant="contained"
              onClick={handlePrivateShare}
              disabled={isPrivateLoading || emails.length === 0}
              startIcon={isPrivateLoading ? <CircularProgress size={20} /> : <EmailIcon />}
            >
              {isPrivateLoading ? "Sending..." : `Send to ${emails.length} recipient(s)`}
            </Button>
          )}
          {activeTab === 1 && (
            <Button
              variant="contained"
              onClick={handlePublicShare}
              disabled={isPublicLoading}
              startIcon={isPublicLoading ? <CircularProgress size={20} /> : <LinkIcon />}
            >
              {isPublicLoading ? "Creating..." : "Generate Public Link"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareAgentModal;

