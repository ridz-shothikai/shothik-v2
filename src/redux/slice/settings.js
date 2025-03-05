import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  themeMode: "light",
  themeLayout: "vertical",
  open: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
    setThemeLayout: (state, action) => {
      state.themeLayout = action.payload;
    },
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === "light" ? "dark" : "light";
    },
    toggleThemeLayout: (state) => {
      state.themeLayout =
        state.themeLayout === "vertical" ? "mini" : "vertical";
    },
  },
});

export const {
  setThemeMode,
  setThemeLayout,
  setOpen,
  toggleThemeMode,
  toggleThemeLayout,
} = settingsSlice.actions;

export default settingsSlice.reducer;
