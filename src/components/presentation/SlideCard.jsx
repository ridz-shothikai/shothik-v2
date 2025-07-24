import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;

export const SlideCard = ({ slide, index, totalSlides }) => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    scale: 1,
  });
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
        scale,
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

    window.addEventListener("resize", handleWindowResize);

    // Delay initial calculation to ensure DOM is ready
    const timeoutId = setTimeout(updateDimensions, 100);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      clearTimeout(timeoutId);
    };
  }, [updateDimensions]);

  return (
    <Grid item xs={12}>
      <Card
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          width: "100%",
          minHeight: "auto",
          my: 3,
        }}
      >
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f9f9f9",
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: "600",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Slide {index + 1}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              {index + 1} / {totalSlides}
            </Typography>
          </Box>

          <Box
            ref={containerRef}
            sx={{
              position: "relative",
              width: "100%",
              height: dimensions.height > 0 ? `${dimensions.height}px` : "auto",
              bgcolor: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              transition: "height 0.2s ease-in-out",
            }}
          >
            {dimensions.scale > 0 && slide?.body ? (
              <iframe
                srcDoc={slide.body}
                style={{
                  width: `${SLIDE_WIDTH}px`,
                  height: `${SLIDE_HEIGHT}px`,
                  transform: `scale(${dimensions.scale})`,
                  transformOrigin: "center center",
                  transition: "transform 0.2s ease-in-out",
                  flexShrink: 0,
                  border: "none",
                  display: "block",
                  pointerEvents: "none",
                  backgroundColor: "white",
                }}
                title={`Slide ${index + 1}`}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "200px",
                  color: "#666",
                }}
              >
                <Typography variant="body2">Loading slide...</Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};
