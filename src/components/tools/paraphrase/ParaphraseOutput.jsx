import { Box, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useSnackbar from "../../../hooks/useSnackbar";
import {
  useParaphraseForTaggingMutation,
  useReportForSentenceMutation,
} from "../../../redux/api/tools/toolsApi";
import EditableOutput from "./EditableOutput";
import RephraseSentenceNav from "./RephraseSentenceNav";
import RephraseSentences from "./RephraseSentences";
import Synonyms from "./Synonyms";

const ParaphraseOutput = ({
  data,
  input,
  setData,
  synonymLevel,
  userPackage,
  selectedLang,
  highlightSentence,
  setOutputHistory,
  freezeWords,
  socketId,
  language,
  setProcessing,
  eventId,
  setEventId,
  setHighlightSentence,
  paraphraseRequestCounter,
}) => {
  const [paraphraseForTagging] = useParaphraseForTaggingMutation();
  const [reportForSentence] = useReportForSentenceMutation();
  const [rephraseMode, setRephraseMode] = useState("Standard");
  const [showRephrase, setShowRephrase] = useState(false);
  const [rephraseData, setRephraseData] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sentence, setSentence] = useState("");
  const enqueueSnackbar = useSnackbar();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  // CRITICAL: Use ref to track current request to prevent stale closures
  const currentRequestRef = useRef(paraphraseRequestCounter);

  const synonymInit = {
    synonyms: [],
    sentenceIndex: -1,
    wordIndex: -1,
    showRephraseNav: false,
  };
  const [synonymsOptions, setSynonymsOptions] = useState(synonymInit);

  // Effect to clear rephrase suggestions when a new main paraphrase request is made
  useEffect(() => {
    console.log(`🔄 New paraphrase request: ${paraphraseRequestCounter}`);
    currentRequestRef.current = paraphraseRequestCounter;
    setRephraseData([]);
    setShowRephrase(false);
    setSynonymsOptions(synonymInit);
  }, [paraphraseRequestCounter]);

  // CRITICAL FIX: Log data changes for debugging
  useEffect(() => {
    if (data && data.length > 0) {
      console.log("📊 ParaphraseOutput data updated:", {
        totalSegments: data.length,
        nonNewlineSegments: data.filter(
          (s) => !(s.length === 1 && s[0].type === "newline"),
        ).length,
        firstSentence: data[0]?.slice(0, 3).map((w) => w.word),
        hasSynonyms: data.some((sentence) =>
          sentence.some((word) => word.synonyms && word.synonyms.length > 0),
        ),
      });

      // Deep check for synonym data
      let sentenceWithSynonyms = 0;
      let wordsWithSynonyms = 0;
      data.forEach((sentence, sIdx) => {
        let sentenceHasSynonyms = false;
        sentence.forEach((word, wIdx) => {
          if (word.synonyms && word.synonyms.length > 0) {
            wordsWithSynonyms++;
            sentenceHasSynonyms = true;
            if (sIdx === 0 && wIdx < 3) {
              console.log(
                `  ✅ Word "${word.word}" has ${word.synonyms.length} synonyms`,
              );
            }
          }
        });
        if (sentenceHasSynonyms) sentenceWithSynonyms++;
      });

      console.log(
        `📈 Synonym stats: ${sentenceWithSynonyms} sentences, ${wordsWithSynonyms} words with synonyms`,
      );
    }
  }, [data]);

  const replaceSynonym = (newWord) => {
    console.log(
      `🔄 Replacing word at [${synonymsOptions.sentenceIndex}][${synonymsOptions.wordIndex}] with: ${newWord}`,
    );

    setData((prevData) => {
      const newData = prevData.map((sentence, sIndex) =>
        sIndex === synonymsOptions.sentenceIndex
          ? sentence.map((wordObj, wIndex) =>
              wIndex === synonymsOptions.wordIndex
                ? { ...wordObj, word: newWord }
                : wordObj,
            )
          : sentence,
      );

      console.log("✅ Synonym replaced successfully");
      return newData;
    });
    setSynonymsOptions(synonymInit);
  };

  const handleWordClick = (event, synonyms, sentenceIndex, wordIndex) => {
    event.stopPropagation();

    console.log(`🖱️  Word clicked:`, {
      sentenceIndex,
      wordIndex,
      synonymsCount: synonyms?.length || 0,
      word: data[sentenceIndex]?.[wordIndex]?.word,
    });

    setAnchorEl(event.currentTarget);
    setSynonymsOptions({
      synonyms,
      sentenceIndex,
      wordIndex,
      showRephraseNav: true,
    });

    const sentenceArr = data[sentenceIndex];
    let sentence = "";
    for (let i = 0; i < sentenceArr.length; i++) {
      const word = sentenceArr[i].word;
      if (/^[.,]$/.test(word)) {
        sentence += word;
      } else {
        sentence += (sentence ? " " : "") + word;
      }
    }
    setSentence(sentence);
  };

  const replaceSentence = async (sentenceData) => {
    console.log(
      `🔄 Replacing sentence at index ${synonymsOptions.sentenceIndex}`,
    );

    let newData = [...data];
    newData[synonymsOptions.sentenceIndex] = sentenceData;
    setData(newData);
    setOutputHistory((prevHistory) => {
      const arr = [];
      if (!prevHistory.length) {
        arr.push(data);
      }
      arr.push(newData);
      return [...prevHistory, ...arr];
    });

    setShowRephrase(false);

    try {
      setProcessing({ success: false, loading: true });

      let sentence = "";
      const sentenceArray = newData[synonymsOptions.sentenceIndex];
      for (let i = 0; i < sentenceArray.length; i++) {
        const word = sentenceArray[i].word;
        if (/^[.,]$/.test(word)) {
          sentence += word;
        } else {
          sentence += (sentence ? " " : "") + word;
        }
      }

      const randomNumber = Math.floor(Math.random() * 10000000000);
      const newEventId = `${socketId}-${randomNumber}`;
      setEventId(newEventId);

      const payload = {
        sentence,
        socketId,
        index: synonymsOptions.sentenceIndex,
        language,
        eventId: newEventId,
      };

      console.log("📤 Sending tagging request:", payload);
      await paraphraseForTagging(payload).unwrap();
      console.log("✅ Tagging request sent successfully");
    } catch (error) {
      console.error("❌ Error replacing sentence:", error);
      setProcessing({ success: false, loading: false });
    }
    setSynonymsOptions(synonymInit);
  };

  const sendReprt = async () => {
    try {
      const inputs = input.replace(/<[^>]+>/g, "");
      const separator = selectedLang === "Bengali" ? "।" : ".";
      const sentences = inputs.split(separator);
      const output = data[synonymsOptions.sentenceIndex]
        ?.map((word) => word?.word)
        ?.join(" ");

      const payload = {
        input: sentences[synonymsOptions.sentenceIndex],
        output,
      };
      const { data: res } = await reportForSentence(payload).unwrap();

      enqueueSnackbar(res?.data?.message || "Report send successfully", {
        variant: "success",
      });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Unknown error. Please try again later.";
      enqueueSnackbar(msg, { variant: "error" });
    }
  };

  const handleCopy = async () => {
    const msg = "Sentence copied to clipboard";
    const text = data[synonymsOptions.sentenceIndex]
      ?.map((word) => word?.word)
      ?.join(" ");
    await navigator.clipboard.writeText(text);
    enqueueSnackbar(msg);
  };

  async function rephraseSentence() {
    try {
      if (!sentence || !selectedLang) {
        console.warn("⚠️  Cannot rephrase: missing sentence or language");
        return;
      }

      console.log("🔄 Starting sentence rephrase:", {
        mode: rephraseMode,
        synonymLevel,
        language: selectedLang,
      });

      setIsPending(true);
      setShowRephrase(true);
      setRephraseData([]); // Clear previous rephrase data immediately

      const url =
        process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX +
        "/p-v2/api" +
        "/paraphrase-with-variantV2";

      const token = localStorage.getItem("accessToken");
      const payload = {
        text: sentence,
        mode: rephraseMode ? rephraseMode.toLowerCase() : "standard",
        synonymLevel: synonymLevel ? synonymLevel.toLowerCase() : "basic",
        model: "sai-nlp-boost",
        language: selectedLang,
        freezeWord: freezeWords,
      };

      console.log("📤 Rephrase payload:", payload);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token ? "Bearer " + token : "",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw { message: error.message, error: error.error };
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      setIsPending(false);
      if (reader) {
        let text = "";
        const separator = selectedLang === "Bengali" ? "।" : ". ";
        const pattern = /\{[^}]+\}|\S+/g;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const buffer = decoder.decode(value, { stream: true });
          text += buffer.replaceAll("\n", " ");

          let sentences = text.split(separator);
          sentences = sentences.map((sentence) => {
            let result = sentence.match(pattern) || [];
            result = result.map((item) => {
              return {
                word: item,
                type: /\{[^}]+\}/.test(item) ? "freeze" : "none",
                synonyms: [],
              };
            });
            result.push({ word: separator.trim(), type: "none", synonyms: [] });
            return result;
          });
          sentences = sentences.filter((item) => item.length > 1);

          setRephraseData(sentences);
        }

        console.log("✅ Rephrase completed successfully");
      }
    } catch (error) {
      console.error("❌ Rephrase error:", error);
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  }

  // This useEffect should trigger rephraseSentence when the selected sentence or rephrase mode changes
  useEffect(() => {
    if (sentence && showRephrase) {
      console.log("🔄 Triggering rephrase due to sentence/mode change");
      rephraseSentence();
    }
  }, [sentence, rephraseMode]);

  return (
    <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
      <EditableOutput
        data={data}
        dark={dark}
        setSynonymsOptions={setSynonymsOptions}
        setSentence={setSentence}
        setAnchorEl={setAnchorEl}
        highlightSentence={highlightSentence}
        setHighlightSentence={setHighlightSentence}
      />

      <Synonyms
        synonyms={synonymsOptions.synonyms}
        open={!!synonymsOptions.synonyms.length}
        handleClose={() =>
          setSynonymsOptions((prev) => {
            return {
              ...synonymInit,
              sentenceIndex: prev.sentenceIndex,
              showRephraseNav: prev.showRephraseNav,
            };
          })
        }
        anchorEl={anchorEl}
        replaceSynonym={replaceSynonym}
      />
      <RephraseSentenceNav
        anchorEl={anchorEl}
        open={synonymsOptions.showRephraseNav}
        rephraseSentence={rephraseSentence}
        handleCopy={handleCopy}
        sendReprt={sendReprt}
        handleClose={() =>
          setSynonymsOptions((prev) => {
            return { ...prev, showRephraseNav: false };
          })
        }
      />
      <RephraseSentences
        open={showRephrase}
        anchorEl={anchorEl}
        handleClose={() => setShowRephrase(false)}
        userPackage={userPackage}
        replaceSentence={replaceSentence}
        rephraseData={rephraseData}
        isPending={isPending}
        setRephraseMode={setRephraseMode}
        rephraseMode={rephraseMode}
      />
    </Box>
  );
};

export default ParaphraseOutput;
