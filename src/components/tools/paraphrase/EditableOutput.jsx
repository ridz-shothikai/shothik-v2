// src/components/tools/paraphrase/EditableOutputWithStructural.jsx
"use client";

import { Extension, Node } from "@tiptap/core";
import HardBreak from "@tiptap/extension-hard-break";
import { defaultMarkdownParser } from "@tiptap/pm/markdown";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { diffWordsWithSpace } from "diff";
import { Plugin, PluginKey, TextSelection } from "prosemirror-state";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

/* ============================================================
   Utilities: sentence splitting, token normalization,
   structural annotation (existing), and diff-based longest-unchanged
   ============================================================ */

// naive sentence splitter (keeps punctuation)
function splitSentencesFromText(text) {
  if (!text) return [];
  const re = /([^.!?]+[.!?]?)/g;
  const matches = text.match(re);
  if (!matches) return [text];
  return matches.map((s) => s.trim()).filter(Boolean);
}

// normalize words: lowercase and remove basic punctuation
function tokenizeWords(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[.,;:?!()"\u201c\u201d\u2018\u2019]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

// compute simple word overlap ratio
function wordOverlapRatio(aStr, bStr) {
  const a = new Set(tokenizeWords(aStr));
  const b = new Set(tokenizeWords(bStr));
  if (a.size === 0 || b.size === 0) return 0;
  let common = 0;
  for (const w of a) if (b.has(w)) common++;
  return common / Math.min(a.size, b.size);
}

/* ====== annotateStructuralChanges (keeps our previous heuristic + structured compare) ====== */
function annotateStructuralChanges({
  outputData,
  inputTokens = null,
  inputText = null,
  sentenceOverlapThreshold = 0.65,
}) {
  if (!outputData) return [];

  const cloned = outputData.map((sentence) =>
    sentence?.map((w) => ({ ...w, structuralChange: false })),
  );

  // Mode A: structured comparison if inputTokens available
  if (Array.isArray(inputTokens) && inputTokens.length > 0) {
    for (let sIdx = 0; sIdx < cloned.length; sIdx++) {
      const outSentence = cloned[sIdx] || [];
      const inSentence = inputTokens[sIdx] || [];

      if (!inSentence || inSentence.length === 0) {
        outSentence.forEach((token) => (token.structuralChange = true));
        continue;
      }

      const maxLen = Math.max(outSentence.length, inSentence.length);
      for (let wIdx = 0; wIdx < maxLen; wIdx++) {
        const o = outSentence[wIdx];
        const i = inSentence[wIdx];
        if (!o) continue;
        if (!i) {
          o.structuralChange = true;
          continue;
        }
        if ((i.type || "") !== (o.type || "")) {
          o.structuralChange = true;
        } else {
          o.structuralChange = false;
        }
      }
    }

    return cloned;
  }

  // Mode B: heuristics using inputText only
  const inputSentences = inputText ? splitSentencesFromText(inputText) : [];
  const outputSentencesStr = cloned.map((s) =>
    s
      .map((w) => w.word)
      .join(" ")
      .trim(),
  );

  for (let sIdx = 0; sIdx < cloned.length; sIdx++) {
    const outSentStr = outputSentencesStr[sIdx] || "";
    if (!outSentStr) continue;

    let bestIdx = -1;
    let bestScore = 0;
    for (let i = 0; i < inputSentences.length; i++) {
      const score = wordOverlapRatio(outSentStr, inputSentences[i]);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    const markStructural = bestScore < sentenceOverlapThreshold;
    if (markStructural) {
      cloned[sIdx].forEach((t) => (t.structuralChange = true));
      continue;
    }

    const matchedInput = inputSentences[bestIdx] || "";
    const matchedWordsSet = new Set(tokenizeWords(matchedInput));
    for (const token of cloned[sIdx]) {
      const tokenWords = tokenizeWords(token.word);
      if (tokenWords.length === 0) continue;
      const common = tokenWords.filter((w) => matchedWordsSet.has(w)).length;
      const tokenOverlap = common / tokenWords.length;
      if (tokenOverlap < 0.4) token.structuralChange = true;
      else token.structuralChange = false;
    }
  }

  return cloned;
}

/* ============================================================
   DIFF-based longest-unchanged helpers (minLen = 7)
   ============================================================ */

function normalizeTokenSurface(s) {
  if (!s) return "";
  return String(s)
    .toLowerCase()
    .replace(/[""''.,;:?!()[\]{}<>]/g, "")
    .trim();
}

function tokenSurfaceArray(sentenceTokens) {
  return (sentenceTokens || []).map((t) => normalizeTokenSurface(t.word));
}

// Expand output tokens into a per-word list with token index mapping.
function buildWordToTokenMap(outSentence) {
  const arr = []; // { w, tokenIdx }
  for (let tokenIdx = 0; tokenIdx < (outSentence || []).length; tokenIdx++) {
    const token = outSentence[tokenIdx];
    const surface = normalizeTokenSurface(token.word);
    const words = surface.length ? surface.split(/\s+/).filter(Boolean) : [];
    for (const w of words) arr.push({ w, tokenIdx });
  }
  return arr;
}

// Try to find the contiguous sequence of segmentWords inside the expanded word array.
function findTokenRangeForSegment(outSentence, segmentWords) {
  if (!segmentWords || segmentWords.length === 0) return null;
  const map = buildWordToTokenMap(outSentence);
  const L = segmentWords.length;
  if (map.length < L) return null;

  for (let i = 0; i + L <= map.length; i++) {
    let ok = true;
    for (let k = 0; k < L; k++) {
      if (map[i + k].w !== segmentWords[k]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      const startTokenIdx = map[i].tokenIdx;
      const endTokenIdx = map[i + L - 1].tokenIdx;
      return [startTokenIdx, endTokenIdx];
    }
  }
  return null;
}

/**
 * Mark unchangedLongest using diffWordsWithSpace.
 */
function markLongestUnchangedUsingDiff({
  outputData,
  inputTokens = null,
  inputText = null,
  minLenWords = 7,
}) {
  if (!outputData) return outputData;
  const cloned = outputData.map((s) =>
    s.map((t) => ({ ...t, unchangedLongest: false })),
  );

  const inputSentencesText = inputText ? splitSentencesFromText(inputText) : [];

  for (let sIdx = 0; sIdx < cloned.length; sIdx++) {
    const outSentence = cloned[sIdx];
    const outStr = outSentence
      .map((t) => t.word)
      .join(" ")
      .trim();

    // pick input sentence string to compare with
    let inStr = null;
    if (inputTokens && inputTokens[sIdx]) {
      inStr = inputTokens[sIdx]
        .map((t) => t.word)
        .join(" ")
        .trim();
    } else if (inputTokens) {
      // best-match input sentence by overlap
      let bestIdx = -1,
        bestScore = 0;
      for (let i = 0; i < inputTokens.length; i++) {
        const score = wordOverlapRatio(
          outStr,
          inputTokens[i].map((t) => t.word).join(" "),
        );
        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }
      if (bestIdx !== -1)
        inStr = inputTokens[bestIdx]
          .map((t) => t.word)
          .join(" ")
          .trim();
    } else if (inputText && inputSentencesText.length > 0) {
      let bestIdx = -1,
        bestScore = 0;
      for (let i = 0; i < inputSentencesText.length; i++) {
        const score = wordOverlapRatio(outStr, inputSentencesText[i]);
        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }
      if (bestIdx !== -1) inStr = inputSentencesText[bestIdx];
    }

    if (!inStr || !inStr.length) continue;

    // diff the two sentence strings
    const changes = diffWordsWithSpace(inStr, outStr);

    // collect unchanged segments that have >= minLenWords words
    for (const seg of changes) {
      if (seg.added || seg.removed) continue; // changed segment, skip
      const segNorm = normalizeTokenSurface(seg.value);
      const segWords = segNorm.length
        ? segNorm.split(/\s+/).filter(Boolean)
        : [];
      if (segWords.length < minLenWords) continue;

      // find token range in output sentence corresponding to this unchanged segment
      const tokenRange = findTokenRangeForSegment(outSentence, segWords);
      if (!tokenRange) {
        continue;
      }
      const [startTokenIdx, endTokenIdx] = tokenRange;
      for (let ti = startTokenIdx; ti <= endTokenIdx; ti++) {
        const token = outSentence[ti];
        if (token) token.unchangedLongest = true;
      }
    }
  }

  return cloned;
}

/* ============================================================
   TipTap nodes & CursorWatcher
   ============================================================ */

const CursorWatcher = Extension.create({
  name: "cursorWatcher",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations(state) {
            const { from, empty } = state.selection;
            if (!empty) return null;
            const decos = [];
            state.doc.descendants((node, pos) => {
              if (node.type.name === "sentenceNode") {
                const start = pos;
                const end = pos + node.nodeSize;
                if (from >= start && from <= end) {
                  decos.push(
                    Decoration.node(start, end, { class: "active-sentence" }),
                  );
                }
              }
            });
            return DecorationSet.create(state.doc, decos);
          },
        },
      }),
    ];
  },
});

