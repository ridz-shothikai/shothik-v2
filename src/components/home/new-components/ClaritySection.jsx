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

// Styled components to match Tailwind styles
const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#dbeafe", // blue-50
  color: "#1d4ed8", // blue-700
  border: "1px solid #bfdbfe", // blue-200
  padding: "8px 16px",
  height: "auto",
  "& .MuiChip-label": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: 0,
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
  width: "48px",
  height: "48px",
  backgroundColor: "#059669", // emerald-600
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export default function ClaritySection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [showModal, setShowModal] = useState(false);

  const handleStepClick = (step) => {
    // trackFeatureClick will be added later
    console.log(`Step clicked: ${step}`);
  };

  const handleBenefitClick = (benefit) => {
    // trackFeatureClick will be added later
    console.log(`Benefit clicked: ${benefit}`);
  };

  const handleEmailSubmit = async (email) => {
    console.log("Email submitted:", email);
    // Here we would typically send the email to your backend
    // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
  };

  const steps = [
    {
      id: "upload",
      icon: Upload,
      title: "Upload Your Document",
      description:
        "Drag and drop any file up to 156 pages. We support Word docs, PDFs, and text files.",
      details: "Supports .docx, .pdf, .txt formats",
    },
    {
      id: "select",
      icon: Brain,
      title: "Choose Your Domain",
      description:
        "Select medical, law, engineering, or general academic writing for specialized AI processing.",
      details: "Domain-specific training data",
    },
    {
      id: "freeze",
      icon: Lock,
      title: "Freeze What Matters",
      description:
        "Mark important sentences, citations, or technical terms to keep them unchanged.",
      details: "Precision control over your content",
    },
    {
      id: "process",
      icon: Zap,
      title: "AI Processes Your Text",
      description:
        "Our specialized AI rewrites your content while maintaining academic integrity and domain accuracy.",
      details: "Average processing time: 2-3 seconds",
    },
    {
      id: "review",
      icon: Shield,
      title: "Plagiarism Check Included",
      description:
        "Built-in plagiarism detection ensures your improved text is original and safe to submit.",
      details: "Real-time originality verification",
    },
    {
      id: "download",
      icon: Download,
      title: "Download & Submit",
      description:
        "Get your improved document in the same format, ready for submission to your professor.",
      details: "Maintains original formatting",
    },
  ];

  return (
    <>
      <Box
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
                    <Zap size={16} />
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
                  sx={{ display: "block", color: "#059669" }}
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
                    onClick={() => handleStepClick(step.id)}
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
                        mb: 3,
                      }}
                    >
                      <IconContainer>
                        <step.icon size={24} color="white" />
                      </IconContainer>
                      <Typography
                        sx={{
                          fontSize: "3rem",
                          fontWeight: 900,
                          color: "rgba(16, 185, 129, 0.2)", // emerald-600/20
                          transition: "color 0.3s ease",
                          ".MuiPaper-root:hover &": {
                            color: "rgba(16, 185, 129, 0.4)", // emerald-600/40
                          },
                        }}
                      >
                        {index + 1}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#111827", // gray-900
                        mb: 1.5,
                        fontSize: "1.25rem",
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

                    {/* Connection line for larger screens */}
                    {index < steps.length - 1 && !isTablet && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "80px",
                          right: "-16px",
                          width: "32px",
                          height: "2px",
                          backgroundColor: "#a7f3d0", // emerald-200
                          display: { xs: "none", lg: "block" },
                        }}
                      />
                    )}
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
              onClick={() => setShowModal(true)}
              sx={{
                bgcolor: "#059669",
                color: "white",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(76, 175, 80, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
                },
                minWidth: { xs: "200px", sm: "auto" },
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
    </>
  );
}
