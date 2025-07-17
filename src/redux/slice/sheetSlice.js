import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    logs: [],
    sheet: [],
    status: "idle",
    title: "Generating...",
};

const sheetSlice = createSlice({
    name: "sheet",
    initialState,
    reducers: {
        setSheetState(state, action) {
            const {logs, sheet, status, title} = action.payload;
            state.logs = logs || state.logs;
            state.sheet = sheet || state.sheet;
            state.status = status || state.status;
            state.title = title || state.title;
        }
    }
});

export const {setSheetState} = sheetSlice.actions;

export const selectSheet = (state) => {
  if (!state || !state.sheet) {
    console.warn("Presentation state not found in Redux store, returning initial state");
    return initialState;
  }
  return state.sheet;
};

export default sheetSlice.reducer;