"use client";

import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export default function FreezeWordsDialog({
  recommendedWords = [],
  frozenWords = [],
  frozenPhrases = [],
  onAddWords = () => {},
  onAddPhrases = () => {},
  onRemoveWord = () => {},
  onRemovePhrase = () => {},
  onClearAll = () => {},
}) {
  const [mode, setMode] = useState(null);       // 'view' | 'edit' | null
  const [input, setInput] = useState("");
  const [localRecs, setLocalRecs] = useState([...recommendedWords]);
  const [localFrozen, setLocalFrozen] = useState([
    ...frozenWords,
    ...frozenPhrases,
  ]);

  // keep localFrozen in sync if external props change
  useEffect(() => {
    setLocalFrozen([...frozenWords, ...frozenPhrases]);
  }, [frozenWords, frozenPhrases]);

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const openView = () => setMode("view");
  const openEdit = () => setMode("edit");
  const close = () => {
    setMode(null);
    setInput("");
  };

  const handleRecClick = (w) => {
    if (!isEdit) return;
    setLocalRecs((r) => r.filter((x) => x !== w));
    setLocalFrozen((f) => [...f, w]);
    onAddWords([w]);
  };

  const handleRemoveFrozen = (w) => {
    if (!isEdit) return;
    setLocalFrozen((f) => f.filter((x) => x !== w));
    setLocalRecs((r) => [...r, w]);
    if (w.includes(" ")) onRemovePhrase(w);
    else onRemoveWord(w);
  };

  const handleClearAll = () => {
    setLocalFrozen([]);
    setLocalRecs([...recommendedWords]);
    onClearAll();
  };

  const handleAddInput = () => {
    const entries = input
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    const words = entries.filter((w) => !w.includes(" "));
    const phrases = entries.filter((w) => w.includes(" "));
    if (words.length) {
      setLocalFrozen((f) => [...f, ...words]);
      onAddWords(words);
    }
    if (phrases.length) {
      setLocalFrozen((f) => [...f, ...phrases]);
      onAddPhrases(phrases);
    }
    setInput("");
  };

  return (
    <>
      {/* 4) Buttons container with rounded white bg */}
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
        <IconButton size="small" onClick={openView}>
          <MenuBookOutlinedIcon />
        </IconButton>
        <IconButton size="small" onClick={openEdit}>
          <AddOutlinedIcon />
        </IconButton>
      </Box>

      {/* 3) Smaller, responsive modal */}
      <Dialog
        open={!!mode}
        onClose={close}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: { xs: "70vh", sm: "60vh" },
          },
        }}
      >
        <DialogTitle>Freeze Words</DialogTitle>
        <DialogContent
          dividers
          sx={{
            display: "flex",
            gap: 2,
            p: 2,
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Left panel */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="subtitle2">Recommended Words</Typography>
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",       // 1) independent scrolling
                mt: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
              }}
            >
              <List dense disablePadding>
                {localRecs.map((w) => (
                  <ListItem
                    key={w}
                    button={isEdit}
                    onClick={() => handleRecClick(w)}
                  >
                    <ListItemText primary={w} />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* 2 & 6) Freeze button under textarea */}
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Enter word(s) to freeze"
                placeholder="Separate words with commas"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                disabled={isView}
              />
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 1 }}
                disabled={!input.trim()}
                fullWidth
                onClick={handleAddInput}
              >
                Freeze
              </Button>
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Right panel */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="subtitle2">Frozen Words</Typography>
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",      // 1) independent scrolling
                mt: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
              }}
            >
              {localFrozen.length > 0 ? (
                <List dense disablePadding>
                  {localFrozen.map((w) => (
                    <ListItem key={w}>
                      <ListItemText primary={w} />
                      {isEdit && (
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleRemoveFrozen(w)}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  {isView
                    ? "Examples: Book, Diversion, Details"
                    : "No words frozen"}
                </Typography>
              )}
            </Box>
            {isEdit && localFrozen.length > 0 && (
              <Button
                onClick={handleClearAll}
                sx={{ mt: 1, textTransform: "none" }}
                fullWidth
              >
                Clear
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

