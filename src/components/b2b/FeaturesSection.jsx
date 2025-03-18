"use client";
import { keyframes } from "@emotion/react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Grid2, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const FeaturesSection = ({ features, title, subtitle }) => {
  const router = useRouter();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box mt={{ xs: "5rem", md: "10rem" }}>
      <Typography
        variant='body1'
        sx={{
          textAlign: "center",
          color: isDarkMode ? "common.white" : "#242526",
          fontSize: { xs: "2rem", md: "3rem" },
          fontWeight: 600,
          lineHeight: { xs: "2.5rem", md: "3.9rem" },
          width: { xs: "100%", md: "60.625rem" },
          margin: "0 auto",
          mb: { xs: "2rem", md: "5rem" },
        }}
      >
        <Typography
          variant='h2'
          fontWeight={"600"}
          component={"span"}
          color={"primary.darker"}
          sx={{
            textAlign: "center",
            fontSize: { xs: "2rem", md: "3rem" },
            fontStyle: "normal",
            fontWeight: "600",
            lineHeight: { xs: "2.5rem", md: "3.9rem" },
          }}
        >
          {title}
        </Typography>
        {subtitle}
      </Typography>
      <Grid2
        container
        spacing={4}
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        {features?.map((feature, index) =>
          feature?.image ? (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Box
                sx={{
                  p: 3,
                  height: "100%",
                  minHeight: 200,
                  bgcolor: isDarkMode
                    ? "background.default"
                    : "background.paper",
                  backgroundImage: feature?.image,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  animation: `${fadeIn} 1s ease-in-out`,
                  "&:hover": {
                    transition: "transform 0.3s ease-in-out",
                  },
                }}
              />
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Box
                sx={{
                  bgcolor: isDarkMode ? "primary.dark" : "primary.darker",
                  color: "common.white",
                  height: "100%",
                  "&:hover": {
                    backgroundColor: isDarkMode
                      ? "primary.darker"
                      : "primary.dark",
                    "& .titleBox::after": {
                      width: "90%",
                      borderColor: "#fff",
                    },
                    "& .number": {
                      color: "#FFF",
                    },
                    transition: "transform 0.3s ease-in-out",
                  },
                  display: "flex",
                  width: { xs: "100%", md: "25.98031rem" },
                  padding: "1.0135rem 2rem",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "1.5rem",
                  animation: `${slideIn} 0.5s ease-in-out`,
                }}
              >
                <Typography
                  variant='h3'
                  className='number'
                  sx={{
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.24)"
                      : "rgba(243, 243, 243, 0.24)",
                    fontFamily: "Poppins",
                    fontSize: { xs: "2rem", md: "2.53375rem" },
                    fontStyle: "normal",
                    fontWeight: "700",
                    lineHeight: { xs: "2rem", md: "2.53375rem" },
                  }}
                >
                  {index < 9 ? `0${index + 1}` : index + 1}
                </Typography>
                <Box
                  className='titleBox'
                  sx={{
                    mt: 1,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      width: "10%",
                      left: ".0631rem",
                      borderWidth: ".0625rem",
                      borderStyle: "solid",
                      borderColor: isDarkMode
                        ? "primary.light"
                        : "primary.dark",
                    },
                  }}
                >
                  <Typography
                    variant='h4'
                    sx={{
                      color: "#FFF",
                      fontFamily: "Public Sans",
                      fontSize: { xs: "1.2rem", md: "1.52025rem" },
                      fontStyle: "normal",
                      fontWeight: "700",
                      lineHeight: "normal",
                    }}
                  >
                    {feature.title}
                  </Typography>
                </Box>
                <Typography
                  variant='body2'
                  sx={{
                    color: "#FFF",
                    fontFamily: "Inter",
                    fontSize: { xs: "0.75rem", md: "0.88681rem" },
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: { xs: "1.2rem", md: "1.52025rem" },
                    width: { xs: "100%", md: "22rem" },
                    height: { xs: "auto", md: "4.625rem" },
                  }}
                >
                  {feature.content}
                </Typography>
                <Box
                  onClick={() => router.push(`/features/${index}`)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25338rem",
                    cursor: "pointer",
                    width: "100%",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant='body2'
                    sx={{
                      color: "#FFF",
                      fontFamily: "Inter",
                      fontSize: { xs: "0.875rem", md: "1.0135rem" },
                      fontStyle: "normal",
                      fontWeight: "500",
                      lineHeight: { xs: "1.2rem", md: "1.52025rem" },
                    }}
                  >
                    Read more
                  </Typography>
                  <ArrowForwardIcon fontSize='small' sx={{ ml: 1 }} />
                </Box>
              </Box>
            </Grid2>
          )
        )}
      </Grid2>
    </Box>
  );
};
