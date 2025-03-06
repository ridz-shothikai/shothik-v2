import { Box, Grid2, Rating, Stack, Typography } from "@mui/material";
import { motion } from "motion/react";
import React from "react";
import UserActionButton from "./UserActionButton";

const Details = () => {
  return (
    <Grid2 size={{ xs: 12, md: 6 }} item>
      <Stack>
        <Stack direction='row' spacing={1} alignContent='center' my='auto'>
          <Typography
            component={motion.div}
            variant='h2'
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "2.5rem",
                sm: "2.8rem",
                md: "3.2rem",
                lg: "3.5rem",
                xl: "3.8rem",
              },
              letterSpacing: "-2%",
              color: "#00A76F",
              background: "linear-gradient(135deg, #00A76F 40%, #3A7A69 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            Human Quality{" "}
          </Typography>
        </Stack>
        <Stack direction='row'>
          <Typography
            component={motion.div}
            variant='h2'
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "2.5rem",
                sm: "2.8rem",
                md: "3.2rem",
                lg: "3.5rem",
                xl: "3.8rem",
              },
              letterSpacing: "-2%",
              color: "#00A76F",
              background: "linear-gradient(135deg, #00A76F 40%, #3A7A69 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            Writing Agent
          </Typography>
        </Stack>
        <Typography
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          variant='body1'
          color='text.secondary'
          sx={{ my: 2 }}
        >
          Paraphrasing, grammar correction, humanized AI writing, translation,
          summarization, or deep research across the web, academic sources, and
          YouTube—Shothik AI ensures natural, accurate, and impactful writing in
          every task.
        </Typography>
        <Box
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
          <Rating value={5} readOnly color='#00A76F' />
          <Typography sx={{ color: "text.secondary" }}>
            Rated&nbsp;4.9/5&nbsp;| Based on&nbsp;{" "}
            <span style={{ color: "#00A76F", fontWeight: 600 }}>400,000+</span>{" "}
            &nbsp;happy clients
          </Typography>
        </Box>

        <UserActionButton />
      </Stack>
    </Grid2>
  );
};

export default Details;
