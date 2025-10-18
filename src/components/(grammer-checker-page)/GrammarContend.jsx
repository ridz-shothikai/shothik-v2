"use client";

import { trySamples } from "@/_mock/trySamples";
import BookIcon from "@/components/icons/BookIcon";
import { downloadFile } from "@/components/tools/common/downloadfile";
import { detectLanguage } from "@/hooks/languageDitector";
import useDebounce from "@/hooks/useDebounce";
import useResponsive from "@/hooks/useResponsive";
import useSnackbar from "@/hooks/useSnackbar";
import { cn } from "@/lib/utils";
import {
  setIsCheckLoading,
  setIsSectionbarOpen,
  setIsSidebarOpen,
  setIssues,
  setLanguage,
  setScore,
  setScores,
  setSections,
  setSectionsGroups,
  setSelectedIssue,
  setSelectedSection,
  setSelectedTab,
  setText,
} from "@/redux/slice/grammar-checker-slice";
import {
  fetchGrammarSection,
  fetchGrammarSections,
  grammarCheck,
} from "@/services/grammar-checker.service";
import { Button, Menu, Popover, Tooltip } from "@mui/material";
import { Mark, mergeAttributes } from "@tiptap/core";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ChevronsRight, ChevronUp, MoreVertical, Plus } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionMenu from "./ActionMenu";
import ActionToolbar from "./ActionToolbar";
import EditorToolbar from "./EditorToolbar";
import GrammarIssueCard from "./GrammarIssueCard";
import GrammarSectionbar from "./GrammarSectionbar";
import GrammarSidebar from "./GrammarSidebar";
import InitialInputAction from "./InitialInputAction";
import LanguageMenu from "./LanguageMenu";

