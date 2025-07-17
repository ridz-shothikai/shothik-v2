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

export default sheetSlice.reducer;