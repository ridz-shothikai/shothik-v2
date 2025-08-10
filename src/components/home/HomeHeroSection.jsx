"use client";

import { SmartToy, Speed, VolumeUp } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { alpha, Container, Grid2 } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import * as motion from "motion/react-client";
import Image from "next/image";
import BgContainer from "./components/hero/BgContainer";
import Details from "./components/hero/Details";
import VideoImage from "./components/VideoImage";
import {useComponentTracking} from "../../hooks/useComponentTracking"
import { trackingList } from "../../libs/trackingList";
import HeroVideo from "./HeroVideo";

export default function HomeHeroSection() {
  const { componentRef, trackClick } = useComponentTracking(trackingList.LANDING_HERO);

  return (
    <BgContainer
      ref={componentRef}
      // sx={{ backgroundColor: alpha("#00A76F", 0.08), mb:0 }}
      sx={{
        maxWidth: "lg",
        mx: "auto",
        pt: { xl: "50px" },
      }}
    >
      <Container
        sx={{
          pt: 6,
          pb: { xs: 2, sm: 2, md: 8, lg: 10, xl: 10 },
          px: { xs: 2, sm: 4, md: 6 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: "30px", sm: "44px", md: "52px", lg: "72px", xl: "80px" },
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1, // Or -1 if it should be in the background
            pointerEvents: "none", // Avoid blocking clicks
            overflow: "hidden",
          }}
        >
          <img
            src="/pattern.svg"
            alt="pattern"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // or "contain", depending on your design
              opacity: "40%",
            }}
          />
        </Box>

        {/* Details Section - Shows first on mobile, left on desktop */}
        {/* <Grid2
          size={{ xs: 12, md: 6 }}
          sx={{
            order: { xs: 1, md: 1 },
            pr: { md: 2, lg: 3 },
          }}
        > */}
        <Details trackClick={trackClick} />

        {/* Video Section - Shows second on mobile, right on desktop */}
        <Grid2
          size={{ xs: 12, md: 6 }}
          sx={{
            order: { xs: 2, md: 2 },
            width: "100%",
            // pl: { md: 2, lg: 3 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              zIndex: 12,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: 250, sm: 300, md: 380, lg: 420, xl: 550 },
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HeroVideo/>

              {/* Custom play button overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  border: "1.5px solid #00A76F",
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 1)",
                    transform: "translate(-50%, -50%) scale(1.1)",
                  },
                }}
                onClick={(e) => {
                  const video =
                    e.currentTarget.parentElement.querySelector("video");
                  if (video.paused) {
                    video.play();
                    e.currentTarget.style.display = "none";
                  }
                }}
              >
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    borderLeft: "12px solid #00A76F",
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    marginLeft: "2px",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Grid2>
      </Container>
    </BgContainer>
  );
}

// Signin Button Renderer
export function SigninButtonRenderer({ title }) {
  return (
    <>
      <Button
        onClick={() => {
          dispatch(setIsSignUpModalOpen(false));
          dispatch(setIsSignInModalOpen(true));
        }}
        variant="contained"
        size="large"
        sx={{
          maxWidth: 202,
          borderRadius: "0.5rem",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
          "&::after": {
            content: '"›"',
            color: "#00A76F",
            flexShrink: 0,
          },
        }}
      >
        {title}
        <ArrowForwardIcon
          style={{ height: "1.25rem", width: "1.25rem", marginLeft: "0.5rem" }}
        />
      </Button>
    </>
  );
}
