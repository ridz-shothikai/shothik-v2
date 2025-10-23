import { aidetectorFaq } from "@/_mock/tools/aidetectorFaq";
import AiDetectorContentSection from "@/components/(ai-detector-page)/AiDetectorContentSection";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import HomeAdvertisement from "@/components/common/HomeAdvertisement";
import ToolsCTA from "@/components/tools/common/ToolsCTA";
import ToolsSepecigFaq from "@/components/tools/common/ToolsSepecigFaq";
import { Container } from "@mui/material";
import { Suspense } from "react";

export async function generateMetadata() {
  return {
    title: "AI Detector || Shothik AI",
    description: "AI Detector description",
  };
}

const Aidetector = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { md: 12, xs: 10 },
        maxWidth: "100% !important",
      }}
    >
      <ErrorBoundary>
        <Suspense fallback={null}>
          <AiDetectorContentSection />
        </Suspense>
      </ErrorBoundary>
      <ToolsSepecigFaq
        tag="All you need to know about AI Detector feature"
        data={aidetectorFaq}
      />
      <ToolsCTA toolType="aidetector" />
      <HomeAdvertisement />
    </Container>
  );
};

export default Aidetector;
