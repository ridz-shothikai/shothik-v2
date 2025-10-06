// PlagiarismSidebar.jsx
import {
  Close,
  Compare,
  Gavel,
  History,
  SentimentSatisfiedAlt,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

import CompareTab from "./actions/CompareTab"; // to come
import HistoryTab from "./actions/HistoryTab"; // to come
import PlagiarismTab from "./actions/PlagiarismTab";
import ToneTab from "./actions/ToneTab"; // to come
import UpgradePrompt from "./UpgradePrompt";

const tabs = [
  { id: "plagiarism", icon: <Gavel />, component: PlagiarismTab },
  { id: "history", icon: <History />, component: HistoryTab },
  { id: "tone", icon: <SentimentSatisfiedAlt />, component: ToneTab },
  { id: "compare", icon: <Compare />, component: CompareTab },
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
                {React.cloneElement(t.icon, { fontSize: "inherit" })}
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
