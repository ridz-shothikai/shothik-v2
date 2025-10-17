"use client";
import { InsertDriveFile, MoreVert } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { setShowLoginModal } from "../../../redux/slice/auth";
import { setAlertMessage, setShowAlert } from "../../../redux/slice/tools";
import UserActionInput from "../common/UserActionInput";
import WordCounter from "../common/WordCounter";
import LanguageMenu from "../grammar/LanguageMenu";
import FileHistorySidebar from "./FileHistorySidebar";
import ModeNavigation from "./ModeNavigation";
import Onboarding from "./Onboarding";
import OutputBotomNavigation from "./OutputBotomNavigation";
import ParaphraseOutput from "./ParaphraseOutput";
import UpdateComponent from "./UpdateComponent";
import UserInputBox from "./UserInputBox";
import VerticalMenu from "./VerticalMenu";

import { useParaphrasedMutation } from "../../../redux/api/tools/toolsApi";
import { setParaphraseValues } from "../../../redux/slice/inputOutput";
import {
  setActiveHistory,
  setFileHistories,
  setFileHistoriesMeta,
  setFileHistoryGroups,
  setHistories,
  setHistoryGroups,
  setIsFileHistoryLoading,
} from "../../../redux/slice/paraphraseHistorySlice";
import MultipleFileUpload from "../common/MultipleFileUpload";
import AutoFreezeSettings from "./AutoFreezeSettings";
import AutoParaphraseSettings from "./AutoParaphraseSettings";

// Define the punctuation marks that require specific spacing rules.
// This constant can be easily updated if more punctuation types need to be included.
const PUNCTUATION_FOR_SPACING = "[.,;?!:]";

/**
 * Normalizes punctuation spacing in a given text string according to standard English conventions.
 * Specifically:
 * 1. Replaces any sequence of one or more whitespace characters with a single space.
 * 2. Removes any space that immediately precedes a defined punctuation mark (e.g., "word . " becomes "word.").
 * 3. Ensures a single space immediately follows a defined punctuation mark, unless it's already
 *    followed by a space or is at the very end of the string (e.g., "word.word" becomes "word. word").
 *
 * This function is designed to be efficient for large texts by using regular expressions.
 *
 * @param {string} text The input text string to format.
 * @returns {string} The formatted text with normalized punctuation spacing.
 */
