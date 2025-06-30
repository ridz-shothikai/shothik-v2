// components/ChatArea.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InteractiveChatMessage from '../../../components/agents/shared/InteractiveChatMessage';
import InputArea from './InputArea';

export default function ChatArea({ 
  currentAgentType, 
  chatHistory, 
  realLogs, 
  isLoading, 
  currentPhase, 
  completedPhases, 
  logsData, 
  chatEndRef,
  inputValue,
  setInputValue,
  onSend
}) {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxHeight: '100%', // Ensure it doesn't exceed parent height
      borderRight: '1px solid #e0e0e0',
      bgcolor: '#f8f9fa',
      overflow: 'hidden', // Prevent this container from scrolling
    }}>
      {/* Top Section - Logs Display */}
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0, // Important: allows flex child to shrink below content size
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
        '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px', '&:hover': { background: '#a8a8a8' } },
        scrollbarWidth: 'thin',
        scrollbarColor: '#c1c1c1 #f1f1f1',
      }}>
        <Box sx={{ p: 3, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
          {chatHistory.length === 0 && realLogs.length === 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              minHeight: '300px' 
            }}>
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
              onResponse={'d'} 
              onFeedback={'d'} 
              onPreferenceUpdate={'d'} 
            />
          ))}

          {/* Display real logs from the API */}
          {realLogs.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {realLogs.map((log, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    bgcolor: '#e3f2fd', 
                    borderRadius: 2, 
                    borderLeft: '4px solid #2196f3' 
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {new Date(log.timestamp).toLocaleTimeString()} - <strong>{log.agent_name}</strong>
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
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

      {/* Bottom Section - Input Area */}
      <Box sx={{ 
        borderTop: '1px solid #e0e0e0',
        bgcolor: 'white',
        flexShrink: 0, // Prevent input area from shrinking
        maxHeight: '300px', // Limit input area height
        overflow: 'hidden', // Prevent overflow
      }}>
        <InputArea
          currentAgentType={currentAgentType}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={onSend}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
}