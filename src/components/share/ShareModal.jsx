"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  Link as LinkIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { useShare } from '../../hooks/useShare';
import { useTheme } from '@mui/material/styles';

const ShareModal = ({ 
  open, 
  onClose, 
  shareData, 
  contentType = 'research',
  title = 'Share Content'
}) => {
  const theme = useTheme();
  const { shareResearch, shareChat, shareDocument, copyToClipboard, isLoading, error, shareResult } = useShare();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: true,
    allowComments: false,
    allowDownload: true,
    expiresAt: '',
    maxViews: '',
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Initialize form data when modal opens
  useEffect(() => {
    if (open && shareData) {
      setFormData({
        title: shareData.title || '',
        description: shareData.description || '',
        isPublic: true,
        allowComments: false,
        allowDownload: true,
        expiresAt: '',
        maxViews: '',
        tags: shareData.tags || []
      });
    }
  }, [open, shareData]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleShare = async () => {
    try {
      // Direct client-side sharing - no backend dependency
      const shareId = Math.random().toString(36).substring(2, 15);
      const frontendUrl = window.location.origin;
      
      if (contentType === 'research') {
        const shareUrl = `${frontendUrl}/shared/${contentType}/${shareId}`;
        
        // Store data in sessionStorage
        const shareDataToStore = {
          shareId,
          contentType,
          content: {
            ...shareData,
            title: formData.title || shareData.title,
            description: formData.description,
            tags: formData.tags
          },
          createdAt: new Date().toISOString()
        };
        
        sessionStorage.setItem(`share_${shareId}`, JSON.stringify(shareDataToStore));
        
        // Copy to clipboard
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareUrl);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        
        setSnackbar({
          open: true,
          message: 'Share created and link copied to clipboard!',
          severity: 'success'
        });
      } else {
        throw new Error('Only research content sharing is supported');
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to create share',
        severity: 'error'
      });
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      isPublic: true,
      allowComments: false,
      allowDownload: true,
      expiresAt: '',
      maxViews: '',
      tags: []
    });
    setNewTag('');
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: '500px'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShareIcon color="primary" />
            <Typography variant="h6">{title}</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Basic Information */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Basic Information
              </Typography>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={handleInputChange('title')}
                placeholder="Enter a title for your share"
                margin="dense"
              />
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                placeholder="Describe what you're sharing"
                multiline
                rows={2}
                margin="dense"
              />
            </Box>

            {/* Tags */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                >
                  Add
                </Button>
              </Box>
            </Box>

            <Divider />

            {/* Permissions */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Permissions & Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublic}
                      onChange={handleInputChange('isPublic')}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VisibilityIcon fontSize="small" />
                      <Typography variant="body2">Make public (anyone with link can view)</Typography>
                    </Box>
                  }
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.allowComments}
                      onChange={handleInputChange('allowComments')}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CommentIcon fontSize="small" />
                      <Typography variant="body2">Allow comments</Typography>
                    </Box>
                  }
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.allowDownload}
                      onChange={handleInputChange('allowDownload')}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DownloadIcon fontSize="small" />
                      <Typography variant="body2">Allow download</Typography>
                    </Box>
                  }
                />
              </Box>
            </Box>

            <Divider />

            {/* Advanced Options */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Advanced Options
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Expires At"
                  value={formData.expiresAt}
                  onChange={handleInputChange('expiresAt')}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScheduleIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  helperText="Leave empty for no expiration"
                />
                
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Views"
                  value={formData.maxViews}
                  onChange={handleInputChange('maxViews')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VisibilityIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  helperText="Leave empty for unlimited views"
                />
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            variant="contained"
            disabled={isLoading}
            startIcon={<ShareIcon />}
          >
            {isLoading ? 'Creating Share...' : 'Create Share'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
  );
};

export default ShareModal;
