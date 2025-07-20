"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useSnackbar from "../../../../hooks/useSnackbar";
// import { modes } from "../../../../_mock/tools/paraphrase";
const modes = [
  {
    value: "Standard",
    package: ["free", "value_plan", "pro_plan", "unlimited"],
  },
  {
    value: "Fluency",
    package: ["free", "value_plan", "pro_plan", "unlimited"],
  },
  // {
  //   value: "Formal",
  //   package: ["value_plan", "pro_plan", "unlimited"],
  // },

]
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  CircularProgress,
  Slider,
  useTheme,
} from "@mui/material";
import { ContentCopy, Refresh, Replay } from "@mui/icons-material";

const CompareTab = ({
  sentence,             // the one sentence to compare
  highlightSentence,    // its index in outputText
  outputText,
  setOutputText,

  selectedMode,
  setSelectedMode,
  selectedLang,
  freezeWords,
}) => {
  const theme = useTheme();
  const { accessToken } = useSelector((state) => state.auth);
  const enqueueSnackbar = useSnackbar();

  // synonym depth slider
  const [synonymLevel, setSynonymLevel] = useState(1);

  // suggestion cards state
  const [suggestions, setSuggestions] = useState(
    modes.map((mode) => ({
      label: mode.value,
      mode: mode.value,
      plain: "",
      loading: false,
      selected:
        mode.value.toLowerCase() === selectedMode?.toLowerCase(),
    }))
  );

  const API_BASE = process.env.NEXT_PUBLIC_PARAPHRASE_API_URI;

  const startParaphrase = () => {
    // initialize cards: only non-selected go into loading state
    setSuggestions((prev) =>
      modes.map((mode) => {
        const isSelected =
          mode.value.toLowerCase() === selectedMode?.toLowerCase();
        return {
          label: mode.value,
          mode: mode.value,
          // keep existing text if selected, else clear
          plain: isSelected
            ? prev.find((i) => i.mode === mode.value)?.plain || ""
            : "",
          loading: !isSelected,
          selected: isSelected,
        };
      })
    );

    // fire REST calls for every non-selected mode
    modes.forEach((m) => {
      if (
        m.value.toLowerCase() === selectedMode?.toLowerCase()
      ) {
        return; // skip fetching for the already-selected one
      }

      fetch(`${API_BASE}/paraphrase-single-mode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && {
            Authorization: `Bearer ${accessToken}`,
          }),
        },
        body: JSON.stringify({
          text: sentence,
          mode: m.value.toLowerCase(),
          synonymLevel,
          language: selectedLang,
          freezeWord: freezeWords,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Status ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setSuggestions((prev) =>
            prev.map((item) =>
              item.mode === m.value
                ? {
                    ...item,
                    plain: data.plain,
                    loading: false,
                    // preserve selected flag
                    selected: item.selected,
                  }
                : item
            )
          );
        })
        .catch((error) => {
          setSuggestions((prev) =>
            prev.map((item) =>
              item.mode === m.value
                ? {
                    ...item,
                    plain: "[Error]",
                    loading: false,
                  }
                : item
            )
          );
          enqueueSnackbar(
            `Mode "${m.value}" error: ${error.message}`,
            { variant: "error" }
          );
        });
    });
  };

  // whenever sentence or slider changes, re-paraphrase (except selected)
  useEffect(() => {
    if (sentence) startParaphrase();
  }, [sentence, synonymLevel]);

  const handleSelect = (plainText, mode) => {
    // replace that one sentence in the main output
    const newOutput = [...outputText];
    newOutput[highlightSentence] = plainText
      .split(/\s+/)
      .map((w) => ({ word: w, type: "none", synonyms: [] }));
    setOutputText(newOutput);

    // mark as selected
    setSelectedMode(mode);
    enqueueSnackbar("Sentence replaced", { variant: "success" });
  };

  return (
    <Box id="compare_tab" sx={{ px: 2, py: 1 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Compare Modes
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Original Sentence Card */}
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          borderRadius: "14px",
          border: "1px solid",
          borderColor: theme.palette.divider,
          backgroundColor: "#919EAB0D",
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
          >
            Original Sentence
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "14px" }}
          >
            {sentence}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <IconButton
            size="small"
            onClick={() => {
              navigator.clipboard.writeText(sentence);
              enqueueSnackbar("Copied to clipboard", {
                variant: "success",
              });
            }}
          >
            <ContentCopy fontSize="small" />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              size="small"
              variant={
                selectedMode === "Original Sentence"
                  ? "contained"
                  : "outlined"
              }
              onClick={() =>
                handleSelect(sentence, "Original Sentence")
              }
            >
              {selectedMode === "Original Sentence"
                ? "Selected"
                : "Select"}
            </Button>
            <IconButton
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(sentence);
                enqueueSnackbar("Copied to clipboard", {
                  variant: "success",
                });
              }}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Box>
        </CardActions>
      </Card>

      {/* Suggestion Cards */}
      {suggestions.map((s) => (
        <Card
          key={s.mode}
          variant="outlined"
          sx={{
            mb: 2,
            borderRadius: "14px",
            border: "1px solid",
            borderColor: theme.palette.divider,
          }}
        >
          <CardContent sx={{ pb: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                {s.label}
              </Typography>
              <Slider
                size="small"
                value={synonymLevel}
                onChange={(_, val) => setSynonymLevel(val)}
                min={0}
                max={2}
                step={1}
                sx={{ width: 100 }}
              />
            </Box>
            {s.loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  py: 2,
                }}
              >
                <CircularProgress size={20} />
                <Typography sx={{ ml: 1 }}>Loading…</Typography>
              </Box>
            ) : (
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", mt: 1 }}
              >
                {s.plain}
              </Typography>
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: "space-between" }}>
            <Box>
              <IconButton
                size="small"
                onClick={startParaphrase}
              >
                <Refresh fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={startParaphrase}
              >
                <Replay fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                size="small"
                variant={s.selected ? "contained" : "outlined"}
                onClick={() => handleSelect(s.plain, s.mode)}
              >
                {s.selected ? "Selected" : "Select"}
              </Button>
              <IconButton
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(s.plain);
                  enqueueSnackbar("Copied to clipboard", {
                    variant: "success",
                  });
                }}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default CompareTab;

