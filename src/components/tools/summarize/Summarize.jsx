"use client";
import {
  FormatListBulleted,
  FormatTextdirectionLToRRounded,
} from "@mui/icons-material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { trySamples } from "../../../_mock/trySamples";
import { trackEvent } from "../../../analysers/eventTracker";
import useDebounce from "../../../hooks/useDebounce";
import useLoadingText from "../../../hooks/useLoadingText";
import useResponsive from "../../../hooks/useResponsive";
import useSnackbar from "../../../hooks/useSnackbar";
import { setShowLoginModal } from "../../../redux/slice/auth";
import { setAlertMessage, setShowAlert } from "../../../redux/slice/tools";
import UserActionInput from "../common/UserActionInput";
import BottomBar from "./BottomBar";
import TopNavigations from "./TopNavigations";

// Tiptap imports
import { cn } from "@/lib/utils";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const modes = [
  {
    icon: <FormatListBulleted fontSize="small" />,
    name: "Key Sentences",
  },
  {
    icon: <FormatTextdirectionLToRRounded fontSize="small" />,
    name: "Paragraph",
  },
];

const LENGTH = {
  20: "Short",
  40: "Regular",
  60: "Medium",
  80: "Long",
};

const HIGHLIGHT_CONFIG = {
  backgroundColor: "#ffeb3b",
  color: "var(--primary)",
  padding: "2px 4px",
  borderRadius: "3px",
  fontWeight: "500",
};