function normalizePunctuationSpacing(text) {
  if (!text) return "";

  let formattedText = text;

  // Step 1: Normalize all whitespace to single spaces and trim leading/trailing spaces.
  // This ensures a clean base for subsequent punctuation adjustments.
  // Example: "  Hello   world.  " -> "Hello world."
  formattedText = formattedText.replace(/\s+/g, " ").trim();

  // Step 2: Remove any space immediately preceding a punctuation mark.
  // The regex `\\s+(${PUNCTUATION_FOR_SPACING}+)` matches one or more spaces
  // followed by one or more punctuation marks. The `$1` in the replacement
  // ensures only the punctuation marks are kept, effectively removing the preceding spaces.
  // Example: "Hello . World" -> "Hello. World"
  // Example: "Is this ? " -> "Is this?"
  formattedText = formattedText.replace(
    new RegExp(`\\s+(${PUNCTUATION_FOR_SPACING}+)`, "g"),
    "$1",
  );

  // Step 3: Ensure a single space immediately follows a punctuation mark,
  // unless it's already followed by a space or is at the end of the string.
  // The regex `(${PUNCTUATION_FOR_SPACING}+)(?!\\s|$)` matches one or more punctuation marks
  // that are NOT followed by a whitespace character (`\\s`) or the end of the string (`$`).
  // We then replace it with the punctuation marks followed by a single space (`$1 `).
  // Example: "Hello.World" -> "Hello. World"
  // Example: "End!" -> "End! " (if not at the very end of the string)
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

// helper function to check if a mode is locked
const isModeLockedForUser = (modeValue, userPackage) => {
  const mode = modes.find((m) => m.value === modeValue);
  if (!mode) return false;
  return !mode.package.includes(userPackage || "free");
};

const ParaphraseContend = () => {
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
  console.log(outputContend, "----------- OUTPUT CONTEND -----------");
  // const sampleText =
  //   trySamples.paraphrase[
  //     language && language.startsWith("English")
  //       ? "English"
  //       : language
  //         ? language
  //         : "English"
  //   ];
  const sampleText = useMemo(() => {
    const langKey =
      language && language.startsWith("English") ? "English" : language;
    return trySamples.paraphrase[langKey] || null;
  }, [language]);

  const hasSampleText = Boolean(sampleText); // To conditionally show the Try Sample button
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

  const hasOutput = result?.length > 0 && outputContend.trim()?.length > 0; // Checking if we have actual output content
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    word: "",
    count: 0,
    action: null, // Will store the function to execute on confirm
  }); // this is for freezing word confirmation

  const {
    activeHistory,
    isUpdatedHistory,
    isUpdatedFileHistory,
    fileHistories,
  } = useSelector((state) => state.paraphraseHistory);

  // Helper function to count word occurrences in text
  const countWordOccurrences = (text, word) => {
    if (!text || !word) return 0;

    const lowerText = text.toLowerCase();
    const lowerWord = word.toLowerCase();

    // Using word boundaries to match whole words only
    const regex = new RegExp(
      `\\b${lowerWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "gi",
    );
    const matches = lowerText.match(regex);

    return matches ? matches.length : 0;
  };

  // Modified function to handle freezing with confirmation
  const handleFreezeWord = (word) => {
    console.log("handleFreezeWord called with word:", word);
    console.log("Current userInput:", userInput);
    const count = countWordOccurrences(userInput, word);

    console.log("Word:", word, "Count:", count);

    if (count > 1) {
      console.log(
        "Opening confirmation dialog for word:",
        word,
        "count:",
        count,
      );
      // Show confirmation dialog
      setConfirmationDialog({
        open: true,
        word: word,
        count: count,
        action: () => {
          frozenWords.add(word.toLowerCase());
          setConfirmationDialog({
            open: false,
            word: "",
            count: 0,
            action: null,
          });

          setTimeout(() => {
            frozenWords.add(word.toLowerCase());
            enqueueSnackbar(`Frozen all ${count} instances successfully`, {
              variant: "success",
            });
          }, 100);
        },
      });
    } else {
      console.log("Directly freezing word (count <= 1):", word);
      // Directly freeze if only one occurrence
      frozenWords.add(word.toLowerCase());
      enqueueSnackbar("Frozen successfully", { variant: "success" });
    }
  };

  // Similar function for phrases
  const handleFreezePhrase = (phrase) => {
    console.log("handleFreezePhrase called with phrase:", phrase);
    console.log("Current userInput:", userInput);
    const count = countWordOccurrences(userInput, phrase);

    console.log("Phrase:", phrase, "Count:", count);

    if (count > 1) {
      console.log(
        "Opening confirmation dialog for phrase:",
        phrase,
        "count:",
        count,
      );
      setConfirmationDialog({
        open: true,
        word: phrase,
        count: count,
        action: () => {
          frozenPhrases.add(phrase.toLowerCase());
          setConfirmationDialog({
            open: false,
            word: "",
            count: 0,
            action: null,
          });
        },
      });
    } else {
      console.log("Directly freezing phrase (count <= 1):", phrase);
      frozenPhrases.add(phrase.toLowerCase());
    }
  };

  useEffect(() => {
    console.log("Confirmation dialog state:", confirmationDialog);
  }, [confirmationDialog]);

  // Dispatch userInput to Redux
  useEffect(() => {
    dispatch(
      setParaphraseValues({ type: "input", values: { text: userInput } }),
    );
  }, [userInput, dispatch]);

  useEffect(() => {
    if (!!activeHistory?._id) return;

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

  const historyGroupsByPeriod = (histories = []) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const groups = histories?.reduce((acc, entry) => {
      const d = new Date(entry.timestamp);
      const m = d.getMonth();
      const y = d.getFullYear();
      const monthName = d.toLocaleString("default", { month: "long" });
      const key =
        m === currentMonth && y === currentYear
          ? "This Month"
          : `${monthName} ${y}`;

      if (!acc[key]) acc[key] = [];
      acc?.[key]?.push({
        _id: entry._id,
        text: entry.text,
        time: entry.timestamp,
      });
      return acc;
    }, {});

    const result = [];

    if (groups?.["This Month"]) {
      result.push({ period: "This Month", history: groups["This Month"] });
      delete groups["This Month"];
    }
    Object.keys(groups)
      .sort((a, b) => {
        const [ma, ya] = a.split(" ");
        const [mb, yb] = b.split(" ");
        const da = new Date(`${ma} 1, ${ya}`);
        const db = new Date(`${mb} 1, ${yb}`);
        return db - da;
      })
      .forEach((key) => {
        result.push({ period: key, history: groups?.[key] });
      });

    return result;
  };

  const fetchHistory = async () => {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX + "/p-v2/api";

    // const API_BASE = "http://localhost:3050/api";

    try {
      const res = await fetch(`${API_BASE}/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      const groups = historyGroupsByPeriod(data || []);

      dispatch(setHistories(data));
      dispatch(setHistoryGroups(groups));
    } catch (err) {
      console.error(err);
    }
  };

  // Effect to update outputContend and outputWordCount when result changes
  useEffect(() => {
    if (result?.length > 0) {
      const plainText = extractPlainText(result);
      setOutputContend(plainText);
      setOutputWordCount(
        plainText.split(/\s+/).filter((w) => w.length > 0).length,
      );
    } else {
      setOutputContend("");
      setOutputWordCount(0);
      dispatch(
        setParaphraseValues({ type: "output", values: { text: "", data: [] } }),
      ); // Clear output in Redux
    }
  }, [result, dispatch]); // Add dispatch to dependency array

  // State to track completed events and reload history;
  const [completedEvents, setCompletedEvents] = useState({
    plain: false,
    tagging: false,
    synonyms: false,
  });

  // Fixed frontend socket handling - based on your working version
  useEffect(() => {
    if (!!activeHistory?._id) return;
    setCompletedEvents({ plain: false, tagging: false, synonyms: false });

    const socket = io(process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX, {
      path: "/p-v2/socket.io",
      transports: ["websocket"],
      auth: { token: accessToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    // const socket = io("http://localhost:3050", {
    //   path: "/socket.io",
    //   transports: ["websocket"],
    //   auth: { token: accessToken },
    //   reconnection: true,
    //   reconnectionAttempts: 5,
    //   reconnectionDelay: 2000,
    // });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setSocketId(socket.id);
    });

    socket.on("disconnect", () => {
      console.warn("Socket disconnected");
      setSocketId("");
    });

    let accumulatedText = "";

    function mapBackendIndexToResultIndex(backendIndex, result) {
      const sentenceSlots = [];
      result.forEach((seg, idx) => {
        if (!(seg.length === 1 && seg[0].type === "newline"))
          sentenceSlots.push(idx);
      });
      return sentenceSlots[backendIndex] ?? -1;
    }

    const sentenceSeparator =
      language === "Bangla"
        ? /(?:।\s+|\.\r?\n+)/ // Bangla: either "। " or ".\n"
        : /(?:\.\s+|\.\r?\n+)/;

    // ─── 2) Plain handler: clear `result` on first chunk of each run ────────────
    socket.on("paraphrase-plain", (data) => {
      console.log("paraphrase-plain:", data);
      if (data === ":end:") {
        accumulatedText = "";
        setIsLoading(false);
        setCompletedEvents((prev) => ({ ...prev, plain: true }));
        return;
      }

      if (completedEvents.plain) return; // If we already got :end: from backend that means we have the data.

      // if this is the very first chunk of a brand-new run, wipe out old result:
      if (accumulatedText === "") {
        setResult([]);
      }

      // accumulate raw Markdown
      accumulatedText += data.replace(/[{}]/g, "");

      // console.log("Accumulated Text (before normalization):", accumulatedText);

      // update word count, etc…
      setOutputContend(accumulatedText);
      setOutputWordCount(
        accumulatedText.split(/\s+/).filter((w) => w.length > 0).length,
      );

      // rebuild `result` with blank lines preserved
      // const lines = accumulatedText.split("\n");

      const lines = accumulatedText.split(/\r?\n/);
      const sentenceSeparator =
        language === "Bangla" ? /(?:।\s+|\.\r?\n+)/ : /(?:\.\s+|\.\r?\n+)/;
      const newResult = [];
      lines.forEach((line) => {
        if (!line.trim()) {
          newResult.push([{ word: "\n", type: "newline", synonyms: [] }]);
        } else {
          line
            .split(sentenceSeparator)
            .filter(Boolean)
            .forEach((sentence) => {
              const words = sentence
                .trim()
                .split(/\s+/)
                ?.map((w) => ({ word: w, type: "none", synonyms: [] }));
              newResult.push(words);
            });
        }
      });
      setResult(newResult);
      dispatch(
        setParaphraseValues({
          type: "output",
          values: { text: accumulatedText },
        }),
      );
      console.log("new plain result:", newResult);
    });

    // ─── 3) Tagging handler: map backend index to correct slot ─────────────────
    socket.on("paraphrase-tagging", (raw) => {
      if (raw === ":end:") {
        // setIsLoading(false);
        setCompletedEvents((prev) => ({ ...prev, tagging: true }));
        return;
      }
      // if (completedEvents.tagging) return; // if we already got the :end: then we have the data from the backend
      console.log("paraphrase-tagging: ", raw);
      let parsed, backendIndex, eid;
      try {
        ({ index: backendIndex, eventId: eid, data: parsed } = JSON.parse(raw));
        if (eid !== eventId) return;
      } catch (err) {
        console.error("Error parsing paraphrase-tagging:", err);
        return;
      }

      setResult((prev) => {
        const updated = [...prev];
        const targetIdx = mapBackendIndexToResultIndex(backendIndex, prev);
        if (targetIdx < 0) {
          console.warn("tagging: couldn't map index", backendIndex);
          return prev;
        }

        updated[targetIdx] = parsed?.map((item) => ({
          ...item,
          // word: item.word, // preserves markdown tokens
          word: item.word.replace(/[{}]/g, ""),
        }));
        console.log(
          "updated[targetIdx]: ",
          updated[targetIdx],
          "targetIdx: ",
          targetIdx,
          "backendIndex: ",
          backendIndex,
        );
        return updated;
      });
    });

    // ─── 4) Synonyms handler: same index mapping ────────────────────────────────
    socket.on("paraphrase-synonyms", (raw) => {
      console.log("paraphrase-synonyms:", raw);
      if (raw === ":end:") {
        setProcessing({ success: true, loading: false });
        setCompletedEvents((prev) => ({ ...prev, synonyms: true }));
        return;
      }

      // if (completedEvents.synonyms) return; // If this is true then we already got the data from the backend.

      let analysis, backendIndex, eid;
      try {
        ({
          index: backendIndex,
          eventId: eid,
          data: analysis,
        } = JSON.parse(raw));
        if (eid !== eventId) return;
      } catch (err) {
        console.error("Error parsing paraphrase-synonyms:", err);
        return;
      }

      console.log(result, "MAP RESULT");

      if (result.length) {
        setResult((prev) => {
          const updated = [...prev];
          const targetIdx = mapBackendIndexToResultIndex(backendIndex, prev);
          if (targetIdx < 0) {
            console.warn("synonyms: couldn't map index", backendIndex);
            return prev;
          }

          if (Array.isArray(analysis) && analysis?.length > 0) {
            updated[targetIdx] = analysis?.map((item) => ({
              ...item,
              // word: item.word,
              word: item.word.replace(/[{}]/g, ""),
            }));
            return updated;
          }
        });
      }
    });
  }, [language, eventId]);

  useEffect(() => {
    console.log("completedEvents:", completedEvents);
    if (completedEvents.plain && accessToken) {
      console.log("✅ All socket events finished");

      const timer = setTimeout(() => {
        fetchHistory();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [completedEvents, accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    fetchHistory();
  }, [accessToken]);

  // File History Processes

  const fileHistoryGroupsByPeriod = (histories = []) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const groups = histories?.reduce((acc, entry) => {
      const d = new Date(entry?.timestamp);
      const m = d.getMonth();
      const y = d.getFullYear();
      const monthName = d.toLocaleString("default", { month: "long" });
      const key =
        m === currentMonth && y === currentYear
          ? "This Month"
          : `${monthName} ${y}`;

      if (!acc[key]) acc[key] = [];
      acc?.[key]?.push({
        ...(entry || {}),
      });
      return acc;
    }, {});

    const result = [];

    if (groups?.["This Month"]) {
      result.push({ period: "This Month", history: groups["This Month"] });
      delete groups["This Month"];
    }
    Object.keys(groups)
      .sort((a, b) => {
        const [ma, ya] = a.split(" ");
        const [mb, yb] = b.split(" ");
        const da = new Date(`${ma} 1, ${ya}`);
        const db = new Date(`${mb} 1, ${yb}`);
        return db - da;
      })
      .forEach((key) => {
        result.push({ period: key, history: groups?.[key] });
      });

    return result;
  };

  const fetchFileHistories = async ({
    page = 1,
    limit = 10,
    reset = false,
    search = "",
  } = {}) => {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX + "/p-v2/api";

    // const API_BASE = "http://localhost:3050/api";
    try {
      if (!accessToken) return;
      dispatch(setIsFileHistoryLoading(true));

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search: search.trim() }),
      });

      const res = await fetch(
        `${API_BASE}/files/file-histories?${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!res.ok) console.error("Failed to fetch file history");

      const { data = [], meta = {} } = await res.json();

      if (reset) {
        const groups = fileHistoryGroupsByPeriod(data || []);
        dispatch(setFileHistories(data || []));
        dispatch(setFileHistoryGroups(groups || []));
        dispatch(setFileHistoriesMeta(meta || {}));
      } else {
        const allHistories = [...(fileHistories || []), ...(data || [])];
        const groups = fileHistoryGroupsByPeriod(allHistories || []);
        dispatch(setFileHistories(allHistories || []));
        dispatch(setFileHistoryGroups(groups || []));
        dispatch(setFileHistoriesMeta(meta || {}));
      }
    } catch (err) {
      console.error("Error fetching file histories:", err);
    } finally {
      dispatch(setIsFileHistoryLoading(false));
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    fetchFileHistories({ reset: true });
  }, [isUpdatedFileHistory, accessToken]);

  // useEffect(() => {
  //   const socket = io(process.env.NEXT_PUBLIC_PARAPHRASE_SOCKET, {
  //     transports: ["websocket"],
  //     auth: { token: accessToken },
  //     reconnection: true,
  //     reconnectionAttempts: 5,
  //     reconnectionDelay: 2000,
  //   });

  //   socket.on("connect", () => {
  //     console.log("Socket connected:", socket.id);
  //     setSocketId(socket.id);
  //   });

  //   socket.on("disconnect", () => {
  //     console.warn("Socket disconnected");
  //     setSocketId("");
  //   });

  //   let accumulatedText = "";

  //   // ─── 1) Helper to map the backend index into your result array ───────────────
  //   function mapBackendIndexToResultIndex(backendIndex, result) {
  //     // Build an array of the actual positions in `result[]` that are real sentences
  //     const sentenceSlots = [];
  //     result.forEach((sentence, idx) => {
  //       const isBlank = sentence.length === 1 && sentence[0].type === "newline";
  //       if (!isBlank) sentenceSlots.push(idx);
  //     });
  //     // Look up the slot for this backendIndex; if missing, return –1
  //     return sentenceSlots[backendIndex] ?? -1;
  //   }
  //   // function mapBackendIndexToResultIndex(backendIndex, result) {
  //   //   let nonBlankCount = 0;
  //   //   for (let i = 0; i < result.length; i++) {
  //   //     const node = result[i];
  //   //     const isBlank = node.length === 1 && node[0].type === "newline";
  //   //     if (!isBlank) {
  //   //       if (nonBlankCount === backendIndex) return i;
  //   //       nonBlankCount++;
  //   //     }
  //   //   }
  //   //   return -1;
  //   // }

  //   // ─── 2) Plain handler: clear `result` on first chunk of each run ────────────
  //   socket.on("paraphrase-plain", (data) => {
  //     console.log("paraphrase-plain:", data);
  //     if (data === ":end:") {
  //       accumulatedText = "";
  //       setIsLoading(false);
  //       return;
  //     }

  //     // if this is the very first chunk of a brand-new run, wipe out old result:
  //     if (accumulatedText === "") {
  //       setResult([]);
  //     }

  //     // accumulate raw Markdown
  //     accumulatedText += data.replace(/[{}]/g, "");

  //     // update word count, etc…
  //     setOutputContend(accumulatedText);
  //     setOutputWordCount(
  //       accumulatedText.split(/\s+/).filter((w) => w.length > 0).length,
  //     );

  //     // rebuild `result` with blank lines preserved
  //     const lines = accumulatedText.split("\n");
  //     const separator = language === "Bangla" ? "। " : ". ";
  //     const newResult = [];

  //     lines.forEach((line) => {
  //       if (line.trim() === "") {
  //         newResult.push([{ word: "\n", type: "newline", synonyms: [] }]);
  //       } else {
  //         line
  //           .split(separator)
  //           .filter(Boolean)
  //           .forEach((sentence) => {
  //             const words = sentence
  //               .trim()
  //               .split(/\s+/)
  //               .map((w) => ({ word: w, type: "none", synonyms: [] }));
  //             newResult.push(words);
  //           });
  //       }
  //     });

  //     setResult(newResult);
  //     console.log("new plain result:", newResult);
  //   });

  //   // ─── 3) Tagging handler: map backend index to correct slot ─────────────────
  //   socket.on("paraphrase-tagging", (raw) => {
  //     if (raw === ":end:") return;

  //     let parsed, backendIndex, eid;
  //     try {
  //       ({ index: backendIndex, eventId: eid, data: parsed } = JSON.parse(raw));
  //       if (eid !== eventId) return;
  //     } catch (err) {
  //       console.error("Error parsing paraphrase-tagging:", err);
  //       return;
  //     }

  //     setResult((prev) => {
  //       const updated = [...prev];
  //       const targetIdx = mapBackendIndexToResultIndex(backendIndex, prev);
  //       if (targetIdx < 0) {
  //         console.warn("tagging: couldn't map index", backendIndex);
  //         return prev;
  //       }

  //       updated[targetIdx] = parsed.map((item) => ({
  //         ...item,
  //         word: item.word, // preserves markdown tokens
  //       }));
  //       return updated;
  //     });
  //   });

  //   // ─── 4) Synonyms handler: same index mapping ────────────────────────────────
  //   socket.on("paraphrase-synonyms", (raw) => {
  //     console.log("paraphrase-synonyms:", raw);
  //     if (raw === ":end:") {
  //       console.log("Synonyms processing completed.");
  //       setProcessing({ success: true, loading: false });
  //       return;
  //     }

  //     let analysis, backendIndex, eid;
  //     try {
  //       ({
  //         index: backendIndex,
  //         eventId: eid,
  //         data: analysis,
  //       } = JSON.parse(raw));
  //       if (eid !== eventId) return;
  //     } catch (err) {
  //       console.error("Error parsing paraphrase-synonyms:", err);
  //       return;
  //     }

  //     setResult((prev) => {
  //       const updated = [...prev];
  //       const targetIdx = mapBackendIndexToResultIndex(backendIndex, prev);
  //       if (targetIdx < 0) {
  //         console.warn("synonyms: couldn't map index", backendIndex);
  //         return prev;
  //       }

  //       updated[targetIdx] = analysis.map((item) => ({
  //         ...item,
  //         word: item.word,
  //       }));
  //       return updated;
  //     });
  //   });

  //   // socket.on("paraphrase-tagging", (data) => {
  //   //   console.log('paraphrase-tagging: ', data)
  //   //   try {
  //   //     const sentence = JSON.parse(data);
  //   //     if (sentence.eventId === eventId) {
  //   //       setResult((prev) => {
  //   //         const updated = [...prev];
  //   //         updated[sentence.index] = sentence.data;
  //   //         return updated;
  //   //       });
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("Error parsing paraphrase-tagging data:", error);
  //   //   }
  //   // });
  //   //
  //   // socket.on("paraphrase-synonyms", (data) => {
  //   //   if (data === ":end:") {
  //   //     console.log("Synonyms processing completed.");
  //   //     setProcessing({ success: true, loading: false });
  //   //     return;
  //   //   }
  //   //
  //   //   try {
  //   //     const sentence = JSON.parse(data);
  //   //     if (sentence.eventId === eventId) {
  //   //       setResult((prev) => {
  //   //         const updated = [...prev];
  //   //         updated[sentence.index] = sentence.data;
  //   //         return updated;
  //   //       });
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("Error parsing paraphrase-synonyms data:", error);
  //   //   }
  //   // });
  // }, [language, eventId]);

  // const handleClear = (_, action = "all") => {
  //   if (action === "all") {
  //     setUserInput("");
  //     frozenWords.reset(initialFrozenWords);
  //     frozenPhrases.reset(initialFrozenPhrase);
  //     dispatch(setParaphraseValues({ type: "input", values: { text: "" } }));
  //     dispatch(
  //       setParaphraseValues({ type: "output", values: { text: "", data: [] } }),
  //     );
  //   }
  //   setResult([]);
  //   setOutputHistory([]);
  //   setParaphraseRequestCounter((prev) => prev + 1); // Increment counter on clear
  // };

  function handleClear(_, action = "all") {
    if (action === "all") {
      // Clear everything including input
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
      // Only clear output, preserve input
      setResult([]);
      setOutputHistory([]);
      dispatch(
        setParaphraseValues({ type: "output", values: { text: "", data: [] } }),
      );
    }
    setParaphraseRequestCounter((prev) => prev + 1);
  }

  useEffect(() => {
    if (!!activeHistory?._id) return;

    // If user *wants* to paraphrase quotations, we need to *un*-freeze any
    // previously frozen quoted phrases.
    if (paraphraseQuotations) {
      for (const phrase of frozenPhrases.set) {
        // match only strings that start AND end with a double-quote
        if (/^".+"$/.test(phrase)) {
          frozenPhrases.remove(phrase);
        }
      }
      return; // and skip the auto-freeze step
    }

    // Otherwise (they DON'T want quotations paraphrased), auto-freeze them:
    const words = userInput
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const finalText = words.slice(0, wordLimit).join(" ");

    if (words.length <= wordLimit) {
      const quotedPhrases = [...finalText?.matchAll(/"[^"]+"/g)]?.map(
        (m) => m[0],
      );
      for (const phrase of quotedPhrases) {
        frozenPhrases.add(phrase.trim());
      }
    }
  }, [userInputValue, paraphraseQuotations]);

  const handleSubmit = async (value) => {
    try {
      // Clear any locked mode messages when starting a new paraphrase
      if (showMessage.show) {
        setShowMessage({ show: false, Component: null });
      }

      setCompletedEvents({
        plain: false,
        tagging: false,
        synonyms: false,
      }); // For restarting flags.
      // track event
      if (!value) {
        trackEvent("click", "paraphrase", "paraphrase_click", 1);
      }

      if (!socketId) return;

      // if (!!activeHistory?._id) return;

      setActiveHistory({});
      setActiveHistoryDetails(null);

      let payload;

      setIsLoading(true);
      setResult([]);
      setOutputHistoryIndex(0);
      setProcessing({ success: false, loading: true });
      setParaphraseRequestCounter((prev) => prev + 1); // Increment counter on new request
      // use the full raw Markdown string for payload
      const textToParaphrase = value || userInput;

      console.log("=== Sending to Backend ===");
      console.log("Text:", textToParaphrase);
      console.log("========================");

      // but enforce word-limit on a plain-text version
      // strip common markdown tokens for counting
      const plainTextForCount = textToParaphrase
        .replace(/(```[\s\S]*?```)|(`[^`]*`)/g, "$1") // keep code blocks, but...
        .replace(/[#*_>\-\[\]\(\)~`]/g, "") // remove markdown markers
        .trim();
      const wordCount = plainTextForCount
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
      if (wordCount > wordLimit) {
        throw { error: "LIMIT_REQUEST", message: "Words limit exceeded" };
      }

      // now build your payload using the untouched Markdown
      const randomNumber = Math.floor(Math.random() * 1e10);
      const newEventId = `${socketId}-${randomNumber}`;
      setEventId(newEventId);
      console.log("EventId:", eventId, socketId);

      // if (!eventId) return;

      const freeze = [
        ...(frozenWords?.values || []),
        ...(frozenPhrases?.values || []),
      ]
        .filter(Boolean)
        .join(", ");
      payload = {
        text: textToParaphrase,
        freeze,
        language: language,
        mode: selectedMode ? selectedMode.toLowerCase() : "standard",
        synonym: selectedSynonyms ? selectedSynonyms.toLowerCase() : "basic",
        socketId,
        eventId: eventId || newEventId,
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
    if (!!activeHistory?._id) return;
    // only auto-start if the setting is ON

    // Check if current mode is locked for user
    const isLocked = isModeLockedForUser(selectedMode, user?.package);

    // If mode is locked, show message and don't auto-paraphrase
    if (isLocked) {
      setShowMessage({ show: true, Component: selectedMode });
      if (result?.length > 0) {
        handleClear("", "output"); // Clear output if any
      }
      return;
    }

    // Clear message if mode is not locked
    if (!isLocked && showMessage.show) {
      setShowMessage({ show: false, Component: null });
    }

    // only auto-start if the setting is ON
    if (!automaticStartParaphrasing) {
      if (result?.length > 0) {
        enqueueSnackbar("Click Rephrase to view the updated result.", {
          variant: "info",
        });
        handleClear("", "output");
      }
      return;
    }

    // Trigger paraphrase if language changes and there is user input
    if (language && userInputValue) {
      if (!processing.loading) {
        console.log("=== Auto-paraphrasing ===", activeHistory?._id);
        handleSubmit(userInputValue);
      } else {
        enqueueSnackbar("Please wait while paraphrasing is in progress...", {
          variant: "info",
        });
        handleClear("", "output");
      }
    }
  }, [
    automaticStartParaphrasing,
    userInputValue,
    language,
    selectedMode,
    selectedSynonyms,
    user?.package,
  ]); // All the dependencies that should trigger re-paraphrasing are listed here.

  useEffect(() => {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX + "/p-v2/api";

    // const API_BASE = "http://localhost:3050/api";

    const getHistoryDetails = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(`${API_BASE}/history/${activeHistory?._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        });
        if (!res.ok) return console.error("Failed to fetch history details");
        const data = await res.json();

        console.log("History details:", data);

        setActiveHistoryDetails(data);

        const capitalize = (str) =>
          typeof str === "string" && str.length > 0
            ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
            : str;

        if (data?.payload?.language) setLanguageState(data?.payload?.language);
        if (data?.payload?.mode)
          setSelectedModeState(capitalize(data.payload.mode));
        if (data?.payload?.synonym)
          setSelectedSynonymsState(capitalize(data.payload.synonym));
        if (data?.payload?.text) setUserInputState(data?.payload?.text);
        frozenWords.reset(data?.payload?.freeze?.split(",") || []);

        if (data?.response) {
          function mapBackendIndexToResultIndex(backendIndex, result) {
            const sentenceSlots = [];
            result.forEach((seg, idx) => {
              if (!(seg.length === 1 && seg[0].type === "newline"))
                sentenceSlots.push(idx);
            });
            return sentenceSlots[backendIndex] ?? -1;
          }

          if (data?.response?.plain) {
            const accumulatedText = data?.response?.plain || "";

            setOutputContend(accumulatedText);

            const lines = accumulatedText.split(/\r?\n/);
            const sentenceSeparator =
              language === "Bangla"
                ? /(?:।\s+|\.\r?\n+)/
                : /(?:\.\s+|\.\r?\n+)/;

            const newResult = [];
            lines.forEach((line) => {
              if (!line.trim()) {
                newResult.push([{ word: "\n", type: "newline", synonyms: [] }]);
              } else {
                line
                  .split(sentenceSeparator)
                  .filter(Boolean)
                  .forEach((sentence) => {
                    const words = sentence
                      .trim()
                      .split(/\s+/)
                      ?.map((w) => ({
                        word: w,
                        type: "none",
                        synonyms: [],
                      }));
                    newResult.push(words);
                  });
              }
            });
            setResult(newResult);
            dispatch(
              setParaphraseValues({
                type: "output",
                values: { text: accumulatedText },
              }),
            );
            console.log("new plain result:", newResult);
          }

          if (data?.response?.tagging) {
            data?.response?.tagging?.forEach((item, index) => {
              let parsed = item?.data || [];
              let backendIndex = item?.index;
              let eid;

              setResult((prev) => {
                const updated = [...prev];
                const targetIdx = mapBackendIndexToResultIndex(
                  backendIndex,
                  prev,
                );
                if (targetIdx < 0) {
                  console.warn("tagging: couldn't map index", backendIndex);
                  return prev;
                }

                updated[targetIdx] = parsed?.map((item) => ({
                  ...item,
                  // word: item.word, // preserves markdown tokens
                  word: item.word.replace(/[{}]/g, ""),
                }));
                console.log(
                  "updated[targetIdx]: ",
                  updated[targetIdx],
                  "targetIdx: ",
                  targetIdx,
                  "backendIndex: ",
                  backendIndex,
                );
                return updated;
              });
            });
          }

          if (data?.response?.synonyms) {
            data?.response?.synonyms?.forEach((item, index) => {
              let parsed = item?.data || [];
              let backendIndex = item?.index;
              let eid;

              setResult((prev) => {
                const updated = [...prev];
                const targetIdx = mapBackendIndexToResultIndex(
                  backendIndex,
                  prev,
                );
                if (targetIdx < 0) {
                  console.warn("tagging: couldn't map index", backendIndex);
                  return prev;
                }

                updated[targetIdx] = parsed?.map((item) => ({
                  ...item,
                  // word: item.word, // preserves markdown tokens
                  word: item.word.replace(/[{}]/g, ""),
                }));
                console.log(
                  "updated[targetIdx]: ",
                  updated[targetIdx],
                  "targetIdx: ",
                  targetIdx,
                  "backendIndex: ",
                  backendIndex,
                );
                return updated;
              });
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!!activeHistory?._id) {
      getHistoryDetails();
    }
  }, [activeHistory]);

  function extractPlainText(array) {
    // Check if input is an array
    if (!Array.isArray(array)) {
      console.log("Input must be an array");
      return null;
    }

    let allSegments = []; // Renamed for clarity, as it holds both sentences and newlines

    // Iterate through each segment (which can be a sentence array or a newline indicator)
    for (const segment of array) {
      // Check if segment is an array
      if (!Array.isArray(segment)) {
        console.error("Each segment must be an array");
        return null;
      }

      // Handle newline segments separately to preserve their structure
      if (segment.length === 1 && segment[0].type === "newline") {
        allSegments.push("\n");
        continue; // Move to the next segment
      }

      const wordsInCurrentSegment = [];
      // Process each word object in the current segment
      for (const wordObj of segment) {
        // Validate word object structure
        if (!wordObj || typeof wordObj !== "object") {
          console.error("Invalid word object in segment");
          return null;
        }
        // Check if word property exists and is a string
        if (typeof wordObj.word !== "string") {
          console.error("Word property must be a string");
          return null;
        }
        wordsInCurrentSegment.push(wordObj.word);
      }
      // Join words within the current segment with a single space
      allSegments.push(wordsInCurrentSegment.join(" "));
    }

    // Join all processed segments (sentences and newlines) with a space.
    // This ensures words are correctly spaced. The normalizePunctuationSpacing
    // function will then handle any excess spaces and punctuation-specific spacing.
    let plainText = allSegments.join(" ");

    // Apply the punctuation spacing normalization as the final cleanup step
    plainText = normalizePunctuationSpacing(plainText);

    return plainText;
  }

  // Frozen words logic
  const stableFrozenWords = useMemo(() => {
    // Created a sorted array from the set and join it into a string.
    // This string will only change if the contents of the set change.
    return Array.from(frozenWords.set).sort().join(",");
  }, [frozenWords]); // This calculation only re-runs when frozenWords changes

  // This effect is to extract freeze recommendations from userQuery
  useEffect(() => {
    // if (!!activeHistory?._id) return;

    if (!userInput) {
      setRecommendedFreezeWords([]);
      return;
    }

    // console.log("extracting recommendations data");

    // A simple function to get unique, non-trivial words
    const getWords = userInput
      .toLowerCase()
      .replace(/[.,!?"']/g, "") // Remove basic punctuation
      .split(/\s+/)
      .filter((word) => word.length > 3); // Filter out very short words

    const uniqueWords = [...new Set(getWords)];

    // Filter out any words that are already in the frozen set.
    const availableWords = uniqueWords.filter(
      (word) => !frozenWords.set.has(word),
    );

    // Select up to 5 random words for recommendation
    const randomWords = availableWords
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    // console.log(randomWords, "recomended words");

    setRecommendedFreezeWords(randomWords);
  }, [userInputValue, stableFrozenWords]); // This effect runs whenever userInput, frozenWords changes

  const paidUser =
    user?.package === "pro_plan" ||
    user?.package === "value_plan" ||
    user?.package === "unlimited";

  return (
    <Box sx={{ display: "flex", width: "100%", overflow: "hidden", pt: 2 }}>
      {!isMobile && (
        <Box
          sx={{
            flex: "0 0 auto",
            width: "min-content",
            mr: 2,
            transition: "width 200ms",
            // when collapsed you could toggle a class to shrink to e.g. 40px
          }}
        >
          <FileHistorySidebar fetchFileHistories={fetchFileHistories} />
        </Box>
      )}

      <Box
        sx={{
          flex: "1 1 auto", // can grow & shrink
          minWidth: 0, // allow inner overflow hidden
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {showDemo ? <Onboarding /> : null}

        {/* desktop: language tabs outside card; hide on mobile */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            width: "100%", // match card width
            flex: "0 0 auto",
            // padding: '0 20px'
          }}
        >
          <LanguageMenu
            isLoading={isLoading || processing.loading}
            setLanguage={setLanguage}
            language={language}
          />
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: {
                xs: 1,
                lg: 2,
              },
            }}
          >
            <AutoFreezeSettings />
            <AutoParaphraseSettings />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflow: "visible",
            flex: "1 1 auto", // ← allow this wrapper to grow/shrink
            minWidth: 0, // ← so its children can shrink
            width: "100%", // ← match the language menu’s 100%
          }}
        >
          <Card
            sx={{
              flex: "1 1 auto", // fill remaining height
              minWidth: 0, // allow it to shrink
              width: "100%",
              mt: 0,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "0 12px 12px 12px",
              overflow: "visible",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* <Card */}
            {/*   sx={{ */}
            {/*     flex: "1 1 0%", */}
            {/*     minWidth: 0, */}
            {/*     width: "100%", */}
            {/*     mt: 0, */}
            {/*     border: "1px solid", */}
            {/*     borderColor: "divider", */}
            {/*     borderRadius: "12px", */}
            {/*     overflow: "visible", */}
            {/*   }} */}
            {/* > */}
            {/* mobile: selected language button in card header */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                borderBottom: 1,
                borderColor: "divider",
                px: 2,
                py: 1,
              }}
            >
              <LanguageMenu
                isLoading={isLoading}
                setLanguage={setLanguage}
                language={language}
              />
              {/* three-dots overflow menu for mobile */}
              <IconButton size="small" onClick={() => setMobileMenuOpen(true)}>
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
            {/* {!isMobile ? ( */}
            <Box
              sx={{
                display: { xs: "none", lg: "block" },
              }}
            >
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
            </Box>
            {/* ) : ( */}
            {/* <ModeNavigationForMobile
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                initialFrozenWords={initialFrozenWords}
                frozenWords={frozenWords}
                userPackage={user?.package}
                isLoading={processing.loading}
              /> */}
            {/* )} */}

            <Divider
              sx={{
                display: { xs: "none", lg: "block" },
                borderBottom: "2px solid",
                borderColor: "divider",
              }}
            />

            <Grid2 container>
              <Grid2
                sx={{
                  height: {
                    xs: "400px",
                    md: "450px",
                    lg: "530px",
                  },
                  position: "relative",
                  borderRight: { lg: "2px solid" },
                  borderRightColor: { lg: "divider" },
                  borderBottom: { xs: "2px solid", lg: "0px" },
                  borderBottomColor: { xs: "divider", lg: "transparent" },
                  // padding: 2,
                  paddingBottom: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
                size={{ xs: 12, lg: 6 }}
              >
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

                {!userInput ? (
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
                ) : null}
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
                  userInput={userInput}
                  userPackage={user?.package}
                  toolName="paraphrase"
                  btnIcon={isMobile ? null : <InsertDriveFile />}
                  sx={{ py: { md: 1 } }}
                  dontDisable={true}
                  sticky={320}
                  freeze_modal={true}
                />

                {showLanguageDetect && (
                  <Stack
                    direction="row"
                    alignItems="center"
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
                    <Button variant="outlined">{language}</Button>
                  </Stack>
                )}
              </Grid2>

              <Grid2
                size={{ xs: 12, lg: 6 }}
                ref={outputRef}
                sx={{
                  height: {
                    xs: "480px",
                    sm: "450px",
                    lg: "530px",
                  },
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
                <Box
                  sx={{
                    display: {
                      xs: "block",
                      lg: "none",
                      borderBottom: "1px solid",
                      borderBottomColor: "#F4F6F8",
                    },
                  }}
                >
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
                </Box>

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
                  paraphraseRequestCounter={paraphraseRequestCounter} // Pass the counter
                />

                {result?.length ? (
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
                  </>
                ) : null}

                {showMessage.show &&
                isModeLockedForUser(showMessage.Component, user?.package) ? (
                  <UpdateComponent Component={showMessage.Component} />
                ) : null}
              </Grid2>
            </Grid2>
          </Card>

          <SwipeableDrawer
            anchor="bottom"
            open={mobileMenuOpen}
            onOpen={() => setMobileMenuOpen(true)}
            onClose={() => setMobileMenuOpen(false)}
          >
            {/* you can wrap in a Box to add padding if you like */}
            <Box sx={{ px: 2, pt: 1, pb: 2 }}>
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
                fetchFileHistories={fetchFileHistories}
              />
            </Box>
          </SwipeableDrawer>
        </Box>
      </Box>
      {!isMobile && (
        <Box
          sx={{
            flex: "0 0 auto",
            width: "min-content",
            ml: 2,
            transition: "width 200ms",
            mt: { lg: 7 },
          }}
        >
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
            fetchFileHistories={fetchFileHistories}
          />
        </Box>
      )}

      <MultipleFileUpload
        isMobile={isMobile}
        setInput={() => {}}
        paidUser={paidUser}
        freezeWords={[]}
        selectedMode={selectedMode}
        shouldShowButton={false}
      />

      <Dialog
        open={confirmationDialog.open}
        onClose={() =>
          setConfirmationDialog({
            open: false,
            word: "",
            count: 0,
            action: null,
          })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Freeze Multiple Occurrences?</DialogTitle>
        <DialogContent>
          <Typography>
            The word/phrase appears{" "}
            <strong>{confirmationDialog.count} times</strong> in your text.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Freezing this will prevent all {confirmationDialog.count}{" "}
            occurrences from being paraphrased. Do you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmationDialog({
                open: false,
                word: "",
                count: 0,
                action: null,
              })
            }
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmationDialog.action}
            variant="contained"
            color="primary"
          >
            Freeze All {confirmationDialog.count}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParaphraseContend;
