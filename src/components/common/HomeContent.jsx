"use client";

import React from 'react';

import HomeHeroSection from "../home/HomeHeroSection";
import AgenticHeroSection from "../home/new-components/AgenticHeroSection";
import AgnetShowCase from "../home/new-components/AgentShowCase";
import FeaturesSection from "../home/new-components/FeaturesSection";

import CtaSection from "../home/new-components/CtaSection";
import KeyBenefits from "../home/new-components/KeyBenefits";

import Journey from "../home/new-components/Journey";
import LandingPageAnalyticsProvider from "../analytics/LandingPageAnalyticsProvider";
import ModalProvider from "../home/ModelProvider"
import ErrorBoundary from  "../common/ErrorBoundary";
import { Suspense } from "react";
import ClaritySectionSkeleton from "../home/new-components/skeleton/ClaritySectionSkeleton";
import TryAgentSkeleton from "../home/new-components/skeleton/InteractiveAgentDemoSkeleton";
import FounderVideoSectionSkeleton from "../home/new-components/skeleton/FounderVideoSectionSkeleton";
import dynamic from "next/dynamic";

// import ClaritySection from "../home/new-components/ClaritySection";
// import InteractiveAgentDemo from "../home/new-components/InteractiveAgentDemo";
// import FounderVideoSection from "../home/new-components/FounderVideoSection";

const ClaritySection = dynamic(
  () => import("../home/new-components/ClaritySection"),
  {
    loading: () => <ClaritySectionSkeleton/>,
    ssr: false, // Disable SSR for client-only components
  }
);
const InteractiveAgentDemo = dynamic(
  () => import("../home/new-components/InteractiveAgentDemo"),
  {
    loading: () => <TryAgentSkeleton />,
    ssr: false, // Disable SSR for client-only components
  }
);
const FounderVideoSection = dynamic(
  () => import("../home/new-components/FounderVideoSection"),
  {
    loading: () => <FounderVideoSectionSkeleton />,
    ssr: false, // Disable SSR for client-only components
  }
);

export default function HomeContent() {
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
