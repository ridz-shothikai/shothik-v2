// src/components/tools/paraphrase/EditableOutput.jsx
"use client"

import React, { useEffect } from "react"
import { Node, Extension } from "@tiptap/core"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import { Plugin, TextSelection } from "prosemirror-state"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { defaultMarkdownParser } from "@tiptap/pm/markdown"

import HardBreak from "@tiptap/extension-hard-break"
// ─── 1. Color helper ───────────────────────────────────────────────────────
function getColorStyle(type, dark = false) {
  const adjVerb = dark ? "#ef5c47" : "#d95645"
  const noun    = dark ? "#b6bdbd" : "#530a78"
  const phrase  = dark ? "#b6bdbd" : "#051780"
  const freeze  = "#006ACC"

  if (/NP/.test(type))      return adjVerb
  if (/VP/.test(type))      return noun
  if (/PP|CP|AdvP|AdjP/.test(type)) return phrase
  if (/freeze/.test(type))  return freeze
  return "inherit"
}

// ─── 2. CursorWatcher extension ────────────────────────────────────────────
const CursorWatcher = Extension.create({
  name: "cursorWatcher",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations(state) {
            const { from, empty } = state.selection
            if (!empty) return null

            const decos = []
            state.doc.descendants((node, pos) => {
              if (node.type.name === "sentenceNode") {
                const start = pos
                const end   = pos + node.nodeSize
                if (from >= start && from <= end) {
                  decos.push(Decoration.node(start, end, {
                    class: "active-sentence",
                  }))
                }
              }
            })
            return DecorationSet.create(state.doc, decos)
          },
        },
      }),
    ]
  },
})

// ─── 3. WordNode & SentenceNode ───────────────────────────────────────────
const WordNode = Node.create({
  name: "wordNode",
  group: "inline",
  inline: true,
  content: "text*",
  priority: 50, // Lower priority than default nodes
  addAttributes() {
    return {
      "data-sentence-index": { default: null },
      "data-word-index":     { default: null },
      "data-type":           { default: null },
      class:                 { default: "word-span" },
      style:                 { default: null },
    }
  },
  parseHTML() {
    return [{ tag: "span.word-span" }]
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0]
  },
})

const SentenceNode = Node.create({
  name: "sentenceNode",
  group: "inline",
  inline: true,
  content: "wordNode* text*", // Allow both wordNode and regular text
  priority: 50, // Lower priority than default nodes
  addAttributes() {
    return {
      "data-sentence-index": { default: null },
      class:                 { default: "sentence-span" },
    }
  },
  parseHTML() {
    return [{ tag: "span.sentence-span" }]
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0]
  },
})

// ─── 4. EnterHandler extension ─────────────────────────────────────────────
const EnterHandler = Extension.create({
  name: "enterHandler",
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state, view } = editor
        const { tr, selection, doc, schema } = state
        const from = selection.from

        // find max existing sentence index
        let maxIndex = 0
        doc.descendants(node => {
          if (node.type.name === "sentenceNode") {
            const idx = parseInt(node.attrs["data-sentence-index"], 10)
            if (!isNaN(idx) && idx > maxIndex) maxIndex = idx
          }
        })
        const nextIndex = maxIndex + 1

        // build a single-word sentenceNode
        const wordNode = schema.nodes.wordNode.create(
          {
            "data-sentence-index": nextIndex,
            "data-word-index":     1,
            "data-type":           "",
            class:                 "word-span",
            style:                 "color:inherit;cursor:pointer",
          },
          schema.text("\u00A0")
        )
        const sentenceNode = schema.nodes.sentenceNode.create(
          { "data-sentence-index": nextIndex, class: "sentence-span" },
          [wordNode]
        )
        const paragraph = schema.nodes.paragraph.create({}, [sentenceNode])
        const newTr = tr.insert(from, paragraph)

        // move cursor inside new word
        const resolved = newTr.doc.resolve(from + paragraph.nodeSize - 1)
        const sel = TextSelection.near(resolved)
        view.dispatch(newTr.setSelection(sel).scrollIntoView())
        return true
      },
    }
  },
})

// ─── 5. Enhanced Markdown parsing helper ───────────────────────────────────

function parseMarkdownText(text) {
  const marks = []
  let core = text
  let trailing = ''

  // 1. Detach trailing punctuation (one of . , ; ? !)
  const punctMatch = core.match(/^(.*?)([.,;?!])$/)
  if (punctMatch) {
    core = punctMatch[1]
    trailing = punctMatch[2]
  }

  // 2. Check for bold (** or __)
  let m
  if (m = core.match(/^(\*\*|__)([\s\S]+?)\1$/)) {
    marks.push({ type: 'bold' })
    core = m[2]
  }
  // 3. Check for strikethrough ~~text~~
  else if (m = core.match(/^~~([\s\S]+?)~~$/)) {
    marks.push({ type: 'strike' })
    core = m[1]
  }
  // 4. Check for italic (* or _), but only if not already bold
  else if (m = core.match(/^(\*|_)([\s\S]+?)\1$/)) {
    marks.push({ type: 'italic' })
    core = m[2]
  }
  // 5. Check for inline code `text`
  else if (m = core.match(/^`([\s\S]+?)`$/)) {
    marks.push({ type: 'code' })
    core = m[1]
  }

  // 6. Reattach punctuation to the processed text
  const processedText = core + trailing

  return { text: processedText, marks }
}

