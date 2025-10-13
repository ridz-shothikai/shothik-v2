import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  text: "",
  language: "English (US)",
  histories: [],
  issues: [],
  recommendations: [],
  selectedHistory: null,
  selectedIssue: null,
  isCheckLoading: false,
  isHistoryLoading: false,
};

const paraphraseHistorySlice = createSlice({
  name: "grammar_checker",
  initialState,
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setHistories: (state, action) => {
      state.histories = action.payload || [];
    },
    setIssues: (state, action) => {
      state.issues = action.payload;
    },
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },
    setSelectedHistory: (state, action) => {
      state.selectedHistory = action.payload;
    },
    setSelectedIssue: (state, action) => {
      state.selectedIssue = action.payload;
    },
    setIsCheckLoading: (state, action) => {
      state.isCheckLoading = action.payload;
    },
    setIsHistoryLoading: (state, action) => {
      state.isHistoryLoading = action.payload;
    },
  },
});

export const {
  setText,
  setLanguage,
  setIssues,
  setRecommendations,
  setHistories,
  setIsCheckLoading,
  setIsHistoryLoading,
} = paraphraseHistorySlice.actions;
export default paraphraseHistorySlice.reducer;
