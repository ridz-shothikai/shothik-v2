import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Divider,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import useSnackbar from "../../../../hooks/useSnackbar";

const PlagiarismTab = ({ text, score: propScore, results: propResults }) => {
  const { accessToken } = useSelector((s) => s.auth);
  const { demo } = useSelector((s) => s.settings);
  const enqueueSnackbar = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [realScore, setRealScore] = useState(null);
  const [realResults, setRealResults] = useState([]);

  // Determine which score and results to display
  const displayScore = [true, "plagiarism_low", "plagiarism_high"].includes(
    demo
  )
    ? propScore
    : realScore;
  const displayResults = [true, "plagiarism_low", "plagiarism_high"].includes(
    demo
  )
    ? propResults
    : realResults;

  // Memoize the API call function to prevent recreation on every render
  const checkPlagiarism = useCallback(async (textToCheck, token) => {
    const API_BASE = process.env.NEXT_PUBLIC_PARAPHRASE_API_URI;

    const response = await fetch(`${API_BASE}/plagiarism`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: textToCheck, token }),
    });

    const data = await response.json();
    if (data.success === false) {
      throw new Error(data.message || "Error");
    }
    return data;
  }, []); // Empty dependency array since it only uses parameters

  // Real check: only when text/demo/accessToken change AND not in demo mode
  useEffect(() => {
    // In demo mode, rely on props, do not fetch real data
    if ([true, "plagiarism_low", "plagiarism_high"].includes(demo)) {
      setLoading(false);
      return;
    }

    // Not in demo mode, proceed with real data fetching
    if (!text || !text.trim()) {
      setRealScore(null);
      setRealResults([]);
      setLoading(false);
      return;
    }

    // Don't make API call if already loading to prevent race conditions
    if (loading) return;

    setLoading(true);
    setRealScore(null);
    setRealResults([]);

    checkPlagiarism(text, accessToken)
      .then((data) => {
        let finalScore =
          typeof data.score === "number"
            ? data.score
            : (data.summary?.match(/\((\d+)%\)/)?.[1] ?? 0) * 1;

        setRealScore(finalScore);

        if (Array.isArray(data.matches)) {
          setRealResults(
            data.matches.map((m) => ({
              percent: Math.round(m.score * 100),
              source: m.author || "Unknown",
            }))
          );
        } else {
          setRealResults([]);
        }
      })
      .catch((err) => {
        console.error("Plagiarism check error:", err);
        enqueueSnackbar(`Plagiarism check error: ${err.message}`, {
          variant: "error",
        });
        setRealScore(0);
        setRealResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [text, demo, accessToken, checkPlagiarism]); // Include checkPlagiarism in dependencies

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Plagiarism Checker
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Paper
        variant="outlined"
        sx={{
          bgcolor: loading ? "grey.100" : "success.light",
          p: 2,
          mb: 2,
          textAlign: "center",
          minHeight: 100,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography id="plagiarism_score" variant="h2">
              {displayScore != null ? `${displayScore}%` : "--"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Plagiarism
            </Typography>
          </>
        )}
      </Paper>

      <Box id="plagiarism_results">
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Results ({displayResults.length})
        </Typography>

        {displayResults.map((r, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              p: 1,
              mb: 1,
            }}
          >
            <Typography variant="body2" sx={{ width: "20%" }}>
              {r.percent}%
            </Typography>
            <Typography
              variant="body2"
              sx={{ flex: 1, textAlign: "center", ml: 1 }}
            >
              {r.source}
            </Typography>
            <IconButton size="small">
              <ExpandMore fontSize="small" />
            </IconButton>
          </Box>
        ))}

        {!loading && displayResults.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No matches found.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PlagiarismTab;
