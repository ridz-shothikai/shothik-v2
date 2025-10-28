import { Box, Typography, Dialog, DialogContent, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/image";
import { useState, useEffect, useRef, memo } from "react";
import heroImage from "../../../assets/B80BBD6F-003A-44F9-B9B6-31569128A57E_1759865243321.png";
import checkmarkLogo from "../../../assets/Checkmark_1759923653930.png";
import NeuralNetworkDots from "./NeuralNetworkDots";

// Hoist static data outside component to avoid recreation
const TYPING_TEXTS = ["Writing reports...", "Creating slides...", "Running ads..."];

export default function ShothikHero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const checkmarkRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % TYPING_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Throttle mouse tracking using requestAnimationFrame for better performance
  useEffect(() => {
    let rafId: number | null = null;
    let lastMousePos = { x: 0, y: 0 };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      lastMousePos = { x: e.clientX, y: e.clientY };
      
      // Cancel previous frame if it hasn't been processed yet
      if (rafId !== null) return;
      
      // Schedule update for next animation frame
      rafId = requestAnimationFrame(() => {
        if (heroRef.current) {
          const rect = heroRef.current.getBoundingClientRect();
          setMousePos({ 
            x: lastMousePos.x - rect.left, 
            y: lastMousePos.y - rect.top 
          });
        }
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getCheckmarkTilt = () => {
    if (!checkmarkRef.current || !heroRef.current) return {};
    const heroRect = heroRef.current.getBoundingClientRect();
    const rect = checkmarkRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - heroRect.left;
    const centerY = rect.top + rect.height / 2 - heroRect.top;
    const deltaX = mousePos.x - centerX;
    const deltaY = mousePos.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 200) return {};
    
    const tiltX = (deltaY / distance) * 5;
    const tiltY = -(deltaX / distance) * 5;
    
    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      transition: 'transform 0.1s ease-out',
    };
  };

  const getVideoPulse = () => {
    if (!videoRef.current || !heroRef.current) return {};
    const heroRect = heroRef.current.getBoundingClientRect();
    const rect = videoRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - heroRect.left;
    const centerY = rect.top + rect.height / 2 - heroRect.top;
    const distance = Math.sqrt(
      Math.pow(mousePos.x - centerX, 2) + Math.pow(mousePos.y - centerY, 2)
    );
    
    if (distance < 300) {
      const intensity = 1 - (distance / 300);
      return {
        transform: `scale(${1 + intensity * 0.02})`,
        boxShadow: `0 0 ${intensity * 30}px rgba(0, 167, 111, ${intensity * 0.3})`,
      };
    }
    return {};
  };

  return (
    <Box
      ref={heroRef}
      component="section"
      sx={{
        minHeight: { xs: '75vh', md: '80vh' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3, md: 8, lg: 12 },
        py: { xs: 12, md: 16 },
        position: 'relative',
        overflow: 'visible',
        background: (theme) => theme.palette.mode === 'dark'
          ? '#000000'  // Pure black for infinite effect in dark mode
          : '#FFFFFF',  // Pure white for infinite effect in light mode
      }}
    >
      {/* Gradient Overlay for depth */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: (theme) => theme.palette.mode === 'dark'
            ? `radial-gradient(circle at 70% 50%, rgba(0, 167, 111, 0.025), transparent 60%)`  // Ultra-subtle green glow in dark
            : `radial-gradient(circle at 70% 50%, rgba(0, 167, 111, 0.015), transparent 60%)`,  // Ultra-subtle brand accent in light
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* AI Neural Network Dots Background */}
      <NeuralNetworkDots />

      {/* Parallax Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: 0,
          '@media (prefers-reduced-motion: reduce)': {
            transform: 'none',
          },
        }}
      />

      {/* Centered Content Container */}
      <Box
        sx={{
          maxWidth: '80rem',
          mx: 'auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Heading */}
        <Box sx={{ mb: { xs: 5, md: 6 } }}>
          {/* Heading with Inline Checkmark */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 2, md: 3 },
              mb: 2,
            }}
          >
            <Box
              ref={checkmarkRef}
              component="img"
              src={checkmarkLogo.src}
              alt="Shothik Success"
              data-testid="img-checkmark-logo"
              sx={{
                width: { xs: 48, md: 64 },
                height: { xs: 48, md: 64 },
                flexShrink: 0,
                animation: 'checkmarkBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                '@keyframes checkmarkBounceIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'scale(0)',
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                },
                ...getCheckmarkTilt(),
                '@media (prefers-reduced-motion: reduce)': {
                  animation: 'none',
                  transform: 'none !important',
                },
              }}
            />
            <Typography
              variant="h1"
              data-testid="text-hero-heading"
              sx={{ 
                fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
                m: 0,
                color: 'text.primary',
                fontWeight: 700,
              }}
            >
              Let Shothik Handle It
            </Typography>
          </Box>

          {/* Typing Animation */}
          <Box
            sx={{
              minHeight: { xs: 32, md: 40 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.125rem', md: '1.5rem' },
                fontWeight: 500,
                color: '#00A76F',  // Standard brand green
                animation: 'fadeIn 0.5s ease-in',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'translateY(10px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                '@media (prefers-reduced-motion: reduce)': {
                  animation: 'none',
                },
              }}
              key={currentText}
            >
              {TYPING_TEXTS[currentText]}
            </Typography>
          </Box>

          <Typography
            variant="h5"
            sx={{
              maxWidth: '56rem',
              color: 'text.secondary',
              mx: 'auto',
              mb: 1,
              fontWeight: 600,
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 1.6,
            }}
          >
            AI built for humanity, not just the privileged few. 100+ languages. Hyperlocal payments. Enterprise features at human prices.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: '48rem',
              color: 'text.disabled',
              mx: 'auto',
              mb: 2,
              fontWeight: 400,
              fontSize: { xs: '0.875rem', md: '1rem' },
              lineHeight: 1.75,
              letterSpacing: '0.01em',
            }}
          >
            From Bangladesh to the world—giving voice to billions
          </Typography>
        </Box>

        {/* Scroll Indicator */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            mt: { xs: 8, md: 10 },
            mb: { xs: 6, md: 8 },
            animation: 'bounce 2s ease-in-out infinite',
            '@keyframes bounce': {
              '0%, 100%': {
                transform: 'translateY(0)',
              },
              '50%': {
                transform: 'translateY(8px)',
              },
            },
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.875rem', md: '0.9375rem' },
              fontWeight: 500,
            }}
          >
            Watch how it works
          </Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
        </Box>

        {/* Founder Video - Optimized Size with Parallax */}
        <Box sx={{ mb: 0 }}>
          <Box
            ref={videoRef}
            onClick={() => setIsVideoOpen(true)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsVideoOpen(true);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Play introduction video - Watch Shothik founders explain the platform"
            data-testid="video-hero"
            sx={{
              position: 'relative',
              maxWidth: { xs: '100%', md: '900px' },
              height: { xs: '45vh', md: '50vh' },
              mx: 'auto',
              borderRadius: 4,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease-out',
              border: '1px solid',
              borderColor: 'grey.200',
              boxShadow: 'card',
              transform: `scale(${1 + scrollY * 0.0001})`,
              '&:hover': {
                boxShadow: 'z12',
              },
              '&:focus-visible': {
                outline: '3px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px',
              },
              ...getVideoPulse(),
              '@media (prefers-reduced-motion: reduce)': {
                transform: 'none !important',
              },
            }}
          >
            <Image
              src={heroImage}
              alt="Shothik AI Founders - Introducing Shothik"
              fill
              priority
              style={{
                objectFit: 'contain',
              }}
              sizes="(max-width: 768px) 100vw, 900px"
            />

            {/* Play Button */}
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
                zIndex: 20,
              }}
            >
              <IconButton
                aria-label="Play introduction video"
                data-testid="button-play-video"
                sx={{
                  width: { xs: 60, md: 72 },
                  height: { xs: 60, md: 72 },
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid',
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 0 rgba(25, 118, 210, 0.4)',
                    },
                    '50%': {
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 12px rgba(25, 118, 210, 0)',
                    },
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                    transition: 'none',
                  },
                  '&:hover': {
                    transform: 'scale(1.08)',
                    bgcolor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.16)',
                    borderColor: 'primary.main',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                  '&:focus-visible': {
                    outline: '3px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '4px',
                  },
                }}
              >
                <PlayArrowIcon
                  sx={{
                    fontSize: { xs: 32, md: 40 },
                    color: 'primary.main',
                    ml: 0.5,
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Video Modal */}
      <Dialog
        open={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        maxWidth="lg"
        fullWidth
        aria-labelledby="video-dialog-title"
        aria-describedby="video-dialog-description"
        PaperProps={{
          sx: {
            bgcolor: 'black',
            boxShadow: 'dialog',
          },
        }}
      >
        <IconButton
          onClick={() => setIsVideoOpen(false)}
          aria-label="Close video dialog"
          data-testid="button-close-video"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            zIndex: 1,
            '&:focus-visible': {
              outline: '2px solid white',
              outlineOffset: '2px',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%',
            }}
          >
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
                bgcolor: 'black',
              }}
            >
              <Box sx={{ textAlign: 'center', color: 'white', p: 4 }}>
                <PlayArrowIcon sx={{ fontSize: 64, opacity: 0.5, mb: 2 }} />
                <Typography id="video-dialog-title" variant="body1" sx={{ mb: 1 }}>
                  Video player will be integrated here
                </Typography>
                <Typography id="video-dialog-description" variant="body2" sx={{ color: 'grey.400' }}>
                  Replace with YouTube embed, Vimeo, or direct video source
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
