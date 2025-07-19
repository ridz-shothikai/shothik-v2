"use client";
import { Box, Typography } from "@mui/material";
import { School, Star, Public, Bolt } from "@mui/icons-material";
import * as motion from "motion/react-client";
import { useState, useEffect } from "react";

const SocialProofBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const proofItems = [
    { icon: <Star sx={{ fontSize: 16, mr: 0.5 }} />, text: "4.7/5 Rating from 50,000+ Reviews" },
    { icon: <Public sx={{ fontSize: 16, mr: 0.5 }} />, text: "Used in 190+ Countries" },
    { icon: <School sx={{ fontSize: 16, mr: 0.5 }} />, text: "Trusted by 200+ Universities" },
    { icon: <Bolt sx={{ fontSize: 16, mr: 0.5 }} />, text: "25M+ Monthly Active Users" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % proofItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        height: 50,
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'rgba(0, 167, 111, 0.12)' 
            : 'rgba(0, 167, 111, 0.08)',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: (theme) => 
          theme.palette.mode === 'dark'
            ? 'rgba(0, 167, 111, 0.3)'
            : 'rgba(0, 167, 111, 0.2)',
      }}
    >
      {proofItems.map((item, index) => (
        <Box
          component={motion.div}
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: currentIndex === index ? 1 : 0,
            y: currentIndex === index ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {item.icon}
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              fontSize: { xs: '0.875rem', md: '1rem' },
            }}
          >
            {item.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SocialProofBanner;