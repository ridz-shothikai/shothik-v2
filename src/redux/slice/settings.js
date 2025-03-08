import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => ({
  themeMode: "light",
  themeLayout: "vertical",
  open: false,
});

const settingsSlice = createSlice({
  name: "settings",
  initialState: getInitialState(),
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
      localStorage.setItem("themeMode", action.payload);
    },
    setThemeLayout: (state, action) => {
      state.themeLayout = action.payload;
      localStorage.setItem("themeLayout", action.payload);
    },
    setOpen: (state, action) => {
      state.open = action.payload;
      localStorage.setItem("open", action.payload);
    },
    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", state.themeMode);
    },
    toggleThemeLayout: (state) => {
      state.themeLayout =
        state.themeLayout === "vertical" ? "mini" : "vertical";
      localStorage.setItem("themeLayout", state.themeLayout);
    },
    loadSettingsFromLocalStorage: (state) => {
      state.themeMode = localStorage.getItem("themeMode") || "light";
      state.themeLayout = localStorage.getItem("themeLayout") || "vertical";
      state.open = localStorage.getItem("open") === "true";
    },
  },
});

export const {
  setThemeMode,
  setThemeLayout,
  setOpen,
  toggleThemeMode,
  toggleThemeLayout,
  loadSettingsFromLocalStorage,
} = settingsSlice.actions;

export default settingsSlice.reducer;
