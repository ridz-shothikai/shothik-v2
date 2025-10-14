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
  setSelectedIssue,
  setText,
} from "@/redux/slice/grammar-checker-slice";
import { grammarCheck } from "@/services/grammar-checker.service";
import { Popover } from "@mui/material";
import { Mark, mergeAttributes } from "@tiptap/core";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronsRight,
  Italic,
  List,
  ListOrdered,
  Redo,
  Trash2,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";
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

  // Fix: Properly highlight the error in the sentence
  const getHighlightedText = () => {
    if (!sentence || !error) return sentence;

    const escapedWord = error.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedWord, "gi");

    return sentence.replace(
      regex,
      (match) =>
        `<span class="text-red-500 line-through">${match}</span> - <span class="text-primary">${correct}</span>`,
    );
  };

  const highlightedText = getHighlightedText();

  return (
    <div
      onClick={() => handleIsCollapsed()}
      className="max-w-[400px] min-w-[300px] py-2"
    >
      <div className="text-muted-foreground relative flex items-center justify-between px-4 text-sm">
        <span className="absolute top-1/2 left-0 size-3 -translate-y-1/2 rounded-e-full bg-red-500" />
        <span className="block font-medium">
          Correct the {type?.toLowerCase() || "grammar"} error
        </span>
        <div className="h-8">
          <div
            className={cn("flex items-center justify-start gap-2", {
              hidden: isCollapsed,
            })}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAccept(issue);
              }}
              className="flex size-8 items-center justify-center gap-1 rounded-md text-sm text-green-600 transition-colors hover:bg-green-50"
            >
              <Check className="size-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleIgnore(issue);
              }}
              className="flex size-8 items-center justify-center gap-1 rounded-md text-sm text-gray-600 transition-colors hover:bg-gray-50"
            >
              <Trash2 className="size-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2 px-4">
        <div className="flex items-center gap-2 rounded-md">
          <p className="font-medium text-red-500 line-through">{error}</p>
          <span className="bg-muted-foreground h-4 w-px" />
          <p className="font-medium text-green-600">{correct}</p>
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col overflow-hidden transition-all duration-300",
          {
            "max-h-0 opacity-0": !isCollapsed,
            "max-h-96 opacity-100": isCollapsed,
          },
        )}
      >
        <div className="my-2 px-4">
          <div
            className="text-muted-foreground text-sm"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
        <div className="mt-2 flex items-center justify-start gap-2 px-4">
          <button
            className="bg-primary text-primary-foreground flex h-8 items-center gap-2 rounded-md px-4 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAccept(issue);
            }}
          >
            <Check className="size-4" />
            <span>Accept</span>
          </button>
          <button
            className="flex h-8 items-center gap-2 rounded-md border px-4 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleIgnore(issue);
            }}
          >
            <Trash2 className="size-4" />
            <span>Ignore</span>
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
      type: {
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
        "data-type": HTMLAttributes.type,
        class: "error-highlight",
        style:
          "border-bottom: 2px solid #EF4444; cursor: pointer; padding: 1px 2px; border-radius: 2px;",
      }),
      0,
    ];
  },
});

// Toolbar Component
const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const tools = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      title: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      title: "Italic",
    },
    {
      icon: UnderlineIcon,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
      title: "Underline",
    },
    { type: "separator" },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      title: "Bullet List",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      title: "Numbered List",
    },
    { type: "separator" },
    {
      icon: AlignLeft,
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editor.isActive({ textAlign: "left" }),
      title: "Align Left",
    },
    {
      icon: AlignCenter,
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editor.isActive({ textAlign: "center" }),
      title: "Align Center",
    },
    {
      icon: AlignRight,
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editor.isActive({ textAlign: "right" }),
      title: "Align Right",
    },
    {
      icon: AlignJustify,
      action: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: editor.isActive({ textAlign: "justify" }),
      title: "Align Justify",
    },
    { type: "separator" },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
      title: "Undo",
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
      title: "Redo",
    },
  ];

  return (
    <div className="bg-card flex items-center gap-1 rounded-b-lg border-t p-2">
      {tools.map((tool, index) => {
        if (tool.type === "separator") {
          return <div key={index} className="mx-1 h-6 w-px" />;
        }

        const IconComponent = tool.icon;
        return (
          <button
            key={index}
            onClick={tool.action}
            disabled={tool.disabled}
            className={cn(
              "hover:bg-card/50 rounded-md p-2 transition-colors",
              tool.isActive && "bg-background text-primary",
              tool.disabled && "cursor-not-allowed opacity-50",
            )}
            title={tool.title}
          >
            <IconComponent className="size-4" />
          </button>
        );
      })}
    </div>
  );
};

