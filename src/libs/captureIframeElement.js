// Enhanced function to capture element with proper styling
function captureElementAsImageFromIframe(elementPath, selectionData) {
  const iframeDoc =
    iframeRef.current?.contentDocument ||
    iframeRef.current?.contentWindow?.document;
  if (!iframeDoc) return;

  const targetElement = iframeDoc.querySelector(elementPath);
  if (!targetElement) {
    console.warn("Element not found in iframe for path:", elementPath);
    return;
  }

  // Get the iframe's window for proper style computation
  const iframeWindow = iframeRef.current.contentWindow;

  // Enhanced html2canvas options for better quality
  const captureOptions = {
    // Basic options
    backgroundColor: null, // Preserve transparency
    scale: 2, // Higher resolution
    useCORS: true,
    allowTaint: true,

    // Size options - use the actual element dimensions
    width: selectionData.boundingRect.width,
    height: selectionData.boundingRect.height,

    // Font and text options
    foreignObjectRendering: true, // Better text rendering

    // Style preservation options
    ignoreElements: (element) => {
      // Ignore our selection highlights
      return (
        element.classList?.contains("element-hovered") ||
        element.classList?.contains("element-selected")
      );
    },

    // Custom style processing
    onclone: (clonedDoc, element) => {
      // Remove our custom selection classes from the clone
      const elementsWithSelection = clonedDoc.querySelectorAll(
        ".element-hovered, .element-selected",
      );
      elementsWithSelection.forEach((el) => {
        el.classList.remove("element-hovered", "element-selected");
      });

      // Apply computed styles more accurately
      applyComputedStylesToClone(targetElement, element, iframeWindow);

      // Ensure background colors are preserved
      preserveBackgroundColors(element, iframeWindow);

      return clonedDoc;
    },
  };

  // Create a temporary container to ensure proper styling
  const tempContainer = iframeDoc.createElement("div");
  tempContainer.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: ${selectionData.boundingRect.width}px;
      height: ${selectionData.boundingRect.height}px;
      background: ${getElementBackground(targetElement, iframeWindow)};
      padding: 0;
      margin: 0;
      border: none;
      overflow: hidden;
    `;

  // Clone the target element
  const clonedElement = targetElement.cloneNode(true);

  // Apply all computed styles to the clone
  applyAllComputedStyles(targetElement, clonedElement, iframeWindow);

  // Add clone to temp container
  tempContainer.appendChild(clonedElement);
  iframeDoc.body.appendChild(tempContainer);

  // Capture the element
  html2canvas(tempContainer, captureOptions)
    .then((canvas) => {
      // Remove temp container
      iframeDoc.body.removeChild(tempContainer);

      // Convert to base64
      const imageData = canvas.toDataURL("image/png", 1.0);

      console.log("📸 Enhanced Base64 Image Data:", imageData);

      // Optional: Create a preview or download
      createImagePreview(imageData, selectionData);

      return imageData;
    })
    .catch((error) => {
      console.error("Error capturing element:", error);
      // Fallback to direct capture
      fallbackCapture(targetElement, captureOptions);
    });
}

// Helper function to apply computed styles to cloned element
function applyComputedStylesToClone(
  originalElement,
  clonedElement,
  iframeWindow,
) {
  const computedStyle = iframeWindow.getComputedStyle(originalElement);

  // Important style properties to preserve
  const importantProps = [
    "backgroundColor",
    "background",
    "backgroundImage",
    "backgroundSize",
    "backgroundPosition",
    "backgroundRepeat",
    "backgroundAttachment",
    "color",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "lineHeight",
    "textAlign",
    "textDecoration",
    "textTransform",
    "padding",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "margin",
    "marginTop",
    "marginRight",
    "marginBottom",
    "marginLeft",
    "border",
    "borderTop",
    "borderRight",
    "borderBottom",
    "borderLeft",
    "borderRadius",
    "boxShadow",
    "textShadow",
    "width",
    "height",
    "maxWidth",
    "maxHeight",
    "minWidth",
    "minHeight",
    "display",
    "position",
    "overflow",
    "overflowX",
    "overflowY",
    "opacity",
    "visibility",
    "zIndex",
    "transform",
  ];

  importantProps.forEach((prop) => {
    const value = computedStyle.getPropertyValue(prop);
    if (value) {
      clonedElement.style.setProperty(prop, value, "important");
    }
  });

  // Apply styles to child elements recursively
  const originalChildren = originalElement.children;
  const clonedChildren = clonedElement.children;

  for (let i = 0; i < originalChildren.length; i++) {
    if (clonedChildren[i]) {
      applyComputedStylesToClone(
        originalChildren[i],
        clonedChildren[i],
        iframeWindow,
      );
    }
  }
}

// Helper function to apply all computed styles
function applyAllComputedStyles(originalElement, clonedElement, iframeWindow) {
  const computedStyle = iframeWindow.getComputedStyle(originalElement);

  // Copy all computed styles
  for (let i = 0; i < computedStyle.length; i++) {
    const property = computedStyle[i];
    const value = computedStyle.getPropertyValue(property);
    clonedElement.style.setProperty(property, value);
  }

  // Ensure background is properly set
  const bgColor = getElementBackground(originalElement, iframeWindow);
  if (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
    clonedElement.style.backgroundColor = bgColor;
  }

  // Apply to children
  const originalChildren = originalElement.children;
  const clonedChildren = clonedElement.children;

  for (let i = 0; i < originalChildren.length; i++) {
    if (clonedChildren[i]) {
      applyAllComputedStyles(
        originalChildren[i],
        clonedChildren[i],
        iframeWindow,
      );
    }
  }
}

// Helper function to get element background (inherited if necessary)
function getElementBackground(element, iframeWindow) {
  let currentElement = element;

  while (currentElement && currentElement !== iframeWindow.document.body) {
    const computedStyle = iframeWindow.getComputedStyle(currentElement);
    const bgColor = computedStyle.backgroundColor;

    if (
      bgColor &&
      bgColor !== "rgba(0, 0, 0, 0)" &&
      bgColor !== "transparent"
    ) {
      return bgColor;
    }

    currentElement = currentElement.parentElement;
  }

  // Default to white if no background found
  return "#ffffff";
}

// Helper function to preserve background colors
function preserveBackgroundColors(element, iframeWindow) {
  const computedStyle = iframeWindow.getComputedStyle(element);
  const bgColor = computedStyle.backgroundColor;

  if (!bgColor || bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
    // Find inherited background
    const inheritedBg = getElementBackground(element, iframeWindow);
    element.style.backgroundColor = inheritedBg;
  }

  // Apply to children
  Array.from(element.children).forEach((child) => {
    preserveBackgroundColors(child, iframeWindow);
  });
}

// Fallback capture method
function fallbackCapture(targetElement, captureOptions) {
  console.log("Using fallback capture method...");

  html2canvas(targetElement, {
    ...captureOptions,
    logging: true,
    backgroundColor: "#ffffff",
  })
    .then((canvas) => {
      const imageData = canvas.toDataURL("image/png", 1.0);
      console.log("📸 Fallback Base64 Image Data:", imageData);
      return imageData;
    })
    .catch((error) => {
      console.error("Fallback capture also failed:", error);
    });
}

// Helper function to create image preview (optional)
function createImagePreview(imageData, selectionData) {
  // Create a preview window or modal
  const previewWindow = window.open("", "_blank", "width=800,height=600");
  previewWindow.document.write(`
      <html>
        <head>
          <title>Element Capture Preview</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: #f0f0f0;
              font-family: Arial, sans-serif;
            }
            .preview-container {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .preview-image {
              max-width: 100%;
              height: auto;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            .info {
              margin-top: 15px;
              padding: 10px;
              background: #f8f9fa;
              border-radius: 4px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="preview-container">
            <h3>Captured Element: ${selectionData.element.tagName.toUpperCase()}</h3>
            <img src="${imageData}" alt="Captured Element" class="preview-image" />
            <div class="info">
              <strong>Element Type:</strong> ${selectionData.elementType}<br>
              <strong>Dimensions:</strong> ${Math.round(
                selectionData.boundingRect.width,
              )}px × ${Math.round(selectionData.boundingRect.height)}px<br>
              <strong>Element Path:</strong> ${selectionData.elementPath}<br>
              <strong>Text Content:</strong> ${selectionData.textContent
                .trim()
                .substring(0, 100)}...
            </div>
          </div>
        </body>
      </html>
    `);
}

// Alternative approach using SVG (better for text and styling)
function captureElementAsSVG(elementPath, selectionData) {
  const iframeDoc =
    iframeRef.current?.contentDocument ||
    iframeRef.current?.contentWindow?.document;
  if (!iframeDoc) return;

  const targetElement = iframeDoc.querySelector(elementPath);
  if (!targetElement) return;

  const iframeWindow = iframeRef.current.contentWindow;
  const computedStyle = iframeWindow.getComputedStyle(targetElement);

  // Create SVG
  const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" 
           width="${selectionData.boundingRect.width}" 
           height="${selectionData.boundingRect.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" 
               style="
                 font-family: ${computedStyle.fontFamily};
                 font-size: ${computedStyle.fontSize};
                 font-weight: ${computedStyle.fontWeight};
                 color: ${computedStyle.color};
                 background-color: ${getElementBackground(
                   targetElement,
                   iframeWindow,
                 )};
                 padding: ${computedStyle.padding};
                 margin: 0;
                 width: 100%;
                 height: 100%;
                 overflow: hidden;
               ">
            ${targetElement.innerHTML}
          </div>
        </foreignObject>
      </svg>
    `;

  // Convert SVG to base64
  const svgBase64 = "data:image/svg+xml;base64," + btoa(svg);
  console.log("📸 SVG Base64 Image Data:", svgBase64);

  return svgBase64;
}
