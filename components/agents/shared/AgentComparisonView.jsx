import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import AgentResponseDisplay from './AgentResponseDisplay';

// Simple diff highlighting: highlight lines that differ between responses
function getDiffLines(responses) {
  if (responses.length < 2) return [];
  const linesArr = responses.map(r => (typeof r === 'string' ? r : r.text || '').split('\n'));
  const maxLines = Math.max(...linesArr.map(lines => lines.length));
  const diffLines = new Array(maxLines).fill(false);
  for (let i = 0; i < maxLines; i++) {
    const lineSet = new Set(linesArr.map(lines => lines[i] || ''));
    if (lineSet.size > 1) diffLines[i] = true;
  }
  return diffLines;
}

const AgentComparisonView = ({ comparisons = [], highlightDiffs: highlightDiffsProp, onToggleDiffs }) => {
  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const useHighlight = highlightDiffsProp !== undefined ? highlightDiffsProp : highlightDiffs;
  const responses = comparisons.map(c => typeof c.response === 'string' ? c.response : c.response?.text || '');
  const diffLines = useHighlight ? getDiffLines(responses) : [];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>Agent Comparison</Typography>
        {onToggleDiffs ? (
          <FormControlLabel
            control={<Switch checked={useHighlight} onChange={e => onToggleDiffs(e.target.checked)} />}
            label="Highlight Differences"
          />
        ) : (
          <FormControlLabel
            control={<Switch checked={highlightDiffs} onChange={e => setHighlightDiffs(e.target.checked)} />}
            label="Highlight Differences"
          />
        )}
      </Box>
      <Grid container spacing={2}>
        {comparisons.map((comp, idx) => (
          <Grid item xs={12} md={6} key={comp.agentName || idx}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>{comp.agentName || `Agent ${idx + 1}`}</Typography>
              <AgentResponseDisplay
                response={comp.response}
                type={comp.type}
                language={comp.language}
              />
              {/* Simple diff highlighting: show lines in red if they differ */}
              {useHighlight && typeof comp.response === 'string' && diffLines.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {comp.response.split('\n').map((line, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{ bgcolor: diffLines[i] ? 'error.light' : 'transparent', px: 1, borderRadius: 1 }}
                    >
                      {line}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AgentComparisonView; 