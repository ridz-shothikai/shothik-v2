"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    Typography,
    Button,
    IconButton,
    Box,
    Stack
  } from '@mui/material';
  import { Close } from '@mui/icons-material';
  import { styled } from '@mui/material/styles';

  
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      borderRadius: '16px',
      maxWidth: '448px',
      width: '100%',
      margin: theme.spacing(2),
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
  }));
  
  const ClaimButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#059669',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: '#047857',
    },
  }));
  
  const DeclineButton = styled(Button)(({ theme }) => ({
    color: '#6b7280',
    padding: '8px 24px',
    textTransform: 'none',
    fontSize: '16px',
    '&:hover': {
      color: '#374151',
      backgroundColor: 'transparent',
    },
  }));


export default function ExitModal() {
    const [showExitIntent, setShowExitIntent] = useState(false);

    useEffect(() => {
      let isExitIntentShown = false;

      const handleMouseLeave = (e) => {
        if (!isExitIntentShown && e.clientY <= 0) {
          setShowExitIntent(true);
          isExitIntentShown = true;
        }
      };

      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }, []);

    const handleClose = () => {
      setShowExitIntent(false);
    };

    const handleClaimFree = () => {
      setShowExitIntent(false);
      window.open("/signup", "_blank");
    };

  return (
    <Box>
      {/* Demo button to show modal */}
      {/* <Button 
        variant="contained" 
        onClick={() => setShowExitIntent(true)}
        sx={{ mb: 2 }}
      >
        Show Exit Intent Modal
      </Button> */}

      <StyledDialog
        open={showExitIntent}
        onClose={handleClose}
        maxWidth={false}
      >
        <DialogContent sx={{ p: 4, position: 'relative' }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: '#9ca3af',
              '&:hover': {
                color: '#4b5563',
              }
            }}
          >
            <Close />
          </IconButton>

          <Box sx={{ textAlign: 'center' }}>
            <Stack spacing={2}>
              <Typography
                variant="h4"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: '#111827',
                  fontSize: '24px',
                  lineHeight: 1.2,
                }}
              >
                Wait! Don't Leave Yet
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#4b5563',
                  fontSize: '16px',
                  lineHeight: 1.5,
                }}
              >
                Get your first paper improved free. Join 50,000+ students already using Shothik AI.
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <ClaimButton
                  fullWidth
                  onClick={handleClaimFree}
                  variant="contained"
                >
                  Claim Free Paper Review
                </ClaimButton>

                <DeclineButton
                  fullWidth
                  onClick={handleClose}
                  variant="text"
                >
                  No thanks, I'll struggle with my writing
                </DeclineButton>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
      </StyledDialog>
    </Box>
  )
}