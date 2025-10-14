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
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Book,
  Check,
  ChevronsRight,
  Italic,
  List,
  Redo2,
  Trash2,
  Undo2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import InitialInputAction from "./InitialInputAction";
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
        `<span class="text-red-500 line-through">${match}</span> <span class="text-primary">${correct}</span>`,
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
        style:
          "padding: 2px 0; cursor: pointer; border-bottom: 2px solid #FF5630;",
      }),
      0,
    ];
  },
});

const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const buttonClass =
    "flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 cursor-pointer transition-colors";
  const activeClass = "bg-gray-300";

  return (
    <div className="flex items-center gap-1 border-b border-gray-300 bg-gray-100 p-2">
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={cn(buttonClass, {
          "cursor-not-allowed opacity-50": !editor.can().undo(),
        })}
        title="Undo"
      >
        <Undo2 className="size-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={cn(buttonClass, {
          "cursor-not-allowed opacity-50": !editor.can().redo(),
        })}
        title="Redo"
      >
        <Redo2 className="size-4" />
      </button>

      <div className="mx-1 h-6 w-px bg-gray-300" />

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(buttonClass, {
          [activeClass]: editor.isActive("bold"),
        })}
        title="Bold"
      >
        <Bold className="size-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(buttonClass, {
          [activeClass]: editor.isActive("italic"),
        })}
        title="Italic"
      >
        <Italic className="size-4" />
      </button>

      <div className="mx-1 h-6 w-px bg-gray-300" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(buttonClass, {
          [activeClass]: editor.isActive("bulletList"),
        })}
        title="Bullet List"
      >
        <List className="size-4" />
      </button>
    </div>
  );
};

const GrammarContent = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const isMobile = useResponsive("down", "sm");
  const dispatch = useDispatch();

  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { isCheckLoading, language, text, issues, selectedIssue } = useSelector(
    (state) => state.grammar_checker,
  );

  const sample =
    trySamples.grammar[language.startsWith("English") ? "English" : language];

  const [anchorEl, setAnchorEl] = useState(null);

  // Initialize Tiptap Editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      ErrorMark,
      Placeholder.configure({
        placeholder: "Add text or upload document",
        showOnlyWhenEditable: true,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none",
        style:
          "outline: none; min-height: 400px; padding: 16.5px 14px; font-family: inherit; font-size: 1rem; line-height: 1.5;",
      },
      handleClickOn: (view, pos, node, nodePos, event) => {
        const target = event.target;
        if (target.hasAttribute("data-error")) {
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
  }, [text, dispatch]);

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

    handleGrammarChecking();
  }, [debouncedText]);

  // Apply error highlighting to editor
  useEffect(() => {
    if (!editor || !text) return;

    const { state } = editor;
    let tr = state.tr;

    tr = tr.removeMark(0, state.doc.content.size, state.schema.marks.errorMark);

    issues.forEach((errorObj, index) => {
      const { error, correct, sentence, type } = errorObj;
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
              type,
              errorId: `error-${index}-${start}`,
            }),
          );
        }
      });
    });

    tr.setMeta("addToHistory", false);

    editor.view.dispatch(tr);
  }, [issues, editor, text]);

  const handleAcceptCorrection = (issue) => {
    if (!issue || !editor) return;

    const { error, correct } = issue;
    const content = editor.getText();

    const newContent = content.replace(
      new RegExp(error.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      correct,
    );

    editor.commands.setContent(newContent);

    dispatch(
      setIssues(
        issues.filter(
          (e) => !(e.error === error && e.sentence === issue.sentence),
        ),
      ),
    );

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
        <div className="rounded-md border p-4">
          <button>
            <Book className="size-20" />
          </button>
        </div>
        <div className="flex w-full flex-1 flex-col md:min-h-[calc(100vh-140px)]">
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
              <div className="absolute top-20 left-4">
                <InitialInputAction
                  isMobile={isMobile}
                  setInput={(text) => {
                    if (editor) {
                      editor?.commands?.setContent(text);
                    }
                  }}
                  sample={sample}
                  isSample={true}
                  isPaste={true}
                  isDocument={true}
                />
              </div>
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
                      isCollapsed={issue?.error === selectedIssue?.error}
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

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
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

export default GrammarContent;
