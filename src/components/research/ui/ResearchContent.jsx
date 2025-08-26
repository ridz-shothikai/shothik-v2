"use client";

import { Box, Typography, Paper, Avatar, Chip } from "@mui/material";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { marked } from "marked";
import { useSelector } from "react-redux";

const MessageBubble = ({ message, isUser }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
    }}
  >
    <Paper
      elevation={1}
      sx={{
        flex: 1,
        py: 2,
        px: 3,
        mb: {xs: 19 ,sm: 9, md:2},
        bgcolor: "#F4F6F8",
        // borderRadius: 2,
        border: "none",
        boxShadow: "none"
      }}
    >
      <Box sx={{ "& p": { mb: 1 }, "& p:last-child": { mb: 0 } }}>
        {/* <ReactMarkdown>{message.content}</ReactMarkdown> */}
        <Box
          sx={{ "& p": { mb: 1 }, "& p:last-child": { mb: 0 } }}
          dangerouslySetInnerHTML={{ __html: marked(message) }}
        />
      </Box>

      {message.sources && message.sources.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", mb: 1, display: "block" }}
          >
            Sources:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {message.sources.slice(0, 5).map((source, index) => (
              <Chip
                key={index}
                label={`[${source.reference}] ${source.title}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: "24px" }}
                onClick={() => window.open(source.url, "_blank")}
                clickable
              />
            ))}
            {message.sources.length > 5 && (
              <Chip
                label={`+${message.sources.length - 5} more`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: "24px" }}
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
        }}
      >
        {new Date(message.timestamp).toLocaleTimeString()}
      </Typography>
    </Paper>
  </Box>
);

export default function ResearchContent({
  currentResearch,
}) {

  const researchResult = currentResearch?.result || currentResearch?.answer || "";

  return (
    <Box>
      <MessageBubble
        message={researchResult}
        isUser={false}
      />
    </Box>
  );
}