const WordNode = Node.create({
  name: "wordNode",
  group: "inline",
  inline: true,
  content: "text*",
  priority: 50,
  addAttributes() {
    return {
      "data-sentence-index": { default: null },
      "data-word-index": { default: null },
      "data-type": { default: null },
      class: { default: "word-span" },
      style: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "span.word-span" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
});

const SentenceNode = Node.create({
  name: "sentenceNode",
  group: "inline",
  inline: true,
  content: "wordNode* text*",
  priority: 50,
  addAttributes() {
    return {
      "data-sentence-index": { default: null },
      class: { default: "sentence-span" },
    };
  },
  parseHTML() {
    return [{ tag: "span.sentence-span" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
});

const EnterHandler = Extension.create({
  name: "enterHandler",
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state, view } = editor;
        const { tr, selection, doc, schema } = state;
        const from = selection.from;

        let maxIndex = 0;
        doc.descendants((node) => {
          if (node.type.name === "sentenceNode") {
            const idx = parseInt(node.attrs["data-sentence-index"], 10);
            if (!isNaN(idx) && idx > maxIndex) maxIndex = idx;
          }
        });
        const nextIndex = maxIndex + 1;

        const wordNode = schema.nodes.wordNode.create(
          {
            "data-sentence-index": nextIndex,
            "data-word-index": 1,
            "data-type": "",
            class: "word-span",
            style: "color:inherit;cursor:pointer",
          },
          schema.text("\u00A0"),
        );
        const sentenceNode = schema.nodes.sentenceNode.create(
          { "data-sentence-index": nextIndex, class: "sentence-span" },
          [wordNode],
        );
        const paragraph = schema.nodes.paragraph.create({}, [sentenceNode]);
        const newTr = tr.insert(from, paragraph);

        const resolved = newTr.doc.resolve(from + paragraph.nodeSize - 1);
        const sel = TextSelection.near(resolved);
        view.dispatch(newTr.setSelection(sel).scrollIntoView());
        return true;
      },
    };
  },
});

/* ============================================================
   Markdown parsing helpers
   ============================================================ */

function parseMarkdownText(text) {
  const marks = [];
  let core = text;
  let trailing = "";
  const punctMatch = core.match(/^(.*?)([.,;?!])$/);
  if (punctMatch) {
    core = punctMatch[1];
    trailing = punctMatch[2];
  }
  let m;
  if ((m = core.match(/^(\*\*|__)([\s\S]+?)\1$/))) {
    marks.push({ type: "bold" });
    core = m[2];
  } else if ((m = core.match(/^~~([\s\S]+?)~~$/))) {
    marks.push({ type: "strike" });
    core = m[1];
  } else if ((m = core.match(/^(\*|_)([\s\S]+?)\1$/))) {
    marks.push({ type: "italic" });
    core = m[2];
  } else if ((m = core.match(/^`([\s\S]+?)`$/))) {
    marks.push({ type: "code" });
    core = m[1];
  }
  const processedText = core + trailing;
  return { text: processedText, marks };
}

function processHeadingSentence(sentence, sIdx) {
  const firstWord = sentence[0]?.word || "";
  const headingMatch = firstWord.match(/^(#{1,6})$/);
  if (headingMatch && sentence.length > 1) {
    const level = headingMatch[1].length;
    const headingText = sentence
      .slice(1)
      .map((w) => w.word)
      .join(" ")
      .trim();
    return {
      type: "heading",
      attrs: { level },
      content: [{ type: "text", text: headingText }],
    };
  }
  return null;
}
function isNewlineSentence(sentence) {
  return sentence.length === 1 && /^\n+$/.test(sentence[0].word);
}

/* ============================================================
   Token style helper (colors, structural underline, longest-unchanged highlight)
   ============================================================ */

function getColorStyle(
  type,
  dark = false,
  showChangedWords,
  structuralChange,
  showStructural,
  unchangedLongest,
  showLongest,
) {
  // priority: unchangedLongest (subtle highlight) > structural underline > type coloring
  if (unchangedLongest && showLongest) {
    return `background-color: rgba(40,167,69,0.12); border-radius: 3px; font-weight: 600;`;
  }

  if (structuralChange && showStructural) {
    // green underline for structural changes
    return `text-decoration: underline; text-decoration-color: #28a745; text-decoration-thickness: 2px; color: inherit;`;
  }

  if (!showChangedWords) return "inherit";

  const adjVerb = dark ? "#ef5c47" : "#d95645";
  const noun = dark ? "#b6bdbd" : "#530a78";
  const phrase = dark ? "#b6bdbd" : "#051780";
  const freeze = "#006ACC";

  if (/NP/.test(type)) return `color:${noun}`;
  if (/VP/.test(type)) return `color:${adjVerb}`;
  if (/PP|CP|AdvP|AdjP/.test(type)) return `color:${phrase}`;
  if (/freeze/.test(type)) return `color:${freeze}`;
  return "inherit";
}

/* ============================================================
   formatContent: build ProseMirror doc from token data
   ============================================================ */

function formatContent(data, showChangedWords, showStructural, showLongest) {
  if (!data) return { type: "doc", content: [] };

  if (typeof data === "string") {
    try {
      const parsed = defaultMarkdownParser.parse(data);
      if (parsed) return parsed.toJSON();
    } catch (e) {
      console.warn("Failed to parse markdown, falling back to plain text:", e);
    }
    return {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: data }] }],
    };
  }

  const sentences = Array.isArray(data[0]) ? data : [data];
  const docContent = [];
  let currentParagraphSentences = [];

  for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
    const sentence = sentences[sIdx];

    if (isNewlineSentence(sentence)) {
      if (currentParagraphSentences.length > 0) {
        docContent.push({
          type: "paragraph",
          content: currentParagraphSentences,
        });
        currentParagraphSentences = [];
      }
      docContent.push({ type: "paragraph", content: [{ type: "hardBreak" }] });
      continue;
    }

    const headingNode = processHeadingSentence(sentence, sIdx);
    if (headingNode) {
      if (currentParagraphSentences.length > 0) {
        docContent.push({
          type: "paragraph",
          content: currentParagraphSentences,
        });
        currentParagraphSentences = [];
      }
      docContent.push(headingNode);
      continue;
    }

    const sentenceNode = {
      type: "sentenceNode",
      attrs: { "data-sentence-index": sIdx, class: "sentence-span" },
      content: sentence.map((wObj, wIdx) => {
        const raw = wObj.word;
        const { text: processedText, marks } = parseMarkdownText(raw);
        const prefix =
          (sIdx === 0 && wIdx === 0) || /^[.,;?!]$/.test(raw) ? "" : " ";

        const style = getColorStyle(
          wObj.type,
          false,
          showChangedWords,
          !!wObj.structuralChange,
          showStructural,
          !!wObj.unchangedLongest,
          showLongest,
        );

        return {
          type: "wordNode",
          attrs: {
            "data-sentence-index": sIdx,
            "data-word-index": wIdx,
            "data-type": wObj.type,
            class: "word-span",
            style: `${style}; cursor:pointer`,
          },
          content: [
            {
              type: "text",
              text: prefix + processedText,
              ...(marks.length ? { marks } : {}),
            },
          ],
        };
      }),
    };

    currentParagraphSentences.push(sentenceNode);
  }

  if (currentParagraphSentences.length > 0) {
    docContent.push({ type: "paragraph", content: currentParagraphSentences });
  }

  return { type: "doc", content: docContent };
}

