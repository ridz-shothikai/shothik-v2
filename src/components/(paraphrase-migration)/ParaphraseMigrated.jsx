"use client";
import { Close, InsertDriveFile, MoreVert } from "@mui/icons-material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Import your existing components and utilities
import { modes } from "../../_mock/tools/paraphrase";
import { trySamples } from "../../_mock/trySamples";
import { useAutoFreeze } from "../../hooks/useAutoFreeze";
import useDebounce from "../../hooks/useDebounce";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import useResponsive from "../../hooks/useResponsive";
import useSetState from "../../hooks/useSetState";
import useSnackbar from "../../hooks/useSnackbar";
import useWordLimit from "../../hooks/useWordLimit";
import { useParaphrasedMutation } from "../../redux/api/tools/toolsApi";
import { setShowLoginModal } from "../../redux/slice/auth";
import { setParaphraseValues } from "../../redux/slice/inputOutput";
import { setActiveHistory } from "../../redux/slice/paraphraseHistorySlice";
import MultipleFileUpload from "../tools/common/MultipleFileUpload";
import UserActionInput from "../tools/common/UserActionInput";
import WordCounter from "../tools/common/WordCounter";
import LanguageMenu from "../tools/grammar/LanguageMenu";
import AutoFreezeSettings from "../tools/paraphrase/AutoFreezeSettings";
import AutoParaphraseSettings from "../tools/paraphrase/AutoParaphraseSettings";
import FileHistorySidebar from "../tools/paraphrase/FileHistorySidebar";
import ModeNavigation from "../tools/paraphrase/ModeNavigation";
import Onboarding from "../tools/paraphrase/Onboarding";
import OutputBotomNavigation from "../tools/paraphrase/OutputBotomNavigation";
import ParaphraseOutput from "../tools/paraphrase/ParaphraseOutput";
import UpdateComponent from "../tools/paraphrase/UpdateComponent";
import UserInputBox from "../tools/paraphrase/UserInputBox";
import VerticalMenu from "../tools/paraphrase/VerticalMenu";

const PUNCTUATION_FOR_SPACING = "[.,;?!:]";

function normalizePunctuationSpacing(text) {
  if (!text) return "";
  let formattedText = text;
  formattedText = formattedText.replace(/\s+/g, " ").trim();
  formattedText = formattedText.replace(
    new RegExp(`\\s+(${PUNCTUATION_FOR_SPACING}+)`, "g"),
    "$1",
  );
  formattedText = formattedText.replace(
    new RegExp(`(${PUNCTUATION_FOR_SPACING}+)(?!\\s|$)`, "g"),
    "$1 ",
  );
  return formattedText;
}

const SYNONYMS = {
  20: "Basic",
  40: "Intermediate",
  60: "Advanced",
  80: "Expert",
};

const initialFrozenWords = new Set();
const initialFrozenPhrase = new Set();

const isModeLockedForUser = (modeValue, userPackage) => {
  const mode = modes.find((m) => m.value === modeValue);
  if (!mode) return false;
  return !mode.package.includes(userPackage || "free");
};

