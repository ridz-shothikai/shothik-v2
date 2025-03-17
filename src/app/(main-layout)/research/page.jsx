import { Container } from "@mui/material";
import React from "react";
import ResearchContend from "../../../components/tools/research/ResearchContend";

export async function generateMetadata() {
  return {
    title: "Research || Shothik AI",
    description: "Research description",
  };
}

const Research = () => {
  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", gap: { md: 7, xs: 5 } }}
    >
      <ResearchContend />
    </Container>
  );
};

export default Research;
