import { Box, Grid, Skeleton, Stack, Paper } from "@mui/material";

export default function FounderVideoSectionSkeleton() {
  return (
    <Box
      component="section"
      aria-busy="true"
      sx={{
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 8 },
        width: "100%",
        maxWidth: "1400px",
        mx: "auto",
      }}
    >
      <Grid container spacing={6} alignItems="center">
        {/* Left - Video/Card skeleton */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Paper
              elevation={0}
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 12px 30px rgba(10,20,30,0.06)",
                px: 2,
                py: 2,
                bgcolor: "transparent",
              }}
            >
              {/* big rounded rectangle representing the video area */}
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  borderRadius: 3,
                  height: { xs: 220, sm: 320, md: 360 },
                }}
              />

              {/* centered circular play button skeleton (absolute) */}
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              >
                <Skeleton
                  variant="circular"
                  width={64}
                  height={64}
                  animation="wave"
                />
              </Box>
            </Paper>

            {/* small stats row under the video */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="rectangular" width={120} height={18} />
              <Skeleton variant="rectangular" width={90} height={18} />
              <Box sx={{ flex: 1 }} />
            </Stack>
          </Stack>
        </Grid>

        {/* Right - Heading, paragraph, feature bullets skeleton */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            {/* big heading lines */}
            <Stack spacing={1}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="80%"
                height={42}
                sx={{ borderRadius: 1 }}
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="60%"
                height={42}
                sx={{ borderRadius: 1 }}
              />
            </Stack>

            {/* paragraph */}
            <Stack spacing={1}>
              <Skeleton variant="rectangular" width="90%" height={14} />
              <Skeleton variant="rectangular" width="85%" height={14} />
              <Skeleton variant="rectangular" width="70%" height={14} />
            </Stack>

            {/* three feature bullets */}
            <Stack spacing={2} sx={{ mt: 1 }}>
              {[0, 1, 2].map((i) => (
                <Stack key={i} direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="circular" width={18} height={18} />
                  <Box sx={{ width: "100%" }}>
                    <Skeleton
                      variant="rectangular"
                      width={`${40 + i * 15}%`}
                      height={14}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={`${60 - i * 10}%`}
                      height={12}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
