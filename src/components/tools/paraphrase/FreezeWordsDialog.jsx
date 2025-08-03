
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

export default function FreezeWordsDialog({ close = () => {}, freeze_props = {}, readOnly = false }) {
  const {
    recommendedWords = [],
    frozenWords = [],
    frozenPhrases = [],
    onAddWords = () => {},
    onAddPhrases = () => {},
    onRemoveWord = () => {},
    onRemovePhrase = () => {},
    onClearAll = () => {},
  } = freeze_props;

  const [input, setInput] = useState("");
  const [localRecs, setLocalRecs] = useState([...recommendedWords]);
  const [localFrozen, setLocalFrozen] = useState([...frozenWords, ...frozenPhrases]);

  // Sync external props
  useEffect(() => setLocalRecs([...recommendedWords]), [recommendedWords]);
  useEffect(() => setLocalFrozen([...frozenWords, ...frozenPhrases]), [frozenWords, frozenPhrases]);

  const handleRecClick = (w) => {
    if (readOnly) return;
    setLocalRecs((r) => r.filter((x) => x !== w));
    setLocalFrozen((f) => [...f, w]);
    onAddWords([w]);
  };

  const handleRemoveFrozen = (w) => {
    if (readOnly) return;
    setLocalFrozen((f) => f.filter((x) => x !== w));
    setLocalRecs((r) => [...r, w]);
    if (w.includes(" ")) onRemovePhrase(w);
    else onRemoveWord(w);
  };

  const handleClearAll = () => {
    if (readOnly) return;
    setLocalFrozen([]);
    setLocalRecs([...recommendedWords]);
    onClearAll();
  };

  const handleAddInput = () => {
    if (readOnly) return;
    const raw = String(input);
    const entries = raw
      .split(",")
      .map((w) => String(w).trim())
      .filter((w) => w.length);
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

  const isFreezeDisabled = readOnly || !String(input).trim();

  return (
    <Dialog
      open={true}
      onClose={close}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { height: { xs: "70vh", sm: "60vh" } } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" component="div">
          Freeze Words
        </Typography>
        <IconButton aria-label="close" onClick={close} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{ display: "flex", gap: 2, p: 2, height: "100%", boxSizing: "border-box" }}
      >
        {/* Left panel */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle2">Recommended Words</Typography>
          <Box sx={{ flex: 1, overflowY: "auto", mt: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, p: 1 }}>
            <List dense disablePadding>
              {localRecs.map((w) => (
                <ListItem key={w} disablePadding>
                  <ListItemButton disabled={readOnly} onClick={() => handleRecClick(w)}>
                    <ListItemText primary={w} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Enter word(s) to freeze"
              placeholder="Separate words with commas"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              disabled={readOnly}
            />
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 1 }}
              disabled={isFreezeDisabled}
              fullWidth
              onClick={handleAddInput}
            >
              Freeze
            </Button>
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />
        {/* Right panel */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle2">Frozen Words</Typography>
          <Box sx={{ flex: 1, overflowY: "auto", mt: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, p: 1 }}>
            {localFrozen.length > 0 ? (
              <List dense disablePadding>
                {localFrozen.map((w) => (
                  <ListItem key={w} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ListItemText primary={w} />
                    {!readOnly && (
                      <IconButton edge="end" size="small" onClick={() => handleRemoveFrozen(w)}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    )}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                {readOnly ? "Examples: Book, Diversion, Details" : "No words frozen"}
              </Typography>
            )}
          </Box>
          {!readOnly && localFrozen.length > 0 && (
            <Button onClick={handleClearAll} sx={{ mt: 1, textTransform: "none" }} fullWidth>
              Clear
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

