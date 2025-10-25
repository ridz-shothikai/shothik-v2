"use client";

import { cn } from "@/lib/utils";
import { UploadFileRounded } from "@mui/icons-material";
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

  URL.revokeObjectURL(blobUrl);
  return extractedText.trim();
};

const ButtonInsertDocumentText = ({ className, onApply, onChange }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef(null);

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") return "pdf";
    if (extension === "docx") return "docx";
    return "";
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsProcessing(true);

    const fileType = getFileType(file.name);
    try {
      if (fileType === "pdf") {
        const text = await pdfToText(file);
        onApply?.(text);
      } else if (fileType === "docx") {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target.result;
          const result = await mammoth.convertToHtml({ arrayBuffer });
          let plainText = result.value
            .replace(/<\/p>/g, "\n\n")
            .replace(/<br\s*\/?>/g, "\n")
            .replace(/<p[^>]*>/g, "\n")
            .replace(/<[^>]*>/g, "")
            .trim();

          onApply?.(plainText);
        };
        reader.readAsArrayBuffer(file);
      } else {
        console.error("Unsupported file type");
      }
    } catch (error) {
      console.error("Error converting document:", error);
    } finally {
      setIsProcessing(false);
      inputRef.current.value = null;
    }
  };

  return (
    <Tooltip
      className={cn(className)}
      title="Upload File"
      arrow
      placement="top"
    >
      <Button
        className="!relative shrink-0 whitespace-nowrap"
        component="label"
        tabIndex={-1}
        color="success"
        variant="outlined"
        size="small"
        startIcon={
          isProcessing ? <CircularProgress size={16} /> : <UploadFileRounded />
        }
        disabled={isProcessing}
      >
        Upload Document
        <input
          ref={inputRef}
          onChange={(e) => {
            handleFileChange(e);
            onChange?.(e);
          }}
          type="file"
          accept="application/pdf, .docx"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </Button>
    </Tooltip>
  );
};

export default ButtonInsertDocumentText;
