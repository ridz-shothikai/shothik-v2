import { summarizeFaq } from "@/_mock/tools/summarizefaq";
import SummarizeContentSection from "@/components/(summarize-page)/SummarizeContentSection";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import HomeAdvertisement from "@/components/common/HomeAdvertisement";
import ToolsCTA from "@/components/tools/common/ToolsCTA";
import ToolsSepecigFaq from "@/components/tools/common/ToolsSepecigFaq";
import { Container } from "@mui/material";

export async function generateMetadata() {
  return {
    title: "Summarize | Shothik AI",
    description: "This is Summarize page",
  };
}

const Summarize = () => {
  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", gap: { md: 7, xs: 5 } }}
    >
      <ErrorBoundary>
        <SummarizeContentSection />
      </ErrorBoundary>
      <ToolsSepecigFaq
        tag="All you need to know about Summarize feature"
        data={summarizeFaq}
      />
      <ToolsCTA toolType="summarize" />
      <HomeAdvertisement />
    </Container>
  );
};

export default Summarize;
