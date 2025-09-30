"use client";
import HardBreak from "@tiptap/extension-hard-break";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
  MarkdownSerializer,
} from "@tiptap/pm/markdown";
import { useSelector } from "react-redux";

// Custom extension to handle plain text paste
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

const PlainTextPaste = Extension.create({
  name: "plainTextPaste",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("plainTextPaste"),
        props: {
          handlePaste: (view, event, slice) => {
            // Get the plain text from clipboard
            const plainText = event.clipboardData?.getData("text/plain");

            if (plainText) {
              // Prevent default paste behavior
              event.preventDefault();

              // Insert plain text at current cursor position
              const { tr, selection } = view.state;
              const transaction = tr.insertText(
                plainText,
                selection.from,
                selection.to,
              );
              view.dispatch(transaction);

              return true; // Indicates we handled the paste
            }

            return false; // Let other handlers process non-text pastes
          },
        },
      }),
    ];
  },
});

// SENTENCE highlighter
const InputSentenceHighlighter = Extension.create({
  name: "inputSentenceHighlighter",

  addProseMirrorPlugins() {
    const { highlightSentence, language, hasOutput } = this.options;

    return [
      new Plugin({
        key: new PluginKey("inputSentenceHighlighter"),
        props: {
          decorations(state) {
            if (!hasOutput) return DecorationSet.empty;
            const decos = [];
            const text = state.doc.textContent;

            if (!text || highlightSentence < 0) return DecorationSet.empty;

            // Split into sentences based on language - match the backend logic
            const sentenceSeparator =
              language === "Bangla"
                ? /(?:৤\s+|\.\r?\n+)/
                : /(?:\.\s+|\.\r?\n+)/;

            // Split and track positions
            const parts = text.split(sentenceSeparator);
            const sentences = parts.filter((s) => s.trim().length > 0);

            if (highlightSentence >= sentences.length) {
              return DecorationSet.empty;
            }

            // Find the target sentence text
            const targetSentence = sentences[highlightSentence];
            if (!targetSentence) return DecorationSet.empty;

            // Build array of sentence positions in original text
            let searchPos = 0;
            const sentencePositions = [];

            for (let i = 0; i < sentences.length; i++) {
              const sentence = sentences[i];
              const foundAt = text.indexOf(sentence, searchPos);
              if (foundAt !== -1) {
                sentencePositions.push({
                  start: foundAt,
                  end: foundAt + sentence.length,
                  text: sentence,
                });
                searchPos = foundAt + sentence.length;
              }
            }

            const targetPos = sentencePositions[highlightSentence];
            if (!targetPos) return DecorationSet.empty;

            // Convert text offsets to ProseMirror positions
            let textOffset = 0;
            let startPos = null;
            let endPos = null;

            state.doc.descendants((node, pos) => {
              if (startPos !== null && endPos !== null) return false;

              if (node.isText && node.text) {
                const nodeStart = textOffset;
                const nodeEnd = textOffset + node.text.length;

                // Check if sentence start is in this text node
                if (
                  startPos === null &&
                  targetPos.start >= nodeStart &&
                  targetPos.start < nodeEnd
                ) {
                  startPos = pos + (targetPos.start - nodeStart);
                }

                // Check if sentence end is in this text node
                if (
                  startPos !== null &&
                  endPos === null &&
                  targetPos.end > nodeStart &&
                  targetPos.end <= nodeEnd
                ) {
                  endPos = pos + (targetPos.end - nodeStart);
                }

                textOffset += node.text.length;
              }
            });

            if (startPos !== null && endPos !== null && startPos < endPos) {
              decos.push(
                Decoration.inline(startPos, endPos, {
                  class: "highlighted-sentence",
                }),
              );
            }

            return DecorationSet.create(state.doc, decos);
          },
        },
      }),
    ];
  },

  addOptions() {
    return {
      highlightSentence: 0,
      language: "English (US)",
      hasOutput: false,
    };
  },
});

