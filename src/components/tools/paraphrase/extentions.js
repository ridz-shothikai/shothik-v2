import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

function processDecorations(doc, { limit, frozenWords, frozenPhrases }) {
  const decorations = [];
  const sentenceMap = new Map();
  const decoratedPositions = new Set();
  let wordCount = 0;

  doc.descendants((node, pos) => {
    if (!node.isText) return;
    const text = node.text;
    const lowerText = text.toLowerCase();

    // === 1. Word Limit ===
    const wordRegex = /\b\w+\b/g;
    let match;
    while ((match = wordRegex.exec(text)) !== null) {
      wordCount++;
      if (wordCount > limit) {
        const from = pos + match.index;
        const to = from + match[0].length;
        decorations.push(
          Decoration.inline(from, to, { class: "word-limit-exceeded" })
        );
      }
    }

    // === 2. Frozen Phrases ===
    const sortedPhrases = Array.from(frozenPhrases || []).sort(
      (a, b) => b.length - a.length
    );
    for (const phrase of sortedPhrases) {
      const phraseLower = phrase.toLowerCase().trim();
      const escaped = phraseLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "gi");
      let match;
      while ((match = regex.exec(lowerText)) !== null) {
        const from = pos + match.index;
        const to = from + match[0].length;
        if (!isOverlapping(from, to, decoratedPositions)) {
          markDecorated(from, to, decoratedPositions);
          decorations.push(
            Decoration.inline(from, to, { class: "frozen-word" })
          );
        }
      }
    }

    // === 3. Frozen Words ===
    wordRegex.lastIndex = 0; // reset regex
    while ((match = wordRegex.exec(lowerText)) !== null) {
      const word = match[0];
      if (frozenWords?.has(word)) {
        const from = pos + match.index;
        const to = from + word.length;
        if (!isOverlapping(from, to, decoratedPositions)) {
          markDecorated(from, to, decoratedPositions);
          decorations.push(
            Decoration.inline(from, to, { class: "frozen-word" })
          );
        }
      }
    }

    // === 4. Duplicate Sentences (collect for now) ===
    const sentenceRegex = /[^.!?]+[.!?]+/g;
    while ((match = sentenceRegex.exec(text)) !== null) {
      const sentence = match[0].trim().toLowerCase();
      if (!sentence) continue;
      const from = pos + match.index;
      const to = from + match[0].length;
      if (!sentenceMap.has(sentence)) sentenceMap.set(sentence, []);
      sentenceMap.get(sentence).push({ from, to });
    }
  });

  // === 5. Apply duplicate sentence highlights ===
  for (const [, ranges] of sentenceMap.entries()) {
    if (ranges.length > 1) {
      for (const { from, to } of ranges) {
        decorations.push(
          Decoration.inline(from, to, { class: "duplicate-sentence" })
        );
      }
    }
  }

  return DecorationSet.create(doc, decorations);
}

function isOverlapping(from, to, set) {
  for (let i = from; i < to; i++) {
    if (set.has(i)) return true;
  }
  return false;
}

function markDecorated(from, to, set) {
  for (let i = from; i < to; i++) set.add(i);
}

export const CombinedHighlighting = Extension.create({
  name: "combinedHighlighting",

  addOptions() {
    return {
      limit: 100,
      frozenWords: new Set(),
      frozenPhrases: new Set(),
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("combinedHighlighting"),

        props: {
          decorations: (state) => {
            return processDecorations(state.doc, this.options);
          },
        },
      }),
    ];
  },
});

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

// output editor
export const wordSentenceDecorator = (data, activeSentenceIndexes = []) => {
  return new Plugin({
    key: new PluginKey("wordSentenceDecorator"),
    props: {
      decorations(state) {
        const decorations = [];
        let pos = 1; // starting inside paragraph node

        data.forEach((sentence, sIndex) => {
          sentence.forEach((wordObj, wIndex) => {
            const word = wordObj.word;
            const space = /^[.,;]$/.test(word) || word.endsWith("'") ? "" : " ";

            // Add the space *before* the word
            pos += space.length;

            const from = pos;
            const to = from + word.length;

            decorations.push(
              Decoration.inline(from, to, {
                nodeName: "span",
                class: `word-span ${
                  activeSentenceIndexes.includes(sIndex)
                    ? "active-sentence"
                    : ""
                }`,
                "data-word": word,
                "data-type": wordObj.type,
                "data-sentence-index": sIndex,
                "data-word-index": wIndex,
                style: `color:${getColorStyle(wordObj.type)}; cursor:pointer;`,
              })
            );

            pos = to;
          });
        });

        return DecorationSet.create(state.doc, decorations);
      },
    },
  });
};

