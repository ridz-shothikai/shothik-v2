"use client";

import { Box } from "@mui/material";
import HeaderTitle from "./ui/HeaderTitle";
import TabsPanel from "./ui/TabPanel";
import ResearchDataArea from "./ui/ResearchDataArea";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../../hooks/useChat";
import { clearResearchChatState, researchChatState, setCurrentChat } from "../../redux/slice/researchChatSlice";
import { useSearchParams } from "next/navigation";
import {useResearchHistory} from "../../hooks/useResearchHistory";
import { useResearchStream } from "../../hooks/useResearchStream";

export default function ResearchAgentPage() {
  const [headerHeight, setHeaderHeight] = useState(20); // default
  const dispatch = useDispatch();
  //   const { headerHeight } = useSelector((state) => state.ui);
  const { currentChatId, createNewChat } = useChat();
  const {loadChatResearches} = useResearchHistory();
  const {startResearch} = useResearchStream();

  const research = useSelector(researchChatState);
  const searchParams = useSearchParams();
  const chatIdFromUrl = searchParams.get("id");

//   console.log(research, "research from ResearchAgentPage");

  const initialQuery = sessionStorage.getItem("activeResearchChatId") || "";

  useEffect(() => {
    // Create initial chat if none exists
    if (!currentChatId) {
      createNewChat(initialQuery);
    }
  }, [currentChatId, createNewChat]);

  useEffect(() => {
    if (!research?.currentChatId) {
      sessionStorage.setItem("activeResearchChatId", chatIdFromUrl);
      dispatch(setCurrentChat(chatIdFromUrl));
    }
    return () => {
      // clean up effects
      sessionStorage.removeItem("activeResearchChatId");
      dispatch(clearResearchChatState());
    };
  }, [chatIdFromUrl]);

  useEffect(() => {
    const loadResearches = async () => {
      if (currentChatId) {
        const researches = await loadChatResearches();

        // If no existing researches and we have initialQuery, create new research
        if (researches.length === 0) {
          const initialQuery = sessionStorage.getItem("initialResearchPrompt");
          if (initialQuery) {
            // Auto-start research with initial query
            startResearch(initialQuery, {
              effort: "medium",
              model: "gemini-2.5-pro",
            });
          }
        }
      }
    };

    loadResearches();
  }, [currentChatId]);

  return (
    <Box
      sx={{
        maxWidth: { xs: "1000px" },
        minHeight: {
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
        marginBottom: {xs: "50px", sm: "135px", md: "160px", lg: "180px", xl: "200px" },
      }}
    >
      {/* <Box
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "#F4F6F8",
          width: "100%",
        }}
      > */}
      <HeaderTitle
        headerHeight={headerHeight}
        setHeaderHeight={setHeaderHeight}
      />
      <TabsPanel />
      {/* </Box> */}

      {/* data area */}
      <ResearchDataArea headerHeight={headerHeight} />
    </Box>
  );
}
