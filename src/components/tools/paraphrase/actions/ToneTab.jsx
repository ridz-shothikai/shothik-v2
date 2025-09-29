import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const redirectPrefix = "p-v2";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX +
  "/" +
  redirectPrefix +
  "/api";
// const API_BASE = process.env.NEXT_PUBLIC_PARAPHRASE_API_URI;

const METRICS = [
  { key: "casualFormal", labels: ["Casual", "Formal"] },
  { key: "unfriendlyFriendly", labels: ["Unfriendly", "Friendly"] },
  { key: "wordyConcise", labels: ["Wordy", "Concise"] },
  { key: "complexSimple", labels: ["Complex", "Simple"] },
];

const ToneTab = ({ text, plainOutput }) => {
  const theme = useTheme();
  const { accessToken } = useSelector((state) => state.auth);

  const originalText = text;
  const paraphrasedText = plainOutput;

  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!originalText || !paraphrasedText) return;

    setLoading(true);
    setError(null);

    async function fetchScores() {
      try {
        console.log("Fetching tone scores", { originalText, paraphrasedText });
        const res = await fetch(`${API_BASE}/tone/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ originalText, paraphrasedText }),
        });
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }
        const data = await res.json();
        console.log("Tone scores data:", data);
        setScores(data);
      } catch (err) {
        console.error("Error fetching tone scores", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, [originalText, paraphrasedText, accessToken]);

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
      }}
    >
      {/* Header */}
      <Typography sx={{ fontSize: 14, fontWeight: "bold", mb: 1 }}>
        Tone
      </Typography>

      {/* Legend */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: theme.palette.grey[700],
            }}
          />
          <Typography sx={{ fontSize: 14 }}>Original</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: theme.palette.success.main,
            }}
          />
          <Typography sx={{ fontSize: 14 }}>Paraphrased</Typography>
        </Box>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Typography color="error" sx={{ fontSize: 12 }}>
          {error}
        </Typography>
      )}

      {/* Score Cards */}
      {scores && (
        <Stack spacing={2}>
          {METRICS.map(({ key, labels }) => {
            // Expect scores in range 0–100
            const origScore = Math.max(
              0,
              Math.min(100, Number(scores.original?.[key] ?? 0)),
            );
            const paraScore = Math.max(
              0,
              Math.min(100, Number(scores.paraphrased?.[key] ?? 0)),
            );

            return (
              <Card key={key} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ px: 2, py: 1.5 }}>
                  <Stack spacing={1}>
                    {/* Original bar */}
                    <Box
                      sx={{
                        position: "relative",
                        height: 8,
                        borderRadius: "4px",
                        bgcolor: theme.palette.grey[200],
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          width: `${origScore}%`,
                          bgcolor: theme.palette.grey[700],
                        }}
                      />
                    </Box>
                    {/* Paraphrased bar */}
                    <Box
                      sx={{
                        position: "relative",
                        height: 8,
                        borderRadius: "4px",
                        bgcolor: theme.palette.success.lighter,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          width: `${paraScore}%`,
                          bgcolor: theme.palette.success.main,
                        }}
                      />
                    </Box>
                    {/* Labels */}
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography noWrap sx={{ fontSize: 12 }}>
                        {labels[0]}
                      </Typography>
                      <Typography noWrap sx={{ fontSize: 12 }}>
                        {labels[1]}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default ToneTab;
