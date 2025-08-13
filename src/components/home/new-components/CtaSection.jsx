"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { CheckCircle, Shield, Globe } from "lucide-react";
import EmailModal from "../EmailCollectModal";
import { useComponentTracking } from "../../../hooks/useComponentTracking";
import { trackingList } from "../../../libs/trackingList";
import { useRegisterUserToBetaListMutation } from "../../../redux/api/auth/authApi";

export default function CTASection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [showModal, setShowModal] = useState(false);

  const { componentRef, trackClick } = useComponentTracking(
    trackingList.START_WRITING_SECTION
  );  

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // 'success', 'error', 'warning', 'info'
  });

    const [
      registerUserForBetaList,
      { isLoading: registerUserProcessing, isError: registerUserError },
    ] = useRegisterUserToBetaListMutation();  

    const handleEmailSubmit = async (email) => {
      try {
        const result = await registerUserForBetaList({ email }).unwrap();

        console.log(result, "result");

        // Success toast
        setToast({
          open: true,
          message: "Successfully registered for beta! We'll be in touch soon.",
          severity: "success",
        });

        // Close the modal
        setShowModal(false);
      } catch (error) {
        // Error toast
        setToast({
          open: true,
          message:
            error?.data?.message || "Registration failed. Please try again.",
          severity: "error",
        });
      }
    };

    const handleCloseToast = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setToast((prev) => ({ ...prev, open: false }));
    };

  return (
    <>
      <Box
        ref={componentRef}
        component="section"
        sx={{
          py: { xs: 3, sm: 5, md: 10 },
          background: "linear-gradient(to right, #059669, #047857, #0f766e)", // emerald-600 to teal-700
          position: "relative",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: "80rem", // max-w-5xl
            px: { xs: 2, sm: 3, lg: 4 }, // px-4 sm:px-6 lg:px-8
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: "center" }}>
              {/* Main Heading */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.25rem", sm: "3rem" }, // text-4xl sm:text-5xl
                  fontWeight: 700, // font-bold
                  color: "white",
                  mb: 2, // mb-4
                  lineHeight: 1.1,
                  fontFamily:
                    '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', // font-display equivalent
                }}
              >
                Stop Struggling. Start Succeeding.
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h5"
                sx={{
                  fontSize: "1.25rem", // text-xl
                  color: "#a7f3d0", // text-emerald-100
                  mb: 4, // mb-8
                  maxWidth: "48rem", // max-w-3xl
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Leave it to us. Your next A+ paper is just 60 seconds away. Join
                students who've already transformed their academic success.
              </Typography>

              {/* CTA Button Section */}
              <Box sx={{ maxWidth: "28rem", mx: "auto", mb: 3 }}>
                {" "}
                {/* max-w-md */}
                <Box sx={{ position: "relative", mb: 3 }}>
                  {/* Enhanced CTA Button */}
                  <Button
                    variant="contained"
                    onClick={() => {
                      setShowModal(true);

                      // tracking
                      trackClick(trackingList.CTA_BUTTON, {
                        button_text: "Start Writing Better Papers Now",
                        postion: "start_writing_section",
                      });
                    }}
                    fullWidth
                    sx={{
                      backgroundColor: "white",
                      color: "#059669", // text-emerald-600
                      fontWeight: 700, // font-bold
                      height: "4rem", // h-16
                      px: 4, // px-8
                      fontSize: "1.125rem", // text-lg
                      position: "relative",
                      overflow: "hidden",
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // shadow-lg
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#ecfdf5", // hover:bg-emerald-50
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // hover:shadow-xl
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(to right, transparent, rgba(167, 243, 208, 0.2), transparent)",
                        transform: "skewX(-12deg) translateX(-100%)",
                        transition: "transform 1s ease",
                        zIndex: 0,
                      },
                      "&:hover::before": {
                        transform: "skewX(-12deg) translateX(100%)",
                      },
                      "& .MuiButton-label, & > span": {
                        position: "relative",
                        zIndex: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Start Writing Better Papers Now
                    </Box>
                  </Button>

                  {/* Scarcity indicator */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "-0.5rem", // -bottom-2
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#ea580c", // bg-orange-500
                      color: "white",
                      fontSize: "0.75rem", // text-xs
                      fontWeight: 700, // font-bold
                      px: 1.5, // px-3
                      py: 0.5, // py-1
                      borderRadius: "9999px", // rounded-full
                      whiteSpace: "nowrap",
                    }}
                  >
                    457 spots left this month
                  </Box>
                </Box>
                {/* Guarantee text */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#a7f3d0", // text-emerald-100
                      fontSize: "0.875rem", // text-sm
                    }}
                  >
                    No credit card • 14-day guarantee • Instant access
                  </Typography>
                </Box>
              </Box>

              {/* Trust Indicators */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 3 }}
                alignItems="center"
                justifyContent="center"
                sx={{
                  mb: 2, // mb-4
                  fontSize: "0.875rem", // text-sm
                  color: "#a7f3d0", // text-emerald-100
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CheckCircle size={16} />
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    14-day free trial
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Shield size={16} />
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    No credit card required
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Globe size={16} />
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    Available worldwide
                  </Typography>
                </Box>
              </Stack>

              {/* Payment Methods */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  opacity: 0.8,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.75rem", // text-xs
                    color: "#bbf7d0", // text-emerald-200
                  }}
                >
                  Accepted payments:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "0.75rem", // text-xs
                    color: "#bbf7d0", // text-emerald-200
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    Visa
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    •
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    Mastercard
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    •
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    bKash
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    •
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    UPI
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* email collect modal */}
      <EmailModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleEmailSubmit}
      />

      {/* Toast notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>       
    </>
  );
}