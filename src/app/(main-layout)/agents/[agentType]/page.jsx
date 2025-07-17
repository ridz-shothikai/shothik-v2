"use client";
import React, { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import { AgentContextProvider } from "../../../../../components/agents/shared/AgentContextProvider";
import AgentPage from "../../../../../components/agents/AgentPage";
import PresentationAgentPage from "../../../../components/presentation/PresentationAgentPage";
import SheetAgentPage from "../../../../components/sheet/SheetAgentPage";

export default function SpecificAgentPage() {
  const params = useParams();
  const agentType = params.agentType;

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Function to render the appropriate component based on agentType
  const renderComponent = () => {
    switch (agentType) {
      case "slides":
        return (
          <PresentationAgentPage
            specificAgent={agentType}
            presentationId={id}
          />
        );
      case "sheets":
        return <SheetAgentPage specificAgent={agentType} sheetId={id} />;
      case "download":
        return <div>Download Agent Page - Coming Soon</div>;
      case "chat":
        return <div>Chat Agent Page - Coming Soon</div>;
      case "call":
        return <div>Call Agent Page - Coming Soon</div>;
      default:
        return <AgentPage />;
    }
  };

  return (
    <AgentContextProvider>
      <Box sx={{ minHeight: "calc(100dvh - 200px)", overflowY: "hidden" }}>
        {renderComponent()}
      </Box>
    </AgentContextProvider>
  );
}
