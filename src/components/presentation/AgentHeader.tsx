// components/AgentHeader.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PRIMARY_GREEN = '#07B37A';

export default function AgentHeader({ currentAgentType, onBackClick }) {
  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '80px',
      bgcolor: 'white',
      borderBottom: '1px solid #e0e0e0',
      zIndex: 1001,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
    }}>
      <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          width: '100%',
        }}>
          <IconButton 
            onClick={onBackClick}
            sx={{ color: '#666', '&:hover': { color: PRIMARY_GREEN } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            background: `linear-gradient(45deg, ${PRIMARY_GREEN}, #00ff88)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            flex: 1,
          }}>
            Shothik {currentAgentType === 'presentation' ? 'Presentation' : 'Super'} Agent
          </Typography>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: PRIMARY_GREEN,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            }
          }} />
        </Box>
      </Container>
    </Box>
  );
}