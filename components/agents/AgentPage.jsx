/* eslint-disable react-hooks/exhaustive-deps */
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
import { useFetchLogsQuery, useFetchSlidesQuery } from '../../src/redux/api/presentation/presentationApi';

const PRIMARY_GREEN = '#07B37A';

const NAVIGATION_ITEMS = [
  { id: 'slides', label: 'AI Slides', icon: <SlideshowIcon />, isNew: true },
  { id: 'sheets', label: 'AI Sheets', icon: <TableChartIcon />, isNew: true },
  { id: 'download', label: 'Download For Me', icon: <DownloadIcon />, isNew: true },
  { id: 'chat', label: 'AI Chat', icon: <ChatIcon /> },
  { id: 'call', label: 'Call For Me', icon: <PhoneIcon /> },
  { id: 'agents', label: 'All Agents', icon: <GroupIcon /> },
];

// Defines the order of phases for progress tracking.
const PHASES_ORDER = ['planning', 'preferences', 'content', 'design', 'validation'];

// Helper function to determine the most recent phase based on the order.
const getLatestPhase = (completedPhasesSet) => {
  return PHASES_ORDER.slice().reverse().find(phase => completedPhasesSet.has(phase)) || null;
};


export default function AgentPage({ specificAgent, presentationId }) {
  const router = useRouter();
  const { agentType, setAgentType } = useAgentContext();
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewTab, setPreviewTab] = useState('preview');
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(5);
  const [selectedNavItem, setSelectedNavItem] = useState('chat');
  
  // State for the presentation generation progress
  const [currentPhase, setCurrentPhase] = useState('planning');
  const [completedPhases, setCompletedPhases] = useState([]);
  const [userPreferences, setUserPreferences] = useState(null);
  const [qualityMetrics, setQualityMetrics] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [presentationBlueprint, setPresentationBlueprint] = useState(null);
  const [shouldPollLogs, setShouldPollLogs] = useState(true);

  // state for slides
  const [slideTabs, setSlideTabs] = useState({});
  const [shouldPollSlides, setShouldPollSlides] = useState(true);
  
  const chatEndRef = useRef(null);

  // ========== REDUX ==========
  // Fetching logs - only when we have a presentationId
  const { 
    data: logsData, 
    isLoading: logsLoading, 
    error: logsError 
  } = useFetchLogsQuery(presentationId, {
    skip: !presentationId,
    pollingInterval: shouldPollLogs ? 5000 : 0, // Poll every 5 seconds
  });

  useEffect(() => {
    if (logsData?.status === 'completed' || logsData?.status === 'failed') {
      setShouldPollLogs(false);
    }
  }, [logsData?.status]);
  
  // Filter logs for chat display, excluding browser and slide generator outputs.
  const realLogs = logsData?.data?.filter(
    log =>
      log.agent_name !== 'browser_agent' &&
      log.agent_name !== 'slide_generator_agent' &&
      log.parsed_output
  ) || [];

  // Fetch slides - only when we have a presentationId  
  const { 
    data: slidesData, 
    isLoading: slidesLoading, 
    error: slidesError 
  } = useFetchSlidesQuery(presentationId, {
    skip: !presentationId,
    pollingInterval: shouldPollSlides ? 10000 : 0, // Poll every 10 seconds when status is processing
  });

  useEffect(() => {
    if (slidesData?.status === 'completed' || slidesData?.status === 'failed') {
      setShouldPollSlides(false);
    }
  }, [slidesData?.status]);

  const currentAgentType = specificAgent || agentType;

  useEffect(() => {
    if (specificAgent && specificAgent !== agentType) {
      setAgentType(specificAgent);
    }
  }, [specificAgent, agentType, setAgentType]);

  useEffect(() => {
    if (currentAgentType === 'presentation') {
      setSelectedNavItem('slides');
    } else {
      setSelectedNavItem('chat');
    }
  }, [currentAgentType]);
    
  // --- New `useEffect` for processing real-time logs ---
  useEffect(() => {
    if (logsData?.data?.length > 0) {
      const completed = new Set();
      let newBlueprint = null;

      logsData.data.forEach(log => {
        // Phase 1: Planning & Analysis
        if (['presentation_spec_extractor_agent', 'vibe_estimator_agent', 'planning_agent'].includes(log.agent_name)) {
          completed.add('planning');
        }
        
        // Phase 3: Content Generation
        if (['keyword_research_agent', 'search_query', 'content_synthesizer_agent'].includes(log.agent_name)) {
          completed.add('planning'); // Prerequisite
          completed.add('preferences'); // Inferred completion
          completed.add('content');
        }
        
        // Phase 4: Design & Media
        if (log.agent_name === 'slide_generator_agent') {
            completed.add('planning');
            completed.add('preferences');
            completed.add('content');
            completed.add('design');
        }

        // Extract blueprint details from the planning_agent log
        if (log.agent_name === 'planning_agent' && log.parsed_output) {
            try {
                const parsed = JSON.parse(log.parsed_output);
                newBlueprint = {
                    slideCount: parsed.slides.length,
                    duration: 'N/A', // Duration is not available in the logs
                    structure: `Generated a ${parsed.slides.length}-slide plan.`,
                };
            } catch (e) {
                console.error("Could not parse blueprint from planning_agent log", e);
            }
        }
      });

      // Check for the final completion message from the logs
      const lastLog = logsData.data[logsData.data.length - 1];
      if (lastLog?.parsed_output.includes("The presentation is complete")) {
          // Mark all phases, including validation, as complete
          PHASES_ORDER.forEach(p => completed.add(p));
          setIsLoading(false); // Stop the main loading indicator
      }

      setCompletedPhases(Array.from(completed));
      const latestPhase = getLatestPhase(completed);
      
      // Update current phase, marking 'completed' if validation is done
      setCurrentPhase(latestPhase === 'validation' ? 'completed' : latestPhase);

      if (newBlueprint) {
        setPresentationBlueprint(newBlueprint);
      }
    }
  }, [logsData]);


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


  useEffect(() => {
    const handleResize = () => {
      if (chatEndRef.current) {
        setTimeout(() => {
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSlideTabChange = (slideIndex, newValue) => {
    setSlideTabs(prev => ({
      ...prev,
      [slideIndex]: newValue,
    }));
  };

  const handleSend = async (promptText) => {
    const prompt = promptText || inputValue;
    if (!prompt.trim() || isLoading) return;

    // NOTE: We only add the user's message to a local chat history for display.
    // The agent's responses are rendered directly from the `realLogs`.
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    // In a real application, this is where you would make the API call
    // to START the presentation generation with the user's prompt.
    // Since this component uses polling via `useFetchLogsQuery` based on
    // a `presentationId`, we assume the generation is triggered elsewhere,
    // and the polling will automatically pick up the logs.
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
    // This can be wired to a future API call for auto-fixing
    console.log("Applying auto-fixes...");
  };

  const handleRegenerateWithFeedback = () => {
    // This can be wired to a future API call for regeneration
     console.log("Regenerating with feedback...");
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

      {/* Content Area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        overflow: 'hidden', 
        height: 'calc(100vh - 220px)',
        marginTop: '80px',
        marginBottom: '140px',
      }}>
        {/* Left Side - Chat Area */}
        <Box sx={{ 
          flex: { xs: 1, md: 1 }, 
          display: 'flex', 
          flexDirection: 'column',
          borderRight: { xs: 'none', md: '1px solid #e0e0e0' },
          height: '100%',
          // overflow: 'hidden',
          maxHeight: '100vh',
          overflowY: 'auto',
          position: 'relative',
        }}>
          {/* Planning Progress - now driven by real data */}
          {currentAgentType === 'presentation' && (logsData?.data?.length > 0 || isLoading) && (
            <Box sx={{ 
              flexShrink: 0,
              bgcolor: '#f8f9fa',
              borderBottom: '1px solid #e0e0e0',
              p: 2,
              position: 'sticky',
              top: 0,
              zIndex: 100,
            }}>
              <PlanningProgressIndicator
                currentPhase={currentPhase}
                completedPhases={completedPhases}
                estimatedTimeRemaining={isLoading ? "Processing..." : "Completed"}
              />
            </Box>
          )}

          {/* Chat Messages */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            overflowX: 'hidden',
            bgcolor: '#f8f9fa',
            height: '100%',
            position: 'relative',
            scrollBehavior: 'smooth',
             '&::-webkit-scrollbar': { width: '8px' },
             '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
             '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px', '&:hover': { background: '#a8a8a8' } },
             scrollbarWidth: 'thin',
             scrollbarColor: '#c1c1c1 #f1f1f1',
          }}>
            <Box sx={{ p: 3, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
              {chatHistory.length === 0 && realLogs.length === 0 && (
                <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '400px' }}>
                  <SmartToyIcon sx={{ fontSize: 64, color: '#ddd', mb: 2 }} />
                  <Typography color="#666">
                    Start a conversation with {currentAgentType === 'presentation' ? 'Presentation Agent' : 'Super Agent'}
                  </Typography>
                </Box>
              )}
              
              {/* Display user's sent messages */}
              {chatHistory.map((message) => (
                   <InteractiveChatMessage
                    key={message.id}
                    message={message}
                  />
              ))}

              {/* Display real logs from the API */}
              {realLogs.length > 0 && (
                  <Box sx={{ mt: 2, pb: 10 }}>
                    {realLogs.map((log, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 2, borderLeft: '4px solid #2196f3' }}>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(log.timestamp).toLocaleTimeString()} - <strong>{log.agent_name}</strong>
                        </Typography>
                        <Typography variant="body1" sx={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                          {log.parsed_output}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
              )}

              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ ml: 2 }}>Processing...</Typography>
                </Box>
              )}

              <div ref={chatEndRef} />
            </Box>
          </Box>
        </Box>

        {/* Right Side - Preview Panel */}
        <Box sx={{
          width: { xs: '0px', md: '40%' },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          bgcolor: 'white',
          // Make the panel's height equal to the viewport height minus the header
          height: 'calc(100vh - 80px)', 
          // Make the panel sticky to the top, just below the header
          position: 'sticky',
          top: '20px',
          // Allow this panel to scroll internally if its content overflows
          overflowY: 'auto', 
          // Add scrollbar styling for consistency
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
          '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px', '&:hover': { background: '#a8a8a8' } },
          scrollbarWidth: 'thin',
          scrollbarColor: '#c1c1c1 #f1f1f1',
        }}>
          {/* Preview Content */}
          <Box sx={{
            flex: 1,
          }}>
            <Box sx={{ p: 3, minHeight: '100%', pb: 6 }}>
              {previewTab === 'preview' && (
                 <Box>
                  {currentAgentType === 'presentation' ? (
                    <>
                      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" color="#333">Your Presentation</Typography>
                        <Typography color="#666">{slidesData?.data?.length || 0} slides</Typography>
                      </Box>
                      
                      {slidesLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                      ) : slidesData?.data?.length > 0 ? (
                        <>
                          <Box>
                            {slidesData?.data.map((slide, index) => {
                              // Default to 'preview' tab if no specific tab is set for this slide
                              const activeSlideTab = slideTabs[index] || 'preview';

                              return (
                                <Card key={slide.slide_index} sx={{ mb: 3, boxShadow: 2, borderRadius: 2, overflow: 'hidden' }}>
                                  <CardContent sx={{ p: '0 !important' }}>
                                    {/* Tabs for each individual slide */}
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fafafa', px: 2 }}>
                                      <Tabs
                                        value={activeSlideTab}
                                        onChange={(e, newValue) => handleSlideTabChange(index, newValue)}
                                        aria-label={`Tabs for slide ${index + 1}`}
                                        sx={{
                                            '& .MuiTabs-indicator': { bgcolor: PRIMARY_GREEN },
                                            '& .Mui-selected': { color: `${PRIMARY_GREEN} !important` },
                                        }}
                                      >
                                        <Tab label={`Preview`} value="preview" />
                                        <Tab label="Thinking" value="thinking" />
                                        <Tab label="Code" value="code" />
                                      </Tabs>
                                    </Box>

                                    {/* Conditional content based on the active tab for this slide */}
                                    <Box sx={{ p: 2 }}>
                                      {activeSlideTab === 'preview' && (
                                        <Box sx={{ height: '300px', position: 'relative', width: '100%' }}>
                                          <iframe
                                            srcDoc={slide.body}
                                            style={{
                                              width: '333.33%', height: '333.33%',
                                              transform: 'scale(0.3)', transformOrigin: 'top left',
                                              position: 'absolute', top: 0, left: 0,
                                              border: 'none', display: 'block', pointerEvents: 'none',
                                            }}
                                            title={`Slide ${slide.slide_index + 1}`}
                                          />
                                        </Box>
                                      )}
                                      {activeSlideTab === 'thinking' && (
                                        <Box sx={{ p: 2, minHeight: '300px', maxHeight: '300px', bgcolor: '#f8f9fa', borderRadius: 1, overflowY: 'auto' }}>
                                          <Typography variant="body2" color="text.secondary">
                                           {slide?.thought}
                                          </Typography>
                                        </Box>
                                      )}
                                      {activeSlideTab === 'code' && (
                                        <Box sx={{ minHeight: '300px' }}>
                                          <pre style={{ backgroundColor: '#f8f9fa', color: '#333', padding: 16, borderRadius: 8, overflow: 'auto', border: '1px solid #e0e0e0', maxHeight: '300px' }}>
                                            <code>
                                              {`\n${slide.body}`}
                                            </code>
                                          </pre>
                                        </Box>
                                      )}
                                    </Box>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </Box>
                        </>
                      ) : (
                        <Card sx={{ bgcolor: '#f8f9fa', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e0e0', boxShadow: 1, mb: 4 }}>
                          <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: PRIMARY_GREEN, mb: 2 }}>Your Presentation Title</Typography>
                            <Typography variant="h6" color="#666">Generated slides will appear here</Typography>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', mt: 8 }}><Typography color="#666">Agent output will appear here</Typography></Box>
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
                        <Typography><strong>Duration:</strong> {presentationBlueprint.duration}</Typography>
                        <Typography><strong>Structure:</strong> {presentationBlueprint.structure}</Typography>
                      </CardContent>
                    </Card>
                  ) : (
                    <Typography color="#666">Blueprint will appear after planning phase is complete.</Typography>
                  )}
                </Box>
              )}

              {previewTab === 'quality' && (
                 <Box sx={{ pb: 4 }}>
                  {completedPhases.includes('validation') ? (
                    <QualityValidationPanel
                      qualityMetrics={qualityMetrics} // This remains null as it's not in logs
                      validationResult={validationResult} // Also null
                      isValidating={isValidating}
                      onApplyAutoFixes={handleApplyAutoFixes}
                      onRegenerateWithFeedback={handleRegenerateWithFeedback}
                    />
                  ) : (
                    <Typography color="#666">Quality metrics will appear after the validation phase.</Typography>
                  )}
                </Box>
              )}

              {previewTab === 'preferences' && (
                <Box sx={{ pb: 4 }}>
                  <Typography color="#666">This phase is automatically inferred during content generation.</Typography>
                </Box>
              )}

              {previewTab === 'code' && (
                 <Box sx={{ pb: 4 }}>
                   <pre style={{ backgroundColor: '#f8f9fa', color: '#333', padding: 16, borderRadius: 8, overflow: 'auto', border: '1px solid #e0e0e0' }}>
                     <code>
{`// Code view reflects the latest state
const presentationState = {
  presentationId: "${presentationId}",
  currentPhase: "${currentPhase}",
  completedPhases: ${JSON.stringify(completedPhases)},
  blueprint: ${JSON.stringify(presentationBlueprint, null, 2)},
  slidesAvailable: ${slidesData?.data?.length || 0}
};`}
                     </code>
                   </pre>
                 </Box>
              )}

              {previewTab === 'thinking' && (
                <Box sx={{ pb: 4 }}>
                  <Typography variant="body2" color="#666" paragraph><strong>Current Phase:</strong> {currentPhase}</Typography>
                  <Typography variant="body2" color="#666" paragraph><strong>Completed:</strong> {completedPhases.join(', ')}</Typography>
                  <Typography variant="body2" color="#666" paragraph>
                    The system is processing your request using multiple agents. The progress bar above reflects the current status based on agent activity.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Fixed Input Area */}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'white', borderTop: '1px solid #e0e0e0', zIndex: 1002, py: 2, boxShadow: '0 -2px 8px rgba(0,0,0,0.1)' }}>
        <Container maxWidth="lg">
            <Box sx={{ bgcolor: '#f8f9fa', borderRadius: 4, p: 3, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder={currentAgentType === 'presentation' ? "Create a presentation about..." : "Ask anything, create anything..."}
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
                            bgcolor: 'transparent', color: '#333', fontSize: '1.1rem',
                            border: 'none', '& fieldset': { border: 'none' },
                            '& input': { color: '#333' }, '& textarea': { color: '#333' },
                        },
                        '& .MuiOutlinedInput-input::placeholder': { color: '#999', opacity: 1 },
                    }}
                />
                <IconButton sx={{ color: '#666', '&:hover': { color: PRIMARY_GREEN } }}><MicIcon /></IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button startIcon={<PersonIcon />} sx={{ color: '#666', textTransform: 'none', '&:hover': { color: PRIMARY_GREEN, bgcolor: 'rgba(7, 179, 122, 0.1)' } }}>
                        Personalize
                    </Button>
                    <IconButton onClick={() => handleSend()} disabled={!inputValue.trim() || isLoading} sx={{ bgcolor: PRIMARY_GREEN, color: 'white', width: 40, height: 40, '&:hover': { bgcolor: '#06A36D' }, '&.Mui-disabled': { bgcolor: '#ddd', color: '#999' } }}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>
        </Container>
      </Box>
    </Box>
  );
}