// 1. Clone + extend the default node serializers…
const nodes = {
  ...defaultMarkdownSerializer.nodes,

  // Tiptap's hardBreak node → CommonMark line break
  hardBreak: defaultMarkdownSerializer.nodes.hard_break,

  // Lists
  bulletList: defaultMarkdownSerializer.nodes.bullet_list,
  orderedList: defaultMarkdownSerializer.nodes.ordered_list,
  listItem: defaultMarkdownSerializer.nodes.list_item,

  // Blockquotes, headings, code blocks, horizontal rules, etc.
  blockquote: defaultMarkdownSerializer.nodes.blockquote,
  heading: defaultMarkdownSerializer.nodes.heading,
  codeBlock: defaultMarkdownSerializer.nodes.fence,
  horizontalRule: defaultMarkdownSerializer.nodes.horizontal_rule,
};

// 2. Clone + extend the default mark serializers…
const marks = {
  ...defaultMarkdownSerializer.marks,

  // **bold**
  bold: defaultMarkdownSerializer.marks.strong,

  // _italic_
  italic: defaultMarkdownSerializer.marks.em,

  // ~~strikethrough~~
  strikethrough: defaultMarkdownSerializer.marks.strike,

  // `inline code`
  code: defaultMarkdownSerializer.marks.code,

  // [link](url)
  link: defaultMarkdownSerializer.marks.link,

  // <u>underline</u> (CommonMark has no native, so we emit HTML)
  underline: {
    open: "<u>",
    close: "</u>",
    mixable: true,
    expelEnclosingWhitespace: true,
  },
};

// 3. Build your custom serializer
const customMarkdownSerializer = new MarkdownSerializer(nodes, marks);

import { Box, Button, Popover } from "@mui/material";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import useSnackbar from "../../../hooks/useSnackbar";
import "./editor.css";
import { CombinedHighlighting } from "./extentions";

// Dummy text for demo mode
const DEMO_TEXT =
  "The city streets were full of excitement as people gathered for the yearly parade. Brightly colored floats and marching bands filled the air with music and laughter. Spectators lined the sidewalks, cheering and waving as the procession passed by.";
const DEMO_SELECTED_WORD = "parade";

