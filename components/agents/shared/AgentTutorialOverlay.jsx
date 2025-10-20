import React, { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const LOCAL_STORAGE_KEY = 'agents_tutorial_completed';

// Example step: { title, description, targetSelector, image, icon }
const defaultSteps = [
  {
    title: 'Welcome to Agents!',
    description: 'This tutorial will guide you through the main features of the Agents UI.',
  },
  {
    title: 'Sidebar Navigation',
    description: 'Use the sidebar to switch between different agents and features.',
    targetSelector: '#agent-sidebar',
  },
  {
    title: 'Agent Actions',
    description: 'Interact with agents using the action buttons and forms.',
    targetSelector: '#agent-action-buttons',
  },
  {
    title: 'History & Settings',
    description: 'Review your history and adjust settings from the top right.',
    targetSelector: '#agent-settings',
  },
];

const highlightStyle = {
  position: 'absolute',
  zIndex: 1402,
  boxShadow: '0 0 0 4px #1976d2AA',
  borderRadius: 8,
  pointerEvents: 'none',
  transition: 'all 0.3s',
};

const AgentTutorialOverlay = ({
  open,
  onClose,
  steps = defaultSteps,
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completed, setCompleted] = useState(false);
  const [highlightRect, setHighlightRect] = useState(null);
  const dialogRef = useRef();

  useEffect(() => {
    if (open) {
      setCurrentStep(initialStep);
      setCompleted(false);
    }
  }, [open, initialStep]);

  useEffect(() => {
    if (!open) return;
    const step = steps[currentStep];
    if (step && step.targetSelector) {
      const el = document.querySelector(step.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setHighlightRect({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setHighlightRect(null);
      }
    } else {
      setHighlightRect(null);
    }
  }, [open, currentStep, steps]);

  useEffect(() => {
    if (completed) {
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
      onClose && onClose();
    }
  }, [completed, onClose]);

  useEffect(() => {
    // Prevent background scroll when overlay is open
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      setCompleted(true);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };
  const handleBack = () => {
    setCurrentStep((s) => (s > 0 ? s - 1 : 0));
  };
  const handleSkip = () => {
    setCompleted(true);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handleBack();
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, currentStep, isLast]);

  // Only return null after all hooks
  if (!open || completed) return null;

  return (
    <>
      {/* Overlay (backdrop) - zIndex 1400 */}
      <Box
        sx={{
          position: 'fixed',
          zIndex: 1400,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      {/* Highlighted element */}
      {highlightRect && (
        <Box
          sx={{
            ...highlightStyle,
            top: highlightRect.top,
            left: highlightRect.left,
            width: highlightRect.width,
            height: highlightRect.height,
          }}
        />
      )}
      {/* Tutorial Dialog - zIndex 1403 */}
      <Dialog
        open={open}
        onClose={handleSkip}
        maxWidth="xs"
        fullWidth
        aria-labelledby="tutorial-dialog-title"
        ref={dialogRef}
        PaperProps={{ sx: { zIndex: 1403, position: 'fixed' } }}
      >
        <DialogTitle id="tutorial-dialog-title" sx={{ pr: 5 }}>
          {step.title}
          <IconButton
            aria-label="Close tutorial"
            onClick={handleSkip}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {step.description}
          </Typography>
          {step.image && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <img src={step.image} alt="Tutorial step" style={{ maxWidth: '100%' }} />
            </Box>
          )}
          {step.icon && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>{step.icon}</Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSkip} color="secondary" variant="outlined">
            Skip
          </Button>
          <Button onClick={handleBack} disabled={currentStep === 0} color="primary">
            Back
          </Button>
          <Button onClick={handleNext} color="primary" variant="contained">
            {isLast ? 'Finish' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AgentTutorialOverlay; 