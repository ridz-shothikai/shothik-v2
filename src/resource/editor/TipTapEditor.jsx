import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatUnderlined,
  HorizontalRule,
  FormatStrikethrough,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Undo, // New Icon
  Redo, // New Icon
} from "@mui/icons-material";
import { Box, IconButton, Typography, Button } from "@mui/material";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import HorizontalRuleExtension from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from '@tiptap/extension-placeholder';
import { Mark, mergeAttributes, Extension } from '@tiptap/core';
import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useState } from "react"; // Added useState
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Plugin, PluginKey } from 'prosemirror-state';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';

const FrozenWordMark = Mark.create({
  name: 'frozenWord',

  defaultOptions: {
    HTMLAttributes: {
      class: 'frozen-word', // Add a class for styling
    },
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-frozen-word]', // How to recognize it from HTML
        // Or use class: { tag: 'span.frozen-word' } if class is consistently applied
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // mergeAttributes is important for Tiptap to correctly handle attributes
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {'data-frozen-word': 'true'}), 0];
  },

  addCommands() {
    return {
      toggleFrozenWord: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
    };
  },
});

const getRandomColor = () => {
  const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D'];
  return colors[Math.floor(Math.random() * colors.length)];
};
const wordLimitPluginKey = new PluginKey('wordLimit');

function createWordLimitPlugin({ wordLimit, className }) {
  return new Plugin({
    key: wordLimitPluginKey,
    state: {
      init() {
        return { decorations: DecorationSet.empty, wordCount: 0 };
      },
      apply(tr, value, oldState, newState) {
        const { doc } = newState;
        const textContent = doc.textContent;
        const words = textContent.trim().split(/\s+/).filter(Boolean);
        const wordCount = words.length;

        let decorations = DecorationSet.empty;
        if (wordCount > wordLimit) {
          let textPosition = 0;
          let currentWords = 0;

          doc.descendants((node, pos) => {
            if (currentWords >= wordLimit) return false; // Stop iterating if limit already processed

            if (node.isText) {
              const nodeWords = node.textContent.trim().split(/\s+/).filter(Boolean);
              if (currentWords + nodeWords.length <= wordLimit) {
                currentWords += nodeWords.length;
                textPosition = pos + node.nodeSize;
              } else {
                // Find the exact character position within this node
                let charInNode = 0;
                let wordsInNodeCount = 0;
                node.textContent.split(/\s+/).find(word => {
                  if (word.length > 0) {
                    if (currentWords + wordsInNodeCount < wordLimit) {
                      charInNode += word.length + (node.textContent[charInNode + word.length] === ' ' ? 1 : 0);
                      wordsInNodeCount++;
                    } else {
                      return true; // Found the word that hits the limit
                    }
                  }
                  return false;
                });
                textPosition = pos + charInNode;
                currentWords = wordLimit; // Mark as limit reached
              }
            } else {
              // For non-text nodes, we might need to increment position differently
              // but Tiptap/Prosemirror handles positions globally.
              // This simplified iteration assumes text nodes are primary content carriers for word count.
            }
            return true; // Continue descent
          });

          if (textPosition < doc.content.size) {
            decorations = DecorationSet.create(doc, [
              Decoration.inline(textPosition, doc.content.size, { class: className }),
            ]);
          }
        }
        return { decorations, wordCount };
      },
    },
    props: {
      decorations(state) {
        const pluginState = wordLimitPluginKey.getState(state);
        return pluginState ? pluginState.decorations : DecorationSet.empty;
      },
    },
  });
}

const WordLimitExtension = Extension.create({
  name: 'wordLimitExtension',

  addOptions() {
    return {
      limit: Infinity,
      className: 'over-limit',
    };
  },

  addProseMirrorPlugins() {
    return [
      createWordLimitPlugin({ wordLimit: this.options.limit, className: this.options.className }),
    ];
  },
});


