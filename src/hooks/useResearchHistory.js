"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadExistingResearches } from "../redux/slice/researchCoreSlice";
import { QueueStatusService } from "../services/queueStatusService";

const isResearchCompleted = (research) => {
  // Check multiple indicators of completion
  const hasValidResult =
    research.result && research.result !== "Research in progress...";

  return hasValidResult;
};

export const useResearchHistory = () => {
  const dispatch = useDispatch();
  const { currentChatId } = useSelector((state) => state.researchChat);

  const loadChatResearches = useCallback(async () => {
    if (!currentChatId) return [];

    try {
      const response = await fetch(
        `http://163.172.172.38:3040/api/research/get_chat_researches/${currentChatId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const researches = await response.json();

      // Filter out incomplete researches (those without result)
      const completeResearches = researches?.filter(isResearchCompleted) || [];

      dispatch(loadExistingResearches(completeResearches));
      return completeResearches;
    } catch (error) {
      console.error("Failed to load researches:", error);
      return [];
    }
  }, [currentChatId, dispatch]);

  const loadChatResearchesWithQueueCheck = useCallback(async () => {
    const researches = await loadChatResearches();

    // Also check queue status for comprehensive state
    const queueStats = await QueueStatusService.getQueueStats();

    return {
      researches,
      hasActiveQueue:
        queueStats.research.active > 0 || queueStats.research.waiting > 0,
      queueStats,
    };
  }, [loadChatResearches]);

  return {
    loadChatResearches,
    loadChatResearchesWithQueueCheck,
  };
};
