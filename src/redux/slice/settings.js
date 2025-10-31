import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => ({
  theme: "light",
  sidebar: "compact",
  header: "expanded",
  layout: "vertical",
  language: "en",

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

    updateTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },

    toggleTheme(state) {
      const order = ["light", "dark", "system"];
      const nextIndex = (order.indexOf(state.theme) + 1) % order.length;
      const nextTheme = order[nextIndex];
      state.theme = nextTheme;
      localStorage.setItem("theme", nextTheme);
    },

    updateSidebar: (state, action) => {
      state.sidebar = action.payload;
      localStorage.setItem("sidebar", action.payload);
    },

    toggleSidebar(state) {
      const nextSidebar = state.sidebar === "expanded" ? "compact" : "expanded";
      state.sidebar = nextSidebar;
      localStorage.setItem("sidebar", nextSidebar);
    },

    updateHeader(state, action) {
      state.header = action.payload;
      localStorage.setItem("header", action.payload);
    },
    toggleHeader(state) {
      const nextHeader = state.header === "expanded" ? "compact" : "expanded";
      state.header = nextHeader;
      localStorage.setItem("header", nextHeader);
    },

    updateLayout(state, action) {
      state.layout = action.payload;
      localStorage.setItem("layout", action.payload);
    },

    toggleLayout(state) {
      const nextLayout =
        state.layout === "vertical" ? "horizontal" : "vertical";
      state.layout = nextLayout;
      localStorage.setItem("layout", nextLayout);
    },

    updateLanguage(state, action) {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },

    toggleLanguage(state) {
      const nextLanguage = state.language === "en" ? "bn" : "en";
      state.language = nextLanguage;
      localStorage.setItem("language", nextLanguage);
    },

    setOpen: (state, action) => {
      state.open = action.payload;
      localStorage.setItem("open", action.payload);
    },

    toggleOpen: (state) => {
      state.open = !state.open;
      localStorage.setItem("open", state.open);
    },

    setDemo: (state, action) => {
      state.demo = action.payload;
    },
  },
});

export const {
  updateTheme,
  toggleTheme,
  updateHeader,
  toggleHeader,
  updateLayout,
  toggleLayout,
  updateLanguage,
  toggleLanguage,
  updateSidebar,
  toggleSidebar,
  setOpen,
  toggleOpen,
  setDemo,
  toggleParaphraseOption,
  toggleInterfaceOption,
  toggleHumanizeOption,
} = settingsSlice.actions;

export default settingsSlice.reducer;
