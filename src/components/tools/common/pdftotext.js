import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

/**
 * Extracts text content from a PDF file.
 * @param {File} file - The PDF file to extract text from.
 * @returns {Promise<string>} A promise that resolves with the extracted text content.
 */
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

export default pdfToText;
