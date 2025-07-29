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
} from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useSelector } from "react-redux";

export default function FileHistorySidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fileHistory, setFileHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useSelector((state) => state.auth);
  const API_BASE = process.env.NEXT_PUBLIC_PARAPHRASE_API_URI;

  // Handle Add button click to trigger #multi_upload_button
  const handleAddClick = () => {
    const uploadButton = document.querySelector("#multi_upload_button");
    if (uploadButton) {
      uploadButton.click();
    }
  };

  // Handle sidebar open
  const handleBookClick = () => {
    setIsSidebarOpen(true);
  };

  // Handle sidebar close
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Handle New button click in sidebar to trigger #multi_upload_button
  const handleNewClick = () => {
    const uploadButton = document.querySelector("#multi_upload_button");
    if (uploadButton) {
      uploadButton.click();
    }
    handleCloseSidebar();
  };

  // Fetch file history when sidebar opens
  useEffect(() => {
    if (isSidebarOpen && accessToken) {
      setIsLoading(true);
      fetch(`${API_BASE}/files/file-histories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.histories) {
            setFileHistory(data.histories);
          }
        })
        .catch((error) => console.error("Error fetching file history:", error))
        .finally(() => setIsLoading(false));
    }
  }, [isSidebarOpen, accessToken, API_BASE]);

  // Map file type to icon path
  const getIconPath = (fileType) => {
    switch (fileType) {
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

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {!isSidebarOpen && (
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            p: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <IconButton size="small" onClick={handleBookClick}>
            <MenuBookOutlinedIcon />
          </IconButton>
          <IconButton size="small" onClick={handleAddClick}>
            <AddOutlinedIcon />
          </IconButton>
        </Box>
      )}

      {isSidebarOpen && (
        <Box
          sx={{
            bgcolor: "#fff",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            padding: 2,
            flex: "0 0 300px", // Fixed width when open, allowing middle to shrink
            height: "100vh", // Full height of viewport
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Documents</Typography>
            <IconButton onClick={handleCloseSidebar} size="small">
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {isLoading ? (
              <Box sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={60} />
              </Box>
            ) : fileHistory.length > 0 ? (
              <List>
                {fileHistory.map((item) => (
                  <ListItem key={item._id} disablePadding>
                    <ListItemIcon>
                      {getIconPath(item.file_type) && (
                        <img
                          src={getIconPath(item.file_type)}
                          alt={`${item.file_type} icon`}
                          style={{ width: 24, height: 24 }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.filename || "Unnamed File"}
                      secondary={formatTime(item.timestamp)}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", p: 2 }}>
                <MenuBookOutlinedIcon sx={{ fontSize: 48, color: "#2e7d32" }} />
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
      )}
    </>
  );
}
