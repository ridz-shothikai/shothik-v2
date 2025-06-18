import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
  Box, CircularProgress, Link, Paper, List, ListItem, ListItemText
} from '@mui/material';

const InputPlagiarismDialog = ({ open, onClose, isLoading, result }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Input Text Plagiarism Report</DialogTitle>
      <DialogContent dividers>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        )}
        {!isLoading && !result && (
          <Typography sx={{ my: 2 }}>
            Click "Check Plagiarism" to analyze your input text.
          </Typography>
        )}
        {!isLoading && result && (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>
              Plagiarism Score: {result.percentage}%
            </Typography>
            {result.originalText && (
                <Paper variant="outlined" sx={{p: 1, my:1, maxHeight: 150, overflow: 'auto'}}>
                     <Typography variant="caption">Checked Text:</Typography>
                     <Typography variant="body2" sx={{whiteSpace: 'pre-wrap'}}>{result.originalText}</Typography>
                </Paper>
            )}
            {result.sources && result.sources.length > 0 ? (
              <List dense>
                <Typography variant="subtitle1" sx={{mt: 2}}>Matched Sources:</Typography>
                {result.sources.map((source, index) => (
                  <ListItem key={index} disablePadding sx={{flexDirection: 'column', alignItems: 'flex-start', mb:1, borderBottom: '1px solid #eee'}}>
                    <Link href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.url || 'Unknown Source'}
                    </Link>
                    <Typography variant="body2" color="textSecondary">
                      Match: {source.matchPercent}%
                    </Typography>
                    {source.snippet && (
                      <Typography variant="caption" sx={{ maxHeight: 60, overflow: 'auto', display: 'block', mt:0.5, color: 'text.secondary' }}>
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
export default InputPlagiarismDialog;
