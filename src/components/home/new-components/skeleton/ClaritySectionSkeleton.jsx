import React from "react";
import { Box, Grid, Skeleton, Stack } from "@mui/material";

export default function StepsSkeleton({ count = 6 }) {

  return (
    <Box sx={{ py: 8, px: 2, maxWidth: 1200, mx: "auto" }}>
      {/* header skeletons (title / subtitle / short description) */}
      <Stack spacing={1.2} alignItems="center" sx={{ mb: 6 }}>
        <Skeleton variant="text" width={360} height={48} />
        <Skeleton variant="text" width={220} height={36} />
        <Skeleton variant="text" width={640} height={18} />
      </Stack>

      {/* grid of wrapper boxes only - each box is represented by a single rectangular skeleton */}
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            {/* single wrapper box skeleton - matches the visual weight of the cards in your screenshot */}
            <Skeleton
              variant="rectangular"
              height={180}
              sx={{ borderRadius: 2 }}
              animation="wave"
            />
          </Grid>
        ))}
      </Grid>

      {/* CTA button skeleton */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <Skeleton
          variant="rectangular"
          width={160}
          height={42}
          sx={{ borderRadius: 3 }}
        />
      </Box>
    </Box>
  );
}
