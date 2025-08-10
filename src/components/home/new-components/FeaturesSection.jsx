"use client";

import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Brain, Palette, Zap, Languages, Shield, Rocket } from "lucide-react";
import { useComponentTracking } from "../../../hooks/useComponentTracking";
import { trackingList } from "../../../libs/trackingList";

const features = [
  {
    icon: Brain,
    title: "Write Like You, Not a Robot",
    description:
      "Transform AI-generated text into authentic writing that sounds like your natural voice. Pass every human review.",
    color: "#065f46", // emerald-700
    bgColor: "#d1fae5", // emerald-100
  },
  {
    icon: Palette,
    title: "Freeze What Matters",
    description:
      "Protect your critical ideas, citations, and technical terms while improving everything else. You control what changes.",
    color: "#1d4ed8", // blue-700
    bgColor: "#dbeafe", // blue-100
  },
  {
    icon: Zap,
    title: "From Panic to Perfect",
    description:
      "Turn hours of rewriting into minutes. Meet every deadline without sacrificing quality or pulling all-nighters.",
    color: "#a16207", // yellow-700
    bgColor: "#fef3c7", // yellow-100
  },
  {
    icon: Languages,
    title: "Research in Any Language",
    description:
      "Access global research in 100+ languages. Write your papers in perfect English, regardless of your background.",
    color: "#7c3aed", // purple-700
    bgColor: "#e9d5ff", // purple-100
  },
  {
    icon: Shield,
    title: "Never Get Flagged Again",
    description:
      "Your work passes every plagiarism check and AI detector. Submit with complete confidence.",
    color: "#0f766e", // teal-700
    bgColor: "#ccfbf1", // teal-100
  },
  {
    icon: Rocket,
    title: "Academic to Professional",
    description:
      "One platform that grows with you from student assignments to career success. Build skills that last.",
    color: "#4338ca", // indigo-700
    bgColor: "#e0e7ff", // indigo-100
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function FeaturesSection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { componentRef } = useComponentTracking(
    trackingList.FEATURE_SECTION
  );  

  return (
    <Box
      ref={componentRef}
      component="section"
      sx={{
        pt: { xs: 4, sm: 6, xl: 8 },
        pb: { xs: 8, sm: 12, xl: 15 },
        backgroundColor: isDarkMode ? "inherit" : "#f8fafc", // gray-50
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Header Section */}
          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 4, sm: 6, md: 10 },
              maxWidth: "4xl",
              mx: "auto",
            }}
          >
            <motion.div variants={itemVariants}>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  fontWeight: 800,
                  color: isDarkMode ? "white" : "#111827", // gray-900
                  mb: 4,
                  lineHeight: 1.2,
                }}
              >
                Powerful Features for Better Writing
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                component="p"
                sx={{
                  fontSize: { xs: "1.125rem", md: "1.25rem" },
                  color: "#6b7280", // gray-500
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: "42rem",
                  mx: "auto",
                }}
              >
                Discover how Shothik AI transforms your writing process with
                intelligent features designed for creators, marketers, and
                professionals.
              </Typography>
            </motion.div>
          </Box>

          {/* Features Grid */}
          <Grid container spacing={{ xs: 3, sm: 4, md: 4 }}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;

              return (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.2 },
                    }}
                    style={{ height: "100%" }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        p: { xs: 3, sm: 4 },
                        border: "1px solid #e5e7eb", // gray-200
                        borderRadius: "12px",
                        boxShadow:
                          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)", // shadow-sm
                        backgroundColor: "#ffffff",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // shadow-lg
                          borderColor: "#d1d5db", // gray-300
                        },
                      }}
                    >
                      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                        {/* Icon */}
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 48,
                            height: 48,
                            borderRadius: "8px",
                            backgroundColor: feature.bgColor,
                            mb: 3,
                          }}
                        >
                          <IconComponent
                            size={24}
                            style={{ color: feature.color }}
                          />
                        </Box>

                        {/* Title */}
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontSize: { xs: "1.125rem", sm: "1.25rem" },
                            fontWeight: 700,
                            color: "#111827", // gray-900
                            mb: 2,
                            lineHeight: 1.3,
                          }}
                        >
                          {feature.title}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#6b7280", // gray-500
                            lineHeight: 1.6,
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
