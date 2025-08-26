"use client";

import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Divider,
  Link,
  Card,
  CardContent,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SourceIcon from "@mui/icons-material/Source";
import LinkIcon from "@mui/icons-material/Link";

const SourceCard = ({ source, index }) => (
  <Card
    sx={{
      mb: 2,
      transition: "box-shadow 0.2s",
      "&:hover": {
        boxShadow: 2,
      },
    }}
  >
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Chip
              label={`[${source.reference || index + 1}]`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: "0.7rem" }}
            />
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                flex: 1,
              }}
            >
              {source.title}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <LinkIcon fontSize="small" />
            {source.url}
          </Typography>

          {source.resolved_url && source.resolved_url !== source.url && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                fontStyle: "italic",
                mb: 1,
              }}
            >
              Resolved URL: {source.resolved_url}
            </Typography>
          )}
        </Box>

        <IconButton
          size="small"
          onClick={() => window.open(source.url, "_blank")}
          sx={{ ml: 1 }}
        >
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip
          label="External Source"
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.7rem" }}
        />
        {source._id && (
          <Chip
            label="Verified"
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontSize: "0.7rem" }}
          />
        )}
      </Box>
    </CardContent>
  </Card>
);

export default function SourcesContent({ sources }) {
  if (!sources || sources.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          textAlign: "center",
        }}
      >
        <SourceIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No Sources Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No sources were found for this research query
        </Typography>
      </Box>
    );
  }

  // Remove duplicates based on URL
  const uniqueSources = sources.filter(
    (source, index, self) =>
      index === self.findIndex((s) => s.url === source.url)
  );

  return (
    <Box>
      <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          Research Sources ({uniqueSources.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sources used to compile your research results
        </Typography>
      </Box>

      <Box>
        {uniqueSources.map((source, index) => (
          <SourceCard
            key={source._id || `${source.url}-${index}`}
            source={source}
            index={index}
          />
        ))}
      </Box>

      {sources.length > uniqueSources.length && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: "#f8f9fa" }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Note: {sources.length - uniqueSources.length} duplicate sources were
            filtered out
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
