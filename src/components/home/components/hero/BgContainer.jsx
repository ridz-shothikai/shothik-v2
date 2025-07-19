"use client";
import { Box, useTheme } from "@mui/material";
import React from "react";
import * as motion from "motion/react-client";

const BgContainer = ({ children, image, sx, enablePattern = false }) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: 'relative',
        marginBottom: theme.spacing(6),
        backgroundImage: dark ? "none" : image,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* Optional subtle pattern overlay */}
      {enablePattern && !dark && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 167, 111, 0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />
      )}
      
      {/* Animated particles (very subtle) */}
      {enablePattern && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0],
                y: [-100, -300],
                x: [0, (i - 1) * 50],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                delay: i * 3,
                ease: "easeInOut",
              }}
              style={{
                position: 'absolute',
                bottom: '10%',
                left: `${30 + i * 20}%`,
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                pointerEvents: 'none',
              }}
            />
          ))}
        </>
      )}
      
      {children}
    </Box>
  );
};

export default BgContainer;