import { ExpandMore, Refresh } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

const PlagiarismResult = ({
  text: inputText,
  score,
  results,
  loading,
  error,
  manualRefresh,
}) => {
  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Plagiarism Checker
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* {fromCache && (
              <Chip 
                icon={<Cached />} 
                label="Cached" 
                size="small" 
                color="info" 
                variant="outlined"
              />
            )} */}
          <IconButton
            size="small"
            onClick={manualRefresh}
            disabled={loading || !inputText?.trim()}
            title="Refresh check"
          >
            <Refresh fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Paper
        variant="outlined"
        sx={{
          bgcolor: loading
            ? "grey.100"
            : error
              ? "error.light"
              : "success.light",
          p: 2,
          mb: 2,
          textAlign: "center",
          minHeight: 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
            }}
          >
            <CircularProgress size={24} sx={{ mb: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Checking plagiarism...
            </Typography>
          </Box>
        ) : error ? (
          <>
            <Typography variant="h4" color="error">
              Error
            </Typography>
            <Typography variant="caption" color="error">
              {error}
            </Typography>
            <Button
              size="small"
              onClick={manualRefresh}
              sx={{ mt: 1 }}
              variant="outlined"
              color="error"
            >
              Retry
            </Button>
          </>
        ) : (
          <>
            <Typography id="plagiarism_score" variant="h2">
              {score != null ? `${score}%` : "--"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Plagiarism
            </Typography>
          </>
        )}
      </Paper>

      <Box id="plagiarism_results">
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

        {!loading && !error && results.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No matches found.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PlagiarismResult;
