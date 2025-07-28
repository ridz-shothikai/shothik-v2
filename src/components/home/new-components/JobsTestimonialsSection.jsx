"use client";

import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Container,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Star,
  GraduationCap,
  Award,
  TrendingUp,
  Building,
  ArrowRight,
} from "lucide-react";

const studentStories = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Computer Science Student → Software Engineer",
    company: "Google",
    university: "Stanford University",
    story:
      "Shothik AI didn't just help me write better papers - it taught me to think more clearly. The presentation agent helped me land my Google internship, and now I use similar AI workflows in my full-time role.",
    achievement: "Dream job at Google",
    metric: "GPA: 3.2 → 3.8",
    timeframe: "Senior Year",
    avatar: "SC",
    gradientFrom: "#3B82F6",
    gradientTo: "#9333EA",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Graduate Student → Research Scientist",
    company: "MIT Research Lab",
    university: "MIT",
    story:
      "The AI agents handle research documentation and data analysis, letting me focus on breakthrough discoveries. My thesis advisor was amazed by my productivity increase.",
    achievement: "Published 3 research papers",
    metric: "Research output +300%",
    timeframe: "PhD Program",
    avatar: "MJ",
    gradientFrom: "#10B981",
    gradientTo: "#0D9488",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Pre-med Student → Medical School",
    company: "Johns Hopkins",
    university: "Harvard University",
    story:
      "From organic chemistry reports to my medical school personal statement - Shothik AI helped me communicate complex ideas clearly and confidently.",
    achievement: "Accepted to Johns Hopkins",
    metric: "MCAT prep time -40%",
    timeframe: "Application Year",
    avatar: "ER",
    gradientFrom: "#F43F5E",
    gradientTo: "#EC4899",
  },
];

const universities = [
  "Stanford",
  "MIT",
  "Harvard",
  "Princeton",
  "Yale",
  "Columbia",
  "Berkeley",
  "Cornell",
];

const StyledSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  // background: "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)",
  minHeight: "100vh",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  border: "1px solid #E2E8F0",
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
    transform: "translateY(-4px)",
  },
}));

const GradientAvatar = styled(Avatar)(({ gradientfrom, gradientto }) => ({
  width: 64,
  height: 64,
  background: `linear-gradient(135deg, ${gradientfrom} 0%, ${gradientto} 100%)`,
  fontSize: "1.125rem",
  fontWeight: "bold",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
}));

const AchievementChip = styled(Box)(({ theme }) => ({
  backgroundColor: "#ECFDF5",
  border: "1px solid #D1FAE5",
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
}));

const CareerTransition = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5),
  backgroundColor: "#F8FAFC",
  borderRadius: theme.spacing(1.5),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#059669",
  color: "white",
  padding: theme.spacing(2, 6),
  borderRadius: theme.spacing(4),
  fontSize: "1.125rem",
  fontWeight: 500,
  textTransform: "none",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: "#047857",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
}));

export default function JobsTestimonialsSection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <StyledSection
      sx={{
        bgcolor: isDarkMode ? "#161C24" : "#f8fafc",
      }}
    >
      <Container maxWidth="xl">
        {/* Jobs-style Header */}
        <Box textAlign="center" mb={10}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", lg: "3rem" },
                fontWeight: 300,
                color: isDarkMode ? "inherit" : "#0F172A",
                mb: 3,
              }}
            >
              Real Students.
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "2rem", lg: "2.5rem" },
                fontWeight: 300,
                color: isDarkMode ? "inherit" : "#64748B",
                mb: 4,
              }}
            >
              Real Results.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.25rem",
                color: isDarkMode ? "inherit" : "#64748B",
                maxWidth: "48rem",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              From struggling with assignments to landing dream careers. See how
              Shothik AI transforms academic journeys.
            </Typography>
          </motion.div>
        </Box>

        {/* Student Success Stories */}
        <Grid container spacing={4} mb={8} alignItems="stretch">
          {studentStories.map((story, index) => (
            <Grid item xs={12} lg={4} key={story.id} sx={{ display: "flex" }}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                style={{ flex: 1, display: "flex" }}
              >
                <StyledCard>
                  <CardContent sx={{ p: 0 }}>
                    {/* Story Header */}
                    <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                      <GradientAvatar
                        sx={{
                          color: "#FFF",
                        }}
                        gradientfrom={story.gradientFrom}
                        gradientto={story.gradientTo}
                      >
                        {story.avatar}
                      </GradientAvatar>
                      <Box flex={1}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: isDarkMode ? "inherit" : "#0F172A",
                            fontSize: "1.125rem",
                          }}
                        >
                          {story.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            mb: 0.5,
                          }}
                        >
                          {story.university}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <GraduationCap size={12} color="#64748B" />
                          <Typography
                            variant="caption"
                            sx={{ color: "#64748B" }}
                          >
                            {story.timeframe}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Achievement Badge */}
                    <AchievementChip>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Award size={16} color="#059669" />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "#047857",
                          }}
                        >
                          {story.achievement}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <TrendingUp size={16} color="#059669" />
                        <Typography variant="body2" sx={{ color: "#059669" }}>
                          {story.metric}
                        </Typography>
                      </Box>
                    </AchievementChip>

                    {/* Story Content */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: isDarkMode ? "inherit" : "#374151",
                        lineHeight: 1.6,
                        mb: 3,
                        fontStyle: "italic",
                      }}
                    >
                      "{story.story}"
                    </Typography>

                    {/* Career Transition */}
                    <CareerTransition>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          Now at
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Building size={16} color="#0F172A" />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#0F172A",
                            }}
                          >
                            {story.company}
                          </Typography>
                        </Box>
                      </Box>
                      <ArrowRight size={20} color="#059669" />
                    </CareerTransition>

                    {/* Star Rating */}
                    <Box display="flex" justifyContent="center" mt={3}>
                      <Box display="flex" gap={0.5}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill="#FBBF24"
                            color="#FBBF24"
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* University Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center">
            <Typography
              variant="overline"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: isDarkMode ? "inherit" : "#64748B",
                letterSpacing: "0.05em",
                mb: 3,
                display: "block",
              }}
            >
              Trusted by students at top universities
            </Typography>
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              justifyContent="center"
              gap={4}
              sx={{ opacity: 0.6 }}
            >
              {universities.map((university, index) => (
                <motion.div
                  key={university}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.6 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#94A3B8",
                      fontWeight: 500,
                      fontSize: { xs: "1rem", md: "1.125rem" },
                      cursor: "pointer",
                    }}
                  >
                    {university}
                  </Typography>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Jobs-style CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center" mt={8}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
                fontWeight: 300,
                color: isDarkMode ? "inherit" : "#64748B",
                mb: 4,
              }}
            >
              Leave it to us. Your success story starts here.
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <StyledButton
                size="large"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                }}
              >
                Transform Your Writing Today
              </StyledButton>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </StyledSection>
  );
}
