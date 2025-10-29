"use client";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { trySamples } from "../../../_mock/trySamples";
import { trackEvent } from "../../../analysers/eventTracker";
import useLoadingText from "../../../hooks/useLoadingText";
import useResponsive from "../../../hooks/useResponsive";
import useSnackbar from "../../../hooks/useSnackbar";
import { setShowLoginModal } from "../../../redux/slice/auth";
import { setAlertMessage, setShowAlert } from "../../../redux/slice/tools";
import UserActionInput from "../common/UserActionInput";
import BottomBar from "./BottomBar";
import LanguageMenu from "./LanguageMenu";

const Translator = () => {
  const [outputContend, setOutputContend] = useState("");
  const { user, accessToken } = useSelector((state) => state.auth);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const isMobile = useResponsive("down", "sm");
  const enqueueSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const loadingText = useLoadingText(isLoading);
  const sampleText = trySamples.translator.English;
  const [translateLang, setTranslateLang] = useState({
    fromLang: "Auto Detect",
    toLang: "English",
  });

  const handleLanguageChange = (newLangState) => {
    setOutputContend(""); // Clear output when language changes
    setTranslateLang(newLangState);
  };

  function handleInput(e) {
    const value = e.target.value;
    setUserInput(value);
  }

  function handleClear() {
    setUserInput("");
    setOutputContend("");
  }

  async function fetchWithStreaming(payload, api = "/translator") {
    try {
      const url = process.env.NEXT_PUBLIC_API_URI + api;
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

  async function handleSubmit(payloads, url) {
    try {
      //track event
      trackEvent("click", "translator", "translator_click", 1);

      setOutputContend("");
      setIsLoading(true);
      const direction = translateLang.fromLang + " to " + translateLang.toLang;
      const payload = payloads ? payloads : { data: userInput, direction };

      await fetchWithStreaming(payload, url);
    } catch (error) {
      if (/LIMIT_REQUEST|PACAKGE_EXPIRED/.test(error?.error)) {
        dispatch(setShowAlert(true));
        dispatch(setAlertMessage(error?.message));
      } else if (error?.error === "UNAUTHORIZED") {
        dispatch(setShowLoginModal(true));
      } else {
        enqueueSnackbar(error?.message, { variant: "error" });
      }
      setOutputContend("");
    } finally {
      setIsLoading(false);
    }
  }

  const handleHumanize = async () => {
    try {
      setIsHumanizing(true);
      const payload = {
        data: outputContend,
        language: translateLang.toLang,
        mode: "Fixed",
        synonym: "Basic",
      };
      await handleSubmit(payload, "/fix-grammar");

      enqueueSnackbar("Translation humanized successfully.", {
        variant: "success",
      });
    } catch (err) {
      const error = err?.response?.data;
      if (/LIMIT_REQUEST|PACAKGE_EXPIRED/.test(error?.error)) {
        dispatch(setShowAlert(true));
        dispatch(setAlertMessage("Humanize limit exceeded, Please upgrade"));
      } else if (error?.error === "UNAUTHORIZED") {
        dispatch(setShowLoginModal(true));
      } else {
        enqueueSnackbar(error?.message, { variant: "error" });
      }
    } finally {
      setIsHumanizing(false);
    }
  };

  function reverseText() {
    if (!outputContend) return;
    const input = userInput;
    setUserInput(outputContend);
    setOutputContend(input);
  }

  return (
    <Card className="mt-4 p-8 border rounded-xl shadow-sm">
      <LanguageMenu
        isLoading={isLoading || isHumanizing}
        userInput={userInput}
        reverseText={reverseText}
        translateLang={translateLang}
        setTranslateLang={handleLanguageChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="min-h-[400px] sm:min-h-[480px] overflow-y-auto relative">
          <Textarea
            name="input"
            rows={isMobile ? 15 : 19}
            placeholder="Input your text here..."
            value={userInput}
            onChange={handleInput}
            className="w-full h-full min-h-[400px] sm:min-h-[480px] resize-none border-border focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg p-4"
          />
          {isMobile && (
            <BottomBar
              handleClear={handleClear}
              handleHumanize={handleHumanize}
              handleSubmit={handleSubmit}
              isHumanizing={isHumanizing}
              isLoading={isLoading}
              outputContend={outputContend}
              userInput={userInput}
              userPackage={user?.package}
            />
          )}
          {!userInput ? (
            <UserActionInput
              setUserInput={setUserInput}
              isMobile={isMobile}
              sampleText={sampleText}
            />
          ) : null}
        </div>
        {isMobile && !userInput ? null : (
          <div className="h-[400px] sm:h-[480px] overflow-y-auto">
            <Textarea
              name="output"
              rows={isMobile ? 15 : 19}
              placeholder="Translated text"
              value={loadingText ? loadingText : outputContend}
              disabled
              className="w-full h-full min-h-[400px] sm:min-h-[480px] resize-none border-border text-foreground disabled:opacity-100 disabled:cursor-default rounded-lg p-4"
            />
          </div>
        )}
      </div>

      {!isMobile && (
        <BottomBar
          handleClear={handleClear}
          handleHumanize={handleHumanize}
          handleSubmit={handleSubmit}
          isHumanizing={isHumanizing}
          isLoading={isLoading}
          outputContend={outputContend}
          userInput={userInput}
          userPackage={user?.package}
        />
      )}
    </Card>
  );
};

export default Translator;