const GrammarContend = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const isMobile = useResponsive("down", "sm");
  const dispatch = useDispatch();

  const { isCheckLoading, language, text, issues, selectedIssue, corrected } =
    useSelector((state) => state.grammar_checker);

  const sampleText =
    trySamples.grammar[language.startsWith("English") ? "English" : language];

  const [anchorEl, setAnchorEl] = useState(null);

  // Initialize Tiptap Editor with more extensions
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ErrorMark,
    ],
    content: text || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none p-4 min-h-[200px]",
      },
    },
    onUpdate: ({ editor }) => {
      const newText = editor.getText();
      dispatch(setText(newText));
    },
  });

  function prepare(text) {
    text = text.normalize("NFC").trim();
    text = text.replace(/\u200B|\u200C|\u200D/g, "");
    return text;
  }

  // Fix: Update editor content when text changes from outside
  useEffect(() => {
    if (editor && text !== editor.getText()) {
      editor.commands.setContent(text || "");
    }
  }, [text, editor]);

  useEffect(() => {
    if (!text || !prepare(text)) return;
    const lang = detectLanguage(text);
    dispatch(setLanguage(lang));
  }, [text]);

  const handleGrammarChecking = async () => {
    try {
      if (!text || !prepare(text) || !accessToken) return;

      dispatch(setIsCheckLoading(true));
      const data = await grammarCheck({
        content: prepare(text),
        language: language,
      });
      const { issues } = data?.result || {};
      dispatch(setIssues(issues || []));
    } catch (error) {
      console.error("Grammar Error:", error);
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

  // Fix: Improved error highlighting with proper data passing
  useEffect(() => {
    if (!editor || !text || !issues.length) return;

    const { state } = editor;
    let tr = state.tr;

    // Remove all existing error marks
    tr = tr.removeMark(0, state.doc.content.size, state.schema.marks.errorMark);

    // Apply new error marks
    issues.forEach((issue, index) => {
      const { error, correct, sentence, type } = issue;
      if (!error) return;

      const escapedError = error.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedError, "gi");

      state.doc.descendants((node, pos) => {
        if (!node.isText) return;

        const nodeText = node.text;
        let match;

        while ((match = regex.exec(nodeText)) !== null) {
          const start = pos + match.index;
          const end = start + match[0].length;

          // Only mark if we haven't already marked this position
          const existingMarks = state.doc.rangeHasMark(
            start,
            end,
            state.schema.marks.errorMark,
          );
          if (!existingMarks) {
            tr = tr.addMark(
              start,
              end,
              state.schema.marks.errorMark.create({
                error: match[0],
                correct,
                sentence,
                type,
                errorId: `error-${index}-${start}`,
              }),
            );
          }
        }
      });
    });

    editor.view.dispatch(tr);
  }, [issues, editor, text]);

  // Fix: Improved click handler for error marks
  const handleEditorClick = (event) => {
    const target = event.target;
    if (
      target.classList.contains("error-highlight") ||
      target.hasAttribute("data-error")
    ) {
      const error = target.getAttribute("data-error");
      const correct = target.getAttribute("data-correct");
      const sentence = target.getAttribute("data-sentence");
      const type = target.getAttribute("data-type");
      const errorId = target.getAttribute("data-error-id");

      dispatch(
        setSelectedIssue({
          error,
          correct,
          sentence,
          type,
          errorId,
        }),
      );
      setAnchorEl(target);
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleAcceptCorrection = (issue) => {
    if (!issue || !editor) return;

    const { error, correct } = issue || {};
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

  const handleIgnoreError = (issue) => {
    if (!issue) return;

    handleClosePopover();
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="flex flex-col items-start gap-6 py-6 lg:flex-row">
        <div className="flex w-full flex-1 flex-col md:min-h-[calc(100vh-120px)]">
          <div className="bg-card w-fit rounded-t-2xl border border-b-0">
            <LanguageMenu
              isLoading={isCheckLoading}
              setLanguage={(lang) => dispatch(setLanguage(lang))}
              language={language}
            />
          </div>
          <div className="relative flex h-full flex-1 flex-col">
            <div
              className={`border-border bg-card flex h-full flex-1 flex-col overflow-hidden rounded-tr-lg rounded-br-lg rounded-bl-lg border`}
              onClick={handleEditorClick}
            >
              <style jsx global>{`
                .ProseMirror {
                  padding: 16px;
                  min-width: 100%;
                  min-height: 200px;
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
                .error-highlight:hover {
                  background-color: #fee2e2 !important;
                }
              `}</style>
              <EditorContent className="h-full w-full flex-1" editor={editor} />
              <EditorToolbar editor={editor} />
            </div>

            {!text && (
              <UserActionInput
                setUserInput={(inputText) => {
                  dispatch(setText(inputText));
                  if (editor) {
                    editor.commands.setContent(inputText);
                  }
                }}
                isMobile={isMobile}
                sampleText={sampleText}
                disableTrySample={!sampleText}
              />
            )}
          </div>
        </div>

        {/* Issues Panel */}
        <div className="w-full self-stretch overflow-y-auto rounded-lg border lg:mt-10 lg:w-96">
          <div className="bg-card h-full">
            <div className="flex items-center justify-between gap-2 p-4">
              <div className="flex items-center gap-2">
                <button className="flex aspect-square h-8 items-center justify-center rounded-md border">
                  <ChevronsRight />
                </button>
                <div
                  className={cn(
                    "flex aspect-square h-8 items-center justify-center rounded-md border bg-red-500/15 px-2 text-sm",
                  )}
                >
                  80/100
                </div>
                <p className="text-sm">Writing score</p>
              </div>
              <div className="text-primary flex items-center text-sm">
                View Details
              </div>
            </div>

            <div>{/* There should tab all, grammar and recommendation */}</div>

            <div>
              {/* That is grammar tap */}
              <div className="divide-y">
                {issues?.map((issue, index) => (
                  <div
                    className="cursor-pointer"
                    key={`${issue?.error}-${index}`}
                  >
                    <IssueCard
                      issue={issue}
                      handleAccept={handleAcceptCorrection}
                      handleIgnore={handleIgnoreError}
                      isCollapsed={selectedIssue?.error === issue.error}
                      handleIsCollapsed={() =>
                        dispatch(setSelectedIssue(issue))
                      }
                    />
                  </div>
                ))}
                {isCheckLoading && <div className="p-8 text-center"></div>}
                {issues.length === 0 && (
                  <div className="p-8 text-center">
                    <Check className="text-primary mx-auto mb-2 size-12" />
                    <p className="font-semibold">
                      There is nothing to check yet!
                    </p>
                    <p className="text-sm font-semibold">
                      Start by putting words in the editor.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
        sx={{
          "& .MuiPopover-paper": {
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          },
        }}
      >
        {selectedIssue && (
          <IssueCard
            issue={selectedIssue}
            handleAccept={handleAcceptCorrection}
            handleIgnore={handleIgnoreError}
            isCollapsed={true}
          />
        )}
      </Popover>
    </>
  );
};

export default GrammarContend;
