"use client";
import useResponsive from "@/hooks/useResponsive";
import { Box, Grid2, Link, Typography, useTheme } from "@mui/material";
import React from "react";

export const HeroSection = ({ information, headerInfo }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useResponsive("down", "sm");

  return (
    <Box
      sx={{
        px: { xs: "1rem", sm: "1.5rem", md: "2rem" },
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            color: isDarkMode ? "common.white" : "#005249",
            textAlign: "center",
            fontFamily: "Public Sans",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3.75rem" },
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: { xs: 1.2, md: "normal" },
            wordBreak: "break-word",
          }}
        >
          {headerInfo?.title}
        </Typography>
        <Typography
          sx={{
            color: isDarkMode ? "text.primary" : "#030211",
            textAlign: "center",
            fontFamily: "Public Sans",
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5625rem" },
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: { xs: 1.4, md: "normal" },
            mt: { xs: 1, sm: 1.5, md: 2 },
            px: { xs: 1, sm: 2 },
          }}
        >
          {headerInfo?.description}
        </Typography>
      </Box>

      {/* Image Section */}
      {headerInfo?.img && (
        <Box
          sx={{
            width: "100%",
            display: "block",
            height: {
              xs: "15rem",
              sm: "20.625rem",
              md: "40.625rem",
            },
            alignSelf: "stretch",
            overflow: "hidden",
            mx: "auto",
            p: { xs: 1, sm: 2, md: 3 },
            pb: { xs: 0, sm: 0, md: 0 },
          }}
        >
          <img
            src={headerInfo?.img}
            alt='Workspace'
            style={{
              width: "100%",
              display: "block",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Box>
      )}

      {/* Info Section */}
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, pt: { xs: 0, sm: 0, md: 0 } }}>
        <Grid2
          container
          justifyContent='center'
          sx={{
            border: ".0938rem solid transparent",
            borderImage: isDarkMode
              ? "linear-gradient(0deg, #ffffff 1.15%, rgba(255, 255, 255, 0) 63.39%)"
              : "linear-gradient(0deg, #030211 1.15%, rgba(0, 0, 0, 0) 63.39%)",
            borderImageSlice: 1,
            padding: { xs: 0.5, sm: 1, md: 2 },
            bgcolor: isDarkMode ? "background.paper" : "transparent",
            borderRadius: "4px",
            width: "100%",
            pt: 0,
          }}
        >
          {information?.map((item, index) => (
            <Grid2
              size={{ xs: 12, sm: 6, md: 3 }}
              xs={12}
              sm={6}
              md={3}
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderTop: "0",
                borderLeft: "0",
                borderRight: isMobile
                  ? "0"
                  : index === information?.length - 1
                  ? "0"
                  : "1px",
                borderBottom: index !== information?.length - 1 ? "1px" : "0",
                borderStyle: "solid",
                borderColor: "transparent",
                borderImage: isMobile
                  ? isDarkMode
                    ? "linear-gradient(90deg, rgba(255, 255, 255, 0) 0.45%, rgba(255, 255, 255, 0.8) 49.56%, rgba(255, 255, 255, 0) 99.49%)"
                    : "linear-gradient(90deg, rgba(255, 255, 255, 0) 0.45%, #030211 49.56%, rgba(230, 230, 230, 0) 99.49%)"
                  : isDarkMode
                  ? "linear-gradient(0deg, rgba(255, 255, 255, 0) 0.45%, rgba(255, 255, 255, 0.8) 49.56%, rgba(255, 255, 255, 0) 99.49%)"
                  : "linear-gradient(0deg, rgba(255, 255, 255, 0) 0.45%, #030211 49.56%, rgba(230, 230, 230, 0) 99.49%)",
                borderImageSlice: 1,
                py: { xs: 2, md: 0 },
              }}
            >
              <Typography
                sx={{
                  color: isDarkMode ? "common.white" : "#030211",
                  textAlign: "center",
                  fontFamily: "Public Sans",
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.875rem" },
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: { xs: 1.3, md: "normal" },
                  width: { xs: "100%", md: "11.3125rem" },
                  px: { xs: 1, md: 0 },
                }}
              >
                {item.isLink ? (
                  <Link
                    href='#'
                    underline='always'
                    sx={{
                      color: isDarkMode ? "common.white" : "#030211",
                      textDecorationColor: isDarkMode
                        ? "common.white"
                        : "#030211",
                      "&:hover": {
                        color: isDarkMode ? "primary.main" : "#005249",
                      },
                      wordBreak: "break-word",
                    }}
                  >
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </Typography>
              {item.description && (
                <Typography
                  sx={{
                    color: isDarkMode ? "text.secondary" : "#7C7C7C",
                    textAlign: "center",
                    fontFamily: "Nunito",
                    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: { xs: 1.5, md: "normal" },
                    mt: 1,
                    px: { xs: 2, md: 1 },
                  }}
                >
                  {item.description}
                </Typography>
              )}
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Box>
  );
};
