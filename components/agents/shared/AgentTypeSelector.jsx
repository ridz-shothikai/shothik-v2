import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const AGENT_TYPES = [
  {
    value: 'super',
    label: 'Super Agent',
    icon: <SmartToyIcon />,
  },
  {
    value: 'presentation',
    label: 'Presentation Agent',
    icon: <SlideshowIcon />,
  },
];

const AgentTypeSelector = ({ value, onChange }) => {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Select Agent Type
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, newValue) => newValue && onChange(newValue)}
        aria-label="Agent Type Selector"
        color="primary"
      >
        {AGENT_TYPES.map((type) => (
          <ToggleButton key={type.value} value={type.value} aria-label={type.label} sx={{ minWidth: 160 }}>
            {type.icon}
            <Box component="span" sx={{ ml: 1 }}>{type.label}</Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default AgentTypeSelector; 