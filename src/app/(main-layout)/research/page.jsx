import { Container } from "@mui/material";
import ResearchContend from "../../../components/tools/research/ResearchContend";

export async function generateMetadata() {
  return {
    title: "Research || Shothik AI",
    description: "Research description",
  };
}

const Research = () => {
  return (
    <Container>
      <ResearchContend />
    </Container>
  );
};

export default Research;
