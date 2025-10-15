"use client";

import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Share as ShareIcon,
  FileDownload as ExportIcon,
  Refresh as RewriteIcon,
  PictureAsPdf as PdfIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from "@mui/icons-material";
import { useState } from "react";
import jsPDF from "jspdf";

const CombinedActions = ({ content, sources, title, onFeedback }) => {
  const theme = useTheme();
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShareClick = (event) => {
    setShareMenuAnchor(event.currentTarget);
  };

  const handleExportClick = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setShareMenuAnchor(null);
    setExportMenuAnchor(null);
  };

  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      console.log("Link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
    handleMenuClose();
  };

  const handleCopyContent = async () => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      await navigator.clipboard.writeText(textContent);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy content:", err);
    }
    handleMenuClose();
  };

  const handleExportPDF = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Function to load and convert logo to base64
      const loadLogoAsBase64 = async () => {
        try {
          const logoUrl = "https://storage.googleapis.com/shothik-public-assets/public-datasets/shothik_light_logo.png";
          const response = await fetch(logoUrl);
          const blob = await response.blob();
          
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.log("Failed to load logo:", error);
          return null;
        }
      };
      
      // Helper function to add a new page if needed
      const checkNewPage = (currentY, requiredSpace = 10) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        if (currentY + requiredSpace > pageHeight - 30) { // 30px margin for footer
          doc.addPage();
          return margin;
        }
        return currentY;
      };

      // Add SHOTHIK AI header with actual logo
      let yPosition = margin;
      
      // Try to load the actual SHOTHIK AI logo
      const logoBase64 = await loadLogoAsBase64();
      
      if (logoBase64) {
        try {
          // Add the actual SHOTHIK AI logo
          doc.addImage(logoBase64, 'PNG', margin, yPosition, 30, 15);
          yPosition += 20;
        } catch (error) {
          console.log("Failed to add logo to PDF:", error);
          // Simple fallback
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
          doc.text("SHOTHIK AI", margin, yPosition + 12);
          yPosition += 20;
        }
      } else {
        // Simple fallback
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("SHOTHIK AI", margin, yPosition + 12);
        yPosition += 20;
      }
      
      // Clean title section
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      const titleLines = doc.splitTextToSize(title || "Research Results", contentWidth);
      
      titleLines.forEach((line) => {
        yPosition = checkNewPage(yPosition, 15);
        doc.text(line, margin, yPosition);
        yPosition += 10;
      });

      // Add clean separator
      yPosition += 15;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 20;

      // Clean content processing
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      
      // Create a temporary div to process the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      
      // Helper function to clean and format text
      const cleanText = (text) => {
        if (!text) return '';
        
        // Remove markdown formatting
        text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove **bold**
        text = text.replace(/\*(.*?)\*/g, '$1'); // Remove *italic*
        text = text.replace(/__(.*?)__/g, '$1'); // Remove __bold__
        text = text.replace(/_(.*?)_/g, '$1'); // Remove _italic_
        text = text.replace(/#{1,6}\s*/g, ''); // Remove heading markers
        text = text.replace(/`(.*?)`/g, '$1'); // Remove inline code
        text = text.replace(/```[\s\S]*?```/g, ''); // Remove code blocks
        text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove markdown links
        text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, ''); // Remove images
        text = text.replace(/\n{3,}/g, '\n\n'); // Clean up newlines
        
        return text.trim();
      };
      
      // Simple, clean content processing
      const processContent = (content) => {
        // Extract all text content and clean it
        const textContent = cleanText(tempDiv.textContent || tempDiv.innerText || '');
        
        // Process text with references
        const referenceRegex = /\[(\d+(?:,\s*\d+)*)\]/g;
        let lastIndex = 0;
        let match;
        
        while ((match = referenceRegex.exec(textContent)) !== null) {
          // Add text before the reference
          if (match.index > lastIndex) {
            const beforeText = textContent.substring(lastIndex, match.index);
            const lines = doc.splitTextToSize(beforeText, contentWidth);
            lines.forEach((line) => {
              yPosition = checkNewPage(yPosition, 8);
              doc.text(line, margin, yPosition);
              yPosition += 7;
            });
          }
          
          // Add the reference as clickable link
          const refNumbers = match[1].split(',').map(n => parseInt(n.trim()));
          const firstRef = refNumbers[0];
          const source = sources.find(s => s.reference === firstRef);
          
          if (source) {
            doc.setTextColor(0, 150, 100); // Green color for links
            doc.setFont("helvetica", "bold");
            yPosition = checkNewPage(yPosition, 8);
            doc.textWithLink(match[0], margin, yPosition, { url: source.url });
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            yPosition += 7;
          } else {
            yPosition = checkNewPage(yPosition, 8);
            doc.text(match[0], margin, yPosition);
            yPosition += 7;
          }
          
          lastIndex = match.index + match[0].length;
        }
        
        // Add remaining text after the last reference
        if (lastIndex < textContent.length) {
          const remainingText = textContent.substring(lastIndex);
          const lines = doc.splitTextToSize(remainingText, contentWidth);
          lines.forEach((line) => {
            yPosition = checkNewPage(yPosition, 8);
            doc.text(line, margin, yPosition);
            yPosition += 7;
          });
        }
      };
      
      // Process the content
      processContent(content);

      // Add clean sources section
      if (sources && sources.length > 0) {
        yPosition = checkNewPage(yPosition, 40);
        yPosition += 20;
        
        // Sources title
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 150, 100);
        doc.text("Sources", margin, yPosition);
        yPosition += 15;
        
        // Add separator line
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 15;
        
        // Sources list
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        
        sources.forEach((source, index) => {
          yPosition = checkNewPage(yPosition, 20);
          
          // Source number and title
          doc.setFont("helvetica", "bold");
          doc.text(`${index + 1}.`, margin, yPosition);
          doc.setFont("helvetica", "normal");
          
          const titleText = source.title || 'Untitled Source';
          const titleLines = doc.splitTextToSize(titleText, contentWidth - 20);
          titleLines.forEach((line) => {
            yPosition = checkNewPage(yPosition, 7);
            doc.text(line, margin + 15, yPosition);
            yPosition += 6;
          });
          
          // Source URL as clickable link
          yPosition += 3;
          doc.setTextColor(0, 150, 100);
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          const urlLines = doc.splitTextToSize(source.url, contentWidth - 20);
          urlLines.forEach((line) => {
            yPosition = checkNewPage(yPosition, 6);
            doc.textWithLink(line, margin + 15, yPosition, { url: source.url });
            yPosition += 5;
          });
          
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          yPosition += 8;
        });
      }
      
      // Add clean footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Add subtle line above footer
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
        
        // Add SHOTHIK AI logo in footer
        try {
          const logoBase64 = await loadLogoAsBase64();
          if (logoBase64) {
            doc.addImage(logoBase64, 'PNG', margin, pageHeight - 20, 20, 10);
          }
        } catch (error) {
          console.log("Failed to add logo to footer:", error);
        }
        
        // Footer text
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setFont("helvetica", "normal");
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
        doc.text(`Generated by SHOTHIK AI - ${new Date().toLocaleDateString()}`, margin + 25, pageHeight - 10);
      }
      
      doc.save(`${title || 'research-results'}.pdf`);
    } catch (err) {
      console.error("Failed to export PDF:", err);
    }
    handleMenuClose();
  };

  const handleRewrite = () => {
    console.log("Rewrite requested");
    handleMenuClose();
  };

  const handleFeedback = async (type) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setFeedback(type);
    
    try {
      if (onFeedback) {
        await onFeedback(type);
      }
      console.log(`Feedback submitted: ${type}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setFeedback(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 1,
        px: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        justifyContent: "space-between",
      }}
    >
      {/* Left side - Sharing actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {/* Share Button */}
        <Tooltip title="Share">
          <IconButton
            size="small"
            onClick={handleShareClick}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Export Button */}
        <Tooltip title="Export">
          <IconButton
            size="small"
            onClick={handleExportClick}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ExportIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Rewrite Button */}
        <Tooltip title="Rewrite">
          <IconButton
            size="small"
            onClick={handleRewrite}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <RewriteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Center - Feedback section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.875rem",
            mr: 1,
          }}
        >
          Was this helpful?
        </Typography>
        
        {/* Thumbs Up */}
        <Tooltip title="Yes, helpful">
          <IconButton
            size="small"
            onClick={() => handleFeedback('helpful')}
            disabled={isSubmitting}
            sx={{
              color: feedback === 'helpful' 
                ? theme.palette.success.main 
                : theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.success.main,
              },
              "&:disabled": {
                color: feedback === 'helpful' 
                  ? theme.palette.success.main 
                  : theme.palette.text.disabled,
              },
            }}
          >
            <ThumbUpIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        {/* Thumbs Down */}
        <Tooltip title="No, not helpful">
          <IconButton
            size="small"
            onClick={() => handleFeedback('not-helpful')}
            disabled={isSubmitting}
            sx={{
              color: feedback === 'not-helpful' 
                ? theme.palette.error.main 
                : theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.error.main,
              },
              "&:disabled": {
                color: feedback === 'not-helpful' 
                  ? theme.palette.error.main 
                  : theme.palette.text.disabled,
              },
            }}
          >
            <ThumbDownIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Right side - Copy action */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Tooltip title="Copy content">
          <IconButton
            size="small"
            onClick={handleCopyContent}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <CopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Share Menu */}
      <Menu
        anchorEl={shareMenuAnchor}
        open={Boolean(shareMenuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Link</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCopyContent}>
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Content</ListItemText>
        </MenuItem>
      </Menu>

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleExportPDF}>
          <ListItemIcon>
            <PdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CombinedActions;
