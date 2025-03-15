import { Container } from "@mui/material";
import React from "react";
import { paraphraseFaq } from "../../../_mock/tools/paraphrasefaq";
import HomeAdvertisement from "../../../components/common/HomeAdvertisement";
import ToolsCTA from "../../../components/tools/common/ToolsCTA";
import ToolsSepecigFaq from "../../../components/tools/common/ToolsSepecigFaq";
import ParaphraseContend from "../../../components/tools/paraphrase/ParaphraseContend";

export async function generateMetadata() {
  return {
    title: "Paraphrase || Shothik AI",
    description: "Paraphrase description",
  };
}

const Paraphrase = () => {
  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", gap: { md: 7, xs: 5 } }}
    >
      <ParaphraseContend />
      <ToolsSepecigFaq
        tag='All you need to know about Paraphrase feature'
        data={paraphraseFaq}
      />
      <ToolsCTA toolType='paraphrase' />
      <HomeAdvertisement />
    </Container>
  );
};

export default Paraphrase;
