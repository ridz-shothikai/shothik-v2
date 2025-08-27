"use client";

import { Box } from "@mui/material";
import HeaderTitle from "./ui/HeaderTitle";
import TabsPanel from "./ui/TabPanel";
import ResearchDataArea from "./ui/ResearchDataArea";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../../hooks/useChat";
import { clearResearchChatState, researchChatState, setCurrentChat } from "../../redux/slice/researchChatSlice";
import { useSearchParams } from "next/navigation";
import {useResearchHistory} from "../../hooks/useResearchHistory";
import { useResearchStream } from "../../hooks/useResearchStream";
import { researchCoreState, resetResearchCore, setResearchSelectedTab } from "../../redux/slice/researchCoreSlice";
import StreamingIndicator from "./ui/StreamingIndicator";
import { clearResearchUiState } from "../../redux/slice/researchUiSlice";
import ResearchPageSkeletonLoader from "./ui/ResearchPageSkeletonLoader";
import { useConnectionState } from "../../hooks/useConnectionState";
import { QueueStatusService } from "../../services/queueStatusService";

export default function ResearchAgentPage({loadingResearchHistory, setLoadingResearchHistory }) {
  const scrollRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(20); // default
  const dispatch = useDispatch();
  //   const { headerHeight } = useSelector((state) => state.ui);
  const { currentChatId, createNewChat } = useChat();
  const { loadChatResearches } = useResearchHistory();
  const { startResearch } = useResearchStream();

  const researchChat = useSelector(researchChatState);
  const researchCore = useSelector(researchCoreState);

  const searchParams = useSearchParams();
  const chatIdFromUrl = searchParams.get("id");

  const { checkAndRecoverConnection, manualReconnect } = useResearchStream();
  const { loadChatResearchesWithQueueCheck } = useResearchHistory();
  const connectionState = useConnectionState();

  console.log(researchCore, "research from ResearchAgentPage");

  // console.log(loadingResearchHistory, "loadingResearchHistory");  

  const initialQuery = sessionStorage.getItem("activeResearchChatId") || "";

  // useEffect(() => {
  //   // Create initial chat if none exists
  //   if (!currentChatId) {
  //     createNewChat(initialQuery);
  //   }
  // }, [currentChatId, createNewChat]);

  useEffect(() => {
    if (!researchChat?.currentChatId) {
      sessionStorage.setItem("activeResearchChatId", chatIdFromUrl);
      dispatch(setCurrentChat(chatIdFromUrl));
    }
    return () => {
      // clean up effects
      sessionStorage.removeItem("activeResearchChatId");
      dispatch(clearResearchChatState());
      dispatch(resetResearchCore());
      dispatch(clearResearchUiState());
    };
  }, [chatIdFromUrl]);

  useEffect(() => {
    try {
      const loadResearches = async () => {
        if (currentChatId) {
          // First check for interrupted connections
          await checkAndRecoverConnection();
          
          // Load existing researches and check queue status
          const { researches, hasActiveQueue } = await loadChatResearchesWithQueueCheck();
  
          // Only start new research if:
          // 1. No existing researches AND
          // 2. No active/waiting queue AND  
          // 3. We have an initial query AND
          // 4. We're not currently streaming or polling
          if (
            researches.length === 0 &&
            !hasActiveQueue &&
            !researchCore?.isStreaming &&
            !researchCore?.isPolling
          ) {
            const initialQuery = sessionStorage.getItem(
              "initialResearchPrompt"
            );
            if (initialQuery) {
              // Small delay to ensure all states are properly initialized
              setTimeout(() => {
                startResearch(initialQuery, {
                  effort: "medium",
                  model: "gemini-2.5-pro",
                });
              }, 500);
            }
          }
  
          setLoadingResearchHistory(false);
        }
      };
  
      loadResearches();
    } catch (error) {
      console.error("Error loading research history:", error);
      setLoadingResearchHistory(false);
    }
  }, [currentChatId, checkAndRecoverConnection, loadChatResearchesWithQueueCheck, startResearch, researchCore?.isStreaming, researchCore?.isPolling]);

  useEffect(() => {
    if (scrollRef.current && researchCore?.isStreaming) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [researchCore?.isStreaming, researchCore?.researches?.length, researchCore?.streamEvents]);

  if (loadingResearchHistory) {
    return <ResearchPageSkeletonLoader />;
  }

    return (
      <Box
        ref={scrollRef}
        sx={{
          maxWidth: { xs: "1000px" },
          minHeight: {
            xs: "calc(100dvh - 180px)",
            sm: "calc(100dvh - 200px)",
            md: "calc(100dvh - 230px)",
            lg: "calc(100dvh - 250px)",
            xl: "calc(100dvh - 270px)",
          },
          maxHeight: {
            xs: "calc(100dvh - 180px)",
            sm: "calc(100dvh - 200px)",
            md: "calc(100dvh - 230px)",
            lg: "calc(100dvh - 250px)",
            xl: "calc(100dvh - 270px)",
          },
          marginInline: "auto",
          position: "relative",
          backgroundColor: "#F4F6F8",
          overflowY: "auto",
          px: { xs: 2, sm: 0 },
          marginBottom: {
            xs: "50px",
            sm: "135px",
            md: "160px",
            lg: "180px",
            xl: "200px",
          },
        }}
      >
        {/* research data */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {researchCore?.researches.length > 0 &&
            researchCore?.researches?.map((research) => (
              <Box key={research._id}>
                <Box
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: "#F4F6F8",
                  }}
                >
                  <HeaderTitle
                    headerHeight={headerHeight}
                    setHeaderHeight={setHeaderHeight}
                    query={research.query}
                  />
                  <TabsPanel
                    selectedTab={research.selectedTab}
                    sources={research.sources}
                    images={research.images}
                    onTabChange={(newValue) =>
                      dispatch(
                        setResearchSelectedTab({
                          researchId: research._id,
                          selectedTab: newValue,
                        })
                      )
                    }
                  />
                </Box>

                {/* data area */}
                <ResearchDataArea
                  selectedTab={research.selectedTab}
                  research={research}
                />
              </Box>
            ))}
        </Box>

        {/* when streaming */}
        {(researchCore?.isStreaming || researchCore?.isPolling) && (
          <StreamingIndicator
            streamEvents={researchCore?.streamEvents}
            isPolling={researchCore?.isPolling}
            connectionStatus={researchCore?.connectionStatus}
            onRetry={manualReconnect}
          />
        )}
      </Box>
    );
};
