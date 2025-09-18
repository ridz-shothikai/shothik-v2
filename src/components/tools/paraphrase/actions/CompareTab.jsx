
"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useSnackbar from "../../../../hooks/useSnackbar";
import { modes } from "../../../../_mock/tools/paraphrase";

import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Slider,
  useTheme,
  Skeleton,
} from "@mui/material";
import { ContentCopy, Refresh, Replay } from "@mui/icons-material";

const SYNONYMS = {
  20: "Basic",
  40: "Intermediate",
  60: "Advanced",
  80: "Expert",
};

// Extracted SuggestionCard component
const SuggestionCard = ({
  card,
  idx,
  minStep,
  maxStep,
  sliderMarks,
  handleLocalSliderChange,
  handleSliderChange,
  handleRefresh,
  handleReplay,
  handleSelect,
  enqueueSnackbar,
  selectedMode,
  theme,
}) => {
  const { label, plain, loading, selected, sliderValue, history } = card;
  const onSelect = () => handleSelect(plain, label);
  const onCopy = () => {
    navigator.clipboard.writeText(plain);
    enqueueSnackbar("Copied to clipboard", { variant: "success" });
  };

  return (
    <Card
      variant="outlined"
      sx={{ mb: 2, borderRadius: "14px", border: "1px solid", borderColor: theme.palette.divider, overflow: "visible" }}
    >
      <CardContent sx={{ pb: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Slider
            size="small"
            aria-label="Synonyms"
            getAriaValueText={(v) => SYNONYMS[v]}
            value={sliderValue}
            min={minStep}
            max={maxStep}
            step={minStep}
            marks
            valueLabelDisplay="on"
            valueLabelFormat={(val) => SYNONYMS[val]}
            onChange={(_, val) => handleLocalSliderChange(idx, val)}
            onChangeCommitted={(_, val) => handleSliderChange(idx, val)}
            sx={{ width: 120 }}
          />
        </Box>
        {loading ? (
          <Skeleton variant="text" width="100%" />
        ) : (
          <Typography variant="body2" sx={{ fontSize: "14px", mt: 1 }}>
            {plain}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Box>
          <IconButton size="small" onClick={() => handleRefresh(idx)} disabled={loading}>
            <Refresh fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleReplay(idx)} disabled={history.length === 0}>
            <Replay fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button size="small" variant={selected ? "contained" : "outlined"} onClick={onSelect} disabled={loading}>
            {selected ? "Selected" : "Select"}
          </Button>
          <IconButton size="small" onClick={onCopy} disabled={loading}>
            <ContentCopy fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

const CompareTab = ({
  sentence,
  highlightSentence,
  outputText,
  setOutputText,
  selectedMode,
  setSelectedMode,
  selectedLang,
  freezeWords,
  selectedSynonymLevel,
}) => {
  const theme = useTheme();
  const { accessToken } = useSelector((state) => state.auth);
  const enqueueSnackbar = useSnackbar();

  const allowedSteps = Object.keys(SYNONYMS).map(Number);
  const minStep = Math.min(...allowedSteps);
  const maxStep = Math.max(...allowedSteps);
  const initialStep = allowedSteps.includes(selectedSynonymLevel)
    ? selectedSynonymLevel
    : minStep;
  const sliderMarks = allowedSteps.map((value) => ({ value, label: SYNONYMS[value] }));

  const [suggestions, setSuggestions] = useState(
    modes.map((mode) => ({
      label: mode.value,
      mode: mode.value,
      plain: "",
      loading: false,
      selected: mode.value.toLowerCase() === selectedMode?.toLowerCase(),
      sliderValue: initialStep,
      history: [],
      historyIndex: -1,
    }))
  );
  const redirectPrefix = "p-v2";
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX + "/" + redirectPrefix + "/api";

  const getSynonymLabel = (step) => SYNONYMS[step] ?? SYNONYMS[minStep];

  const requestCardUpdate = (idx, stepValue, recordHistory = false) => {
    setSuggestions((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const newHistory = recordHistory
          ? [...item.history, { plain: item.plain, sliderValue: item.sliderValue }]
          : item.history;
        const newIndex = recordHistory ? newHistory.length - 1 : item.historyIndex;
        return { ...item, loading: true, history: newHistory, historyIndex: newIndex };
      })
    );

    const card = suggestions[idx];
    const synonymLabel = getSynonymLabel(stepValue).toLowerCase();
    const payload = {
      text: sentence,
      mode: card.mode.toLowerCase(),
      synonym: synonymLabel,
      language: selectedLang,
      freeze: freezeWords,
    };

    fetch(`${API_BASE}/paraphrase-single-mode`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(accessToken && { Authorization: `Bearer ${accessToken}` }) },
      body: JSON.stringify(payload),
    })
      .then((res) => { if (!res.ok) throw new Error(`Status ${res.status}`); return res.json(); })
      .then((data) => {
        setSuggestions((prev) =>
          prev.map((item, i) =>
            i === idx
              ? {
                  ...item,
                  plain: data.plain.replace(/[{}]/g, ""), // removing curly braces from output/preserved frozen words
                  loading: false,
                }
              : item
          )
        );
      })
      .catch((error) => {
        setSuggestions((prev) =>
          prev.map((item, i) => (i === idx ? { ...item, plain: "Upgrade plan", loading: false } : item))
        );
        // enqueueSnackbar(`Mode "${card.mode}" error: Limited acce`, { variant: "error" });
      });
  };

  const handleLocalSliderChange = (idx, value) => {
    setSuggestions((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, sliderValue: value } : item))
    );
  };

  useEffect(() => {
    if(!sentence) return;
    
    setSuggestions(
      modes.map((mode) => ({
        label: mode.value,
        mode: mode.value,
        plain: "",
        loading: false,
        selected: mode.value.toLowerCase() === selectedMode?.toLowerCase(),
        sliderValue: initialStep,
        history: [],
        historyIndex: -1,
      }))
    );
    allowedSteps.forEach((_, idx) => requestCardUpdate(idx, initialStep));
  }, [sentence]);

  const handleSliderChange = (idx, value) => requestCardUpdate(idx, value, true);
  const handleRefresh = (idx) => requestCardUpdate(idx, suggestions[idx].sliderValue, true);
  const handleReplay = (idx) => {
    setSuggestions((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const hist = item.history;
        if (!hist.length) return item;
        const len = hist.length;
        const currentIndex = item.historyIndex >= 0 ? item.historyIndex : len - 1;
        const entry = hist[currentIndex];
        const nextIndex = (currentIndex - 1 + len) % len;
        return { ...item, plain: entry.plain, sliderValue: entry.sliderValue, historyIndex: nextIndex };
      })
    );
  };

  const handleSelect = (plainText, mode) => {
    const newOutput = [...outputText];
    newOutput[highlightSentence] = plainText.split(/\s+/).map((w) => ({ word: w, type: "none", synonyms: [] }));
    setOutputText(newOutput);
    setSelectedMode(mode);
    enqueueSnackbar("Sentence replaced", { variant: "success" });
  };

  return (
    <Box id="compare_tab" sx={{ px: 2, py: 1 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>Compare Modes</Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Original Sentence Card */}
      <Card
        variant="outlined"
        sx={{ mb: 2, borderRadius: "14px", border: "1px solid", borderColor: theme.palette.divider, backgroundColor: "#919EAB0D" }}
      >
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Original Sentence</Typography>
          <Typography variant="body2" sx={{ fontSize: "14px" }}>{sentence}</Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <IconButton size="small" onClick={() => { navigator.clipboard.writeText(sentence); enqueueSnackbar("Copied to clipboard", { variant: "success" }); }}>
            <ContentCopy fontSize="small" />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button size="small" variant={selectedMode === "OriginalSentence" ? "contained" : "outlined"} onClick={() => handleSelect(sentence, "Original Sentence")}>{selectedMode === "Original Sentence" ? "Selected" : "Select"}</Button>
            <IconButton size="small" onClick={() => { navigator.clipboard.writeText(sentence); enqueueSnackbar("Copied to clipboard", { variant: "success" }); }}>
              <ContentCopy fontSize="small" />
            </IconButton>
          </Box>
        </CardActions>
      </Card>

      {/* Suggestion Cards */}
      {suggestions.map((s, idx) => (
        <SuggestionCard
          key={s.mode}
          card={s}
          idx={idx}
          minStep={minStep}
          maxStep={maxStep}
          sliderMarks={sliderMarks}
          handleLocalSliderChange={handleLocalSliderChange}
          handleSliderChange={handleSliderChange}
          handleRefresh={handleRefresh}
          handleReplay={handleReplay}
          handleSelect={handleSelect}
          enqueueSnackbar={enqueueSnackbar}
          selectedMode={selectedMode}
          theme={theme}
        />
      ))}
    </Box>
  );
};

export default CompareTab;

