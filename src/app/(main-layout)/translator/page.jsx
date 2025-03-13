import { Container } from "@mui/material";
import React from "react";
import { transtorFaq } from "../../../_mock/tools/translator";
import HomeAdvertisement from "../../../components/common/HomeAdvertisement";
import ToolsCTA from "../../../components/tools/common/ToolsCTA";
import ToolsSepecigFaq from "../../../components/tools/common/ToolsSepecigFaq";
import Translator from "../../../components/tools/tanslator/Translator";

export async function generateMetadata() {
  return {
    title: "Translator | Shothik AI",
    description: "This is Translator page",
  };
}

const Translatorpage = () => {
  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", gap: { md: 7, xs: 5 } }}
    >
      <Translator />
      <ToolsSepecigFaq
        tag='All you need to know about Translator feature'
        data={transtorFaq}
      />
      <ToolsCTA toolType='translator' />
      <HomeAdvertisement />
    </Container>
  );
};

export default Translatorpage;
