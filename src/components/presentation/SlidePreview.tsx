// components/SlidePreview.jsx
import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { Button, useMediaQuery, Snackbar, Alert } from "@mui/material";
import createEnhancedIframeContent from "../../libs/presentationEditScripts";
import html2canvas from "html2canvas";

const PRIMARY_GREEN = "#07B37A";

// Original slide dimensions
const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;
const SLIDE_ASPECT_RATIO = SLIDE_WIDTH / SLIDE_HEIGHT;

export default function SlidePreview({
  slide,
  index,
  activeTab,
  onTabChange,
  totalSlides,
  theme,
  isDarkMode,
}) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    scale: 1,
  });
  const [copied, setCopied] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectionData, setSelectionData] = useState(null);
  const [showSelectionAlert, setShowSelectionAlert] = useState(false);

  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Copy to clipboard function
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(slide.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // EDIT LOGIC STARTS
  const handleEditSlide = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);

    if (newEditMode) {
      console.log("🎯 Edit mode enabled for slide:", slide?.slide_index + 1);
      // console.log("📄 Slide data:", slide);

      // Enable selection in iframe
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "TOGGLE_EDIT_MODE",
            enabled: true,
          },
          "*"
        );
      }

      setShowSelectionAlert(true);
    } else {
      console.log("🛑 Edit mode disabled for slide:", slide?.slide_index + 1);

      // Disable selection in iframe
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "TOGGLE_EDIT_MODE",
            enabled: false,
          },
          "*"
        );
      }

      setSelectionData(null);
    }
  };

  function captureElementAsImageFromIframe(elementPath) {
    const iframeDoc =
      iframeRef.current?.contentDocument ||
      iframeRef.current?.contentWindow?.document;
    if (!iframeDoc) return;

    const targetElement = iframeDoc.querySelector(elementPath);
    if (!targetElement) {
      console.warn("Element not found in iframe for path:", elementPath);
      return;
    }

    html2canvas(targetElement).then((canvas) => {
      const imageData = canvas.toDataURL("image/jpeg"); // or "image/png"
      console.log("📸 Base64 Image Data:", imageData);
      // Optionally do something with the image, like saving, copying, previewing
    });
  }
  

  // Handle messages from iframe
  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.data.type === "ELEMENT_SELECTED") {
        const data = event.data.data;
        setSelectionData(data);

        console.group("🎯 ELEMENT SELECTION DETECTED");
        console.log("🏷️  Element Type:", data.elementType);
        console.log("🏗️  Tag Name:", data.element.tagName);
        console.log("🆔 Element ID:", data.element.id || "No ID");
        console.log("🎨 Class Names:", data.element.className || "No classes");
        console.log("🛤️  Element Path:", data.elementPath);
        console.log(
          "📝 Text Content:",
          data.textContent.substring(0, 100) +
            (data.textContent.length > 100 ? "..." : "")
        );
        console.log("🔧 Attributes:", data.element.attributes);
        console.log("📐 Bounding Rectangle:", data.boundingRect);
        console.log("🎨 Computed Styles:", data.computedStyles);
        console.log(
          "📄 Inner HTML:",
          data.innerHTML.substring(0, 200) +
            (data.innerHTML.length > 200 ? "..." : "")
        );
        console.log(
          "📦 Outer HTML:",
          data.outerHTML.substring(0, 200) +
            (data.outerHTML.length > 200 ? "..." : "")
        );
        console.log("⏰ Timestamp:", data.timestamp);
        console.log("🎂 Full Element Data:", data);

        console.log(
          "image data",
          captureElementAsImageFromIframe(data.elementPath)
        );
        console.groupEnd();
      }
    };

    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

  // Update iframe pointer events based on edit mode
  const iframeStyle = {
    width: `${SLIDE_WIDTH}px`,
    height: `${SLIDE_HEIGHT}px`,
    transform: `scale(${dimensions.scale})`,
    transformOrigin: "center center",
    border: isEditMode ? `2px solid ${PRIMARY_GREEN}` : "none",
    display: "block",
    pointerEvents: isEditMode ? "auto" : "none",
    transition: "transform 0.2s ease-in-out, border 0.2s ease-in-out",
    flexShrink: 0,
    margin: 0,
    padding: 0,
  };
  // EDIT LOGIC ENDS

  // Calculate scale factor to fit the iframe within the container
  const calculateScale = (containerWidth) => {
    const viewportWidth = window.innerWidth;

    // For mobile devices, use a more aggressive scaling
    if (viewportWidth < 768) {
      // Ensure minimum scale for readability on mobile
      const minScale = 0.25;
      const calculatedScale = containerWidth / SLIDE_WIDTH;
      return Math.max(calculatedScale, minScale);
    }

    // For larger screens, use the container width
    return containerWidth / SLIDE_WIDTH;
  };

  // Calculate the container height based on the scaled iframe
  const calculateContainerHeight = (scale) => {
    const scaledHeight = SLIDE_HEIGHT * scale;
    const viewportHeight = window.innerHeight;

    // Set reasonable min/max heights
    const minHeight = 150;
    const maxHeight = Math.min(600, viewportHeight * 0.6);

    return Math.min(Math.max(scaledHeight, minHeight), maxHeight);
  };

  // Update dimensions when container resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scale = calculateScale(rect.width);
        const height = calculateContainerHeight(scale);

        setDimensions({
          width: rect.width,
          height: height,
          scale: scale,
        });
      }
    };

    // Use timeout to ensure container is fully rendered
    const timeoutId = setTimeout(updateDimensions, 100);

    // Create ResizeObserver for more accurate resize detection
    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize events
      clearTimeout(timeoutId);
      setTimeout(updateDimensions, 50);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Listen to window resize for viewport changes
    window.addEventListener("resize", updateDimensions);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [activeTab]); // Re-run when tab changes

  // Load Prism.js for syntax highlighting
  useEffect(() => {
    if (activeTab === "code") {
      // Load Prism CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
      document.head.appendChild(link);

      // Load Prism JS
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
      script.onload = () => {
        // Load HTML language support
        const htmlScript = document.createElement("script");
        htmlScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup.min.js";
        htmlScript.onload = () => {
          // Load CSS language support
          const cssScript = document.createElement("script");
          cssScript.src =
            "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js";
          cssScript.onload = () => {
            // Load JavaScript language support
            const jsScript = document.createElement("script");
            jsScript.src =
              "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js";
            jsScript.onload = () => {
              // Highlight all code blocks
              if (window.Prism) {
                window.Prism.highlightAll();
              }
            };
            document.head.appendChild(jsScript);
          };
          document.head.appendChild(cssScript);
        };
        document.head.appendChild(htmlScript);
      };
      document.head.appendChild(script);
    }
  }, [activeTab]);

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 2, overflow: "hidden" }}>
      <CardContent sx={{ p: "0 !important" }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: theme.palette.background.paper,
            px: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => onTabChange(index, newValue)}
            aria-label={`Tabs for slide ${index + 1}`}
            sx={{
              "& .MuiTabs-indicator": { bgcolor: PRIMARY_GREEN },
              "& .Mui-selected": { color: `${PRIMARY_GREEN} !important` },
            }}
          >
            <Tab
              label="Preview"
              value="preview"
              sx={{
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.875rem",
                },
              }}
            />
            <Tab
              label="Thinking"
              value="thinking"
              sx={{
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.875rem",
                },
              }}
            />
            <Tab
              label="Code"
              value="code"
              sx={{
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.875rem",
                },
              }}
            />
          </Tabs>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: { xs: "4px", md: "8px", lg: "12px", xl: "16px" },
            }}
          >
            {/* When edit mode will be on then we will need this. So don't remove it */}
            {/* <Button
              variant={isEditMode ? "contained" : "outlined"}
              size="small"
              sx={{
                px: 2,
                py: 0.5,
                fontSize: "0.75rem",
                bgcolor: isEditMode
                  ? PRIMARY_GREEN
                  : isDarkMode
                  ? "background.paper"
                  : "white",
                color: isEditMode ? "white" : PRIMARY_GREEN,
                borderColor: PRIMARY_GREEN,
                "&:hover": {
                  bgcolor: PRIMARY_GREEN,
                  color: "white",
                  borderColor: PRIMARY_GREEN,
                },
              }}
              onClick={handleEditSlide}
            >
              {isEditMode ? "Exit Edit" : "Edit"}
            </Button> */}

            {totalSlides && !isMobile && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.875rem",
                  },
                }}
              >
                {slide?.slide_index + 1} / {totalSlides}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ p: 0 }}>
          {activeTab === "preview" && (
            <Box
              ref={containerRef}
              sx={{
                height: `${dimensions.height}px`,
                position: "relative",
                width: "100%",
                bgcolor: isEditMode ? "#f8f9ff" : "#f0f0f0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 0,
                overflow: "hidden",
                margin: 0,
                padding: 0,
                transition:
                  "height 0.3s ease-in-out, background-color 0.2s ease-in-out",
              }}
            >
              {dimensions.scale > 0 && (
                <iframe
                  ref={iframeRef}
                  srcDoc={createEnhancedIframeContent(slide.body)}
                  style={iframeStyle as React.CSSProperties}
                  title={`Slide ${slide.slide_index + 1}`}
                  sandbox="allow-scripts allow-same-origin"
                />
              )}

              {/* Edit mode indicator */}
              {/* {isEditMode && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    bgcolor: PRIMARY_GREEN,
                    color: "white",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    zIndex: 10,
                  }}
                >
                  EDIT MODE
                </Box>
              )} */}
            </Box>
          )}
          {activeTab === "thinking" && (
            <EnhancedThinkingTab slide={slide} dimensions={dimensions} />
          )}
          {activeTab === "code" && (
            <Box
              sx={{
                position: "relative",
                minHeight: `${dimensions.height}px`,
                maxHeight: `${dimensions.height}px`,
                bgcolor: "#2d2d2d",
                borderRadius: 1,
              }}
            >
              {/* Copy button */}
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 10,
                }}
              >
                <Tooltip title={copied ? "Copied!" : "Copy code"}>
                  <IconButton
                    onClick={handleCopy}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    {copied ? (
                      <CheckIcon fontSize="small" />
                    ) : (
                      <ContentCopyIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Enhanced code display */}
              <pre
                style={{
                  margin: 0,
                  padding: "16px",
                  paddingTop: "48px", // Space for copy button
                  backgroundColor: "transparent",
                  borderRadius: 8,
                  overflow: "auto",
                  maxHeight: `${dimensions.height}px`,
                  fontSize: "14px",
                  lineHeight: "1.5",
                  fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                  color: "#f8f8f2",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <code className="language-html">{slide.body}</code>
              </pre>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Selection feedback snackbar */}
      {/* <Snackbar
        open={showSelectionAlert}
        autoHideDuration={4000}
        onClose={() => setShowSelectionAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setShowSelectionAlert(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          Edit mode enabled. Hover over elements and click to select them.
        </Alert>
      </Snackbar> */}
    </Card>
  );
}

