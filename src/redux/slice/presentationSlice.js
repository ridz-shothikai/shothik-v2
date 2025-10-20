// File: src/redux/slice/presentationSlice.js
// Updated to handle structured parsed data

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logs: [], // Array of structured log objects
  slides: [], // Array of slide objects with thinking + html_content
  status: "idle", // idle, checking, streaming, completed, failed, error
  presentationStatus: null, // queued, processing, completed, failed
  title: "Generating...",
  totalSlides: 0,
  slideCurrentId: null,
  error: null,
  progress: null,

  // Derived state for UI convenience
  currentPhase: "planning",
  completedPhases: [],
};

const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    setPresentationState(state, action) {
      const {
        logs,
        slides,
        status,
        presentationStatus,
        title,
        totalSlides,
        error,
        progress,
        _replaceArrays,
      } = action.payload;

      console.log("[Redux] setPresentationState called with:", {
        logsCount: logs?.length,
        slidesCount: slides?.length,
        _replaceArrays,
        status,
        title,
      });

      // Handle array replacement (for history loading)
      if (_replaceArrays) {
        // REPLACE mode: Overwrite existing data
        if (logs !== undefined) {
          state.logs = logs;
          console.log("[Redux] REPLACED logs, new count:", state.logs.length);
        }
        if (slides !== undefined) {
          state.slides = slides;
          console.log(
            "[Redux] REPLACED slides, new count:",
            state.slides.length,
          );
        }
      } else {
        // APPEND mode: Add new data without duplicates
        if (logs && logs.length > 0) {
          const existingLogIds = new Set(state.logs.map((log) => log.id));
          const newLogs = logs.filter((log) => !existingLogIds.has(log.id));
          state.logs = [...state.logs, ...newLogs];
          console.log(
            "[Redux] APPENDED logs, added:",
            newLogs.length,
            "total:",
            state.logs.length,
          );
        }

        // Append new slides (ensuring no duplicates by slideNumber)
        if (slides && slides.length > 0) {
          const existingSlideNumbers = new Set(
            state.slides.map((s) => s.slideNumber),
          );
          const newSlides = slides.filter(
            (s) => !existingSlideNumbers.has(s.slideNumber),
          );

          // Merge new slides, maintaining order by slideNumber
          const allSlides = [...state.slides, ...newSlides];
          state.slides = allSlides.sort(
            (a, b) => a.slideNumber - b.slideNumber,
          );
          console.log(
            "[Redux] APPENDED slides, added:",
            newSlides.length,
            "total:",
            state.slides.length,
          );
        }
      }

      // Update scalar values
      if (status !== undefined) {
        state.status = status;
        console.log("[Redux] Status updated to:", status);
      }
      if (presentationStatus !== undefined) {
        state.presentationStatus = presentationStatus;
        console.log(
          "[Redux] Presentation status updated to:",
          presentationStatus,
        );
      }
      if (title !== undefined) {
        state.title = title;
        console.log("[Redux] Title updated to:", title);
      }
      if (totalSlides !== undefined) {
        state.totalSlides = totalSlides;
        console.log("[Redux] Total slides updated to:", totalSlides);
      }
      if (error !== undefined) state.error = error;
      if (progress !== undefined) state.progress = progress;

      // Update derived state based on logs
      state.currentPhase = deriveCurrentPhase(state.logs, state.slides);
      state.completedPhases = deriveCompletedPhases(state.logs, state.slides);

      console.log("[Redux] Final state:", {
        logs: state.logs.length,
        slides: state.slides.length,
        currentPhase: state.currentPhase,
        completedPhases: state.completedPhases,
      });
    },

    resetPresentationState(state) {
      Object.assign(state, initialState);
    },

    setCurrentSlideId(state, action) {
      const { presentationId } = action.payload;
      state.slideCurrentId = presentationId || state.slideCurrentId;
    },
  },
});

/**
 * Derive current phase based on latest logs and slides
 */
function deriveCurrentPhase(logs, slides) {
  if (!logs || logs.length === 0) {
    return "planning";
  }

  const latestLog = logs[logs.length - 1];

  // Check if we have any slides
  if (slides && slides.length > 0) {
    return "generation";
  }

  // Check phase from latest log
  if (latestLog.phase === "research") {
    return "research";
  }

  if (latestLog.phase === "planning") {
    return "planning";
  }

  if (latestLog.phase === "generation") {
    return "generation";
  }

  return "planning";
}

/**
 * Derive completed phases based on logs and slides
 */
function deriveCompletedPhases(logs, slides) {
  const completed = new Set();

  if (!logs) return [];

  // Check for planning phase
  const hasPlanningLog = logs.some(
    (log) =>
      log.agent === "vibe_estimator_agent" ||
      log.agent === "lightweight_planning_agent",
  );
  if (hasPlanningLog) {
    completed.add("planning");
  }

  // Check for research phase
  const hasResearchLog = logs.some(
    (log) =>
      log.agent === "KeywordResearchAgent" ||
      log.agent?.startsWith("browser_worker_"),
  );
  if (hasResearchLog) {
    completed.add("research");
  }

  // Check for generation phase
  if (slides && slides.length > 0) {
    completed.add("generation");
  }

  // If all slides are generated, mark as complete
  const allSlidesGenerated = logs.some((log) =>
    log.content?.message?.includes("Presentation complete"),
  );
  if (allSlidesGenerated) {
    completed.add("completed");
  }

  return Array.from(completed);
}

export const {
  setPresentationState,
  resetPresentationState,
  setCurrentSlideId,
} = presentationSlice.actions;

export const selectPresentation = (state) => {
  if (!state || !state.presentation) {
    console.warn(
      "Presentation state not found in Redux store, returning initial state",
    );
    return initialState;
  }
  return state.presentation;
};

// Selectors for specific data
export const selectLogs = (state) => selectPresentation(state).logs;
export const selectSlides = (state) => selectPresentation(state).slides;
export const selectPresentationStatus = (state) =>
  selectPresentation(state).status;
export const selectTitle = (state) => selectPresentation(state).title;
export const selectTotalSlides = (state) =>
  selectPresentation(state).totalSlides;
export const selectCurrentPhase = (state) =>
  selectPresentation(state).currentPhase;
export const selectCompletedPhases = (state) =>
  selectPresentation(state).completedPhases;

// Selector for logs by phase
export const selectLogsByPhase = (phase) => (state) => {
  const logs = selectLogs(state);
  return logs.filter((log) => log.phase === phase);
};

// Selector for slide by number
export const selectSlideByNumber = (slideNumber) => (state) => {
  const slides = selectSlides(state);
  return slides.find((slide) => slide.slideNumber === slideNumber);
};

export default presentationSlice.reducer;
