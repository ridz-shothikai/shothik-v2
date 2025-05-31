import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import TableChartIcon from '@mui/icons-material/TableChart';
import DownloadIcon from '@mui/icons-material/Download';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import PreviewIcon from '@mui/icons-material/Preview';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CircularProgress from '@mui/material/CircularProgress';
// New imports for 7-agent system
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PaletteIcon from '@mui/icons-material/Palette';
import { useAgentContext } from './shared/AgentContextProvider';
import PreferenceCollectionPanel from './shared/PreferenceCollectionPanel';
import QualityValidationPanel from './shared/QualityValidationPanel';
import PlanningProgressIndicator from './shared/PlanningProgressIndicator';
import InteractiveChatMessage from './shared/InteractiveChatMessage';

const PRIMARY_GREEN = '#07B37A';

const NAVIGATION_ITEMS = [
  { id: 'slides', label: 'AI Slides', icon: <SlideshowIcon />, isNew: true },
  { id: 'sheets', label: 'AI Sheets', icon: <TableChartIcon />, isNew: true },
  { id: 'download', label: 'Download For Me', icon: <DownloadIcon />, isNew: true },
  { id: 'chat', label: 'AI Chat', icon: <ChatIcon /> },
  { id: 'call', label: 'Call For Me', icon: <PhoneIcon /> },
  { id: 'agents', label: 'All Agents', icon: <GroupIcon /> },
];

