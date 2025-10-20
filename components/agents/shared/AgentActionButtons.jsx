import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';

const AgentActionButtons = ({
  onSubmit,
  onClear,
  onSave,
  disabled = false,
  showSave = false,
  loading = false,
}) => {
  return (
    <ButtonGroup variant="contained" color="primary" sx={{ mt: 2 }}>
      <Button
        onClick={onSubmit}
        disabled={disabled || loading}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
      <Button
        onClick={onClear}
        color="secondary"
        variant="outlined"
        startIcon={<ClearIcon />}
      >
        Clear
      </Button>
      {showSave && (
        <Button
          onClick={onSave}
          color="success"
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      )}
    </ButtonGroup>
  );
};

export default AgentActionButtons; 