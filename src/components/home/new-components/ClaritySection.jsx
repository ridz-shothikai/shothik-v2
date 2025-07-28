"use client";

import React from "react";
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
  CheckCircle,
  ArrowRight,
  FileText,
  Zap,
  Lock,
  Globe,
} from "lucide-react";

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

const BenefitIconContainer = styled(Box)(({ theme }) => ({
  width: "64px",
  height: "64px",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 16px",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
}));

const BenefitCard = styled(Box)({
  textAlign: "center",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const GuaranteeSection = styled(Box)({
  backgroundColor: "#111827", // gray-900
  borderRadius: "16px",
  padding: "48px 32px",
  textAlign: "center",
  marginTop: "64px",
});

const GuaranteeIconContainer = styled(Box)({
  width: "64px",
  height: "64px",
  backgroundColor: "#059669", // emerald-600
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 24px",
});

export default function ClaritySection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const handleStepClick = (step) => {
    // trackFeatureClick will be added later
    console.log(`Step clicked: ${step}`);
  };

  const handleBenefitClick = (benefit) => {
    // trackFeatureClick will be added later
    console.log(`Benefit clicked: ${benefit}`);
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

  const benefits = [
    {
      id: "domain_expert",
      icon: Brain,
      title: "Domain Expert AI",
      description:
        "Unlike generic tools, our AI understands medical terminology, legal concepts, and engineering principles.",
      stat: "98.7% accuracy",
    },
    {
      id: "plagiarism_safe",
      icon: Shield,
      title: "Plagiarism Protection",
      description:
        "Built-in detection ensures every sentence is original and safe for academic submission.",
      stat: "0% plagiarism rate",
    },
    {
      id: "large_files",
      icon: FileText,
      title: "Handle Large Documents",
      description:
        "Process entire dissertations, research papers, and thesis documents up to 156 pages.",
      stat: "156 pages max",
    },
    {
      id: "multilingual",
      icon: Globe,
      title: "100+ Languages",
      description:
        "Support for international students writing in English as a second language.",
      stat: "100+ languages",
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, sm: 12, xl: 15 },
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
              <Box component="span" sx={{ display: "block", color: "#059669" }}>
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
              No complex setup. No learning curve. Just upload your document and
              let our domain-expert AI transform your writing while keeping what
              matters most.
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

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #ecfdf5 0%, #dbeafe 100%)", // emerald-50 to blue-50
              borderRadius: "24px",
              p: { xs: 4, lg: 6 },
            }}
          >
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "1.875rem" },
                  fontWeight: 700,
                  color: "#111827", // gray-900
                  mb: 2,
                }}
              >
                Why Students Choose Shothik AI
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "1.125rem",
                  color: "#4b5563", // gray-600
                  maxWidth: "512px",
                  mx: "auto",
                  fontWeight: 400,
                }}
              >
                Built specifically for academic writing with features that
                generic paraphrasing tools simply don't offer.
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} lg={3} key={benefit.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <BenefitCard onClick={() => handleBenefitClick(benefit.id)}>
                      <BenefitIconContainer>
                        <benefit.icon size={32} color="#059669" />
                      </BenefitIconContainer>

                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1.125rem",
                          fontWeight: 700,
                          color: "#111827", // gray-900
                          mb: 1,
                        }}
                      >
                        {benefit.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#4b5563", // gray-600
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          mb: 1.5,
                        }}
                      >
                        {benefit.description}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "2rem",
                          fontWeight: 900,
                          color: "#059669", // emerald-600
                        }}
                      >
                        {benefit.stat}
                      </Typography>
                    </BenefitCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Simple Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <GuaranteeSection sx={{ p: { xs: 4, lg: 6 } }}>
            <Box sx={{ maxWidth: "768px", mx: "auto" }}>
              <GuaranteeIconContainer>
                <CheckCircle size={32} color="white" />
              </GuaranteeIconContainer>

              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "1.875rem" },
                  fontWeight: 700,
                  color: "#ffffff",
                  mb: 2,
                }}
              >
                Your Success is Guaranteed
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontSize: "1.25rem",
                  color: "#d1d5db", // gray-300
                  lineHeight: 1.6,
                  mb: 4,
                  fontWeight: 400,
                }}
              >
                If your improved paper doesn't meet your expectations, we'll
                revise it free or refund your credits. No questions asked.
              </Typography>

              <Button
                size="large"
                onClick={() => console.log("Guarantee CTA clicked")}
                sx={{
                  backgroundColor: "#059669", // emerald-600
                  color: "#ffffff",
                  px: 4,
                  py: 2,
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  borderRadius: "8px",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#047857", // emerald-700
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    transform: "scale(1.05)",
                  },
                }}
                endIcon={<ArrowRight size={20} />}
              >
                Try Risk-Free Today
              </Button>
            </Box>
          </GuaranteeSection>
        </motion.div>
      </Container>
    </Box>
  );
}
