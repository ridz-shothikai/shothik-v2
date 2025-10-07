"use client";
import { Box, Card, Grid2, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { trySamples } from "../../../_mock/trySamples";
import { trackEvent } from "../../../analysers/eventTracker";
import { detectLanguage } from "../../../hooks/languageDitector";
import useDebounce from "../../../hooks/useDebounce";
import useLoadingText from "../../../hooks/useLoadingText";
import useResponsive from "../../../hooks/useResponsive";
import useSnackbar from "../../../hooks/useSnackbar";
import { useSpellCheckerMutation } from "../../../redux/api/tools/toolsApi";
import { setShowLoginModal } from "../../../redux/slice/auth";
import { setAlertMessage, setShowAlert } from "../../../redux/slice/tools";
import UserActionInput from "../common/UserActionInput";
import BottomContend from "./BottomContend";
import LanguageMenu from "./LanguageMenu";

const GrammarContend = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const [outputContend, setOutputContend] = useState("");
  const [language, setLanguage] = useState("English (US)");
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const isMobile = useResponsive("down", "sm");
  const [errors, setErrors] = useState([]);
  const [errorChecking, setErrorChecking] = useState(false);
  const enqueueSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const loadingText = useLoadingText(isLoading);
  const sampleText =
    trySamples.grammar[language.startsWith("English") ? "English" : language];
  const editorRef = useRef(null);

  const [spellChecker] = useSpellCheckerMutation();

  useEffect(() => {
    if (!userInput) return;
    const language = detectLanguage(userInput);
    console.log(language);
    setLanguage(language);
  }, [userInput]);

  const handleCheckSpelling = async () => {
    try {
      setErrorChecking(true);
      const payload = { content: userInput, language };
      const res = await spellChecker(payload).unwrap();
      const data = res?.result || [];
      setErrors(data);
      console.log(data);
    } catch (error) {
      enqueueSnackbar(
        error.message || error.data.message || "Something went wrong",
        {
          variant: "error",
        },
      );
    } finally {
      setErrorChecking(false);
    }
  };

  const text = useDebounce(userInput);

  useEffect(() => {
    if (!text) return;
    handleCheckSpelling(text);
  }, [text]);

  // Highlight errors in the text
  const getHighlightedText = () => {
    if (!userInput || errors.length === 0) {
      return userInput;
    }

    let highlightedText = userInput;
    const errorWords = errors.map((error) => error.word || error.text || error);

    // Create regex pattern for all error words
    errorWords.forEach((word) => {
      if (word) {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        highlightedText = highlightedText.replace(
          regex,
          `<span style="background-color: #fff59d; padding: 2px 0;">${word}</span>`,
        );
      }
    });

    return highlightedText;
  };

  function handleInput(e) {
    const value = e.target.innerText || e.target.value;
    setUserInput(value);
  }

  function handleClear() {
    setUserInput("");
    setOutputContend("");
    setErrors([]);
    setLanguage("English");
    if (editorRef.current) {
      editorRef.current.innerText = "";
    }
  }

  async function fetchWithStreaming(payload) {
    try {
      const url = process.env.NEXT_PUBLIC_API_URI + "/fix-grammar";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw { message: error.message, error: error.error };
      }

      const stream = response.body;
      const decoder = new TextDecoderStream();
      const reader = stream.pipeThrough(decoder).getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        setOutputContend((prev) => prev + value);
      }
    } catch (error) {
      throw error;
    }
  }

  async function handleSubmit() {
    try {
      setIsLoading(true);
      setOutputContend("");

      trackEvent("click", "grammar", "grammar_fixed_click", 1);

      const payload = {
        data: userInput,
        language,
        mode: "Fixed",
        synonym: "Basic",
      };
      await fetchWithStreaming(payload);
      setErrors([]);
    } catch (error) {
      if (/LIMIT_REQUEST|PACAKGE_EXPIRED/.test(error?.error)) {
        dispatch(setShowAlert(true));
        dispatch(setAlertMessage(error?.message));
      } else if (error?.error === "UNAUTHORIZED") {
        dispatch(setShowLoginModal(true));
      } else {
        enqueueSnackbar(error?.message, { variant: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card
      sx={{
        mt: 1,
        paddingX: 2,
        paddingTop: 1,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <LanguageMenu
        isLoading={isLoading}
        setLanguage={setLanguage}
        language={language}
      />
      <Grid2 container spacing={2}>
        <Grid2
          sx={{
            height: { xs: "auto", sm: 480 },
            overflowY: "auto",
            position: "relative",
          }}
          size={{ xs: 12, md: 6 }}
        >
          <Box
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
            sx={{
              overflowY: "auto",
              maxHeight: { xs: 360, sm: "auto" },
              minHeight: isMobile ? 360 : 456,
              padding: "16.5px 14px",
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: "0 8px 8px 8px",
              outline: "none",
              fontFamily: "inherit",
              fontSize: "1rem",
              lineHeight: 1.5,
              color: "text.primary",
              backgroundColor: "background.paper",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              "&:focus": {
                borderColor: "divider",
              },
              "&:empty:before": {
                content: '"Input your text here..."',
                color: "text.disabled",
              },
            }}
          />
          {isMobile && (
            <BottomContend
              handleClear={handleClear}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              outputContend={outputContend}
              userInput={userInput}
              userPackage={user?.package}
              language={language}
              errors={errors}
              setErrors={setErrors}
              errorChecking={errorChecking}
              setErrorChecking={setErrorChecking}
              isMobile={isMobile}
            />
          )}
          {!userInput ? (
            <UserActionInput
              setUserInput={setUserInput}
              isMobile={isMobile}
              sampleText={sampleText}
              disableTrySample={!sampleText}
            />
          ) : null}
        </Grid2>
        {isMobile && !userInput ? null : (
          <Grid2
            sx={{
              height: { xs: "auto", sm: 480 },
              overflowY: "auto",
              pb: { xs: 2, md: 0 },
            }}
            size={{ xs: 12, md: 6 }}
          >
            <TextField
              name="input"
              variant="outlined"
              rows={isMobile ? 10 : 18}
              fullWidth
              multiline
              placeholder="Corrected output"
              value={loadingText ? loadingText : outputContend}
              disabled
              sx={{
                flexGrow: 1,
                color: "text.primary",
                // overflowY: "auto",
                // maxHeight: { xs: 460, sm: "auto" },
                // // minHeight: isMobile ? 360 : 456,
                "& .MuiOutlinedInput-root": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "#242426", // Changed from "inherit"
                    WebkitTextFillColor: "#242426", // Changed from "inherit"
                    opacity: 1,
                  },
                  color: "text.primary",
                },
              }}
            />
          </Grid2>
        )}
      </Grid2>
      {!isMobile && (
        <BottomContend
          handleClear={handleClear}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          outputContend={outputContend}
          userInput={userInput}
          userPackage={user?.package}
          language={language}
          errors={errors}
          setErrors={setErrors}
          errorChecking={errorChecking}
          setErrorChecking={setErrorChecking}
          isMobile={isMobile}
        />
      )}
    </Card>
  );
};

export default GrammarContend;
