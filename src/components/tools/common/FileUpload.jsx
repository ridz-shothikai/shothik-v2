"use client";
import { UploadFileRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, Tooltip } from "@mui/material";
import mammoth from "mammoth";
import { useRef, useState } from "react";
import pdfToText from "./pdftotext";

function FileUpload({ isMobile, setInput }) {
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
      setInput(text);
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

        // Convert paragraph and break tags to newlines, then strip all other HTML tags
        let plainText = result.value.replace(/<\/p>/g, "\n\n"); // Replace closing paragraph tags with two newlines
        plainText = plainText.replace(/<br\s*\/?>/g, "\n"); // Replace break tags with one newline
        plainText = plainText.replace(/<p[^>]*>/g, "\n"); // Replace opening paragraph tags (with attributes) with one newline
        plainText = plainText.replace(/<[^>]*>/g, ""); // Strip any remaining HTML tags

        setInput(plainText.trim()); // Trim leading/trailing whitespace
      } catch (error) {
        console.error("Error converting DOCX to HTML:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Tooltip title="Browse documents (DOCX, PDF)." arrow placement="top">
      <Button
        role={undefined}
        component="label"
        tabIndex={-1}
        size={isMobile ? "small" : "large"}
        variant={"outlined"}
        color="success"
        startIcon={
          isProcessing ? (
            <CircularProgress
              size={isMobile ? 12 : 16}
              sx={{ color: "gray" }}
            />
          ) : (
            <UploadFileRounded />
          )
        }
        sx={{
          border: "2px solid",
        }}
        disabled={isProcessing}
      >
        Upload {isMobile ? "Doc" : "Document"}
        <Box
          component="input"
          sx={{
            clip: "rect(0 0 0 0)",
            clipPath: "inset(50%)",
            height: 1,
            overflow: "hidden",
            position: "absolute",
            bottom: 0,
            left: 0,
            whiteSpace: "nowrap",
            width: 1,
          }}
          ref={inputRef}
          onChange={handleFileChange}
          type="file"
          accept="application/pdf, .docx"
        />
      </Button>
    </Tooltip>
  );
}

export default FileUpload;
