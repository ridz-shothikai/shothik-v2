"use client";

import { Box, Chip, Grid2, Rating, styled, Typography, useTheme } from "@mui/material";
import * as motion from "motion/react-client";
import React, { useState } from "react";
import UserActionButton from "./UserActionButton";
import AnimatedText from "./AnimatedText";
import EmailModal from "../../EmailCollectModal";


const Details = ({ trackClick }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [showModal, setShowModal] = useState(false);

  const handleEmailSubmit = async (email) => {
    console.log("Email submitted:", email);
    // Here we would typically send the email to your backend
    // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
  };

  return (
    <>
      <Grid2
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xl: "0.75rem" },
          position: "relative",
          zIndex: 12,
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
              fontSize: {
                xs: "2.5em",
                sm: "3.25em",
                md: "2.75em",
                lg: "3.75em",
                xl: "4.75em",
              },
              textAlign: "center",
              // background: "linear-gradient(135deg, #00A76F 40%, #3A7A69 100%)",
              // backgroundClip: "text",
              // WebkitBackgroundClip: "text",
              // WebkitTextFillColor: "transparent",
            }}
          >
            <AnimatedText />
            {/* <span
            style={{
              fontWeight: 700,
              color: "#00A76F",
              background: "linear-gradient(135deg, #00A76F 40%, #3A7A69 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            before you do.
          </span> */}
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
            sx={{
              my: 2,
              fontSize: { xl: "1.25em" },
              maxWidth: "800px",
              textAlign: "center",
            }}
          >
            {/* AI that understands your thoughts before you do. Paraphrasing, */}
            {/* Humanizer, Grammer Fix, and AI Agents at your service.  */}
            Shothik is a general ai agent that understands your thoughts before
            you do. It doesn't just think, it delivers results. Paraphrasing,
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
        <UserActionButton setShowModal={setShowModal} trackClick={trackClick} />
      </Grid2>

      {/* email collect modal */}
      <EmailModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleEmailSubmit}
      />
    </>
  );
};

export default Details;
