import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { WordNode } from "./extentions";

const generateTiptapJSON = (data) => {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: data.flatMap((sentence, sIndex) =>
          sentence.map((wordObj, wIndex) => ({
            type: "wordNode",
            attrs: {
              word: wordObj.word,
              type: wordObj.type,
              sentenceIndex: sIndex,
              wordIndex: wIndex,
            },
          }))
        ),
      },
    ],
  };
};

const EditableOutput = ({
  data,
  setSynonymsOptions,
  setSentence,
  setAnchorEl,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, WordNode],
    content: "",
    editable: true,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor || !data?.length) return;
    const json = generateTiptapJSON(data);
    editor.commands.setContent(json, false);
  }, [data, editor]);

  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;
    const handleClick = (e) => {
      const el = e.target.closest("word-token");
      if (!el) return;

      const sentenceIndex = Number(el.getAttribute("sentenceIndex"));
      const wordIndex = Number(el.getAttribute("wordIndex"));

      const wordObj = data?.[sentenceIndex]?.[wordIndex];
      if (!wordObj) return;

      setAnchorEl(el);
      setSynonymsOptions({
        synonyms: wordObj.synonyms || [],
        sentenceIndex,
        wordIndex,
        showRephraseNav: true,
      });

      const sentence = data[sentenceIndex].map((w) => w.word).join(" ");
      setSentence(sentence);
    };

    dom.addEventListener("click", handleClick);
    return () => dom.removeEventListener("click", handleClick);
  }, [editor, data]);

  return <EditorContent editor={editor} />;
};

export default EditableOutput;
