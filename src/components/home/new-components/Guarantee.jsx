"use client";

import { Box, Button, Container, styled, Typography } from "@mui/material";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";


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

export default function Guarantee() {
  return (
    <Container maxWidth="xl">
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
  );
}
