"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    Typography,
    Button,
    IconButton,
    Box,
    Stack,
    useTheme
  } from '@mui/material';
  import { Close } from '@mui/icons-material';
  import { styled } from '@mui/material/styles';
import { useComponentTracking } from "../../hooks/useComponentTracking";
import { trackingList } from "../../libs/trackingList";
import {useExitIntent} from "../../hooks/useExitIntent"

  
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


export default function ExitModal({setOpen}) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [showExitIntent, setShowExitIntent] = useState(false);
  const { componentRef, trackClick } = useComponentTracking(
    trackingList.EXIT_INTENT_MODAL
  );

  // Exit intent for modal
  useExitIntent(() => {
    if (showExitIntent) {
      trackClick("exit_intent_in_modal", {
        open_modal_time: Date.now(),
      });
    }
  });

  useEffect(() => {
    let isExitIntentShown = false;

    // Handle browser close/refresh attempts
    const handleBeforeUnload = (e) => {
      if (!isExitIntentShown) {
        // Prevent the default browser dialog
        e.preventDefault();

        // Show our custom modal
        setShowExitIntent(true);
        isExitIntentShown = true;

        // For older browsers compatibility
        e.returnValue = "";
        return "";
      }
    };

    // Handle keyboard shortcuts (Ctrl+W, Ctrl+F4, Alt+F4, etc.)
    const handleKeyDown = (e) => {
      if (!isExitIntentShown) {
        // Ctrl+W (close tab), Ctrl+F4 (close tab), Ctrl+R (refresh), F5 (refresh)
        if (
          (e.ctrlKey &&
            (e.key === "w" ||
              e.key === "W" ||
              e.key === "r" ||
              e.key === "R")) ||
          (e.ctrlKey && e.key === "F4") ||
          (e.altKey && e.key === "F4") ||
          e.key === "F5"
        ) {
          e.preventDefault();
          setShowExitIntent(true);
          isExitIntentShown = true;
        }
      }
    };

    // Handle mouse leave (moving cursor to close button area)
    const handleMouseLeave = (e) => {
      if (!isExitIntentShown && e.clientY <= 0) {
        setShowExitIntent(true);
        isExitIntentShown = true;
      }
    };

    // Handle browser navigation (back button, etc.)
    const handlePopState = (e) => {
      if (!isExitIntentShown) {
        setShowExitIntent(true);
        isExitIntentShown = true;
        // Push the current state back to prevent actual navigation
        window.history.pushState(null, "", window.location.href);
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("popstate", handlePopState);

    // Push initial state for popstate handling
    window.history.pushState(null, "", window.location.href);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleClose = () => {
    setShowExitIntent(false);
  };

  const handleClaimFree = () => {
    setShowExitIntent(false);
    setOpen(true);
    // window.open("/signup", "_blank");
  };

  return (
    <Box ref={componentRef}>
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
        <DialogContent sx={{ p: 4, position: "relative" }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "#9ca3af",
              "&:hover": {
                color: "#4b5563",
              },
            }}
          >
            <Close />
          </IconButton>

          <Box sx={{ textAlign: "center" }}>
            <Stack spacing={2}>
              <Typography
                variant="h4"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: isDarkMode ? "#FFF" : "#111827",
                  fontSize: "24px",
                  lineHeight: 1.2,
                }}
              >
                Wait! Don't Leave Yet
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#4b5563",
                  fontSize: "16px",
                  lineHeight: 1.5,
                }}
              >
                Get your first paper improved free. Join 50,000+ students
                already using Shothik AI.
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <ClaimButton
                  data-umami-event="Claim Free Paper Review"
                  fullWidth
                  onClick={handleClaimFree}
                  variant="contained"
                >
                  Claim Free Paper Review
                </ClaimButton>

                <DeclineButton
                  data-umami-event="No thanks, I'll struggle with my writing"
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
  );
}