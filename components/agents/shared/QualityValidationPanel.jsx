import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RefreshIcon from '@mui/icons-material/Refresh';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PaletteIcon from '@mui/icons-material/Palette';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import SpeedIcon from '@mui/icons-material/Speed';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const PRIMARY_GREEN = '#07B37A';

const getScoreColor = (score) => {
  if (score >= 0.9) return PRIMARY_GREEN;
  if (score >= 0.7) return '#ff9800';
  return '#f44336';
};

const getScoreIcon = (score) => {
  if (score >= 0.9) return <CheckCircleIcon sx={{ color: PRIMARY_GREEN }} />;
  if (score >= 0.7) return <WarningIcon sx={{ color: '#ff9800' }} />;
  return <ErrorIcon sx={{ color: '#f44336' }} />;
};

const getScoreLabel = (score) => {
  if (score >= 0.9) return 'Excellent';
  if (score >= 0.8) return 'Good';
  if (score >= 0.7) return 'Acceptable';
  if (score >= 0.6) return 'Needs Improvement';
  return 'Poor';
};

export default function QualityValidationPanel({ 
  qualityMetrics = {},
  validationResult = {},
  isValidating = false,
  onApplyAutoFixes,
  onRegenerateWithFeedback,
  onViewDetails
}) {
  // Default values for demo/loading states
  const defaultMetrics = {
    overall: 0.85,
    contentAccuracy: 0.88,
    designQuality: 0.82,
    requirementCompliance: 0.90,
    accessibility: 0.79,
    performance: 0.85
  };

  const defaultResult = {
    status: 'completed',
    needsImprovement: false,
    contentSuggestions: [],
    designSuggestions: [],
    requirementSuggestions: [],
    accessibilitySuggestions: [],
    performanceSuggestions: []
  };

  const metrics = { ...defaultMetrics, ...qualityMetrics };
  const result = { ...defaultResult, ...validationResult };

  const qualityCategories = [
    {
      id: 'contentAccuracy',
      title: 'Content Accuracy',
      description: 'Factual correctness and research quality',
      icon: <FactCheckIcon />,
      score: metrics.contentAccuracy,
      suggestions: result.contentSuggestions || []
    },
    {
      id: 'designQuality',
      title: 'Design Quality',
      description: 'Visual hierarchy and aesthetic appeal',
      icon: <PaletteIcon />,
      score: metrics.designQuality,
      suggestions: result.designSuggestions || []
    },
    {
      id: 'requirementCompliance',
      title: 'Requirement Compliance',
      description: 'Adherence to user specifications',
      icon: <AssignmentTurnedInIcon />,
      score: metrics.requirementCompliance,
      suggestions: result.requirementSuggestions || []
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      description: 'WCAG compliance and inclusivity',
      icon: <AccessibilityIcon />,
      score: metrics.accessibility,
      suggestions: result.accessibilitySuggestions || []
    },
    {
      id: 'performance',
      title: 'Performance',
      description: 'Load times and optimization',
      icon: <SpeedIcon />,
      score: metrics.performance,
      suggestions: result.performanceSuggestions || []
    }
  ];

  if (isValidating) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              sx={{ 
                width: '100%', 
                '& .MuiLinearProgress-bar': { bgcolor: PRIMARY_GREEN } 
              }} 
            />
          </Box>
          <Typography variant="h6" gutterBottom>
            Validating Presentation Quality...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Our QA Agent is analyzing content accuracy, design quality, and user requirements
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Overall Quality Score */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Overall Quality Score</Typography>
            <Chip 
              icon={getScoreIcon(metrics.overall)}
              label={`${Math.round(metrics.overall * 100)}%`}
              sx={{ 
                bgcolor: getScoreColor(metrics.overall), 
                color: 'white',
                fontSize: '1rem',
                px: 1
              }}
            />
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={metrics.overall * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                bgcolor: getScoreColor(metrics.overall),
                borderRadius: 4
              },
              '& .MuiLinearProgress-root': {
                bgcolor: '#f5f5f5'
              }
            }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {getScoreLabel(metrics.overall)} - {
              metrics.overall >= 0.9 ? 'Ready for presentation!' :
              metrics.overall >= 0.7 ? 'Minor improvements recommended' :
              'Significant improvements needed'
            }
          </Typography>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {qualityCategories.map((category) => (
          <Grid item xs={12} md={6} key={category.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: PRIMARY_GREEN, mr: 1 }}>
                    {category.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${Math.round(category.score * 100)}%`}
                    size="small"
                    sx={{ 
                      bgcolor: getScoreColor(category.score), 
                      color: 'white' 
                    }}
                  />
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={category.score * 100}
                  sx={{
                    mb: 2,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getScoreColor(category.score)
                    }
                  }}
                />

                {category.suggestions.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Suggestions:
                    </Typography>
                    {category.suggestions.slice(0, 2).map((suggestion, index) => (
                      <Typography key={index} variant="body2" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                        • {suggestion}
                      </Typography>
                    ))}
                    {category.suggestions.length > 2 && (
                      <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>
                        +{category.suggestions.length - 2} more
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Alerts and Recommendations */}
      {result.needsImprovement && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Quality Improvements Recommended</AlertTitle>
          Some aspects of your presentation could be enhanced. Review the suggestions above or use our auto-fix feature.
        </Alert>
      )}

      {metrics.overall >= 0.9 && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <AlertTitle>Excellent Quality!</AlertTitle>
          Your presentation meets high-quality standards and is ready for delivery.
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {result.needsImprovement && (
          <>
            <Button
              variant="contained"
              startIcon={<AutoFixHighIcon />}
              onClick={onApplyAutoFixes}
              sx={{ 
                bgcolor: PRIMARY_GREEN,
                '&:hover': { bgcolor: '#06A36D' }
              }}
            >
              Apply Auto-Fixes
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={onRegenerateWithFeedback}
              sx={{ 
                borderColor: PRIMARY_GREEN,
                color: PRIMARY_GREEN,
                '&:hover': { 
                  borderColor: '#06A36D',
                  bgcolor: 'rgba(7, 179, 122, 0.04)'
                }
              }}
            >
              Regenerate with Feedback
            </Button>
          </>
        )}
        
        <Button
          variant="text"
          onClick={onViewDetails}
          sx={{ color: PRIMARY_GREEN }}
        >
          View Detailed Report
        </Button>
      </Box>

      {/* Quality Timeline */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Validation Process
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon sx={{ color: PRIMARY_GREEN, mr: 2, fontSize: 20 }} />
              <Typography variant="body2">Content accuracy verified</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon sx={{ color: PRIMARY_GREEN, mr: 2, fontSize: 20 }} />
              <Typography variant="body2">Design principles applied</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon sx={{ color: PRIMARY_GREEN, mr: 2, fontSize: 20 }} />
              <Typography variant="body2">User requirements validated</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon sx={{ color: PRIMARY_GREEN, mr: 2, fontSize: 20 }} />
              <Typography variant="body2">Accessibility standards checked</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ color: PRIMARY_GREEN, mr: 2, fontSize: 20 }} />
              <Typography variant="body2">Performance optimized</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 