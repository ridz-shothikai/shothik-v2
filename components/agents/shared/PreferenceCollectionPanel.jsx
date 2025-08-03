import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Slider from '@mui/material/Slider';
import PaletteIcon from '@mui/icons-material/Palette';
import StyleIcon from '@mui/icons-material/Style';
import AnimationIcon from '@mui/icons-material/Animation';
import PeopleIcon from '@mui/icons-material/People';
import TimerIcon from '@mui/icons-material/Timer';

const PRIMARY_GREEN = '#07B37A';

const COLOR_SCHEMES = [
  { id: 'professional', name: 'Professional', colors: ['#1976d2', '#424242', '#f5f5f5'] },
  { id: 'vibrant', name: 'Vibrant', colors: ['#ff5722', '#ff9800', '#ffc107'] },
  { id: 'minimal', name: 'Minimal', colors: ['#000000', '#ffffff', '#f0f0f0'] },
  { id: 'custom', name: 'Custom', colors: [] }
];

const STYLE_OPTIONS = [
  { id: 'corporate', name: 'Corporate', description: 'Professional business style' },
  { id: 'creative', name: 'Creative', description: 'Modern and artistic design' },
  { id: 'academic', name: 'Academic', description: 'Clean educational layout' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and focused design' }
];

const ANIMATION_OPTIONS = [
  { id: 'none', name: 'None', description: 'No animations' },
  { id: 'subtle', name: 'Subtle', description: 'Light transitions' },
  { id: 'dynamic', name: 'Dynamic', description: 'Engaging animations' }
];

export default function PreferenceCollectionPanel({ onPreferencesUpdate, onComplete }) {
  const [preferences, setPreferences] = useState({
    colorScheme: 'professional',
    customColors: ['#07B37A', '#ffffff'],
    style: 'corporate',
    animation: 'subtle',
    audienceLevel: 'business',
    duration: 15,
    fontPreference: 'modern'
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [customColorInput, setCustomColorInput] = useState('#07B37A');

  const steps = [
    { id: 'colors', title: 'Color Preferences', icon: <PaletteIcon /> },
    { id: 'style', title: 'Design Style', icon: <StyleIcon /> },
    { id: 'animation', title: 'Animation Level', icon: <AnimationIcon /> },
    { id: 'audience', title: 'Target Audience', icon: <PeopleIcon /> },
    { id: 'duration', title: 'Presentation Length', icon: <TimerIcon /> }
  ];

  const handlePreferenceChange = (key, value) => {
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    onPreferencesUpdate?.(updatedPreferences);
  };

  const addCustomColor = () => {
    if (customColorInput && !preferences.customColors.includes(customColorInput)) {
      const newColors = [...preferences.customColors, customColorInput];
      handlePreferenceChange('customColors', newColors);
      setCustomColorInput('#07B37A');
    }
  };

  const removeCustomColor = (colorToRemove) => {
    const newColors = preferences.customColors.filter(color => color !== colorToRemove);
    handlePreferenceChange('customColors', newColors);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.(preferences);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'colors':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Choose your color scheme
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {COLOR_SCHEMES.map((scheme) => (
                <Grid item xs={6} key={scheme.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: preferences.colorScheme === scheme.id ? `2px solid ${PRIMARY_GREEN}` : '1px solid #e0e0e0',
                      '&:hover': { boxShadow: 2 }
                    }}
                    onClick={() => handlePreferenceChange('colorScheme', scheme.id)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {scheme.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        {scheme.colors.map((color, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 24,
                              height: 24,
                              bgcolor: color,
                              borderRadius: '50%',
                              border: '1px solid #ddd'
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {preferences.colorScheme === 'custom' && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Add Custom Colors
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    type="color"
                    value={customColorInput}
                    onChange={(e) => setCustomColorInput(e.target.value)}
                    sx={{ width: 60 }}
                  />
                  <TextField
                    size="small"
                    value={customColorInput}
                    onChange={(e) => setCustomColorInput(e.target.value)}
                    placeholder="#07B37A"
                    sx={{ flex: 1 }}
                  />
                  <Button onClick={addCustomColor} variant="outlined" size="small">
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {preferences.customColors.map((color) => (
                    <Chip
                      key={color}
                      label={color}
                      onDelete={() => removeCustomColor(color)}
                      sx={{ bgcolor: color, color: 'white' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        );

      case 'style':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select your presentation style
            </Typography>
            <Grid container spacing={2}>
              {STYLE_OPTIONS.map((style) => (
                <Grid item xs={6} key={style.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: preferences.style === style.id ? `2px solid ${PRIMARY_GREEN}` : '1px solid #e0e0e0',
                      '&:hover': { boxShadow: 2 }
                    }}
                    onClick={() => handlePreferenceChange('style', style.id)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {style.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {style.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 'animation':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Choose animation level
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={preferences.animation}
                onChange={(e) => handlePreferenceChange('animation', e.target.value)}
              >
                {ANIMATION_OPTIONS.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio sx={{ color: PRIMARY_GREEN, '&.Mui-checked': { color: PRIMARY_GREEN } }} />}
                    label={
                      <Box>
                        <Typography variant="subtitle1">{option.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 'audience':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Who is your target audience?
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={preferences.audienceLevel}
                onChange={(e) => handlePreferenceChange('audienceLevel', e.target.value)}
              >
                <FormControlLabel
                  value="executive"
                  control={<Radio sx={{ color: PRIMARY_GREEN, '&.Mui-checked': { color: PRIMARY_GREEN } }} />}
                  label="Executive Level (High-level overview)"
                />
                <FormControlLabel
                  value="business"
                  control={<Radio sx={{ color: PRIMARY_GREEN, '&.Mui-checked': { color: PRIMARY_GREEN } }} />}
                  label="Business Professional (Balanced detail)"
                />
                <FormControlLabel
                  value="technical"
                  control={<Radio sx={{ color: PRIMARY_GREEN, '&.Mui-checked': { color: PRIMARY_GREEN } }} />}
                  label="Technical Team (Detailed information)"
                />
                <FormControlLabel
                  value="general"
                  control={<Radio sx={{ color: PRIMARY_GREEN, '&.Mui-checked': { color: PRIMARY_GREEN } }} />}
                  label="General Audience (Easy to understand)"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 'duration':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Expected presentation duration
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={preferences.duration}
                onChange={(e, value) => handlePreferenceChange('duration', value)}
                min={5}
                max={60}
                step={5}
                marks={[
                  { value: 5, label: '5 min' },
                  { value: 15, label: '15 min' },
                  { value: 30, label: '30 min' },
                  { value: 60, label: '1 hour' }
                ]}
                valueLabelDisplay="on"
                sx={{
                  color: PRIMARY_GREEN,
                  '& .MuiSlider-thumb': { bgcolor: PRIMARY_GREEN },
                  '& .MuiSlider-track': { bgcolor: PRIMARY_GREEN },
                  '& .MuiSlider-rail': { bgcolor: '#ddd' }
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Current selection: {preferences.duration} minutes
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Progress Steps */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            {steps.map((step, index) => (
              <Box key={step.id} sx={{ textAlign: 'center', flex: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: index <= currentStep ? PRIMARY_GREEN : '#e0e0e0',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1
                  }}
                >
                  {step.icon}
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: index <= currentStep ? PRIMARY_GREEN : '#666',
                    fontWeight: index === currentStep ? 600 : 400
                  }}
                >
                  {step.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Step Content */}
        <Box sx={{ minHeight: 300, mb: 3 }}>
          {renderStepContent()}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={prevStep} 
            disabled={currentStep === 0}
            variant="outlined"
          >
            Previous
          </Button>
          <Button 
            onClick={nextStep}
            variant="contained"
            sx={{ 
              bgcolor: PRIMARY_GREEN,
              '&:hover': { bgcolor: '#06A36D' }
            }}
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 