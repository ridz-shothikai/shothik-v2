"use client";

import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import ResearchContent from "./ResearchContent";
import ImagesContent from "./ImagesContent";
import SourcesContent from "./SourcesContent";
import StreamingIndicator from "./StreamingIndicator";
import ResearchNavigation from "./ResearchNavigation";

export default function ResearchDataArea({ headerHeight }) {
  const { selectedTab } = useSelector((state) => state.researchUi);
  const {
    isStreaming,
    streamEvents,
    currentResearch,
    sources,
    images,
    researches,
    activeResearchIndex,
  } = useSelector((state) => state.researchCore);
  const { messages } = useSelector((state) => state.researchChat);

  console.log("research messages", messages);

  const renderContent = () => {
    switch (selectedTab) {
      case 0: // Research
        return (
          <ResearchContent
            messages={messages}
            isStreaming={isStreaming}
            streamEvents={streamEvents}
            currentResearch={currentResearch}
          />
        );
      case 1: // Images
        return <ImagesContent images={images} isStreaming={isStreaming} />;
      case 2: // Sources
        return <SourcesContent sources={sources} isStreaming={isStreaming} />;
      default:
        return (
          <ResearchContent messages={messages} isStreaming={isStreaming} />
        );
    }
  };

  return (
    <Box
      sx={{
        maxHeight: {
          xs: "calc(90dvh - 300px)",
          md: "calc(90dvh - 310px)",
          xl: "calc(90dvh - 350px)",
        },
      }}
    >
      {/* {researches.length > 1 && <ResearchNavigation />} */}
      {isStreaming && <StreamingIndicator streamEvents={streamEvents} />}
      {renderContent()}
    </Box>
  );
}
