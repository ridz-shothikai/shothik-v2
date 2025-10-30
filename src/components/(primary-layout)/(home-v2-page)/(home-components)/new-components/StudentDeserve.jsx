"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InnovationIcon from "@mui/icons-material/Lightbulb";
import SchoolIcon from "@mui/icons-material/School";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const AnimatedTimelineItem = ({ children, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, delay: index * 0.2 },
      });
    }
  }, [isInView, controls, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={controls}
      style={{ position: "relative" }}
    >
      {children}
    </motion.div>
  );
};

const TimelineConnector = ({ index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ height: 0 }}
      animate={isInView ? { height: "100%" } : { height: 0 }}
      transition={{ duration: 0.8, delay: index * 0.3 }}
      style={{
        position: "absolute",
        left: "24px",
        top: "48px",
        width: "2px",
        backgroundColor: "#4CAF50",
        zIndex: 0,
      }}
    />
  );
};

export default function StudentDeserve() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{ pt: { xs: 4, md: 8 }, pb: { xs: 6, md: 10 } }}
      >
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
              fontWeight: 700,
              color: "#1a1a1a",
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            &quot;Every Student Deserves{" "}
            <Box component="span" sx={{ color: "#4CAF50" }}>
              AI That Understands
            </Box>{" "}
            Their Domain&quot;
          </Typography>

          <Typography
            variant="h6"
            align="center"
            sx={{
              color: "#666",
              mb: 6,
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.6,
            }}
          >
            As a former PhD student who struggled with domain-specific writing,
            I built Shothik AI to solve the problem every academic faces:
            generic tools that don&apos;t understand your field.
          </Typography>
        </motion.div>

        {/* Main Content Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: { xs: 4, md: 6 },
            alignItems: "start",
          }}
        >
          {/* Left Side - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={
              isHeroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                mb: { xs: 4, lg: 0 },
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
                alt="AI Technology"
                sx={{
                  width: "100%",
                  height: { xs: "250px", md: "350px" },
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(33, 150, 243, 0.1))",
                }}
              />
            </Box>

            {/* Testimonial Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card
                sx={{
                  mt: 4,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  border: "1px solid #e0e0e0",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Avatar
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
                      sx={{ width: 60, height: 60 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontStyle: "italic",
                          color: "#555",
                          mb: 2,
                          lineHeight: 1.6,
                        }}
                      >
                        &quot;I spent countless nights rewriting papers because
                        generic paraphrasing tools couldn&apos;t handle medical
                        terminology. That frustration became our mission: build
                        AI that actually understands what you&apos;re writing
                        about.&quot;
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#1a1a1a" }}
                      >
                        Arif Rahman
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        PHD BIOMEDICAL ENGINEERING, FOUNDER & CEO
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Right Side - Timeline Features */}
          <Box sx={{ position: "relative", pl: { lg: 4 } }}>
            {/* Timeline Items */}
            <Box sx={{ position: "relative" }}>
              {/* Feature 1 */}
              <AnimatedTimelineItem index={0}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 3,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: "#4CAF50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <SchoolIcon sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Box sx={{ flex: 1, pb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 1, color: "#1a1a1a" }}
                    >
                      Built by Academics, for Academics
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#666", lineHeight: 1.6 }}
                    >
                      Our team includes PhD researchers from medical, legal, and
                      engineering backgrounds.
                    </Typography>
                  </Box>
                </Box>
              </AnimatedTimelineItem>

              <TimelineConnector index={0} />

              {/* Feature 2 */}
              <AnimatedTimelineItem index={1}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 3,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: "#4CAF50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircleIcon sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Box sx={{ flex: 1, pb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 1, color: "#1a1a1a" }}
                    >
                      Trusted by Top Universities
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#666", lineHeight: 1.6 }}
                    >
                      Students at Harvard, MIT, Stanford already use Shothik AI
                      for their research papers.
                    </Typography>
                  </Box>
                </Box>
              </AnimatedTimelineItem>

              <TimelineConnector index={1} />

              {/* Feature 3 */}
              <AnimatedTimelineItem index={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 3,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: "#4CAF50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <InnovationIcon sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 1, color: "#1a1a1a" }}
                    >
                      Continuous Innovation
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#666", lineHeight: 1.6 }}
                    >
                      We ship new domain-specific features every week based on
                      student feedback.
                    </Typography>
                  </Box>
                </Box>
              </AnimatedTimelineItem>
            </Box>
          </Box>
        </Box>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: { xs: 6, md: 8 },
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#4CAF50",
                color: "white",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(76, 175, 80, 0.3)",
                "&:hover": {
                  bgcolor: "#45a049",
                  boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
                },
                minWidth: { xs: "200px", sm: "auto" },
              }}
            >
              Start your free trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: "#4CAF50",
                borderColor: "#4CAF50",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#45a049",
                  bgcolor: "rgba(76, 175, 80, 0.04)",
                },
                minWidth: { xs: "200px", sm: "auto" },
              }}
            >
              Read Our Story
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
