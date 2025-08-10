"use client";

import { useEffect } from "react";
import { useAnalytics } from "../../hooks/useAnalytics";
import {useScrollTracking} from "../../hooks/useScrollTracking";
import {useSession} from "../../hooks/useSession";
import {trackingList} from "../../libs/trackingList"

export default function LandingPageAnalyticsProvider({children}) {
  const { trackEvent, trackPageView } = useAnalytics();
  // Tracking STARTS
  // Initialize scroll tracking for the entire page
  useSession();
  useScrollTracking();

  useEffect(() => {
    trackPageView(trackingList.LANDING_PAGE); // Page view
  }, [trackPageView]);
  // Tracking ENDS
  return <>{children}</>;
}
