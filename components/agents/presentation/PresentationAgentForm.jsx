import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const STYLE_OPTIONS = [
  { value: 'business', label: 'Business' },
  { value: 'educational', label: 'Educational' },
  { value: 'creative', label: 'Creative' },
  { value: 'minimal', label: 'Minimal' },
];

const DELIVERY_OPTIONS = [
  { value: 'live', label: 'Live Presentation' },
  { value: 'export-pdf', label: 'Export as PDF' },
  { value: 'export-ppt', label: 'Export as PPT' },
  { value: 'export-html', label: 'Export as HTML' },
];

const PresentationAgentForm = ({ onSubmit, defaultValues = {} }) => {
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      topic: '',
      style: '',
      delivery: '',
      ...defaultValues,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Presentation Name"
        {...register('name', { required: 'Presentation name is required' })}
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
        label="Content / Topic"
        {...register('topic', { required: 'Content or topic is required' })}
        error={!!errors.topic}
        helperText={errors.topic?.message}
        fullWidth
        multiline
        minRows={2}
      />
      <FormControl fullWidth error={!!errors.style}>
        <InputLabel id="style-label">Style / Theme</InputLabel>
        <Select
          labelId="style-label"
          label="Style / Theme"
          defaultValue=""
          {...register('style', { required: 'Style selection is required' })}
        >
          {STYLE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
        {errors.style && <Box sx={{ color: 'error.main', fontSize: 12, mt: 0.5 }}>{errors.style.message}</Box>}
      </FormControl>
      <FormControl fullWidth error={!!errors.delivery}>
        <InputLabel id="delivery-label">Delivery Option</InputLabel>
        <Select
          labelId="delivery-label"
          label="Delivery Option"
          defaultValue=""
          {...register('delivery', { required: 'Delivery option is required' })}
        >
          {DELIVERY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
        {errors.delivery && <Box sx={{ color: 'error.main', fontSize: 12, mt: 0.5 }}>{errors.delivery.message}</Box>}
      </FormControl>
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

export default PresentationAgentForm; 