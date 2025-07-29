"use client"
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles'
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import {
  Gavel,
  SentimentSatisfiedAlt,
  Compare,
  History,
  Settings,
  Keyboard,
  Diamond
} from "@mui/icons-material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PlagiarismSidebar from './PlagiarismSidebar';
import SettingsSidebar from './settings/SettingsSidebar';
import { useSelector } from 'react-redux';

const ICON_SIZE = "1.5rem";

const VerticalMenu = ({
  selectedMode,
  setSelectedMode,
  outputText,
  setOutputText,
  freezeWords,
  text,
  selectedLang,
  highlightSentence,
  setHighlightSentence,
  plainOutput,
  selectedSynonymLevel,
}) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { demo } = useSelector((state) => state.settings);
  
  // Disable actions only if plainOutput is empty and demo is not true
  const disableActions = !demo && (!plainOutput || !plainOutput.trim());

  const ActionButton = ({
    id,
    title,
    icon: Icon,
    onClick,
    disabled,
    crown = false,
    black = true
  }) => {
    const theme = useTheme()
    const words = title.split(' ')

    return (
      <Box
        onClick={!disabled ? onClick : undefined}
        sx={{
          width: '5rem',
          height: '5rem',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
          '&:hover': {
            bgcolor: disabled ? 'transparent' : theme.palette.action.hover,
          },
          userSelect: 'none',
        }}
      >
        {/* icon + optional crown */}
        <Box sx={{ position: 'relative', mb: 0.5 }}>
          <IconButton
            id={id}
            size="large"
            onClick={e => {
              e.stopPropagation()
              if (!disabled) onClick()
            }}
            disabled={disabled}
            sx={{
              p: 0,
              color: black ? theme.palette.grey[900] : 'inherit',
            }}
          >
            <Icon sx={{ fontSize: ICON_SIZE }} />
          </IconButton>
          {crown && (
            <Box
              component="img"
              src="/premium_crown.svg"
              alt="premium crown"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 16,
                height: 16,
                transform: 'translate(50%, 50%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </Box>

        {/* split title into separate lines */}
        <Typography
          variant="caption"
          align="center"
          sx={{
            fontSize: 12,
            color: black ? theme.palette.grey[900] : 'inherit',
            whiteSpace: 'pre-line',
            lineHeight: 1.2,
          }}
        >
          {words.map((w, i) => (
            <React.Fragment key={i}>
              {w}
              {i < words.length - 1 && '\n'}
            </React.Fragment>
          ))}
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          maxHeight: "90vh",
          mt: 1,
          width: 'fit-content',
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
        }}
      >
        {['plagiarism','history','tone','compare'].includes(showSidebar) ? (
          <PlagiarismSidebar
            active={showSidebar}
            setActive={setShowSidebar}
            open={!!showSidebar}
            onClose={() => setShowSidebar(false)}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            outputText={outputText}
            setOutputText={setOutputText}
            text={text}
            freezeWords={freezeWords}
            selectedLang={selectedLang}
            sentence={
              outputText &&
              highlightSentence >= 0 &&
              outputText[highlightSentence]
                ? outputText[highlightSentence].map(w => w.word).join(" ")
                : ""
            }
            selectedSynonymLevel={selectedSynonymLevel}
            highlightSentence={highlightSentence}
            plainOutput={plainOutput}
          />
        ) : ['settings','feedback','shortcuts'].includes(showSidebar) ? (
          <SettingsSidebar
            tab={showSidebar}
            setTab={setShowSidebar}
            open
            onClose={() => setShowSidebar(false)}
          />
        ) : (
          <>
            {/* Center icons */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0, alignItems: "center" }}>
              <Box id="paraphrase_plagiarism">
                <ActionButton
                  id="paraphrase_plagiarism_button"
                  title="Check Plagiarism"
                  icon={Gavel}
                  onClick={() => setShowSidebar('plagiarism')}
                  disabled={disableActions}
                  crown={true}
                />
              </Box>
              <Box id="paraphrase_history">
                <ActionButton
                  id="paraphrase_history_button"
                  title="History"
                  icon={History}
                  onClick={() => setShowSidebar('history')}
                  disabled={false}
                  crown={true}
                />
              </Box>
              <Box id="paraphrase_compare">
                <ActionButton
                  id="paraphrase_compare_button"
                  title="Compare Modes"
                  icon={Compare}
                  onClick={() => setShowSidebar('compare')}
                  disabled={disableActions}
                  crown={true}
                />
              </Box>
              <Box id="paraphrase_tone">
                <ActionButton
                  id="paraphrase_tone_button"
                  title="Tone"
                  icon={SentimentSatisfiedAlt}
                  onClick={() => setShowSidebar('tone')}
                  disabled={disableActions}
                  crown={true}
                />
              </Box>
            </Box>

            {/* Bottom icons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                mt: 2,
                alignItems: "center",
              }}
            >
              <Box id="paraphrase_settings">
                <ActionButton
                  title="Settings"
                  id="paraphrase_settings_button"
                  icon={Settings}
                  onClick={() => setShowSidebar('settings')}
                  disabled={false}
                  black={true}
                />
              </Box>
              <Box id="paraphrase_feedback">
                <ActionButton
                  id="paraphrase_feedback_button"
                  title="Feedback"
                  icon={FeedbackIcon}
                  onClick={() => setShowSidebar('feedback')}
                  disabled={false}
                  black={true}
                />
              </Box>
              <Box id="paraphrase_shortcuts">
                <ActionButton
                  id="paraphrase_shortcuts_button"
                  title="Hotkeys"
                  icon={Keyboard}
                  onClick={() => setShowSidebar('shortcuts')}
                  disabled={false}
                  black={true}
                />
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default VerticalMenu;