// ─── 6. Helper to detect and process heading sentences ────────────────────
function processHeadingSentence(sentence, sIdx) {
  // Check if sentence starts with heading markers
  const firstWord = sentence[0]?.word || ""
  const headingMatch = firstWord.match(/^(#{1,6})$/)
  
  if (headingMatch && sentence.length > 1) {
    const level = headingMatch[1].length
    const headingText = sentence.slice(1).map(w => w.word).join(" ").trim()
    
    return {
      type: "heading",
      attrs: { level },
      content: [{
        type: "text",
        text: headingText
      }]
    }
  }
  
  return null
}

// ─── 7. Helper to process newline sentences ───────────────────────────────
function isNewlineSentence(sentence) {
  return sentence.length === 1 && /^\n+$/.test(sentence[0].word)
}

// ─── 8. formatContent: JSON ⇄ ProseMirror document ─────────────────────────
function formatContent(data) {
  // empty
  if (!data) {
    return { type: "doc", content: [] }
  }

  // Markdown string?
  if (typeof data === "string") {
    try {
      const parsed = defaultMarkdownParser.parse(data)
      if (parsed) {
        const jsonDoc = parsed.toJSON()
        console.log("Parsed markdown JSON:", JSON.stringify(jsonDoc, null, 2))
        return jsonDoc
      }
    } catch (error) {
      console.warn("Failed to parse markdown, falling back to plain text:", error)
    }
    // Fallback: treat as plain text in a paragraph
    return {
      type: "doc",
      content: [{
        type: "paragraph",
        content: [{
          type: "text",
          text: data
        }]
      }]
    }
  }

  // assume `data` is Array< Array<WordObj> >
  const sentences = Array.isArray(data[0]) ? data : [data]
  const docContent = []

  for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
    const sentence = sentences[sIdx]
    
    if (isNewlineSentence(sentence)) {
      // emit a hardBreak node wrapped in a paragraph
      docContent.push({
        type: "paragraph",
        content: [
          { type: "hardBreak" }
        ],
      })
      continue
    }    
    // Check if this sentence is a heading
    const headingNode = processHeadingSentence(sentence, sIdx)
    if (headingNode) {
      docContent.push(headingNode)
      continue
    }
    
    // Process as regular sentence with word nodes
    const sentenceNode = {
      type: "sentenceNode",
      attrs: {
        "data-sentence-index": sIdx + 1,
        class: "sentence-span",
      },
      content: sentence.map((wObj, wIdx) => {
        const raw = wObj.word
        
        // Enhanced markdown parsing for individual words
        const { text: processedText, marks } = parseMarkdownText(raw)
        
        // spacing logic
        const prefix =
          (sIdx === 0 && wIdx === 0) || /^[.,;?!]$/.test(raw) ? "" : " "

        return {
          type: "wordNode",
          attrs: {
            "data-sentence-index": sIdx + 1,
            "data-word-index": wIdx + 1,
            "data-type": wObj.type,
            class: "word-span",
            style: `color:${getColorStyle(wObj.type)};cursor:pointer`,
          },
          content: [
            {
              type: "text",
              text: prefix + processedText,
              ...(marks.length ? { marks } : {}),
            },
          ],
        }
      }),
    }

    // Wrap sentence in paragraph
    docContent.push({
      type: "paragraph",
      content: [sentenceNode],
    })
  }

  return {
    type: "doc",
    content: docContent,
  }
}

// ─── 9. EditableOutput component ───────────────────────────────────────────
export default function EditableOutput({
  data,
  setSynonymsOptions,
  setSentence,
  setAnchorEl,
  highlightSentence,
  setHighlightSentence,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ 
        enter: false,
        // Enable all text formatting features
        bold: true,
        italic: true,
        strike: true,
        code: true,
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: 'heading-node',
          },
        }
      }),
      // Add custom nodes AFTER StarterKit to avoid conflicts
      HardBreak,
      SentenceNode,
      WordNode,
      CursorWatcher,
      EnterHandler,
    ],
    editable: true,
    immediatelyRender: false, // avoid SSR hydration warnings
  })

  // load (or reload) `data` into the editor whenever it changes
  useEffect(() => {
    if (!editor) return
    editor.commands.setContent(formatContent(data))
  }, [editor, data])

  // click-to-synonyms
  useEffect(() => {
    if (!editor) return
    const dom = editor.view.dom
    const onClick = (e) => {
      const el = e.target.closest(".word-span")
      if (!el) return
      const sI = Number(el.getAttribute("data-sentence-index"))
      const wI = Number(el.getAttribute("data-word-index"))
      const wObj = data[sI - 1]?.[wI - 1]
      if (!wObj) return

      setAnchorEl(el)
      setSynonymsOptions({
        synonyms:        wObj.synonyms || [],
        sentenceIndex:  sI,
        wordIndex:      wI,
        showRephraseNav: true,
      })
      setHighlightSentence(sI - 1)
      setSentence(data[sI - 1].map((w) => w.word).join(" "))
    }
    dom.addEventListener("click", onClick)
    return () => dom.removeEventListener("click", onClick)
  }, [editor, data])

  if (!editor) return null
  return <EditorContent editor={editor} />
}
