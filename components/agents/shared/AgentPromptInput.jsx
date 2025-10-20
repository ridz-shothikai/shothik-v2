import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const AgentPromptInput = ({
  value,
  onChange,
  maxLength = 500,
  label = 'Prompt',
  helperText = '',
  ...props
}) => {
  const charCount = value ? value.length : 0;
  const isError = charCount > maxLength;

  return (
    <Box>
      <TextField
        label={label}
        value={value}
        onChange={e => onChange(e.target.value)}
        multiline
        minRows={3}
        maxRows={8}
        fullWidth
        error={isError}
        helperText={
          isError
            ? `Maximum length is ${maxLength} characters.`
            : helperText
        }
        inputProps={{ maxLength: maxLength * 2 }} // allow typing past max for error display
        {...props}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
        <Typography variant="caption" color={isError ? 'error.main' : 'text.secondary'}>
          {charCount} / {maxLength}
        </Typography>
      </Box>
    </Box>
  );
};

export default AgentPromptInput; 