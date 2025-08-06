'use client'
import HardBreak   from '@tiptap/extension-hard-break'
import Link        from '@tiptap/extension-link'
import Underline   from '@tiptap/extension-underline'
import { defaultMarkdownParser, defaultMarkdownSerializer, MarkdownSerializer } from '@tiptap/pm/markdown'
import {useSelector} from 'react-redux';
// 1. Clone + extend the default node serializers…
const nodes = {
  ...defaultMarkdownSerializer.nodes,

  // Tiptap's hardBreak node → CommonMark line break
  hardBreak: defaultMarkdownSerializer.nodes.hard_break,

  // Lists
  bulletList:   defaultMarkdownSerializer.nodes.bullet_list,
  orderedList:  defaultMarkdownSerializer.nodes.ordered_list,
  listItem:     defaultMarkdownSerializer.nodes.list_item,

  // Blockquotes, headings, code blocks, horizontal rules, etc.
  blockquote:     defaultMarkdownSerializer.nodes.blockquote,
  heading:        defaultMarkdownSerializer.nodes.heading,
  codeBlock:      defaultMarkdownSerializer.nodes.fence,
  horizontalRule: defaultMarkdownSerializer.nodes.horizontal_rule,
}

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
    open: '<u>',
    close: '</u>',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
}

// 3. Build your custom serializer
const customMarkdownSerializer = new MarkdownSerializer(nodes, marks)

import { Box, Button, Popover } from "@mui/material";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import "./editor.css";
import { CombinedHighlighting } from "./extentions";

// Dummy text for demo mode
const DEMO_TEXT = "The city streets were full of excitement as people gathered for the yearly parade. Brightly colored floats and marching bands filled the air with music and laughter. Spectators lined the sidewalks, cheering and waving as the procession passed by.";
const DEMO_SELECTED_WORD = "parade";

function UserInputBox({
  wordLimit = 300,
  setUserInput,
  userInput = "",
  frozenWords,
  frozenPhrases,
  user,
}) {
  const {demo} = useSelector((state)=> state.settings)
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [selectedWord, setSelectedWord] = useState("");
  const [editorKey, setEditorKey] = useState(0); // Force editor recreation
  const isInternalUpdate = useRef(false);
  const isDemoMode = demo === 'frozen' || demo === 'unfrozen';
  
  // Use demo text when in demo mode, otherwise use userInput
  const editorContent = isDemoMode ? DEMO_TEXT : userInput;
  
  const [initialDoc,setInitialDoc]= useState(editorContent
    ? defaultMarkdownParser.parse(editorContent).toJSON()
    : undefined)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Enter your text here..." }),
      CombinedHighlighting.configure({
        limit: wordLimit,
        frozenWords: frozenWords.set,
        frozenPhrases: frozenPhrases.set,
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
      const md = customMarkdownSerializer.serialize(editor.state.doc);
      setUserInput(md);
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
    if (!editor || isInternalUpdate.current || isDemoMode) {
      // clear the flag so that onUpdate can fire next time
      isInternalUpdate.current = false
      return
    }

    // parse the Markdown into a ProseMirror node
    const doc = defaultMarkdownParser.parse(userInput)

    // update the editor with that JSON
    editor.commands.setContent(doc.toJSON())

    // we're done syncing, clear the flag again
    isInternalUpdate.current = false
  }, [userInput, editor, isDemoMode])

  // Force editor recreation when frozen words/phrases change or demo mode changes
  useEffect(() => {
    setEditorKey(prev => prev + 1);
  }, [frozenWords.set, frozenPhrases.set, isDemoMode]);

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

    if (isPhrase) {
      frozenPhrases.toggle(key);
    } else {
      frozenWords.toggle(key);
    }
    clearSelection();
  };

  const isFrozen = () => {
    // In demo mode, return different values based on demo type
    if (isDemoMode) {
      return demo === 'unfrozen';
    }
    
    const raw = selectedWord.trim().toLowerCase();
    const unquoted = raw.replace(/^"+|"+$/g, "");

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
      <div id={isDemoMode ? (demo === 'frozen' ? "frozen_demo_id" : "unfrozen_demo_id") : undefined}>
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
