// components/plagiarism/Sidebar.jsx
import React from "react";
import { Box, IconButton, Typography, Divider, Paper } from "@mui/material";
import { Close, History, Gavel, ExpandMore } from "@mui/icons-material";

const sampleResults = [
  { percent: 50, source: "ms.z-library.sk" },
  { percent: 40, source: "ms.z-library.sk" },
  { percent: 10, source: "ms.z-library.sk" },
];

const PlagiarismSidebar = ({
  open,
  onClose,
  score = 100,
  results = sampleResults,
}) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        width: 300,
        height: "100%",
        borderLeft: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* Top Nav */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          pt: 2,
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Gavel fontSize="small" color="action" />
          <History fontSize="small" color="action" />
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      {/* Title */}
      <Box sx={{ px: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Plagiarism Checker
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Score Card */}
        <Paper
          variant="outlined"
          sx={{
            bgcolor: "#e8f5e9",
            p: 2,
            mb: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h2">{score}%</Typography>
          <Typography variant="caption">Plagiarism</Typography>
        </Paper>

        {/* Results */}
        <Typography variant="subtitle2" gutterBottom>
          Results ({results.length})
        </Typography>
        {results.map((r, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid",
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
              <ExpandMore />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PlagiarismSidebar;
