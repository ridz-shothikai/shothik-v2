import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentResearch: null,
  researches: [],
  activeResearchIndex: 0,
  streamEvents: [],
  isStreaming: false,
  error: null,
  jobId: null,
  sources: [],
  images: [],
  streamingMessage: "",
};

export const researchCoreSlice = createSlice({
  name: "researchCore",
  initialState,
  reducers: {
    startStreaming: (state, action) => {
      state.isStreaming = true;
      state.jobId = action.payload.jobId;
      state.streamEvents = [];
      state.error = null;
      state.streamingMessage = "";
    },
    addStreamEvent: (state, action) => {
      state.streamEvents.push(action.payload);
    },
    updateStreamingMessage: (state, action) => {
      state.streamingMessage += action.payload;
    },
    finishResearch: (state, action) => {
      state.isStreaming = false;
      state.currentResearch = action.payload;
      state.sources = action.payload.sources || [];
      state.images = action.payload.images || [];
      state.researches.unshift(action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isStreaming = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetResearch: (state) => {
      state.currentResearch = null;
      state.streamEvents = [];
      state.isStreaming = false;
      state.error = null;
      state.streamingMessage = "";
    },
    loadExistingResearches: (state, action) => {
      state.researches = action.payload;
      if (action.payload.length > 0) {
        state.currentResearch = action.payload[0];
        state.sources = action.payload[0].sources || [];
        state.images = action.payload[0].images || [];
      }
    },
    setActiveResearch: (state, action) => {
      const index = action.payload;
      state.activeResearchIndex = index;
      state.currentResearch = state.researches[index];
      state.sources = state.researches[index]?.sources || [];
      state.images = state.researches[index]?.images || [];
    },
  },
});

export const {
  startStreaming,
  addStreamEvent,
  updateStreamingMessage,
  finishResearch,
  setError,
  clearError,
  resetResearch,
  loadExistingResearches,
  setActiveResearch,
} = researchCoreSlice.actions;

export const researchCoreState = (state) => {
    if(!state || !state.researchCore) {
        console.warn("researchCore state is undefined");
        return initialState;
    }

    return state.researchCore;
}

export default researchCoreSlice.reducer;
