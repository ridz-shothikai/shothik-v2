"use client";
import { InsertDriveFile } from "@mui/icons-material";
import { Box, Card, Divider, Grid2 } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { modes } from "../../../_mock/tools/paraphrase";
import { trySamples } from "../../../_mock/trySamples";
import { trackEvent } from "../../../analysers/eventTracker";
import { detectLanguage } from "../../../hooks/languageDitector";
import useResponsive from "../../../hooks/useResponsive";
import useSnackbar from "../../../hooks/useSnackbar";
import useWordLimit from "../../../hooks/useWordLimit";
import { useParaphrasedMutation } from "../../../redux/api/tools/toolsApi";
import { setShowLoginModal } from "../../../redux/slice/auth";
import { setAlertMessage, setShowAlert } from "../../../redux/slice/tools";
import UserActionInput from "../common/UserActionInput";
import WordCounter from "../common/WordCounter";
import LanguageMenu from "../grammar/LanguageMenu";
import ModeNavigation from "./ModeNavigation";
import ModeNavigationForMobile from "./ModeNavigationForMobile";
import OutputBotomNavigation from "./OutputBotomNavigation";
// import ParaphraseEditor from "./ParaphraseEditor"; // Replaced with TipTapEditor
import TipTapEditor from "../../../resource/editor/TipTapEditor";
import ParaphraseOutput from "./ParaphraseOutput";
import UpdateComponent from "./UpdateComponent";
import ViewInputInOutAsDemo from "./ViewInputInOutputAsDemo";
import InputPlagiarismDialog from "./InputPlagiarismDialog";
import OutputPlagiarismReportPanel from "./OutputPlagiarismReportPanel";
import OriginalTextViewer from './OriginalTextViewer'; // Added
import { Tabs, Tab, Typography } from "@mui/material";

const SYNONYMS = {
  20: "Basic",
  40: "Intermediate",
  60: "Advanced",
  80: "Expert",
};