export const protectedSingleWords = [
  "affidavit",
  "alibi",
  "arraignment",
  "bail",
  "civil",
  "contract",
  "conviction",
  "defendant",
  "evidence",
  "felony",
  "indictment",
  "injunction",
  "jurisdiction",
  "litigation",
  "misdemeanor",
  "negligence",
  "parole",
  "plaintiff",
  "precedent",
  "probation",
  "statute",
  "subpoena",
  "tort",
  "verdict",
  "warrant",
  "testimony",
  "appeal",
  "acquittal",
  "prosecutor",
  "discovery",
  "settlement",
  "pleading",
  "hearsay",
  "damages",
  "liable",
  "indemnity",
  "algorithm",
  "api",
  "bandwidth",
  "binary",
  "bit",
  "blockchain",
  "cache",
  "compiler",
  "cybersecurity",
  "database",
  "debugging",
  "encryption",
  "firewall",
  "frontend",
  "backend",
  "function",
  "hashing",
  "http",
  "https",
  "inheritance",
  "latency",
  "query",
  "recursion",
  "runtime",
  "server",
  "sql",
  "nosql",
  "syntax",
  "token",
  "variable",
  "websocket",
  "container",
  "docker",
  "pipeline",
  "dns",
  "jwt",
  "oauth",
  "middleware",
  "callback",
  "throttle",
  "debounce",
  "webrtc",
  "endpoint",
  "webhook",
  "acetaminophen",
  "antibiotic",
  "aspirin",
  "biopsy",
  "cardiovascular",
  "cholesterol",
  "diabetes",
  "diagnosis",
  "dosage",
  "epidural",
  "fever",
  "hypertension",
  "ibuprofen",
  "infection",
  "injection",
  "insulin",
  "intubation",
  "nausea",
  "neurosurgery",
  "paracetamol",
  "penicillin",
  "pharmacy",
  "placebo",
  "prescription",
  "radiology",
  "respiratory",
  "surgery",
  "symptom",
  "tablet",
  "therapy",
  "ultrasound",
  "vaccine",
  "x-ray",
  "anesthesia",
  "allergy",
  "oncology",
  "dermatology",
  "hematology",
  "nephrology",
  "cardiology",
  "neurology",
  "gynecology",
  "psychiatry",
  "pathology",
  "urinalysis",
  "eczema",
  "psoriasis",
  "bronchitis",
  "migraine",
  "sinusitis",
  "covid",
  "flu",
  "hepatitis",
  "arthritis",
  "cancer",
  "tumor",
  "glucose",
  "metformin",
  "omeprazole",
  "amoxicillin",
  "morphine",
  "insomnia",
  "depression",
  "anxiety",
  "bmi",
  "javascript",
  "typescript",
  "python",
  "php",
  "ruby",
  "java",
  "go",
  "rust",
  "swift",
  "kotlin",
  "dart",
  "html",
  "css",
  "scss",
  "graphql",
  "mongodb",
  "mysql",
  "postgresql",
  "sqlite",
  "redis",
  "firebase",
  "supabase",
  "typeorm",
  "prisma",
  "vite",
  "webpack",
  "babel",
  "eslint",
  "prettier",
  "jest",
  "mocha",
  "cypress",
  "vitest",
  "expo",
  "graphql",
];
export const protectedPhrases = [
  "common law",
  "plea bargain",
  "defense attorney",
  "due process",
  "cross-examination",
  "voir dire",
  "case law",
  "data structure",
  "cloud computing",
  "machine learning",
  "neural network",
  "object-oriented",
  "load balancer",
  "microservice",
  "rest api",
  "ci/cd",
  "ip address",
  "rate limiting",
  "event loop",
  "peer-to-peer",
  "ct scan",
  "blood pressure",
  "heart rate",
  "node js",
  "react js",
  "next js",
  "vue js",
  "express js",
  "spring boot",
  "nuxt js",
  "nest js",
  "tailwind css",
  "material ui",
  "react native",
];
