"use client";

import { Box } from '@mui/material';

export default function SharedLayout({ children }) {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: 'background.default',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {children}
    </Box>
  );
}
