"use client";

import Hero from "../home/Hero";
import { Suspense } from "react";
import LandingPageAnalyticsProvider from "../analytics/LandingPageAnalyticsProvider";
import ErrorBoundary from "../common/ErrorBoundary";
import ModalProvider from "../home/ModelProvider";
import TryAgentSkeleton from "../home/new-components/skeleton/InteractiveAgentDemoSkeleton";
import dynamic from "next/dynamic";
import Showcase from "../home/Showcase";
import Showcase2 from "../home/Showcase2";
import Showcase3 from "../home/Showcase3";
import Showcase4 from "../home/Showcase4";
import Showcase5 from "../home/Showcase5";
import Trusted from "../home/Trusted";
import Testimonial from "../home/Testimonial";
import Try_Now from "../home/Try-Now";

import ThemeRegistry from "../../components/providers/ThemeRegistry";
import { Box, Skeleton } from "@mui/material";
import { FinalCTA } from "../../components/common";
import { FeaturesSection } from "../../components/features/comparison";
import { ShothikHero } from "../../components/features/hero";
import { TrustedBy } from "../../components/features/social-proof";
import { ShothikFooter, ShothikHeader } from "../../components/layout";

// Lazy load non-critical UI components (client-only for interactivity)
const Sidebar = dynamic(
  () =>
    import("../../components/layout").then((mod) => ({ default: mod.Sidebar })),
  {
    ssr: true,
  },
);

const ScrollProgress = dynamic(
  () =>
    import("../../components/common").then((mod) => ({
      default: mod.ScrollProgress,
    })),
  {
    ssr: true,
  },
);

const InspirationGallery = dynamic(
  () =>
    import("../../components/features/agents").then((mod) => ({
      default: mod.InspirationGallery,
    })),
  {
    loading: () => (
      <Skeleton variant="rectangular" height={600} sx={{ my: 4 }} />
    ),
  },
);

const ComparisonSection = dynamic(
  () =>
    import("../../components/features/comparison").then((mod) => ({
      default: mod.ComparisonSection,
    })),
  {
    loading: () => (
      <Skeleton variant="rectangular" height={400} sx={{ my: 4 }} />
    ),
  },
);

const MetaAdsFeatures = dynamic(
  () =>
    import("../../components/features/product").then((mod) => ({
      default: mod.MetaAdsFeatures,
    })),
  {
    loading: () => (
      <Skeleton variant="rectangular" height={800} sx={{ my: 4 }} />
    ),
  },
);

const MindmapFeature = dynamic(
  () =>
    import("../../components/features/product").then((mod) => ({
      default: mod.MindmapFeature,
    })),
  {
    loading: () => (
      <Skeleton variant="rectangular" height={600} sx={{ my: 4 }} />
    ),
  },
);

const FounderMessage = dynamic(
  () =>
    import("../../components/features/social-proof").then((mod) => ({
      default: mod.FounderMessage,
    })),
  {
    loading: () => (
      <Skeleton variant="rectangular" height={400} sx={{ my: 4 }} />
    ),
  },
);

const OneMoreThing = dynamic(
  () =>
    import("../../components/common").then((mod) => ({
      default: mod.OneMoreThing,
    })),
  {
    loading: () => (
      <Skeleton variant="rectangular" height={300} sx={{ my: 4 }} />
    ),
  },
);

const WhyShothik = dynamic(
  () =>
    import("../../components/features/social-proof").then((mod) => ({
      default: mod.WhyShothik,
    })),
  {
    loading: () => (
      <Skeleton variant="rectangular" height={500} sx={{ my: 4 }} />
    ),
  },
);

const InteractiveAgentDemo = dynamic(
  () => import("../home/new-components/InteractiveAgentDemo"),
  {
    loading: () => <TryAgentSkeleton />,
    ssr: false, // Disable SSR for client-only components
  },
);
export default function HomeContent() {
  return (
    <LandingPageAnalyticsProvider>
      <ErrorBoundary>
        <ThemeRegistry>
          <Box sx={{ minHeight: "100vh" }}>
            {/* <ScrollProgress /> */}
            {/* <Sidebar /> */}
            <Box >
              <ShothikHeader />
              <Box component="main" sx={{ pt: 2 }}>
                {/* <Hero /> */}
                <ShothikHero />
                {/* <Trusted /> */}
                <TrustedBy />
                {/* <Suspense fallback={<TryAgentSkeleton />}>
                  <InteractiveAgentDemo />
                </Suspense> */}
                <InspirationGallery />
                {/* <FeaturesSection /> */}
                {/* <ComparisonSection /> */}
                <MetaAdsFeatures />
                {/* <MindmapFeature /> */}
                {/* <FounderMessage /> */}
                <OneMoreThing />
                <FinalCTA />
                {/* <Try_Now /> */}
              </Box>
              {/* <ShothikFooter /> */}
            </Box>
          </Box>
        </ThemeRegistry>

        <ModalProvider />
      </ErrorBoundary>
    </LandingPageAnalyticsProvider>
  );
}