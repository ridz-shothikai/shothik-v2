'use client'
import { Box, Button, Popover } from "@mui/material";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import "./editor.css";
import { CombinedHighlighting } from "./extentions";

function UserInputBox({
  wordLimit = 300,
  setUserInput,
  userInput = "",
  frozenWords,
  frozenPhrases,
  user,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [selectedWord, setSelectedWord] = useState("");
  const [editorKey, setEditorKey] = useState(0); // Force editor recreation
  const isInternalUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Enter your text here..." }),
      CombinedHighlighting.configure({
        limit: wordLimit,
        frozenWords: frozenWords.set,
        frozenPhrases: frozenPhrases.set,
      }),
    ],
    content: userInput,
    immediatelyRender: false,
    onSelectionUpdate: ({ editor }) => {
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
      isInternalUpdate.current = true;
      setUserInput(editor.getText());
    },
  }, [editorKey]); // Recreate editor when key changes

  const clearSelection = () => {
    setAnchorEl(null);
    setSelectedWord("");
  };

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  useEffect(() => {
    if (editor && !isInternalUpdate.current && userInput !== editor.getHTML()) {
      editor.commands.setContent(userInput);
    }
    isInternalUpdate.current = false;
  }, [userInput, editor]);

  // Force editor recreation when frozen words/phrases change
  useEffect(() => {
    setEditorKey(prev => prev + 1);
  }, [frozenWords.set, frozenPhrases.set]);

  const normalize = (text) => text.toLowerCase().trim();
  const handleToggleFreeze = () => {
    const key = normalize(selectedWord);
    const isPhrase = key.includes(" ");

    if (isPhrase) {
      frozenPhrases.toggle(key);
    } else {
      frozenWords.toggle(key);
    }
    clearSelection();
  };

  // const normalize = (text) => text.toLowerCase().trim().replace(/^"+|"+$/g, '');
  // const isFrozen = () => {
  //   console.log(frozenPhrases, selectedWord)
  //   const key = normalize(selectedWord);
  //   return key.includes(" ")
  //     ? frozenPhrases.has(key)
  //     : frozenWords.has(key);
  // };

const isFrozen = () => {
  const raw = selectedWord.trim().toLowerCase();
  const unquoted = raw.replace(/^"+|"+$/g, "");

  console.log(frozenPhrases.has(selectedWord), selectedWord)
  // Check both quoted and unquoted keys
  return frozenPhrases.has(raw) || frozenPhrases.has(`"${unquoted}"`) || frozenPhrases.has(unquoted)
    || frozenWords.has(raw) || frozenWords.has(unquoted);
};
  if (!editor) return null;

  const paidUser =
    user?.package === "pro_plan" ||
    user?.package === "value_plan" ||
    user?.package === "unlimited";

  const getButtonText = () =>
    !paidUser
      ? "Please upgrade to Freeze"
      : isFrozen()
      ? "Unfreeze"
      : "Freeze";

  return (
    <Box
      sx={{
        flexGrow: 1,
        cursor: "text",
        position: "relative",
        overflowY: "auto",
      }}
    >
      <EditorContent editor={editor} />

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
