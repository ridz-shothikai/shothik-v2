import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';

const MODEL_OPTIONS = [
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'gemini-ultra', label: 'Gemini Ultra' },
];

const AgentSettingsDialog = ({ open, onClose, settings = {}, onSave }) => {
  const [form, setForm] = useState({
    apiEndpoint: '',
    defaultModel: '',
    darkMode: false,
    ...settings,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      apiEndpoint: '',
      defaultModel: '',
      darkMode: false,
      ...settings,
    });
    setErrors({});
  }, [open, settings]);

  const handleChange = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.apiEndpoint) errs.apiEndpoint = 'API endpoint is required';
    if (!form.defaultModel) errs.defaultModel = 'Default model is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(form);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Agent Global Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="API Endpoint"
            value={form.apiEndpoint}
            onChange={handleChange('apiEndpoint')}
            error={!!errors.apiEndpoint}
            helperText={errors.apiEndpoint}
            fullWidth
          />
          <TextField
            label="Default Model"
            select
            value={form.defaultModel}
            onChange={handleChange('defaultModel')}
            error={!!errors.defaultModel}
            helperText={errors.defaultModel}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {MODEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </TextField>
          <FormControlLabel
            control={<Switch checked={form.darkMode} onChange={handleChange('darkMode')} />}
            label="Enable Dark Mode"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentSettingsDialog; 