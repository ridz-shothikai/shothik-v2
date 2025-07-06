'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFetchSlidesQuery } from '../../../redux/api/presentation/presentationApi';
import { usePresentation } from '../../../components/slide/context/SlideContext';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Original slide dimensions
const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;


// --- PresentationMode Component ---
// This component displays the slides in a full-screen modal.
const PresentationMode = ({ slides, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  // Reset index when modal is opened
  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
    }
  }, [open]);

  // Function to calculate the correct scale for the slide to fit in the window
  const updateScale = useCallback(() => {
    if (open && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const availableWidth = containerRect.width;
      const availableHeight = containerRect.height;
      
      // Calculate scale to fit both width and height, maintaining aspect ratio
      const scaleX = availableWidth / SLIDE_WIDTH;
      const scaleY = availableHeight / SLIDE_HEIGHT;
      const newScale = Math.min(scaleX, scaleY, 1.2); // Don't scale above 1
      
      setScale(newScale);
    }
  }, [open]);

  // Recalculate scale on window resize or when the modal opens
  useEffect(() => {
    if (!open) return;

    updateScale();
    
    const handleResize = () => {
      updateScale();
    };

    window.addEventListener('resize', handleResize);
    
    // Also update scale after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(updateScale, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [open, updateScale]);

  // Use ResizeObserver for more precise container size tracking
  useEffect(() => {
    if (!open || !containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateScale();
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [open, updateScale]);

  // Navigation handlers
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  // Set up event listeners for keyboard and mouse navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };

    const handleContextMenu = (e) => {
      e.preventDefault(); // Prevent the default right-click menu
      handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup listeners when the component unmounts or closes
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [open, slides.length, onClose]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        ref={containerRef}
        onClick={handleNext} // Left-click anywhere to advance the slide
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          outline: 'none',
          cursor: 'pointer',
          overflow: 'hidden'
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click from advancing the slide
            onClose();
          }}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Scaled Slide Iframe */}
        <Box
          sx={{
            width: `${SLIDE_WIDTH}px`,
            height: `${SLIDE_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease',
            bgcolor: '#f0f0f0',
            boxShadow: '0 0 30px rgba(255,255,255,0.2)',
            flexShrink: 0
          }}
        >
          <iframe
            srcDoc={currentSlide.body}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              pointerEvents: 'none',
              display: 'block'
            }}
            title={`Slide ${currentIndex + 1}`}
          />
        </Box>

        {/* Slide Counter */}
        <Typography sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            px: 2,
            py: 1,
            borderRadius: 2,
            fontFamily: 'sans-serif',
            zIndex: 1000
        }}>
            {currentIndex + 1} / {slides.length}
        </Typography>
      </Box>
    </Modal>
  );
};


// --- SlideCard Component ---
  const SlideCard = ({ slide, index, totalSlides }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 });
    const containerRef = useRef(null);

    const updateDimensions = useCallback(() => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        
        // Calculate scale based on available width
        const scale = containerWidth / SLIDE_WIDTH;
        const height = SLIDE_HEIGHT * scale;
        
        setDimensions({ 
          width: containerWidth, 
          height, 
          scale 
        });
      }
    }, []);

    useEffect(() => {
      // Initial calculation
      updateDimensions();
      
      // Set up ResizeObserver
      const resizeObserver = new ResizeObserver((entries) => {
        // Use requestAnimationFrame to avoid performance issues
        requestAnimationFrame(() => {
          updateDimensions();
        });
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      // Also listen to window resize as a fallback
      const handleWindowResize = () => {
        requestAnimationFrame(() => {
          updateDimensions();
        });
      };

      window.addEventListener('resize', handleWindowResize);
      
      // Delay initial calculation to ensure DOM is ready
      const timeoutId = setTimeout(updateDimensions, 100);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', handleWindowResize);
        clearTimeout(timeoutId);
      };
    }, [updateDimensions]);

  //   const calculateScale = (containerWidth) => {
  //     const viewportWidth = window.innerWidth;

  //     // For mobile devices, use a more aggressive scaling
  //     if(viewportWidth < 768) {
  //       // Ensure minimum scale for readability on mobile
  //       const minScale = 0.25;
  //       const calculateScale = containerWidth / SLIDE_WIDTH;
  //       return Math.max(calculateScale, minScale);
  //     }

  //     // For larger screens, use the container width
  //     return containerWidth / SLIDE_WIDTH;
  //   }

  //   const calculateContainerHeight = (scale) => {
  //     const scaledHeight = SLIDE_HEIGHT * scale;
  //     const viewportHeight = window.innerHeight;

  //     // Set reasonable min/max heights
  //     const minHeight = 150;
  //     const maxHeight = Math.min(600, viewportHeight * 0.6);
    
  //     return Math.min(Math.max(scaledHeight, minHeight), maxHeight);
  //   }

  // useEffect(() => {
  //   const updateDimensions = () => {
  //     if (containerRef.current) {
  //       const rect = containerRef.current.getBoundingClientRect();
  //       const scale = calculateScale(rect.width);
  //       const height = calculateContainerHeight(scale);
        
  //       setDimensions({
  //         width: rect.width,
  //         height: height,
  //         scale: scale
  //       });
  //     }
  //   };

  //   // Use timeout to ensure container is fully rendered
  //   const timeoutId = setTimeout(updateDimensions, 100);

  //   // Create ResizeObserver for more accurate resize detection
  //   const resizeObserver = new ResizeObserver(() => {
  //     // Debounce resize events
  //     clearTimeout(timeoutId);
  //     setTimeout(updateDimensions, 50);
  //   });
    
  //   if (containerRef.current) {
  //     resizeObserver.observe(containerRef.current);
  //   }

  //   // Listen to window resize for viewport changes
  //   window.addEventListener('resize', updateDimensions);

  //   return () => {
  //     clearTimeout(timeoutId);
  //     resizeObserver.disconnect();
  //     window.removeEventListener('resize', updateDimensions);
  //   };
  // }, []);

    return (
      <Grid item xs={12}>
        <Card sx={{ 
          boxShadow: 3, 
          borderRadius: 2, 
          overflow: 'hidden', 
          width: '100%',
          minHeight: 'auto',
          my: 3,
        }}>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <Box sx={{ 
              p: { xs: 1.5, sm: 2 }, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              backgroundColor: '#f9f9f9', 
              borderBottom: '1px solid #eee' 
            }}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: '600',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Slide {index + 1}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {index + 1} / {totalSlides}
              </Typography>
            </Box>
            
            <Box
              ref={containerRef}
              sx={{
                position: 'relative',
                width: '100%',
                // minHeight: dimensions.height > 0 ? `${dimensions.height}px` : '200px',
                height: dimensions.height > 0 ? `${dimensions.height}px` : 'auto',
                bgcolor: '#f0f0f0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                transition: 'height 0.2s ease-in-out',
              }}
            >
              {dimensions.scale > 0 && slide?.body ? (
                // <Box
                //   sx={{
                //   }}
                // >
                  <iframe
                    srcDoc={slide.body}
                    style={{
                      width: `${SLIDE_WIDTH}px`,
                      height: `${SLIDE_HEIGHT}px`,
                      transform: `scale(${dimensions.scale})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.2s ease-in-out',
                      flexShrink: 0,
                      // width: '100%',
                      // height: '100%',
                      border: 'none',
                      display: 'block',
                      pointerEvents: 'none',
                      backgroundColor: 'white',
                    }}
                    title={`Slide ${index + 1}`}
                  />
                // </Box>
              ) : (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '200px',
                  color: '#666'
                }}>
                  <Typography variant="body2">Loading slide...</Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };


