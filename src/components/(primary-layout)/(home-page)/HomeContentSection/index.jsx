"use client";

import HomeHeroSection from "@/components/home/HomeHeroSection";
import AgenticHeroSection from "@/components/home/new-components/AgenticHeroSection";
import AgnetShowCase from "@/components/home/new-components/AgentShowCase";
import FeaturesSection from "@/components/home/new-components/FeaturesSection";

import CtaSection from "@/components/home/new-components/CtaSection";
import KeyBenefits from "@/components/home/new-components/KeyBenefits";

import LandingPageAnalyticsProvider from "@/components/analytics/LandingPageAnalyticsProvider";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ModalProvider from "@/components/home/ModelProvider";
import Journey from "@/components/home/new-components/Journey";
import ClaritySectionSkeleton from "@/components/home/new-components/skeleton/ClaritySectionSkeleton";
import FounderVideoSectionSkeleton from "@/components/home/new-components/skeleton/FounderVideoSectionSkeleton";
import TryAgentSkeleton from "@/components/home/new-components/skeleton/InteractiveAgentDemoSkeleton";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ClaritySection = dynamic(
  () => import("@/components/home/new-components/ClaritySection"),
  {
    loading: () => <ClaritySectionSkeleton />,
    ssr: false, // Disable SSR for client-only components
  },
);
const InteractiveAgentDemo = dynamic(
  () => import("@/components/home/new-components/InteractiveAgentDemo"),
  {
    loading: () => <TryAgentSkeleton />,
    ssr: false, // Disable SSR for client-only components
  },
);
const FounderVideoSection = dynamic(
  () => import("@/components/home/new-components/FounderVideoSection"),
  {
    loading: () => <FounderVideoSectionSkeleton />,
    ssr: false, // Disable SSR for client-only components
  },
);

export default function HomeContentSection() {
  return (
    <LandingPageAnalyticsProvider>
      <ErrorBoundary>
        <HomeHeroSection />
        <Suspense fallback={<ClaritySectionSkeleton />}>
          <ClaritySection />
        </Suspense>
        {/* <ClaritySectionV2 /> */}
        {/* <StudentDeserve/> */}
        <Suspense fallback={<TryAgentSkeleton />}>
          <InteractiveAgentDemo />
        </Suspense>
        <Suspense fallback={<FounderVideoSectionSkeleton />}>
          <FounderVideoSection />
        </Suspense>
        <AgenticHeroSection />
        <AgnetShowCase />
        <Journey />
        <KeyBenefits />
        <FeaturesSection />
        <CtaSection />
        <ModalProvider />
      </ErrorBoundary>
    </LandingPageAnalyticsProvider>
  );
}
