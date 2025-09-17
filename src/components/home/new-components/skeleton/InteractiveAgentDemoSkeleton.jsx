import { Box, Grid, Skeleton, Stack } from "@mui/material";

export default function AgentLiveSkeleton({ agents = 3 }) {

  return (
    <Box sx={{ py: 8, px: 3, maxWidth: 1200, mx: "auto" }}>
      {/* Page title */}
      <Stack spacing={1} alignItems="center" sx={{ mb: 5 }}>
        <Skeleton variant="text" width={360} height={56} />
        <Skeleton variant="text" width={520} height={20} />
      </Stack>

      <Grid container spacing={4} alignItems="flex-start">
        {/* Left column: agent list + examples */}
        <Grid item xs={12} md={5}>
          <Stack spacing={2}>
            {/* Highlighted agent card skeleton */}
            <Skeleton
              variant="rectangular"
              height={72}
              sx={{ borderRadius: 2, boxShadow: 1 }}
              animation="wave"
            />

            {/* Other agent items (each just a wrapper) */}
            {Array.from({ length: Math.max(0, agents - 1) }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={56}
                sx={{ borderRadius: 2 }}
                animation="wave"
              />
            ))}

            {/* Examples label */}
            <Skeleton variant="text" width={160} height={18} sx={{ mt: 2 }} />

            {/* Example rows */}
            <Stack spacing={1}>
              <Skeleton
                variant="rectangular"
                height={40}
                sx={{ borderRadius: 2 }}
              />
              <Skeleton
                variant="rectangular"
                height={40}
                sx={{ borderRadius: 2 }}
              />
              <Skeleton
                variant="rectangular"
                height={40}
                sx={{ borderRadius: 2 }}
              />
            </Stack>

            {/* CTA */}
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              <Skeleton
                variant="rectangular"
                width={140}
                height={40}
                sx={{ borderRadius: 3 }}
              />
            </Box>
          </Stack>
        </Grid>

        {/* Right column: agent panel */}
        <Grid item xs={12} md={7}>
          <Stack spacing={2} sx={{ boxShadow: 1, borderRadius: 2, p: 2 }}>
            {/* Panel header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Skeleton
                variant="rectangular"
                height={56}
                width={360}
                sx={{ borderRadius: 2 }}
              />
              <Skeleton variant="circular" width={36} height={36} />
            </Box>

            {/* Thin divider mimic */}
            <Skeleton
              variant="rectangular"
              height={6}
              sx={{ borderRadius: 1, width: "100%" }}
            />

            {/* Input area (large) */}
            <Skeleton
              variant="rectangular"
              height={140}
              sx={{ borderRadius: 2 }}
            />

            {/* Try button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Skeleton
                variant="rectangular"
                width={160}
                height={44}
                sx={{ borderRadius: 3 }}
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
