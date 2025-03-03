import SvgColor from "../../resource/SvgColor";
import { PATH_ACCOUNT, PATH_TOOLS } from "./route";

const icon = (name) => (
  <SvgColor src={`/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  humanize: icon("bypass-svgrepo-com"),
  ai_detector: icon("ai_detector_icon"),
  paraphrase: icon("paraphrase"),
  summarize: icon("summarize"),
  grammar: icon("grammar"),
  translator: icon("translator"),
  research: icon("research"),
};

const navConfig = [
  {
    subheader: "Services",
    items: [
      {
        title: "Paraphrase",
        path: PATH_TOOLS.paraphrase,
        icon: ICONS.paraphrase,
        iconColor: "#FF595E",
      },
      {
        title: "Humanize GPT",
        path: PATH_TOOLS.humanize,
        icon: ICONS.humanize,
        iconColor: "#FF595E",
      },
      {
        title: "AI Detector",
        path: PATH_TOOLS.ai_detector,
        icon: ICONS.ai_detector,
        iconColor: "#f29b18",
      },
      {
        title: "Grammar Fix",
        path: PATH_TOOLS.grammar,
        icon: ICONS.grammar,
        iconColor: "#8AC926",
      },
      {
        title: "Summarize",
        path: PATH_TOOLS.summarize,
        icon: ICONS.summarize,
        iconColor: "#FFAB00",
      },
      {
        title: "Translator",
        path: PATH_TOOLS.translator,
        icon: ICONS.translator,
        iconColor: "#A07EFB",
      },
      {
        title: "Research",
        path: PATH_TOOLS.research,
        icon: ICONS.research,
        iconColor: "#B71D18",
      },
    ],
  },
  // ----------------------------------------------------------------------
  {
    subheader: "account",
    roles: ["user", "admin"],
    items: [
      {
        title: "Your account",
        path: PATH_ACCOUNT.settings.root,
        icon: ICONS.user,
        iconColor: "#3498DB",
      },
    ],
  },
];

// export
export { navConfig as default, ICONS };