export default function AgentPage({ specificAgent }) {
  const router = useRouter();
  const { agentType, setAgentType } = useAgentContext();
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewTab, setPreviewTab] = useState('preview');
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(5);
  const [selectedNavItem, setSelectedNavItem] = useState('chat');
  
  // New state for 7-agent system
  const [currentPhase, setCurrentPhase] = useState('planning');
  const [completedPhases, setCompletedPhases] = useState([]);
  const [userPreferences, setUserPreferences] = useState(null);
  const [showPreferenceCollection, setShowPreferenceCollection] = useState(false);
  const [qualityMetrics, setQualityMetrics] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [presentationBlueprint, setPresentationBlueprint] = useState(null);
  
  const chatEndRef = useRef(null);

  // Use specific agent if provided, otherwise use context
  const currentAgentType = specificAgent || agentType;

  useEffect(() => {
    if (specificAgent && specificAgent !== agentType) {
      setAgentType(specificAgent);
    }
  }, [specificAgent, agentType]);

  // Set selected nav item based on agent type
  useEffect(() => {
    if (currentAgentType === 'presentation') {
      setSelectedNavItem('slides');
    } else {
      setSelectedNavItem('chat');
    }
  }, [currentAgentType]);

  // Process initial prompt from sessionStorage
  useEffect(() => {
    const initialPrompt = sessionStorage.getItem('initialPrompt');
    if (initialPrompt && specificAgent) {
      sessionStorage.removeItem('initialPrompt');
      setInputValue(initialPrompt);
      // Auto-send the initial prompt
      setTimeout(() => {
        handleSend(initialPrompt);
      }, 500);
    }
  }, [specificAgent]);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      // Force re-render on window resize to adjust scroll areas
      if (chatEndRef.current) {
        setTimeout(() => {
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [chatHistory]);

  const handleSend = async (promptText) => {
    const prompt = promptText || inputValue;
    if (!prompt.trim() || isLoading) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate the 7-agent workflow for presentation agent
    if (currentAgentType === 'presentation') {
      await simulateSevenAgentWorkflow(prompt);
    } else {
      // Regular agent response
      setTimeout(() => {
        const agentMessage = {
          id: Date.now() + 2,
          sender: 'agent',
          content: `I'm processing your request: "${prompt}"`,
          agentName: 'Super Agent',
          timestamp: new Date(),
        };
        
        setChatHistory(prev => [...prev, agentMessage]);
        setIsLoading(false);
      }, 2000);
    }
  };

  const simulateSevenAgentWorkflow = async (prompt) => {
    // Phase 1: Planning & Analysis
    setCurrentPhase('planning');
    const plannerMessage = {
      id: Date.now() + 1,
      sender: 'agent',
      agentName: 'Planner Agent',
      content: "I'm analyzing your presentation requirements and creating a blueprint...",
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, plannerMessage]);

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show blueprint preview
    const blueprint = {
      slideCount: 8,
      duration: 15,
      structure: 'Problem-Solution Framework'
    };
    setPresentationBlueprint(blueprint);

    const blueprintMessage = {
      id: Date.now() + 2,
      sender: 'agent',
      agentName: 'Planner Agent',
      type: 'blueprint_preview',
      content: "Here's your presentation blueprint. Would you like to proceed?",
      blueprint: blueprint,
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, blueprintMessage]);
    setCompletedPhases(['planning']);

    // Phase 2: Preference Collection
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentPhase('preferences');
    
    const preferenceMessage = {
      id: Date.now() + 3,
      sender: 'agent',
      agentName: 'Interactive Chat System',
      type: 'preference_request',
      content: "Let's customize your presentation design. Please set your preferences:",
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, preferenceMessage]);
  };

  const handleChatResponse = async (messageId, response) => {
    if (response === 'approve') {
      // Continue to preference collection
      setShowPreferenceCollection(true);
    } else if (response === 'revise') {
      // Handle blueprint revision
      const revisionMessage = {
        id: Date.now(),
        sender: 'agent',
        content: "What changes would you like to make to the blueprint?",
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, revisionMessage]);
    }
  };

  const handlePreferenceUpdate = (preferences) => {
    setUserPreferences(preferences);
  };

  const handlePreferenceComplete = async (preferences) => {
    setUserPreferences(preferences);
    setCompletedPhases(['planning', 'preferences']);
    setCurrentPhase('content');

    // Continue with content generation
    const contentMessage = {
      id: Date.now(),
      sender: 'agent',
      agentName: 'Content Generation Agent',
      content: "Now generating content based on your preferences and requirements...",
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, contentMessage]);

    // Simulate content generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCompletedPhases(['planning', 'preferences', 'content']);
    setCurrentPhase('design');

    const designMessage = {
      id: Date.now() + 1,
      sender: 'agent',
      agentName: 'Design & Media Agents',
      content: "Applying your custom design preferences and selecting media...",
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, designMessage]);

    // Simulate design phase
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCompletedPhases(['planning', 'preferences', 'content', 'design']);
    setCurrentPhase('validation');
    setIsValidating(true);

    const validationMessage = {
      id: Date.now() + 2,
      sender: 'agent',
      agentName: 'Validator/QA Agent',
      content: "Running quality validation and compliance checks...",
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, validationMessage]);

    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsValidating(false);
    setCompletedPhases(['planning', 'preferences', 'content', 'design', 'validation']);
    
    const qualityResults = {
      overall: 0.87,
      contentAccuracy: 0.90,
      designQuality: 0.85,
      requirementCompliance: 0.92,
      accessibility: 0.80,
      performance: 0.88
    };
    setQualityMetrics(qualityResults);

    const qualityMessage = {
      id: Date.now() + 3,
      sender: 'agent',
      agentName: 'Validator/QA Agent',
      type: 'quality_feedback',
      content: "Quality validation complete! Your presentation scored 87% overall.",
      qualityScore: 0.87,
      suggestions: [
        "Consider adding more visual elements",
        "Improve color contrast for accessibility"
      ],
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, qualityMessage]);
    setIsLoading(false);
  };

  const handleNavItemClick = (itemId) => {
    setSelectedNavItem(itemId);
    if (itemId === 'slides') {
      router.push('/agents/presentation');
    } else if (itemId === 'chat') {
      router.push('/agents/super');
    }
  };

  const handleApplyAutoFixes = () => {
    // Simulate auto-fixes
    const fixMessage = {
      id: Date.now(),
      sender: 'agent',
      agentName: 'Validator/QA Agent',
      content: "Applying automatic improvements to your presentation...",
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, fixMessage]);
  };

  const handleRegenerateWithFeedback = () => {
    // Simulate regeneration
    const regenMessage = {
      id: Date.now(),
      sender: 'agent',
      agentName: 'Content Generation Agent',
      content: "Regenerating presentation with quality feedback...",
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, regenMessage]);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'white',
      color: '#333',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Fixed Header */}
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px', // Set specific height
        bgcolor: 'white',
        borderBottom: '1px solid #e0e0e0',
        zIndex: 1001,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center', // Center content vertically
      }}>
        <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: '100%',
          }}>
            <IconButton 
              onClick={() => router.push('/agents')}
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
              flex: 1, // Take remaining space
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

      {/* Content Area - Adjusted for fixed header and bottom input */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        overflow: 'hidden', 
        height: 'calc(100vh - 220px)', // 80px header + 140px bottom input
        marginTop: '80px', // Exact header height
        marginBottom: '140px', // Space for fixed bottom input
      }}>
        {/* Left Side - Chat Area */}
        <Box sx={{ 
          flex: { xs: 1, md: 1 }, 
          display: 'flex', 
          flexDirection: 'column',
          borderRight: { xs: 'none', md: '1px solid #e0e0e0' },
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Planning Progress - Fixed at top for presentation agent */}
          {currentAgentType === 'presentation' && chatHistory.length > 0 && (
            <Box sx={{ 
              flexShrink: 0,
              bgcolor: '#f8f9fa',
              borderBottom: '1px solid #e0e0e0',
              p: 2,
              position: 'sticky',
              top: 0,
              zIndex: 100, // Below fixed header (1001) but above content
            }}>
              <PlanningProgressIndicator
                currentPhase={currentPhase}
                completedPhases={completedPhases}
                estimatedTimeRemaining={isLoading ? "2-3 minutes" : null}
              />
            </Box>
          )}

          {/* Chat Messages - Independently scrollable */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            overflowX: 'hidden',
            bgcolor: '#f8f9fa',
            height: '100%',
            position: 'relative',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '4px',
              '&:hover': {
                background: '#a8a8a8',
              },
            },
            // Firefox scrollbar styling
            scrollbarWidth: 'thin',
            scrollbarColor: '#c1c1c1 #f1f1f1',
          }}>
            <Box sx={{ p: 3, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
              {chatHistory.length === 0 && (
                <Box sx={{ 
                  textAlign: 'center', 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  minHeight: '400px'
                }}>
                  <SmartToyIcon sx={{ fontSize: 64, color: '#ddd', mb: 2 }} />
                  <Typography color="#666">
                    Start a conversation with {currentAgentType === 'presentation' ? 'Presentation Agent' : 'Super Agent'}
                  </Typography>
                </Box>
              )}

              {/* Chat Messages */}
              <Box sx={{ flexGrow: 1, pb: 4 }}>
                {chatHistory.map((message) => (
                  <InteractiveChatMessage
                    key={message.id}
                    message={message}
                    onResponse={handleChatResponse}
                    onPreferenceUpdate={handlePreferenceUpdate}
                  />
                ))}

                {/* Show preference collection when needed */}
                {showPreferenceCollection && (
                  <Box sx={{ mb: 3 }}>
                    <PreferenceCollectionPanel
                      onPreferencesUpdate={handlePreferenceUpdate}
                      onComplete={handlePreferenceComplete}
                    />
                  </Box>
                )}
              </Box>

              <div ref={chatEndRef} />
            </Box>

            {/* Scroll fade indicator for chat */}
            {chatHistory.length > 3 && (
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '20px',
                background: 'linear-gradient(transparent, rgba(248, 249, 250, 0.8))',
                pointerEvents: 'none',
                zIndex: 10, // Lower than fixed elements
              }} />
            )}
          </Box>
        </Box>

        {/* Right Side - Preview Panel (Completely Independent) */}
        <Box sx={{ 
          width: { xs: '0px', md: '40%' }, 
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          bgcolor: 'white',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Preview Tabs - Fixed at top */}
          <Box sx={{ 
            borderBottom: '1px solid #e0e0e0', 
            px: 2,
            flexShrink: 0,
            bgcolor: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 100, // Below fixed header (1001) but above content, consistent with progress indicator
          }}>
            <Tabs 
              value={previewTab} 
              onChange={(e, v) => setPreviewTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                '& .MuiTabs-indicator': { bgcolor: PRIMARY_GREEN },
                '& .Mui-selected': { color: PRIMARY_GREEN },
                '& .MuiTab-root': { color: '#666', minWidth: 'auto', px: 1 },
              }}
            >
              <Tab icon={<PreviewIcon />} label="Preview" value="preview" />
              <Tab icon={<AssignmentTurnedInIcon />} label="Blueprint" value="blueprint" />
              <Tab icon={<FactCheckIcon />} label="Quality" value="quality" />
              <Tab icon={<PaletteIcon />} label="Preferences" value="preferences" />
              <Tab icon={<CodeIcon />} label="Code" value="code" />
              <Tab icon={<PsychologyIcon />} label="Thinking" value="thinking" />
            </Tabs>
          </Box>

          {/* Preview Content - Independently scrollable */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            overflowX: 'hidden',
            height: '100%',
            position: 'relative',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '4px',
              '&:hover': {
                background: '#a8a8a8',
              },
            },
            // Firefox scrollbar styling
            scrollbarWidth: 'thin',
            scrollbarColor: '#c1c1c1 #f1f1f1',
          }}>
            <Box sx={{ p: 3, minHeight: '100%', pb: 6 }}>
              {previewTab === 'preview' && (
                <Box>
                  {currentAgentType === 'presentation' ? (
                    <>
                      <Box sx={{ 
                        mb: 2, 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <Typography variant="h6" color="#333">Your Presentation</Typography>
                        <Typography color="#666">
                          {currentSlide} / {totalSlides}
                        </Typography>
                      </Box>
                      <Card sx={{ 
                        bgcolor: userPreferences ? userPreferences.customColors[0] + '10' : '#f8f9fa', 
                        height: 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #e0e0e0',
                        boxShadow: 1,
                        mb: 4,
                      }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ 
                            color: userPreferences?.customColors[0] || PRIMARY_GREEN, 
                            mb: 2 
                          }}>
                            {presentationBlueprint ? 'Your Custom Presentation' : 'Your Presentation Title'}
                          </Typography>
                          <Typography variant="h6" color="#666">
                            {presentationBlueprint ? `${presentationBlueprint.slideCount} slides • ${presentationBlueprint.duration} minutes` : 'Content will appear here'}
                          </Typography>
                          {userPreferences && (
                            <Chip
                              label={`${userPreferences.style} style`}
                              sx={{ 
                                mt: 2,
                                bgcolor: userPreferences.customColors[0] || PRIMARY_GREEN,
                                color: 'white'
                              }}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                      <Typography color="#666">
                        Agent output will appear here
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {previewTab === 'blueprint' && (
                <Box sx={{ pb: 4 }}>
                  {presentationBlueprint ? (
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Presentation Blueprint</Typography>
                        <Typography><strong>Slides:</strong> {presentationBlueprint.slideCount}</Typography>
                        <Typography><strong>Duration:</strong> {presentationBlueprint.duration} minutes</Typography>
                        <Typography><strong>Structure:</strong> {presentationBlueprint.structure}</Typography>
                      </CardContent>
                    </Card>
                  ) : (
                    <Typography color="#666">Blueprint will appear after planning phase</Typography>
                  )}
                </Box>
              )}

              {previewTab === 'quality' && (
                <Box sx={{ pb: 4 }}>
                  {qualityMetrics ? (
                    <QualityValidationPanel
                      qualityMetrics={qualityMetrics}
                      validationResult={validationResult}
                      isValidating={isValidating}
                      onApplyAutoFixes={handleApplyAutoFixes}
                      onRegenerateWithFeedback={handleRegenerateWithFeedback}
                    />
                  ) : (
                    <Typography color="#666">Quality metrics will appear after validation</Typography>
                  )}
                </Box>
              )}

              {previewTab === 'preferences' && (
                <Box sx={{ pb: 4 }}>
                  {userPreferences ? (
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>User Preferences</Typography>
                        <Typography><strong>Style:</strong> {userPreferences.style}</Typography>
                        <Typography><strong>Animation:</strong> {userPreferences.animation}</Typography>
                        <Typography><strong>Audience:</strong> {userPreferences.audienceLevel}</Typography>
                        <Typography><strong>Duration:</strong> {userPreferences.duration} minutes</Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography><strong>Colors:</strong></Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            {userPreferences.customColors.map((color, index) => (
                              <Box
                                key={index}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: color,
                                  borderRadius: 1,
                                  border: '1px solid #ddd'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ) : (
                    <Typography color="#666">Preferences will appear after collection</Typography>
                  )}
                </Box>
              )}

              {previewTab === 'code' && (
                <Box sx={{ pb: 4 }}>
                  <pre style={{ 
                    backgroundColor: '#f8f9fa', 
                    color: '#333',
                    padding: 16,
                    borderRadius: 8,
                    overflow: 'auto',
                    border: '1px solid #e0e0e0',
                  }}>
{`// Generated presentation code
const presentation = {
  type: "${currentAgentType}",
  blueprint: ${JSON.stringify(presentationBlueprint, null, 2)},
  preferences: ${JSON.stringify(userPreferences, null, 2)},
  quality: ${JSON.stringify(qualityMetrics, null, 2)}
};`}
                  </pre>
                </Box>
              )}

              {previewTab === 'thinking' && (
                <Box sx={{ pb: 4 }}>
                  <Typography variant="body2" color="#666" paragraph>
                    Current Phase: {currentPhase}
                  </Typography>
                  <Typography variant="body2" color="#666" paragraph>
                    Completed: {completedPhases.join(', ')}
                  </Typography>
                  <Typography variant="body2" color="#666" paragraph>
                    The 7-agent system is working collaboratively to create your presentation:
                    Planner → Preferences → Content → Structure → Media → Design → Validation
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Scroll fade indicator for preview */}
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '20px',
              background: 'linear-gradient(transparent, rgba(255, 255, 255, 0.8))',
              pointerEvents: 'none',
              zIndex: 10, // Lower than fixed elements, consistent with chat fade
            }} />
          </Box>
        </Box>
      </Box>

      {/* Fixed Input Area */}
      <Box sx={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'white',
        borderTop: '1px solid #e0e0e0',
        zIndex: 1002,
        py: 2,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            bgcolor: '#f8f9fa',
            borderRadius: 4,
            p: 3,
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder={currentAgentType === 'presentation' 
                  ? "Create a presentation about..." 
                  : "Ask anything, create anything..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'transparent',
                    color: '#333',
                    fontSize: '1.1rem',
                    border: 'none',
                    '& fieldset': {
                      border: 'none',
                    },
                    '& input': {
                      color: '#333',
                    },
                    '& textarea': {
                      color: '#333',
                    },
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#999',
                    opacity: 1,
                  },
                }}
              />
              <IconButton sx={{ color: '#666', '&:hover': { color: PRIMARY_GREEN } }}>
                <MicIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Button
                startIcon={<PersonIcon />}
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  '&:hover': {
                    color: PRIMARY_GREEN,
                    bgcolor: 'rgba(7, 179, 122, 0.1)',
                  }
                }}
              >
                Personalize
              </Button>
              
              <IconButton 
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isLoading}
                sx={{ 
                  bgcolor: PRIMARY_GREEN,
                  color: 'white',
                  width: 40,
                  height: 40,
                  '&:hover': { 
                    bgcolor: '#06A36D',
                  },
                  '&.Mui-disabled': { 
                    bgcolor: '#ddd',
                    color: '#999',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 