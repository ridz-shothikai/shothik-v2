import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => ({
  themeMode: "light",
  themeLayout: "mini",
  open: false,
  demo: false,
  paraphraseOptions: {
    paraphraseQuotations: true,
    avoidContractions: true,
    preferActiveVoice: false,
    automaticStartParaphrasing: false,
    autoFreeze: false,
  },
  interfaceOptions: {
    useYellowHighlight: false,
    showTooltips: true,
    // showLegend: false,
    showChangedWords: true,
    showStructuralChanges: false,
    showLongestUnchangedWords: false,
  },
  humanizeOptions: {
    humanizeQuotations: true,
    avoidContractions: false,
    automaticStartHumanize: false,
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
          JSON.stringify(state.paraphraseOptions),
        );
      }
    },
    toggleHumanizeOption(state, action) {
      const key = action.payload;
      if (state.humanizeOptions.hasOwnProperty(key)) {
        state.humanizeOptions[key] = !state.humanizeOptions[key];
        localStorage.setItem(
          "humanizeOptions",
          JSON.stringify(state.humanizeOptions),
        );
      }
    },
    toggleInterfaceOption(state, action) {
      const key = action.payload;
      if (state.interfaceOptions.hasOwnProperty(key)) {
        state.interfaceOptions[key] = !state.interfaceOptions[key];
        localStorage.setItem(
          "interfaceOptions",
          JSON.stringify(state.interfaceOptions),
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

      const storedParaphraseOptions = localStorage.getItem("paraphraseOptions");
      if (storedParaphraseOptions) {
        state.paraphraseOptions = JSON.parse(storedParaphraseOptions);
      }

      const storedInterfaceOptions = localStorage.getItem("interfaceOptions");
      if (storedInterfaceOptions) {
        state.interfaceOptions = JSON.parse(storedInterfaceOptions);
      }

      const storedHumanizeOptions = localStorage.getItem("humanizeOptions");
      if (storedHumanizeOptions) {
        state.humanizeOptions = JSON.parse(storedHumanizeOptions);
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
  toggleParaphraseOption,
  toggleInterfaceOption,
  toggleHumanizeOption,
} = settingsSlice.actions;

export default settingsSlice.reducer;
