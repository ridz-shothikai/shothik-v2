"use client";

import { Box } from "@mui/material";
import ResearchContent from "./ResearchContent";
import ImagesContent from "./ImagesContent";
import SourcesContent from "./SourcesContent";

export default function ResearchDataArea({ selectedTab, research, isLastData }) {
  console.log("research data on research data area", isLastData);

  const renderContent = () => {
    switch (selectedTab) {
      case 0: // Research
        return (
          <ResearchContent
            currentResearch={research} // Pass the specific research object
            isLastData={isLastData}
          />
        );
      case 1: // Images
        return <ImagesContent images={research.images} />;
      case 2: // Sources
        return <SourcesContent sources={research.sources} />;
      default:
        return <ResearchContent currentResearch={research} />;
    }
  };

  return <Box>{renderContent()}</Box>;
}
