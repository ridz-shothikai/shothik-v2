"use client";

import { Box, Container, Grid, styled, Typography } from "@mui/material";
import {motion} from "framer-motion";
import { Brain, FileText, Globe, Shield } from "lucide-react";


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

export default function KeyBenefits() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        pb: { xs: 4, sm: 6, xl: 8 },
      }}
    >
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
              Built specifically for academic writing with features that generic
              paraphrasing tools simply don't offer.
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
    </Container>
  );
}
