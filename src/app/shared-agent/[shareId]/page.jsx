"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import {
  useLazyVerifySharedAgentQuery,
  useCreateAgentReplicaMutation,
} from "../../../redux/api/shareAgent/shareAgentApi";
import { useSelector, useDispatch } from "react-redux";
import { setShowLoginModal } from "../../../redux/slice/auth";

const SharedAgentPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { shareId } = params;

  const [password, setPassword] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [sharedData, setSharedData] = useState(null);

  const { accessToken, user } = useSelector((state) => state.auth);
  const isAuthenticated = !!accessToken;
  const dispatch = useDispatch();

  const [verifySharedAgent, { isLoading, data, error: verifyError }] =
    useLazyVerifySharedAgentQuery();
  const [createReplica, { isLoading: isCreatingReplica }] =
    useCreateAgentReplicaMutation();

  useEffect(() => {
    console.log('Component mounted, auth state:', { accessToken, isAuthenticated, user });
    if (shareId) {
      loadSharedAgent();
    }
  }, [shareId]);

  // Debug auth state changes
  useEffect(() => {
    console.log('Auth state changed:', { accessToken, isAuthenticated, user });
  }, [accessToken, isAuthenticated, user]);

  useEffect(() => {
    if (verifyError) {
      const errorData = verifyError?.data;
      if (errorData?.requiresPassword) {
        setPasswordDialogOpen(true);
      } else if (errorData?.requiresAuth) {
        setError("Please sign in to view this shared content");
      } else {
        setError(errorData?.error || "Failed to load shared content");
      }
    }
  }, [verifyError]);

  useEffect(() => {
    if (data?.success) {
      setSharedData(data.data);
      setError(null);
    }
  }, [data]);


  const loadSharedAgent = async () => {
    try {
      await verifySharedAgent({ shareId, password: password || undefined }).unwrap();
    } catch (err) {
      console.error("Error loading shared agent:", err);
    }
  };

  const handlePasswordSubmit = () => {
    if (!password) {
      setError("Password is required");
      return;
    }
    setPasswordDialogOpen(false);
    loadSharedAgent();
  };

  const handleSaveAsCopy = async () => {
    console.log('Save as Copy clicked:', { 
      accessToken, 
      isAuthenticated, 
      user, 
      shareId,
      authState: { accessToken, isAuthenticated, user }
    });
    
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, opening login modal');
      // Open the login modal instead of redirecting
      dispatch(setShowLoginModal(true));
      return;
    }

    console.log('User authenticated, creating replica and redirecting to research page');
    
    try {
      // Create replica first
      const response = await createReplica({
        sharedAgentId: sharedData.agent._id,
        currentUserId: user?.id,
        source: "shared_link",
        metadata: {
          sharedBy: sharedData.shareInfo.sharedBy,
          shareType: sharedData.shareInfo.visibility,
          originalShareId: shareId,
        },
      }).unwrap();

      console.log('Replica creation response:', response);

      if (response.success) {
        // Redirect to the research page with the new agent ID
        router.push(`/agents/research?id=${response.newAgentId}`);
      } else {
        setError(response.message || "Failed to create copy. This feature is coming soon.");
      }
    } catch (err) {
      console.error("Error creating replica:", err);
      setError(err?.data?.message || "Failed to create a copy. This feature is coming soon.");
    }
  };



  // Function to process markdown content to HTML
  const processMarkdownContent = (content) => {
    if (!content) return '';
    
    let processed = content
      // Remove reference links
      ?.replace(/<span[^>]*class="reference-link"[^>]*>.*?<\/span>/g, '')
      // Convert [1], [2], etc. to superscript
      ?.replace(/\[(\d+)\]/g, '<sup>$1</sup>')
      // Convert markdown headers
      ?.replace(/^### (.*$)/gim, '<h3>$1</h3>')
      ?.replace(/^## (.*$)/gim, '<h2>$1</h2>')
      ?.replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Convert markdown bold
      ?.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Convert markdown italic (but not bullet points)
      ?.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
      // Split into lines for processing
      ?.split('\n');
    
    // Process each line
    let htmlLines = [];
    let inList = false;
    
    for (let i = 0; i < processed.length; i++) {
      const line = processed[i].trim();
      
      if (line.startsWith('* ') && !line.startsWith('**')) {
        // Start of a list
        if (!inList) {
          htmlLines.push('<ul>');
          inList = true;
        }
        htmlLines.push(`<li>${line.substring(2)}</li>`);
      } else {
        // End of list
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
        
        if (line) {
          htmlLines.push(`<p>${line}</p>`);
        }
      }
    }
    
    // Close any remaining list
    if (inList) {
      htmlLines.push('</ul>');
    }
    
    return htmlLines.join('');
  };


  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={50} />
        <Typography color="text.secondary">Loading shared content...</Typography>
      </Box>
    );
  }

  if (error && !passwordDialogOpen) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => router.push("/")}>
              Go Home
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!sharedData) {
    return null;
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/")}
            sx={{ mb: 2 }}
          >
            Back to Home
          </Button>

          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box flex={1}>
                <Typography variant="h4" gutterBottom fontWeight={600}>
                  Shared AI Research
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Shared by: {sharedData.shareInfo.sharedBy.name}
                  </Typography>
                </Box>
                {sharedData.shareInfo.message && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    {sharedData.shareInfo.message}
                  </Alert>
                )}
              </Box>

              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  icon={<VisibilityIcon />}
                  label={sharedData.shareInfo.visibility}
                  color={sharedData.shareInfo.visibility === "public" ? "primary" : "default"}
                  size="small"
                />
                {sharedData.shareInfo.views !== null && (
                  <Chip
                    label={`${sharedData.shareInfo.views} views`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box display="flex" gap={1} flexWrap="wrap" mt={3}>
              <Button
                variant="contained"
                startIcon={isCreatingReplica ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={() => {
                  console.log('Button clicked - before handleSaveAsCopy');
                  handleSaveAsCopy();
                }}
                disabled={isCreatingReplica}
              >
                {isCreatingReplica ? "Saving..." : "Save as Copy to My Chat"}
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Research Content Display - Matching Research Agent Page Design */}
        <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
          {sharedData.agent.type === "research" ? (
            <Box>
              {/* Main Title */}
              {sharedData.agent.title && (
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    color: 'text.primary',
                    textAlign: 'center'
                  }}
                >
                  {sharedData.agent.title}
                </Typography>
              )}

              {/* Research Content */}
              <Box 
                sx={{ 
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    fontWeight: 600,
                    marginBottom: 2,
                    marginTop: 4,
                    color: 'text.primary',
                    fontSize: '1.25rem'
                  },
                  '& h1': { fontSize: '2rem' },
                  '& h2': { fontSize: '1.5rem' },
                  '& h3': { fontSize: '1.25rem' },
                  '& p': {
                    marginBottom: 2,
                    lineHeight: 1.8,
                    color: 'text.primary',
                    fontSize: '1rem',
                    textAlign: 'justify'
                  },
                  '& strong, & b': {
                    fontWeight: 600,
                    color: 'text.primary'
                  },
                  '& em, & i': {
                    fontStyle: 'italic'
                  },
                  '& ul, & ol': {
                    paddingLeft: 3,
                    marginBottom: 2,
                    marginTop: 1
                  },
                  '& li': {
                    marginBottom: 1,
                    lineHeight: 1.6,
                    listStyleType: 'disc',
                    marginLeft: 1
                  },
                  '& blockquote': {
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    paddingLeft: 2,
                    marginLeft: 0,
                    marginBottom: 2,
                    fontStyle: 'italic',
                    color: 'text.secondary'
                  },
                  '& code': {
                    backgroundColor: 'grey.100',
                    padding: '2px 4px',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  },
                  '& pre': {
                    backgroundColor: 'grey.100',
                    padding: 2,
                    borderRadius: 1,
                    overflow: 'auto',
                    marginBottom: 2
                  },
                  '& a': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  },
                  // Style inline citations like [1], [2], etc.
                  '& sup': {
                    fontSize: '0.75rem',
                    color: 'primary.main',
                    fontWeight: 600,
                    marginLeft: '2px'
                  },
                  // Hide raw HTML elements and show only content
                  '& span[class*="reference-link"]': {
                    display: 'none'
                  }
                }}
                dangerouslySetInnerHTML={{
                  __html: processMarkdownContent(sharedData.agent.content)
                }}
              />

              {/* Sources Section - Matching Research Agent Page */}
              {sharedData.agent.sources && sharedData.agent.sources.length > 0 && (
                <Box mt={6}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 3,
                      color: 'text.primary'
                    }}
                  >
                    References
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 2
                  }}>
                    {sharedData.agent.sources.slice(0, 6).map((source, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' },
                          minWidth: { xs: '100%', md: 'calc(50% - 8px)' },
                          p: 2,
                          border: '1px solid',
                          borderColor: 'grey.300',
                          borderRadius: 2,
                          backgroundColor: 'grey.50',
                          '&:hover': {
                            backgroundColor: 'grey.100'
                          }
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Box 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              borderRadius: '50%', 
                              backgroundColor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Typography variant="caption" sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>
                              {index + 1}
                            </Typography>
                          </Box>
                          <Typography 
                            variant="body2" 
                            fontWeight={600} 
                            color="text.primary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {source.title || source.domain || `Source ${index + 1}`}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%'
                          }}
                        >
                          {source.url || source.domain || 'No URL available'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {sharedData.agent.sources.length > 6 && (
                    <Typography 
                      variant="body2" 
                      color="primary.main" 
                      sx={{ 
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        mb: 3
                      }}
                    >
                      +{sharedData.agent.sources.length - 6} more sources available
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          ) : sharedData.agent.messages ? (
            // Regular agent messages display
            sharedData.agent.messages.map((message, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  mb: 2,
                  bgcolor: message.role === "user" ? "grey.50" : "background.paper",
                  borderLeft: message.role === "user" ? "4px solid" : "4px solid",
                  borderColor: message.role === "user" ? "primary.main" : "success.main",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Chip
                    label={message.role === "user" ? "You" : "AI Assistant"}
                    size="small"
                    color={message.role === "user" ? "primary" : "success"}
                  />
                </Box>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {typeof message.content === "string"
                    ? message.content
                    : message.content?.message ||
                      message.content?.data?.content ||
                      JSON.stringify(message.content, null, 2)}
                </Typography>
              </Paper>
            ))
          ) : (
            <Alert severity="info">No content available</Alert>
          )}
        </Box>


        {/* Footer Info */}
        <Box mt={4} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Shared on {new Date(sharedData.shareInfo.createdAt).toLocaleDateString()} via Shothik
            AI
          </Typography>
        </Box>
      </Container>

      {/* Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Password Required</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            This shared content is password protected. Please enter the password to continue.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => router.push("/")}>Cancel</Button>
          <Button onClick={handlePasswordSubmit} variant="contained" disabled={!password}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SharedAgentPage;

