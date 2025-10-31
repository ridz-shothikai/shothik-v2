import type { TSettingState } from "@/types/state.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const defaultSetting: TSettingState = {
  theme: "system",
  direction: "ltr",
  language: "en",
  sidebar: "expanded",
  header: "expanded",
  layout: "vertical",

  // features settings
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
};

const getInitialSetting = (): TSettingState => {
  try {
    if (typeof window === "undefined") {
      return defaultSetting;
    }

    const setting = localStorage.getItem("setting");
    return setting ? JSON.parse(setting) : defaultSetting;
  } catch (error) {
    console.error("Error parsing setting from localStorage", error);
    return defaultSetting;
  }
};

const initialState: TSettingState = getInitialSetting();

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setSetting: (state, action: PayloadAction<TSettingState>) => {
      if (action.payload) {
        const setting = { ...state, ...action.payload };
        localStorage.setItem("setting", JSON.stringify(setting));
        return setting;
      }
      return state;
    },
    updateTheme: (state, action: PayloadAction<TSettingState["theme"]>) => {
      state.theme = action.payload;
      localStorage.setItem("setting", JSON.stringify(state));
    },
    updateDirection: (
      state,
      action: PayloadAction<TSettingState["direction"]>,
    ) => {
      state.direction = action.payload;
      localStorage.setItem("setting", JSON.stringify(state));
    },
    updateLanguage: (
      state,
      action: PayloadAction<TSettingState["language"]>,
    ) => {
      state.language = action.payload;
      localStorage.setItem("setting", JSON.stringify(state));
    },
    updateSidebar: (state, action: PayloadAction<TSettingState["sidebar"]>) => {
      state.sidebar = action.payload;
      localStorage.setItem("setting", JSON.stringify(state));
    },
    updateHeader: (state, action: PayloadAction<TSettingState["header"]>) => {
      state.header = action.payload;
      localStorage.setItem("setting", JSON.stringify(state));
    },
    updateLayout: (state, action: PayloadAction<TSettingState["layout"]>) => {
      state.layout = action.payload;
      localStorage.setItem("setting", JSON.stringify(state));
    },
    resetSetting: () => {
      localStorage.setItem("setting", JSON.stringify(defaultSetting));
      return defaultSetting;
    },
  },
});

export const {
  setSetting,
  updateTheme,
  updateDirection,
  updateLanguage,
  updateSidebar,
  updateHeader,
  updateLayout,
  resetSetting,
} = settingSlice.actions;

export default settingSlice.reducer;
