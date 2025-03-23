"use client";

import { Card, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { trackEvent } from "../../../analysers/eventTracker";
import useResponsive from "../../../hooks/useResponsive";
import useSnackbar from "../../../hooks/useSnackbar";
import useWordLimit from "../../../hooks/useWordLimit";
import { useHumanizeContendMutation } from "../../../redux/api/tools/toolsApi";
import { setShowLoginModal } from "../../../redux/slice/auth";
import { setAlertMessage, setShowAlert } from "../../../redux/slice/tools";
import UserActionInput from "../common/UserActionInput";
import LanguageMenu from "../grammar/LanguageMenu";
import AlertDialogMessage from "./AlertDialogMessage";
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
  const [outputContend, setOutputContend] = useState([]);
  const [humanizeContend] = useHumanizeContendMutation();
  const miniLabel = useResponsive("between", "md", "xl");
  const { user } = useSelector((state) => state.auth);
  const [language, setLanguage] = useState("English");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [showIndex, setShowIndex] = useState(0);
  const isMobile = useResponsive("down", "sm");
  const { wordLimit } = useWordLimit("bypass");
  const [update, setUpdate] = useState(false);
  const [model, setModel] = useState("Panda");
  const [scores, setScores] = useState([]);
  const enqueueSnackbar = useSnackbar();
  const dispatch = useDispatch();

  function handleSampleText() {
    setUserInput(
      "Shark Tank is a popular reality TV show where entrepreneurs pitch their business ideas to a panel of wealthy investors, known as 'sharks,' seeking funding and mentorship. The sharks evaluate the proposals, ask critical questions, and decide whether to invest in exchange for equity or royalties. The show offers entrepreneurs a platform to showcase innovative products and secure funding, while viewers gain insights into entrepreneurship, negotiation, and business strategies. Shark Tank has helped launch many successful businesses and inspired countless individuals to pursue their entrepreneurial dreams. Its mix of innovation, drama, and opportunity makes it a favorite among audiences worldwide."
    );
  }

  function handleClear() {
    setUserInput("");
    setScores([]);
    setShowIndex(0);
    setOutputContend([]);
  }

  const handleAiDitectors = () => {
    setLoadingAi(true);
    setTimeout(() => {
      setLoadingAi(false);
    }, 1000);
  };

  const handleSubmit = async () => {
    try {
      //track event
      trackEvent("click", "humanize", "humanize_click", 1);

      setLoadingAi(true);
      setIsLoading(true);
      setOutputContend([]);
      setScores([]);
      setShowIndex(0);
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
      setOutputContend(data.output);
      setScores(scores);
      setUpdate((prev) => !prev);
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

  return (
    <Stack>
      <LanguageMenu
        isLoading={isLoading}
        setLanguage={setLanguage}
        language={language}
      />

      <Card
        sx={{
          position: "relative",
          height: 420,
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
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
          name='input'
          variant='outlined'
          rows={13}
          fullWidth
          multiline
          placeholder='Enter your text here...'
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
            handleSampleText={handleSampleText}
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
        hasOutput={outputContend.length}
        isLoading={isLoading}
        isMobile={isMobile}
        miniLabel={miniLabel}
        model={model}
        userInput={userInput}
        wordCount={wordCount}
        wordLimit={wordLimit}
        handleAiDitectors={handleAiDitectors}
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

      {outputContend.length ? (
        <OutputNavigation
          isMobile={isMobile}
          outputs={outputContend.length}
          selectedContend={outputContend[showIndex]?.text}
          setShowIndex={setShowIndex}
          showIndex={showIndex}
        />
      ) : null}

      {/* output  */}
      <Card sx={{ height: 380, overflowY: "auto", padding: 2 }}>
        {outputContend[showIndex] ? (
          <Typography>{outputContend[showIndex].text}</Typography>
        ) : (
          <Typography sx={{ color: "text.disabled" }}>
            Humanized Contend
          </Typography>
        )}

        {showShalowAlert ? <AlertDialogMessage /> : null}
      </Card>
    </Stack>
  );
};

export default HumanizedContend;
