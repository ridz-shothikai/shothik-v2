import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

// Helper function to parse markdown text and maintain structure
const parseMarkdownText = (text) => {
  // Split by double newlines to get paragraphs
  const paragraphs = text.split(/\n\s*\n/);
  
  return paragraphs.map(paragraph => {
    // Remove extra whitespace but preserve single line breaks within paragraphs
    return paragraph.trim().replace(/\n/g, ' ');
  }).filter(p => p.length > 0);
};

// Helper function to convert markdown to plain text while preserving structure
const markdownToPlainText = (text) => {
  return text
    // Remove markdown bold/italic syntax
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove markdown links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
};

const downloadAsTxt = (outputContent, filename) => {
  const plainText = markdownToPlainText(outputContent);
  const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
  saveAs(blob, filename);
};

const downloadAsPdf = (outputContent, filename) => {
  const doc = new jsPDF();
  const plainText = markdownToPlainText(outputContent);
  const paragraphs = parseMarkdownText(plainText);
  
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const maxWidth = doc.internal.pageSize.width - 2 * margin;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  
  paragraphs.forEach((paragraph, index) => {
    // Split long paragraphs into lines that fit the page width
    const lines = doc.splitTextToSize(paragraph, maxWidth);
    
    // Check if we need a new page
    if (yPosition + (lines.length * 7) > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    // Add paragraph with proper spacing
    lines.forEach((line, lineIndex) => {
      doc.text(line, margin, yPosition);
      yPosition += 7; // Line height
    });
    
    // Add space between paragraphs
    if (index < paragraphs.length - 1) {
      yPosition += 5;
    }
  });
  
  doc.save(filename);
};

const downloadAsDocx = (outputContent, filename) => {
  const plainText = markdownToPlainText(outputContent);
  const paragraphs = parseMarkdownText(plainText);
  
  // Create document with proper paragraph structure
  const documentChildren = paragraphs.map(paragraphText => 
    new Paragraph({
      children: [
        new TextRun({
          text: paragraphText,
          size: 24, // 12pt font size (24 half-points)
          font: "Arial",
        }),
      ],
      spacing: {
        after: 200, // Space after paragraph
      },
    })
  );
  
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: documentChildren,
      },
    ],
  });
  
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, filename);
  });
};

export const downloadFile = (outputContent, toolName, format = 'docx') => {
  const currentDate = new Date();
  const formattedDate = `${
    currentDate.getMonth() + 1
  }_${currentDate.getDate()}_${currentDate.getFullYear()}`;
  const formattedTime = `${currentDate.getHours()}_${currentDate.getMinutes()}_${currentDate.getSeconds()}`;
  
  const filename = `${toolName}_Text_${formattedDate}_${formattedTime}.${format}`;
  
  switch (format.toLowerCase()) {
    case 'pdf':
      downloadAsPdf(outputContent, filename);
      break;
    case 'txt':
      downloadAsTxt(outputContent, filename);
      break;
    case 'docx':
    default:
      downloadAsDocx(outputContent, filename);
      break;
  }
};