const dataGroupsByPeriod = (histories = []) => {
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

const GrammarContent = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const isMobile = useResponsive("down", "sm");
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const enqueueSnackbar = useSnackbar();

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [anchorEl3, setAnchorEl3] = useState(null);

  const {
    isCheckLoading,
    isRecommendationLoading,
    language,
    text,
    score,
    scores,
    issues,
    selectedIssue,
    recommendations,
    selectedRecommendation,
    isSidebarOpen,
    // sections
    isSectionbarOpen,
    isUpdatedSections,
    sections,
    sectionsGroups,
    sectionsMeta,
    selectedSection,
    isSectionLoading,
    tabs,
    selectedTab,
  } = useSelector((state) => state.grammar_checker) || {};

  const sample =
    trySamples.grammar[language.startsWith("English") ? "English" : language];

  const id = searchParams.get("id");

  const setId = (newId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", newId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Remove id
  const removeId = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
          "tiptap-content prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none text-foreground bg-transparent",
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

  function prepare(text) {
    text = text.normalize("NFC").trim();
    text = text.replace(/\u200B|\u200C|\u200D/g, "");
    return text;
  }

  useEffect(() => {
    if (!text || !prepare(text)) return;
    const lang = detectLanguage(text);
    dispatch(setLanguage(lang));
  }, [text, dispatch]);

  const handleGrammarChecking = async () => {
    try {
      if (!text || !prepare(text) || !accessToken) return;

      dispatch(setIsCheckLoading(true));
      const data = await grammarCheck({
        content: text,
        language: language,
        ...(id && { id }),
      });
      const { issues, scores } = data?.result || {};

      dispatch(setIssues(issues || []));

      const avgScore =
        (scores?.reduce((sum, item) => sum + Number(item?.score || 0), 0) ||
          0) / (scores?.length || 1);

      dispatch(setScore(avgScore || 0));
      dispatch(setScores(scores || []));
    } catch (error) {
      enqueueSnackbar(error?.data?.message || "Something went wrong", {
        variant: "error",
      });
    } finally {
      dispatch(setIsCheckLoading(false));
    }
  };

  const debouncedText = useDebounce(text, 1000);

  useEffect(() => {
    if (!debouncedText || !prepare(debouncedText) || isCheckLoading) return;

    handleGrammarChecking();
  }, [debouncedText]);

  // Apply error highlighting to editor
  useEffect(() => {
    if (!editor || !text) return;

    const { state } = editor;
    let tr = state.tr;

    tr = tr.removeMark(0, state.doc.content.size, state.schema.marks.errorMark);

    issues?.forEach((errorObj, index) => {
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

  const handleAcceptAllCorrections = () => {
    if (!issues?.length || !editor) return;

    let content = editor.getText();

    // Apply all corrections one by one
    issues.forEach(({ error, correct }) => {
      if (!error || !correct) return;
      const regex = new RegExp(
        error.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "g",
      );
      content = content.replace(regex, correct);
    });

    editor.commands.setContent(content);
    dispatch(setIssues([])); // clear all issues
    // toast.success("All corrections accepted!");
    enqueueSnackbar("All corrections accepted!", {
      variant: "success",
    });
  };

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

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    if (editor) {
      editor.commands.clearContent();
      setText("");
      dispatch(setText(""));
      dispatch(setIssues([]));
      dispatch(setSelectedIssue({}));
    }
  };

  // Sections
  const handleNewSection = () => {
    editor.commands.clearContent();
    dispatch(setText(""));
    dispatch(setIssues([]));
    dispatch(setSelectedIssue({}));
    dispatch(setSelectedSection({}));

    removeId();
    enqueueSnackbar("New chat opened!", {
      variant: "info",
    });
  };

  const handleSelectSection = (section) => {
    setId(section?._id);
  };

  const fetchSections = async () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX + "/api";

    try {
      // const res = await fetch(`${API_BASE}/grammar/sections`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      //   },
      // });
      // if (!res.ok) throw new Error("Failed to fetch history");
      // const data = await res.json();

      const { data } = await fetchGrammarSections();

      const groups = dataGroupsByPeriod(data || []);

      dispatch(setSections(data));
      dispatch(setSectionsGroups(groups));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    // fetchSections();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    // fetchSections({ reset: true });
  }, [isUpdatedSections]);

  useEffect(() => {
    if (!id) {
      dispatch(setSelectedSection({}));
      return;
    }

    const setCurrentSection = async () => {
      try {
        const { success, data } = await fetchGrammarSection(id);

        if (success) {
          dispatch(setSelectedSection(data || {}));
        }
      } catch (err) {}
    };

    if (selectedSection?._id !== id) {
      setCurrentSection();
    }
  }, [id]);

  useEffect(() => {
    if (!editor) return;
    if (!selectedSection?._id) return;

    editor.commands.setContent(selectedSection?.text || "");
  }, [selectedSection, editor]);

  const handlePreferences = () => {
    alert("Open Preferences modal");
  };
  const handleStatistics = () => {
    alert(`Sentences: ${sentences}\nWords: ${words}`);
  };
  const handleDownload = async () => {
    await downloadFile(text, "grammar");
    // alert("Download triggered");
  };

  return (
    <>
      <div className="py-6">
        <div className="relative flex flex-col items-start gap-4 overflow-hidden lg:flex-row">
          <div className="bg-card hidden rounded-md border p-4 px-3 lg:block">
            <div className="flex flex-col gap-6">
              <button onClick={() => dispatch(setIsSectionbarOpen(true))}>
                <BookIcon className="size-5" />
              </button>
              <button onClick={handleNewSection} className="">
                <Plus className="size-6" />
              </button>
            </div>
          </div>
          <div className="mx-auto flex w-full flex-1 flex-col lg:min-h-[calc(100vh-140px)]">
            <div className="bg-card flex w-full items-center justify-between border border-b-0 lg:w-fit lg:rounded-t-2xl">
              <LanguageMenu
                isLoading={isCheckLoading}
                setLanguage={(lang) => dispatch(setLanguage(lang))}
                language={language}
              />
              <div className="lg:hidden">
                <ActionMenu
                  onDownload={handleDownload}
                  onPreferences={handlePreferences}
                  onStatistics={handleStatistics}
                  onNewSection={handleNewSection}
                  onOpenSectionbar={() => dispatch(setIsSectionbarOpen(true))}
                />
              </div>
            </div>
            <div className="relative flex h-full flex-1 flex-col">
              <div
                className={`border-border bg-card flex h-full flex-1 flex-col overflow-hidden rounded-br-lg rounded-bl-lg border lg:rounded-tr-lg`}
              >
                <style jsx global>{`
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
                  .error-highlight:hover {
                    background-color: #fee2e2 !important;
                  }
                `}</style>
                <EditorContent
                  className="h-full w-full flex-1"
                  editor={editor}
                />
                <div className="flex items-center justify-between gap-2 px-4 py-2">
                  <div className="flex items-center gap-2 lg:gap-4">
                    <div className="flex items-center justify-center">
                      <div className="hidden items-center gap-1 md:flex">
                        <EditorToolbar editor={editor} />
                      </div>
                      <div className="md:hidden">
                        <button
                          onClick={(event) => setAnchorEl3(event.currentTarget)}
                          className="hover:bg-muted flex h-8 w-4 items-center justify-center rounded"
                        >
                          <MoreVertical className="size-4" />
                        </button>

                        <Menu
                          anchorEl={anchorEl3}
                          open={Boolean(anchorEl3)}
                          onClose={() => setAnchorEl3(null)}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                        >
                          <div className="bg-card flex items-center gap-1 px-2 py-1">
                            <EditorToolbar editor={editor} />
                          </div>
                        </Menu>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <ActionToolbar
                        editor={editor}
                        text={text}
                        setText={(value) => dispatch(setText(value))}
                        handleClear={handleClear}
                        handleCopy={handleCopy}
                      />
                      <div className="hidden lg:block">
                        <ActionMenu
                          onDownload={handleDownload}
                          onPreferences={handlePreferences}
                          onStatistics={handleStatistics}
                          onNewSection={handleNewSection}
                          onOpenSectionbar={() =>
                            dispatch(setIsSectionbarOpen(true))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 lg:hidden">
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={(event) => setAnchorEl2(event.currentTarget)}
                        className="!min-w-auto px-2!"
                      >
                        <span>
                          {(selectedTab === "grammar" ||
                            selectedTab === "all") &&
                            (issues?.length || 0)}
                          {selectedTab === "recommendation" &&
                            (recommendations?.length || 0)}
                        </span>
                        <ChevronUp />
                      </Button>
                      <Menu
                        anchorEl={anchorEl2}
                        open={Boolean(anchorEl2)}
                        onClose={() => setAnchorEl2(null)}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                      >
                        <div
                          onClick={() => dispatch(setSelectedTab("grammar"))}
                          className={cn(
                            "flex cursor-pointer items-center gap-1.5 border-b border-b-transparent px-2 py-1",
                            {
                              "text-primary bg-primary/10":
                                selectedTab === ("grammar" || "all"),
                            },
                          )}
                        >
                          <span className="shrink-0">
                            {issues?.length ? (
                              <span className="rounded-full bg-red-500/15 p-1 text-xs text-red-500">
                                {issues?.length || 0}
                              </span>
                            ) : (
                              <Image
                                className="shrink-0"
                                alt="check"
                                src="/favicon.png"
                                height={16}
                                width={16}
                              />
                            )}
                          </span>
                          <span className="text-xs capitalize">Grammar</span>
                        </div>

                        {/* Recommendation Tab */}
                        <div
                          onClick={() =>
                            dispatch(setSelectedTab("recommendation"))
                          }
                          className={cn(
                            "flex cursor-pointer items-center gap-1.5 border-b border-b-transparent px-2 py-1",
                            {
                              "text-primary bg-primary/10":
                                selectedTab === "recommendation",
                            },
                          )}
                        >
                          <span className="shrink-0">
                            {recommendations?.length ? (
                              <span className="bg-primary/10 text-primary rounded-full p-1 text-xs">
                                {recommendations?.length || 0}
                              </span>
                            ) : (
                              <Image
                                className="shrink-0"
                                alt="check"
                                src="/favicon.png"
                                height={16}
                                width={16}
                              />
                            )}
                          </span>
                          <span className="text-xs capitalize">
                            Recommendation
                          </span>
                        </div>
                      </Menu>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Grammar Tab Button */}
                      {(selectedTab === "grammar" || selectedTab === "all") && (
                        <Tooltip title="Accept All Grammar" placement="top">
                          <Button
                            size="small"
                            variant="contained"
                            className="!gap-2 rounded"
                            disabled={true}
                          >
                            <span className="shrink-0">Fix Grammar</span>
                            <span className="shrink-0">
                              ({issues?.length || 0})
                            </span>
                          </Button>
                        </Tooltip>
                      )}

                      {/* Recommendation Tab Button */}
                      {selectedTab === "recommendation" && (
                        <Tooltip
                          title="Accept All Recommendations"
                          placement="top"
                        >
                          <Button
                            size="small"
                            variant="contained"
                            className="!gap-2 rounded"
                            disabled={true}
                          >
                            <span className="shrink-0">Accept</span>
                            <span className="shrink-0">
                              ({recommendations?.length || 0})
                            </span>
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {!text && (
                <div className="absolute top-20 left-4">
                  <InitialInputAction
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

          {/* Sidebar Drawer */}
          <div className="hidden lg:block">
            <div
              className={cn(
                "absolute top-0 right-0 bottom-0 z-50 flex flex-col transition-all duration-300",
                {
                  "right-0": isSidebarOpen,
                  "right-[-100%]": !isSidebarOpen,
                },
              )}
            >
              <GrammarSidebar
                handleAccept={handleAcceptCorrection}
                handleIgnore={handleIgnoreError}
                handleAcceptAll={handleAcceptAllCorrections}
              />
            </div>
            <div className="w-80 lg:mt-10">
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <button
                    onClick={() => dispatch(setIsSidebarOpen(true))}
                    className="flex h-8 cursor-pointer items-center justify-center rounded-md border px-2"
                  >
                    <ChevronsRight />
                    <span>Open assistant</span>
                  </button>
                  <div
                    className={cn(
                      "flex aspect-square h-8 items-center justify-center rounded-md border bg-red-500/15 px-2 text-sm",
                    )}
                  >
                    {score || 0}/100
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span>
                        {issues?.length ? (
                          <span className="rounded-md bg-red-500 px-1.5 py-1 text-white">
                            {issues?.length || 0}
                          </span>
                        ) : isCheckLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="border-t-muted-foreground h-5 w-5 animate-spin rounded-full border-2"></div>
                          </div>
                        ) : (
                          <Image
                            className="shrink-0"
                            alt="check"
                            src={"/favicon.png"}
                            height={20}
                            width={20}
                          />
                        )}
                      </span>
                      <span>Grammar</span>
                    </div>
                    <div>
                      {!!issues?.length && (
                        <button
                          onClick={handleAcceptAllCorrections}
                          className="border-primary text-primary h-8 cursor-pointer rounded-full border px-4 text-sm"
                        >
                          Accept All
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span>
                        {recommendations?.length ? (
                          <span className="rounded-md bg-red-500 px-1.5 py-1 text-white">
                            {issues?.length || 0}
                          </span>
                        ) : isRecommendationLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="border-t-muted-foreground h-5 w-5 animate-spin rounded-full border-2"></div>
                          </div>
                        ) : (
                          <Image
                            className="shrink-0"
                            alt="check"
                            src={"/favicon.png"}
                            height={20}
                            width={20}
                          />
                        )}
                      </span>
                      <span>Recommendation</span>
                    </div>
                    <div>
                      {!!recommendations?.length && (
                        <button className="border-primary text-primary h-8 cursor-pointer rounded-full border px-4 text-sm">
                          Accept All
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Drawer */}
      <GrammarSectionbar
        fetchSections={fetchSections}
        handleNewSection={handleNewSection}
        handleSelectSection={handleSelectSection}
      />

      <Popover
        open={
          (Boolean(anchorEl) && !isSidebarOpen && !isMobile) ||
          (Boolean(anchorEl) && isMobile)
        }
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
        {selectedIssue && Object.keys(selectedIssue)?.length > 0 && (
          <div>
            <GrammarIssueCard
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
