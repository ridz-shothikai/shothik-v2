import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const RESPONSE_FORMATS = [
  { value: 'text', label: 'Text' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'json', label: 'JSON' },
];

const AgentConfigurationPanel = ({ config, onChange }) => {
  const handleSwitch = (key) => (event) => {
    onChange({ ...config, [key]: event.target.checked });
  };
  const handleSelect = (key) => (event) => {
    onChange({ ...config, [key]: event.target.value });
  };

  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Advanced Agent Settings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="response-format-label">Response Format</InputLabel>
            <Select
              labelId="response-format-label"
              label="Response Format"
              value={config.responseFormat || 'text'}
              onChange={handleSelect('responseFormat')}
            >
              {RESPONSE_FORMATS.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch checked={!!config.verbosity} onChange={handleSwitch('verbosity')} />}
            label="Verbose Output"
          />
          <FormControlLabel
            control={<Switch checked={!!config.advancedMode} onChange={handleSwitch('advancedMode')} />}
            label="Enable Advanced Mode"
          />
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
};

export default AgentConfigurationPanel; 