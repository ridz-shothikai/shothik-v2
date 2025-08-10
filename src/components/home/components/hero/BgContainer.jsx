"use client";
import { Box, useTheme } from "@mui/material";
import React from "react";

const BgContainer = ({ children, image, sx, ref }) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  return (
    <Box
      ref={ref}
      sx={{
        marginBottom: theme.spacing(6),
        backgroundImage: dark ? "none" : image,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        zIndex: -1,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default BgContainer;
