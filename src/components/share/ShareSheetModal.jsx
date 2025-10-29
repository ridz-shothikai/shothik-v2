"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { useCreatePrivateShareMutation, useCreatePublicShareMutation } from "../../redux/api/shareAgent/shareAgentApi";

const ShareSheetModal = ({ 
  open, 
  onClose, 
  sheetId, 
  sheetData, 
  chatId 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState("");
  const [emails, setEmails] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [settings, setSettings] = useState({
    requireSignIn: false,
    allowCopy: true,
    allowExport: true,
    trackViews: true,
    password: "",
    expiryDate: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [createPrivateShare, { isLoading: isPrivateLoading }] = useCreatePrivateShareMutation();
  const [createPublicShare, { isLoading: isPublicLoading }] = useCreatePublicShareMutation();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setShareLink(""); // Clear previous share link
  };

  const handleClose = () => {
    setActiveTab(0);
    setMessage("");
    setEmails("");
    setShareLink("");
    setShowAdvanced(false);
    setSettings({
      requireSignIn: false,
      allowCopy: true,
      allowExport: true,
      trackViews: true,
      password: "",
      expiryDate: "",
    });
    onClose();
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showSnackbar("Link copied to clipboard!", "success");
    }).catch(() => {
      showSnackbar("Failed to copy link", "error");
    });
  };

  const handlePrivateShare = async () => {
    if (!emails.trim()) {
      showSnackbar("Please enter at least one email address", "error");
      return;
    }

    const emailList = emails.split(",").map(email => email.trim()).filter(email => email);
    
    if (emailList.length === 0) {
      showSnackbar("Please enter valid email addresses", "error");
      return;
    }

    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📤 CREATING PRIVATE SHARE');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🆔 Chat ID being saved:', chatId);
      console.log('📧 Emails:', emailList);
      console.log('📝 Sheet ID:', sheetId);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const response = await createPrivateShare({
        agentId: sheetId,
        emails: emailList,
        message: message || undefined,
        content: {
          type: "sheet",
          data: sheetData,
          metadata: {
            title: "Shared Sheet Data",
            description: "A spreadsheet shared from Shothik AI",
            createdAt: new Date().toISOString(),
            originalChatId: chatId,
            chatId: chatId,
          }
        },
        settings: {
          ...settings,
          expiryDate: settings.expiryDate || undefined,
          password: settings.password || undefined,
        },
      }).unwrap();

      if (response.success) {
        // Convert the share link to point to shared-sheet page
        const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin;
        const shareLink = `${baseUrl}/shared-sheet/${response.data.shareId}`;
        setShareLink(shareLink);
        showSnackbar(
          `Successfully sent to ${response.data.emailsSent} recipient(s)!`,
          "success"
        );
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
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📤 CREATING PUBLIC SHARE');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🆔 Chat ID being saved:', chatId);
      console.log('📝 Sheet ID:', sheetId);
      console.log('📊 Sheet Data rows:', sheetData?.length);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const response = await createPublicShare({
        agentId: sheetId,
        message: message || undefined,
        content: {
          type: "sheet",
          data: sheetData,
          metadata: {
            title: "Shared Sheet Data",
            description: "A spreadsheet shared from Shothik AI",
            createdAt: new Date().toISOString(),
            originalChatId: chatId,
            chatId: chatId,
          }
        },
        settings: {
          ...settings,
          expiryDate: settings.expiryDate || undefined,
          password: settings.password || undefined,
        },
      }).unwrap();

      if (response.success) {
        // Convert the share link to point to shared-sheet page
        const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin;
        const shareLink = `${baseUrl}/shared-sheet/${response.data.shareId}`;
        setShareLink(shareLink);
        showSnackbar("✓ Share link created successfully!", "success");
      }
    } catch (error) {
      console.error("Error creating public share:", error);
      showSnackbar(
        error?.data?.error || "Failed to create public share",
        "error"
      );
    }
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
            minHeight: 500,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          pb: 1
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShareIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Share Sheet Data
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            sx={{ mb: 3 }}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab 
              icon={<EmailIcon />} 
              label="Private (Email)" 
              iconPosition="start"
              sx={{ textTransform: "none" }}
            />
            <Tab 
              icon={<LinkIcon />} 
              label="Public Link" 
              iconPosition="start"
              sx={{ textTransform: "none" }}
            />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Send this sheet directly to specific people via email.
              </Typography>
              
              <TextField
                fullWidth
                label="Email addresses"
                placeholder="Enter email addresses separated by commas"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                multiline
                rows={2}
                sx={{ mb: 2 }}
                helperText="Separate multiple emails with commas"
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Anyone with this link can view your sheet. You can customize access settings below.
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Description (optional)"
            placeholder="Add a message about this shared sheet..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />

          {shareLink && (
            <Alert severity="success" sx={{ mb: 3 }}>
              ✓ Share link created successfully!
              <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Share Link:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    value={shareLink}
                    fullWidth
                    size="small"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={() => copyToClipboard(shareLink)}
                            size="small"
                          >
                            <CopyIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            </Alert>
          )}

          <Button
            variant="text"
            onClick={() => setShowAdvanced(!showAdvanced)}
            sx={{ mb: 2 }}
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Settings
          </Button>

          {showAdvanced && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.requireSignIn}
                    onChange={(e) => setSettings({...settings, requireSignIn: e.target.checked})}
                  />
                }
                label="Require sign-in to view"
                sx={{ mb: 1 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allowCopy}
                    onChange={(e) => setSettings({...settings, allowCopy: e.target.checked})}
                  />
                }
                label="Allow copying to personal account"
                sx={{ mb: 1 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allowExport}
                    onChange={(e) => setSettings({...settings, allowExport: e.target.checked})}
                  />
                }
                label="Allow data export"
                sx={{ mb: 1 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.trackViews}
                    onChange={(e) => setSettings({...settings, trackViews: e.target.checked})}
                  />
                }
                label="Track views and analytics"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password (optional)"
                type="password"
                value={settings.password}
                onChange={(e) => setSettings({...settings, password: e.target.value})}
                size="small"
                sx={{ mb: 2 }}
                helperText="Set a password to protect the shared link"
              />

              <TextField
                fullWidth
                label="Expiry Date (optional)"
                type="date"
                value={settings.expiryDate}
                onChange={(e) => setSettings({...settings, expiryDate: e.target.value})}
                size="small"
                InputLabelProps={{ shrink: true }}
                helperText="Set when this share should expire"
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={activeTab === 0 ? handlePrivateShare : handlePublicShare}
            variant="contained"
            disabled={isPrivateLoading || isPublicLoading}
            sx={{ textTransform: "none" }}
          >
            {isPrivateLoading || isPublicLoading 
              ? "Creating..." 
              : activeTab === 0 
                ? "Send Emails" 
                : "Generate Public Link"
            }
          </Button>
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

export default ShareSheetModal;