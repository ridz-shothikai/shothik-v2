"use client";

import BookIcon from "@/components/icons/BookIcon";
import useScreenSize from "@/hooks/ui/useScreenSize";
import { Menu, MenuItem } from "@mui/material";
import {
  ArrowDownToLine,
  FileChartColumn,
  MoreVertical,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

const ActionMenu = ({
  onPreferences,
  onStatistics,
  onDownload,
  onNewSection,
  onOpenSectionbar,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { width } = useScreenSize();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handlePreferencesClick = () => {
    onPreferences?.();
    handleClose();
  };

  const handleStatisticsClick = () => {
    onStatistics?.();
    handleClose();
  };

  const handleDownloadClick = () => {
    onDownload?.();
    handleClose();
  };

  const handleNewSectionClick = () => {
    onNewSection?.();
    handleClose();
  };
  const handleOpenSectionbarClick = () => {
    onOpenSectionbar?.();
    handleClose();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded"
        title="More"
      >
        <MoreVertical className="size-4" />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: width > 1024 ? "top" : "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: width > 1024 ? "bottom" : "top",
          horizontal: "right",
        }}
      >
        <MenuItem className="lg:hidden!" onClick={handleNewSectionClick}>
          <div className="flex items-center gap-2 text-sm">
            <Plus className="size-4" /> New Section
          </div>
        </MenuItem>
        <MenuItem className="lg:hidden!" onClick={handleOpenSectionbarClick}>
          <div className="flex items-center gap-2 text-sm">
            <BookIcon className="size-4" /> Saved Documents
          </div>
        </MenuItem>
        <MenuItem onClick={handlePreferencesClick}>
          <div className="flex items-center gap-2 text-sm">
            <SlidersHorizontal className="size-4" /> Preferences
          </div>
        </MenuItem>
        <MenuItem onClick={handleStatisticsClick}>
          <div className="flex items-center gap-2 text-sm">
            <FileChartColumn className="size-4" /> Statistics
          </div>
        </MenuItem>
        <MenuItem onClick={handleDownloadClick}>
          <div className="flex items-center gap-2 text-sm">
            <ArrowDownToLine className="size-4" /> Download
          </div>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ActionMenu;
