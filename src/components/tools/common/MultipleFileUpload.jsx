"use client";

import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
} from "@mui/material";
import {
  CloudUploadOutlined,
  Close as CloseIcon,
  GetApp as DownloadIcon,
} from "@mui/icons-material";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const FREE_LIMIT = 3;
const PAID_LIMIT = 250;

export default function MultipleFileUpload({
  paidUser,
  selectedMode,
  selectedSynonymLevel,
  selectedLang,
  freezeWords = [],
  shouldShowButton = true
}) {
  const { accessToken } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const limit = paidUser ? PAID_LIMIT : FREE_LIMIT;
  const apiBase = process.env.NEXT_PUBLIC_PARAPHRASE_API_URI;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFiles([]);
    setOpen(false);
  };

  const handleFilesSelected = (fileList) => {
    const incoming = Array.from(fileList);

    if (incoming.length > limit) {
      incoming.splice(limit);
      // optional: show warning
    }

    const mapped = incoming.map((file) => {
      if (!/\.(pdf|docx|txt)$/i.test(file.name)) {
        return {
          file,
          status: "error",
          progress: 0,
          error: "Unsupported format",
        };
      }
      if (file.size > MAX_FILE_SIZE) {
        return {
          file,
          status: "error",
          progress: 0,
          error: "File must be ≤ 25 MB",
        };
      }
      return {
        file,
        status: "idle",
        progress: 0,
        downloadUrl: null,
        error: null,
      };
    });

    setFiles(mapped);

    mapped.forEach((f, i) => {
      if (f.status === "idle") uploadFile(f.file, i);
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFilesSelected(e.dataTransfer.files);
  };
  const onDragOver = (e) => e.preventDefault();

  const uploadFile = async (file, idx) => {
    setFiles((fs) =>
      fs.map((f, i) =>
        i === idx ? { ...f, status: "uploading", progress: 0 } : f,
      ),
    );

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", selectedMode?.toLowerCase());
      formData.append("synonym", selectedSynonymLevel?.toLowerCase());
      formData.append("freeze", freezeWords);
      formData.append("language", selectedLang);

      const res = await fetch(`${apiBase}/files/file-paraphrase`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setFiles((fs) =>
        fs.map((f, i) =>
          i === idx
            ? { ...f, status: "success", progress: 100, downloadUrl: url }
            : f,
        ),
      );
    } catch (err) {
      setFiles((fs) =>
        fs.map((f, i) =>
          i === idx
            ? { ...f, status: "error", error: err.message, progress: 0 }
            : f,
        ),
      );
    }
  };

  return (
    <>
        <Button
          id="multi_upload_button"
          sx={{
            display: shouldShowButton ? "flex" : "none",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "fit-content",
          }}
          variant="outlined"
          onClick={handleOpen}
        >
          <CloudUploadOutlined fontSize="small" />
          Multi Upload Document
        </Button>
        <Button
          id="multi_upload_close_button"
          sx={{
            opacity: 0,
            zIndex: -9999,
            position: "absolute",
            top: -9999,
            display: shouldShowButton ? "flex" : "none",
          }}
          onClick={() => {
            handleClose();
          }}
        ></Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Upload Multiple Documents
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box
            id="multi_upload_view"
            onDrop={onDrop}
            onDragOver={onDragOver}
            sx={{
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              mb: 2,
            }}
            onClick={() => inputRef.current.click()}
          >
            <CloudUploadOutlined fontSize="large" sx={{ mb: 1 }} />
            <Typography variant="h6">Upload Multiple Documents</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Drop files here or <b>browse</b> your machine
            </Typography>
            <Typography variant="caption" color="text.secondary">
              pdf, txt, docx — up to {limit} file{limit > 1 ? "s" : ""} at once
            </Typography>

            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              hidden
              onChange={(e) => handleFilesSelected(e.target.files)}
            />
          </Box>

          <List disablePadding>
            {files.map((f, i) => (
              <ListItem
                key={i}
                sx={{ flexDirection: "column", alignItems: "stretch", py: 1 }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <ListItemText
                    primary={f.file.name}
                    secondary={
                      f.error
                        ? f.error
                        : f.status === "success"
                        ? "Completed"
                        : f.status === "uploading"
                        ? "Uploading…"
                        : ""
                    }
                  />
                  {f.status === "success" && f.downloadUrl && (
                    <IconButton
                      component="a"
                      href={f.downloadUrl}
                      download={f.file.name}
                    >
                      <DownloadIcon />
                    </IconButton>
                  )}
                </Stack>
                {(f.status === "uploading" || f.status === "success") && (
                  <LinearProgress
                    variant={
                      f.status === "uploading" ? "indeterminate" : "determinate"
                    }
                    value={f.progress}
                    sx={{ mt: 1 }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>

        <DialogActions>
          <Typography
            variant="caption"
            sx={{ flex: 1, pl: 2, color: "text.secondary" }}
          >
            {paidUser
              ? `Up to ${PAID_LIMIT} files per batch`
              : `Free users: ${FREE_LIMIT} files per batch`}
          </Typography>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
