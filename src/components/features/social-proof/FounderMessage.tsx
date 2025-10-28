import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import shothikInterface from "../../../assets/Screenshot Capture - 2025-10-08 - 09-34-13_1759894487531.png";

export default function FounderMessage() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box 
      component="section" 
      ref={sectionRef} 
      sx={{ 
        py: { xs: 16, md: 24 },
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF'
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 4, md: 8 } }}>
        {/* Main Feature Section */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1.8fr' },
            gap: { xs: 6, md: 8 },
            alignItems: 'center',
            mb: { xs: 16, md: 20 },
            transition: 'all 0.8s ease-out',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography 
              variant="h2"
              sx={{ 
                lineHeight: 1.2,
                fontWeight: 700,
                color: 'text.primary'
              }}
            >
              Write naturally, <br />perfect instantly.
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                fontSize: '1.125rem',
                fontWeight: 400,
                lineHeight: 1.75,
                maxWidth: 512,
                color: 'text.secondary'
              }}
            >
              Shothik's AI understands context and tone, helping you craft professional content that sounds authentically human—from your first draft to your final masterpiece.
            </Typography>
          </Box>
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={shothikInterface.src}
              alt="Shothik AI Writing Interface"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0, 167, 111, 0.2)',
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            />
          </Box>
        </Box>

        {/* Secondary Feature Section - Reversed Layout */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
            gap: { xs: 6, md: 8 },
            alignItems: 'center',
            transition: 'all 0.8s ease-out',
            transitionDelay: '200ms',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)'
          }}
        >
          <Box sx={{ order: { xs: 1, lg: 2 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography 
              variant="h2"
              sx={{ 
                lineHeight: 1.2,
                fontWeight: 700,
                color: 'text.primary'
              }}
            >
              Your lifelong writing companion.
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                fontSize: '1.125rem',
                fontWeight: 400,
                lineHeight: 1.75,
                maxWidth: 512,
                color: 'text.secondary'
              }}
            >
              From your first essay as a student to your first business proposal as an entrepreneur—Shothik grows with you through every milestone of your journey.
            </Typography>
          </Box>
          <Box sx={{ order: { xs: 2, lg: 1 }, position: 'relative' }}>
            {/* Placeholder for second product screenshot */}
            <Box 
              sx={{ 
                aspectRatio: '4/3',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(24, 119, 242, 0.2)',
                p: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <Box sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.4)' }}>
                <Typography variant="body2" sx={{ fontWeight: 400, color: 'text.secondary' }}>
                  Secondary screenshot will be placed here
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'rgba(255, 255, 255, 0.5)' }}>
                  Add your feature showcase image
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
