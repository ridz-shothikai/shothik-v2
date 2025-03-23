"use client";


import { Container } from "@mui/material";
import React from "react";
import { summarizeFaq } from "../../../_mock/tools/summarizefaq";
import HomeAdvertisement from "../../../components/common/HomeAdvertisement";
import ToolsCTA from "../../../components/tools/common/ToolsCTA";
import ToolsSepecigFaq from "../../../components/tools/common/ToolsSepecigFaq";
import SummarizeContend from "../../../components/tools/summarize/Summarize";

// export async function generateMetadata() {
//   return {
//     title: "Summarize | Shothik AI",
//     description: "This is Summarize page",
//   };
// }

const Summarize = () => {
  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", gap: { md: 7, xs: 5 } }}
    >
      <SummarizeContend />
      <ToolsSepecigFaq
        tag='All you need to know about Summarize feature'
        data={summarizeFaq}
      />
      <ToolsCTA toolType='summarize' />
      <HomeAdvertisement />
    </Container>
  );
};

export default Summarize;
