import GrammarCheckerContentSection from "@/components/(grammar-checker-page)/GrammarCheckerContentSection";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { Container } from "@mui/material";

export async function generateMetadata() {
  return {
    title: "Grammar || Shothik AI",
    description: "Grammar description",
  };
}

const Grammar = () => {
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
        <GrammarCheckerContentSection />
      </ErrorBoundary>
    </Container>
  );
};

export default Grammar;
