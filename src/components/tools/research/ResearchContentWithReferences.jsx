"use client";

import { Box, Typography, Paper, useTheme } from "@mui/material";
import { marked } from "marked";
import { useState } from "react";
import ReferenceModal from "./ReferenceModal";
import SourcesGrid from "./SourcesGrid";
import CombinedActions from "./CombinedActions";

const ResearchContentWithReferences = ({ 
  content, 
  sources = [], 
  isLastData, 
  isDataGenerating,
  title = "Research Results"
}) => {
  const theme = useTheme();
  const [selectedReference, setSelectedReference] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // Handle feedback submission
  const handleFeedback = async (feedbackType) => {
    try {
      // You can implement your feedback API call here
      console.log(`Feedback received: ${feedbackType}`);
      // Example: await submitFeedback({ type: feedbackType, content, sources });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  // Function to process content and make references clickable
  const processContentWithReferences = (text) => {
    // Ensure text is a string and clean it
    if (!text || typeof text !== 'string') {
      if (typeof text === 'object' && text !== null) {
        text = text.text || text.content || text.result || text.answer || '';
      } else {
        text = String(text || '');
      }
    }

    // Remove any [object Object] strings that might be in the text
    text = text.replace(/\[object Object\]/g, '');

    // Regular expression to find reference patterns like [1], [2, 9], [12, 13], etc.
    const referenceRegex = /\[(\d+(?:,\s*\d+)*)\]/g;
    
    return text.replace(referenceRegex, (match, numbers) => {
      const refNumbers = numbers.split(',').map(n => parseInt(n.trim()));
      
      // Create clickable spans for each reference
      return refNumbers.map(refNum => {
        const sourceExists = sources.some(source => source.reference === refNum);
        if (sourceExists) {
          return `<span class="reference-link" data-reference="${refNum}" style="
            color: #1976d2;
            cursor: pointer;
            text-decoration: underline;
            font-weight: 500;
            padding: 1px 2px;
            border-radius: 3px;
            transition: all 0.2s ease;
            display: inline-block;
            position: relative;
          " onmouseover="this.style.backgroundColor='rgba(25, 118, 212, 0.1)'" 
             onmouseout="this.style.backgroundColor='transparent'">[${refNum}]</span>`;
        }
        return `[${refNum}]`;
      }).join('');
    });
  };

  const handleReferenceHover = (reference, event) => {
    console.log('handleReferenceHover called:', { reference, sources: sources?.length });
    
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    
    setSelectedReference(reference);
    setAnchorEl(event.currentTarget);
    setModalOpen(true);
  };

  const handleReferenceLeave = () => {
    console.log('handleReferenceLeave called');
    // Add a small delay to prevent flickering
    const timeout = setTimeout(() => {
      setModalOpen(false);
      setSelectedReference(null);
      setAnchorEl(null);
    }, 100);
    setHoverTimeout(timeout);
  };

  // Handle content - it might be an object with text property or a string
  let contentStr = '';
  if (typeof content === 'string') {
    contentStr = content;
  } else if (typeof content === 'object' && content !== null) {
    // If content is an object, try to extract the text content
    contentStr = content.text || content.content || content.result || content.answer || '';
  } else {
    contentStr = String(content || '');
  }
  
  // Clean any [object Object] strings from the content
  contentStr = contentStr.replace(/\[object Object\]/g, '');
  
  console.log('Content processing:', { contentStr: contentStr.substring(0, 200), sources: sources?.length });
  
  const processedContent = processContentWithReferences(contentStr);

  // Custom renderer for marked to handle reference clicks
  const renderer = new marked.Renderer();
  
  // Override the paragraph renderer to add click handlers
  const originalParagraph = renderer.paragraph;
  renderer.paragraph = function(text) {
    // Ensure text is a string before processing
    const textStr = typeof text === 'string' ? text : String(text || '');
    const processedText = processContentWithReferences(textStr);
    return `<p>${processedText}</p>`;
  };

  // Configure marked with custom renderer
  marked.setOptions({
    renderer: renderer,
    breaks: true,
    gfm: true,
  });

  // Add hover event listeners after rendering
  const handleContentMouseOver = (event) => {
    const target = event.target;
    if (target.classList.contains('reference-link')) {
      const reference = parseInt(target.getAttribute('data-reference'));
      console.log('Hovering over reference:', reference, target);
      
      // Create a proper anchor element for this specific reference
      const rect = target.getBoundingClientRect();
      const anchorElement = {
        getBoundingClientRect: () => ({
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          width: rect.width,
          height: rect.height,
        }),
        nodeType: 1,
      };
      
      handleReferenceHover(reference, { currentTarget: anchorElement });
    }
  };

  const handleContentMouseLeave = (event) => {
    const target = event.target;
    if (target.classList.contains('reference-link')) {
      console.log('Leaving reference:', target);
      handleReferenceLeave();
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            py: 2,
            px: 3,
            mb: { xs: isLastData && isDataGenerating ? 2 : 19, sm: 9, md: 2 },
            bgcolor: theme?.palette.mode === "dark" ? "#161C24" : "#F4F6F8",
            border: "none",
            boxShadow: "none",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Sources Grid - Display at the top like Perplexity */}
          {sources && sources.length > 0 && (
            <SourcesGrid sources={sources} />
          )}
          
          <Box
            sx={{
              "& p": {
                mb: 1,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                hyphens: "auto",
                maxWidth: "100%",
              },
              "& p:last-child": { mb: 0 },
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                maxWidth: "100%",
                mb: 1,
              },
              "& ul, & ol": {
                paddingLeft: { xs: "1rem", sm: "1.5rem" },
                maxWidth: "100%",
              },
              "& li": {
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                maxWidth: "100%",
                mb: 0.5,
              },
              "& a": {
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-all",
                color: "primary.main",
                textDecoration: "underline",
              },
              "& code": {
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: "2px 4px",
                borderRadius: "4px",
                fontSize: "0.875em",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
              },
              "& pre": {
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: "12px",
                borderRadius: "8px",
                overflow: "auto",
                maxWidth: "100%",
                "& code": {
                  backgroundColor: "transparent",
                  padding: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                },
              },
              "& blockquote": {
                borderLeft: "4px solid #ddd",
                paddingLeft: { xs: "8px", sm: "16px" },
                margin: "16px 0",
                fontStyle: "italic",
                color: "text.secondary",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              },
              "& table": {
                width: "100%",
                maxWidth: "100%",
                overflowX: "auto",
                display: "block",
                whiteSpace: "nowrap",
                "& td, & th": {
                  padding: { xs: "4px", sm: "8px" },
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                  wordWrap: "break-word",
                },
              },
              "& img": {
                maxWidth: "100%",
                height: "auto",
                display: "block",
              },
              "& *": {
                maxWidth: "100%",
                boxSizing: "border-box",
              },
            }}
            onMouseOver={handleContentMouseOver}
            onMouseLeave={handleContentMouseLeave}
            dangerouslySetInnerHTML={{ 
              __html: marked(processedContent) 
            }}
          />

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              mt: 1,
              display: "block",
              textAlign: "right",
              fontSize: { xs: "0.6rem", sm: "0.75rem" },
            }}
          />

          {/* Combined Sharing and Feedback Actions */}
          <CombinedActions 
            content={processedContent}
            sources={sources}
            title={title}
            onFeedback={handleFeedback}
          />
        </Paper>
      </Box>

      <ReferenceModal
        open={modalOpen}
        onClose={handleReferenceLeave}
        reference={selectedReference}
        sources={sources}
        anchorEl={anchorEl}
      />
    </>
  );
};

export default ResearchContentWithReferences;
