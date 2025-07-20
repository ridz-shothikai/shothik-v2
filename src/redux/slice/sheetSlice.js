import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logs: [],
  sheet: null, // Current active sheet data
  status: "idle", // idle, generating, completed, error, cancelled
  title: "Ready to Generate",
  // New save points structure
  savePoints: [], // Array of save points with chat history
  activeSavePointId: null, // Currently selected save point
  currentChatId: null, // Current chat ID
};

const sheetSlice = createSlice({
  name: "sheet",
  initialState,
  reducers: {
    // Existing reducers (keep for backward compatibility)
    setSheetState(state, action) {
      const { logs, sheet, status, title } = action.payload;
      if (logs !== undefined) state.logs = logs;
      if (sheet !== undefined) state.sheet = sheet;
      if (status !== undefined) state.status = status;
      if (title !== undefined) state.title = title;
    },

    setSheetData(state, action) {
      state.sheet = action.payload;
      if (action.payload === null) {
        state.status = "idle";
      } else if (Array.isArray(action.payload) && action.payload.length > 0) {
        state.status = "completed";
      }
    },

    setSheetStatus(state, action) {
      state.status = action.payload;
      if (action.payload === "generating") {
        state.sheet = null;
      }
    },

    setSheetTitle(state, action) {
      state.title = action.payload;
    },

    // New save point actions
    initializeChatHistory(state, action) {
      const { chatId, chatHistory } = action.payload;
      state.currentChatId = chatId;
      
      // Convert chat history to save points
      const savePoints = [];
      let currentSavePoint = null;

      chatHistory.forEach((message, index) => {
        if (message.isUser) {
          // Start new save point for each user message
          if (currentSavePoint) {
            savePoints.push(currentSavePoint);
          }
          
          currentSavePoint = {
            id: `savepoint-${message.id}`,
            title: message.message.substring(0, 50) + "...",
            prompt: message.message,
            timestamp: message.timestamp,
            generations: [],
            activeGenerationId: null,
          };
        } else if (currentSavePoint && !message.isUser) {
          // Add AI response as generation
          const generation = {
            id: `gen-${message.id}`,
            title: `Generation ${currentSavePoint.generations.length + 1}`,
            timestamp: message.timestamp,
            sheetData: message.sheetData || null, // Extract sheet data if available
            status: message.type === "error" ? "error" : "completed",
            message: message.message,
          };
          
          currentSavePoint.generations.push(generation);
          
          // Set first generation as active
          if (!currentSavePoint.activeGenerationId) {
            currentSavePoint.activeGenerationId = generation.id;
          }
        }
      });

      // Add the last save point
      if (currentSavePoint) {
        savePoints.push(currentSavePoint);
      }

      state.savePoints = savePoints;
      
      // Set the last save point as active if it exists
      if (savePoints.length > 0) {
        const lastSavePoint = savePoints[savePoints.length - 1];
        state.activeSavePointId = lastSavePoint.id;
        
        // Set sheet data from active generation
        const activeGeneration = lastSavePoint.generations.find(
          gen => gen.id === lastSavePoint.activeGenerationId
        );
        if (activeGeneration && activeGeneration.sheetData) {
          state.sheet = activeGeneration.sheetData;
          state.status = activeGeneration.status;
          state.title = lastSavePoint.title;
        }
      }
    },

    addNewSavePoint(state, action) {
      const { prompt, timestamp } = action.payload;
      const savePoint = {
        id: `savepoint-${Date.now()}`,
        title: prompt.substring(0, 50) + "...",
        prompt,
        timestamp: timestamp || new Date().toISOString(),
        generations: [],
        activeGenerationId: null,
      };
      
      state.savePoints.push(savePoint);
      state.activeSavePointId = savePoint.id;
    },

    addGenerationToSavePoint(state, action) {
      const { savePointId, sheetData, status = "completed", message } = action.payload;
      
      const savePoint = state.savePoints.find(sp => sp.id === savePointId);
      if (!savePoint) return;

      const generation = {
        id: `gen-${Date.now()}-${Math.random()}`,
        title: `Generation ${savePoint.generations.length + 1}`,
        timestamp: new Date().toISOString(),
        sheetData,
        status,
        message,
      };

      savePoint.generations.push(generation);
      
      // Set as active generation
      savePoint.activeGenerationId = generation.id;
      
      // Update current sheet data if this is the active save point
      if (state.activeSavePointId === savePointId) {
        state.sheet = sheetData;
        state.status = status;
      }
    },

    switchToSavePoint(state, action) {
      const { savePointId } = action.payload;
      state.activeSavePointId = savePointId;
      
      const savePoint = state.savePoints.find(sp => sp.id === savePointId);
      if (savePoint) {
        state.title = savePoint.title;
        
        // Load data from active generation
        const activeGeneration = savePoint.generations.find(
          gen => gen.id === savePoint.activeGenerationId
        );
        
        if (activeGeneration) {
          state.sheet = activeGeneration.sheetData;
          state.status = activeGeneration.status;
        } else {
          state.sheet = null;
          state.status = "idle";
        }
      }
    },

    switchToGeneration(state, action) {
      const { savePointId, generationId } = action.payload;
      
      const savePoint = state.savePoints.find(sp => sp.id === savePointId);
      if (!savePoint) return;
      
      const generation = savePoint.generations.find(gen => gen.id === generationId);
      if (!generation) return;
      
      // Update active generation
      savePoint.activeGenerationId = generationId;
      
      // Update current data if this is the active save point
      if (state.activeSavePointId === savePointId) {
        state.sheet = generation.sheetData;
        state.status = generation.status;
      }
    },

    generateMoreForSavePoint(state, action) {
      const { savePointId } = action.payload;
      
      // Set generating status for the active save point
      if (state.activeSavePointId === savePointId) {
        state.status = "generating";
        state.sheet = null;
      }
    },

    // Other existing actions
    addSheetLog(state, action) {
      state.logs.push({
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
    },

    clearSheetLogs(state) {
      state.logs = [];
    },

    resetSheetState(state) {
      return { ...initialState };
    },
  },
});

// Export action creators
export const {
  setSheetState,
  setSheetData,
  setSheetStatus,
  setSheetTitle,
  initializeChatHistory,
  addNewSavePoint,
  addGenerationToSavePoint,
  switchToSavePoint,
  switchToGeneration,
  generateMoreForSavePoint,
  addSheetLog,
  clearSheetLogs,
  resetSheetState,
} = sheetSlice.actions;

// Selectors
export const selectSheet = (state) => {
  if (!state || !state.sheet) {
    console.warn("Sheet state not found in Redux store, returning initial state");
    return initialState;
  }
  return state.sheet;
};

export const selectSheetData = (state) => {
  return state?.sheet?.sheet || null;
};

export const selectSheetStatus = (state) => {
  return state?.sheet?.status || "idle";
};

export const selectSheetTitle = (state) => {
  return state?.sheet?.title || "Ready to Generate";
};

export const selectSavePoints = (state) => {
  return state?.sheet?.savePoints || [];
};

export const selectActiveSavePoint = (state) => {
  const savePoints = selectSavePoints(state);
  const activeSavePointId = state?.sheet?.activeSavePointId;
  return savePoints.find(sp => sp.id === activeSavePointId) || null;
};

export const selectActiveGeneration = (state) => {
  const activeSavePoint = selectActiveSavePoint(state);
  if (!activeSavePoint) return null;
  
  return activeSavePoint.generations.find(
    gen => gen.id === activeSavePoint.activeGenerationId
  ) || null;
};

export const selectCurrentChatId = (state) => {
  return state?.sheet?.currentChatId || null;
};

// Computed selectors
export const selectSheetStats = (state) => {
  const sheetData = selectSheetData(state);
  
  if (!sheetData || !Array.isArray(sheetData)) {
    return { rowCount: 0, columnCount: 0, hasData: false };
  }
  
  const rowCount = sheetData.length;
  let columnCount = 0;
  
  if (rowCount > 0) {
    const allColumns = new Set();
    sheetData.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (key !== "id") {
          allColumns.add(key);
        }
      });
    });
    columnCount = allColumns.size;
  }
  
  return {
    rowCount,
    columnCount,
    hasData: rowCount > 0 && columnCount > 0,
  };
};

export const selectIsSheetLoading = (state) => {
  const status = selectSheetStatus(state);
  return status === "generating";
};

export const selectSheetError = (state) => {
  const status = selectSheetStatus(state);
  return status === "error";
};

export default sheetSlice.reducer;