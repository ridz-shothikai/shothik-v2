"use client";

import { Box, Grid2, Rating, Typography, useTheme } from "@mui/material";
import * as motion from "motion/react-client";
import React from "react";
import UserActionButton from "./UserActionButton";

const Details = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  return (
    <Grid2
      size={{ xs: 12, md: 6 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: {xl: "0.75rem"}
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            letterSpacing: "-2%",
            lineHeight: 1,
            color: isDarkMode ? "" : "#111827",
            fontSize: { xs: "2.5em", sm: "3.25em", md:"2.75em", lg: "3.75em", xl: "4.25em" },
            // background: "linear-gradient(135deg, #00A76F 40%, #3A7A69 100%)",
            // backgroundClip: "text",
            // WebkitBackgroundClip: "text",
            // WebkitTextFillColor: "transparent",
          }}
        >
          Think different. <br />
          <span
            style={{
              fontWeight: 700,
              color: "#00A76F",
              background: "linear-gradient(135deg, #00A76F 40%, #3A7A69 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Write different.
          </span>
        </Typography>
        {/* <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            letterSpacing: "-9%",
            color: "#00A76F",
            background: "linear-gradient(135deg, #00A76F 40%, #3A7A69 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        ></Typography> */}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ my: 2, maxWidth: {sm: "400px", md: "350px", lg: "380px", xl: "470px" }, fontSize: { xl: "1.25em" } }}
        >
          AI that understands your thoughts before you do. Paraphrasing,
          Humanizer, Grammer Fix, and AI Agents at your service.
        </Typography>
      </motion.div>

      {/* <Box
        component={motion.div}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        sx={{
          display: "flex",
          alignItems: "start",
          gap: 1,
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
            lg: "row",
            xl: "row",
          },
          marginBottom: "16px",
        }}
      >
        <Rating value={5} readOnly color="#00A76F" />
        <Typography sx={{ color: "text.secondary" }}>
          Rated&nbsp;4.9/5&nbsp;| Based on&nbsp;{" "}
          <span style={{ color: "#00A76F", fontWeight: 600 }}>400,000+</span>{" "}
          &nbsp;happy clients
        </Typography>
      </Box> */}
      <UserActionButton />
    </Grid2>
  );
};

export default Details;
