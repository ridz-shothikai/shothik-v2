"use client";
// import 'driver.js/dist/driver.min.css'
import { InsertDriveFile } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid2,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { modes } from "../../../_mock/tools/paraphrase";
import { trySamples } from "../../../_mock/trySamples";
import { trackEvent } from "../../../analysers/eventTracker";
import { detectLanguage } from "../../../hooks/languageDitector";
import useDebounce from "../../../hooks/useDebounce";
import useResponsive from "../../../hooks/useResponsive";
import useSetState from "../../../hooks/useSetState";
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
import ParaphraseOutput from "./ParaphraseOutput";
import UpdateComponent from "./UpdateComponent";
import UserInputBox from "./UserInputBox";
import VerticalMenu from "./VerticalMenu";

import { protectedPhrases, protectedSingleWords } from "./extentions";

const SYNONYMS = {
  20: "Basic",
  40: "Intermediate",
  60: "Advanced",
  80: "Expert",
};

const initialFrozenWords = new Set(protectedSingleWords);
const initialFrozenPhrase = new Set(protectedPhrases);

const ParaphraseContend = () => {
  const [selectedSynonyms, setSelectedSynonyms] = useState(SYNONYMS[20]);
  const [showLanguageDetect, setShowLanguageDetect] = useState(false);
  const [outputHistoryIndex, setOutputHistoryIndex] = useState(0);
  const [highlightSentence, setHighlightSentence] = useState(0);
  const [selectedMode, setSelectedMode] = useState("Standard");
  const [outputWordCount, setOutputWordCount] = useState(0);
  const [outputHistory, setOutputHistory] = useState([]);
  const [outputContend, setOutputContend] = useState("");
  const { user } = useSelector((state) => state.auth);
  const frozenWords = useSetState(initialFrozenWords);
  const frozenPhrases = useSetState(initialFrozenPhrase);
  const [language, setLanguage] = useState("English");
  const sampleText = trySamples.paraphrase[language || "English"];
  const [isLoading, setIsLoading] = useState(false);
  const { wordLimit } = useWordLimit("paraphrase");
  const [userInput, setUserInput] = useState("");
  const userInputValue = useDebounce(userInput, 800);
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
  const [processing, setProcessing] = useState({
    loading: false,
    success: false,
  });

  useEffect(() => {
    if (!userInput) return;
    let timer;
    const detectLang = detectLanguage(userInput);
    if (detectLang !== language) {
      setLanguage(detectLang);
      setShowLanguageDetect(true);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setShowLanguageDetect(false);
      }, 3000);
    }
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
      frozenWords.reset(initialFrozenWords);
      frozenPhrases.reset(initialFrozenPhrase);
    }
    setResult([]);
    setOutputHistory([]);
  };

  const handleSubmit = async (value) => {
    try {
      // track event
      if (!value) {
        trackEvent("click", "paraphrase", "paraphrase_click", 1);
      }
      let payload;

      setIsLoading(true);
      setResult([]);
      setOutputHistoryIndex(0);
      setProcessing({ success: false, loading: true });

      const textToParaphrase = value ? value : userInput;
      const textAsWrodsArray = textToParaphrase
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
        freeze:
          frozenWords.size > 0
            ? frozenWords.values.join(", ")
            : frozenPhrases.size > 0
            ? frozenPhrases.values.join(", ")
            : "",
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
      const actualError = error?.data?.error;
      if (/LIMIT_REQUEST|PACAKGE_EXPIRED/.test(actualError)) {
        dispatch(setShowAlert(true));
        dispatch(setAlertMessage(error?.data?.message));
      } else if (actualError === "UNAUTHORIZED") {
        dispatch(setShowLoginModal(true));
      } else {
        enqueueSnackbar(error?.data?.message || error.message, {
          variant: "error",
        });
      }
      setProcessing({ success: false, loading: false });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInputValue && !processing.loading) {
      handleSubmit(userInputValue);
    }
  }, [userInputValue]);
  function extractPlainText(array) {
    // Check if input is an array
    if (!Array.isArray(array)) {
      console.error('Input must be an array');
      return null;
    }

    // Initialize result string
    let plainText = '';

    // Iterate through each sentence array
    for (const sentence of array) {
      // Check if sentence is an array
      if (!Array.isArray(sentence)) {
        console.error('Each sentence must be an array');
        return null;
      }

      // Process each word object in the sentence
      for (const wordObj of sentence) {
        // Validate word object structure
        if (!wordObj || typeof wordObj !== 'object') {
          console.error('Invalid word object in sentence');
          return null;
        }

        // Check if word property exists and is a string
        if (typeof wordObj.word !== 'string') {
          console.error('Word property must be a string');
          return null;
        }

        // Add word to result, trim to handle extra spaces
        plainText += wordObj.word.trim();

        // Add space after word unless it's punctuation
        if (wordObj.type !== 'none' && wordObj.word !== ',') {
          plainText += ' ';
        }
      }
    }

    // Return the final string, trimmed
    return plainText.trim();
  }

  return (
    <Box>
      {/* <Onboarding/> */}
      <LanguageMenu
        isLoading={isLoading}
        setLanguage={setLanguage}
        language={language}
      />
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflow: "hidden",
        }}
      >
        <Card
          sx={{
            flex: "1 1 0%",
            minWidth: 0,
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
              initialFrozenWords={initialFrozenWords}
              frozenWords={frozenWords}
              userPackage={user?.package}
            />
          )}

          <Divider sx={{ borderBottom: "2px solid", borderColor: "divider" }} />

          <Grid2 container>
            <Grid2
              sx={{
                height: isMobile ? "calc(100vh - 340px)" : 530,
                position: "relative",
                borderRight: { md: "2px solid" },
                borderRightColor: { md: "divider" },
                padding: 2,
                paddingBottom: 0,
                display: "flex",
                flexDirection: "column",
              }}
              size={{ xs: 12, md: 6 }}
            >
              <UserInputBox
                wordLimit={wordLimit}
                setUserInput={setUserInput}
                userInput={userInput}
                frozenPhrases={frozenPhrases}
                frozenWords={frozenWords}
                user={user}
              />

              {!userInput ? (
                <UserActionInput
                  setUserInput={setUserInput}
                  isMobile={isMobile}
                  sampleText={sampleText}
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
              />

              {showLanguageDetect && (
                <Stack
                  direction='row'
                  alignItems='center'
                  component={Paper}
                  gap={2}
                  sx={{
                    position: "absolute",
                    bottom: 80,
                    left: 20,
                    padding: 1,
                  }}
                >
                  <Typography>Detected Language: </Typography>
                  <Button variant='outlined'>{language}</Button>
                </Stack>
              )}
            </Grid2>
            {isMobile && !userInput ? null : (
              <Grid2
                size={{ xs: 12, md: 6 }}
                ref={outputRef}
                sx={{
                  height: isMobile ? "calc(100vh - 340px)" : 530,
                  overflow: "hidden",
                  borderTop: { xs: "2px solid", md: "none" },
                  borderTopColor: { xs: "divider", md: undefined },
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* <div style={{ color: "darkgray", paddingLeft: 15 }}>
                  {isLoading ? (
                    <ViewInputInOutAsDemo
                      input={userInput}
                      wordLimit={wordLimit}
                    />
                  ) : !result.length ? (
                    <p>Paraphrased Text</p>
                  ) : null}
                </div> */}

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
                  freezeWords={
                    frozenWords.size > 0
                      ? frozenWords.values.join(", ")
                      : frozenPhrases.size > 0
                      ? frozenPhrases.values.join(", ")
                      : ""
                  }
                  socketId={socketId}
                  language={language}
                  setProcessing={setProcessing}
                  eventId={eventId}
                  setEventId={setEventId}
                />

                {result.length ? (
                  <>
                    {/* <ParaphraseOutput
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
                      freezeWords={
                        frozenWords.size > 0
                          ? frozenWords.values.join(", ")
                          : frozenPhrases.size > 0
                          ? frozenPhrases.values.join(", ")
                          : ""
                      }
                      socketId={socketId}
                      language={language}
                      setProcessing={setProcessing}
                      eventId={eventId}
                      setEventId={setEventId}
                    /> */}
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
                    />
                  </>
                ) : null}

                {user?.package === "free" && showMessage.show ? (
                  <UpdateComponent Component={showMessage.Component} />
                ) : null}
              </Grid2>
            )}
          </Grid2>
        </Card>
        <Box
          sx={{
            flex: "0 0 auto", // don’t grow or shrink
          }}
        >
          <VerticalMenu
            selectedMode={selectedMode}
            outputText={result}
            setOutputText={setResult}
            setSelectedMode={setSelectedMode}
            freezeWords={
              frozenWords.size > 0
                ? frozenWords.values.join(", ")
                : frozenPhrases.size > 0
                ? frozenPhrases.values.join(", ")
                : ""
            }
            plainOutput={extractPlainText(result)}
            text={userInput}
            selectedLang={language}
            highlightSentence={highlightSentence}
            setHighlightSentence={setHighlightSentence}
            selectedSynonymLevel={selectedSynonyms}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ParaphraseContend;
