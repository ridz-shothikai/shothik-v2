"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {loadExistingResearches} from "../redux/slice/researchCoreSlice"

export const useResearchHistory = () => {
  const dispatch = useDispatch();
  const { currentChatId } = useSelector((state) => state.researchChat);

  const loadChatResearches = useCallback(async () => {
    if (!currentChatId) return;

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
      dispatch(loadExistingResearches(researches));
      return researches;
    } catch (error) {
      console.error("Failed to load researches:", error);
      return [];
    }
  }, [currentChatId, dispatch]);

  return { loadChatResearches };
};
