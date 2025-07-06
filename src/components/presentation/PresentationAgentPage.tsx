"use client";

// AgentPage.jsx - Main component
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import AgentHeader from './AgentHeader';
import ChatArea from './ChatArea';
import PreviewPanel from './PreviewPanel';
import { useFetchLogsQuery, useFetchSlidesQuery } from '../../redux/api/presentation/presentationApi';
import { useAgentContext } from '../../../components/agents/shared/AgentContextProvider';

const PRIMARY_GREEN = '#07B37A';

// Defines the order of phases for progress tracking.
const PHASES_ORDER = ['planning', 'preferences', 'content', 'design', 'validation'];

// Helper function to determine the most recent phase based on the order.
const getLatestPhase = (completedPhasesSet) => {
  return PHASES_ORDER.slice().reverse().find(phase => completedPhasesSet.has(phase)) || null;
};

export default function PresentationAgentPage({ specificAgent, presentationId }) {
  const router = useRouter();
  const { agentType, setAgentType } = useAgentContext();
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    pollingInterval: shouldPollLogs ? 5000 : 0,
  });

  // console.log(logsData, "logs data");
  
  // Filter logs for chat display
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
    pollingInterval: shouldPollSlides ? 10000 : 0,
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
    
  // Process real-time logs
  useEffect(() => {
    if (logsData?.data?.length > 0) {
      const completed = new Set();
      let newBlueprint = null;

      logsData?.data?.forEach(log => {
        // Phase 1: Planning & Analysis
        if (['presentation_spec_extractor_agent', 'vibe_estimator_agent', 'planning_agent'].includes(log.agent_name)) {
          completed.add('planning');
        }
        
        // Phase 3: Content Generation
        if (['keyword_research_agent', 'search_query', 'content_synthesizer_agent'].includes(log.agent_name)) {
          completed.add('planning');
          completed.add('preferences');
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
        if (log?.agent_name === 'planning_agent' && log.parsed_output) {
            try {
                let parsed;
                if (typeof log.parsed_output === 'string') {
                  parsed = JSON.parse(log.parsed_output);
                } else {
                  // If it's already an object, use it directly
                  parsed = log.parsed_output;
                }
                // const parsed = JSON.parse(log.parsed_output);
                newBlueprint = {
                    slideCount: parsed.slides.length,
                    duration: 'N/A',
                    structure: `Generated a ${parsed.slides.length}-slide plan.`,
                };
            } catch (e) {
                console.error("Could not parse blueprint from planning_agent log", e);
            }
        }
      });

      // Check for the final completion message from the logs
      const lastLog = logsData?.data[logsData?.data?.length - 1];
      if (lastLog?.parsed_output) {
        // Convert parsed_output to string if it's an object
        let outputText = '';
        if (typeof lastLog.parsed_output === 'string') {
          outputText = lastLog.parsed_output;
        } else if (typeof lastLog.parsed_output === 'object') {
          // If it's an object, convert to string for searching
          outputText = JSON.stringify(lastLog.parsed_output);
        }
        
        // Now safely check for completion messages
        if (outputText.includes("The presentation is complete") || outputText.includes("I've finished generating") || outputText.includes("I have now generated all")) {
          PHASES_ORDER.forEach(p => completed.add(p));
          setIsLoading(false);
        }
        // console.log(lastLog, "last logs");
        // console.log(outputText, "Output text");
      }

      setCompletedPhases(Array.from(completed));
      const latestPhase = getLatestPhase(completed);
      
      setCurrentPhase(latestPhase === 'validation' ? 'completed' : latestPhase);

      if (newBlueprint) {
        setPresentationBlueprint(newBlueprint);
      }
    }
  }, [logsData]);
  
  useEffect(() => {
    if (logsData?.status === 'completed' || logsData?.status === 'failed') {
      setShouldPollLogs(false);
    }
  }, [logsData?.status]);

  // Process initial prompt from sessionStorage
  useEffect(() => {
    const initialPrompt = sessionStorage.getItem('initialPrompt');
    if (initialPrompt && specificAgent) {
      sessionStorage.removeItem('initialPrompt');
      setInputValue(initialPrompt);
      setTimeout(() => {
        handleSend(initialPrompt);
      }, 500);
    }
  }, [specificAgent]);

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
    console.log("Applying auto-fixes...");
  };

  const handleRegenerateWithFeedback = () => {
    console.log("Regenerating with feedback...");
  };

  return (
    <Box sx={{ 
      height: '100dvh',
      bgcolor: 'white',
      color: '#333',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden', // Prevent overall page scroll
    //   paddingTop: '100px',
    //   paddingBottom: '20px',
    //   paddingX: '20px',
    //   boxSizing: 'border-box',
    }}>
      <AgentHeader 
        currentAgentType={currentAgentType}
        onBackClick={() => router.push('/agents')}
      />

      {/* Main Grid Layout */}
      <Box sx={{ 
        flex: 1,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, // Left smaller, right bigger
        gridTemplateRows: '1fr',
        height: 'calc(100vh - 120px)', // Subtract header height
        overflow: 'hidden', // Prevent grid container from scrolling
      }}>
        {/* Left Side - Chat Area with Input */}
        <Box sx={{ 
          height: '100%',
          overflow: 'hidden', // Let ChatArea handle its own scrolling
          display: 'flex',
          flexDirection: 'column',
        }}>
          <ChatArea
            currentAgentType={currentAgentType}
            chatHistory={chatHistory}
            realLogs={realLogs}
            isLoading={isLoading}
            currentPhase={currentPhase}
            completedPhases={completedPhases}
            logsData={logsData}
            chatEndRef={chatEndRef}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSend={handleSend}
          />
        </Box>

        {/* Right Side - Preview Panel */}
        <Box sx={{ 
          height: '100%',
          overflow: 'hidden', // Let PreviewPanel handle its own scrolling
          display: 'flex',
          flexDirection: 'column',
        }}>
          <PreviewPanel
            currentAgentType={currentAgentType}
            slidesData={slidesData}
            slidesLoading={slidesLoading}
            presentationId={presentationId}
            currentPhase={currentPhase}
            completedPhases={completedPhases}
            presentationBlueprint={presentationBlueprint}
            qualityMetrics={qualityMetrics}
            validationResult={validationResult}
            isValidating={isValidating}
            onApplyAutoFixes={handleApplyAutoFixes}
            onRegenerateWithFeedback={handleRegenerateWithFeedback}
          />
        </Box>
      </Box>
    </Box>
  );
}