import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export const WordLimit = Extension.create({
  name: "wordLimit",

  addOptions() {
    return {
      limit: 100,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("wordLimit"),

        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations = [];
            const limit = this.options.limit;
            let wordCount = 0;

            doc.descendants((node, pos) => {
              if (!node.isText) return;

              const nodeText = node.text;
              const regex = /\b\w+\b/g;
              let match;

              while ((match = regex.exec(nodeText)) !== null) {
                wordCount++;

                if (wordCount > limit) {
                  const from = pos + match.index;
                  const to = from + match[0].length;

                  decorations.push(
                    Decoration.inline(from, to, {
                      class: "word-limit-exceeded",
                    })
                  );
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export const FrozenWords = Extension.create({
  name: "frozenWords",

  addOptions() {
    return {
      frozenWords: new Set(),
      frozenPhrases: new Set(),
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("frozenWords"),

        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations = [];
            const frozenWords = this.options.frozenWords;
            const frozenPhrases = this.options.frozenPhrases;
            const decoratedPositions = new Set();

            doc.descendants((node, pos) => {
              if (!node.isText) return;

              const originalText = node.text;
              const lowerText = originalText.toLowerCase();

              // === 1. Handle Frozen Phrases ===
              const sortedPhrases = Array.from(frozenPhrases).sort(
                (a, b) => b.length - a.length
              );

              for (const phrase of sortedPhrases) {
                const phraseLower = phrase.toLowerCase().trim();
                const escapedPhrase = phraseLower.replace(
                  /[.*+?^${}()|[\]\\]/g,
                  "\\$&"
                );
                const phraseRegex = new RegExp(`${escapedPhrase}`, "gi");

                let match;
                while ((match = phraseRegex.exec(lowerText)) !== null) {
                  const from = pos + match.index;
                  const to = from + match[0].length;

                  let isDecorated = false;
                  for (let i = from; i < to; i++) {
                    if (decoratedPositions.has(i)) {
                      isDecorated = true;
                      break;
                    }
                  }

                  if (!isDecorated) {
                    for (let i = from; i < to; i++) {
                      decoratedPositions.add(i);
                    }

                    decorations.push(
                      Decoration.inline(from, to, {
                        class: "frozen-word",
                      })
                    );
                  }
                }
              }

              // === 2. Handle Frozen Single Words ===
              const wordRegex = /\b\w+\b/g;
              let match;

              while ((match = wordRegex.exec(lowerText)) !== null) {
                const word = match[0];

                if (frozenWords.has(word)) {
                  const from = pos + match.index;
                  const to = from + word.length;

                  let isDecorated = false;
                  for (let i = from; i < to; i++) {
                    if (decoratedPositions.has(i)) {
                      isDecorated = true;
                      break;
                    }
                  }

                  if (!isDecorated) {
                    for (let i = from; i < to; i++) {
                      decoratedPositions.add(i);
                    }

                    decorations.push(
                      Decoration.inline(from, to, {
                        class: "frozen-word",
                      })
                    );
                  }
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export const DuplicateSentences = Extension.create({
  name: "duplicateSentences",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("duplicateSentences"),

        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations = [];
            const sentenceMap = new Map();

            // First pass: collect all sentences
            doc.descendants((node, pos) => {
              if (!node.isText) return;

              const text = node.text;
              const regex = /[^.!?]+[.!?]+/g;
              let match;

              while ((match = regex.exec(text)) !== null) {
                const sentence = match[0].trim().toLowerCase();

                if (!sentence) continue;

                const start = pos + match.index;
                const end = start + match[0].length;

                if (!sentenceMap.has(sentence)) {
                  sentenceMap.set(sentence, []);
                }

                sentenceMap.get(sentence).push({ from: start, to: end });
              }
            });

            // Second pass: decorate duplicate sentences
            for (const [, ranges] of sentenceMap.entries()) {
              if (ranges.length > 1) {
                for (const { from, to } of ranges) {
                  console.log({ from, to });
                  decorations.push(
                    Decoration.inline(from, to, {
                      class: "duplicate-sentence",
                    })
                  );
                }
              }
            }

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

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
