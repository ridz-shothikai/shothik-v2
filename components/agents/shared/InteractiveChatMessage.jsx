import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PaletteIcon from '@mui/icons-material/Palette';
import FactCheckIcon from '@mui/icons-material/FactCheck';

const PRIMARY_GREEN = '#07B37A';

export default function InteractiveChatMessage({ 
  message,
  onResponse,
  onPreferenceUpdate,
  onFeedback
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionSelect = (option) => {
    if (message.allowMultiple) {
      const newOptions = selectedOptions.includes(option)
        ? selectedOptions.filter(o => o !== option)
        : [...selectedOptions, option];
      setSelectedOptions(newOptions);
    } else {
      setSelectedOptions([option]);
      onResponse?.(message.id, [option]);
    }
  };

  const handleSubmitMultiple = () => {
    onResponse?.(message.id, selectedOptions);
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'question':
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {message.content}
            </Typography>
            
            {message.options && (
              <Box>
                <Grid container spacing={1}>
                  {message.options.map((option, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Button
                        variant={selectedOptions.includes(option) ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() => handleOptionSelect(option)}
                        sx={{
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          py: 1.5,
                          bgcolor: selectedOptions.includes(option) ? PRIMARY_GREEN : 'transparent',
                          borderColor: selectedOptions.includes(option) ? PRIMARY_GREEN : '#ddd',
                          color: selectedOptions.includes(option) ? 'white' : 'inherit',
                          '&:hover': {
                            bgcolor: selectedOptions.includes(option) ? '#06A36D' : 'rgba(7, 179, 122, 0.04)',
                            borderColor: PRIMARY_GREEN
                          }
                        }}
                      >
                        {option}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                {message.allowMultiple && selectedOptions.length > 0 && (
                  <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      onClick={handleSubmitMultiple}
                      sx={{
                        bgcolor: PRIMARY_GREEN,
                        '&:hover': { bgcolor: '#06A36D' }
                      }}
                    >
                      Submit ({selectedOptions.length} selected)
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        );

      case 'quality_feedback':
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {message.content}
            </Typography>
            
            {message.qualityScore && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Quality Score</Typography>
                  <Chip
                    label={`${Math.round(message.qualityScore * 100)}%`}
                    sx={{
                      bgcolor: message.qualityScore >= 0.8 ? PRIMARY_GREEN : 
                               message.qualityScore >= 0.6 ? '#ff9800' : '#f44336',
                      color: 'white'
                    }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={message.qualityScore * 100}
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      bgcolor: message.qualityScore >= 0.8 ? PRIMARY_GREEN : 
                               message.qualityScore >= 0.6 ? '#ff9800' : '#f44336'
                    }
                  }}
                />
              </Box>
            )}

            <ButtonGroup variant="outlined" sx={{ mt: 1 }}>
              <Button
                onClick={() => onResponse?.(message.id, 'accept')}
                sx={{ 
                  borderColor: PRIMARY_GREEN,
                  color: PRIMARY_GREEN,
                  '&:hover': { bgcolor: 'rgba(7, 179, 122, 0.04)' }
                }}
              >
                Accept Changes
              </Button>
              <Button
                onClick={() => onResponse?.(message.id, 'modify')}
                sx={{ 
                  borderColor: PRIMARY_GREEN,
                  color: PRIMARY_GREEN,
                  '&:hover': { bgcolor: 'rgba(7, 179, 122, 0.04)' }
                }}
              >
                Request Modifications
              </Button>
            </ButtonGroup>
          </Box>
        );

      default:
        return (
          <Typography variant="body1">
            {message.content}
          </Typography>
        );
    }
  };

  const getMessageIcon = () => {
    switch (message.type) {
      case 'question':
        return <QuestionMarkIcon />;
      case 'preference_request':
        return <PaletteIcon />;
      case 'quality_feedback':
        return <FactCheckIcon />;
      default:
        return message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
        mb: 2
      }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
        }}
      >
        <Avatar
          sx={{
            bgcolor: message.sender === 'user' ? '#1976d2' : PRIMARY_GREEN,
            width: 32,
            height: 32
          }}
        >
          {getMessageIcon()}
        </Avatar>

        <Card
          sx={{
            bgcolor: message.sender === 'user' ? '#f5f5f5' : 'white',
            border: message.sender === 'user' ? 'none' : `1px solid ${PRIMARY_GREEN}`,
            borderRadius: message.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            {message.agentName && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                {message.agentName}
              </Typography>
            )}
            
            {renderMessageContent()}

            {message.timestamp && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </Typography>
            )}
          </CardContent>

          {/* {message.sender !== 'user' && onFeedback && (
            <Box sx={{ display: 'flex', justifyContent: 'center', pb: 1 }}>
              <IconButton
                size="small"
                onClick={() => onFeedback(message.id, 'positive')}
                sx={{ color: '#4caf50' }}
              >
                <ThumbUpIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onFeedback(message.id, 'negative')}
                sx={{ color: '#f44336' }}
              >
                <ThumbDownIcon fontSize="small" />
              </IconButton>
            </Box>
          )} */}
        </Card>
      </Box>
    </Box>
  );
} 