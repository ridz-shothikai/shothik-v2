"use client";

import { Box, Typography } from "@mui/material";
/**
 * @param {text: String}
 */

import { memo } from "react";

const TypingAnimation = memo(({ text = "Thinking..." }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 2, px: 1 }}>
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "#07B37A",
            animation: "typing 1s infinite",
            animationDelay: `${i * 0.2}s`,
            "@keyframes typing": {
              "0%, 60%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
              "30%": { opacity: 1, transform: "scale(1)" },
            },
          }}
        />
      ))}
    </Box>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ fontStyle: "italic" }}
    >
      {text}
    </Typography>
  </Box>
));

TypingAnimation.displayName = "TypingAnimation";

export default TypingAnimation;
