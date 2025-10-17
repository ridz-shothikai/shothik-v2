"use client";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Download, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function FileHistorySidebar({ fetchFileHistories }) {
  const theme = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newFilename, setNewFilename] = useState("");
  const { accessToken } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    fileHistories = [],
    fileHistoryGroups = [],
    fileHistoriesMeta,
    isUpdatedFileHistory,
    isFileHistoryLoading: isLoading,
  } = useSelector((state) => state.paraphraseHistory);

  const { page = 1, limit = 10, total = 0 } = fileHistoriesMeta || {};
  const hasMore = (fileHistories?.length || 0) < total;

  console.log("fileHistories:", fileHistories);

  const API_BASE = process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX + "/p-v2/api";

  // const API_BASE = "http://localhost:3050/api";

  // Trigger upload button
  const handleAddClick = () =>
    document.querySelector("#multi_upload_button")?.click();

  // Sidebar toggles
  const handleBookClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    // Reset search when closing sidebar
    setSearch("");
  };
  const handleNewClick = () => {
    handleAddClick();
    handleCloseSidebar();
  };

  // Menu handlers
  const handleMenuOpen = (event, item) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDownloadClick = () => {
    if (selectedItem) {
      handleDownload(selectedItem._id, selectedItem.filename);
    }
    handleMenuClose();
  };

  const handleRenameClick = () => {
    if (selectedItem) {
      setNewFilename(selectedItem.filename || "");
      setRenameDialogOpen(true);
    }
  };

  const handleDeleteClick = () => {
    if (selectedItem) {
      handleDelete(selectedItem._id);
    }
    handleMenuClose();
  };

  const handleRenameSubmit = async () => {
    if (selectedItem && newFilename.trim()) {
      await handleRename(selectedItem?._id, newFilename.trim());
      setRenameDialogOpen(false);
      setNewFilename("");
      handleMenuClose();
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchFileHistories({ page: nextPage, limit, search });
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchLoading(true);
      fetchFileHistories({ reset: true, search }).finally(() =>
        setSearchLoading(false),
      );
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Download handler
  const handleDownload = async (id, filename) => {
    setDownloadingId(id);
    try {
      const res = await fetch(`${API_BASE}/files/file-download/${id}`, {
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      const res = await fetch(`${API_BASE}/files/file-delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      if (!res.ok) throw new Error("Failed to delete history entry");
      await fetchFileHistories({ reset: true, search });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async (id, filename) => {
    try {
      const res = await fetch(`${API_BASE}/files/file-rename/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({ filename }),
      });
      if (!res.ok) throw new Error("Failed to rename file");
      await fetchFileHistories({ reset: true, search });
    } catch (err) {
      console.error(err);
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <>
      <Box
        id="file_history_buttons"
        sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          p: { xs: "3px", md: 1 },
          display: "flex",
          flexDirection: "column",
          gap: 1,
          border:
            theme.palette.mode === "dark"
              ? `1px solid ${theme.palette.divider}`
              : "none",
        }}
      >
        <Tooltip title="Saved document" placement="right">
          <IconButton
            id="file_history_view_button"
            size="small"
            onClick={handleBookClick}
          >
            <Image
              src={"/icons/file.svg"}
              alt="file"
              width={24}
              height={24}
              className="h-5 w-5 lg:h-6 lg:w-6"
            />
            <Typography
              variant="caption"
              sx={{
                display: { md: "none" },
                ml: 2,
                color: "#242426",
              }}
            >
              Saved Files
            </Typography>
          </IconButton>
        </Tooltip>
        <Tooltip
          title="Add new document"
          placement="right"
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <IconButton size="small" onClick={handleAddClick}>
            <AddOutlinedIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={handleCloseSidebar}
        variant="temporary"
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100vw", sm: 360 },
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

          {/* Search Input */}
          <TextField
            fullWidth
            placeholder="Search documents..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={clearSearch}
                    sx={{ visibility: search ? "visible" : "hidden" }}
                  >
                    <RemoveCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            size="small"
          />

          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {isLoading || searchLoading ? (
              <Box sx={{ p: 2 }}>
                {[...Array(5)]?.map((_, i) => (
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
            ) : fileHistories?.length > 0 ? (
              <>
                <List>
                  {fileHistories?.map((item) => (
                    <ListItem
                      key={item._id}
                      disablePadding
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 1,
                        px: 0,
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
                      <Box
                        sx={{
                          flexShrink: 0,
                          ml: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {item.is_download && downloadingId === item._id ? (
                          <CircularProgress size={20} />
                        ) : null}

                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, item)}
                          sx={{ ml: 0.5 }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>

                {/* Load More Button - Only show if not searching and has more */}
                {hasMore && !search && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 2,
                      mb: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 3,
                      }}
                    >
                      {isLoading ? <CircularProgress size={20} /> : "Read More"}
                    </Button>
                  </Box>
                )}

                {/* Search results info */}
                {search && fileHistories?.length > 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", mt: 1, mb: 1 }}
                  >
                    Found {fileHistories?.length} result(s) for ({search})
                  </Typography>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: "center", p: 2 }}>
                <MenuBookOutlinedIcon
                  sx={{ fontSize: 48, color: theme.palette.success.main }}
                />
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  {search
                    ? `No documents found for "${search}"`
                    : "All of your stored documents can be found here."}
                </Typography>
                {search && (
                  <Button
                    variant="outlined"
                    onClick={clearSearch}
                    sx={{ mt: 2 }}
                  >
                    Clear Search
                  </Button>
                )}
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

      {/* Options Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[8],
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={handleDownloadClick}
          disabled={!selectedItem?.is_download}
        >
          <Box component="span" sx={{ mr: 1.5, fontSize: 20 }}>
            <Download size={20} />
          </Box>
          Download
        </MenuItem>
        <MenuItem onClick={handleRenameClick}>
          <Box component="span" sx={{ mr: 1.5, fontSize: 20 }}>
            <Edit2 size={20} />
          </Box>
          Rename
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          sx={{ color: theme.palette.error.main }}
        >
          <Box component="span" sx={{ mr: 1.5, fontSize: 20 }}>
            <Trash2 size={20} />
          </Box>
          Delete
        </MenuItem>
      </Menu>

      {/* Rename Dialog */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={newFilename}
            onChange={(e) => setNewFilename(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleRenameSubmit();
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRenameSubmit}
            variant="contained"
            disabled={!newFilename.trim()}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
