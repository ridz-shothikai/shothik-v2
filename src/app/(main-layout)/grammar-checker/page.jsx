import GrammarContend from "@/components/(grammer-checker-page)/GrammarContend";
import { Container } from "@mui/material";
import ErrorBoundary from "../../../components/common/ErrorBoundary";

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
        <GrammarContend />
      </ErrorBoundary>
    </Container>
  );
};

export default Grammar;
