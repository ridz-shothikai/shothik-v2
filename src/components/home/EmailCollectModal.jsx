"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useComponentTracking } from "../../hooks/useComponentTracking";
import { trackingList } from "../../libs/trackingList";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    maxWidth: "448px",
    width: "100%",
    margin: theme.spacing(2),
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
    "& fieldset": {
      borderColor: "#d1d5db",
    },
    "&:hover fieldset": {
      borderColor: "#9ca3af",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#059669",
      borderWidth: "2px",
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px 14px",
    fontSize: "16px",
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#059669",
  color: "white",
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "16px",
  "&:hover": {
    backgroundColor: "#047857",
  },
  "&:disabled": {
    backgroundColor: "#d1d5db",
    color: "#9ca3af",
  },
}));

const SkipButton = styled(Button)(({ theme }) => ({
  color: "#6b7280",
  padding: "8px 24px",
  textTransform: "none",
  fontSize: "16px",
  "&:hover": {
    color: "#374151",
    backgroundColor: "transparent",
  },
}));

export default function EmailModal({ open, onClose, onSubmit }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { componentRef, trackClick, trackFormInteraction, trackConversion } =
    useComponentTracking(trackingList.EMAIL_MODAL);
  const modalOpenTime = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const emailValue = watch("email");

  // Track modal open
  useEffect(() => {
    if (open) {
      modalOpenTime.current = Date.now();
      trackClick("modal_opened", {
        modal_type: "email_collection",
        trigger_source: "cta_button",
      });
    }
  }, [open, trackClick]);

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);

    try {
      // Call the onSubmit prop with the email
      if (onSubmit) {
        await onSubmit(data.email);
      }

      // Tracking successful conversion
      trackConversion("email_signup", data.email.length);

      trackFormInteraction("submit_success", "email");

      // Reset form and close modal
      reset();
      onClose();
    } catch (err) {
      console.log(err, "form err");
      setError("email", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
      trackFormInteraction("submit_error", "email", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    trackClick("modal_close", {
      close_method: "close_button",
      email_entered: emailValue?.length > 0,
      time_in_modal: Date.now() - modalOpenTime.current,
      form_completed: false,
    });
    reset();
    onClose();
  };

  return (
    <StyledDialog
      ref={componentRef}
      open={open}
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
              Join & get early access
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#4b5563",
                fontSize: "16px",
                lineHeight: 1.5,
              }}
            >
              Join 26,000+ students getting writing assistence and early access
              to new features.
            </Typography>

            <Box sx={{ mt: 2 }}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  }}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      type="email"
                      placeholder="Enter your email address"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Stack spacing={1.5}>
                  <SubmitButton
                    data-umami-event="Form: Join the waitlist"
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting ? "Subscribing..." : "Join the waitlist"}
                  </SubmitButton>

                  <SkipButton
                    data-umami-event="Form: Maybe later"
                    fullWidth
                    onClick={handleClose}
                    variant="text"
                    type="button"
                  >
                    Maybe later
                  </SkipButton>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
}

// Example usage component
// export function EmailModalExample() {
//   const [showModal, setShowModal] = useState(false);

//   const handleEmailSubmit = async (email) => {
//     console.log("Email submitted:", email);
//     // Here we would typically send the email to your backend
//     // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
//   };

//   return (
//     <Box>
//       <Button
//         variant="contained"
//         onClick={() => setShowModal(true)}
//         sx={{ mb: 2 }}
//       >
//         Show Email Modal
//       </Button>

//       <EmailModal
//         open={showModal}
//         onClose={() => setShowModal(false)}
//         onSubmit={handleEmailSubmit}
//       />
//     </Box>
//   );
// }
