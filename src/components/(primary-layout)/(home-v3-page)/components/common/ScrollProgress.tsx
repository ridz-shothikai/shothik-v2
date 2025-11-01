'use client';

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = 
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div
      data-testid="scroll-progress-bar"
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] transition-all duration-150 ease-out"
      style={{
        background: 'linear-gradient(to right, #10B981, #34D399, #10B981)',
        width: `${scrollProgress}%`,
      }}
    />
  );
}
