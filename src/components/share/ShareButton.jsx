"use client";

import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider
} from '@mui/material';
import {
  Share as ShareIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon,
  Settings as SettingsIcon,
  Public as PublicIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import ShareModal from './ShareModal';
import { useShare } from '../../hooks/useShare';

const ShareButton = ({ 
  shareData, 
  contentType = 'research',
  title = 'Share',
  variant = 'icon', // 'icon', 'button', 'menu'
  size = 'medium',
  onShare,
  disabled = false
}) => {
  const theme = useTheme();
  const { shareResearch, shareChat, shareDocument, copyToClipboard, isLoading } = useShare();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [quickShareLoading, setQuickShareLoading] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (variant === 'menu') {
      setAnchorEl(event.currentTarget);
    } else {
      handleQuickShare();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleQuickShare = async () => {
    setQuickShareLoading(true);
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
          content: shareData,
          createdAt: new Date().toISOString()
        };
        
        sessionStorage.setItem(`share_${shareId}`, JSON.stringify(shareDataToStore));
        
        // Copy the shareable URL to clipboard
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
        
        // Open the proper shareable URL directly
        window.open(shareUrl, '_blank');
        
        alert('Share link copied to clipboard and opened in new tab!');
        
        if (onShare) {
          onShare({ data: { shareUrl } });
        }
      } else {
        throw new Error('Only research content sharing is supported');
      }
    } catch (error) {
      console.error('Share failed:', error);
      alert(`Failed to create share link: ${error.message}`);
    } finally {
      setQuickShareLoading(false);
    }
  };

  const handleAdvancedShare = () => {
    setShareModalOpen(true);
    handleClose();
  };

  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href;
      await copyToClipboard(currentUrl);
      handleClose();
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShareModalClose = () => {
    setShareModalOpen(false);
  };

  const renderIconButton = () => (
    <IconButton
      onClick={handleClick}
      disabled={disabled || isLoading || quickShareLoading}
      size={size}
      sx={{
        color: theme.palette.text.secondary,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.primary.main,
        },
      }}
    >
      <ShareIcon fontSize={size === 'small' ? 'small' : 'medium'} />
    </IconButton>
  );

  const renderButton = () => (
    <Box
      onClick={handleClick}
      disabled={disabled || isLoading || quickShareLoading}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: '8px 16px',
        borderRadius: 1,
        cursor: disabled || isLoading || quickShareLoading ? 'not-allowed' : 'pointer',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        opacity: disabled || isLoading || quickShareLoading ? 0.6 : 1,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      <ShareIcon fontSize="small" />
      <Typography variant="body2">
        {isLoading || quickShareLoading ? 'Sharing...' : title}
      </Typography>
    </Box>
  );

  const renderMenu = () => (
    <>
      {renderIconButton()}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1,
          }
        }}
      >
        <MenuItem onClick={handleQuickShare} disabled={isLoading || quickShareLoading}>
          <ListItemIcon>
            <PublicIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Quick Share" 
            secondary="Share publicly with default settings"
          />
        </MenuItem>
        
        <MenuItem onClick={handleAdvancedShare}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Advanced Share" 
            secondary="Customize sharing options"
          />
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Copy Page Link" 
            secondary="Copy current page URL"
          />
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <>
      {variant === 'menu' ? renderMenu() : variant === 'button' ? renderButton() : renderIconButton()}
      
      <ShareModal
        open={shareModalOpen}
        onClose={handleShareModalClose}
        shareData={shareData}
        contentType={contentType}
        title={`Share ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`}
      />
    </>
  );
};

export default ShareButton;
