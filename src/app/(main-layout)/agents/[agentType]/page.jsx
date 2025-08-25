"use client";
import React, { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import { AgentContextProvider } from "../../../../../components/agents/shared/AgentContextProvider";
import AgentPage from "../../../../../components/agents/AgentPage";
import PresentationAgentPage from "../../../../components/presentation/PresentationAgentPage";
import SheetAgentPage from "../../../../components/sheet/SheetAgentPage";
import ResearchAgentPage from "../../../../components/research/ResearchAgentPage";
import ChatInput from "../../../../components/research/ui/ChatInput";

export default function SpecificAgentPage() {
  const params = useParams();
  const agentType = params.agentType;

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Function to render the appropriate component based on agentType
  const renderComponent = () => {
    switch (agentType) {
      case "presentation":
        return (
          <PresentationAgentPage
            specificAgent={agentType}
            presentationId={id}
          />
        );
      case "sheets":
        return <SheetAgentPage specificAgent={agentType} sheetId={id} />;
      case "research":
        return <ResearchAgentPage/>;
      case "browse":
        return <div>Browse Agent Page - Coming Soon</div>;
      case "call":
        return <div>Call Agent Page - Coming Soon</div>;
      default:
        return <AgentPage />;
    }
  };

  return (
    <AgentContextProvider>
      <Box sx={{ minHeight: "calc(100dvh - 200px)", overflowY: "auto", position: "relative" }}>
        {renderComponent()}

        {/* chat input for research agents */}
        {
          agentType === "research" && 
          (
            <Box sx={{
              position: "absolute",
              bottom: 1,
              left: 0,
              width: "100%",
              px: {xs: 2, sm: 0},
            }}>
              <ChatInput/>
            </Box>
          )
        }
      </Box>
    </AgentContextProvider>
  );
}
