"use client";
import { InsertDriveFile } from "@mui/icons-material";
import { Box, Card, Divider, Grid2 } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modes } from "../../../_mock/tools/paraphrase";
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
import ParaphraseEditor from "./ParaphraseEditor";
import ParaphraseOutput from "./ParaphraseOutput";
import ViewInputInOutAsDemo from "./ViewInputInOutputAsDemo";

const SYNONYMS = {
  20: "Basic",
  40: "Intermediate",
  60: "Advanced",
  80: "Expert",
};

const ParaphraseContend = () => {
  const [selectedSynonyms, setSelectedSynonyms] = useState(SYNONYMS[20]);
  const { user, accessToken } = useSelector((state) => state.auth);
  const [outputHistoryIndex, setOutputHistoryIndex] = useState(0);
  const [highlightSentence, setHighlightSentence] = useState(0);
  const [selectedMode, setSelectedMode] = useState("Standard");
  const [outputHistory, setOutputHistory] = useState([]);
  const [outputContend, setOutputContend] = useState("");
  const [language, setLanguage] = useState("English");
  const [updateHtml, setUpdateHtml] = useState(false);
  const [procession, setProcessing] = useState(false);
  const [freezeWords, setFreezeWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { wordLimit } = useWordLimit("paraphrase");
  const [userInput, setUserInput] = useState("");
  const [socketId, setSocketId] = useState(null);
  const [eventId, setEventId] = useState(null);
  const isMobile = useResponsive("down", "sm");
  const [result, setResult] = useState([]);
  const enqueueSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const [paraphrased] = useParaphrasedMutation();
  const [showMessage, setShowMessage] = useState({
    show: false,
    Component: null,
  });

  useEffect(() => {
    if (!userInput) return;
    const language = detectLanguage(userInput);
    setLanguage(language);
  }, [userInput]);

  function handleClear() {
    setUserInput("");
    setOutputContend("");
  }
  function handleSampleText() {
    setUserInput(
      "The city streets were filled with excitement as people gathered for the annual parade. Brightly colored floats and marching bands filled the air with music and laughter. Spectators lined the sidewalks, cheering and waving as the procession passed by."
    );
  }

  const handleSubmit = async (rephrase) => {
    try {
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
        freeze: freezeWords.length ? freezeWords.join(", ") : "",
        language: language,
        mode: selectedMode ? selectedMode.toLowerCase() : "standard",
        synonym: selectedSynonyms ? selectedSynonyms.toLowerCase() : "basic",
        socketId,
        eventId,
      };

      await paraphrased(payload).unwrap();
    } catch (error) {
      console.log(error);
      const actualError = error?.data?.error;
      setResult([]);
      if (/LIMIT_REQUEST|PACAKGE_EXPIRED/.test(actualError)) {
        dispatch(setShowAlert(true));
        dispatch(setAlertMessage(actualError));
      } else if (error?.error === "UNAUTHORIZED") {
        dispatch(setShowLoginModal(true));
      } else {
        enqueueSnackbar(error?.message, { variant: "error" });
      }
      setProcessing({ success: false, loading: false });
      setIsLoading(false);
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
          />
        ) : (
          <ModeNavigationForMobile
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            freezeWords={freezeWords}
            setFreezeWords={setFreezeWords}
          />
        )}

        <Divider sx={{ borderBottom: "2px solid", borderColor: "divider" }} />

        <Grid2 container>
          <Grid2
            sx={{
              height: 520,
              overflowY: "auto",
              position: "relative",
              borderRight: { md: "2px solid" },
              borderRightColor: { md: "divider" },
              padding: 2,
              paddingBottom: 0,
            }}
            size={{ xs: 12, md: 6 }}
          >
            <ParaphraseEditor
              freezeWords={freezeWords}
              html={userInput}
              isMobile={isMobile}
              setFreezeWords={setFreezeWords}
              setHtml={setUserInput}
              user={user}
              updateHtml={updateHtml}
              wordLimit={wordLimit}
            />

            {!userInput ? (
              <UserActionInput
                setUserInput={setUserInput}
                isMobile={isMobile}
                handleSampleText={handleSampleText}
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
            />
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{
              height: 520,
              overflowY: "auto",
              borderTop: { xs: "2px solid", md: "none" },
              borderTopColor: { xs: "divider", md: undefined },
            }}
          >
            <div style={{ color: "darkgray", paddingLeft: 15 }}>
              {isLoading ? (
                <ViewInputInOutAsDemo input={input} wordLimit={wordLimit} />
              ) : !result.length ? (
                <p>{!showMessage.show && "Paraphrased Text"}</p>
              ) : null}
            </div>

            {result.length ? (
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
                freezeWords={freezeWords}
                socketId={socketId}
                language={language}
                setProcessing={setProcessing}
                eventId={eventId}
                setEventId={setEventId}
              />
            ) : null}
          </Grid2>
        </Grid2>
      </Card>
    </Box>
  );
};

export default ParaphraseContend;
