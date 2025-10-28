// PlagiarismSidebar.jsx
import { Close } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useSelector } from "react-redux";

import Image from "next/image";
import compare from "../../../../public/icons/compare-modes.svg";
import history from "../../../../public/icons/history.svg";
import plagiarism from "../../../../public/icons/plagiarism.svg";
import tone from "../../../../public/icons/tone.svg";
import CompareTab from "./actions/CompareTab"; // to come
import HistoryTab from "./actions/HistoryTab"; // to come
import PlagiarismTab from "./actions/PlagiarismTab";
import ToneTab from "./actions/ToneTab"; // to come
import UpgradePrompt from "./UpgradePrompt";

const tabs = [
  { id: "plagiarism", iconSrc: history, component: PlagiarismTab },
  { id: "history", iconSrc: plagiarism, component: HistoryTab },
  { id: "compare", iconSrc: compare, component: CompareTab },
  { id: "tone", iconSrc: tone, component: ToneTab },
];

const PlagiarismSidebar = ({
  open,
  onClose,
  active,
  setActive,
  score,
  results,
  selectedMode,
  setSelectedMode,
  outputText,
  setOutputText,
  text,
  freezeWords,
  selectedLang,
  sentence,
  highlightSentence,
  plainOutput,
  selectedSynonymLevel,
  disableActions,
}) => {
  const { user } = useSelector((state) => state.auth);
  const paidUser =
    user?.package === "pro_plan" ||
    user?.package === "value_plan" ||
    user?.package === "unlimited";

  if (!open) return null;

  const ActiveTab = tabs.find((t) => t.id === active)?.component;

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        borderLeft: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* top nav with bottom border */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          pt: 2,
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", flex: 1, justifyContent: "space-around" }}>
          {tabs.map((t) => (
            <Box
              key={t.id}
              onClick={
                disableActions && t.id !== "history"
                  ? null
                  : () => setActive(t.id)
              }
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor:
                  disableActions && t.id !== "history"
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              <IconButton
                size="large"
                disableRipple
                disabled={disableActions && t.id !== "history"}
                sx={{
                  color: active === t.id ? "primary.main" : "text.secondary",
                }}
              >
                <Image
                  src={t.iconSrc}
                  priority={true}
                  width={24}
                  height={24}
                  alt=""
                  className="h-6 w-6"
                />
              </IconButton>
              {active === t.id && (
                <Box
                  sx={{
                    width: 24,
                    borderBottom: 2,
                    borderColor: "primary.main",
                    mt: 0.5,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>

        <IconButton
          size="small"
          id="plagiarism_sidebar_x_button"
          onClick={onClose}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* active tab content */}
      {!paidUser ? (
        <UpgradePrompt onClose={onClose} />
      ) : (
        ActiveTab && (
          <ActiveTab
            onClose={onClose}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            score={score}
            results={results}
            outputText={outputText}
            setOutputText={setOutputText}
            text={text}
            freezeWords={freezeWords}
            selectedLang={selectedLang}
            sentence={sentence}
            highlightSentence={highlightSentence}
            plainOutput={plainOutput}
            selectedSynonymLevel={selectedSynonymLevel}
          />
        )
      )}
    </Box>
  );
};

export default PlagiarismSidebar;