// =========== UTILITY FUNCTIONS 👇 ===========

const parseSimpleMarkdown = (text) => {
  if (!text) return text;

  return (
    text
      // Headers
      .replace(
        /^### (.*$)/gm,
        '<h3 style="margin: 16px 0 8px 0; font-size: 1.1em; font-weight: 600; color: #1976d2;">$1</h3>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 style="margin: 18px 0 10px 0; font-size: 1.2em; font-weight: 600; color: #1976d2;">$1</h2>'
      )
      .replace(
        /^# (.*$)/gm,
        '<h1 style="margin: 20px 0 12px 0; font-size: 1.3em; font-weight: 600; color: #1976d2;">$1</h1>'
      )

      // Bold and italic
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="font-weight: 600; color: #2e7d32;">$1</strong>'
      )
      .replace(
        /\*(.*?)\*/g,
        '<em style="font-style: italic; color: #666;">$1</em>'
      )

      // Code blocks
      .replace(
        /```([\s\S]*?)```/g,
        '<pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; margin: 12px 0; overflow-x: auto; font-family: monospace; font-size: 0.9em; border-left: 4px solid #07B37A;"><code>$1</code></pre>'
      )

      // Inline code
      .replace(
        /`(.*?)`/g,
        '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 0.9em; color: #d73502;">$1</code>'
      )

      // Lists
      .replace(
        /^\* (.*$)/gm,
        '<li style="margin: 4px 0; padding-left: 8px;">$1</li>'
      )
      .replace(
        /^\- (.*$)/gm,
        '<li style="margin: 4px 0; padding-left: 8px;">$1</li>'
      )

      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" style="color: #1976d2; text-decoration: none;" target="_blank" rel="noopener">$1</a>'
      )

      // Line breaks
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>")
  );
};

