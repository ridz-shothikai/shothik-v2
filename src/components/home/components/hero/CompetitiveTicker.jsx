"use client";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import * as motion from "motion/react-client";
import { Circle } from "@mui/icons-material";
import { useState, useEffect } from "react";

const CompetitiveTicker = () => {
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Only run on client side
    const checkMobile = () => {
      setIsMobile(window.innerWidth < theme.breakpoints.values.sm);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [theme]);
  
  const advantages = [
    "20% Cheaper than Other Tools",
    "AI Detection Bypass",
    "30+ Languages",
    "Bangla Grammar Checker",
    "Used by Students Worldwide",
    "GDPR & SOC 2 Compliant",
    "15% Faster Processing",
    "Built for Teams",
    "AI-Powered Writing Assistant",
    "SEO Optimized Content",
    "Plagiarism Checker",
  ];

  const tickerContent = advantages.join(" • ");
  const fullContent = `${tickerContent} • ${tickerContent}`; // Duplicate for seamless loop

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.05)',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        py: 2,
        mt: -6, // Pull it up closer to hero section
        mb: 6,
        position: 'relative',
        zIndex: 1,
      }}
    >
      {isMobile ? (
        // Static display for mobile
        <Box sx={{ px: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}
          >
            {advantages.slice(0, 3).join(' • ')}
          </Typography>
        </Box>
      ) : (
        // Scrolling animation for desktop
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <motion.div
            animate={{
              x: [0, -50 * advantages.length],
            }}
            transition={{
              x: {
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {fullContent.split(' • ').map((item, index) => (
                <Box
                  key={index}
                  component="span"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <span>{item}</span>
                  {index < fullContent.split(' • ').length - 1 && (
                    <Circle sx={{ fontSize: 4, color: 'text.disabled' }} />
                  )}
                </Box>
              ))}
            </Typography>
          </motion.div>
        </Box>
      )}
    </Box>
  );
};

export default CompetitiveTicker;