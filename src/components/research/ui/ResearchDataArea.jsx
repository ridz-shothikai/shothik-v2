"use client";

import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import ResearchContent from "./ResearchContent";
import ImagesContent from "./ImagesContent";
import SourcesContent from "./SourcesContent";
import StreamingIndicator from "./StreamingIndicator";

export default function ResearchDataArea({ headerHeight, selectedTab, research }) {
  const {
    isStreaming,
    streamEvents,
  } = useSelector((state) => state.researchCore);
  const { messages } = useSelector((state) => state.researchChat);

  // console.log("research messages", messages);

  const renderContent = () => {
    switch (selectedTab) {
      case 0: // Research
        return (
          <ResearchContent
            messages={messages}
            isStreaming={isStreaming}
            streamEvents={streamEvents}
            currentResearch={research} // Pass the specific research object
          />
        );
      case 1: // Images
        return <ImagesContent images={research.images} isStreaming={isStreaming} />;
      case 2: // Sources
        return <SourcesContent sources={research.sources} isStreaming={isStreaming} />;
      default:
        return (
          <ResearchContent messages={messages} isStreaming={isStreaming} />
        );
    }
  };

  return (
    <Box>
      {renderContent()}
    </Box>
  );
}