const ParaphraseMigrated = () => {
  const {
    paraphraseQuotations,
    automaticStartParaphrasing,
    useYellowHighlight,
  } = useSelector((state) => state.settings.paraphraseOptions);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const shown = localStorage.getItem("onboarding") || false;
    if (!shown) {
      setShowDemo(true);
    }
  }, []);

  const [activeHistoryDetails, setActiveHistoryDetails] = useState(null);
  const [selectedSynonyms, setSelectedSynonymsState] = useState(SYNONYMS[20]);

  const setSelectedSynonyms = (...args) => {
    console.log("setSelectedSynonyms called with args:", args);
    setActiveHistoryDetails(null);
    dispatch(setActiveHistory({}));
    return setSelectedSynonymsState(...args);
  };

  const [showLanguageDetect, setShowLanguageDetect] = useState(false);
  const { accessToken } = useSelector((state) => state.auth);
  const [outputHistoryIndex, setOutputHistoryIndex] = useState(0);
  const [highlightSentence, setHighlightSentence] = useState(0);
  const [selectedMode, setSelectedModeState] = useState("Standard");

  const setSelectedMode = (...args) => {
    console.log("setSelectedMode called with args:", args);
    setActiveHistoryDetails(null);
    dispatch(setActiveHistory({}));
    return setSelectedModeState(...args);
  };

  const [outputWordCount, setOutputWordCount] = useState(0);
  const [outputHistory, setOutputHistory] = useState([]);
  const [outputContend, setOutputContend] = useState("");
  const { user } = useSelector((state) => state.auth);
  const frozenWords = useSetState(initialFrozenWords);
  const frozenPhrases = useSetState(initialFrozenPhrase);
  const [recommendedFreezeWords, setRecommendedFreezeWords] = useState([]);
  const [language, setLanguageState] = useState("English (US)");

  const setLanguage = (...args) => {
    console.log("setLanguage called with args:", args);
    setActiveHistoryDetails(null);
    dispatch(setActiveHistory({}));
    return setLanguageState(...args);
  };

  const sampleText = useMemo(() => {
    const langKey =
      language && language.startsWith("English") ? "English" : language;
    return trySamples.paraphrase[langKey] || null;
  }, [language]);

  const hasSampleText = Boolean(sampleText);
  const [isLoading, setIsLoading] = useState(false);
  const { wordLimit } = useWordLimit("paraphrase");
  const [userInput, setUserInputState] = useState("");

  const setUserInput = (...args) => {
    console.log("setUserInput called with args:", args);
    setActiveHistoryDetails(null);
    dispatch(setActiveHistory({}));
    return setUserInputState(...args);
  };

  const userInputValue = useDebounce(userInput, 800);
  const [socketId, setSocketId] = useState(null);
  const [paraphrased] = useParaphrasedMutation();
  const [eventId, setEventId] = useState(null);
  const isMobile = useResponsive("down", "md");
  const [result, setResult] = useState([]);
  const [historyResult, setHistoryResult] = useState([]);

  const enqueueSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const outputRef = useRef(null);
  const [showMessage, setShowMessage] = useState({
    show: false,
    Component: null,
  });
  const [processing, setProcessing] = useState({
    loading: false,
    success: false,
  });
  const [paraphraseRequestCounter, setParaphraseRequestCounter] = useState(0);

  const hasOutput = result?.length > 0 && outputContend.trim()?.length > 0;
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    word: "",
    count: 0,
    action: null,
  });

  const {
    activeHistory,
    isUpdatedHistory,
    isUpdatedFileHistory,
    fileHistories,
  } = useSelector((state) => state.paraphraseHistory);

  const paidUser =
    user?.package === "pro_plan" ||
    user?.package === "value_plan" ||
    user?.package === "unlimited";

  console.log("Paid User Status:", user);

  const { paraphraseOptions } = useSelector((state) => state.settings);

  const {
    autoFrozenTerms,
    userDisabledTerms,
    isDetecting: isAutoFreezeDetecting,
    stats: autoFreezeStats,
    disableTerm: disableAutoFreezeTerm,
    enableTerm: enableAutoFreezeTerm,
    isAutoFrozen,
    getTermInfo,
  } = useAutoFreeze({
    userInput,
    language,
    frozenWords,
    onAutoFreeze: (terms) => {
      terms.forEach((term) => {
        const normalizedTerm = term.toLowerCase().trim().replace(/\s+/g, " ");
        if (normalizedTerm.includes(" ")) {
          if (!frozenPhrases.has(normalizedTerm)) {
            frozenPhrases.add(normalizedTerm);
          }
        } else {
          if (!frozenWords.has(normalizedTerm)) {
            frozenWords.add(normalizedTerm);
          }
        }
      });
    },
    debounceMs: 2500,
    enableLLM: paidUser,
    shouldAutoFreeze: paraphraseOptions.autoFreeze,
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    "ctrl+enter": () => {
      if (userInput && !isLoading && !processing.loading) {
        handleSubmit();
      }
    },
    "ctrl+shift+c": () => {
      handleClear("", "all");
    },
    "ctrl+k": () => {
      if (outputContend) {
        navigator.clipboard.writeText(outputContend);
        enqueueSnackbar("Output copied to clipboard!", {
          variant: "success",
        });
      }
    },
    "ctrl+shift+l": () => {
      const languages = ["English (US)", "English (UK)", "Bangla"];
      const currentIndex = languages.indexOf(language);
      const nextIndex = (currentIndex + 1) % languages.length;
      setLanguage(languages[nextIndex]);
    },
    "ctrl+1": () => setSelectedMode("Standard"),
    "ctrl+2": () => setSelectedMode("Fluency"),
    "ctrl+3": () => setSelectedMode("Humanize"),
    "ctrl+4": () => setSelectedMode("Formal"),
    escape: () => {
      if (result?.length > 0) {
        handleClear("", "output");
      }
    },
    "ctrl+h": () => {
      if (outputHistory.length > 0) {
        setOutputHistoryIndex((prev) => (prev + 1) % outputHistory.length);
      }
    },
  });

  const countWordOccurrences = (text, word) => {
    if (!text || !word) return 0;
    const lowerText = text.toLowerCase();
    const lowerWord = word.toLowerCase();
    const regex = new RegExp(
      `\\b${lowerWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "gi",
    );
    const matches = lowerText.match(regex);
    return matches ? matches.length : 0;
  };

  const handleFreezeWord = (word) => {
    console.log("handleFreezeWord called with word:", word);
    const normalizedWord = word.toLowerCase().trim().replace(/\s+/g, " ");
    const count = countWordOccurrences(userInput, word);

    if (count > 1) {
      setConfirmationDialog({
        open: true,
        word: normalizedWord,
        count: count,
        action: () => {
          frozenWords.add(normalizedWord);
          setConfirmationDialog({
            open: false,
            word: "",
            count: 0,
            action: null,
          });
          setTimeout(() => {
            frozenWords.add(normalizedWord);
            enqueueSnackbar(`Frozen all ${count} instances successfully`, {
              variant: "success",
            });
          }, 100);
        },
      });
    } else {
      frozenWords.add(normalizedWord);
      enqueueSnackbar("Frozen successfully", { variant: "success" });
    }
  };

  const handleFreezePhrase = (phrase) => {
    const normalizedPhrase = phrase.toLowerCase().trim().replace(/\s+/g, " ");
    const count = countWordOccurrences(userInput, phrase);

    if (count > 1) {
      setConfirmationDialog({
        open: true,
        word: phrase,
        count: count,
        action: () => {
          frozenPhrases.add(normalizedPhrase);
          setConfirmationDialog({
            open: false,
            word: "",
            count: 0,
            action: null,
          });
        },
      });
    } else {
      frozenPhrases.add(normalizedPhrase);
    }
  };

  // Rest of your component logic...
  // (I'll include the essential parts for the UI)

  const handleClear = (_, action = "all") => {
    if (action === "all") {
      setUserInput("");
      frozenWords.reset(initialFrozenWords);
      frozenPhrases.reset(initialFrozenPhrase);
      dispatch(setParaphraseValues({ type: "input", values: { text: "" } }));
      dispatch(
        setParaphraseValues({ type: "output", values: { text: "", data: [] } }),
      );
      setResult([]);
      setOutputHistory([]);
    } else if (action === "output") {
      setResult([]);
      setOutputHistory([]);
      dispatch(
        setParaphraseValues({ type: "output", values: { text: "", data: [] } }),
      );
    }
    setParaphraseRequestCounter((prev) => prev + 1);
  };

  const handleSubmit = async (value) => {
    // Your existing submit logic
  };

  function extractPlainText(array) {
    if (!Array.isArray(array)) {
      console.log("Input must be an array");
      return null;
    }
    let allSegments = [];
    for (const segment of array) {
      if (!Array.isArray(segment)) {
        console.error("Each segment must be an array");
        return null;
      }
      if (segment.length === 1 && segment[0].type === "newline") {
        allSegments.push("\n");
        continue;
      }
      const wordsInCurrentSegment = [];
      for (const wordObj of segment) {
        if (!wordObj || typeof wordObj !== "object") {
          console.error("Invalid word object in segment");
          return null;
        }
        if (typeof wordObj.word !== "string") {
          console.error("Word property must be a string");
          return null;
        }
        wordsInCurrentSegment.push(wordObj.word);
      }
      allSegments.push(wordsInCurrentSegment.join(" "));
    }
    let plainText = allSegments.join(" ");
    plainText = normalizePunctuationSpacing(plainText);
    return plainText;
  }

  return (
    <div className="flex w-full overflow-hidden pt-2">
      {showDemo && <Onboarding />}

      {/* Desktop Sidebar - Left */}
      {!isMobile && (
        <div className="mr-2 w-auto flex-shrink-0 transition-all duration-200">
          <FileHistorySidebar fetchFileHistories={() => {}} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col gap-0">
        {/* Desktop Language Tabs - Outside Card */}
        <div className="hidden w-full flex-shrink-0 items-center md:flex">
          <LanguageMenu
            isLoading={isLoading || processing.loading}
            setLanguage={setLanguage}
            language={language}
          />
          <div className="hidden items-center gap-2 md:flex lg:gap-4">
            <AutoFreezeSettings />
            <AutoParaphraseSettings />
          </div>
        </div>

        {/* Main Card Container */}
        <div className="flex w-full min-w-0 flex-1 gap-2 overflow-visible">
          <div className="mt-0 flex w-full min-w-0 flex-1 flex-col overflow-visible rounded-tr-xl rounded-br-xl rounded-bl-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            {/* Mobile Header with Language Menu */}
            <div className="flex border-b border-gray-200 px-2 py-1 md:hidden dark:border-gray-700">
              <LanguageMenu
                isLoading={isLoading}
                setLanguage={setLanguage}
                language={language}
              />
              <button className="p-2" onClick={() => setMobileMenuOpen(true)}>
                <MoreVert className="text-sm" />
              </button>
            </div>

            {/* Desktop Mode Navigation */}
            <div className="hidden lg:block">
              <ModeNavigation
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                userPackage={user?.package}
                selectedSynonyms={selectedSynonyms}
                setSelectedSynonyms={setSelectedSynonyms}
                SYNONYMS={SYNONYMS}
                setShowMessage={setShowMessage}
                isLoading={processing.loading}
                accessToken={accessToken}
                dispatch={dispatch}
                setShowLoginModal={setShowLoginModal}
              />
            </div>

            {/* Divider */}
            <div className="hidden border-b-2 border-gray-200 lg:block dark:border-gray-700" />

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Panel - Input */}
              <div className="relative flex h-[400px] flex-col border-b-2 border-gray-200 pb-1 md:h-[450px] lg:h-[530px] lg:border-r-2 lg:border-b-0 dark:border-gray-700">
                <UserInputBox
                  wordLimit={wordLimit}
                  setUserInput={setUserInputState}
                  userInput={userInput}
                  frozenPhrases={frozenPhrases}
                  frozenWords={frozenWords}
                  user={user}
                  useYellowHighlight={useYellowHighlight}
                  highlightSentence={highlightSentence}
                  language={language}
                  hasOutput={hasOutput}
                  onFreezeWord={handleFreezeWord}
                  onFreezePhrase={handleFreezePhrase}
                />

                {!userInput && (
                  <UserActionInput
                    setUserInput={setUserInputState}
                    isMobile={isMobile}
                    sampleText={sampleText}
                    paraphrase={true}
                    paidUser={paidUser}
                    selectedMode={selectedMode}
                    selectedSynonymLevel={selectedSynonyms}
                    selectedLang={language}
                    freezeWords={[
                      ...(frozenWords?.values || []),
                      ...(frozenPhrases?.values || []),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    disableTrySample={!hasSampleText}
                  />
                )}

                <WordCounter
                  freeze_props={{
                    recommendedWords: recommendedFreezeWords,
                    frozenWords: Array.from(frozenWords.set),
                    frozenPhrases: Array.from(frozenPhrases.set),
                    onAddWords: (words) =>
                      words.forEach((w) => handleFreezeWord(w)),
                    onAddPhrases: (phrases) =>
                      phrases.forEach((p) => handleFreezePhrase(p)),
                    onRemoveWord: (w) => frozenWords.remove(w),
                    onRemovePhrase: (p) => frozenPhrases.remove(p),
                    onClearAll: () => {
                      frozenWords.reset(initialFrozenWords);
                      frozenPhrases.reset(initialFrozenPhrase);
                    },
                  }}
                  btnText={outputContend ? "Rephrase" : "Paraphrase"}
                  handleClearInput={() => handleClear("", "all")}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                  btnDisabled={isAutoFreezeDetecting}
                  userInput={userInput}
                  userPackage={user?.package}
                  toolName="paraphrase"
                  btnIcon={isMobile ? null : <InsertDriveFile />}
                  sx={{ py: { md: 1 } }}
                  dontDisable={true}
                  sticky={320}
                  freeze_modal={true}
                  detectingFreezeTerms={isAutoFreezeDetecting}
                />

                {showLanguageDetect && (
                  <div className="absolute bottom-20 left-5 flex items-center gap-2 rounded bg-white p-1 shadow-md dark:bg-gray-800">
                    <span className="text-sm">Detected Language:</span>
                    <button className="rounded border border-gray-300 px-3 py-1 text-sm">
                      {language}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Panel - Output */}
              <div
                ref={outputRef}
                className="relative flex h-[480px] flex-col overflow-hidden border-t-2 border-gray-200 sm:h-[450px] md:border-t-0 lg:h-[530px] dark:border-gray-700"
              >
                {/* Mobile Mode Navigation */}
                <div className="block border-b border-gray-100 lg:hidden dark:border-gray-800">
                  <ModeNavigation
                    selectedMode={selectedMode}
                    setSelectedMode={setSelectedMode}
                    userPackage={user?.package}
                    selectedSynonyms={selectedSynonyms}
                    setSelectedSynonyms={setSelectedSynonyms}
                    SYNONYMS={SYNONYMS}
                    setShowMessage={setShowMessage}
                    isLoading={processing.loading}
                    accessToken={accessToken}
                    dispatch={dispatch}
                    setShowLoginModal={setShowLoginModal}
                  />
                </div>

                <ParaphraseOutput
                  data={result}
                  setData={setResult}
                  synonymLevel={selectedSynonyms}
                  dataModes={modes}
                  userPackage={user?.package}
                  selectedLang={language}
                  highlightSentence={highlightSentence}
                  setHighlightSentence={setHighlightSentence}
                  setOutputHistory={setOutputHistory}
                  input={userInput}
                  freezeWords={[
                    ...(frozenWords?.values || []),
                    ...(frozenPhrases?.values || []),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  socketId={socketId}
                  language={language}
                  setProcessing={setProcessing}
                  eventId={eventId}
                  setEventId={setEventId}
                  paraphraseRequestCounter={paraphraseRequestCounter}
                />

                {result?.length > 0 && (
                  <OutputBotomNavigation
                    handleClear={() => handleClear("", "output")}
                    highlightSentence={highlightSentence}
                    outputContend={outputContend}
                    outputHistory={outputHistory}
                    outputHistoryIndex={outputHistoryIndex}
                    outputWordCount={outputWordCount}
                    proccessing={processing}
                    sentenceCount={result.length - 1}
                    setHighlightSentence={setHighlightSentence}
                    setOutputHistoryIndex={setOutputHistoryIndex}
                  />
                )}

                {showMessage.show &&
                  isModeLockedForUser(showMessage.Component, user?.package) && (
                    <UpdateComponent Component={showMessage.Component} />
                  )}
              </div>
            </div>
          </div>

          {/* Mobile Bottom Drawer */}
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="bg-opacity-50 fixed inset-0 z-40 bg-black"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Drawer */}
              <div className="fixed right-0 bottom-0 left-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-xl bg-white px-2 pt-1 pb-2 shadow-2xl dark:bg-gray-800">
                <div className="mb-2 flex justify-end">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Close />
                  </button>
                </div>
                <VerticalMenu
                  selectedMode={selectedMode}
                  setSelectedMode={setSelectedMode}
                  outputText={result}
                  setOutputText={setResult}
                  freezeWords={[
                    ...(frozenWords?.values || []),
                    ...(frozenPhrases?.values || []),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  text={userInput}
                  selectedLang={language}
                  highlightSentence={highlightSentence}
                  setHighlightSentence={setHighlightSentence}
                  plainOutput={extractPlainText(result)}
                  selectedSynonymLevel={selectedSynonyms}
                  mobile={true}
                  fetchFileHistories={() => {}}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Right Sidebar - Vertical Menu */}
      {!isMobile && (
        <div className="mt-7 ml-2 w-auto flex-shrink-0 transition-all duration-200">
          <VerticalMenu
            selectedMode={selectedMode}
            outputText={result}
            setOutputText={setResult}
            setSelectedMode={setSelectedMode}
            freezeWords={[
              ...(frozenWords?.values || []),
              ...(frozenPhrases?.values || []),
            ]
              .filter(Boolean)
              .join(", ")}
            plainOutput={extractPlainText(result)}
            text={userInput}
            selectedLang={language}
            highlightSentence={highlightSentence}
            setHighlightSentence={setHighlightSentence}
            selectedSynonymLevel={selectedSynonyms}
            fetchFileHistories={() => {}}
          />
        </div>
      )}

      {/* File Upload Component */}
      <MultipleFileUpload
        isMobile={isMobile}
        setInput={() => {}}
        paidUser={paidUser}
        freezeWords={[]}
        selectedMode={selectedMode}
        shouldShowButton={false}
      />

      {/* Confirmation Dialog */}
      {confirmationDialog.open && (
        <>
          {/* Backdrop */}
          <div
            className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
            onClick={() =>
              setConfirmationDialog({
                open: false,
                word: "",
                count: 0,
                action: null,
              })
            }
          >
            {/* Dialog */}
            <div
              className="w-full max-w-sm rounded-lg bg-white shadow-xl dark:bg-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <div className="px-6 pt-6 pb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Freeze Multiple Occurrences?
                </h2>
              </div>

              {/* Content */}
              <div className="px-6 pb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  The word/phrase appears{" "}
                  <strong>{confirmationDialog.count} times</strong> in your
                  text.
                </p>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  Freezing this will prevent all {confirmationDialog.count}{" "}
                  occurrences from being paraphrased. Do you want to continue?
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 px-6 pb-6">
                <button
                  onClick={() =>
                    setConfirmationDialog({
                      open: false,
                      word: "",
                      count: 0,
                      action: null,
                    })
                  }
                  className="rounded px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmationDialog.action}
                  className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Freeze All {confirmationDialog.count}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParaphraseMigrated;