/* ============================================================
   Main component: EditableOutput
   ============================================================ */
const _annotateCache = new Map();

export default function EditableOutput({
  data,
  inputTokens = null,
  setSynonymsOptions,
  setSentence,
  setAnchorEl,
  highlightSentence,
  setHighlightSentence,
}) {
  const { showChangedWords, showStructuralChanges, showLongestUnchangedWords } =
    useSelector((state) => state.settings.interfaceOptions);
  const paraphraseIO = useSelector((state) => state.inputOutput.paraphrase);

  // Create a virtual anchor element for positioning
  const [virtualAnchor, setVirtualAnchor] = useState(null);

  const annotatedData = useMemo(() => {
    const outputData = Array.isArray(data && data[0]) ? data : [data];

    const structurallyAnnotated = annotateStructuralChanges({
      outputData,
      inputTokens,
      inputText: paraphraseIO?.input?.text || null,
      sentenceOverlapThreshold: 0.65,
    });

    if (!showLongestUnchangedWords) {
      return structurallyAnnotated.map((s) =>
        s.map((t) => ({ ...t, unchangedLongest: false })),
      );
    }

    const inputText = paraphraseIO?.input?.text || null;
    const outputText = paraphraseIO?.output?.text || null;

    if (!inputText || !outputText) {
      return structurallyAnnotated.map((s) =>
        s.map((t) => ({ ...t, unchangedLongest: false })),
      );
    }

    const minLenWords = 7;
    const cacheKey = `${inputText}|||${outputText}|||${minLenWords}`;

    if (_annotateCache.has(cacheKey)) {
      return _annotateCache.get(cacheKey);
    }

    const withLongest = markLongestUnchangedUsingDiff({
      outputData: structurallyAnnotated,
      inputTokens,
      inputText,
      minLenWords,
    });

    _annotateCache.set(cacheKey, withLongest);

    const MAX_CACHE = 200;
    if (_annotateCache.size > MAX_CACHE) {
      const firstKey = _annotateCache.keys().next().value;
      _annotateCache.delete(firstKey);
    }

    return withLongest;
  }, [
    data,
    inputTokens,
    paraphraseIO?.input?.text,
    paraphraseIO?.output?.text,
    showLongestUnchangedWords,
  ]);

  const SentenceHighlighter = useMemo(
    () =>
      Extension.create({
        name: "sentenceHighlighter",
        addProseMirrorPlugins() {
          return [
            new Plugin({
              key: new PluginKey("sentenceHighlighter"),
              props: {
                decorations: (state) => {
                  const decos = [];
                  const { highlightSentence } = this.options;

                  state.doc.descendants((node, pos) => {
                    if (node.type.name === "sentenceNode") {
                      const sentenceIndex = parseInt(
                        node.attrs["data-sentence-index"],
                        10,
                      );

                      if (
                        !isNaN(sentenceIndex) &&
                        sentenceIndex === highlightSentence
                      ) {
                        const start = pos;
                        const end = pos + node.nodeSize;
                        decos.push(
                          Decoration.node(start, end, {
                            class: "highlighted-sentence",
                            style: "pointer-events: auto;",
                          }),
                        );
                      }
                    }
                  });

                  return DecorationSet.create(state.doc, decos);
                },
              },
            }),
          ];
        },
        addOptions() {
          return {
            highlightSentence: 0,
          };
        },
      }),
    [],
  );

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          enter: false,
          bold: true,
          italic: true,
          strike: true,
          code: true,
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
            HTMLAttributes: { class: "heading-node" },
          },
        }),
        HardBreak,
        SentenceNode,
        WordNode,
        CursorWatcher,
        EnterHandler,
        SentenceHighlighter.configure({
          highlightSentence: highlightSentence,
        }),
      ],
      editable: true,
      immediatelyRender: false,
    },
    [highlightSentence],
  );

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(
      formatContent(
        annotatedData,
        showChangedWords,
        showStructuralChanges,
        showLongestUnchangedWords,
      ),
    );
  }, [
    editor,
    annotatedData,
    showChangedWords,
    showStructuralChanges,
    showLongestUnchangedWords,
  ]);

  // Enhanced click handler with virtual anchor
  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;

    const onClick = (e) => {
      const el = e.target.closest(".word-span");
      if (!el) return;

      const sI = Number(el.getAttribute("data-sentence-index"));
      const wI = Number(el.getAttribute("data-word-index"));
      const wObj =
        annotatedData[sI]?.[wI] || (data && data[sI] && data[sI][wI]);
      if (!wObj) return;

      // Create a virtual anchor that tracks the mouse position
      const rect = el.getBoundingClientRect();
      const virtualAnchorEl = {
        getBoundingClientRect: () => ({
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          width: rect.width,
          height: rect.height,
          x: rect.left,
          y: rect.top,
        }),
        clientWidth: rect.width,
        clientHeight: rect.height,
      };

      // Set both the actual element and virtual anchor
      setAnchorEl(virtualAnchorEl);
      setVirtualAnchor(virtualAnchorEl);

      setSynonymsOptions({
        synonyms: wObj.synonyms || [],
        sentenceIndex: sI,
        wordIndex: wI,
        showRephraseNav: true,
      });
      setHighlightSentence(sI);
      setSentence((data[sI] || []).map((w) => w.word).join(" "));
    };

    dom.addEventListener("click", onClick);
    return () => dom.removeEventListener("click", onClick);
  }, [
    editor,
    annotatedData,
    data,
    setAnchorEl,
    setSynonymsOptions,
    setSentence,
    setHighlightSentence,
  ]);

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
