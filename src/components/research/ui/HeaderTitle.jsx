"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SaveIcon } from "lucide-react";
import Image from "next/image";

// NOTE: This component expects a `researchItem` prop shaped like the sample data
// you included. If you keep a different shape, adapt the helpers below.

export default function HeaderTitleWithDownload({
  headerHeight,
  setHeaderHeight,
  query,
  researchItem,
}) {
  const titleRef = useRef(null);
  const [titleCharCount, setTitleCharCount] = useState(60);
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (isMd) {
      setTitleCharCount(40);
    } else {
      setTitleCharCount(100);
    }
  }, [isMd]);

  // Truncate to max characters with ellipsis
  const getTruncatedTitle = (text, maxChars) => {
    if (!text) return "Untitled";
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars) + "…";
  };

  // Build markdown string: CONTENT (researchItem.result) then SOURCES list, images excluded
  const buildMarkdown = (item) => {
    if (!item) return `# ${query || "Research"}\n\n`;

    // Start with the result text (assumed to be markdown already)
    let md = item.result || "";

    // Remove image markdown syntax (e.g. ![alt](url)) and HTML <img> tags
    md = md.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
    md = md.replace(/<img[^>]*>/g, "");

    // Ensure there's a newline before sources
    md = md.trim() + "\n\n";

    // Append sources (if present) in order
    if (item.sources && item.sources.length > 0) {
      md += "## Sources\n\n";
      item.sources.forEach((s) => {
        const title = s.title || s.resolved_url || s.url || "source";
        const url = s.url || s.resolved_url || "";
        // If url missing, just add title
        if (url) md += `- [${title}](${url})\n`;
        else md += `- ${title}\n`;
      });
    }

    return md;
  };

  // Utility to make a filename-safe string
  const safeFilename = (str) =>
    (str || "research").replace(/[^a-z0-9\-_.() ]/gi, "_").slice(0, 150);

  // --------- Download handlers ---------
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleButtonClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Raw markdown download using FileSaver API
  const downloadMarkdown = async () => {
    handleClose();
    const md = buildMarkdown(researchItem);

    // Use native blob download (no extra deps required)
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const filename = `${safeFilename(researchItem?.query || query)}.md`;

    // create temporary link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  };

  // PDF generation using a different approach that handles text properly and creates clickable links
  const downloadPdfFromMarkdown = async () => {
    handleClose();

    try {
      const md = buildMarkdown(researchItem);

      // Dynamic imports
      const markedMod = await import("marked").catch((e) => {
        console.error("Failed to import marked", e);
        return null;
      });
      const DOMPurifyMod = await import("dompurify").catch((e) => {
        console.error("Failed to import dompurify", e);
        return null;
      });
      const jspdfMod = await import("jspdf").catch((e) => {
        console.error("Failed to import jspdf", e);
        return null;
      });

      const marked = markedMod?.marked || markedMod?.default || markedMod;
      const DOMPurify = DOMPurifyMod?.default || DOMPurifyMod;
      const jsPDF = jspdfMod?.jsPDF || jspdfMod?.default || jspdfMod;

      if (!marked || !DOMPurify || !jsPDF) {
        console.error("One or more PDF libraries are missing:", {
          marked,
          DOMPurify,
          jsPDF,
        });
        throw new Error(
          "Missing PDF generation libraries. Make sure 'marked', 'dompurify', and 'jspdf' are installed."
        );
      }

      // Convert markdown to HTML and sanitize
      const html =
        typeof marked === "function" ? marked(md) : marked.marked(md);
      const clean = DOMPurify.sanitize(html);

      // Create PDF with proper A4 dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // A4 dimensions in points
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 40;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      // Parse HTML content for PDF generation
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = clean;

      // Remove images
      const imgs = tempDiv.querySelectorAll("img");
      imgs.forEach((img) => img.remove());

      let yPosition = margin;
      let currentPage = 1;
      const lineHeight = 16;
      const maxLinesPerPage = Math.floor(contentHeight / lineHeight) - 2; // Leave some buffer
      let currentLineCount = 0;

      // Add brand logo and title at the top of first page
      const addHeaderToFirstPage = async () => {
        // Add the search query as main title
        const queryTitle = query || researchItem?.query || "Research Report";
        pdf.setFontSize(22);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor("#1a1a1a");

        // Handle long titles by wrapping them
        const titleLines = pdf.splitTextToSize(queryTitle, contentWidth - 40);
        titleLines.forEach((line, index) => {
          pdf.text(line, margin, yPosition);
          yPosition += 26;
          currentLineCount += 2;
        });

        // Add spacing after title
        yPosition += 15;
        currentLineCount += 1;

        // Add generation date
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor("#666666");
        const currentDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        pdf.text(`Generated on ${currentDate}`, margin, yPosition);
        yPosition += 20;
        currentLineCount += 1;

        // Add another separator
        pdf.setDrawColor("#e1e4e8");
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 25;
        currentLineCount += 2;
      };

      // Add header to first page
      await addHeaderToFirstPage();

      // Helper function to add new page
      const addNewPage = () => {
        pdf.addPage();
        yPosition = margin;
        currentLineCount = 0;
        currentPage++;
      };

      // Helper function to check if we need a new page
      const checkPageBreak = (linesToAdd = 1) => {
        if (currentLineCount + linesToAdd > maxLinesPerPage) {
          addNewPage();
          return true;
        }
        return false;
      };

      // Helper function to add text with proper wrapping and page breaks
      const addTextToPdf = (
        text,
        fontSize = 12,
        fontStyle = "normal",
        color = "#000000",
        url = null
      ) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", fontStyle);
        pdf.setTextColor(color);

        // Split text into lines that fit within content width
        const lines = pdf.splitTextToSize(text, contentWidth);

        for (let i = 0; i < lines.length; i++) {
          checkPageBreak(1);

          const currentY = yPosition;
          pdf.text(lines[i], margin, currentY);

          // Add clickable link if URL is provided
          if (url && url.startsWith("http")) {
            const textWidth = pdf.getTextWidth(lines[i]);
            pdf.link(margin, currentY - fontSize, textWidth, fontSize + 2, {
              url: url,
            });
          }

          yPosition += lineHeight;
          currentLineCount++;
        }
      };

      // Helper function to add spacing
      const addSpacing = (lines = 1) => {
        if (currentLineCount + lines <= maxLinesPerPage) {
          yPosition += lineHeight * lines;
          currentLineCount += lines;
        }
      };

      // Process HTML elements
      const processElement = (element) => {
        const tagName = element.tagName?.toLowerCase();
        const textContent = element.textContent?.trim();

        if (!textContent) return;

        switch (tagName) {
          case "h1":
            checkPageBreak(3); // Ensure heading has space
            addSpacing(1);
            addTextToPdf(textContent, 20, "bold", "#1a1a1a");
            addSpacing(1);
            break;

          case "h2":
            checkPageBreak(3);
            addSpacing(0.5);
            addTextToPdf(textContent, 16, "bold", "#1a1a1a");
            addSpacing(0.5);
            break;

          case "h3":
            checkPageBreak(2);
            addTextToPdf(textContent, 14, "bold", "#1a1a1a");
            addSpacing(0.5);
            break;

          case "p":
            if (textContent) {
              checkPageBreak(2);
              addTextToPdf(textContent, 12, "normal", "#000000");
              addSpacing(1);
            }
            break;

          case "li":
            checkPageBreak(1);
            // Check if this li contains a link
            const link = element.querySelector("a");
            if (link) {
              const linkText = link.textContent;
              const linkUrl = link.getAttribute("href");
              const beforeLink = textContent.substring(
                0,
                textContent.indexOf(linkText)
              );
              const afterLink = textContent.substring(
                textContent.indexOf(linkText) + linkText.length
              );

              if (beforeLink) {
                addTextToPdf(`• ${beforeLink}`, 12, "normal", "#000000");
              } else {
                addTextToPdf("• ", 12, "normal", "#000000");
              }

              // Add the link in blue
              addTextToPdf(linkText, 12, "normal", "#0066cc", linkUrl);

              if (afterLink) {
                addTextToPdf(afterLink, 12, "normal", "#000000");
              }
            } else {
              addTextToPdf(`• ${textContent}`, 12, "normal", "#000000");
            }
            break;

          default:
            // Handle links within other elements
            if (element.querySelector("a")) {
              const links = element.querySelectorAll("a");
              let remainingText = textContent;
              let processedText = "";

              links.forEach((link) => {
                const linkText = link.textContent;
                const linkUrl = link.getAttribute("href");
                const beforeLink = remainingText.substring(
                  0,
                  remainingText.indexOf(linkText)
                );

                if (beforeLink) {
                  addTextToPdf(
                    processedText + beforeLink,
                    12,
                    "normal",
                    "#000000"
                  );
                }

                addTextToPdf(linkText, 12, "normal", "#0066cc", linkUrl);

                remainingText = remainingText.substring(
                  remainingText.indexOf(linkText) + linkText.length
                );
                processedText = "";
              });

              if (remainingText.trim()) {
                addTextToPdf(remainingText, 12, "normal", "#000000");
              }
            } else if (textContent) {
              addTextToPdf(textContent, 12, "normal", "#000000");
            }
            break;
        }
      };

      // Process all elements
      const allElements = tempDiv.querySelectorAll("*");
      const processedElements = new Set();

      allElements.forEach((element) => {
        // Skip if this element is a child of an already processed element
        let shouldProcess = true;
        let parent = element.parentNode;
        while (parent && parent !== tempDiv) {
          if (processedElements.has(parent)) {
            shouldProcess = false;
            break;
          }
          parent = parent.parentNode;
        }

        if (shouldProcess && !processedElements.has(element)) {
          // Only process if it's not a container that has other elements we'll process
          const hasProcessableChildren =
            element.querySelectorAll("h1, h2, h3, p, li").length > 0;
          if (!hasProcessableChildren) {
            processElement(element);
            processedElements.add(element);
          }
        }
      });

      // Process direct text nodes and elements that might have been missed
      const walker = document.createTreeWalker(
        tempDiv,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            if (
              ["H1", "H2", "H3", "P", "LI"].includes(node.tagName) &&
              !processedElements.has(node)
            ) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          },
        }
      );

      let node;
      while ((node = walker.nextNode())) {
        if (!processedElements.has(node)) {
          processElement(node);
          processedElements.add(node);
        }
      }

      const filename = `${safeFilename(researchItem?.query || query)}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      try {
        const ok = window.confirm(
          "PDF generation failed. Would you like to download the raw Markdown instead?"
        );
        if (ok) downloadMarkdown();
      } catch (e) {
        downloadMarkdown();
      }
    }
  };

  return (
    <Box
      sx={{
        pb: { xl: 1 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 4,
        padding: 1,
        position: "relative",
        bgcolor: theme.palette.mode === "dark" && "#161C24"
      }}
    >
      <Typography
        ref={titleRef}
        variant="h1"
        sx={{
          fontSize: {
            xs: "16px",
            sm: "16px",
            md: "20px",
            lg: "22px",
            xl: "30px",
          },
          fontWeight: "700",
          cursor: "pointer",
          color: "text.primary",
          "&:hover": { opacity: 0.8 },
        }}
      >
        {getTruncatedTitle(
          query || researchItem?.query || "Untitled",
          titleCharCount
        )}
      </Typography>

      {/* Download button that opens a small menu */}
      <Button
        onClick={handleButtonClick}
        aria-controls={open ? "download-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          backgroundColor: "background.paper",
          borderRadius: "6px",
          width: { xs: "24px", md: "28px", lg: "36px", xl: "48px" },
          height: { xs: "24px", md: "28px", lg: "36px", xl: "48px" },
          minWidth: { xs: "24px", md: "28px", lg: "36px", xl: "48px" },
          minHeight: { xs: "24px", md: "28px", lg: "36px", xl: "48px" },
          padding: { xs: "4px", lg: "8px", xl: "12px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[100],
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Image
          src={"/agents/edit.svg"}
          alt={"Download"}
          width={24}
          height={24}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            filter:
              theme.palette.mode === "dark"
                ? "invert(1) brightness(0.9)"
                : "none",
          }}
        />
      </Button>

      <Menu
        id="download-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "download-button",
        }}
        sx={{
          mt: 1,
          "& .MuiPaper-root": {
            backgroundColor: "background.paper",
            color: "text.primary",
          },
        }}
      >
        <MenuItem onClick={downloadPdfFromMarkdown}>Download PDF</MenuItem>
        <MenuItem onClick={downloadMarkdown}>
          Download Raw Markdown (.md)
        </MenuItem>
      </Menu>
    </Box>
  );
}