// --- Main Page Component ---
export default function SlidesPreviewPage() {
  const [shouldPollSlides, setShouldPollSlides] = useState(true);
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');
  const { isPresentationOpen, closePresentation } = usePresentation();

  const { data: slidesData, isLoading: slidesLoading, error: slidesError } = useFetchSlidesQuery(projectId, {
    skip: !projectId,
    pollingInterval: shouldPollSlides ? 10000 : 0,
  });

  useEffect(() => {
    if (slidesData?.status === 'completed' || slidesData?.status === 'failed') {
      setShouldPollSlides(false);
    }
  }, [slidesData?.status]);

  if (slidesLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: 2 }}><CircularProgress /><Typography>Loading slides...</Typography></Box>;
  }

  if (slidesError) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: 2 }}><Typography color="error">Error loading slides</Typography></Box>;
  }

  if (!slidesData?.data || slidesData.data.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: 2 }}><Typography>No slides available</Typography></Box>;
  }

  return (
    <>
      <PresentationMode
        slides={slidesData?.data || []}
        open={isPresentationOpen && slidesData?.data?.length > 0}
        onClose={closePresentation}
      />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 4,
        px: 2
      }}>
        <Box sx={{ width: '100%', maxWidth: '60vw', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Slides Preview
          </Typography>
          {/* <Grid container spacing={4} direction="column"> */}
            {slidesData.data.map((slide, index) => (
              <SlideCard
                key={slide.slide_index || index}
                slide={slide}
                index={index}
                totalSlides={slidesData.data.length}
              />
            ))}
          {/* </Grid> */}
        </Box>
      </Box>
    </>
  );
}
