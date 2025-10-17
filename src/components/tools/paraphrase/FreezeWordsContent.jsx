"use client";

import CloseIcon from "@mui/icons-material/Close";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { protectedPhrases, protectedSingleWords } from "./extentions";

export default function FreezeWordsContent({
  close = () => {},
  freeze_props = {},
  readOnly = false,
}) {
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

  // Separate user-added from protected words for better management
  const [userFrozenWords, setUserFrozenWords] = useState(new Set(frozenWords));
  const [userFrozenPhrases, setUserFrozenPhrases] = useState(
    new Set(frozenPhrases),
  );

  const protectedWordsSet = new Set(protectedSingleWords);
  const protectedPhrasesSet = new Set(protectedPhrases);

  // Sync external props - only update user words, not protected ones
  useEffect(() => {
    setLocalRecs([...recommendedWords]);
  }, [recommendedWords]);

  useEffect(() => {
    setUserFrozenWords(new Set(frozenWords));
  }, [frozenWords]);

  useEffect(() => {
    setUserFrozenPhrases(new Set(frozenPhrases));
  }, [frozenPhrases]);

  // Combine user and protected words for display
  const allFrozenWords = [
    ...Array.from(userFrozenWords),
    ...Array.from(userFrozenPhrases),
  ].sort();

  const handleRecClick = (word) => {
    if (readOnly) return;

    setLocalRecs((prev) => prev.filter((w) => w !== word));

    // Determine if it's a phrase or single word
    if (word.includes(" ")) {
      setUserFrozenPhrases((prev) => new Set([...prev, word]));
      onAddPhrases([word]);
    } else {
      setUserFrozenWords((prev) => new Set([...prev, word]));
      onAddWords([word]);
    }
  };

  const handleRemoveFrozen = (item) => {
    if (readOnly) return;

    // Don't allow removal of protected words
    if (protectedWordsSet.has(item) || protectedPhrasesSet.has(item)) {
      return;
    }

    // Remove from local state based on actual source
    if (userFrozenWords.has(item)) {
      setUserFrozenWords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item);
        return newSet;
      });
      onRemoveWord(item);
    } else if (userFrozenPhrases.has(item)) {
      setUserFrozenPhrases((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item);
        return newSet;
      });
      onRemovePhrase(item);
    }

    // Add back to recommendations if it was originally recommended
    if (recommendedWords.includes(item)) {
      setLocalRecs((prev) => [...prev, item]);
    }
  };

  const handleClearAll = () => {
    if (readOnly) return;

    // Only clear user-added words, keep protected ones
    setUserFrozenWords(new Set());
    setUserFrozenPhrases(new Set());
    setLocalRecs([...recommendedWords]);
    onClearAll();
  };

  const handleAddInput = () => {
    if (readOnly) return;

    const raw = String(input).trim();
    if (!raw) return;

    const entries = raw
      .split(",")
      .map((w) => String(w).trim())
      .filter((w) => w.length > 0);

    const words = entries.filter((w) => !w.includes(" "));
    const phrases = entries.filter((w) => w.includes(" "));

    if (words.length) {
      setUserFrozenWords((prev) => new Set([...prev, ...words]));
      onAddWords(words);
    }

    if (phrases.length) {
      setUserFrozenPhrases((prev) => new Set([...prev, ...phrases]));
      onAddPhrases(phrases);
    }

    setInput("");
  };

  const isProtectedItem = (item) => {
    return protectedWordsSet.has(item) || protectedPhrasesSet.has(item);
  };

  const isFreezeDisabled = readOnly || !String(input).trim();
  const hasUserFrozenItems =
    userFrozenWords.size > 0 || userFrozenPhrases.size > 0;

  return (
    <Box
      sx={{
        width: { xs: "90vw", sm: "300px", md: "500px", lg: "600px" },
        maxHeight: "80vh",
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" component="div">
          Freeze Words
        </Typography>
        <IconButton aria-label="close" onClick={close} size="small">
          <CloseIcon />
        </IconButton>
      </Stack>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        flexGrow={1}
        overflow="hidden"
      >
        {/* Left panel - Recommendations */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle2">Recommended Words</Typography>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              mt: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              p: 1,
            }}
          >
            {localRecs.length > 0 ? (
              <List dense disablePadding>
                {localRecs.map((word) => (
                  <ListItem key={word} disablePadding>
                    <ListItemButton
                      disabled={readOnly}
                      onClick={() => handleRecClick(word)}
                    >
                      <ListItemText primary={word} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ p: 1 }}>
                No recommendations available
              </Typography>
            )}
          </Box>

          {/* Add custom words input */}
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

        {/* Right panel - Active Frozen Words */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle2">
            Active Frozen Words ({allFrozenWords.length})
          </Typography>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              mt: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              p: 1,
              maxHeight: { xs: "100px", md: "250px" },
            }}
          >
            {allFrozenWords.length > 0 ? (
              <List dense disablePadding>
                {allFrozenWords.map((item) => {
                  const isProtected = isProtectedItem(item);
                  return (
                    <ListItem
                      key={item}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        opacity: isProtected ? 0.7 : 1,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              // textTransform: "capitalize",
                            }}
                          >
                            <span>{item}</span>
                            {isProtected && (
                              <Chip
                                label="Protected"
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.65rem", height: 20 }}
                              />
                            )}
                          </Box>
                        }
                      />
                      {!readOnly && !isProtected && (
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleRemoveFrozen(item)}
                          color="error"
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ p: 1 }}>
                {readOnly
                  ? "No frozen words"
                  : "Add words to freeze them during paraphrasing"}
              </Typography>
            )}
          </Box>

          {/* Clear user words button */}
          {!readOnly && hasUserFrozenItems && (
            <Button
              onClick={handleClearAll}
              sx={{ mt: 1, textTransform: "none" }}
              fullWidth
              variant="outlined"
              color="warning"
            >
              Clear User Words
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
