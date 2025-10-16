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
import NextImage from "next/image";
import { ShareButton } from "../../share";

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
  const buildMarkdown = (item, includeSources = false) => {
    if (!item) return `# ${query || "Research"}\n\n`;

    let md = item.result || "";
    md = md.replace(/!\[[^\]]*\]\([^)]*\)/g, ""); // remove markdown images
    md = md.replace(/<img[^>]*>/g, ""); // remove HTML img tags
    md = md.trim() + "\n\n";

    if (includeSources && item.sources?.length > 0) {
      md += "## Sources\n\n";
      item.sources.forEach((s) => {
        const title = s.title || s.resolved_url || s.url || "source";
        const url = s.url || s.resolved_url || "";
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

  const handleShare = (shareResult) => {
    console.log("Share created:", shareResult);
  };

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

  // ===== LOAD SHOTHIK AI LOGO FROM FILE =====
  const loadShothikLogo = () => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          console.log("SHOTHIK AI logo loaded successfully from file");
          resolve(dataURL);
        } catch (error) {
          console.error("Failed to convert logo to base64:", error);
          resolve(null);
        }
      };

      img.onerror = (error) => {
        console.error("Error loading logo from file:", error);
        resolve(null);
      };

      // Load the actual logo file from public directory (same as AI detector)
      img.src = "/shothik_light_logo.png";
    });
  };

  // PDF generation using CombinedActions design with logo and proper spacing
  const downloadPdfFromMarkdown = async () => {
    handleClose();

    try {
      // Validate researchItem data
      if (!researchItem) {
        throw new Error("No research data available for PDF generation");
      }
      
      const md = buildMarkdown(researchItem, false);
      
      if (!md || md.trim().length === 0) {
        throw new Error("No content available for PDF generation");
      }

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
          "Missing PDF generation libraries. Make sure 'marked', 'dompurify', and 'jspdf' are installed.",
        );
      }

      // ===== LOAD LOGO FOR PDF =====
      console.log("Loading logo for PDF...");
      const logoBase64 = await loadShothikLogo();
      console.log("Logo ready:", logoBase64 ? "Yes" : "No");

      // Convert markdown to HTML and sanitize
      const html =
        typeof marked === "function" ? marked(md) : marked.marked(md);
      const clean = DOMPurify.sanitize(html);

      // Create PDF with proper A4 dimensions
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // A4 dimensions in points
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 50;
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
      const maxLinesPerPage = Math.floor(contentHeight / lineHeight) - 3;
      let currentLineCount = 0;

      // ===== ADD HEADER WITH LOGO TO FIRST PAGE =====
      if (logoBase64) {
        try {
          console.log("Adding logo to PDF at position:", margin, yPosition);
          // Logo size to match AI Detection Report (width: 120, increased height for better proportion)
          doc.addImage(logoBase64, 'PNG', margin, yPosition, 120, 40);
          yPosition += 50; // Increased spacing after logo for better margin bottom
          currentLineCount += 2;
          console.log("Logo added successfully!");
        } catch (error) {
          console.error("Error adding logo image:", error);
          // Fallback: Add text logo if image fails
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.setTextColor("#1a1a1a");
          doc.text("SHOTHIK AI", margin, yPosition + 15);
          yPosition += 30;
          currentLineCount += 2;
        }
      } else {
        console.warn("Logo not available, using text fallback");
        // Fallback: Add text logo if image loading fails
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor("#1a1a1a");
        doc.text("SHOTHIK AI", margin, yPosition + 15);
        yPosition += 30;
        currentLineCount += 2;
      }
      
      // Add "Research Results" title with AI detector-style spacing
      const queryTitle = query || researchItem?.query || "Research Results";
      doc.setFontSize(16); // Match AI detector title size
      doc.setFont("helvetica", "bold");
      doc.setTextColor("#637381"); // Match AI detector title color

      const titleLines = doc.splitTextToSize(queryTitle, contentWidth);
      titleLines.forEach((line) => {
        doc.text(line, margin, yPosition);
        yPosition += 16; // Match AI detector line height
        currentLineCount += 1;
      });

      yPosition += 8; // Spacing after title to match AI detector
      currentLineCount += 1;

      // Add generation date with minimal spacing
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor("#888888");
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Generated on ${currentDate}`, margin, yPosition);
      yPosition += 12; // Minimal spacing after date
      currentLineCount += 1;

      // Add separator line with minimal spacing
      doc.setDrawColor("#e5e5e5");
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 20; // Increased spacing after separator for better content separation
      currentLineCount += 1;

      // Helper function to add new page
      const addNewPage = () => {
        doc.addPage();
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

      // Helper function to add spacing
      const addSpacing = (lines = 1) => {
        if (currentLineCount + lines <= maxLinesPerPage) {
          yPosition += lineHeight * lines;
          currentLineCount += lines;
        }
      };

      // Helper function to add text with inline references (same as CombinedActions)
      const addTextWithInlineReferences = (text, fontSize = 11, fontStyle = "normal", color = "#000000", customMargin = margin) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", fontStyle);
        
        const maxWidth = contentWidth - (customMargin - margin);
        
        const referenceRegex = /(\[[\d,\s]+\])/g;
        const parts = text.split(referenceRegex).filter(p => p);
        
        let words = [];
        
        parts.forEach(part => {
          if (/^\[[\d,\s]+\]$/.test(part)) {
            words.push({ text: part, isRef: true });
          } else {
            part.split(/\s+/).forEach(word => {
              if (word) words.push({ text: word, isRef: false });
            });
          }
        });

        let currentLine = [];
        let currentLineWidth = 0;

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const wordWidth = doc.getTextWidth(word.text + " ");

          if (currentLineWidth + wordWidth < maxWidth) {
            currentLine.push(word);
            currentLineWidth += wordWidth;
          } else {
            if (currentLine.length > 0) {
              renderLine(currentLine, customMargin, color, fontSize);
              yPosition += lineHeight;
              currentLineCount++;
              checkPageBreak(1);
            }
            currentLine = [word];
            currentLineWidth = wordWidth;
          }
        }

        if (currentLine.length > 0) {
          renderLine(currentLine, customMargin, color, fontSize);
          yPosition += lineHeight;
          currentLineCount++;
        }
      };

      const renderLine = (words, startX, defaultColor, fontSize) => {
        let currentX = startX;

        words.forEach((word, index) => {
          if (word.isRef) {
            const refMatch = word.text.match(/\[(\d+(?:,\s*\d+)*)\]/);
            if (refMatch) {
              const refNumbers = refMatch[1].split(',').map(n => parseInt(n.trim()));
              const firstRef = refNumbers[0];
              const source = researchItem?.sources?.find(s => s.reference === firstRef);

              doc.setTextColor("#000000");
              doc.setFont("helvetica", "normal");
              doc.text(word.text, currentX, yPosition);

              if (source && source.url) {
                const textWidth = doc.getTextWidth(word.text);
                doc.link(currentX, yPosition - fontSize, textWidth, fontSize + 2, {
                  url: source.url,
                });
              }

              currentX += doc.getTextWidth(word.text);
            }
          } else {
            doc.setTextColor(defaultColor);
            doc.setFont("helvetica", "normal");
            const wordText = index < words.length - 1 ? word.text + " " : word.text;
            doc.text(wordText, currentX, yPosition);
            currentX += doc.getTextWidth(wordText);
          }
        });
      };

      // Process HTML elements (same as CombinedActions)
      const processElement = (element) => {
        const tagName = element.tagName?.toLowerCase();
        const textContent = element.textContent?.trim();

        if (!textContent) return;

        switch (tagName) {
          case 'h1':
            checkPageBreak(3);
            addSpacing(2.5);
            doc.setFontSize(22);
            doc.setLineHeight(2);
            doc.setFont("helvetica", "bold");
            doc.setTextColor("#1a1a1a");
            const h1Lines = doc.splitTextToSize(textContent, contentWidth);
            h1Lines.forEach((line) => {
              checkPageBreak(1);
              doc.text(line, margin, yPosition);
              yPosition += lineHeight;
              currentLineCount++;
            });
            addSpacing(2.5); // Increased spacing after main title for better content separation
            break;

          case 'h2':
            checkPageBreak(2);
            addSpacing(0.8);
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.setTextColor("#1a1a1a");
            const h2Lines = doc.splitTextToSize(textContent, contentWidth);
            h2Lines.forEach((line) => {
              checkPageBreak(1);
              doc.text(line, margin, yPosition);
              yPosition += lineHeight;
              currentLineCount++;
            });
            addSpacing(0.8);
            break;

          case 'h3':
            checkPageBreak(2);
            addSpacing(0.6);
            doc.setFontSize(15);
            doc.setFont("helvetica", "bold");
            doc.setTextColor("#1a1a1a");
            const h3Lines = doc.splitTextToSize(textContent, contentWidth);
            h3Lines.forEach((line) => {
              checkPageBreak(1);
              doc.text(line, margin, yPosition);
              yPosition += lineHeight;
              currentLineCount++;
            });
            addSpacing(0.6);
            break;

          case 'h4':
            checkPageBreak(2);
            addSpacing(0.5);
            doc.setFontSize(13);
            doc.setFont("helvetica", "bold");
            doc.setTextColor("#1a1a1a");
            const h4Lines = doc.splitTextToSize(textContent, contentWidth);
            h4Lines.forEach((line) => {
              checkPageBreak(1);
              doc.text(line, margin, yPosition);
              yPosition += lineHeight;
              currentLineCount++;
            });
            addSpacing(0.5);
            break;

          case 'p':
            if (textContent) {
              checkPageBreak(2);
              addTextWithInlineReferences(textContent, 11, "normal", "#333333");
              addSpacing(1.2);
            }
            break;

          case 'li':
            checkPageBreak(2);
            const bulletIndent = 18;
            const textIndent = 12;
            const totalIndent = bulletIndent + textIndent;
            
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.setTextColor("#333333");
            doc.text("•", margin + bulletIndent, yPosition);
            
            addTextWithInlineReferences(textContent, 11, "normal", "#333333", margin + totalIndent);
            
            addSpacing(0.6);
            break;

          case 'strong':
          case 'b':
            addTextWithInlineReferences(textContent, 11, "bold", "#1a1a1a");
            break;

          case 'em':
          case 'i':
            addTextWithInlineReferences(textContent, 11, "italic", "#555555");
            break;

          case 'blockquote':
            checkPageBreak(2);
            doc.setDrawColor("#e5e5e5");
            doc.setLineWidth(1);
            doc.line(margin + 12, yPosition - 8, margin + 12, yPosition + 12);
            addSpacing(0.5);
            addTextWithInlineReferences(textContent, 11, "italic", "#666666", margin + 25);
            addSpacing(1);
            break;

          default:
            if (textContent) {
              addTextWithInlineReferences(textContent, 11, "normal", "#333333");
            }
            break;
        }
      };

      // Process all elements (same as CombinedActions)
      const allElements = tempDiv.querySelectorAll('*');
      const processedElements = new Set();

      allElements.forEach((element) => {
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
          const hasProcessableChildren = element.querySelectorAll('h1, h2, h3, p, li').length > 0;
          if (!hasProcessableChildren) {
            processElement(element);
            processedElements.add(element);
          }
        }
      });

      const walker = document.createTreeWalker(
        tempDiv,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            if (['H1', 'H2', 'H3', 'P', 'LI'].includes(node.tagName) && !processedElements.has(node)) {
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

      // Professional Sources section (same as CombinedActions)
      if (researchItem?.sources?.length > 0) {
        checkPageBreak(4);
        addSpacing(1.5);
        
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.setTextColor("#1a1a1a");
        doc.text(`Sources (${researchItem.sources.length})`, margin, yPosition);
        yPosition += lineHeight;
        currentLineCount++;
        
        addSpacing(0.8);
        
        doc.setDrawColor("#e5e5e5");
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 16;
        currentLineCount += 1;

        researchItem.sources.forEach((s, index) => {
          checkPageBreak(2);
          
          const sourceTitle = s.title || s.resolved_url || s.url || "Source";
          const sourceUrl = s.url || s.resolved_url || "";
          
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor("#1a1a1a");
          doc.text(`${index + 1}.`, margin, yPosition);
          
          const titleWidth = doc.getTextWidth(`${index + 1}. `);
          const titleLines = doc.splitTextToSize(sourceTitle, contentWidth - titleWidth - 15);
          
          titleLines.forEach((line) => {
            checkPageBreak(1);
            doc.setFont("helvetica", "normal");
            doc.text(line, margin + titleWidth, yPosition);
            yPosition += lineHeight;
            currentLineCount++;
          });
          
          if (sourceUrl) {
            yPosition += 4;
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor("#000000");
            const urlLines = doc.splitTextToSize(sourceUrl, contentWidth - titleWidth - 15);
            urlLines.forEach((line) => {
              checkPageBreak(1);
              doc.text(line, margin + titleWidth, yPosition);
              
              // Add clickable link
              const lineWidth = doc.getTextWidth(line);
              doc.link(margin + titleWidth, yPosition - 9, lineWidth, 9, { url: sourceUrl });
              
              // Add underline to URL
              doc.setDrawColor("#000000");
              doc.setLineWidth(0.5);
              doc.line(margin + titleWidth, yPosition + 1, margin + titleWidth + lineWidth, yPosition + 1);
              
              yPosition += lineHeight - 2;
              currentLineCount++;
            });
            yPosition += 4;
            currentLineCount++;
          }
        });
      }

      // ===== ADD FOOTER WITH LOGO TO ALL PAGES =====
      const totalPages = doc.internal.getNumberOfPages();
      
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Add separator line
        doc.setDrawColor("#e5e5e5");
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 40, pageWidth - margin, pageHeight - 40);
        
         // Add SHOTHIK AI logo to footer
         if (logoBase64) {
           try {
             // Footer logo size proportional to header (smaller but increased height for better proportion)
             doc.addImage(logoBase64, 'PNG', margin, pageHeight - 35, 80, 26);
           } catch (error) {
             console.error("Failed to add logo to footer on page", i, error);
             // Fallback: Add text logo if image fails
             doc.setFontSize(10);
             doc.setFont("helvetica", "bold");
             doc.setTextColor("#1a1a1a");
             doc.text("SHOTHIK AI", margin, pageHeight - 25);
           }
         } else {
           // Fallback: Add text logo if image loading fails
           doc.setFontSize(10);
           doc.setFont("helvetica", "bold");
           doc.setTextColor("#1a1a1a");
           doc.text("SHOTHIK AI", margin, pageHeight - 25);
         }
        
        // Add page number on the right
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor("#999999");
        const pageText = `Page ${i} of ${totalPages}`;
        const pageTextWidth = doc.getTextWidth(pageText);
        doc.text(pageText, pageWidth - margin - pageTextWidth, pageHeight - 18);
      }

      const filename = `${safeFilename(researchItem?.query || query)}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      
      // Show user-friendly error message
      alert(`PDF generation failed: ${err.message}\n\nPlease try downloading the Markdown file instead.`);
      
      // Automatically fallback to markdown download
      try {
        downloadMarkdown();
      } catch (e) {
        console.error("Markdown download also failed:", e);
        alert("Both PDF and Markdown downloads failed. Please try again later.");
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
        bgcolor: theme.palette.mode === "dark" && "#161C24",
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
          titleCharCount,
        )}
      </Typography>

      {/* Share and Download buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ShareButton
          shareData={{
            title: query || researchItem?.query || "Research Results",
            content: researchItem?.result || "",
            sources: researchItem?.sources || [],
            query: query || researchItem?.query || "",
            metadata: {
              createdAt: new Date().toISOString(),
              contentType: 'research'
            }
          }}
          contentType="research"
          title="Share"
          variant="icon"
          size="small"
          onShare={handleShare}
        />

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
          <NextImage
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
      </Box>

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
