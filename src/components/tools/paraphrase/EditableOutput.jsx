import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { EditorContent, Node, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Plugin } from "prosemirror-state";
import { useEffect } from "react";

const getColorStyle = (type, dark = false) => {
  const adJectiveVerbAdverbColor = dark ? "#ef5c47" : "#d95645";
  const nounColor = dark ? "#b6bdbd" : "#530a78";
  const phraseColor = dark ? "#b6bdbd" : "#051780";
  const freezeColor = "#006ACC";

  if (/NP/.test(type)) return adJectiveVerbAdverbColor;
  if (/VP/.test(type)) return nounColor;
  if (/PP|CP|AdvP|AdjP/.test(type)) return phraseColor;
  if (/freeze/.test(type)) return freezeColor;
  return "inherit";
};

const CursorWatcher = Extension.create({
  name: "cursorWatcher",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations(state) {
            const { from, empty } = state.selection;
            if (!empty) return null;

            const decorations = [];

            state.doc.descendants((node, pos) => {
              if (node.type.name === "sentenceNode") {
                const sentenceStart = pos;
                const sentenceEnd = pos + node.nodeSize;

                if (from >= sentenceStart && from <= sentenceEnd) {
                  decorations.push(
                    Decoration.node(sentenceStart, sentenceEnd, {
                      class: "active-sentence",
                    })
                  );
                }
              }
            });

            return DecorationSet.create(state.doc, decorations);
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
  content: "wordNode*",

  addAttributes() {
    return {
      "data-sentence-index": {
        default: null,
      },
      class: {
        default: "sentence-span",
      },
    };
  },

  parseHTML() {
    return [{ tag: "span.sentence-span" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
});

const generateFormatedText = (data) => {
  const content = data.map((sentence, sIndex) => {
    return {
      type: "sentenceNode",
      attrs: {
        "data-sentence-index": sIndex + 1,
        class: "sentence-span",
      },
      content: sentence.map((word, wIndex) => {
        return {
          type: "wordNode",
          attrs: {
            "data-sentence-index": sIndex + 1,
            "data-word-index": wIndex + 1,
            "data-type": word.type,
            class: "word-span",
            style: `color:${getColorStyle(word.type)};cursor:pointer`,
          },
          content: [
            {
              type: "text",
              text:
                ((wIndex === 0 && sIndex === 0) || /^[.,;?!]$/.test(word.word)
                  ? ""
                  : " ") + word.word,
            },
          ],
        };
      }),
    };
  });

  return {
    type: "doc",
    content: [{ type: "paragraph", content }],
  };
};

const EditableOutput = ({
  data,
  setSynonymsOptions,
  setSentence,
  setAnchorEl,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, SentenceNode, WordNode, CursorWatcher],
    content: "",
    editable: true,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor || !data?.length) return;
    editor.commands.setContent(generateFormatedText(data));
  }, [editor, data]);

  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;

    const handleClick = (e) => {
      const el = e.target.closest(".word-span");
      if (!el) return;

      const sentenceIndex = Number(el.getAttribute("data-sentence-index"));
      const wordIndex = Number(el.getAttribute("data-word-index"));
      const wordObj = data?.[sentenceIndex - 1]?.[wordIndex - 1];
      if (!wordObj) return;

      setAnchorEl(el);
      setSynonymsOptions({
        synonyms: wordObj.synonyms || [],
        sentenceIndex,
        wordIndex,
        showRephraseNav: true,
      });

      const sentence = data[sentenceIndex - 1].map((w) => w.word).join(" ");
      setSentence(sentence);
    };

    dom.addEventListener("click", handleClick);
    return () => dom.removeEventListener("click", handleClick);
  }, [editor, data]);

  return <EditorContent editor={editor} />;
};

export default EditableOutput;
