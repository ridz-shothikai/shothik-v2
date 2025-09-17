"use client";

import { motion } from "framer-motion";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Brain, Sparkles } from "lucide-react";
import mascotImage from "../../../../public/home/shothik-mascot.png";
import Image from "next/image";

const AgentThinkingLoader = ({
  message = "Agent is thinking...",
  steps = [
    "Analyzing your request",
    "Processing information",
    "Generating response",
  ],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const containerStyles = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 2 : 3,
    padding: isMobile ? 2 : 3,
    background: "linear-gradient(to right, #ecfdf5, #f0fdfa)",
    borderRadius: 3,
    border: "1px solid #a7f3d0",
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    mt: {xs: 2, lg: 3}
  };

  const mascotContainerStyles = {
    position: "relative",
    flexShrink: 0,
    width: isMobile ? 40 : 48,
    height: isMobile ? 40 : 48,
  };

  const mascotImageStyles = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  const thinkingBubbleStyles = {
    position: "absolute",
    width: 6,
    height: 6,
    backgroundColor: "#10b981",
    borderRadius: "50%",
  };

  const brainIconStyles = {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "white",
    borderRadius: "50%",
    padding: "4px",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    border: "1px solid #a7f3d0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const textContainerStyles = {
    flex: 1,
    minWidth: 0, // Prevent flex item from overflowing
    overflow: "hidden",
  };

  const messageStyles = {
    fontSize: isMobile ? "0.75rem" : "0.875rem",
    fontWeight: 500,
    color: "#047857",
    marginBottom: 1,
    lineHeight: 1.2,
  };

  const stepsContainerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: 0.5,
  };

  const stepStyles = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    fontSize: isMobile ? "0.625rem" : "0.75rem",
    color: "#059669",
    lineHeight: 1.2,
  };

  const stepDotStyles = {
    width: 4,
    height: 4,
    backgroundColor: "#10b981",
    borderRadius: "50%",
    flexShrink: 0,
  };

  const sparkleContainerStyles = {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // console.log(mascotImage, "mascotImage");

  return (
    <Box sx={containerStyles}>
      {/* Animated Mascot */}
      <Box sx={mascotContainerStyles}>
        <motion.div
          style={{ width: "100%", height: "100%" }}
          animate={{
            rotate: [-3, 3, -3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image src={mascotImage} alt="AI thinking" style={mascotImageStyles} />
        </motion.div>

        {/* Thinking bubbles */}
        <Box sx={{ position: "absolute", top: -8, right: -4 }}>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                ...thinkingBubbleStyles,
                position: "absolute",
                right: i * 16,
                top: i * -12,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </Box>

        {/* Brain icon indicator */}
        <motion.div
          style={brainIconStyles}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        >
          <Brain size={12} color="#059669" />
        </motion.div>
      </Box>

      {/* Text content */}
      <Box sx={textContainerStyles}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography sx={messageStyles}>{message}</Typography>
        </motion.div>

        {/* Animated steps */}
        <Box sx={stepsContainerStyles}>
          {steps.map((step, index) => (
            <motion.div
              key={step}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.5 }}
            >
              <motion.div
                style={stepDotStyles}
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              />
              <Typography sx={stepStyles} component="span">
                {step}
              </Typography>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Sparkle animation */}
      <Box sx={sparkleContainerStyles}>
        <motion.div
          animate={{
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Sparkles size={isMobile ? 14 : 16} color="#10b981" />
        </motion.div>
      </Box>
    </Box>
  );
};

export default AgentThinkingLoader;
