import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logs: [],
  slides: [],
  currentPhase: "planning",
  completedPhases: [],
  presentationBlueprint: null,
  status: "idle",
  title: "Generating...",
  totalSlides: 0,
};

const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    setPresentationState(state, action) {
      const { logs, slides, status, title, totalSlides } = action.payload;
      state.logs = logs || state.logs;
      state.slides = slides || state.slides;
      state.status = status || state.status;
      state.title = title || state.title;
      state.totalSlides = totalSlides || state.totalSlides;

      const completed = new Set(state.completedPhases);
      if (logs) {
        logs.forEach((log) => {
          if (
            [
              "presentation_spec_extractor_agent",
              "vibe_estimator_agent",
              "planning_agent",
            ].includes(log.agent_name)
          ) {
            completed.add("planning");
          }
          if (
            [
              "keyword_research_agent",
              "search_query",
              "content_synthesizer_agent",
            ].includes(log.agent_name)
          ) {
            completed.add("planning");
            completed.add("preferences");
            completed.add("content");
          }
          if (log.agent_name === "slide_generator_agent") {
            completed.add("planning");
            completed.add("preferences");
            completed.add("content");
            completed.add("design");
          }
          if (log.parsed_output?.includes?.("The presentation is complete")) {
            [
              "planning",
              "preferences",
              "content",
              "design",
              "validation",
            ].forEach((p) => completed.add(p));
          }
        });
        state.completedPhases = Array.from(completed);
        state.currentPhase = completed.has("validation")
          ? "completed"
          : Array.from(completed).pop() || "planning";
      }

      if (logs) {
        const planningLog = logs.find(
          (log) => log.agent_name === "planning_agent" && log.parsed_output,
        );
        if (planningLog) {
          try {
            const parsed =
              typeof planningLog.parsed_output === "string"
                ? JSON.parse(planningLog.parsed_output)
                : planningLog.parsed_output;
            state.presentationBlueprint = {
              slideCount: parsed.slides.length,
              duration: "N/A",
              structure: `Generated a ${parsed.slides.length}-slide plan.`,
            };
          } catch (e) {
            console.error(
              "Could not parse blueprint from planning_agent log",
              e,
            );
          }
        }
      }
    },
    resetPresentationState(state) {
      // Reset to initial state
      Object.assign(state, initialState);
    },
  },
});

export const { setPresentationState, resetPresentationState } =
  presentationSlice.actions;

// Updated selector with fallback
export const selectPresentation = (state) => {
  if (!state || !state.presentation) {
    console.warn(
      "Presentation state not found in Redux store, returning initial state",
    );
    return initialState;
  }
  return state.presentation;
};

export default presentationSlice.reducer;
