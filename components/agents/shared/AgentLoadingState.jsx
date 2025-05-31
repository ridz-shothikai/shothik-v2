import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const AgentLoadingState = ({ variant = 'circular', message = 'Loading...', lines = 3 }) => {
  if (variant === 'skeleton') {
    return (
      <Box>
        {[...Array(lines)].map((_, i) => (
          <Skeleton key={i} variant="text" height={28} sx={{ mb: 1, borderRadius: 1 }} />
        ))}
      </Box>
    );
  }
  if (variant === 'text') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
        <Typography variant="body2" color="text.secondary">{message}</Typography>
      </Box>
    );
  }
  // Default: circular
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
      <CircularProgress color="primary" sx={{ mb: 2 }} />
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
  );
};

export default AgentLoadingState; 