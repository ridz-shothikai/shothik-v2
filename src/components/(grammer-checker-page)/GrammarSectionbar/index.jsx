"use client";

import { setIsSectionbarOpen } from "@/redux/slice/grammar-checker-slice";
import {
  deleteGrammarSection,
  renameGrammarSection,
} from "@/services/grammar-checker.service";
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
  Menu,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import { ChevronsLeft, Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const GrammarSectionbar = ({
  className,
  fetchSections,
  handleNewSection,
  handleSelectSection,
}) => {
  const theme = useTheme();
  // const [isLoading, setIsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const { accessToken } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    sections = [],
    sectionsGroups = [],
    sectionsMeta,
    isSectionLoading,
    isSectionbarOpen,
  } = useSelector((state) => state.grammar_checker);

  const { page = 1, limit = 10, total = 0 } = sectionsMeta || {};
  const hasMore = (sections?.length || 0) < total;

  const API_BASE = process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX + "/api";

  // Sidebar toggles
  const handleCloseSidebar = () => {
    dispatch(setIsSectionbarOpen(false));
    setSearch("");
  };
  const handleNewClick = () => {
    handleNewSection();
    handleCloseSidebar();
  };
  const handleSectionClick = (section) => {
    handleSelectSection(section);
    handleCloseSidebar();
  };

  // Menu handlers
  const handleMenuOpen = (event, item) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    if (selectedItem) {
      handleDownload(selectedItem._id, selectedItem.title);
    }
    handleMenuClose();
  };

  const handleRenameClick = (e) => {
    e.stopPropagation();
    if (selectedItem) {
      setNewTitle(selectedItem.title || "");
      setRenameDialogOpen(true);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (selectedItem) {
      handleDelete(selectedItem._id);
    }
    handleMenuClose();
  };

  const handleRenameSubmit = async () => {
    if (selectedItem && newTitle.trim()) {
      await handleRename(selectedItem?._id, newTitle.trim());
      setRenameDialogOpen(false);
      setNewTitle("");
      handleMenuClose();
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchSections({ page: nextPage, limit, search });
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchLoading(true);
      fetchSections({ reset: true, search }).finally(() =>
        setSearchLoading(false),
      );
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Download handler
  const handleDownload = async (id, title) => {};

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this entry?")) return;
  //   try {
  //     const res = await fetch(`${API_BASE}/grammar/section-delete/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  //       },
  //     });
  //     if (!res.ok) throw new Error("Failed to delete history entry");
  //     await fetchSections({ reset: true, search });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const handleRename = async (id, title) => {
  //   try {
  //     const res = await fetch(`${API_BASE}/grammar/section-rename/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  //       },
  //       body: JSON.stringify({ title }),
  //     });
  //     if (!res.ok) throw new Error("Failed to rename file");
  //     await fetchSections({ reset: true, search });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await deleteGrammarSection(id);
      await fetchSections({ reset: true, search });
    } catch (err) {
      console.error("Failed to delete section:", err);
    }
  };

  const handleRename = async (id, title) => {
    try {
      await renameGrammarSection(id, { title });
      await fetchSections({ reset: true, search });
    } catch (err) {
      console.error("Failed to rename section:", err);
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
      <Drawer
        anchor="left"
        open={isSectionbarOpen}
        onClose={handleCloseSidebar}
        variant="temporary"
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100vw", sm: 240 },
            boxSizing: "border-box",
            bgcolor: "var(--background)",
            color: "var(--foreground)",
          },
        }}
      >
        <div
          id="file_history_view"
          className="bg-background text-foreground flex h-full flex-col p-4"
        >
          {/* Hidden close button (for accessibility / focus trap fix) */}
          <Button
            sx={{ opacity: 0, zIndex: -1 }}
            onClick={handleCloseSidebar}
          />

          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <IconButton
              size="small"
              onClick={handleCloseSidebar}
              className="hover:bg-accent rounded"
            >
              <ChevronsLeft className="size-6" />
            </IconButton>
            <Button
              onClick={handleNewClick}
              className="!rounded-full"
              variant="outlined"
              size="small"
            >
              <Plus className="size-4" />
              <span className="ml-2">New</span>
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={handleSearchChange}
              className="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-9 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />

            <SearchIcon className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />

            {search && (
              <button
                onClick={clearSearch}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded p-1"
              >
                <RemoveCircleOutlineIcon fontSize="small" />
              </button>
            )}
          </div>

          {/* Section List / Skeleton */}
          <div className="flex-1 overflow-y-auto">
            {isSectionLoading || searchLoading ? (
              <div className="space-y-2 p-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-muted h-[60px] animate-pulse rounded-md"
                  />
                ))}
              </div>
            ) : sections?.length > 0 ? (
              <>
                <ul className="divide-border divide-y">
                  {sections?.map((item) => (
                    <li
                      key={item._id}
                      onClick={() => handleSectionClick(item)}
                      className="hover:bg-accent flex items-center py-2 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {item.title || "Unnamed File"}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {formatTime(item.timestamp)}
                        </p>
                      </div>

                      <div className="ml-2 flex shrink-0 items-center gap-1">
                        {downloadingId === item._id && (
                          <CircularProgress size={20} />
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, item)}
                          className="hover:bg-accent rounded"
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Load More Button */}
                {hasMore && !search && (
                  <div className="my-3 flex justify-center">
                    <Button
                      variant="outlined"
                      onClick={handleLoadMore}
                      disabled={isSectionLoading}
                      className="rounded-md px-4 text-sm"
                    >
                      {isSectionLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Read More"
                      )}
                    </Button>
                  </div>
                )}

                {/* Search results info */}
                {search && sections?.length > 0 && (
                  <p className="text-muted-foreground my-2 text-center text-xs">
                    Found {sections?.length} result(s) for ({search})
                  </p>
                )}
              </>
            ) : (
              <div className="p-4 text-center">
                <MenuBookOutlinedIcon className="text-success mx-auto size-12" />
                <p className="text-muted-foreground mt-3 text-sm">
                  {search
                    ? `No documents found for "${search}"`
                    : "All of your stored documents can be found here."}
                </p>
                {search && (
                  <Button
                    variant="outlined"
                    onClick={clearSearch}
                    className="mt-3"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
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
        {/* <MenuItem
          onClick={handleDownloadClick}
          disabled={!selectedItem?.is_download}
        >
          <Box component="span" sx={{ mr: 1.5, fontSize: 20 }}>
            <Download size={20} />
          </Box>
          Download
        </MenuItem> */}
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
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
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
            disabled={!newTitle.trim()}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GrammarSectionbar;