const EnhancedThinkingTab = ({ slide, dimensions }) => {
  const [processedContent, setProcessedContent] = useState("");

  useEffect(() => {
    if (slide?.thought) {
      const parsed = parseSimpleMarkdown(slide.thought);
      setProcessedContent(parsed);
    }
  }, [slide?.thought]);

  return (
    <Box
      sx={{
        p: 3,
        maxHeight: `${dimensions.height}px`,
        minHeight: `${dimensions.height}px`,
        bgcolor: "#fafafa",
        borderRadius: 1,
        overflowY: "auto",
        position: "relative",

        // Custom scrollbar styling
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#c1c1c1",
          borderRadius: "4px",
          "&:hover": {
            background: "#a8a8a8",
          },
        },
      }}
    >
      {/* Content */}
      <Box
        sx={{
          "& h1, & h2, & h3": {
            fontFamily: "inherit",
          },
          "& p": {
            margin: "8px 0",
            lineHeight: 1.6,
          },
          "& ul, & ol": {
            paddingLeft: "20px",
            margin: "8px 0",
          },
          "& li": {
            marginBottom: "4px",
          },
          "& pre": {
            fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
          },
          "& blockquote": {
            borderLeft: "4px solid #07B37A",
            paddingLeft: "16px",
            margin: "16px 0",
            fontStyle: "italic",
            color: "#666",
          },
          fontSize: {
            xs: "0.75rem",
            sm: "0.875rem",
            lg: "1rem",
          },
        }}
      >
        {processedContent ? (
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              fontSize: "0.9em",
              whiteSpace: "pre-wrap",
            }}
          >
            {slide?.thought}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
