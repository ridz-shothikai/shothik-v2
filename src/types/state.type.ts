import type { TUser } from "./user.type";

export type TUserState = {
  token?: string;
  info?: TUser;
  is_authenticated?: boolean;
};

export type TSettingState = {
  theme?: "light" | "dark" | "system" | "semi-dark";
  direction?: "ltr" | "rtl";
  language?: "en" | "bn";
  sidebar?: "expanded" | "compact";
  header?: "expanded" | "compact";
  layout?: "vertical" | "horizontal";

  // features settings
  demo?: any;
  paraphraseOptions: {
    paraphraseQuotations: boolean;
    avoidContractions: boolean;
    preferActiveVoice: boolean;
    automaticStartParaphrasing: boolean;
    autoFreeze: boolean;
  };

  interfaceOptions: {
    useYellowHighlight: boolean;
    showTooltips: boolean;
    // showLegend?: boolean; // uncomment if needed later
    showChangedWords: boolean;
    showStructuralChanges: boolean;
    showLongestUnchangedWords: boolean;
  };

  humanizeOptions: {
    humanizeQuotations: boolean;
    avoidContractions: boolean;
    automaticStartHumanize: boolean;
  };
};
