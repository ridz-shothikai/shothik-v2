"use client";

import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Button,
  Typography,
  Skeleton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress,
  Drawer,
  useTheme,
} from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { useSelector } from "react-redux";

export default function FileHistorySidebar() {
  const theme = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fileHistory, setFileHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const { accessToken } = useSelector((state) => state.auth);
  const redirectPrefix = "p-v2";
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX + "/" + redirectPrefix + "/api";

  // Trigger upload button
  const handleAddClick = () =>
    document.querySelector("#multi_upload_button")?.click();

  // Sidebar toggles
  const handleBookClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);
  const handleNewClick = () => {
    handleAddClick();
    handleCloseSidebar();
  };

  // Fetch history
  useEffect(() => {
    if (!isSidebarOpen || !accessToken) return;
    setIsLoading(true);
    fetch(`${API_BASE}/files/file-histories`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFileHistory(data.histories || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isSidebarOpen, accessToken, API_BASE]);

  // Download handler
  const handleDownload = async (id, filename) => {
    setDownloadingId(id);
    try {
      const res = await fetch(`${API_BASE}/files/download-file/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const getIconPath = (type) => {
    switch (type) {
      case "docx":
        return "/icons/docx.svg";
      case "pdf":
        return "/icons/pdf.svg";
      case "txt":
        return "/icons/txt.svg";
      default:
        return null;
    }
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <>
      <Box
        id="file_history_buttons"
        sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          border:
            theme.palette.mode === "dark"
              ? `1px solid ${theme.palette.divider}`
              : "none",
        }}
      >
        <IconButton
          id="file_history_view_button"
          size="small"
          onClick={handleBookClick}
        >
          <MenuBookOutlinedIcon />
        </IconButton>
        <IconButton size="small" onClick={handleAddClick}>
          <AddOutlinedIcon />
        </IconButton>
      </Box>

      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={handleCloseSidebar}
        variant="temporary"
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100vw", sm: 320 },
            boxSizing: "border-box",
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box
          id="file_history_view"
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 2,
            height: "100%",
            bgcolor: theme.palette.background.default,
          }}
        >
          <Button
            sx={{ opacity: 0, zIndex: -1 }}
            onClick={handleCloseSidebar}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Documents</Typography>
            <IconButton
              id="file_history_close_button"
              size="small"
              onClick={handleCloseSidebar}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {isLoading ? (
              <Box sx={{ p: 2 }}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={60}
                    sx={{
                      mb: i < 2 ? 1 : 0,
                      bgcolor: theme.palette.action.hover,
                    }}
                  />
                ))}
              </Box>
            ) : fileHistory.length > 0 ? (
              <List>
                {fileHistory.map((item) => (
                  <ListItem
                    key={item._id}
                    disablePadding
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 1,
                      px: 2,
                      "&:last-of-type": { borderBottom: "none" },
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                      {getIconPath(item.file_type) && (
                        <Box
                          component="img"
                          src={getIconPath(item.file_type)}
                          alt="icon"
                          sx={{ width: 24, height: 24 }}
                        />
                      )}
                    </ListItemIcon>
                    <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
                      <ListItemText
                        primary={item.filename || "Unnamed File"}
                        secondary={formatTime(item.timestamp)}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      />
                    </Box>
                    <Box sx={{ flexShrink: 0, ml: 1 }}>
                      {item.is_download ? (
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDownload(item._id, item.filename)
                          }
                          disabled={downloadingId === item._id}
                        >
                          {downloadingId === item._id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <DownloadOutlinedIcon />
                          )}
                        </IconButton>
                      ) : (
                        <Tooltip title="Download is not available for this file">
                          <span>
                            <IconButton size="small" disabled>
                              <DownloadOutlinedIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", p: 2 }}>
                <MenuBookOutlinedIcon
                  sx={{ fontSize: 48, color: theme.palette.success.main }}
                />
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  All of your stored documents can be found here.
                </Typography>
              </Box>
            )}
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddOutlinedIcon />}
            onClick={handleNewClick}
            sx={{ mt: 2 }}
          >
            New
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
