import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);

const AgentResponseDisplay = ({ response, type = 'text', language = 'javascript' }) => {
  if (!response) {
    return (
      <Paper sx={{ p: 2, minHeight: 80, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary">
          No response yet.
        </Typography>
      </Paper>
    );
  }

  let content = null;
  if (type === 'code') {
    content = (
      <SyntaxHighlighter language={language} style={github} customStyle={{ borderRadius: 8, fontSize: 14 }}>
        {typeof response === 'string' ? response : response.code || ''}
      </SyntaxHighlighter>
    );
  } else if (type === 'image') {
    content = (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
        <img src={typeof response === 'string' ? response : response.url} alt="Agent response" style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8 }} />
      </Box>
    );
  } else {
    content = (
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
        {typeof response === 'string' ? response : response.text || ''}
      </Typography>
    );
  }

  return (
    <Paper sx={{ p: 2, minHeight: 80, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      {content}
    </Paper>
  );
};

export default AgentResponseDisplay; 