const ParaphraseContend = () => {
  const [selectedSynonyms, setSelectedSynonyms] = useState(SYNONYMS[20]);
  const [outputHistoryIndex, setOutputHistoryIndex] = useState(0);
  const [highlightSentence, setHighlightSentence] = useState(0);
  const [selectedMode, setSelectedMode] = useState("Standard");
  const [outputWordCount, setOutputWordCount] = useState(0);
  const [outputHistory, setOutputHistory] = useState([]);
  const [outputContend, setOutputContend] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [language, setLanguage] = useState("English");
  // const [updateHtml, setUpdateHtml] = useState(false); // Temporarily removed for TipTapEditor integration
  const [processing, setProcessing] = useState(false);
  const [frozenWordTexts, setFrozenWordTexts] = useState([]);
  const sampleText = trySamples.paraphrase[language];
  const [isLoading, setIsLoading] = useState(false);
  const { wordLimit } = useWordLimit("paraphrase");
  const [userInput, setUserInput] = useState("");
  const [socketId, setSocketId] = useState(null);
  const [paraphrased] = useParaphrasedMutation();
  const [eventId, setEventId] = useState(null);
  const isMobile = useResponsive("down", "sm");
  const [result, setResult] = useState([]);
  const enqueueSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const outputRef = useRef(null);
  const [showMessage, setShowMessage] = useState({
    show: false,
    Component: null,
  });

  // Plagiarism Check States
  const [isCheckingInputPlagiarism, setIsCheckingInputPlagiarism] = useState(false);
  const [isCheckingOutputPlagiarism, setIsCheckingOutputPlagiarism] = useState(false);
  const [inputPlagiarismResult, setInputPlagiarismResult] = useState(null);
  const [outputPlagiarismResult, setOutputPlagiarismResult] = useState(null);
  const [showInputPlagiarismDialog, setShowInputPlagiarismDialog] = useState(false);
  const [activeRightPanelTab, setActiveRightPanelTab] = useState('output'); // 'output' or 'plagiarism'
  const [showOriginalInOutput, setShowOriginalInOutput] = useState(false);

  const triggerPlagiarismCheck = (text, type) => {
    // This function will be fully implemented in a subsequent step.
    // For now, it can simulate an API call and set results.
    console.log(`Triggering plagiarism check for ${type} text:`, text);
    if (type === 'input') {
      setTimeout(() => {
        setInputPlagiarismResult({
          percentage: Math.floor(Math.random() * 40), // Keep percentages somewhat realistic
          sources: [
            { url: 'http://example-input.com/sourceA', matchPercent: Math.floor(Math.random() * 40) + 5, snippet: "Lorem ipsum dolor sit amet..." },
            { url: 'http://example-input.com/sourceB', matchPercent: Math.floor(Math.random() * 30) + 10, snippet: "Consectetur adipiscing elit..." }
          ],
          originalText: text,
        });
        setIsCheckingInputPlagiarism(false);
      }, 2000);
    } else if (type === 'output') {
      setTimeout(() => {
        setOutputPlagiarismResult({
          percentage: Math.floor(Math.random() * 20), // Paraphrased text might have lower scores
          sources: [
            { url: 'http://example-output.com/sourceC', matchPercent: Math.floor(Math.random() * 20) + 1, snippet: "Sed do eiusmod tempor incididunt..." }
          ],
          originalText: text,
        });
        setIsCheckingOutputPlagiarism(false);
      }, 2000);
    }
  };

  const handleCheckInputPlagiarism = () => {
    if (!userInput.trim()) { // Ensure userInput is trimmed before checking
      enqueueSnackbar('Please enter some text to check for plagiarism.', { variant: 'info' });
      return;
    }
    setIsCheckingInputPlagiarism(true);
    setInputPlagiarismResult(null); // Clear previous results
    setShowInputPlagiarismDialog(true);
    triggerPlagiarismCheck(userInput, 'input');
  };

  const handleCheckOutputPlagiarism = () => {
    if (!outputContend.trim()) {
      enqueueSnackbar('There is no output text to check.', { variant: 'info' });
      return;
    }
    setIsCheckingOutputPlagiarism(true);
    setOutputPlagiarismResult(null);
    setActiveRightPanelTab('plagiarism'); // Switch to plagiarism tab
    triggerPlagiarismCheck(outputContend, 'output');
  };

  const handleToggleShowOriginal = () => {
    setShowOriginalInOutput(prev => !prev);
  };

  const handleCopyOutputToInput = () => {
    if (!outputContend.trim()) {
      enqueueSnackbar("Nothing to copy to input.", { variant: "info" });
      return;
    }
    setUserInput(outputContend); // Set input editor with the output content

    // Clear the output display
    setResult([]);
    setOutputContend("");
    setOutputHistory([]); // Also clear output history related to the previous output
    setOutputHistoryIndex(0); // Reset history index
    setHighlightSentence(0); // Reset sentence highlighter

    // Optionally, ensure the output tab is active and original text view is off
    setActiveRightPanelTab('output');
    setShowOriginalInOutput(false);

    enqueueSnackbar("Output content copied to input area for further editing.", { variant: "success" });
  };

  useEffect(() => {
    if (!userInput) return;
    const language = detectLanguage(userInput);
    setLanguage(language);
  }, [userInput]);

  useEffect(() => {
    if (!outputHistory.length) {
      return;
    }

    const historyData = outputHistory[outputHistoryIndex];

    if (historyData) {
      setResult(historyData);
    }
  }, [outputHistoryIndex]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setSocketId(socket.id);
    });

    socket.on("disconnect", () => {
      console.warn("Socket disconnected");
      setSocketId("");
    });

    let accumulatedText = "";
    socket.on("paraphrase-plain", (data) => {
      if (data === ":end:") {
        accumulatedText = "";
        setIsLoading(false);
        return;
      }

      accumulatedText += data.replace(/[{}]/g, "");

      const separator = language === "Bangla" ? "। " : ". ";
      const sentences = accumulatedText.split(separator).map((sentence) => {
        const words = sentence
          .trim()
          .split(/\s+/)
          .map((word) => ({ word, type: "none", synonyms: [] }));

        // Add punctuation if it’s a full sentence
        if (sentence) {
          words.push({
            word: separator.trim(),
            type: "punctuation",
            synonyms: [],
          });
        }

        return words;
      });

      setResult(sentences);
      setOutputContend(accumulatedText.replace(/[()]/g, ""));
      setOutputWordCount(accumulatedText.split(/\s+/).filter(Boolean).length);
    });

    socket.on("paraphrase-tagging", (data) => {
      try {
        const sentence = JSON.parse(data);
        if (sentence.eventId === eventId) {
          setResult((prev) => {
            const updated = [...prev];
            updated[sentence.index] = sentence.data;
            return updated;
          });
        }
      } catch (error) {
        console.error("Error parsing paraphrase-tagging data:", error);
      }
    });

    socket.on("paraphrase-synonyms", (data) => {
      if (data === ":end:") {
        console.log("Synonyms processing completed.");
        setProcessing({ success: true, loading: false });
        return;
      }

      try {
        const sentence = JSON.parse(data);
        if (sentence.eventId === eventId) {
          setResult((prev) => {
            const updated = [...prev];
            updated[sentence.index] = sentence.data;
            return updated;
          });
        }
      } catch (error) {
        console.error("Error parsing paraphrase-synonyms data:", error);
      }
    });
  }, [language, eventId]);

  const handleClear = (_, action = "all") => {
    if (action === "all") {
      setUserInput("");
      setFrozenWordTexts([]);
    }
    setResult([]);
    setOutputHistory([]);
  };

  const handleSubmit = async (rephrase) => {
    try {
      // track event
      trackEvent("click", "paraphrase", "paraphrase_click", 1);

      const lastOutput = outputContend;
      let payload;

      setIsLoading(true);
      setResult([]);
      setOutputHistoryIndex(0);
      setProcessing({ success: false, loading: true });

      const textToParaphrase = rephrase ? lastOutput : userInput;
      const extractedSentences = textToParaphrase.replace(/<[^>]+>/g, "");
      const textAsWrodsArray = extractedSentences
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const finalText = textAsWrodsArray.slice(0, wordLimit).join(" ");
      if (finalText > wordLimit) {
        throw { error: "LIMIT_REQUEST", message: "Worads limit execed" };
      }

      // generate uniqe 10 number randomly;
      const randomNumber = Math.floor(Math.random() * 10000000000);
      setEventId(`${socketId}-${randomNumber}`);

      payload = {
        text: finalText,
        freeze: frozenWordTexts.join(', '),
        language: language,
        mode: selectedMode ? selectedMode.toLowerCase() : "standard",
        synonym: selectedSynonyms ? selectedSynonyms.toLowerCase() : "basic",
        socketId,
        eventId,
      };

      await paraphrased(payload).unwrap();

      if (isMobile && outputRef.current) {
        outputRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } catch (error) {
      // It's often better to set these loading states false once at the start of handling an error.
      setIsLoading(false);
      setProcessing({ success: false, loading: false });

      const errorData = error?.data;
      const actualErrorCode = errorData?.error;
      const serverMessage = errorData?.message;

      if (actualErrorCode === "LIMIT_REQUEST" || actualErrorCode === "PACAKGE_EXPIRED") {
        dispatch(setShowAlert(true));
        dispatch(setAlertMessage(serverMessage || "Word limit exceeded or package expired."));
      } else if (actualErrorCode === "UNAUTHORIZED") {
        dispatch(setShowLoginModal(true));
      } else if (actualErrorCode === "TEXT_TOO_SHORT") {
        enqueueSnackbar(serverMessage || "The input text is too short to paraphrase effectively.", { variant: "warning" });
      } else if (actualErrorCode === "TEXT_TOO_LONG") {
        enqueueSnackbar(serverMessage || "The input text is too long. Please reduce its length.", { variant: "warning" });
      } else if (actualErrorCode === "UNSUPPORTED_LANGUAGE_FOR_MODE") {
        enqueueSnackbar(serverMessage || "The selected mode does not support this language. Please try another mode or language.", { variant: "warning" });
      } else if (actualErrorCode === "NO_MEANINGFUL_CONTENT") {
        enqueueSnackbar(serverMessage || "Could not find meaningful content to paraphrase. Please check your input.", { variant: "warning" });
      } else if (actualErrorCode === "SERVICE_UNAVAILABLE") {
        enqueueSnackbar(serverMessage || "The paraphrasing service is temporarily unavailable. Please try again later.", { variant: "error" });
      } else {
        enqueueSnackbar(serverMessage || error.message || "An unexpected error occurred during paraphrasing.", {
          variant: "error",
        });
      }
    }
  };

  return (
    <Box>
      <LanguageMenu
        isLoading={isLoading}
        setLanguage={setLanguage}
        language={language}
      />
      <Card
        sx={{
          mt: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "12px",
          overflow: "visible",
        }}
      >
        {!isMobile ? (
          <ModeNavigation
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            userPackage={user?.package}
            selectedSynonyms={selectedSynonyms}
            setSelectedSynonyms={setSelectedSynonyms}
            SYNONYMS={SYNONYMS}
            setShowMessage={setShowMessage}
          />
        ) : (
          <ModeNavigationForMobile
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            userPackage={user?.package}
          />
        )}

        <Divider sx={{ borderBottom: "2px solid", borderColor: "divider" }} />

        <Grid2 container>
          <Grid2
            sx={{
              height: isMobile ? "calc(100vh - 340px)" : 530,
              position: "relative",
              // borderRight: { md: "2px solid" }, // Original right border for md
              // borderRightColor: { md: "divider" }, // Original right border color for md
              padding: 2,
              paddingBottom: 0,
              display: "flex",
              flexDirection: "column",

              // New border logic for focus indication:
              borderTop: { xs: "2px solid", md: "2px solid" }, // Keep top border consistent for focus effect
              borderLeft: { xs: "2px solid", md: "2px solid" }, // Keep left border consistent for focus effect
              borderBottom: { xs: "2px solid", md: "2px solid" }, // Keep bottom border consistent for focus effect
              borderRight: { xs: "2px solid", md: "2px solid" }, // Ensure right border is part of the focusable area
              borderColor: 'divider', // Default border color for all sides

              transition: 'border-color 0.2s ease-in-out',
              '&:focus-within': {
                borderColor: 'primary.main', // Change color of all active borders on focus
              }
            }}
            size={{ xs: 12, md: 6 }}
          >
          <TipTapEditor
            content={userInput}
            onChange={setUserInput}
            embedStyle={true}
            onFrozenWordsChange={setFrozenWordTexts}
            wordLimit={wordLimit}
            userName="Current User Example" // Example static name
            userColor="#8E44AD" // Example static color (a shade of purple)
            documentId="paraphraser-main-document" // New documentId prop
            />

            {!userInput ? (
              <UserActionInput
                setUserInput={setUserInput}
                isMobile={isMobile}
                sampleText={sampleText}
              // extraAction={() => setUpdateHtml((prev) => !prev)} // Temporarily removed for TipTapEditor integration
              />
            ) : null}
            <WordCounter
              btnText={outputContend ? "Rephrase" : "Paraphrase"}
              handleClearInput={handleClear}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              userInput={userInput}
              userPackage={user?.package}
              toolName='paraphrase'
              btnIcon={isMobile ? null : <InsertDriveFile />}
              sx={{ py: 0 }}
              dontDisable={true}
              sticky={320}
              onCheckPlagiarism={handleCheckInputPlagiarism} // Added prop
              isCheckingPlagiarism={isCheckingInputPlagiarism} // Added prop
            />
          </Grid2>
          {isMobile && !userInput ? null : (
            <Grid2
              size={{ xs: 12, md: 6 }}
              ref={outputRef}
              sx={{
                height: isMobile ? "calc(100vh - 340px)" : 530,
                // overflow: "hidden", // Managed by inner content boxes now
                borderTop: { xs: "2px solid", md: "none" },
                borderTopColor: { xs: "divider", md: undefined },
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', flexShrink: 0 }}>
                <Tabs value={activeRightPanelTab} onChange={(e, newValue) => setActiveRightPanelTab(newValue)} aria-label="Output panel tabs">
                  <Tab label="Paraphrased Text" value="output" sx={{textTransform: 'none', fontSize: '0.875rem'}} />
                  <Tab label="Plagiarism Report" value="plagiarism" disabled={!outputContend && !outputPlagiarismResult} sx={{textTransform: 'none', fontSize: '0.875rem'}} />
                </Tabs>
              </Box>

              {activeRightPanelTab === 'output' && (
                // This Box now manages the layout for the 'output' tab content
                <Box sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 /* Crucial for nested flex scroll */}}>
                  {showOriginalInOutput && userInput && (
                    <OriginalTextViewer htmlContent={userInput} />
                  )}
                  {/* This inner Box will now manage the scroll for ParaphraseOutput and keep OutputBotomNavigation at bottom */}
                  <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {isLoading && !result.length && ( // Show initial loading/placeholder for output
                       <div style={{ color: "darkgray", padding: 16, textAlign: 'center' }}> {/* Adjusted padding */}
                          <ViewInputInOutAsDemo
                          input={userInput}
                          wordLimit={wordLimit}
                        />
                     </div>
                  )}
                  {!isLoading && !result.length && (
                     <Box sx={{p:2, textAlign:'center', flexGrow:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
                       <Typography>Paraphrased output will appear here.</Typography>
                     </Box>
                  )}
                  {result.length > 0 && (
                    <>
                      <ParaphraseOutput
                        data={result}
                        setData={setResult}
                        synonymLevel={selectedSynonyms}
                        dataModes={modes}
                        userPackage={user?.package}
                        selectedLang={language}
                        highlightSentence={highlightSentence}
                        setOutputHistory={setOutputHistory}
                        input={userInput}
                        frozenWordTexts={frozenWordTexts}
                        socketId={socketId}
                        language={language}
                        setProcessing={setProcessing}
                        eventId={eventId}
                        setEventId={setEventId}
                      />
                      <OutputBotomNavigation
                        handleClear={handleClear}
                        highlightSentence={highlightSentence}
                        outputContend={outputContend}
                        outputHistory={outputHistory}
                        outputHistoryIndex={outputHistoryIndex}
                        outputWordCount={outputWordCount}
                        proccessing={processing}
                        sentenceCount={result.length}
                        setHighlightSentence={setHighlightSentence}
                        setOutputHistoryIndex={setOutputHistoryIndex}
                        onCheckPlagiarism={handleCheckOutputPlagiarism}
                        isCheckingPlagiarism={isCheckingOutputPlagiarism}
                        showOriginalInOutput={showOriginalInOutput}
                        onToggleShowOriginal={handleToggleShowOriginal}
                        onCopyOutputToInput={handleCopyOutputToInput} // Added prop
                      />
                    </>
                  )}
                </Box>
              )}

              {activeRightPanelTab === 'plagiarism' && (
                <OutputPlagiarismReportPanel
                  isLoading={isCheckingOutputPlagiarism}
                  result={outputPlagiarismResult}
                />
              )}
              {/* Fallback for plagiarism tab if no output to check yet */}
              {activeRightPanelTab === 'plagiarism' && !outputContend && !outputPlagiarismResult && !isCheckingOutputPlagiarism && (
                 <Box sx={{p:2, textAlign:'center', flexGrow:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
                   <Typography>Paraphrase text first to check its plagiarism.</Typography>
                 </Box>
              )}

              {user?.package === "free" && showMessage.show && activeRightPanelTab === 'output' && ( // Only show update component on output tab
                <UpdateComponent Component={showMessage.Component} />
              ) : null}
            </Grid2>
          )}
        </Grid2>
      </Card>
      <InputPlagiarismDialog
        open={showInputPlagiarismDialog}
        onClose={() => setShowInputPlagiarismDialog(false)}
        isLoading={isCheckingInputPlagiarism}
        result={inputPlagiarismResult}
      />
    </Box>
  );
};

export default ParaphraseContend;
