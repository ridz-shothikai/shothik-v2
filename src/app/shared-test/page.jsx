"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  Public as PublicIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Sample research data for testing
const sampleResearchData = {
  shareId: 'test-share-123',
  contentType: 'research',
  content: {
    title: 'Sample Research: The Future of AI in Healthcare',
    query: 'What are the latest developments in AI healthcare applications?',
    content: `
# The Future of AI in Healthcare

## Introduction
Artificial Intelligence is revolutionizing healthcare with unprecedented speed and accuracy. This research explores the latest developments and their implications.

## Key Findings

### 1. Diagnostic Accuracy
AI systems are now achieving diagnostic accuracy rates of 95%+ in various medical imaging tasks, surpassing human radiologists in many cases.

### 2. Drug Discovery
Machine learning algorithms are accelerating drug discovery processes, reducing development time from years to months.

### 3. Personalized Medicine
AI enables personalized treatment plans based on individual patient data, genetic profiles, and lifestyle factors.

## Challenges and Considerations

- **Data Privacy**: Ensuring patient data security while leveraging AI capabilities
- **Regulatory Compliance**: Navigating complex healthcare regulations
- **Integration**: Seamlessly integrating AI tools into existing healthcare workflows

## Conclusion
The future of healthcare lies in the successful integration of AI technologies, but it requires careful consideration of ethical, legal, and technical challenges.
    `,
    sources: [
      {
        title: 'AI in Healthcare: Current Applications and Future Prospects',
        url: 'https://example.com/ai-healthcare-2024',
        resolved_url: 'https://example.com/ai-healthcare-2024'
      },
      {
        title: 'Machine Learning in Medical Diagnosis',
        url: 'https://example.com/ml-medical-diagnosis',
        resolved_url: 'https://example.com/ml-medical-diagnosis'
      },
      {
        title: 'The Ethics of AI in Healthcare',
        url: 'https://example.com/ai-healthcare-ethics',
        resolved_url: 'https://example.com/ai-healthcare-ethics'
      }
    ]
  },
  metadata: {
    title: 'Sample Research: The Future of AI in Healthcare',
    description: 'A comprehensive research report on AI applications in healthcare',
    tags: ['AI', 'Healthcare', 'Technology', 'Research'],
    createdAt: new Date().toISOString()
  },
  permissions: {
    isPublic: true,
    allowDownload: true,
    allowComments: false
  },
  currentViews: 42,
  createdAt: new Date().toISOString()
};

const SharedTestPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setShareData(sampleResearchData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (success) {
          alert('Link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link');
    }
  };

  const handleDownload = () => {
    // Simple download functionality
    const element = document.createElement('a');
    const file = new Blob([shareData.content.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${shareData.content.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!shareData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          No shared content found.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: 'background.default',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Minimal Header - Only essential info */}
      <Box sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: 2,
        px: 3
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                SHOTHIK AI
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Shared Research
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Copy Link">
                <IconButton onClick={handleCopyLink} size="small">
                  <CopyIcon />
                </IconButton>
              </Tooltip>
              
              {shareData.permissions?.allowDownload && (
                <Tooltip title="Download">
                  <IconButton onClick={handleDownload} size="small">
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area - This is where the red arrow points */}
      <Box sx={{ flex: 1, py: 0 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ 
            maxWidth: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: 3
          }}>
            {/* Research Title */}
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 2
              }}
            >
              {shareData.content.title || 'Research Results'}
            </Typography>
            
            {/* Research Query */}
            {shareData.content.query && (
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                gutterBottom
                sx={{ 
                  mb: 3,
                  fontStyle: 'italic'
                }}
              >
                Query: {shareData.content.query}
              </Typography>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            {/* Main Research Content - This is where the red arrow points */}
            <Box 
              sx={{ 
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  mt: 4,
                  mb: 2,
                  fontWeight: 600,
                  color: 'text.primary'
                },
                '& h1': { fontSize: '2rem' },
                '& h2': { fontSize: '1.75rem' },
                '& h3': { fontSize: '1.5rem' },
                '& h4': { fontSize: '1.25rem' },
                '& p': {
                  mb: 2,
                  lineHeight: 1.7,
                  fontSize: '1rem',
                  color: 'text.primary'
                },
                '& ul, & ol': {
                  mb: 2,
                  pl: 3
                },
                '& li': {
                  mb: 1,
                  lineHeight: 1.6
                },
                '& blockquote': {
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                  py: 1,
                  my: 2,
                  backgroundColor: 'action.hover',
                  fontStyle: 'italic'
                },
                '& code': {
                  backgroundColor: 'action.hover',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontFamily: 'monospace'
                },
                '& pre': {
                  backgroundColor: 'action.hover',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontFamily: 'monospace'
                }
              }}
              dangerouslySetInnerHTML={{ 
                __html: shareData.content.content.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, (match) => {
                  const level = match.trim().length;
                  return `<h${level}>`;
                }).replace(/\n/g, '</h' + '>') 
              }}
            />
            
            {/* Sources Section */}
            {shareData.content.sources && shareData.content.sources.length > 0 && (
              <Box sx={{ mt: 5 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    mb: 3,
                    color: 'text.primary'
                  }}
                >
                  Sources ({shareData.content.sources.length})
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1.5, 
                  mb: 3 
                }}>
                  {shareData.content.sources.map((source, index) => (
                    <Chip
                      key={index}
                      label={source.title || source.url}
                      variant="outlined"
                      size="medium"
                      onClick={() => window.open(source.url, '_blank')}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
      
      {/* Minimal Footer */}
      <Box sx={{ 
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 2,
        textAlign: 'center'
      }}>
        <Typography variant="body2" color="text.secondary">
          Shared with SHOTHIK AI • {shareData.currentViews} views • {new Date(shareData.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default SharedTestPage;
