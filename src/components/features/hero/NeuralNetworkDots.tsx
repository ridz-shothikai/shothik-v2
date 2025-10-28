import { Box, useTheme } from "@mui/material";
import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
}

export default function NeuralNetworkDots() {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const animationFrameRef = useRef<number>();
  const pulsePhaseRef = useRef<number>(0);

  const isDark = theme.palette.mode === 'dark';
  const dotColor = isDark ? '255, 255, 255' : '0, 167, 111';  // White dots in dark, green in light
  const baseOpacity = isDark ? 0.10 : 0.06; // Slightly more visible in dark mode for texture

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crisp rendering
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      
      // Reset transform before scaling to prevent exponential scaling on resize
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initializeDots();
    };

    // Initialize dots in perfect grid - Steve Jobs would approve
    const initializeDots = () => {
      const dots: Dot[] = [];
      const spacing = 80; // Larger spacing for cleaner, more minimal look
      const cols = Math.floor(canvas.offsetWidth / spacing);
      const rows = Math.floor(canvas.offsetHeight / spacing);
      
      // Center the grid perfectly
      const offsetX = (canvas.offsetWidth - (cols - 1) * spacing) / 2;
      const offsetY = (canvas.offsetHeight - (rows - 1) * spacing) / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            x: offsetX + i * spacing,
            y: offsetY + j * spacing,
          });
        }
      }
      dotsRef.current = dots;
    };

    // Animation loop - synchronized breathing effect
    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const dots = dotsRef.current;
      
      // Synchronized pulse - all dots breathe together (2.5 second cycle)
      pulsePhaseRef.current += 0.015;
      const breathe = Math.sin(pulsePhaseRef.current) * 0.08; // Gentle pulse

      // Calculate synchronized opacity for all dots
      const opacity = baseOpacity + breathe;

      // Draw all dots with synchronized opacity
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, ${opacity})`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDark, dotColor, baseOpacity]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.7,
        '@media (prefers-reduced-motion: reduce)': {
          display: 'none',
        },
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </Box>
  );
}
