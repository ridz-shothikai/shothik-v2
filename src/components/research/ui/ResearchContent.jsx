"use client";

import { Box, Typography, Paper, Chip, useTheme } from "@mui/material";
import { marked } from "marked";
import { useSelector } from "react-redux";
import { researchCoreState } from "../../../redux/slice/researchCoreSlice";
import ResearchContentWithReferences from "../../tools/research/ResearchContentWithReferences";

const MessageBubble = ({ message, isLastData, isDataGenerating, theme }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      width: "100%", // Ensure container takes full width
    }}
  >
    <Paper
      elevation={1}
      sx={{
        flex: 1,
        py: 2,
        px: 3,
        mb: { xs: isLastData && isDataGenerating ? 2 : 19, sm: 9, md: 2 },
        bgcolor: theme?.palette.mode === "dark" ? "#161C24" : "#F4F6F8",
        border: "none",
        boxShadow: "none",
        width: "100%", // Ensure paper takes full width
        maxWidth: "100%", // Prevent overflow
        boxSizing: "border-box", // Include padding in width calculation
      }}
    >
      <Box
        sx={{
          "& p": {
            mb: 1,
            wordWrap: "break-word", // Break long words
            overflowWrap: "break-word", // Modern browsers
            wordBreak: "break-word", // Break words if needed
            hyphens: "auto", // Add hyphens when breaking words
            maxWidth: "100%",
          },
          "& p:last-child": { mb: 0 },
          // Handle various markdown elements
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            wordWrap: "break-word",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            maxWidth: "100%",
            mb: 1,
          },
          "& ul, & ol": {
            paddingLeft: { xs: "1rem", sm: "1.5rem" }, // Reduce padding on mobile
            maxWidth: "100%",
          },
          "& li": {
            wordWrap: "break-word",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            maxWidth: "100%",
            mb: 0.5,
          },
          "& a": {
            wordWrap: "break-word",
            overflowWrap: "break-word",
            wordBreak: "break-all", // Break URLs aggressively
            color: "primary.main",
            textDecoration: "underline",
          },
          "& code": {
            backgroundColor: "rgba(0,0,0,0.1)",
            padding: "2px 4px",
            borderRadius: "4px",
            fontSize: "0.875em",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            wordBreak: "break-all",
            whiteSpace: "pre-wrap", // Allow wrapping in code
          },
          "& pre": {
            backgroundColor: "rgba(0,0,0,0.1)",
            padding: "12px",
            borderRadius: "8px",
            overflow: "auto", // Add scrollbar for long code blocks
            maxWidth: "100%",
            "& code": {
              backgroundColor: "transparent",
              padding: 0,
              whiteSpace: "pre-wrap", // Allow wrapping
              wordBreak: "break-all",
            },
          },
          "& blockquote": {
            borderLeft: "4px solid #ddd",
            paddingLeft: { xs: "8px", sm: "16px" },
            margin: "16px 0",
            fontStyle: "italic",
            color: "text.secondary",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          },
          "& table": {
            width: "100%",
            maxWidth: "100%",
            overflowX: "auto",
            display: "block",
            whiteSpace: "nowrap",
            "& td, & th": {
              padding: { xs: "4px", sm: "8px" },
              fontSize: { xs: "0.8rem", sm: "1rem" },
              wordWrap: "break-word",
            },
          },
          "& img": {
            maxWidth: "100%",
            height: "auto",
            display: "block",
          },
          // Ensure all content respects container bounds
          "& *": {
            maxWidth: "100%",
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            "& p": { mb: 1 },
            "& p:last-child": { mb: 0 },
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden", // Prevent any overflow
          }}
          dangerouslySetInnerHTML={{ __html: marked(message) }}
        />
      </Box>

      {message.sources && message.sources.length > 0 && (
        <Box sx={{ mt: 2, width: "100%", maxWidth: "100%" }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", mb: 1, display: "block" }}
          >
            Sources:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              width: "100%",
              maxWidth: "100%",
            }}
          >
            {message.sources.slice(0, 5).map((source, index) => (
              <Chip
                key={index}
                label={`[${source.reference}] ${source.title}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: { xs: "0.6rem", sm: "0.7rem" }, // Smaller on mobile
                  height: "24px",
                  maxWidth: { xs: "150px", sm: "none" }, // Limit width on mobile
                  "& .MuiChip-label": {
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  },
                }}
                onClick={() => window.open(source.url, "_blank")}
                clickable
              />
            ))}
            {message.sources.length > 5 && (
              <Chip
                label={`+${message.sources.length - 5} more`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: { xs: "0.6rem", sm: "0.7rem" },
                  height: "24px",
                }}
              />
            )}
          </Box>
        </Box>
      )}

      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          mt: 1,
          display: "block",
          textAlign: "right",
          fontSize: { xs: "0.6rem", sm: "0.75rem" }, // Smaller on mobile
        }}
      >
        {/* {new Date(message.timestamp).toLocaleTimeString()} */}
      </Typography>
    </Paper>
  </Box>
);

export default function ResearchContent({ currentResearch, isLastData }) {
  const researchResult =
    currentResearch?.result || currentResearch?.answer || "";

  const researchCore = useSelector(researchCoreState);

  const theme = useTheme();

  // Check if we have sources to use the new component with references
  const hasSources = currentResearch?.sources && currentResearch.sources.length > 0;

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
      {hasSources ? (
        <ResearchContentWithReferences
          content={researchResult}
          sources={currentResearch.sources}
          isLastData={isLastData}
          isDataGenerating={researchCore?.isStreaming || researchCore?.isPolling}
        />
      ) : (
        <MessageBubble
          message={researchResult}
          isLastData={isLastData}
          isDataGenerating={researchCore?.isStreaming || researchCore?.isPolling}
          theme={theme}
        />
      )}
    </Box>
  );
}
