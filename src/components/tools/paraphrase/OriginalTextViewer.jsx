import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

const OriginalTextViewer = ({ htmlContent }) => {
  if (!htmlContent) {
    return null; // Or some placeholder if needed when content is empty but component is shown
  }

  return (
    <Box sx={{ mb: 2, flexShrink: 0 }}> {/* Added flexShrink: 0 to prevent it from shrinking too much if space is tight */}
      <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', ml: 0.5 }}>
        Original Text:
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          maxHeight: '150px', // Example max height, can be adjusted
          overflowY: 'auto',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey[800]' : 'grey[100]', // Subtle background
          borderColor: 'divider',
          whiteSpace: 'pre-wrap', // Preserve whitespace and newlines from HTML
          wordWrap: 'break-word', // Ensure long words break
          '& p': { // Basic styling for paragraphs coming from TipTap HTML
            marginBlockStart: '0.5em',
            marginBlockEnd: '0.5em',
          },
          // Add more specific styling for other HTML elements if needed
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Paper>
    </Box>
  );
};

export default OriginalTextViewer;
