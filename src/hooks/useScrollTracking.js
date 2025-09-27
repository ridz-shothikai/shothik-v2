"use client";

import { useEffect, useRef } from "react";
import { useAnalytics } from "./useAnalytics";
import throttle from "../libs/throttle";
import { useSelector } from "react-redux";

export const useScrollTracking = () => {
  const { trackEvent } = useAnalytics();
  const milestones = useRef(new Set());

  // ============== Testing purpose
  const analytics = useSelector((state) => state.analytics);
  // ==============

  console.log("scrolling", analytics);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100,
      );

      // Track at 25%, 50%, 75%, 90%, 100%
      const checkpoints = [25, 50, 75, 90, 100];

      checkpoints.forEach((checkpoint) => {
        if (
          scrollPercent >= checkpoint &&
          !milestones.current.has(checkpoint)
        ) {
          milestones.current.add(checkpoint);
          trackEvent("scroll_depth", {
            depth_percentage: checkpoint,
            page_height: document.documentElement.scrollHeight,
            viewport_height: window.innerHeight,
          });
        }
      });
    };
    const throttledScroll = throttle(handleScroll, 250);
    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [trackEvent]);
};
