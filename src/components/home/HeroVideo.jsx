"use client";
import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { useComponentTracking } from "../../hooks/useComponentTracking";

export default function HeroVideo() {
  const { componentRef, trackClick } = useComponentTracking("hero_video", {
      viewThreshold: 0.3,
    });

  const videoRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVideoPlay = () => {
    if (!videoRef.current) return;

    const totalDuration = formatTime(videoRef.current.duration);

    trackClick("video_play", {
      video_type: "hero_demo",
      video_duration: totalDuration,
      user_interaction_time: Date.now() - performance.now(),
    });
  };

  useEffect(() => {
    // Load video after the main content is painted
    const timer = setTimeout(() => {
      if (videoRef.current) {
        const sources = videoRef.current.querySelectorAll("source");
        sources.forEach((source) => {
          source.src = source.dataset.src;
        });
        videoRef.current.load();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      ref={componentRef}
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 250, sm: 300, md: 380, lg: 420, xl: 550 },
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "#f5f5f5",
      }}
    >
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        controls
        preload="none"
        poster="/home/hero/video-thumbnail.webp"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "8px",
        }}
        onPlay={handleVideoPlay}
        onPause={() => trackClick("video_pause", { video_position: "hero" })}
        onEnded={() => trackClick("video_complete", { video_position: "hero" })}
      >
        <source data-src="/home/hero/hero-video.mp4" type="video/mp4" />
        {/* <source data-src="/home/hero/demo-video.webm" type="video/webm" /> */}
        Your browser does not support the video tag.
      </video>
    </Box>
  );
}
