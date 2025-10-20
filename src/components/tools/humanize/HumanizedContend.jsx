"use client";

import {
  Box,
  Card,
  IconButton,
  Stack,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";

import { MoreVert } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { trySamples } from "../../../_mock/trySamples";
import { trackEvent } from "../../../analysers/eventTracker";
import useDebounce from "../../../hooks/useDebounce";
import useLoadingText from "../../../hooks/useLoadingText";
import useResponsive from "../../../hooks/useResponsive";
import useSnackbar from "../../../hooks/useSnackbar";
import useWordLimit from "../../../hooks/useWordLimit";
import { useGetAllHistoryQuery } from "../../../redux/api/humanizeHistory/humanizeHistory";
import { useHumanizeContendMutation } from "../../../redux/api/tools/toolsApi";
import { setShowLoginModal } from "../../../redux/slice/auth";
import { setAlertMessage, setShowAlert } from "../../../redux/slice/tools";
import UserActionInput from "../common/UserActionInput";
import LanguageMenu from "../grammar/LanguageMenu";
import AlertDialogMessage from "./AlertDialogMessage";
import GPTsettings from "./GPTsettings";
import HumanizeScrores from "./HumanizeScrores";
import InputBottom from "./InputBottom";
import Navigations from "./Navigations";
import OutputNavigation from "./OutputNavigation";
import TopNavigation from "./TopNavigation";

const LENGTH = {
  20: "Basic",
  40: "Intermediate",
  60: "Advanced",
  80: "Expert",
};

const HumanizedContend = () => {
  const [currentLength, setCurrentLength] = useState(LENGTH[20]);
  const [showShalowAlert, setShalowAlert] = useState(false);
  const [outputContent, setOutputContent] = useState([]);
  const [humanizeContend] = useHumanizeContendMutation();
  const miniLabel = useResponsive("between", "md", "xl");
  const { user } = useSelector((state) => state.auth);
  const { automaticStartHumanize } = useSelector(
    (state) => state.settings.humanizeOptions,
  );

  // Humanize history
  const { data: allHumanizeHistory, refetch: refetchAllHumanizeHistory } =
    useGetAllHistoryQuery();

  const [language, setLanguage] = useState("English (US)");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const loadingText = useLoadingText(isLoading);
  const [showIndex, setShowIndex] = useState(0);
  const isMobile = useResponsive("down", "sm");
  const { wordLimit } = useWordLimit("bypass");
  const [update, setUpdate] = useState(false);
  const [model, setModel] = useState("Panda");
  const [scores, setScores] = useState([]);
  const [isRestoredFromHistory, setIsRestoredFromHistory] = useState(false);
  const enqueueSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ref to track if we're currently restoring from history
  const isRestoring = useRef(false);

  const sampleText = useMemo(() => {
    const langkey =
      language && language.startsWith("English") ? "English" : language;
    return trySamples.humanize[langkey] || null;
  }, [language]);
  const hasSampleText = Boolean(sampleText);

  function handleClear() {
    setUserInput("");
    setScores([]);
    setShowIndex(0);
    setOutputContent([]);
    setIsRestoredFromHistory(false);
  }

  const handleAiDetectors = (text) => {
    if (!text) return;

    setLoadingAi(true);

    sessionStorage.setItem("ai-detect-content", JSON.stringify(text));
    router.push("/ai-detector");
  };

  /**
   * Check if history entry parameters match current settings
   */
  const canRestoreFromHistory = (entry) => {
    if (!entry || !entry.outputs || entry.outputs.length === 0) {
      return false;
    }

    console.log(entry);

    const modelMatches = entry.model?.toLowerCase() === model.toLowerCase();
    const levelMatches = entry.level === currentLength;
    const languageMatches = entry.language === language;

    return modelMatches && levelMatches && languageMatches;
  };

  /**
   * Handle history entry selection with smart restoration
   */
  const handleHistorySelect = (entry) => {
    try {
      // Set the restoring flag to prevent auto-humanize from triggering
      isRestoring.current = true;

      const canRestore = canRestoreFromHistory(entry);

      if (canRestore) {
        // Restore everything from history
        setUserInput(entry.text);
        setOutputContent(entry.outputs);
        setScores(entry.outputs.map((output) => output.score));
        setShowIndex(0);
        setIsRestoredFromHistory(true);

        // Show success feedback
        enqueueSnackbar("Content restored from history", {
          variant: "success",
        });
      } else {
        // Parameters don't match - only set input and clear outputs
        setUserInput(entry.text);
        setOutputContent([]);
        setScores([]);
        setShowIndex(0);
        setIsRestoredFromHistory(false);

        // Inform user about parameter mismatch
        const mismatchReasons = [];
        if (entry.model?.toLowerCase() !== model.toLowerCase()) {
          mismatchReasons.push(`model changed from ${entry.model} to ${model}`);
        }
        if (entry.level !== currentLength) {
          mismatchReasons.push(
            `level changed from ${entry.level} to ${currentLength}`,
          );
        }
        if (entry.language !== language) {
          mismatchReasons.push(
            `language changed from ${entry.language} to ${language}`,
          );
        }

        if (mismatchReasons.length > 0) {
          enqueueSnackbar(
            `Settings changed (${mismatchReasons.join(", ")}). Please regenerate.`,
            { variant: "info" },
          );
        }
      }

      // Reset the flag after a short delay to allow state updates to complete
      setTimeout(() => {
        isRestoring.current = false;
      }, 100);
    } catch (error) {
      console.error("Error restoring history:", error);
      enqueueSnackbar("Failed to restore history entry", { variant: "error" });
      isRestoring.current = false;
    }
  };

  const handleSubmit = async () => {
    try {
      // Track event
      trackEvent("click", "humanize", "humanize_click", 1);

      setLoadingAi(true);
      setIsLoading(true);
      setOutputContent([]);
      setScores([]);
      setShowIndex(0);
      setIsRestoredFromHistory(false);

      let text = userInput;

      const payload = {
        text,
        model: model.toLowerCase(),
        level: currentLength,
        language,
      };

      const data = await humanizeContend(payload).unwrap();

      if (!data.output?.length) {
        throw {
          error: "NOT_FOUND",
          message: "No humanized content found",
        };
      }

      const scores = data.output.map((item) => item.score);
      setOutputContent(data.output);
      setScores(scores);
      setUpdate((prev) => !prev);

      // After generating humanized content, refetch history to maintain fresh data
      refetchAllHumanizeHistory();
    } catch (err) {
      const error = err?.data;
      const reg = /LIMIT_REQUEST|PACAKGE_EXPIRED|WORD_COUNT_LIMIT_REQUEST/;
      if (reg.test(error?.error)) {
        dispatch(setShowAlert(true));
        dispatch(setAlertMessage(error?.message));
      } else if (error?.error === "UNAUTHORIZED") {
        dispatch(setShowLoginModal(true));
      } else {
        enqueueSnackbar(error?.message, { variant: "error" });
      }
    } finally {
      setLoadingAi(false);
      setIsLoading(false);
    }
  };

  const debounceHumanizeProcess = useDebounce(userInput, 1000);

  /**
   * Auto-humanize effect with restoration protection
   */
  useEffect(() => {
    // Skip if automatic start is disabled
    if (!automaticStartHumanize) return;

    // Skip if we're currently restoring from history
    if (isRestoring.current) return;

    // Skip if already have outputs (restored or generated)
    if (outputContent.length > 0) return;

    // Only trigger if there's user input
    if (userInput) {
      handleSubmit();
    }
  }, [automaticStartHumanize, debounceHumanizeProcess]);

  /**
   * Effect to clear "restored from history" indicator when settings change
   */
  useEffect(() => {
    if (isRestoredFromHistory && outputContent.length > 0) {
      setIsRestoredFromHistory(false);
    }
  }, [model, currentLength, language]);

  return (
    <Stack sx={{ pt: 2 }}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: "50%" },
              }}
            >
              <LanguageMenu
                isLoading={isLoading}
                setLanguage={setLanguage}
                language={language}
              />
            </Box>

            <Box
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <IconButton
                size="small"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            <Box>
              <Card
                sx={{
                  position: "relative",
                  height: 420,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "visible",
                  borderRadius: "0 12px 12px 12px",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <TopNavigation
                  model={model}
                  setModel={setModel}
                  setShalowAlert={setShalowAlert}
                  userPackage={user?.package}
                  LENGTH={LENGTH}
                  currentLength={currentLength}
                  setCurrentLength={setCurrentLength}
                />
                <TextField
                  name="input"
                  variant="outlined"
                  rows={13}
                  fullWidth
                  multiline
                  placeholder="Enter your text here..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={showShalowAlert}
                  sx={{
                    flexGrow: 1,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                      "& textarea": {
                        textAlign: "left",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      },
                    },
                    "& .MuiInputBase-root": {
                      paddingY: "4px",
                    },
                  }}
                />
                {!userInput ? (
                  <UserActionInput
                    setUserInput={setUserInput}
                    isMobile={isMobile}
                    sampleText={sampleText}
                    disableTrySample={!hasSampleText}
                  />
                ) : (
                  <InputBottom
                    handleClear={handleClear}
                    isLoading={isLoading}
                    isMobile={isMobile}
                    miniLabel={miniLabel}
                    userInput={userInput}
                    userPackage={user?.package}
                    setWordCount={setWordCount}
                  />
                )}
              </Card>

              <Navigations
                hasOutput={outputContent.length}
                isLoading={isLoading}
                isMobile={isMobile}
                miniLabel={miniLabel}
                model={model}
                userInput={userInput}
                wordCount={wordCount}
                wordLimit={wordLimit}
                handleAiDitectors={handleAiDetectors}
                handleSubmit={handleSubmit}
                loadingAi={loadingAi}
                userPackage={user?.package}
                update={update}
              />

              {scores.length ? (
                <HumanizeScrores
                  isMobile={isMobile}
                  loadingAi={loadingAi}
                  scores={scores}
                  showIndex={showIndex}
                />
              ) : null}
            </Box>

            <Box>
              {/* output */}
              <Card
                sx={{
                  height: 420,
                  overflowY: "auto",
                  padding: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  position: "relative",
                }}
              >
                {/* Restored from history indicator */}
                {/* {isRestoredFromHistory && outputContent.length > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 1,
                    }}
                  >
                    <Chip
                      label="📚 Restored from history"
                      size="small"
                      color="info"
                      variant="outlined"
                      sx={{ fontSize: "0.75rem" }}
                    />
                  </Box>
                )} */}

                {outputContent[showIndex] ? (
                  <Typography
                    sx={{
                      whiteSpace: "pre-line",
                      // mt: isRestoredFromHistory ? 4 : 0,
                      mt: 0,
                    }}
                  >
                    {outputContent[showIndex].text}
                  </Typography>
                ) : (
                  <Typography sx={{ color: "text.disabled" }}>
                    {loadingText ? loadingText : "Humanized Contend"}
                  </Typography>
                )}

                {showShalowAlert ? <AlertDialogMessage /> : null}
              </Card>

              {outputContent.length ? (
                <OutputNavigation
                  isMobile={isMobile}
                  outputs={outputContent.length}
                  selectedContend={outputContent[showIndex]?.text}
                  setShowIndex={setShowIndex}
                  showIndex={showIndex}
                  handleAiDetectors={handleAiDetectors}
                  loadingAi={loadingAi}
                />
              ) : null}
            </Box>
          </Box>
        </Box>

        {/* GPT options (e.g: history, settings) */}
        {/* This will be for DESKTOP */}
        <Box
          sx={{
            flex: "0 0 auto",
            width: "min-content",
            ml: 2,
            display: { xs: "none", md: "block" },
          }}
        >
          <GPTsettings
            handleHistorySelect={handleHistorySelect}
            allHumanizeHistory={allHumanizeHistory?.data}
            refetchHistory={refetchAllHumanizeHistory}
          />
        </Box>

        {/* Mobile menu for options */}
        <SwipeableDrawer
          anchor="bottom"
          open={mobileMenuOpen}
          onOpen={() => setMobileMenuOpen(true)}
          onClose={() => setMobileMenuOpen(false)}
        >
          <Box sx={{ px: 4, pt: 1, pb: 2 }}>
            <Box
              sx={{
                flex: "0 0 auto",
                width: "min-content",
                ml: 2,
              }}
            >
              <GPTsettings
                handleHistorySelect={handleHistorySelect}
                allHumanizeHistory={allHumanizeHistory?.data}
                refetchHistory={refetchAllHumanizeHistory}
              />
            </Box>
          </Box>
        </SwipeableDrawer>
      </Box>
    </Stack>
  );
};

export default HumanizedContend;
