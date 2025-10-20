"use client";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import { AgentContextProvider } from "../../../../../components/agents/shared/AgentContextProvider";
import AgentPage from "../../../../../components/agents/AgentPage";
import ChatInput from "../../../../components/research/ui/ChatInput";
import { useSelector } from "react-redux";
import { researchCoreState } from "../../../../redux/slice/researchCoreSlice";
import { useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import ResearchPageSkeletonLoader from "../../../../components/research/ui/ResearchPageSkeletonLoader";
import { FooterCta } from "../../../../components/sheet/SheetAgentPage"; // Needs to move it to common or shared folder.
// import PresentationAgentPage from "../../../../components/presentation/PresentationAgentPage";
// import ResearchAgentPage from "../../../../components/research/ResearchAgentPage";
const PresentationAgentPage = dynamic(
  () => import("../../../../components/presentation/PresentationAgentPage"),
  {
    loading: () => <ResearchPageSkeletonLoader />,
    ssr: false,
  },
);
const SheetAgentPage = dynamic(
  () => import("../../../../components/sheet/SheetAgentPage"),
  {
    loading: () => <ResearchPageSkeletonLoader />,
    ssr: false,
  },
);
const ResearchAgentPage = dynamic(
  () => import("../../../../components/research/ResearchAgentPage"),
  {
    loading: () => <ResearchPageSkeletonLoader />,
    ssr: false,
  },
);

export default function SpecificAgentPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showModal, setShowModal] = useState(false);
  const params = useParams();
  const agentType = params.agentType;

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const researchId = searchParams.get("r_id"); // this ID is presents when we are on research simulation mode
  const isResarchSimulating = !!researchId;

  // console.log(isResarchSimulating, "is research simulating");

  const [loadingResearchHistory, setLoadingResearchHistory] = useState(true);

  const { isSimulating, simulationStatus } = useSelector(researchCoreState);

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
        return (
          <ResearchAgentPage
            loadingResearchHistory={loadingResearchHistory}
            setLoadingResearchHistory={setLoadingResearchHistory}
          />
        );
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
      <Box
        sx={{
          minHeight: "calc(100dvh - 200px)",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {renderComponent()}

        {/* chat input for research agents */}
        {agentType === "research" && !isResarchSimulating && (
          <>
            {!loadingResearchHistory && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  width: "100%",
                  px: { xs: 2, sm: 0 },
                }}
              >
                <ChatInput />
              </Box>
            )}
          </>
        )}

        {/* join the beta list footer cta for research only now */}
        {!isSimulating && simulationStatus === "completed" && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FooterCta
              isMobile={isMobile}
              showModal={showModal}
              setShowModal={setShowModal}
            />
          </Box>
        )}
      </Box>
    </AgentContextProvider>
  );
}
