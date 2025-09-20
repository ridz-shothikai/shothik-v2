import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => ({
  themeMode: "light",
  themeLayout: "mini",
  open: false,
  demo: false,
  paraphraseOptions: {
    paraphraseQuotations: true,      // <<< new
    avoidContractions:      false,
    preferActiveVoice:      false,
    automaticStartParaphrasing: false,
  },
});

const settingsSlice = createSlice({
  name: "settings",
  initialState: getInitialState(),
  reducers: {
    toggleParaphraseOption(state, action) {
      const key = action.payload;
      if (state.paraphraseOptions.hasOwnProperty(key)) {
        state.paraphraseOptions[key] = !state.paraphraseOptions[key];
        localStorage.setItem(
          "paraphraseOptions",
          JSON.stringify(state.paraphraseOptions)
        );
      }
    },

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
    },
    loadSettingsFromLocalStorage: (state) => {
      state.themeMode = localStorage.getItem("themeMode") || "light";
      state.open = localStorage.getItem("open") === "true";

      const storedOptions = localStorage.getItem("paraphraseOptions");
      if (storedOptions) {
        state.paraphraseOptions = JSON.parse(storedOptions);
      }
    },

    setDemo: (state, action) => {
      state.demo = action.payload;
    },
  },
});

export const {
  setThemeMode,
  setDemo,
  setThemeLayout,
  setOpen,
  toggleThemeMode,
  toggleThemeLayout,
  loadSettingsFromLocalStorage,
  toggleParaphraseOption
} = settingsSlice.actions;

export default settingsSlice.reducer;
