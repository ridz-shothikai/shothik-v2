"use client";

import { grammarCheck } from "@/services/grammar-cheker.service";
import { Box, Card, Grid2, MenuItem, Popover, Stack } from "@mui/material";
import { Mark, mergeAttributes } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { trySamples } from "../../../_mock/trySamples";
import { detectLanguage } from "../../../hooks/languageDitector";
import useDebounce from "../../../hooks/useDebounce";
import useResponsive from "../../../hooks/useResponsive";
import useSnackbar from "../../../hooks/useSnackbar";
import { useSpellCheckerMutation } from "../../../redux/api/tools/toolsApi";
import UserActionInput from "../common/UserActionInput";
import LanguageMenu from "./LanguageMenu";

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
        style:
          "background-color: #f5c33b4d; padding: 2px 0; cursor: pointer; border-bottom: 2px solid #f5c33b;",
      }),
      0,
    ];
  },
});

const GrammarContend = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const [outputContend, setOutputContend] = useState("");
  const [language, setLanguage] = useState("English (US)");
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const isMobile = useResponsive("down", "sm");
  const [issues, setIssues] = useState([]);
  const [errorChecking, setErrorChecking] = useState(false);
  const enqueueSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const sampleText =
    trySamples.grammar[language.startsWith("English") ? "English" : language];

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedError, setSelectedError] = useState(null);

  const [spellChecker] = useSpellCheckerMutation();

  // Initialize Tiptap Editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, ErrorMark],
    content: "",
    editorProps: {
      attributes: {
        style:
          "outline: none; min-height: 456px; padding: 16.5px 14px; font-family: inherit; font-size: 1rem; line-height: 1.5;",
      },
      handleClickOn: (view, pos, node, nodePos, event) => {
        const target = event.target;
        if (target.hasAttribute("data-error")) {
          const error = target.getAttribute("data-error");
          const correct = target.getAttribute("data-correct");
          const errorId = target.getAttribute("data-error-id");

          setSelectedError({ error, correct, errorId, element: target });
          setAnchorEl(target);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setUserInput(text);
    },
  });

  useEffect(() => {
    if (!userInput) return;
    const detectedLanguage = detectLanguage(userInput);
    console.log(detectedLanguage);
    setLanguage(detectedLanguage);
  }, [userInput]);

  const handleCheckSpelling = async () => {
    try {
      setErrorChecking(true);
      const data = await grammarCheck({ content: userInput });
      const { issues } = data?.result || {};
      setIssues(issues || []);
      console.log(issues);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setErrorChecking(false);
    }
  };

  const text = useDebounce(userInput);

  useEffect(() => {
    if (!text) return;
    handleCheckSpelling(text);
  }, [text]);

  // Apply error highlighting to editor
  useEffect(() => {
    if (!editor || !userInput) return;

    const { state } = editor;
    let tr = state.tr;

    // Remove all existing error marks
    tr = tr.removeMark(0, state.doc.content.size, state.schema.marks.errorMark);

    // Apply new error marks
    issues.forEach((errorObj, index) => {
      const { error, correct } = errorObj;
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
              errorId: `error-${index}-${start}`,
            }),
          );
        }
      });
    });

    editor.view.dispatch(tr);
  }, [issues, editor]);

  const handleAcceptCorrection = () => {
    if (!selectedError || !editor) return;

    const { error, correct } = selectedError;
    const content = editor.getText();

    // Find and replace the error with correction
    const newContent = content.replace(
      new RegExp(error.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      correct,
    );

    editor.commands.setContent(newContent);

    // Remove this error from errors array
    setIssues((prev) => prev.filter((e) => e.error !== error));

    handleClosePopover();
  };

  const handleIgnoreError = () => {
    if (!selectedError) return;

    const { error } = selectedError;

    // Remove this error from errors array
    setIssues((prev) => prev.filter((e) => e.error !== error));

    handleClosePopover();
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedError(null);
  };

  function handleClear() {
    setUserInput("");
    setOutputContend("");
    setIssues([]);
    setLanguage("English");
    if (editor) {
      editor.commands.setContent("");
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
            sx={{
              overflowY: "auto",
              maxHeight: { xs: 360, sm: "auto" },
              minHeight: isMobile ? 360 : 456,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: "0 8px 8px 8px",
              backgroundColor: "background.paper",
              "& .ProseMirror": {
                minHeight: isMobile ? 360 : 456,
                "&:focus": {
                  outline: "none",
                },
                "&.ProseMirror-focused": {
                  outline: "none",
                },
              },
              "& .ProseMirror p.is-editor-empty:first-child::before": {
                content: '"Input your text here..."',
                color: "text.disabled",
                float: "left",
                height: 0,
                pointerEvents: "none",
              },
            }}
          >
            <EditorContent editor={editor} />
          </Box>
          {!userInput ? (
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
          ) : null}
        </Grid2>
      </Grid2>

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
        <Stack sx={{ minWidth: 200 }}>
          {selectedError && (
            <>
              <MenuItem
                onClick={handleAcceptCorrection}
                sx={{
                  color: "success.main",
                  "&:hover": {
                    backgroundColor: "success.lighter",
                  },
                }}
              >
                ✓ Accept: {selectedError.correct}
              </MenuItem>
              <MenuItem
                onClick={handleIgnoreError}
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                ✕ Ignore
              </MenuItem>
            </>
          )}
        </Stack>
      </Popover>
    </Card>
  );
};

export default GrammarContend;
