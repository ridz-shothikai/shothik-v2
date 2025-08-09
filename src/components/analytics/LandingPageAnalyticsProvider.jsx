"use client";

import { useEffect } from "react";
import { useAnalytics } from "../../hooks/useAnalytics";
import {useScrollTracking} from "../../hooks/useScrollTracking";
import {useSession} from "../../hooks/useSession";

export default function LandingPageAnalyticsProvider({children}) {
  const { trackEvent, trackPageView } = useAnalytics();
  // Tracking STARTS
  // Initialize scroll tracking for the entire page
  useSession();
  useScrollTracking();

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);
  // Tracking ENDS
  return <>{children}</>;
}
