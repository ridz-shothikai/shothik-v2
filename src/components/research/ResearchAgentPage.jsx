"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
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
import { useResearchSimulation } from "../../hooks/useResearchSimulation";
import { researchCoreState, resetResearchCore, setIsSimulating, setResearchSelectedTab, setSimulationStatus } from "../../redux/slice/researchCoreSlice";
import { clearResearchUiState } from "../../redux/slice/researchUiSlice";
import ResearchPageSkeletonLoader from "./ui/ResearchPageSkeletonLoader";
import ResearchStreamingShell from "./ui/ResearchStreamingShell";

export default function ResearchAgentPage({loadingResearchHistory, setLoadingResearchHistory }) {
  const theme = useTheme();
  const scrollRef = useRef(null);
  const [isInitializingResearch, setIsInitializingResearch] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(20); // default
  const [isSimulationCompleted, setIsSimulationCompleted] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  //   const { headerHeight } = useSelector((state) => state.ui);
  const { currentChatId } = useChat();
  const { startResearch } = useResearchStream();
  const { startSimulationResearch } = useResearchSimulation();

  const researchChat = useSelector(researchChatState);
  const researchCore = useSelector(researchCoreState);

  const searchParams = useSearchParams();
  const chatIdFromUrl = searchParams.get("id");

  const researchId = searchParams.get("r_id");
  const isSimulationMode = Boolean(researchId);
  const actualChatId = researchId || chatIdFromUrl;

  const { checkAndRecoverConnection, manualReconnect } = useResearchStream();
  const { loadChatResearchesWithQueueCheck } = useResearchHistory();

  const researchConfig = JSON.parse(sessionStorage.getItem("r-config"));

  console.log(researchCore, "research from ResearchAgentPage");

  // console.log(loadingResearchHistory, "loadingResearchHistory");  

  // const initialQuery = sessionStorage.getItem("activeResearchChatId") || "";
  const initialUserPrompt = sessionStorage.getItem("initialResearchPrompt");

  // useEffect(() => {
  //   // Create initial chat if none exists
  //   if (!currentChatId) {
  //     createNewChat(initialQuery);
  //   }
  // }, [currentChatId, createNewChat]);

  useEffect(() => {
    if (!researchChat?.currentChatId) {
      sessionStorage.setItem("activeResearchChatId", actualChatId);
      dispatch(setCurrentChat(actualChatId));
    }
    return () => {
      // clean up effects
      if(!isSimulationMode) {
        sessionStorage.removeItem("activeResearchChatId");
        sessionStorage.removeItem("initialResearchPrompt");
        sessionStorage.removeItem("r-config");
      }
      dispatch(clearResearchChatState());
      dispatch(resetResearchCore());
      dispatch(clearResearchUiState());
    };
  }, [actualChatId, isSimulationMode]);

  useEffect(() => {
    try {
      const loadResearches = async () => {
        if (currentChatId) {
          // For simulation mode, skip recovery and queue checks
          if (isSimulationMode) {
            setIsInitializingResearch(true);
            dispatch(setIsSimulating(true));
            dispatch(setSimulationStatus("ongoing"));

            // Start simulation immediately
            setTimeout(() => {
              startSimulationResearch(researchId, setIsSimulationCompleted);
              setIsInitializingResearch(false);
            }, 500);

            setLoadingResearchHistory(false);
            return;
          }

          // First check for interrupted connections
          await checkAndRecoverConnection();

          // Load existing researches and check queue status
          const { researches, hasActiveQueue } =
            await loadChatResearchesWithQueueCheck();

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
              setIsInitializingResearch(true); // still initializing
              // Small delay to ensure all states are properly initialized
              setTimeout(() => {
                startResearch(initialQuery, {
                  effort:
                    researchConfig?.topK === 2
                      ? "low"
                      : researchConfig?.topK === 6
                      ? "medium"
                      : "high",
                  model:
                    researchConfig?.model === "basic"
                      ? "gemini-2.0-flash"
                      : "gemini-2.5-pro",
                });
                setIsInitializingResearch(false); // after call triggered
              }, 500);
            } else {
              setIsInitializingResearch(false);
            }
          } else {
            setIsInitializingResearch(false);
          }

          setLoadingResearchHistory(false);
        }
      };

      loadResearches();
    } catch (error) {
      console.error("Error loading research history:", error);
      setLoadingResearchHistory(false);
      setIsInitializingResearch(false);
    }
  }, [currentChatId, isSimulationMode, researchId]);

  useEffect(() => {
    if (scrollRef.current && researchCore?.isStreaming) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [researchCore?.isStreaming, researchCore?.researches?.length, researchCore?.streamEvents]);

  if (loadingResearchHistory || isInitializingResearch) {
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
            xs: isSimulationMode
              ? "calc(100dvh - 130px)"
              : "calc(100dvh - 155px)",
            sm: isSimulationMode
              ? "calc(100dvh - 100px)"
              : "calc(100dvh - 170px)",
            md: isSimulationMode
              ? "calc(100dvh - 130px)"
              : "calc(100dvh - 200px)",
            lg: isSimulationMode
              ? "calc(100dvh - 150px)"
              : "calc(100dvh - 220px)",
            xl: isSimulationMode
              ? "calc(100dvh - 170px)"
              : "calc(100dvh - 220px)",
          },
          marginInline: "auto",
          position: "relative",
          backgroundColor: "#F4F6F8",
          overflowY: "auto",
          px: { xs: 2, sm: 0 },
          marginBottom: {
            xs: isSimulationMode ? "0px" : "20px",
            sm: isSimulationMode ? "35px" : "105px",
            md: isSimulationMode ? "60px" : "130px",
            lg: isSimulationMode ? "80px" : "150px",
            xl: isSimulationMode ? "100px" : "150px",
          },
          bgcolor: theme.palette.mode === "dark" && "#161C24",
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
            researchCore?.researches?.map((research, idx) => (
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
                    researchItem={research}
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
                  isLastData={idx === researchCore?.researches?.length - 1}
                />
              </Box>
            ))}
        </Box>

        {/* when streaming */}
        {/* {(researchCore?.isStreaming || researchCore?.isPolling) && (
          <StreamingIndicator
            streamEvents={researchCore?.streamEvents}
            isPolling={researchCore?.isPolling}
            connectionStatus={researchCore?.connectionStatus}
            onRetry={manualReconnect}
          />
        )} */}

        {(researchCore?.isStreaming || researchCore?.isPolling) && (
          // <ResearchProcessLogs
          //   streamEvents={researchCore?.streamEvents}
          //   researches={researchCore?.researches}
          //   isStreaming={researchCore?.isStreaming || researchCore?.isPolling}
          // />
          <ResearchStreamingShell
            streamEvents={researchCore?.streamEvents}
            isStreaming={researchCore?.isStreaming || researchCore?.isPolling}
            userQuery={initialUserPrompt}
          />
        )}
      </Box>
    );
};
