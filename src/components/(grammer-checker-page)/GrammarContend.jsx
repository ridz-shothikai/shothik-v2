"use client";

import { trySamples } from "@/_mock/trySamples";
import { detectLanguage } from "@/hooks/languageDitector";
import useDebounce from "@/hooks/useDebounce";
import useResponsive from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import {
  setIsCheckLoading,
  setIssues,
  setLanguage,
  setText,
} from "@/redux/slice/grammar-checker-slice";
import { grammarCheck } from "@/services/grammar-checker.service";
import { Popover } from "@mui/material";
import { Mark, mergeAttributes } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import UserActionInput from "../tools/common/UserActionInput";
import LanguageMenu from "./LanguageMenu";

const IssueCard = ({
  issue,
  handleAccept,
  handleIgnore,
  isCollapsed,
  handleIsCollapsed,
}) => {
  const { error, correct, sentence, type } = issue || {};

  console.log(sentence);

  const escapedWord = error.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedWord, "gu");

  const highlightedText = sentence?.replace(
    regex,
    `<span className="flex items-center gap-2">
          <span className="text-red-500 line-through">${error}</span>
          <span className="h-5 w-px bg-primary" />
          <span className="font-medium text-green-600">${correct}</span>
        </span>`,
  );

  return (
    <div className="py-4">
      <div className="text-muted-foreground relative px-4 text-sm">
        <span className="absolute top-1/2 left-0 size-3 -translate-y-1/2 rounded-e-full bg-red-500" />
        <span className="block">
          Correct the {type?.toLowerCase() || "grammar"} error
        </span>
        <div className="h-8">
          <div
            className={cn("flex items-center justify-center gap-2", {
              hidden: isCollapsed,
            })}
          >
            <button
              onClick={handleAccept}
              className="text-primary flex size-8 cursor-pointer items-center justify-center"
            >
              <Check className="size-5" />
            </button>
            <button
              onClick={handleAccept}
              className="flex size-8 cursor-pointer items-center justify-center"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="px-4">
        <div className="flex items-center gap-3">
          <p className="text-red-500 line-through">{error}</p>
          <span className="h-5 w-px bg-gray-300" />
          <p className="font-medium text-green-600">{correct}</p>
        </div>
      </div>
      <div
        className={cn("flex flex-col overflow-hidden", {
          "h-fit": isCollapsed,
          "h-0": !isCollapsed,
        })}
      >
        <div className="mb-2 px-4">
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
        <div className="flex items-center px-4">
          <button
            className="bg-primary text-primary-foreground flex h-8 cursor-pointer items-center gap-2 rounded-full px-4 text-sm"
            onClick={handleAccept}
            sx={{
              color: "success.main",
              "&:hover": {
                backgroundColor: "success.lighter",
              },
            }}
          >
            <Check className="size-5" /> <span>Accept</span>
          </button>
          <button
            className="flex h-8 cursor-pointer items-center gap-2 rounded-full px-4 text-sm"
            onClick={handleIgnore}
          >
            <X className="size-5" /> Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Mark for Error Highlighting
const ErrorMark = Mark.create({
  name: "errorMark",

  addAttributes() {
    return {
      error: {
        default: null,
      },
      correct: {
        default: null,
      },
      errorId: {
        default: null,
      },
      sentence: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-error]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-error": HTMLAttributes.error,
        "data-correct": HTMLAttributes.correct,
        "data-error-id": HTMLAttributes.errorId,
        "data-sentence": HTMLAttributes.sentence,
        style:
          "padding: 2px 0; cursor: pointer; border-bottom: 2px solid #FF5630;",
      }),
      0,
    ];
  },
});