// Tiptap Editor Component
const TiptapEditor = ({
  content,
  onChange,
  placeholder,
  readOnly = false,
  highlightedKeywords = [],
  className = "",
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: { class: "text-inherit" },
        },
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: { class: "highlighted-keyword" },
      }),
      Underline,
      Placeholder.configure({
        placeholder: placeholder || "Enter text here...",
      }),
    ],
    content: "",
    editable: !readOnly,
    // onUpdate: ({ editor }) => {
    //   if (onChange && !readOnly) {
    //     onChange(editor.getHTML());
    //   }
    // },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      onChange(text);
    },
    editorProps: {
      attributes: { class: "tiptap-content" },
      attributes: {
        class:
          "tiptap-content prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none text-foreground bg-transparent",
        style:
          "outline: none; min-height: 400px; padding: 16.5px 14px; font-family: inherit; font-size: 1rem; line-height: 1.5;",
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  // Apply keyword highlighting
  useEffect(() => {
    if (!editor || !content) return;

    editor.commands.unsetHighlight();

    const { state } = editor;
    let tr = state.tr;

    tr = tr.removeMark(0, state.doc.content.size, state.schema.marks.highlight);

    highlightedKeywords?.forEach((keyword) => {
      if (!keyword || typeof keyword !== "string") return;

      state.doc.descendants((node, pos) => {
        if (!node.isText) return;

        const normalizedText = node.text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const normalizedKeyword = keyword
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        const escapedKeyword = normalizedKeyword.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        const regex = new RegExp(escapedKeyword, "gi");

        let match;
        while ((match = regex.exec(normalizedText)) !== null) {
          const start = pos + match.index;
          const end = start + keyword.length;

          tr.addMark(
            start,
            end,
            editor.schema.marks.highlight.create({
              color: HIGHLIGHT_CONFIG.backgroundColor,
            }),
          );
        }
      });
    });

    editor.view.dispatch(tr);
  }, [editor, highlightedKeywords]);

  if (!editor) return null;

  return (
    <div className={cn("tiptap-wrapper", className)}>
      <EditorContent className="h-full w-full flex-1" editor={editor} />
      <style jsx global>{`
        .tiptap-content mark,
        .tiptap-content .highlighted-keyword {
          transition: all 0.2s ease;
          background-color: transparent !important;
          color: var(--primary) !important;
        }

        .tiptap-content mark:hover,
        .tiptap-content .highlighted-keyword:hover {
          filter: brightness(0.95);
        }

        .ProseMirror {
          padding: 16px;
          min-width: 100%;
          min-height: 360px;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror.ProseMirror-focused {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          float: left;
          height: 0;
          pointer-events: none;
          content: "Input your text here...";
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
};

const SummarizeContent = () => {
  const [selectedMode, setSelectedMode] = useState(modes[0].name);
  const [currentLength, setCurrentLength] = useState(LENGTH[20]);
  const [outputContent, setOutputContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("Hello world!");
  const [keywords, setKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [isKeywordsLoading, setIsKeywordsLoading] = useState(false);
  const [isKeywordsOpen, setIsKeywordsOpen] = useState(false);

  const { user, accessToken } = useSelector((state) => state.auth);
  const isMobile = useResponsive("down", "sm");
  const enqueueSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const loadingText = useLoadingText(isLoading);
  const sampleText = trySamples.summarize.English;

  const debouncedSelectedMode = useDebounce(selectedMode, 500);
  const debouncedCurrentLength = useDebounce(currentLength, 500);

  // Extract text content from HTML
  const extractTextFromHTML = useCallback((html) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }, []);

  // Debounced plain text for keyword extraction
  const plainTextInput = useMemo(
    () => extractTextFromHTML(userInput),
    [userInput, extractTextFromHTML],
  );
  const debouncedPlainText = useDebounce(plainTextInput, 1000);

  // Fetch keywords when text changes
  useEffect(() => {
    if (
      debouncedPlainText &&
      debouncedPlainText.trim() &&
      debouncedPlainText.length > 10
    ) {
      fetchKeywords({ text: debouncedPlainText });
    } else {
      setKeywords([]);
      setSelectedKeywords([]);
    }
  }, [debouncedPlainText]);

  // Auto-submit when mode or length changes
  useEffect(() => {
    if (userInput && userInput.trim() && !isLoading) {
      handleSubmit();
    }
  }, [debouncedSelectedMode, debouncedCurrentLength]);

  const fetchKeywords = useCallback(
    async (payload) => {
      if (!accessToken) return;

      try {
        setIsKeywordsLoading(true);
        const url = process.env.NEXT_PUBLIC_API_URI + "/summarize-keywords";
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

        const { data } = await response.json();
        setKeywords(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching keywords:", error);
        setKeywords([]);
      } finally {
        setIsKeywordsLoading(false);
      }
    },
    [accessToken],
  );

  const fetchWithStreaming = useCallback(
    async (payload) => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URI + "/summarize";
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

        let accumulatedText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulatedText += value;
          setOutputContent(accumulatedText);
        }
      } catch (error) {
        throw error;
      }
    },
    [accessToken],
  );

  const handleSubmit = useCallback(async () => {
    if (!userInput?.trim()) {
      enqueueSnackbar("Please enter some text to summarize", {
        variant: "warning",
      });
      return;
    }

    try {
      trackEvent("click", "summarize", "summarize_click", 1);
      setIsLoading(true);
      setOutputContent("");

      const textContent = extractTextFromHTML(userInput);
      const payload = {
        text: textContent,
        mode: debouncedSelectedMode,
        length: debouncedCurrentLength.toLowerCase(),
      };

      await fetchWithStreaming(payload);
    } catch (error) {
      if (/LIMIT_REQUEST|PACKAGE_EXPIRED/.test(error?.error)) {
        dispatch(setShowAlert(true));
        dispatch(setAlertMessage(error?.message));
      } else if (error.error === "UNAUTHORIZED") {
        dispatch(setShowLoginModal(true));
      } else {
        enqueueSnackbar(
          error?.message || "Failed to generate summary. Please try again.",
          { variant: "error" },
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    userInput,
    debouncedSelectedMode,
    debouncedCurrentLength,
    fetchWithStreaming,
    dispatch,
    enqueueSnackbar,
    extractTextFromHTML,
  ]);

  const handleInput = useCallback((htmlContent) => {
    setUserInput(htmlContent);
  }, []);

  const handleClear = useCallback(() => {
    setUserInput("");
    setOutputContent("");
    setKeywords([]);
    setSelectedKeywords([]);
  }, []);

  const handleKeywordToggle = useCallback(
    (keyword) => {
      setSelectedKeywords((prev) => {
        if (prev.includes(keyword)) {
          return prev.filter((kw) => kw !== keyword);
        } else if (prev.length >= 5) {
          enqueueSnackbar("You can select up to 5 keywords.", {
            variant: "warning",
          });
          return prev;
        } else {
          return [...prev, keyword];
        }
      });
    },
    [enqueueSnackbar],
  );

  // Find matching keywords in output
  const matchingKeywords = useMemo(() => {
    if (!outputContent || !selectedKeywords.length) return [];
    const outputText = extractTextFromHTML(outputContent).toLowerCase();
    return selectedKeywords.filter((keyword) =>
      outputText.includes(keyword.toLowerCase()),
    );
  }, [outputContent, selectedKeywords, extractTextFromHTML]);

  return (
    <div>
      <div className="bg-card overflow-visible rounded-lg border px-4">
        {/* Top Navigation */}
        <TopNavigations
          LENGTH={LENGTH}
          currentLength={currentLength}
          modes={modes}
          selectedMode={selectedMode}
          setCurrentLength={setCurrentLength}
          setSelectedMode={setSelectedMode}
        />

        <div className="grid grid-cols-1 gap-4 overflow-hidden md:grid-cols-2">
          {/* Input Section */}
          <div className="relative h-full self-stretch overflow-y-auto">
            <div className="h-full rounded-md border">
              <TiptapEditor
                content={userInput}
                onChange={handleInput}
                placeholder="Input your text here..."
                readOnly={false}
                highlightedKeywords={selectedKeywords}
              />

              {userInput && (
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Select keywords (up to 5)</p>
                  </div>

                  <div className="mt-3">
                    {isKeywordsLoading && (
                      <div className="text-primary">Loading keywords...</div>
                    )}
                    {!isKeywordsLoading &&
                      keywords.length === 0 &&
                      userInput && (
                        <div className="text-muted-foreground">
                          No keywords found
                        </div>
                      )}
                    {!isKeywordsLoading && keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((kw, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-all hover:shadow-md ${
                              selectedKeywords.includes(kw)
                                ? "border-primary bg-primary/10 text-primary font-medium"
                                : "hover:border-primary/50 border-muted-foreground"
                            }`}
                            onClick={() => handleKeywordToggle(kw)}
                            disabled={
                              !selectedKeywords.includes(kw) &&
                              selectedKeywords.length >= 5
                            }
                          >
                            <span className="capitalize">{kw}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isMobile && (
              <BottomBar
                handleClear={handleClear}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                outputContend={outputContent}
                userInput={userInput}
                userPackage={user?.package}
                isMobile={isMobile}
              />
            )}

            {!userInput && (
              <UserActionInput
                setUserInput={setUserInput}
                isMobile={isMobile}
                sampleText={sampleText}
              />
            )}
          </div>

          {/* Output Section */}
          {!userInput && isMobile ? null : (
            <div className="h-full self-stretch overflow-y-auto pb-2 md:pb-0">
              <div className="h-full rounded-md border">
                <TiptapEditor
                  className="h-full"
                  content={isLoading ? `<p>${loadingText}</p>` : outputContent}
                  onChange={null}
                  placeholder="Summarized text will appear here..."
                  readOnly={true}
                  highlightedKeywords={matchingKeywords}
                />
              </div>
            </div>
          )}
        </div>

        {!isMobile && (
          <BottomBar
            handleClear={handleClear}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            outputContend={outputContent}
            userInput={userInput}
            userPackage={user?.package}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
};

export default SummarizeContent;
