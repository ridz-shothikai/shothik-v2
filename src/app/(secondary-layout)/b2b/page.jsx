import { Container } from "@mui/material";
import { features } from "../../../_mock/b2b/features";
import { FeaturesSection } from "../../../components/b2b/FeaturesSection";
import { HeroSection } from "../../../components/b2b/HeroSection";
import { StatsSection } from "../../../components/b2b/StatsSection";
import { WhyChooseUsSection } from "../../../components/b2b/WhyChooseUsSection";

export async function generateMetadata() {
  return {
    title: "B2B | Shothik AI",
    description: "This is B2B page",
  };
}

const B2B = () => {
  return (
    <Container sx={{ py: 4 }}>
      <HeroSection />
      <StatsSection />
      <WhyChooseUsSection />
      <FeaturesSection
        features={features}
        title='The Features '
        subtitle='of Our Exceptional Service Offerings in Shothik AI'
      />
    </Container>
  );
};

export default B2B;
