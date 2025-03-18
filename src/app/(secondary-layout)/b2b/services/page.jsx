import { Container } from "@mui/material";
import { Suspense } from "react";
import { HeroSection } from "../../../../components/b2b/services/HeroSection";

export async function generateMetadata() {
  return {
    title: "B2B Services | Shothik AI",
    description: "This is B2B Services page",
  };
}

const Services = () => {
  return (
    <Container>
      <Suspense fallback={null}>
        <HeroSection />
      </Suspense>
    </Container>
  );
};

export default Services;
