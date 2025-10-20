import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const MODEL_OPTIONS = [
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'gemini-ultra', label: 'Gemini Ultra' },
];

const SuperAgentForm = ({ onSubmit, defaultValues = {} }) => {
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      apiKey: '',
      model: '',
      temperature: 0.7,
      ...defaultValues,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Agent Name"
        {...register('name', { required: 'Agent name is required' })}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
      />
      <TextField
        label="Description"
        {...register('description')}
        fullWidth
        multiline
        minRows={2}
      />
      <TextField
        label="API Key"
        type="password"
        {...register('apiKey', { required: 'API key is required' })}
        error={!!errors.apiKey}
        helperText={errors.apiKey?.message}
        fullWidth
      />
      <FormControl fullWidth error={!!errors.model}>
        <InputLabel id="model-label">Model</InputLabel>
        <Select
          labelId="model-label"
          label="Model"
          defaultValue=""
          {...register('model', { required: 'Model selection is required' })}
        >
          {MODEL_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
        {errors.model && <Box sx={{ color: 'error.main', fontSize: 12, mt: 0.5 }}>{errors.model.message}</Box>}
      </FormControl>
      <TextField
        label="Temperature"
        type="number"
        inputProps={{ min: 0, max: 1, step: 0.01 }}
        {...register('temperature', {
          valueAsNumber: true,
          min: { value: 0, message: 'Min is 0' },
          max: { value: 1, message: 'Max is 1' },
        })}
        error={!!errors.temperature}
        helperText={errors.temperature?.message || 'Controls randomness (0 = deterministic, 1 = very random)'}
        fullWidth
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
          Save
        </Button>
        <Button type="button" variant="outlined" color="secondary" onClick={() => reset()}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default SuperAgentForm; 