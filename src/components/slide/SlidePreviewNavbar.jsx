"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Checkbox,
  TextField,
  InputAdornment,
  Tooltip,
  Divider,
  Switch,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Collapse,
} from "@mui/material";
import {
  PlayArrow,
  FileDownload,
  MoreVert,
  Description,
  Image as ImageIcon,
  Edit as EditIcon,
  PictureAsPdf,
  Share as ShareIcon,
  ContentCopy,
  Link as LinkIcon,
  Visibility,
  VisibilityOff,
  Email,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  QrCode,
  AccessTime,
  Security,
  People,
  Analytics,
  ExpandMore,
  ExpandLess,
  Check,
} from "@mui/icons-material";
import { usePresentation } from "./context/SlideContextProvider";
import { handleAdvancedPptxExport } from "../../libs/presentationExporter";
import { handleNativePptxExport } from "../../libs/nativePresentationExporter";
import { handlePDFExport } from "../../libs/pdfPresentationExporter";
import {
  useGenerateShareLinkMutation,
  useGetShareAnalyticsQuery,
  useUpdateShareSettingsMutation,
} from "../../redux/api/share/shareApi";
import { useSearchParams } from "next/navigation";

export default function SlidePreviewNavbar({
  slidesData,
  shareSettings,
  PresentationTitle,
  isSharedPage = false,
}) {
  // console.log(shareSettings, "shareSettings");
  const { openPresentation } = usePresentation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const searchParams = useSearchParams();
  const presentationId = searchParams.get("project_id");

  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfOptions, setPdfOptions] = useState({
    format: "presentation",
    orientation: "landscape",
    quality: 0.92,
    margin: 10,
  });

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isDiscoverable, setIsDiscoverable] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareSettingsState, setShareSettingsState] = useState({
    allowComments: true,
    allowDownload: true,
    expiryDate: null,
    password: "",
    requireSignIn: false,
    trackViews: true,
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [shareStats, setShareStats] = useState({
    views: 0,
    uniqueVisitors: 0,
    lastViewed: null,
  });

  // RTK Query hooks
  const [generateShareLink, { isLoading: isGeneratingLink }] =
    useGenerateShareLinkMutation();
  const [updateShareSettings] = useUpdateShareSettingsMutation();
  const { data: analyticsData, refetch: refetchAnalytics } =
    useGetShareAnalyticsQuery(presentationId, {
      skip: !presentationId || !shareLink,
    });

  // Update share stats when analytics data changes
  useEffect(() => {
    if (analyticsData?.analytics) {
      setShareStats(analyticsData.analytics);
    }
  }, [analyticsData]);

  const isExportMenuOpen = Boolean(exportAnchorEl);

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleImagePptxExport = async () => {
    handleExportClose();
    if (!slidesData?.data || slidesData.data.length === 0) {
      showSnackbar("No slides available to export", "error");
      return;
    }

    setIsExporting(true);
    try {
      const result = await handleAdvancedPptxExport(slidesData.data, {
        fileName: "presentation-images.pptx",
      });

      if (result.success) {
        showSnackbar(
          "Presentation exported successfully as images!",
          "success"
        );
      } else {
        showSnackbar(result.error || "Export failed", "error");
      }
    } catch (error) {
      console.error("Export error:", error);
      showSnackbar("An error occurred during export", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativePptxExportClick = async () => {
    handleExportClose();
    if (!slidesData?.data || slidesData.data.length === 0) {
      showSnackbar("No slides available to export", "error");
      return;
    }

    setIsExporting(true);
    try {
      const result = await handleNativePptxExport(slidesData.data, {
        fileName: "presentation-editable.pptx",
      });

      if (result.success) {
        showSnackbar("Editable presentation exported successfully!", "success");
      } else {
        console.error("Native Export Failed:", result.error);
        showSnackbar(result.error || "Native export failed", "error");
      }
    } catch (error) {
      console.error("Native export error:", error);
      showSnackbar("An error occurred during native export", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePDFExportClick = () => {
    handleExportClose();
    setPdfDialogOpen(true);
  };

  const handlePDFDialogClose = () => {
    setPdfDialogOpen(false);
  };

  const handlePDFExportConfirm = async () => {
    if (!slidesData?.data || slidesData.data.length === 0) {
      showSnackbar("No slides available to export", "error");
      return;
    }

    setPdfDialogOpen(false);
    setIsExporting(true);

    try {
      const result = await handlePDFExport(slidesData.data, {
        fileName: "presentation.pdf",
        ...pdfOptions,
      });

      if (result.success) {
        showSnackbar(result.message || "PDF exported successfully!", "success");
      } else {
        showSnackbar(result.error || "PDF export failed", "error");
      }
    } catch (error) {
      console.error("PDF export error:", error);
      showSnackbar("An error occurred during PDF export", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePDFOptionChange = (key, value) => {
    setPdfOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleShareClick = () => {
    setShareDialogOpen(true);
  };

  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
    setShareLink("");
    setIsDiscoverable(false);
    setLinkCopied(false);
    setShowAdvancedOptions(false);
    setShareSettingsState({
      allowComments: true,
      allowDownload: true,
      expiryDate: null,
      password: "",
      requireSignIn: false,
      trackViews: true,
    });
  };

  const handleGenerateShareLink = async () => {
    if (!presentationId) {
      showSnackbar("No presentation ID available", "error");
      return;
    }

    try {
      const response = await generateShareLink(presentationId).unwrap();
      const { shareLink: newShareLink, settings } = response;
      setShareLink(newShareLink);
      setShareSettingsState(settings);
      setIsDiscoverable(settings.isDiscoverable);
      showSnackbar("Share link generated successfully!", "success");
      setTimeout(() => {
        if (newShareLink && presentationId) {
          refetchAnalytics();
        }
      }, 100);
    } catch (error) {
      console.error("Link generation error:", error);
      showSnackbar(
        error.data?.error || "Failed to generate share link",
        "error"
      );
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      showSnackbar("Link copied to clipboard!", "success");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      showSnackbar("Failed to copy link", "error");
    }
  };

  const handleSocialShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareLink);
    const title = encodeURIComponent(
      `Check out this presentation: ${slidesData?.title || "Slides"}`
    );

    const socialUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${title}%20${encodedUrl}`,
      email: `mailto:?subject=${title}&body=Check out this presentation: ${shareLink}`,
    };

    if (socialUrls[platform]) {
      window.open(socialUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const handleShareSettingChange = async (key, value) => {
    if (!presentationId) {
      showSnackbar("No presentation ID available", "error");
      return;
    }

    setShareSettingsState((prev) => ({
      ...prev,
      [key]: value,
    }));

    try {
      await updateShareSettings({
        presentationId: presentationId,
        settings: { [key]: value },
      }).unwrap();
      showSnackbar("Share settings updated successfully!", "success");
    } catch (error) {
      console.error("Error updating share settings:", error);
      showSnackbar(
        error.data?.error || "Failed to update share settings",
        "error"
      );
      setShareSettingsState((prev) => ({
        ...prev,
        [key]: !value,
      }));
    }
  };

  // const isDownloadAllowed = shareSettings?.allowDownload !== false; // when exporting will fully functional only then make the export button available.
  const isDownloadAllowed = false;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          backgroundColor: "white",
          color: "black",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 1, sm: 2, md: 3 },
            py: { xs: 0.5, sm: 1 },
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              flex: 1,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
                minWidth: 0,
                flex: 1,
              }}
            >
              <Description
                sx={{
                  fontSize: { xs: 18, sm: 20 },
                  color: "#666",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  color: "#333",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                }}
              >
                {slidesData?.title || PresentationTitle || "Generating..."}
              </Typography>

              {!isMobile && slidesData?.data && (
                <Chip
                  label={`${slidesData.data.length} slides`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "0.75rem",
                    height: 24,
                    color: "#666",
                    borderColor: "#e0e0e0",
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
          </Box>

          <Stack
            direction="row"
            spacing={{ xs: 0.5, sm: 1 }}
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            <Button
              variant="contained"
              startIcon={!isMobile ? <PlayArrow /> : undefined}
              onClick={openPresentation}
              disabled={(!slidesData?.data || slidesData.data.length === 0) && !slidesData}
              sx={{
                backgroundColor: "#1976d2",
                color: "white",
                textTransform: "none",
                fontWeight: 500,
                px: { xs: 1, sm: 2 },
                py: 0.5,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                minWidth: { xs: "auto", sm: "auto" },
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              {isMobile ? <PlayArrow /> : "Play Slides"}
            </Button>

            {isDownloadAllowed && (
              <Button
                variant="outlined"
                startIcon={
                  !isMobile && !isExporting ? <FileDownload /> : undefined
                }
                onClick={handleExportClick}
                disabled={
                  !slidesData?.data ||
                  slidesData.data.length === 0 ||
                  isExporting
                }
                sx={{
                  color: "#ff9800",
                  borderColor: "#ff9800",
                  textTransform: "none",
                  fontWeight: 500,
                  px: { xs: 1, sm: 2 },
                  py: 0.5,
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  minWidth: { xs: "auto", sm: "auto" },
                  "&:hover": {
                    borderColor: "#f57c00",
                    backgroundColor: "rgba(255, 152, 0, 0.04)",
                  },
                }}
              >
                {isExporting ? (
                  <CircularProgress size={16} sx={{ color: "#ff9800" }} />
                ) : isMobile ? (
                  <FileDownload />
                ) : (
                  "Export"
                )}
              </Button>
            )}

            {!isSharedPage && (
              <Button
                variant="outlined"
                startIcon={!isMobile ? <ShareIcon /> : undefined}
                onClick={handleShareClick}
                disabled={!slidesData?.data || slidesData.data.length === 0}
                sx={{
                  color: "#4caf50",
                  borderColor: "#4caf50",
                  textTransform: "none",
                  fontWeight: 500,
                  px: { xs: 1, sm: 2 },
                  py: 0.5,
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  minWidth: { xs: "auto", sm: "auto" },
                  "&:hover": {
                    borderColor: "#388e3c",
                    backgroundColor: "rgba(76, 175, 80, 0.04)",
                  },
                }}
              >
                {isMobile ? <ShareIcon /> : "Share"}
              </Button>
            )}

            <Menu
              anchorEl={exportAnchorEl}
              open={isExportMenuOpen}
              onClose={handleExportClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  "& .MuiMenuItem-root": {
                    px: 2,
                    py: 1.5,
                  },
                },
              }}
            >
              <MenuItem onClick={handlePDFExportClick}>
                <ListItemIcon>
                  <PictureAsPdf fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Export as PDF"
                  secondary="Portable document format"
                />
              </MenuItem>
              <MenuItem onClick={handleImagePptxExport}>
                <ListItemIcon>
                  <ImageIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Export as Images"
                  secondary="High-quality image slides in ppt"
                />
              </MenuItem>
              <MenuItem onClick={handleNativePptxExportClick} disabled>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Export as Editable"
                  secondary="Editable PowerPoint format (Coming soon)"
                />
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* PDF Export Dialog */}
      <Dialog
        open={pdfDialogOpen}
        onClose={handlePDFDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>PDF Export Options</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Page Format</InputLabel>
              <Select
                value={pdfOptions.format}
                label="Page Format"
                onChange={(e) =>
                  handlePDFOptionChange("format", e.target.value)
                }
              >
                <MenuItem value="presentation">Presentation (16:9)</MenuItem>
                <MenuItem value="a4">A4</MenuItem>
                <MenuItem value="letter">Letter</MenuItem>
              </Select>
            </FormControl>

            <FormControl component="fieldset">
              <FormLabel component="legend">Orientation</FormLabel>
              <RadioGroup
                value={pdfOptions.orientation}
                onChange={(e) =>
                  handlePDFOptionChange("orientation", e.target.value)
                }
                row
              >
                <FormControlLabel
                  value="landscape"
                  control={<Radio />}
                  label="Landscape"
                />
                <FormControlLabel
                  value="portrait"
                  control={<Radio />}
                  label="Portrait"
                />
              </RadioGroup>
            </FormControl>

            <Box>
              <Typography gutterBottom>Image Quality</Typography>
              <Slider
                value={pdfOptions.quality}
                onChange={(e, value) => handlePDFOptionChange("quality", value)}
                min={0.1}
                max={1.0}
                step={0.1}
                marks={[
                  { value: 0.1, label: "Low" },
                  { value: 0.5, label: "Medium" },
                  { value: 1.0, label: "High" },
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
              />
            </Box>

            <Box>
              <Typography gutterBottom>Margin (mm)</Typography>
              <Slider
                value={pdfOptions.margin}
                onChange={(e, value) => handlePDFOptionChange("margin", value)}
                min={0}
                max={20}
                step={1}
                marks={[
                  { value: 0, label: "0" },
                  { value: 10, label: "10" },
                  { value: 20, label: "20" },
                ]}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePDFDialogClose}>Cancel</Button>
          <Button onClick={handlePDFExportConfirm} variant="contained">
            Export PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={handleShareDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, maxHeight: "90vh" } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShareIcon color="primary" />
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              Share Presentation
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Generate a shareable link to collaborate on your slides
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Paper
              elevation={1}
              sx={{ p: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: "#1976d2" }}
              >
                Generate Share Link
              </Typography>
              {!shareLink ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateShareLink}
                  disabled={isGeneratingLink}
                  startIcon={
                    isGeneratingLink ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <LinkIcon />
                    )
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  {isGeneratingLink ? "Generating..." : "Generate Share Link"}
                </Button>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Share Link"
                    value={shareLink}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={linkCopied ? "Copied!" : "Copy link"}>
                            <IconButton onClick={handleCopyLink} edge="end">
                              {linkCopied ? (
                                <Check color="success" />
                              ) : (
                                <ContentCopy />
                              )}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Quick Share
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Tooltip title="Share via Email">
                        <IconButton
                          onClick={() => handleSocialShare("email")}
                          size="small"
                        >
                          <Email />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share on LinkedIn">
                        <IconButton
                          onClick={() => handleSocialShare("linkedin")}
                          size="small"
                        >
                          <LinkedIn />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share on Twitter">
                        <IconButton
                          onClick={() => handleSocialShare("twitter")}
                          size="small"
                        >
                          <Twitter />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share on WhatsApp">
                        <IconButton
                          onClick={() => handleSocialShare("whatsapp")}
                          size="small"
                        >
                          <WhatsApp />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </Box>
              )}
            </Paper>

            {shareLink && (
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "#4caf50" }}
                >
                  Privacy Settings
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDiscoverable}
                        onChange={(e) => setIsDiscoverable(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Public Discovery
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {isDiscoverable
                            ? "Anyone with the link can view and share"
                            : "Only people with the link can view"}
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={shareSettingsState.requireSignIn}
                        onChange={(e) =>
                          handleShareSettingChange(
                            "requireSignIn",
                            e.target.checked
                          )
                        }
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Require Sign-in
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Viewers must sign in to access
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Paper>
            )}

            {/* Additional setting is not required now 👇 */}
            {/* {shareLink && (
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                <Button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  startIcon={
                    showAdvancedOptions ? <ExpandLess /> : <ExpandMore />
                  }
                  sx={{ textTransform: "none", mb: 2, fontWeight: 600 }}
                >
                  Advanced Options
                </Button>
                <Collapse in={showAdvancedOptions}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={shareSettingsState.allowComments}
                          onChange={(e) =>
                            handleShareSettingChange(
                              "allowComments",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      }
                      label="Allow Comments"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={shareSettingsState.allowDownload}
                          onChange={(e) =>
                            handleShareSettingChange(
                              "allowDownload",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      }
                      label="Allow Download"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={shareSettingsState.trackViews}
                          onChange={(e) =>
                            handleShareSettingChange(
                              "trackViews",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      }
                      label="Track Views & Analytics"
                    />
                    <TextField
                      fullWidth
                      label="Password Protection (Optional)"
                      type="password"
                      value={shareSettingsState.password}
                      onChange={(e) =>
                        handleShareSettingChange("password", e.target.value)
                      }
                      variant="outlined"
                      size="small"
                      helperText="Leave empty for no password protection"
                    />
                  </Box>
                </Collapse>
              </Paper>
            )} */}

            {shareLink && shareSettingsState.trackViews && (
              <Paper
                elevation={1}
                sx={{ p: 3, borderRadius: 2, bgcolor: "#f3f4f6" }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "#6b7280" }}
                >
                  Analytics Preview
                </Typography>
                <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#1976d2" }}
                    >
                      {shareStats.views}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Views
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#4caf50" }}
                    >
                      {shareStats.uniqueVisitors}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Unique Visitors
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {shareStats.lastViewed ? shareStats.lastViewed : "Never"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last Viewed
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleShareDialogClose}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
          {shareLink && (
            <Button
              variant="contained"
              onClick={handleCopyLink}
              startIcon={linkCopied ? <Check /> : <ContentCopy />}
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              {linkCopied ? "Copied!" : "Copy Link"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
