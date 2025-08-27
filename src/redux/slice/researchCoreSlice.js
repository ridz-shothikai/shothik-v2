import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentResearch: null,
  researches: [], // Each research object will now contain its own sources, images, and selectedTab
  activeResearchIndex: 0,
  streamEvents: [],
  isStreaming: false,
  error: null,
  jobId: null,
  streamingMessage: "",
  isPolling: false,
  connectionStatus: "disconnected", // 'connected', 'polling', 'reconnecting', 'failed', 'timeout'
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
      state.isPolling = false;
      state.connectionStatus = "connected";
      const newResearch = {
        ...action.payload,
        sources: action.payload.sources || [],
        images: action.payload.images || [],
        selectedTab: 0,
        status: "completed",
      };

      // Check if research already exists before adding
      const existingIndex = state.researches.findIndex(
        (research) => research._id === newResearch._id
      );

      if (existingIndex >= 0) {
        // Update existing research instead of adding duplicate
        state.researches[existingIndex] = newResearch;
        state.currentResearch = newResearch;
      } else {
        // Add new research only if it doesn't exist
        state.currentResearch = newResearch;
        state.researches.push(newResearch);
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isStreaming = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetResearchCore: (state) => {
      state.currentResearch = null;
      state.researches = [];
      state.activeResearchIndex = 0;
      state.jobId = null;
      state.streamEvents = [];
      state.isStreaming = false;
      state.error = null;
      state.streamingMessage = "";
    },
    loadExistingResearches: (state, action) => {
      state.researches = action.payload.map((research) => ({
        ...research,
        sources: research.sources || [],
        images: research.images || [],
        selectedTab: research.selectedTab || 0, // Initialize selectedTab if not present
      }));
      if (state.researches.length > 0) {
        state.currentResearch = state.researches[0];
      }
    },
    setActiveResearch: (state, action) => {
      const index = action.payload;
      state.activeResearchIndex = index;
      state.currentResearch = state.researches[index];
    },
    setResearchSelectedTab: (state, action) => {
      const { researchId, selectedTab } = action.payload;
      const researchToUpdate = state.researches.find(
        (research) => research._id === researchId
      );
      if (researchToUpdate) {
        researchToUpdate.selectedTab = selectedTab;
      }
      if (state.currentResearch && state.currentResearch._id === researchId) {
        state.currentResearch.selectedTab = selectedTab;
      }
    },
    setPollingMode: (state, action) => {
      state.isPolling = action.payload;
    },
    setStreamingMode: (state, action) => {
      state.isStreaming = action.payload || false;
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload; // 'connected', 'polling', 'reconnecting', 'failed', 'timeout'
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
  resetResearchCore,
  loadExistingResearches,
  setActiveResearch,
  setResearchSelectedTab,
  setPollingMode,
  setConnectionStatus,
  setStreamingMode,
} = researchCoreSlice.actions;

export const researchCoreState = (state) => {
    if(!state || !state.researchCore) {
        console.warn("researchCore state is undefined");
        return initialState;
    }

    return state.researchCore;
}

export default researchCoreSlice.reducer;
