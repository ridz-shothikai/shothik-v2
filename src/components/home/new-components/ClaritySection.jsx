"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Upload,
  Brain,
  Shield,
  Download,
  Zap,
  Lock,
} from "lucide-react";
import EmailModal from "../EmailCollectModal";
import { useComponentTracking } from "../../../hooks/useComponentTracking";
import { trackingList } from "../../../libs/trackingList";
import { useRegisterUserToBetaListMutation } from "../../../redux/api/auth/authApi";

// Styled components to match Tailwind styles
const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#00B8D914",
  color: "#006C9C",
  border: "1px solid #bfdbfe",
  padding: "8px 16px",
  height: "auto",
  fontWeight: "600",
  "& .MuiChip-label": {
    fontSize: "0.8125rem", // default
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: 0,
    [theme.breakpoints.up("lg")]: {
      fontSize: "1rem",
    },
  },
}));


const StepCard = styled(Paper)(({ theme }) => ({
  backgroundColor: "#f9fafb", // gray-50
  borderRadius: "16px",
  padding: "32px",
  height: "100%",
  border: "2px solid transparent",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#a7f3d0", // emerald-200
    backgroundColor: "rgba(16, 185, 129, 0.05)", // emerald-50/50
  },
}));

const IconContainer = styled(Box)({
  width: { xs: "28px", sm: "32px", md: "40px", lg: "44px", xl: "48px" },
  height: { xs: "28px", sm: "32px", md: "40px", lg: "44px", xl: "48px" },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export default function ClaritySection() {
  const { componentRef, trackClick } = useComponentTracking(
    trackingList.PROCESS_STEP
  );

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [showModal, setShowModal] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // 'success', 'error', 'warning', 'info'
  });

    const [
      registerUserForBetaList,
      { isLoading: registerUserProcessing, isError: registerUserError },
    ] = useRegisterUserToBetaListMutation();  

  const handleStepClick = (idx) => {
    // trackFeatureClick will be added later
    // console.log(`Step clicked: ${step}`);

    // tracking
    trackClick(trackingList.PROCESS_STEP_CLICK, {
      step_id: `step-${idx}`,
      position: "process_step_section",
    });
  };

  const handleBenefitClick = (benefit) => {
    // trackFeatureClick will be added later
    console.log(`Benefit clicked: ${benefit}`);
  };

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

  const steps = [
    {
      id: "upload",
      icon: "/home/cl-1.svg",
      title: "Upload Your Document",
      description:
        "Drag and drop any file up to 156 pages. We support Word docs, PDFs, and text files.",
      details: "Supports .docx, .pdf, .txt formats",
    },
    {
      id: "select",
      icon: "/home/cl-2.svg",
      title: "Choose Your Domain",
      description:
        "Select medical, law, engineering, or general academic writing for specialized AI processing.",
      details: "Domain-specific training data",
    },
    {
      id: "freeze",
      icon: "/home/cl-3.svg",
      title: "Freeze What Matters",
      description:
        "Mark important sentences, citations, or technical terms to keep them unchanged.",
      details: "Precision control over your content",
    },
    {
      id: "process",
      icon: "/home/cl-4.svg",
      title: "AI Processes Your Text",
      description:
        "Our specialized AI rewrites your content while maintaining academic integrity and domain accuracy.",
      details: "Average processing time: 2-3 seconds",
    },
    {
      id: "review",
      icon: "/home/cl-5.svg",
      title: "Plagiarism Check Included",
      description:
        "Built-in plagiarism detection ensures your improved text is original and safe to submit.",
      details: "Real-time originality verification",
    },
    {
      id: "download",
      icon: "/home/cl-6.svg",
      title: "Download & Submit",
      description:
        "Get your improved document in the same format, ready for submission to your professor.",
      details: "Maintains original formatting",
    },
  ];

  return (
    <>
      <Box
        ref={componentRef}
        component="section"
        sx={{
          pt: { xs: 2, sm: 3, xl: 4 },
          pb: { xs: 7, sm: 9, xl: 12 },
          backgroundColor: isDarkMode ? "inherit" : "#ffffff",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                textAlign: "center",
                maxWidth: "768px",
                mx: "auto",
                mb: { xs: 5, md: 10 },
              }}
            >
              <StyledChip
                label={
                  <>
                    {/* <Zap size={16} /> */}
                    How It Works
                  </>
                }
                sx={{ mb: 2 }}
              />

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem", lg: "3rem" },
                  fontWeight: 700,
                  color: isDarkMode ? "inherit" : "#111827", // gray-900
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                From Upload to{" "}
                <Box
                  component="span"
                  sx={{ display: "block", color: "#00AB55" }}
                >
                  Perfect Paper
                </Box>
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    fontSize: { xs: "1.5rem", sm: "1.875rem", lg: "2.25rem" },
                    color: isDarkMode ? "inherit" : "#374151", // gray-700
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  in 6 Simple Steps
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontSize: "1.25rem",
                  color: isDarkMode ? "inherit" : "#4b5563", // gray-600
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                No complex setup. No learning curve. Just upload your document
                and let our domain-expert AI transform your writing while
                keeping what matters most.
              </Typography>
            </Box>
          </motion.div>

          {/* How It Works Steps */}
          <Grid container spacing={4} sx={{ mb: { xs: 5, md: 10 } }}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={6} lg={4} key={step.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <StepCard
                    elevation={0}
                    onClick={() => handleStepClick(index + 1)}
                    sx={{
                      position: "relative",
                      "&:hover": {
                        borderColor: isDarkMode ? "inherit" : "#a7f3d0", // emerald-200
                        backgroundColor: isDarkMode
                          ? "#FFF"
                          : "rgba(16, 185, 129, 0.05)", // emerald-50/50
                      },
                    }}
                  >
                    {/* Step number and icon */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: { xs: 1.5, md: 2, xl: 3 },
                      }}
                    >
                      <IconContainer>
                        <Box
                          component="img"
                          src={step.icon}
                          alt={step.title}
                          sx={{
                            width: { xs: 28, sm: 28, md: 36, lg: 40, xl: 44 },
                            height: { xs: 28, sm: 28, md: 36, lg: 40, xl: 44 },
                          }}
                        />
                      </IconContainer>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-end",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "2rem",
                              sm: "1.75rem",
                              md: "2rem",
                              lg: "2.5rem",
                              xl: "3rem",
                            },
                            fontWeight: 900,
                            color: "#00AB55",
                            transition: "color 0.3s ease",
                            lineHeight: 0.7,
                            // ".MuiPaper-root:hover &": {
                            //   color: "rgba(16, 185, 129, 0.4)", // emerald-600/40
                            // },
                          }}
                        >
                          {index + 1}
                        </Typography>
                        {/* Connection line for larger screens */}

                        <Box
                          sx={{
                            width: { xs: "26px", lg: "28px", xl: "32px" },
                            height: "2px",
                            backgroundColor: "#00AB55",
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#111827", // gray-900
                        mb: 1.5,
                        fontSize: {
                          xs: "1.15rem",
                          md: "1.15rem",
                          lg: "1.25rem",
                          xl: "1.5rem",
                        },
                      }}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#4b5563", // gray-600
                        lineHeight: 1.6,
                        mb: 2,
                      }}
                    >
                      {step.description}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: "#059669", // emerald-600
                        fontWeight: 500,
                      }}
                    >
                      {step.details}
                    </Typography>
                  </StepCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                setShowModal(true);

                // tracking
                trackClick("cta_button", {
                  button_text: "Get early access",
                  position: "process_step_cta",
                });
              }}
              sx={{
                maxWidth: "fit-content",
                borderRadius: "0.5rem",
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 3,
                py: 1.3,
                bgcolor: "#00AB55",
                fontWeight: "400"
              }}
            >
              Get early access
            </Button>
          </Box>
        </Container>
      </Box>

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
