import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const ERROR_TITLES = {
  network: 'Network Error',
  validation: 'Validation Error',
  server: 'Server Error',
  default: 'Error',
};

const ERROR_SEVERITY = {
  network: 'warning',
  validation: 'info',
  server: 'error',
  default: 'error',
};

const AgentErrorDisplay = ({ error, type = 'default', onRetry, showRetry = false }) => {
  const title = ERROR_TITLES[type] || ERROR_TITLES.default;
  const severity = ERROR_SEVERITY[type] || ERROR_SEVERITY.default;
  const message = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred.';

  return (
    <Box sx={{ my: 2 }}>
      <Alert severity={severity} variant="filled" sx={{ alignItems: 'center' }}>
        <AlertTitle>{title}</AlertTitle>
        <Typography variant="body2" sx={{ mb: showRetry && onRetry ? 2 : 0 }}>{message}</Typography>
        {showRetry && onRetry && (
          <Button variant="outlined" color="inherit" size="small" onClick={onRetry} sx={{ mt: 1 }}>
            Retry
          </Button>
        )}
      </Alert>
    </Box>
  );
};

export default AgentErrorDisplay; 