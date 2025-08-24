"use client";

import { Box } from "@mui/material";

export default function ResearchDataArea({ headerHeight }) {
  return (
    <Box
      sx={{
        overflowY: "auto",
        maxHeight: {
          xs: "calc(90dvh - 300px)",
          md: "calc(90dvh - 310px)",
          xl: "calc(90dvh - 350px)",
        },
        // pb: 3
      }}
    >
      <p
        style={{
          height: "200vh",
        }}
      >
        Mahedi
      </p>
      <p
        style={{
          height: "200vh",
        }}
      >
        Mahedi
      </p>
      <p
        style={{
          height: "200vh",
        }}
      >
        Mahedi
      </p>
      <p
        style={{
          height: "200vh",
          position: "static",
          bottom: 0,
        }}
      >
        Mahedi
      </p>
    </Box>
  );
}