const GrammarContend = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const isMobile = useResponsive("down", "sm");
  const dispatch = useDispatch();

  const { isCheckLoading, language, text, issues, corrected } = useSelector(
    (state) => state.grammar_checker,
  );

  const sampleText =
    trySamples.grammar[language.startsWith("English") ? "English" : language];

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Initialize Tiptap Editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, ErrorMark],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none",
        style:
          "outline: none; min-height: 456px; padding: 16.5px 14px; font-family: inherit; font-size: 1rem; line-height: 1.5;",
      },
      handleClickOn: (view, pos, node, nodePos, event) => {
        const target = event.target;
        if (target.hasAttribute("data-error")) {
          const error = target.getAttribute("data-error");
          const correct = target.getAttribute("data-correct");
          const sentence = target.getAttribute("data-sentence");
          const errorId = target.getAttribute("data-error-id");

          // Get the position of the clicked element
          const rect = target.getBoundingClientRect();

          setSelectedIssue({
            error,
            correct,
            sentence,
            errorId,
            position: {
              top: rect?.bottom + window?.scrollY,
              left: rect?.left + window?.scrollX,
            },
          });
          setAnchorEl(target);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      dispatch(setText(text));
    },
  });

  useEffect(() => {
    if (!text) return;
    const lang = detectLanguage(text);
    dispatch(setLanguage(lang));
  }, [text]);

  const handleGrammarChecking = async () => {
    try {
      if (!text || !accessToken) return;

      dispatch(setIsCheckLoading(true));
      const data = await grammarCheck({ content: text, language: language });
      const { issues } = data?.result || {};
      dispatch(setIssues(issues || []));
    } catch (error) {
      console.log(error, "Grammar Error");
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      dispatch(setIsCheckLoading(false));
    }
  };

  const debouncedText = useDebounce(text, 1000);

  useEffect(() => {
    if (!debouncedText || isCheckLoading) return;

    handleGrammarChecking(debouncedText);
  }, [debouncedText]);

  // Apply error highlighting to editor
  useEffect(() => {
    if (!editor || !text) return;

    const { state } = editor;
    let tr = state.tr;

    // Remove all existing error marks
    tr = tr.removeMark(0, state.doc.content.size, state.schema.marks.errorMark);

    // Apply new error marks
    issues.forEach((errorObj, index) => {
      const { error, correct, sentence } = errorObj;
      if (!error) return;

      const regex = new RegExp(
        error.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "g",
      );

      state.doc.descendants((node, pos) => {
        if (!node.isText) return;

        let match;
        while ((match = regex.exec(node.text)) !== null) {
          const start = pos + match.index;
          const end = start + error.length;

          tr = tr.addMark(
            start,
            end,
            state.schema.marks.errorMark.create({
              error,
              correct,
              sentence,
              errorId: `error-${index}-${start}`,
            }),
          );
        }
      });
    });

    editor.view.dispatch(tr);
  }, [issues, editor]);

  const handleAcceptCorrection = () => {
    if (!selectedIssue || !editor) return;

    const { error, correct } = selectedIssue;
    const content = editor.getText();

    // Find and replace the error with correction
    const newContent = content.replace(
      new RegExp(error.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      correct,
    );

    editor.commands.setContent(newContent);

    // Remove this error from errors array
    dispatch(setIssues((prev) => prev.filter((e) => e.error !== error)));

    handleClosePopover();
  };

  const handleIgnoreError = () => {
    if (!selectedIssue) return;

    handleClosePopover();
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedIssue(null);
  };

  return (
    <>
      <div className="flex items-center py-6">
        <div></div>
        <div className="flex-1">
          <div className="bg-card w-fit rounded-t-2xl border border-b-0">
            <LanguageMenu
              isLoading={isCheckLoading}
              setLanguage={(lang) => dispatch(setLanguage(lang))}
              language={language}
            />
          </div>
          <div className="relative h-auto overflow-y-auto sm:h-[480px]">
            <div
              className={`max-h-[360px] overflow-y-auto sm:max-h-none ${isMobile ? "min-h-[360px]" : "min-h-[456px]"} border-border bg-background rounded-tr-lg rounded-br-lg rounded-bl-lg border`}
            >
              <style jsx global>{`
                .ProseMirror {
                  min-width: 100%;
                  min-height: 100%;
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
              <EditorContent className="w-full" editor={editor} />
            </div>

            {!text && (
              <UserActionInput
                setUserInput={(text) => {
                  if (editor) {
                    editor.commands.setContent(text);
                  }
                }}
                isMobile={isMobile}
                sampleText={sampleText}
                disableTrySample={!sampleText}
              />
            )}
          </div>
        </div>
        <div className="bg-card w-96"></div>
      </div>
      {/* Error Correction Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {selectedIssue && (
          <div>
            <IssueCard
              issue={selectedIssue}
              handleAccept={handleAcceptCorrection}
              handleIgnore={handleIgnoreError}
              isCollapsed={true}
            />
          </div>
        )}
      </Popover>
    </>
  );
};

export default GrammarContend;
