'use client'

import React, { useState } from 'react'
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
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider
} from '@mui/material'
import {
  PlayArrow,
  FileDownload,
  MoreVert,
  Description,
  Image as ImageIcon,
  Edit as EditIcon,
  PictureAsPdf
} from '@mui/icons-material'
import { usePresentation } from './context/SlideContext'
import { handleAdvancedPptxExport } from '../../libs/presentationExporter'
import { handleNativePptxExport } from '../../libs/nativePresentationExporter'
import { handlePDFExport } from '../../libs/pdfPresentationExporter'

export default function SlidePreviewNavbar({ slidesData }) {
  // Get the function to open the presentation from the context
  const { openPresentation } = usePresentation()
  
  // Get theme and media queries for responsive design
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  // Export functionality state
  const [exportAnchorEl, setExportAnchorEl] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  
  // PDF export dialog state
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [pdfOptions, setPdfOptions] = useState({
    format: 'presentation',
    orientation: 'landscape',
    quality: 0.92,
    margin: 10
  })

  const isExportMenuOpen = Boolean(exportAnchorEl)

  // Export menu handlers
  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget)
  }

  const handleExportClose = () => {
    setExportAnchorEl(null)
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Image-based PPTX export
  const handleImagePptxExport = async () => {
    handleExportClose()
    if (!slidesData?.data || slidesData.data.length === 0) {
      showSnackbar('No slides available to export', 'error')
      return
    }
    
    setIsExporting(true)
    try {
      const result = await handleAdvancedPptxExport(slidesData.data, { 
        fileName: 'presentation-images.pptx' 
      })
      
      if (result.success) {
        showSnackbar('Presentation exported successfully as images!', 'success')
      } else {
        showSnackbar(result.error || 'Export failed', 'error')
      }
    } catch (error) {
      console.error('Export error:', error)
      showSnackbar('An error occurred during export', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  // Native PPTX export (editable)
  const handleNativePptxExportClick = async () => {
    handleExportClose()
    if (!slidesData?.data || slidesData.data.length === 0) {
      showSnackbar('No slides available to export', 'error')
      return
    }
    
    setIsExporting(true)
    try {
      const result = await handleNativePptxExport(slidesData.data, { 
        fileName: 'presentation-editable.pptx' 
      })
      
      if (result.success) {
        showSnackbar('Editable presentation exported successfully!', 'success')
      } else {
        console.error("Native Export Failed:", result.error)
        showSnackbar(result.error || 'Native export failed', 'error')
      }
    } catch (error) {
      console.error('Native export error:', error)
      showSnackbar('An error occurred during native export', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  // PDF export handlers
  const handlePDFExportClick = () => {
    handleExportClose()
    setPdfDialogOpen(true)
  }

  const handlePDFDialogClose = () => {
    setPdfDialogOpen(false)
  }

  const handlePDFExportConfirm = async () => {
    if (!slidesData?.data || slidesData.data.length === 0) {
      showSnackbar('No slides available to export', 'error')
      return
    }

    setPdfDialogOpen(false)
    setIsExporting(true)
    
    try {
      const result = await handlePDFExport(slidesData.data, {
        fileName: 'presentation.pdf',
        ...pdfOptions
      })
      
      if (result.success) {
        showSnackbar(result.message || 'PDF exported successfully!', 'success')
      } else {
        showSnackbar(result.error || 'PDF export failed', 'error')
      }
    } catch (error) {
      console.error('PDF export error:', error)
      showSnackbar('An error occurred during PDF export', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const handlePDFOptionChange = (key, value) => {
    setPdfOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <>
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
              {!isMobile && slidesData?.data && (
                <Chip
                  label={`${slidesData.data.length} pages total`}
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
              disabled={!slidesData?.data || slidesData.data.length === 0}
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

            {/* Export button with dropdown */}
            <Button
              variant="outlined"
              startIcon={!isMobile && !isExporting ? <FileDownload /> : undefined}
              onClick={handleExportClick}
              disabled={!slidesData?.data || slidesData.data.length === 0 || isExporting}
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
              {isExporting ? (
                <CircularProgress size={16} sx={{ color: '#ff9800' }} />
              ) : isMobile ? (
                <FileDownload />
              ) : (
                'Export'
              )}
            </Button>

            {/* Export dropdown menu */}
            <Menu
              anchorEl={exportAnchorEl}
              open={isExportMenuOpen}
              onClose={handleExportClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                  }
                }
              }}
            >
              <MenuItem onClick={handlePDFExportClick}>
                <ListItemIcon>
                  <PictureAsPdf fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Export as PDF" 
                  secondary="Portable document format"
                />
              </MenuItem>
              <MenuItem onClick={handleImagePptxExport}>
                <ListItemIcon>
                  <ImageIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Export as Images" 
                  secondary="High-quality image slides in ppt"
                />
              </MenuItem>
              <MenuItem onClick={handleNativePptxExportClick} disabled>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Export as Editable" 
                  secondary="Editable PowerPoint format (Coming soon)"
                />
              </MenuItem>
            </Menu>

            {/* More options button */}
            {/* <IconButton
              sx={{
                color: '#666',
                padding: { xs: 0.5, sm: 1 },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <MoreVert sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton> */}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* PDF Export Options Dialog */}
      <Dialog open={pdfDialogOpen} onClose={handlePDFDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>PDF Export Options</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {/* Format Selection */}
            <FormControl fullWidth>
              <InputLabel>Page Format</InputLabel>
              <Select
                value={pdfOptions.format}
                label="Page Format"
                onChange={(e) => handlePDFOptionChange('format', e.target.value)}
              >
                <MenuItem value="presentation">Presentation (16:9)</MenuItem>
                <MenuItem value="a4">A4</MenuItem>
                <MenuItem value="letter">Letter</MenuItem>
              </Select>
            </FormControl>

            {/* Orientation Selection */}
            <FormControl component="fieldset">
              <FormLabel component="legend">Orientation</FormLabel>
              <RadioGroup
                value={pdfOptions.orientation}
                onChange={(e) => handlePDFOptionChange('orientation', e.target.value)}
                row
              >
                <FormControlLabel 
                  value="landscape" 
                  control={<Radio />} 
                  label="Landscape" 
                />
                <FormControlLabel 
                  value="portrait" 
                  control={<Radio />} 
                  label="Portrait" 
                />
              </RadioGroup>
            </FormControl>

            {/* Quality Slider */}
            <Box>
              <Typography gutterBottom>Image Quality</Typography>
              <Slider
                value={pdfOptions.quality}
                onChange={(e, value) => handlePDFOptionChange('quality', value)}
                min={0.1}
                max={1.0}
                step={0.1}
                marks={[
                  { value: 0.1, label: 'Low' },
                  { value: 0.5, label: 'Medium' },
                  { value: 1.0, label: 'High' }
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
              />
            </Box>

            {/* Margin Slider */}
            <Box>
              <Typography gutterBottom>Margin (mm)</Typography>
              <Slider
                value={pdfOptions.margin}
                onChange={(e, value) => handlePDFOptionChange('margin', value)}
                min={0}
                max={20}
                step={1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 10, label: '10' },
                  { value: 20, label: '20' }
                ]}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePDFDialogClose}>Cancel</Button>
          <Button onClick={handlePDFExportConfirm} variant="contained">
            Export PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}