function UserInputBox({
  wordLimit = 300,
  setUserInput,
  userInput = "",
  frozenWords,
  frozenPhrases,
  user,
  highlightSentence = 0,
  language = "English (US)",
  hasOutput = false,
}) {
  const { demo, interfaceOptions } = useSelector((state) => state.settings);
  const { useYellowHighlight } = interfaceOptions;
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [selectedWord, setSelectedWord] = useState("");
  const [editorKey, setEditorKey] = useState(0); // Force editor recreation
  const isInternalUpdate = useRef(false);
  const isDemoMode = demo === "frozen" || demo === "unfrozen";

  // Use demo text when in demo mode, otherwise use userInput
  const editorContent = isDemoMode ? DEMO_TEXT : userInput;

  const [initialDoc, setInitialDoc] = useState(
    editorContent
      ? defaultMarkdownParser.parse(editorContent).toJSON()
      : undefined,
  );
  const allowDoubleClickSelection = useRef(false);
  const enqueueSnackbar = useSnackbar();

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        PlainTextPaste,
        Placeholder.configure({ placeholder: "Enter your text here..." }),
        CombinedHighlighting.configure({
          limit: wordLimit,
          frozenWords: frozenWords.set,
          frozenPhrases: frozenPhrases.set,
          useYellowHighlight: useYellowHighlight,
        }),
        InputSentenceHighlighter.configure({
          highlightSentence: highlightSentence,
          language: language,
          hasOutput: hasOutput || false,
        }),
        HardBreak,
        Link.configure({
          openOnClick: true,
          linkOnPaste: true,
        }),
        Underline,
      ],
      content: editorContent,
      // content: initialDoc,
      immediatelyRender: false,
      onSelectionUpdate: ({ editor }) => {
        if (!allowDoubleClickSelection.current) {
          // ignore selection updates from drag/keyboard/etc.
          return;
        }

        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, " ").trim();

        if (selectedText && from !== to) {
          setSelectedWord(selectedText);

          setTimeout(() => {
            const { view } = editor;
            const start = view.coordsAtPos(from);

            setPopoverPosition({
              top: start.bottom + window.scrollY,
              left: start.left + window.scrollX,
            });

            setAnchorEl(document.body);
          }, 10);
        } else {
          clearSelection();
        }
      },
      onUpdate: ({ editor }) => {
        // Don't trigger setUserInput when in demo mode
        if (isDemoMode) {
          return;
        }

        isInternalUpdate.current = true;
        const plainText = editor.getText(); // Extracts plain text content
        setUserInput(plainText); // Pass plain text to the parent component
      },
    },
    [editorKey, highlightSentence, language, hasOutput],
  ); // Recreate editor when key changes

  const clearSelection = () => {
    setAnchorEl(null);
    setSelectedWord("");
  };

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  // This effect handles double-click selection
  useEffect(() => {
    if (!editor) return;

    // single handler ref so we can remove it later
    const doubleClickHandler = (ev) => {
      try {
        // Use click detail (2 = double click). pointerup/click appear earlier than dblclick.
        if (!ev || ev.detail !== 2) return;

        // Read selection from the editor state (ProseMirror selection)
        const sel = editor.state.selection;
        const { from, to } = sel;

        // If there's no selection, nothing to do
        if (!from || !to || from === to) {
          // As a fallback, try the browser selection (rare)
          const s = window.getSelection?.().toString?.().trim();
          if (!s) return;
        }

        // Get the selected text
        const selectedText = editor.state.doc.textBetween(from, to, " ").trim();
        if (!selectedText) return;

        // Save the selected word (for Freeze/unfreeze logic)
        setSelectedWord(selectedText);

        // Compute coordinates using the editor view (safe to access here because handler runs after view exists)
        // Wrap coordsAtPos in try/catch in case view is not ready for some reason.
        try {
          const start = editor.view.coordsAtPos(from);

          setPopoverPosition({
            top: start.bottom + window.scrollY,
            left: start.left + window.scrollX,
          });

          // Use an element truthy for MUI Popover open; we use document.body as you did.
          setAnchorEl(document.body);
        } catch (err) {
          // If coords can't be computed, just open without position fallback
          setPopoverPosition({ top: 0, left: 0 });
          setAnchorEl(document.body);
        }
      } catch (err) {
        // swallow errors — don't break UI
        // console.error('doubleClickHandler error', err);
      }
    };

    const tryAttachNow = () => {
      try {
        const dom = editor.view.dom;
        // Use 'click' (check detail) — more reliable timing than dblclick for selection
        dom.addEventListener("click", doubleClickHandler);
        return () => dom.removeEventListener("click", doubleClickHandler);
      } catch (err) {
        return null;
      }
    };

    let cleanupAttach = tryAttachNow();

    let cleanupCreateOff = null;
    if (!cleanupAttach && typeof editor.on === "function") {
      const onCreate = () => {
        const cleanupNow = tryAttachNow();
        if (cleanupNow) cleanupAttach = cleanupNow;
      };
      editor.on("create", onCreate);
      cleanupCreateOff = () => {
        try {
          if (typeof editor.off === "function") editor.off("create", onCreate);
        } catch (e) {}
      };
    }

    return () => {
      if (cleanupAttach) cleanupAttach();
      if (cleanupCreateOff) cleanupCreateOff();
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || isInternalUpdate.current || isDemoMode) {
      // clear the flag so that onUpdate can fire next time
      isInternalUpdate.current = false;
      return;
    }

    // parse the Markdown into a ProseMirror node
    const doc = defaultMarkdownParser.parse(userInput);

    // update the editor with that JSON
    editor.commands.setContent(doc.toJSON());

    // we're done syncing, clear the flag again
    isInternalUpdate.current = false;
  }, [userInput, editor, isDemoMode]);

  // Force editor recreation when frozen words/phrases, demo mode, or yellow highlight changes
  useEffect(() => {
    setEditorKey((prev) => prev + 1);
  }, [frozenWords.set, frozenPhrases.set, isDemoMode, useYellowHighlight]);

  // Auto-select the demo word when in demo mode
  useEffect(() => {
    if (isDemoMode && editor) {
      // Wait for editor to be ready
      setTimeout(() => {
        const content = editor.state.doc.textContent;
        const wordIndex = content.indexOf(DEMO_SELECTED_WORD);

        if (wordIndex !== -1) {
          const from = wordIndex;
          const to = wordIndex + DEMO_SELECTED_WORD.length;

          // Focus the editor first to make selection visible
          editor.commands.focus();

          // Select the word
          editor.commands.setTextSelection({ from, to });

          // Trigger selection update manually
          setSelectedWord(DEMO_SELECTED_WORD);

          // Position the popover
          setTimeout(() => {
            const { view } = editor;
            const start = view.coordsAtPos(from);

            setPopoverPosition({
              top: start.bottom + window.scrollY,
              left: start.left + window.scrollX,
            });

            setAnchorEl(document.body);
          }, 100);
        }
      }, 200);
    }
  }, [isDemoMode, editor]);

  const normalize = (text) => text.toLowerCase().trim();
  const handleToggleFreeze = () => {
    const key = normalize(selectedWord);
    const isPhrase = key.includes(" ");

    // Get editor content and normalize for counting
    const editorText = editor.getText();

    // Function to count occurrences with better handling
    const countOccurrences = (text, searchTerm, isPhrase) => {
      const normalizedText = text.toLowerCase();
      const normalizedSearch = searchTerm.toLowerCase();

      if (isPhrase) {
        // For phrases, count exact matches
        let count = 0;
        let position = 0;
        while (
          (position = normalizedText.indexOf(normalizedSearch, position)) !== -1
        ) {
          count++;
          position += normalizedSearch.length;
        }
        return count;
      } else {
        // For single words, use word boundaries to avoid partial matches
        // This regex handles punctuation and whitespace correctly
        const escapedTerm = normalizedSearch.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        const regex = new RegExp(`\\b${escapedTerm}\\b`, "gi");
        const matches = normalizedText.match(regex);
        return matches ? matches.length : 0;
      }
    };

    const occurrences = countOccurrences(editorText, key, isPhrase);

    // Determine if we're freezing or unfreezing
    const currentlyFrozen = isFrozen();

    // Toggle the freeze state
    if (isPhrase) {
      frozenPhrases.toggle(key);
    } else {
      frozenWords.toggle(key);
    }

    // Show appropriate message
    const action = currentlyFrozen ? "Unfrozen" : "Frozen";
    const message =
      occurrences > 1
        ? `${action} all ${occurrences} instances`
        : `${action} successfully`;

    enqueueSnackbar(message, {
      variant: "success",
    });

    clearSelection();
  };

  const isFrozen = () => {
    // In demo mode, return different values based on demo type
    if (isDemoMode) {
      return demo === "unfrozen";
    }

    const raw = selectedWord.trim().toLowerCase();
    const unquoted = raw.replace(/^"+|"+$/g, "");

    // Check both quoted and unquoted keys
    return (
      frozenPhrases.has(raw) ||
      frozenPhrases.has(`"${unquoted}"`) ||
      frozenPhrases.has(unquoted) ||
      frozenWords.has(raw) ||
      frozenWords.has(unquoted)
    );
  };

  if (!editor) return null;

  const paidUser =
    user?.package === "pro_plan" ||
    user?.package === "value_plan" ||
    user?.package === "unlimited";

  const getButtonText = () =>
    !paidUser ? "Please upgrade to Freeze" : isFrozen() ? "Unfreeze" : "Freeze";

  return (
    <Box
      sx={{
        flexGrow: 1,
        cursor: "text",
        position: "relative",
        overflowY: "auto",
        p: 2,
      }}
    >
      <div
        id={
          isDemoMode
            ? demo === "frozen"
              ? "frozen_demo_id"
              : "unfrozen_demo_id"
            : undefined
        }
      >
        <EditorContent editor={editor} />
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={clearSelection}
        anchorReference="anchorPosition"
        anchorPosition={popoverPosition}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Button
          variant="contained"
          size="small"
          disabled={!paidUser}
          onClick={handleToggleFreeze}
        >
          {getButtonText()}
        </Button>
      </Popover>
    </Box>
  );
}

export default UserInputBox;
