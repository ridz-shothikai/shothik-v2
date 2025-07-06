'use client'

import React from 'react'
import {
  Box,
  Typography,
  Chip,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  PlayArrow,
  FileDownload,
  MoreVert,
  Description
} from '@mui/icons-material'
import { usePresentation } from './context/SlideContext'; // Import the context hook

export default function SlidePreviewNavbar() {
  // Get the function to open the presentation from the context
  const { openPresentation } = usePresentation();
  
  // Get theme and media queries for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: 'white',
        color: 'black',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Toolbar sx={{
        justifyContent: 'space-between',
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 0.5, sm: 1 },
        minHeight: { xs: 56, sm: 64 }
      }}>
        {/* Left section - Title and page count */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
          flex: 1,
          minWidth: 0 // Allow text truncation
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1 },
            minWidth: 0,
            flex: 1
          }}>
            <Description sx={{
              fontSize: { xs: 18, sm: 20 },
              color: '#666',
              flexShrink: 0
            }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                color: '#333',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
            >
              Bangladesh Independence Day
            </Typography>

            {/* Page count chip - hide on mobile */}
            {!isMobile && (
              <Chip
                label="5 pages total"
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                  color: '#666',
                  borderColor: '#e0e0e0',
                  flexShrink: 0
                }}
              />
            )}
          </Box>
        </Box>

        {/* Right section - Action buttons */}
        <Stack
          direction="row"
          spacing={{ xs: 0.5, sm: 1 }}
          alignItems="center"
          sx={{ flexShrink: 0 }}
        >
          <Button
            variant="contained"
            startIcon={!isMobile ? <PlayArrow /> : undefined}
            onClick={openPresentation}
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              px: { xs: 1, sm: 2 },
              py: 0.5,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              minWidth: { xs: 'auto', sm: 'auto' },
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            {isMobile ? <PlayArrow /> : 'Play Slides'}
          </Button>

          {/* Export button - hide text on mobile, show icon only */}
          <Button
            variant="outlined"
            startIcon={!isMobile ? <FileDownload /> : undefined}
            sx={{
              color: '#ff9800',
              borderColor: '#ff9800',
              textTransform: 'none',
              fontWeight: 500,
              px: { xs: 1, sm: 2 },
              py: 0.5,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              minWidth: { xs: 'auto', sm: 'auto' },
              '&:hover': {
                borderColor: '#f57c00',
                backgroundColor: 'rgba(255, 152, 0, 0.04)'
              }
            }}
          >
            {isMobile ? <FileDownload /> : 'Export'}
          </Button>

          {/* More options button */}
          <IconButton
            sx={{
              color: '#666',
              padding: { xs: 0.5, sm: 1 },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <MoreVert sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}