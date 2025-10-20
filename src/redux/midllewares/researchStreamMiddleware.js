import {
  addStreamEvent,
  setPollingMode,
  setConnectionStatus,
  clearStreamEvents,
} from "../slice/researchCoreSlice";

// Action types that should trigger stream event validation
const streamEventActions = [addStreamEvent];

// Debounce utility
const createDebouncer = (delay) => {
  const timeouts = new Map();

  return (key, fn) => {
    if (timeouts.has(key)) {
      clearTimeout(timeouts.get(key));
    }

    timeouts.set(
      key,
      setTimeout(() => {
        fn();
        timeouts.delete(key);
      }, delay),
    );
  };
};

// Create middleware instance
export const researchStreamMiddleware = (store) => {
  const debouncer = createDebouncer(100); // 100ms debounce
  const eventHistory = new Set();
  const maxHistorySize = 1000;

  // Cleanup old event history periodically
  setInterval(() => {
    if (eventHistory.size > maxHistorySize) {
      const entries = Array.from(eventHistory);
      eventHistory.clear();
      // Keep only recent half
      entries
        .slice(-Math.floor(maxHistorySize / 2))
        .forEach((entry) => eventHistory.add(entry));
    }
  }, 60000); // Cleanup every minute

  return (next) => (action) => {
    const state = store.getState();
    const researchCore = state.researchCore;

    // Pre-dispatch validation
    if (action.type === addStreamEvent.type) {
      const event = action.payload;

      // Create unique event identifier
      const eventId = `${event.step || "unknown"}-${
        event.message || ""
      }-${Date.now()}`;

      // Check for duplicate events
      if (eventHistory.has(eventId)) {
        console.warn("[Middleware] Duplicate event blocked:", eventId);
        return state; // Block duplicate
      }

      // Add to history
      eventHistory.add(eventId);

      // Debounce rapid successive events
      const debounceKey = `${event.step}-${researchCore.jobId}`;
      debouncer(debounceKey, () => {
        // This ensures we only process the latest event in a burst
        if (store.getState().researchCore.jobId === researchCore.jobId) {
          next(action);
        }
      });

      return state; // Don't proceed immediately, let debouncer handle it
    }

    // Handle other stream management actions
    if (action.type === setPollingMode.type && !action.payload) {
      // When stopping polling, clear event history
      eventHistory.clear();
    }

    // Proceed with normal action processing
    const result = next(action);

    // Post-dispatch side effects
    const newState = store.getState();
    const newResearchCore = newState.researchCore;

    // Monitor for potential infinite loops
    if (newResearchCore.streamEvents.length > 50) {
      console.warn(
        "[Middleware] Large number of stream events detected:",
        newResearchCore.streamEvents.length,
      );

      // Auto-clear old events if too many accumulate
      if (newResearchCore.streamEvents.length > 100) {
        store.dispatch(clearStreamEvents());
      }
    }

    return result;
  };
};

// Error boundary middleware for research actions
export const researchErrorMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error("[ResearchError] Action failed:", action.type, error);

    // Dispatch error recovery action
    if (action.type.startsWith("researchCore/")) {
      store.dispatch(setConnectionStatus("failed"));
      store.dispatch(clearStreamEvents());
    }

    // Re-throw for dev tools
    if (process.env.NODE_ENV === "development") {
      throw error;
    }

    return store.getState();
  }
};

// Performance monitoring middleware
export const researchPerformanceMiddleware = (store) => (next) => (action) => {
  const start = performance.now();

  const result = next(action);

  const duration = performance.now() - start;

  // Log slow actions
  if (duration > 100) {
    // >100ms is considered slow
    console.warn(
      `[Performance] Slow action: ${action.type} took ${duration.toFixed(2)}ms`,
    );
  }

  // Track research-specific metrics
  if (action.type.startsWith("researchCore/")) {
    const state = store.getState().researchCore;

    // Monitor memory usage
    if (state.streamEvents.length > 0) {
      const eventMemory = JSON.stringify(state.streamEvents).length;
      if (eventMemory > 1024 * 100) {
        // >100KB
        console.warn(
          `[Performance] Large stream events size: ${eventMemory} bytes`,
        );
      }
    }
  }

  return result;
};
