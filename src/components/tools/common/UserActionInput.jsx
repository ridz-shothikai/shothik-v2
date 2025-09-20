"use client";
import { ContentPaste, SaveAsOutlined } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import dynamic from "next/dynamic";
const FileUpload = dynamic(() => import("./FileUpload"), { ssr: false });
const MultipleFileUpload = dynamic(() => import("./MultipleFileUpload"), {
  ssr: false,
});

function sanitizeText(text) {
  // Remove HTML tags and entities first to prevent any injection or leftover markup
  text = text.replace(/<[^>]*>/g, "");
  text = text.replace(/&[^;]+;/g, ""); // Remove HTML entities like &amp;

  // Remove Markdown bold (**bold** or __bold__)
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");

  // Remove Markdown italic (*italic* or _italic_)
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");

  // Remove Markdown strikethrough (~~strikethrough~~)
  text = text.replace(/~~(.*?)~~/g, "$1");

  // Remove Markdown spoilers (||spoiler||) - common in some flavors
  text = text.replace(/\|\|(.*?)\|\|/g, "$1");

  // Remove Markdown links [text](url) -> text
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, "$1");

  // Remove Markdown images ![alt](url) -> alt (or empty if no alt)
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, "$1");

  // Remove Markdown headers # Header -> Header
  text = text.replace(/^\s*#+\s*(.*)/gm, "$1");

  // Remove Markdown list markers - item or * item or 1. item or - [ ] task -> item
  text = text.replace(/^\s*([-*+]|\d+\.)\s+(\[.\])?\s*/gm, "");

  // Remove Markdown code blocks ```code``` or indented code -> code (preserving content)
  text = text.replace(/```[\s\S]*?```/g, (match) =>
    match.replace(/```/g, "").trim()
  );
  text = text.replace(/^( {4}|\t).*/gm, (match) => match.trim()); // Indented code

  // Remove inline code `code` -> code
  text = text.replace(/`([^`]+)`/g, "$1");

  // Remove blockquotes > quote -> quote
  text = text.replace(/^\s*>\s*(.*)/gm, "$1");

  // Remove horizontal rules --- or *** or ___
  text = text.replace(/^\s*[-*_]{3,}\s*$/gm, "");

  // Remove Markdown tables | col | col | -> col col (simplified, remove pipes and alignments)
  text = text.replace(/^\s*\|.*\|\s*$/gm, (match) =>
    match.replace(/\|/g, " ").trim()
  );
  text = text.replace(/^\s*[-:| ]+\s*$/gm, ""); // Remove table separators

  // Remove footnotes [^1] or [^note]: definition -> remove references and definitions
  text = text.replace(/\[\^.*?\]/g, "");
  text = text.replace(/^\s*\[\^.*?\]:\s*(.*)/gm, "");

  // Remove escaped Markdown characters like \* -> *
  text = text.replace(/\\([*_~`\\|[\](){}>#+\-=.!])/g, "$1");

  // Normalize whitespace: collapse multiple spaces, remove leading/trailing spaces per line
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/^\s+|\s+$/gm, "");

  // Remove extra newlines (more than two consecutive)
  text = text.replace(/\n{3,}/g, "\n\n");

  // Final trim
  return text.trim();
}

const UserActionInput = ({
  isMobile,
  setUserInput,
  extraAction,
  disableTrySample = false,
  sampleText,
  paraphrase = false,
  paidUser = false,
  selectedLang = "English (US)",
  selectedSynonymLevel = "Basic",
  selectedMode = "Standard",
  freezeWords = [],
}) => {
  // Updated handlePaste function with enhanced sanitization
  async function handlePaste(extraAction) {
    try {
      let clipboardText = await navigator.clipboard.readText();
      console.log("Original clipboardText:", clipboardText);

      // Sanitize the text to remove Markdown and HTML
      clipboardText = sanitizeText(clipboardText);
      console.log("Sanitized clipboardText:", clipboardText);

      // Set the sanitized input
      setUserInput(clipboardText);

      // Execute extra action if provided
      if (extraAction) {
        extraAction();
      }
    } catch (error) {
      console.error("Error handling paste:", error);
      // Optionally handle permission errors or fallback to other paste methods
    }
  }

  function handleSampleText() {
    if (!sampleText) return;
    setUserInput(sampleText);
    if (extraAction) extraAction();
  }

  const handleFileData = (htmlValue) => {
    setUserInput(htmlValue);
    if (extraAction) extraAction();
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        bottom: { xs: 40, sm: 80 },
        left: "0px",
        right: "0px",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        rowGap={1.5}
        columnGap={2}
        sx={{ width: "80%", mx: "auto" }}
      >
        <Stack
          direction="row"
          id="sample-paste-section"
          alignItems="start"
          justifyContent="center"
          flexWrap="wrap"
          rowGap={1.5}
          columnGap={2}
          sx={{ width: "80%", mx: "auto" }}
        >
          {!disableTrySample ? (
            <Button
              color="warning"
              size={isMobile ? "small" : "large"}
              variant="soft"
              onClick={handleSampleText}
              disabled={!sampleText}
              startIcon={<SaveAsOutlined />}
              sx={{
                border: { sm: "none", xs: "2px solid" },
                borderColor: "primary.warning",
                borderRadius: "5px",
                "&:hover": {
                  borderColor: "primary.dark",
                },
              }}
            >
              {!isMobile ? "Try Sample Text" : "Try Sample"}
            </Button>
          ) : null}

          <Button
            size={isMobile ? "small" : "large"}
            variant="soft"
            color="secondary"
            onClick={handlePaste}
            sx={{
              border: { sm: "none", xs: "2px solid" },
              borderColor: "primary.secondary",
              borderRadius: "5px",
              "&:hover": {
                borderColor: "primary.dark",
              },
            }}
            startIcon={<ContentPaste />}
          >
            {!isMobile ? "Paste Text" : "Paste"}
          </Button>
        </Stack>
        {paraphrase ? (
          <MultipleFileUpload
            isMobile={isMobile}
            setInput={() => {}}
            paidUser={paidUser}
            freezeWords={freezeWords}
            selectedMode={selectedMode}
            selectedSynonymLevel={selectedSynonymLevel}
            selectedLang={selectedLang}
          />
        ) : (
          <Box id="upload_button">
            <FileUpload isMobile={isMobile} setInput={handleFileData} />
            <Typography
              component="p"
              variant="caption"
              sx={{
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              {isMobile ? "" : "Supported file"} formats: pdf,docx.
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default UserActionInput;
