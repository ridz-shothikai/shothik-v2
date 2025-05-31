import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PlanningIcon from '@mui/icons-material/AssignmentTurnedIn';
import QuestionIcon from '@mui/icons-material/HelpOutline';
import ContentIcon from '@mui/icons-material/Article';
import DesignIcon from '@mui/icons-material/Palette';
import ValidationIcon from '@mui/icons-material/FactCheck';

const PRIMARY_GREEN = '#07B37A';

const phases = [
  {
    id: 'planning',
    title: 'Planning & Analysis',
    icon: <PlanningIcon />,
    description: 'Planner Agent analyzes your requirements and creates presentation blueprint',
    agents: ['Planner Agent'],
    estimatedTime: '30s'
  },
  {
    id: 'preferences',
    title: 'Preference Collection',
    icon: <QuestionIcon />,
    description: 'Interactive questions to understand your style and design preferences',
    agents: ['Interactive Chat System'],
    estimatedTime: '2-3 min'
  },
  {
    id: 'content',
    title: 'Content Generation',
    icon: <ContentIcon />,
    description: 'Content Generation Agent researches and creates slide content',
    agents: ['Content Generation Agent', 'Slide Structuring Agent'],
    estimatedTime: '45s'
  },
  {
    id: 'design',
    title: 'Design & Media',
    icon: <DesignIcon />,
    description: 'Media selection and layout design with your custom preferences',
    agents: ['Media Selection Agent', 'Layout & Design Agent', 'Slide Rendering Agent'],
    estimatedTime: '60s'
  },
  {
    id: 'validation',
    title: 'Quality Validation',
    icon: <ValidationIcon />,
    description: 'Validator/QA Agent ensures quality and compliance with requirements',
    agents: ['Validator/QA Agent'],
    estimatedTime: '20s'
  }
];

const getStepIcon = (phase, currentPhase, completedPhases) => {
  if (completedPhases.includes(phase.id)) {
    return <CheckCircleIcon sx={{ color: PRIMARY_GREEN }} />;
  } else if (currentPhase === phase.id) {
    return <PlayCircleIcon sx={{ color: '#ff9800' }} />;
  } else {
    return <RadioButtonUncheckedIcon sx={{ color: '#ccc' }} />;
  }
};

const getStepStatus = (phase, currentPhase, completedPhases) => {
  if (completedPhases.includes(phase.id)) {
    return 'completed';
  } else if (currentPhase === phase.id) {
    return 'active';
  } else {
    return 'pending';
  }
};

export default function PlanningProgressIndicator({ 
  currentPhase = 'planning',
  completedPhases = [],
  progressPercentage = 0,
  estimatedTimeRemaining = null,
  isInteractive = false,
  onPhaseClick
}) {
  const currentPhaseIndex = phases.findIndex(phase => phase.id === currentPhase);
  const totalPhases = phases.length;
  const completedCount = completedPhases.length;
  const overallProgress = (completedCount / totalPhases) * 100;

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Presentation Generation Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={overallProgress}
              sx={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  bgcolor: PRIMARY_GREEN,
                  borderRadius: 4
                }
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {completedCount}/{totalPhases} Complete
            </Typography>
          </Box>
          
          {estimatedTimeRemaining && (
            <Typography variant="body2" color="text.secondary">
              Estimated time remaining: {estimatedTimeRemaining}
            </Typography>
          )}
        </Box>

        {/* Phase Steps */}
        <Stepper 
          activeStep={currentPhaseIndex} 
          orientation="vertical"
          sx={{
            '& .MuiStepLabel-root': {
              cursor: isInteractive ? 'pointer' : 'default'
            }
          }}
        >
          {phases.map((phase, index) => {
            const status = getStepStatus(phase, currentPhase, completedPhases);
            const isClickable = isInteractive && (completedPhases.includes(phase.id) || currentPhase === phase.id);
            
            return (
              <Step key={phase.id} completed={completedPhases.includes(phase.id)}>
                <StepLabel
                  icon={getStepIcon(phase, currentPhase, completedPhases)}
                  onClick={isClickable ? () => onPhaseClick?.(phase.id) : undefined}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontWeight: status === 'active' ? 600 : 400,
                      color: status === 'completed' ? PRIMARY_GREEN : 
                             status === 'active' ? '#000' : '#666'
                    }
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {phase.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={phase.estimatedTime}
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          bgcolor: status === 'completed' ? PRIMARY_GREEN :
                                  status === 'active' ? '#ff9800' : '#f5f5f5',
                          color: status === 'pending' ? '#666' : 'white'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {phase.description}
                    </Typography>
                  </Box>
                </StepLabel>
                
                <StepContent>
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Active Agents:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {phase.agents.map((agent) => (
                        <Chip
                          key={agent}
                          label={agent}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.7rem',
                            height: 24,
                            borderColor: PRIMARY_GREEN,
                            color: PRIMARY_GREEN
                          }}
                        />
                      ))}
                    </Box>
                    
                    {status === 'active' && progressPercentage > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Phase Progress: {Math.round(progressPercentage)}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={progressPercentage}
                          sx={{
                            mt: 0.5,
                            height: 4,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#ff9800'
                            }
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>

        {/* Summary */}
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Current Status:</strong> {
              currentPhase === 'planning' ? 'Analyzing your requirements and creating presentation structure' :
              currentPhase === 'preferences' ? 'Collecting your design preferences for customization' :
              currentPhase === 'content' ? 'Generating content based on research and your requirements' :
              currentPhase === 'design' ? 'Applying design principles and selecting media assets' :
              currentPhase === 'validation' ? 'Ensuring quality and validating against requirements' :
              'Processing complete'
            }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
} 