"use client";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { PlayCircleFilled } from "@mui/icons-material";
import { motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const VideoImage = ({ 
  lightImage, 
  darkImage, 
  width, 
  height,
  videoUrl = null,
  videoPoster = null,
  videoDuration = "1:32"
}) => {
  const { themeMode } = useSelector((state) => state.settings);
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const isVideo = !!videoUrl;

  const handlePlayVideo = () => {
    setIsPlaying(true);
    // Add your video player logic here
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      sx={{
        borderRadius: "20px",
        height: { xs: "300px", sm: "300px", lg: "400px" },
        width: { xs: "100%", sm: "500px", lg: "600px" },
        overflow: "hidden",
        position: "relative",
        zIndex: 0,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        '&:hover': isVideo ? {
          transform: 'scale(1.02)',
          transition: 'transform 0.3s ease',
        } : {},
      }}
    >
      {isVideo && !isPlaying ? (
        <>
          {/* Video Thumbnail */}
          <Image
            src={videoPoster || (themeMode === "dark" ? darkImage : lightImage)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "transparent",
            }}
            alt=''
            unoptimized
            width={width}
            height={height}
          />
          
          {/* Play Button Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
            }}
            onClick={handlePlayVideo}
          >
            <IconButton
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
                p: 2,
              }}
            >
              <PlayCircleFilled 
                sx={{ 
                  fontSize: { xs: 60, md: 80 }, 
                  color: '#00A76F' 
                }} 
              />
            </IconButton>
          </Box>
          
          {/* Duration Badge */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: 1,
              px: 1,
              py: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontWeight: 500,
              }}
            >
              {videoDuration}
            </Typography>
          </Box>
        </>
      ) : isVideo && isPlaying ? (
        <video
          width="100%"
          height="100%"
          controls
          autoPlay
          style={{
            objectFit: 'cover',
            backgroundColor: 'transparent',
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <Image
          src={themeMode === "dark" ? darkImage : lightImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "transparent",
          }}
          alt='Hero image'
          unoptimized
          width={width}
          height={height}
        />
      )}
    </Box>
  );
};

export default VideoImage;
