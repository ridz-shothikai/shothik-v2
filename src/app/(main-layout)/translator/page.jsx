import { Container } from "@mui/material";
import React from "react";
import HomeAdvertisement from "../../../components/common/HomeAdvertisement";
import ToolsCTA from "../../../components/tools/common/ToolsCTA";
import TranslatorFAQ from "../../../components/tools/tanslator/FAGTranslator";
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
      <TranslatorFAQ />
      <ToolsCTA toolType='translator' />
      <HomeAdvertisement />
    </Container>
  );
};

export default Translatorpage;
