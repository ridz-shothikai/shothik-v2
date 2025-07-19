"use client";

import { Box, Button, Typography, Stack } from "@mui/material";
import { ArrowForward, PlayCircleOutline, CheckCircleOutline } from "@mui/icons-material";
import * as motion from "motion/react-client";
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 167, 111, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 167, 111, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 167, 111, 0);
  }
`;

const UserActionButton = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ mb: 2 }}
      >
        {/* Primary CTA */}
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          sx={{
            minHeight: { xs: 48, md: 56 },
            px: { xs: 3, md: 4 },
            fontSize: { xs: '1rem', md: '1.1rem' },
            borderRadius: '0.5rem',
            textTransform: 'none',
            backgroundColor: '#00A76F',
            animation: `${pulse} 3s infinite`,
            width: { xs: '100%', sm: 'auto' },
            '&:hover': {
              backgroundColor: '#008F5F',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease',
            },
          }}
          onClick={() => {
            // Handle sign up action
          }}
        >
          Try Shothik Free - No Card Required
        </Button>

        {/* Secondary CTA */}
        <Button
          variant="outlined"
          size="large"
          startIcon={<PlayCircleOutline />}
          sx={{
            minHeight: { xs: 48, md: 56 },
            px: { xs: 3, md: 3 },
            fontSize: { xs: '1rem', md: '1.1rem' },
            borderRadius: '0.5rem',
            textTransform: 'none',
            borderColor: '#00A76F',
            color: '#00A76F',
            width: { xs: '100%', sm: 'auto' },
            '&:hover': {
              borderColor: '#008F5F',
              backgroundColor: 'rgba(0, 167, 111, 0.08)',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease',
            },
          }}
          onClick={() => {
            // Handle video play
          }}
        >
          Watch Demo (1:32)
        </Button>
      </Stack>

      {/* Trust Indicators */}
      <Stack 
        direction="row" 
        spacing={3} 
        sx={{ 
          flexWrap: 'wrap',
          gap: { xs: 1, md: 2 },
        }}
      >
        {[
          'No Credit Card Required',
          '7-Day Free Trial',
          'Cancel Anytime'
        ].map((text, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <CheckCircleOutline 
              sx={{ 
                fontSize: 16, 
                color: '#00A76F' 
              }} 
            />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
              }}
            >
              {text}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default UserActionButton;