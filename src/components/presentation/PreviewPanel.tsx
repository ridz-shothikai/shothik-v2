// components/PreviewPanel.jsx
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import SlidePreview from './SlidePreview';
import QualityValidationPanel from '../../../components/agents/shared/QualityValidationPanel';

const PRIMARY_GREEN = '#07B37A';

export default function PreviewPanel({
  currentAgentType,
  slidesData,
  slidesLoading,
  presentationId,
  currentPhase,
  completedPhases,
  presentationBlueprint,
  qualityMetrics,
  validationResult,
  isValidating,
  onApplyAutoFixes,
  onRegenerateWithFeedback
}) {
  const [previewTab, setPreviewTab] = useState('preview');
  const [slideTabs, setSlideTabs] = useState({});

  const handleSlideTabChange = (slideIndex, newValue) => {
    setSlideTabs(prev => ({
      ...prev,
      [slideIndex]: newValue,
    }));
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'white',
      height: '100%',
      maxHeight: '100%', // Ensure it doesn't exceed parent height
      overflow: 'hidden', // Prevent this container from scrolling
    }}>
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0, // Important: allows flex child to shrink below content size
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
        '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px', '&:hover': { background: '#a8a8a8' } },
        scrollbarWidth: 'thin',
        scrollbarColor: '#c1c1c1 #f1f1f1',
      }}>
        {previewTab === 'preview' && (
          <Box>
            {currentAgentType === 'presentation' ? (
              <>
                {/* Sticky Header */}
                <Box sx={{ 
                  position: 'sticky',
                  top: 0,
                  bgcolor: 'white',
                  zIndex: 10,
                  borderBottom: '1px solid #e0e0e0',
                  px: 3,
                  pt: 3,
                  pb: 2,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between'
                }}>
                  <Typography variant="h6" color="#333">Your Presentation</Typography>
                  <Typography color="#666">{slidesData?.data?.length || 0} slides</Typography>
                </Box>
                
                {/* Scrollable Content */}
                <Box sx={{ p: 3, pt: 0 }}>
                  {slidesLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : slidesData?.data?.length > 0 ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 2,
                        pt: 2
                    }}>
                      {slidesData?.data.map((slide, index) => (
                        <SlidePreview
                          key={slide.slide_index}
                          slide={slide}
                          index={index}
                          activeTab={slideTabs[index] || 'preview'}
                          onTabChange={handleSlideTabChange}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Card sx={{ 
                      bgcolor: '#f8f9fa', 
                      height: 400, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      border: '1px solid #e0e0e0', 
                      boxShadow: 1, 
                      mb: 4 
                    }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: PRIMARY_GREEN, mb: 2 }}>
                          Your Presentation Title
                        </Typography>
                        <Typography variant="h6" color="#666">
                          Generated slides will appear here
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', mt: 8, p: 3 }}>
                <Typography color="#666">Agent output will appear here</Typography>
              </Box>
            )}
          </Box>
        )}

        {previewTab === 'blueprint' && (
          <Box sx={{ p: 3, pb: 4 }}>
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
          <Box sx={{ p: 3, pb: 4 }}>
            {completedPhases.includes('validation') ? (
              <QualityValidationPanel
                qualityMetrics={qualityMetrics}
                validationResult={validationResult}
                isValidating={isValidating}
                onApplyAutoFixes={onApplyAutoFixes}
                onRegenerateWithFeedback={onRegenerateWithFeedback}
                onViewDetails={console.log('')}
              />
            ) : (
              <Typography color="#666">Quality metrics will appear after the validation phase.</Typography>
            )}
          </Box>
        )}

        {previewTab === 'preferences' && (
          <Box sx={{ p: 3, pb: 4 }}>
            <Typography color="#666">This phase is automatically inferred during content generation.</Typography>
          </Box>
        )}

        {previewTab === 'code' && (
          <Box sx={{ p: 3, pb: 4 }}>
            <pre style={{ 
              backgroundColor: '#f8f9fa', 
              color: '#333', 
              padding: 16, 
              borderRadius: 8, 
              overflow: 'auto', 
              border: '1px solid #e0e0e0' 
            }}>
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
          <Box sx={{ p: 3, pb: 4 }}>
            <Typography variant="body2" color="#666" paragraph>
              <strong>Current Phase:</strong> {currentPhase}
            </Typography>
            <Typography variant="body2" color="#666" paragraph>
              <strong>Completed:</strong> {completedPhases.join(', ')}
            </Typography>
            <Typography variant="body2" color="#666" paragraph>
              The system is processing your request using multiple agents. The progress bar above reflects the current status based on agent activity.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}