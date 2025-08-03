import React, { useState, useEffect } from "react";
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

const PlagiarismTab = ({ text }) => {
  const { accessToken } = useSelector((s) => s.auth);
  const { demo } = useSelector((s) => s.settings);
  const enqueueSnackbar = useSnackbar();
  const API_BASE = process.env.NEXT_PUBLIC_PARAPHRASE_API_URI;

  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [results, setResults] = useState([]);

  const demoResults = [
    { percent: 75, source: "Sample Source 1" },
    { percent: 60, source: "Sample Source 2" },
    { percent: 45, source: "Sample Source 3" },
  ];

  // demo‐mode short‐circuit
  useEffect(() => {
    if (
      demo === true ||
      demo === "plagiarism_low" ||
      demo === "plagiarism_high"
    ) {
      setLoading(false);
      if (demo === "plagiarism_low") {
        setScore(0);
        setResults([]);
      } else {
        setScore(100);
        setResults(demoResults);
      }
    }
  }, [demo]);

  // real check: only when text/demo/accessToken change
  useEffect(() => {
    // skip demo
    if ([true, "plagiarism_low", "plagiarism_high"].includes(demo)) {
      return;
    }

    // no text → clear state
    if (!text) {
      setScore(null);
      setResults([]);
      return;
    }

    setLoading(true);
    setScore(null);
    setResults([]);

    fetch(`${API_BASE}/plagiarism`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, token: accessToken }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.success === false) throw new Error(data.message || "Error");
        return data;
      })
      .then((data) => {
        // extract score
        let finalScore =
          typeof data.score === "number"
            ? data.score
            : (data.summary.match(/\((\d+)%\)/)?.[1] ?? 0) * 1;

        setScore(finalScore);

        // map matches → results
        if (Array.isArray(data.matches)) {
          setResults(
            data.matches.map((m) => ({
              percent: Math.round(m.score * 100),
              source: m.author || "Unknown",
            })),
          );
        } else {
          setResults([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(`Plagiarism check error: ${err.message}`, {
          variant: "error",
        });
        setScore(0);
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [text, demo, accessToken]);

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
            <Typography variant="h2">
              {score != null ? `${score}%` : "--"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Plagiarism
            </Typography>
          </>
        )}
      </Paper>

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Results ({results.length})
        </Typography>

        {results.map((r, i) => (
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

        {!loading && results.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No matches found.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PlagiarismTab;