const TipTapEditor = ({
  content,
  onChange,
  embedStyle = false,
  onFrozenWordsChange = () => {},
  wordLimit = Infinity,
  userName,
  userColor,
  documentId // New required prop
}) => {
  const [yDoc, setYDoc] = useState(null);
  const [yProvider, setYProvider] = useState(null);
  const [undoManager, setUndoManager] = useState(null);
  const [historyChanged, setHistoryChanged] = useState(0); // For re-rendering buttons

  // Determine effective user details
  const effectiveUserName = userName || `User-${Math.floor(Math.random() * 1000)}`;
  const effectiveUserColor = userColor || getRandomColor();
  const collabUserDetails = { name: effectiveUserName, color: effectiveUserColor };
  // Removed old collabUser useState

  useEffect(() => {
    const doc = new Y.Doc();
    new IndexeddbPersistence(documentId, doc);
    const provider = new WebrtcProvider(documentId, doc);
    const yXmlFragment = doc.getXmlFragment('default'); // Tiptap's default
    const um = new Y.UndoManager(yXmlFragment);

    const handleStackItemUpdate = () => setHistoryChanged(prev => prev + 1);
    um.on('stack-item-added', handleStackItemUpdate);
    um.on('stack-item-popped', handleStackItemUpdate);

    setYDoc(doc);
    setYProvider(provider);
    setUndoManager(um);

    return () => {
      provider.disconnect();
      um.off('stack-item-added', handleStackItemUpdate);
      um.off('stack-item-popped', handleStackItemUpdate);
      um.destroy();
      doc.destroy();
    };
  }, [documentId]); // Added documentId to dependency array

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, history: false }), // Disable StarterKit's history
      // History.configure({ document: yDoc }), // This would be for yjs-history, not Y.UndoManager directly with Tiptap history
      Heading.configure({ levels: [1, 2, 3, 4] }), // Supports H2 - H4
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      HorizontalRuleExtension,
      Bold,
      Italic,
      Underline,
      Strike,
      TextAlign.configure({ types: ['heading', 'paragraph', 'list_item', 'blockquote'] }),
      Placeholder.configure({ placeholder: 'Enter your text here...' }),
      FrozenWordMark,
      WordLimitExtension.configure({ limit: wordLimit }),
      ...(yDoc ? [Collaboration.configure({ document: yDoc, field: 'default' })] : []), // field: 'default' is Tiptap's default
      ...(yProvider ? [CollaborationCursor.configure({ provider: yProvider, user: collabUserDetails, render: (user) => {
        const cursor = document.createElement('span')
        cursor.classList.add('collaboration-cursor__caret')
        cursor.setAttribute('style', `border-color: ${user.color}`)

        const label = document.createElement('div')
        label.classList.add('collaboration-cursor__label')
        label.setAttribute('style', `background-color: ${user.color}`)
        label.insertBefore(document.createTextNode(user.name), null)
        cursor.insertBefore(label, null)
        return cursor
      } })] : []),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Keep this for non-collaborative updates if needed, or rely on Yjs sync
      const frozenTexts = [];
      editor.state.doc.descendants((node, pos) => {
        if (node.isText) {
          const marks = node.marks.filter(mark => mark.type.name === 'frozenWord');
          if (marks.length > 0) {
            frozenTexts.push(node.textContent);
          }
        }
      });
      const uniqueFrozenTexts = Array.from(new Set(frozenTexts));
      onFrozenWordsChange(uniqueFrozenTexts);
    },
  }, [yDoc, yProvider, wordLimit]); // Added yDoc, yProvider to dependency array

  useEffect(() => {
    // Handle external content changes for collaborative mode if needed
    // This might conflict with Yjs, so be cautious.
    // For a fully Yjs-driven editor, initial content is typically loaded into Y.Doc directly.
    if (editor && !yDoc && content !== editor.getHTML()) { // Condition to avoid conflict with Yjs
      editor.commands.setContent(content, false);
    }
  }, [content, editor, yDoc]);


  if (!editor) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={embedStyle ? {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          py: 1,
        } : {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          py: 1,
          border: "2px solid",
          borderBottom: 0,
          borderColor: "divider",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
        }}
      >
        {/* Group 1: Undo, Redo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1.5 }}>
          <IconButton
            onClick={() => undoManager?.undo()}
            disabled={!undoManager?.canUndo()}
            size='small'
          >
            <Undo />
          </IconButton>
          <IconButton
            onClick={() => undoManager?.redo()}
            disabled={!undoManager?.canRedo()}
            size='small'
          >
            <Redo />
          </IconButton>
        </Box>

        {/* Group 2: Bold, Italic, Underline, Strikethrough */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1.5 }}>
          <IconButton onClick={() => editor.commands.toggleBold()} size='small'>
            <FormatBold />
          </IconButton>
          <IconButton onClick={() => editor.commands.toggleItalic()} size='small'>
            <FormatItalic />
          </IconButton>
          <IconButton
            onClick={() => editor.commands.toggleUnderline()}
            size='small'
          >
            <FormatUnderlined />
          </IconButton>
          <IconButton
            onClick={() => editor.commands.toggleStrike()}
            size='small'
          >
            <FormatStrikethrough />
          </IconButton>
        </Box>

        {/* Group 3: Paragraph, H2, H3, H4 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1.5 }}>
          <IconButton
            onClick={() => editor.commands.setParagraph({ level: 1 })}
            size='small'
          >
            <Typography fontWeight={600}>P</Typography>
          </IconButton>
          <IconButton
            onClick={() => editor.commands.setHeading({ level: 2 })}
            size='small'
          >
            <Typography fontWeight={600}>H2</Typography>
          </IconButton>
          <IconButton
            onClick={() => editor.commands.setHeading({ level: 3 })}
            size='small'
          >
            <Typography fontWeight={600}>H3</Typography>
          </IconButton>
          <IconButton
            onClick={() => editor.commands.setHeading({ level: 4 })}
            size='small'
          >
            <Typography fontWeight={600}>H4</Typography>
          </IconButton>
        </Box>

        {/* Group 4: Ordered List, Unordered List */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1.5 }}>
          <IconButton
            onClick={() => editor.commands.toggleOrderedList()}
            size='small'
          >
            <FormatListNumbered />
          </IconButton>
          <IconButton
            onClick={() => editor.commands.toggleBulletList()}
            size='small'
          >
            <FormatListBulleted />
          </IconButton>
        </Box>

        {/* Group 5: Blockquote, Horizontal Rule */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1.5 }}>
          <IconButton
            onClick={() => editor.commands.toggleBlockquote()}
            size='small'
          >
            <FormatQuote />
          </IconButton>
          <IconButton
            onClick={() => editor.commands.setHorizontalRule()}
            size='small'
          >
            <HorizontalRule />
          </IconButton>
        </Box>

        {/* Group 6: Align Left, Align Center, Align Right, Align Justify */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}> {/* No mr on last group */}
          <IconButton
            onClick={() => editor.commands.setTextAlign('left')}
            size='small'
          >
            <FormatAlignLeft />
          </IconButton>
          <IconButton
            onClick={() => editor.commands.setTextAlign('center')}
            size='small'
          >
            <FormatAlignCenter />
          </IconButton>
          <IconButton
            onClick={() => editor.commands.setTextAlign('right')}
            size='small'
          >
            <FormatAlignRight />
          </IconButton>
          <IconButton
            onClick={() => editor.commands.setTextAlign('justify')}
            size='small'
          >
            <FormatAlignJustify />
          </IconButton>
        </Box>
      </Box>

      {/* Wrapped Editor Content in Box for Proper Styling */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          position: 'relative',
          ...(embedStyle ? {} : {
            border: "2px solid",
            borderColor: "divider",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            minHeight: "100px", // Retain minHeight for standalone mode
            transition: "border-color 0.3s ease-in-out",
            "&:focus-within": {
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
              borderColor: "primary.main",
            },
          })
        }}
      >
        <EditorContent editor={editor} />
        {editor && <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, placement: 'top-start' }}
          shouldShow={({ editor: currentEditor, view, state, oldState, from, to }) => {
            // Only show if there's an actual text selection
            const { selection } = state;
            return selection.from !== selection.to;
          }}
        >
          <Box
            sx={{
              padding: '4px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <Button
              onClick={() => currentEditor.chain().focus().toggleFrozenWord().run()}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: editor.isActive('frozenWord') ? 'secondary.main' : 'primary.main',
                '&:hover': {
                  backgroundColor: editor.isActive('frozenWord') ? 'secondary.dark' : 'primary.dark',
                }
              }}
            >
              {editor.isActive('frozenWord') ? 'Unfreeze' : 'Freeze'}
            </Button>
          </Box>
        </BubbleMenu>}
      </Box>

      {/* Global Styles for ProseMirror */}
      <style>{`
        .ProseMirror {
          min-height: 90px; /* Keep a min-height */
          height: 100%;    /* Add this */
          padding: 5px 10px;
          font-size: 16px;
          outline: none;
        }
        .ProseMirror p, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4 {
          margin: 0;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .frozen-word {
          background-color: #e0f7fa; /* A light cyan/blue */
          color: #00796b; /* A darker teal for text */
          padding: 1px 0; /* Small vertical padding */
          border-radius: 3px;
        }
        .over-limit {
          background-color: rgba(255, 0, 0, 0.1); /* Light red background for text over limit */
          /* color: red; */ /* Optional: change text color */
        }
        .collaboration-cursor__caret {
          position: relative;
          margin-left: -1px;
          margin-right: -1px;
          border-left: 1px solid #0D0D0D;
          border-right: 1px solid #0D0D0D;
          word-break: normal;
          pointer-events: none;
        }
        .collaboration-cursor__label {
          position: absolute;
          top: -1.4em;
          left: -1px;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          user-select: none;
          color: #fff;
          padding: 0.1rem 0.3rem;
          border-radius: 3px 3px 3px 0;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default TipTapEditor;
