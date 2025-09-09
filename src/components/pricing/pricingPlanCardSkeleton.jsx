import {
  Box,
  Container,
  Stack,
  Switch,
  Typography,
  Skeleton,
  Card,
} from "@mui/material";

const PricingPlanCardSkeleton = () => (
  <Card
    sx={{
      p: 4,
      boxShadow: (theme) => theme.customShadows.z24,
      bgcolor: "background.default",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: 0,
      maxWidth: { xs: "450px", md: "550px" },
      marginInline: "auto",
    }}
  >
    <Box>
      {/* Price skeleton */}
      <Stack spacing={1} direction="row">
        <Skeleton
          variant="rectangular"
          width={80}
          height={40}
          sx={{ borderRadius: 1 }}
        />
        <Skeleton variant="text" width={60} height={20} />
      </Stack>

      {/* Title skeleton */}
      <Skeleton variant="text" width={120} height={32} sx={{ mt: 1 }} />

      {/* Subtitle skeleton */}
      <Skeleton variant="text" width={100} height={16} sx={{ mt: 0.5 }} />

      {/* Features list skeleton */}
      <Stack spacing={2.25} sx={{ p: 0, my: 3 }}>
        <Stack component="ul" spacing={2}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Stack
              key={index}
              component="li"
              direction="row"
              alignItems="flex-start"
              spacing={1}
            >
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={200} height={16} />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>

    {/* Button skeleton */}
    <Skeleton
      variant="rectangular"
      width="100%"
      height={48}
      sx={{ borderRadius: 1 }}
    />
  </Card>
);

export default PricingPlanCardSkeleton;