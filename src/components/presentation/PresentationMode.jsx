import { Box, IconButton, Modal, Typography } from "@mui/material";

import { useEffect, useState, useRef, useCallback } from "react";

const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;

export const PresentationMode = ({ slides, open, onClose }) => {
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
      const newScale = Math.min(scaleX, scaleY, 1.2); // Don't scale above 1.2

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

    window.addEventListener("resize", handleResize);

    // Also update scale after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(updateScale, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
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
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Set up event listeners for keyboard and mouse navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
    };

    const handleContextMenu = (e) => {
      e.preventDefault(); // Prevent the default right-click menu
      handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    // Cleanup listeners when the component unmounts or closes
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
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
          width: "100vw",
          height: "100vh",
          bgcolor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          outline: "none",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click from advancing the slide
            onClose();
          }}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "white",
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
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
            transformOrigin: "center center",
            transition: "transform 0.3s ease",
            bgcolor: "#f0f0f0",
            boxShadow: "0 0 30px rgba(255,255,255,0.2)",
            flexShrink: 0,
          }}
        >
          <iframe
            srcDoc={currentSlide.body}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              pointerEvents: "none",
              display: "block",
            }}
            title={`Slide ${currentIndex + 1}`}
          />
        </Box>

        {/* Slide Counter */}
        <Typography
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            bgcolor: "rgba(0,0,0,0.5)",
            px: 2,
            py: 1,
            borderRadius: 2,
            fontFamily: "sans-serif",
            zIndex: 1000,
          }}
        >
          {currentIndex + 1} / {slides.length}
        </Typography>
      </Box>
    </Modal>
  );
};
