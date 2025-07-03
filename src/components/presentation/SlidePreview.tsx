// components/SlidePreview.jsx
import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const PRIMARY_GREEN = '#07B37A';

// Original slide dimensions
const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;
const SLIDE_ASPECT_RATIO = SLIDE_WIDTH / SLIDE_HEIGHT;

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Title Slide</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:wght@400;600&display=swap');

        :root {
            --primary: #f0f8ff;
            --secondary: #2F4F4F;
            --accent: #4682B4;
            --text: #f0f8ff; /* Derived from primary for good contrast on dark secondary */
            --background: #E6E6FA;
            --header-font: 'Montserrat', sans-serif;
            --body-font: 'Open Sans', sans-serif;
        }

        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #f0f0f0; /* Neutral backdrop for the canvas */
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            aspect-ratio: 16 / 9;
            background-color: var(--background);
        }

        .slide {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 60px 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.15); /* Shadowed canvas style */
            position: relative;
        }
        
        .content-wrapper {
            max-width: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
        }

        .headline {
            font-family: var(--header-font);
            font-size: 64px;
            font-weight: 700;
            color: var(--secondary);
            margin: 0;
        }

        .body-content {
            font-family: var(--body-font);
            font-size: 28px;
            color: var(--secondary);
            opacity: 0.9;
            line-height: 1.6;
            margin: 0;
            max-width: 800px;
        }

        .icon-bar {
            display: flex;
            gap: 40px;
            margin-bottom: 24px;
        }

        .icon-bar i {
            font-size: 36px;
            color: var(--accent);
            transition: transform 0.3s ease, color 0.3s ease;
        }
        
        .icon-bar i:hover {
            transform: scale(1.2);
            color: var(--secondary);
        }

    </style>
</head>
<body>
    <div class="slide-container">
        <div class="slide">
            <div class="content-wrapper">
                <div class="icon-bar">
                    <i class="fa-solid fa-book-open" aria-label="Book icon"></i>
                    <i class="fa-solid fa-feather-pointed" aria-label="Quill icon"></i>
                    <i class="fa-solid fa-scroll" aria-label="Scroll icon for literature"></i>
                </div>
                <h1 class="headline">A Journey Through English Literature</h1>
                <p class="body-content">An overview of major periods, influential authors, and essential study resources.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

export default function SlidePreview({ slide, index, activeTab, onTabChange }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 });
  const containerRef = useRef(null);

  // Calculate scale factor to fit the iframe within the container
  const calculateScale = (containerWidth) => {
    const viewportWidth = window.innerWidth;
    
    // For mobile devices, use a more aggressive scaling
    if (viewportWidth < 768) {
      // Ensure minimum scale for readability on mobile
      const minScale = 0.25;
      const calculatedScale = containerWidth / SLIDE_WIDTH;
      return Math.max(calculatedScale, minScale);
    }
    
    // For larger screens, use the container width
    return containerWidth / SLIDE_WIDTH;
  };

  // Calculate the container height based on the scaled iframe
  const calculateContainerHeight = (scale) => {
    const scaledHeight = SLIDE_HEIGHT * scale;
    const viewportHeight = window.innerHeight;
    
    // Set reasonable min/max heights
    const minHeight = 150;
    const maxHeight = Math.min(600, viewportHeight * 0.6);
    
    return Math.min(Math.max(scaledHeight, minHeight), maxHeight);
  };

  // Update dimensions when container resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scale = calculateScale(rect.width);
        const height = calculateContainerHeight(scale);
        
        setDimensions({
          width: rect.width,
          height: height,
          scale: scale
        });
      }
    };

    // Use timeout to ensure container is fully rendered
    const timeoutId = setTimeout(updateDimensions, 100);

    // Create ResizeObserver for more accurate resize detection
    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize events
      clearTimeout(timeoutId);
      setTimeout(updateDimensions, 50);
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Listen to window resize for viewport changes
    window.addEventListener('resize', updateDimensions);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [activeTab]); // Re-run when tab changes

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 2, overflow: 'hidden' }}>
      <CardContent sx={{ p: '0 !important' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f5f5f5', px: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => onTabChange(index, newValue)}
            aria-label={`Tabs for slide ${index + 1}`}
            sx={{
              '& .MuiTabs-indicator': { bgcolor: PRIMARY_GREEN },
              '& .Mui-selected': { color: `${PRIMARY_GREEN} !important` },
            }}
          >
            <Tab label="Preview" value="preview" />
            <Tab label="Thinking" value="thinking" />
            <Tab label="Code" value="code" />
          </Tabs>
        </Box>

        <Box sx={{ p: 0 }}>
          {activeTab === 'preview' && (
            <Box 
              ref={containerRef}
              sx={{ 
                height: `${dimensions.height}px`,
                position: 'relative', 
                width: '100%',
                bgcolor: '#f0f0f0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
                overflow: 'hidden',
                margin: 0,
                padding: 0,
                transition: 'height 0.3s ease-in-out',
              }}
            >
              {dimensions.scale > 0 && (
                <iframe
                  srcDoc={slide.body}
                  style={{
                    width: `${SLIDE_WIDTH}px`,
                    height: `${SLIDE_HEIGHT}px`,
                    transform: `scale(${dimensions.scale})`,
                    transformOrigin: 'center center',
                    border: 'none',
                    display: 'block',
                    pointerEvents: 'none',
                    transition: 'transform 0.2s ease-in-out',
                    flexShrink: 0,
                    margin: 0,
                    padding: 0,
                  }}
                  title={`Slide ${slide.slide_index + 1}`}
                />
              )}
            </Box>
          )}
          {activeTab === 'thinking' && (
            <Box sx={{ 
              p: 2, 
              minHeight: `${dimensions.height}px`,
              bgcolor: '#f8f9fa', 
              borderRadius: 1, 
              overflowY: 'auto' 
            }}>
              <Typography variant="body2" color="text.secondary">
                {slide?.thought}
              </Typography>
            </Box>
          )}
          {activeTab === 'code' && (
            <Box sx={{ minHeight: `${dimensions.height}px` }}>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                color: '#333', 
                padding: 16, 
                borderRadius: 8, 
                overflow: 'auto', 
                border: '1px solid #e0e0e0', 
                maxHeight: `${dimensions.height}px`
              }}>
                <code>
                  {`\n${slide.body}`}
                </code>
              </pre>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}