import { Box, CircularProgress, Link, List, ListItem, Paper, Typography } from '@mui/material'; // Removed ListItemText as it's not directly used

const OutputPlagiarismReportPanel = ({ isLoading, result }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, height: '100%', boxSizing: 'border-box' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!result) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', height: '100%', boxSizing: 'border-box' }}>
        <Typography>
          Click "Check Output Plagiarism" to analyze the paraphrased text.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <Typography variant="h6" gutterBottom>
        Output Plagiarism Score: {result.percentage}%
      </Typography>
      {result.originalText && (
        <Paper variant="outlined" sx={{p: 1, my:1, maxHeight: 150, overflow: 'auto'}}>
             <Typography variant="caption">Checked Text (Paraphrased Output):</Typography>
             <Typography variant="body2" sx={{whiteSpace: 'pre-wrap'}}>{result.originalText}</Typography>
        </Paper>
      )}
      {result.sources && result.sources.length > 0 ? (
        <List dense sx={{pt:0}}> {/* Added pt:0 to List dense */}
          <Typography variant="subtitle1" sx={{mt: 2, mb: 1}}>Matched Sources:</Typography> {/* Added mb:1 */}
          {result.sources.map((source, index) => (
            <ListItem key={index} disablePadding sx={{flexDirection: 'column', alignItems: 'flex-start', mb:1, borderBottom: '1px solid #eee', pb:1}}> {/* Added pb:1 */}
              <Link href={source.url} target="_blank" rel="noopener noreferrer" sx={{ display: 'block', wordBreak: 'break-all' }}>
                {source.url || 'Unknown Source'}
              </Link>
              <Typography variant="body2" color="textSecondary">
                Match: {source.matchPercent}%
              </Typography>
              {source.snippet && (
                <Typography variant="caption" sx={{ maxHeight: 60, overflow: 'auto', display: 'block', mt:0.5, color: 'text.secondary', width: '100%' }}> {/* Added width:100% */}
                  Snippet: "{source.snippet}"
                </Typography>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography sx={{mt: 2}}>No significant plagiarism detected or no sources found.</Typography>
      )}
    </Box>
  );
};
export default OutputPlagiarismReportPanel;
