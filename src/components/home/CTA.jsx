import { Box, Stack, Typography } from "@mui/material";
import Caption from "./components/cta/Caption";
import CTAImage from "./components/cta/CTAImage";
import UserActionButton from "./components/hero/UserActionButton";

export default function CTA() {
  return (
    <Stack spacing={2} alignItems='center'>
      <Typography
        fontWeight='bold'
        align='center'
        lineHeight={1.2}
        fontSize={{ xs: "1.8rem", sm: "2rem", md: "3rem", lg: "3rem" }}
      >
        Get started with{" "}
        <Box
          component='span'
          style={{ color: "#00A76F" }}
          sx={{
            background: "linear-gradient(135deg, #00A76F 40%, #3A7A69 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Shothik AI
        </Box>{" "}
        today
      </Typography>

      <Typography
        variant='body1'
        align='center'
        color='text.secondary'
        sx={{ maxWidth: "md" }}
      >
        <Caption /> and take the first step towards a more efficient,
        productive, and effective future.
      </Typography>

      <UserActionButton />

      <Box
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        sx={{
          width: "100%",
          height: {
            xs: 150,
            sm: 250,
            md: 300,
            lg: 430,
            xl: 430,
          },
          position: "relative",
        }}
      >
        <CTAImage />
      </Box>
    </Stack>
  );
}
