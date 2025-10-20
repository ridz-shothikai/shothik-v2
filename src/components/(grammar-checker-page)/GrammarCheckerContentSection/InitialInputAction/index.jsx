"use client";

import { cn } from "@/lib/utils";
import {
  ContentPaste,
  SaveAsOutlined,
  UploadFileRounded,
} from "@mui/icons-material";
import { Button, CircularProgress, Tooltip } from "@mui/material";
import mammoth from "mammoth";
import { useRef, useState } from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs?.version}/build/pdf.worker.min.mjs`;

const pdfToText = async (file) => {
  const blobUrl = URL.createObjectURL(file);

  const loadingTask = pdfjs.getDocument(blobUrl);

  let extractedText = "";
  try {
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();

      let previousY = null;
      let pageText = "";

      textContent.items.forEach((item) => {
        if (previousY && Math.abs(previousY - item.transform[5]) > 10) {
          pageText += "\n";
        }
        pageText += item.str + " ";
        previousY = item.transform[5];
      });

      extractedText += pageText.trim() + "\n\n";
    }
  } catch (error) {
    extractedText = "Error parsing the document.";
    console.error("Error extracting text from PDF:", error);
  }

  // Clean up the blob URL
  URL.revokeObjectURL(blobUrl);

  return extractedText.trim();
};

const InitialInputAction = ({
  input,
  setInput,
  extraAction,
  sample = "",
  isSample = false,
  isPaste = false,
  isDocument = false,
  className,
}) => {
  async function handlePaste() {
    const clipboardText = await navigator.clipboard.readText();
    setInput(clipboardText);
    if (extraAction) extraAction();
  }

  function handleSampleText() {
    if (!sample) return;

    setInput(sample);
    if (extraAction) extraAction();
  }

  const setHtmlInput = (htmlValue) => {
    setInput(htmlValue);
    if (extraAction) extraAction();
  };

  // Files Functionalities
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsProcessing(true);
    const fileType = getFileType(file.name);
    try {
      switch (fileType) {
        case "pdf":
          await convertPdfToHtml(file);
          break;
        case "docx":
          await convertDocxToHtml(file);
          break;
        default:
          console.error("Unsupported file type");
      }
    } finally {
      setIsProcessing(false);
      inputRef.current.value = null;
    }
  };

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") return "pdf";
    if (extension === "docx") return "docx";
    return "";
  };

  const convertPdfToHtml = async (pdfFile) => {
    try {
      let text = await pdfToText(pdfFile);
      setHtmlInput(text);
    } catch (error) {
      console.error("Error converting PDF to HTML:", error);
    }
  };

  const convertDocxToHtml = async (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      try {
        const result = await mammoth.convertToHtml({ arrayBuffer });

        let plainText = result.value.replace(/<\/p>/g, "\n\n");
        plainText = plainText.replace(/<br\s*\/?>/g, "\n");
        plainText = plainText.replace(/<p[^>]*>/g, "\n");
        plainText = plainText.replace(/<[^>]*>/g, "");

        setHtmlInput(plainText.trim());
      } catch (error) {
        console.error("Error converting DOCX to HTML:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {isSample && sample && (
        <>
          <Tooltip title="Try sample text" arrow placement="top">
            <Button
              color="primary"
              variant="outlined"
              onClick={handleSampleText}
              disabled={!sample}
              startIcon={<SaveAsOutlined />}
            >
              Try Sample
            </Button>
          </Tooltip>
        </>
      )}

      <span>Or</span>

      {isPaste && (
        <Tooltip title="Paste text" arrow placement="top">
          <Button
            color="primary"
            variant="outlined"
            onClick={handlePaste}
            startIcon={<ContentPaste />}
          >
            Paste Text
          </Button>
        </Tooltip>
      )}

      <span>Or</span>

      {isDocument && (
        <Tooltip title="Upload File" arrow placement="top">
          <Button
            className="!relative"
            component="label"
            tabIndex={-1}
            color="success"
            variant="outlined"
            startIcon={
              isProcessing ? (
                <CircularProgress size={16} />
              ) : (
                <UploadFileRounded />
              )
            }
            disabled={isProcessing}
          >
            Upload Document
            <input
              component="input"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              ref={inputRef}
              onChange={handleFileChange}
              type="file"
              accept="application/pdf, .docx"
            />
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

export default InitialInputAction;
