"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  FormatQuote,
  Star,
  People,
  EmojiEvents,
} from "@mui/icons-material";

export default function FounderVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Mock analytics functions
  const trackFeatureClick = (action, section) => {
    console.log(`Analytics: ${action} in ${section}`);
  };

  const trackAgentInteraction = (interaction) => {
    console.log(`Analytics: ${interaction}`);
  };

  const handleVideoPlay = () => {
    setIsPlaying(!isPlaying);
    trackFeatureClick(
      isPlaying ? "video_paused" : "video_played",
      "founder_section"
    );
  };

  const handleCtaClick = (ctaType) => {
    trackFeatureClick(`founder_${ctaType}_clicked`, "founder_section");
  };

  const handleStoryClick = () => {
    trackFeatureClick("read_story_clicked", "founder_section");
  };

  const handleVideoStats = (action) => {
    trackFeatureClick(`video_${action}`, "founder_section");
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 12, sm: 15, md: 18, lg: 24 },
        // background:
        //   "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, rgba(16, 185, 129, 0.04) 100%)",
        bgcolor: isDarkMode ? "inherit" : "#FBFCFD",
        minHeight: "auto",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Grid container spacing={{ xs: 4, md: 8, lg: 16 }} alignItems="center">
          {/* Left: Video */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  position: "relative",
                  bgcolor: "black",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                {/* Video placeholder/thumbnail */}
                <Box
                  sx={{
                    aspectRatio: "16/9",
                    background:
                      "linear-gradient(135deg, #111827 0%, #000000 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {!isPlaying ? (
                    <>
                      {/* Founder photo/thumbnail overlay */}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)",
                        }}
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconButton
                          onClick={handleVideoPlay}
                          sx={{
                            position: "relative",
                            zIndex: 10,
                            width: { xs: 60, sm: 80 },
                            height: { xs: 60, sm: 80 },
                            bgcolor: "rgba(255, 255, 255, 0.9)",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                            "&:hover": {
                              bgcolor: "white",
                              "& .play-icon": {
                                color: "#10b981",
                              },
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          <PlayArrow
                            className="play-icon"
                            sx={{
                              fontSize: { xs: 24, sm: 32 },
                              color: "#374151",
                              ml: 0.5,
                              transition: "color 0.3s ease",
                            }}
                          />
                        </IconButton>
                      </motion.div>

                      {/* Founder name overlay */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: { xs: 16, sm: 24 },
                          left: { xs: 16, sm: 24 },
                          color: "white",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                          }}
                        >
                          Arif Rahman
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#10b981",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          Founder & CEO, Shothik AI
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "#374151",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          textAlign: "center",
                          color: "white",
                          p: { xs: 4, sm: 8 },
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 48, sm: 64 },
                            height: { xs: 48, sm: 64 },
                            bgcolor: isDarkMode ? "inherit" : "#10b981",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2,
                          }}
                        >
                          <Pause sx={{ fontSize: { xs: 24, sm: 32 } }} />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                          }}
                        >
                          Video Playing...
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: isDarkMode ? "inheit" : "#d1d5db",
                            mb: 2,
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          In a real deployment, this would show the founder
                          video
                        </Typography>
                        <Button
                          onClick={handleVideoPlay}
                          sx={{
                            color: isDarkMode ? "inherit" : "#10b981",
                            textDecoration: "underline",
                            "&:hover": {
                              color: "#059669",
                              bgcolor: "transparent",
                            },
                          }}
                        >
                          Click to pause
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Video controls bar */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)",
                    p: { xs: 2, sm: 4 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 2, sm: 4 },
                    }}
                  >
                    <IconButton
                      onClick={handleVideoPlay}
                      sx={{
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.3)",
                        },
                      }}
                    >
                      {isPlaying ? (
                        <Pause sx={{ fontSize: { xs: 16, sm: 20 } }} />
                      ) : (
                        <PlayArrow
                          sx={{ fontSize: { xs: 16, sm: 20 }, ml: 0.25 }}
                        />
                      )}
                    </IconButton>
                    <Box
                      sx={{
                        flex: 1,
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: 1,
                        height: 4,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: "#10b981",
                          height: 4,
                          borderRadius: 1,
                          width: "33%",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      2:47
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Video stats */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 3, sm: 6 },
                  mt: 3,
                  fontSize: "0.875rem",
                }}
              >
                <Button
                  onClick={() => handleVideoStats("views_clicked")}
                  startIcon={<People sx={{ fontSize: 16 }} />}
                  sx={{
                    color: isDarkMode ? "inherit" : "#6b7280",
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    "&:hover": {
                      color: isDarkMode ? "inherit" : "#10b981",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  47,291 views
                </Button>
                <Button
                  onClick={() => handleVideoStats("rating_clicked")}
                  startIcon={<Star sx={{ fontSize: 16, color: "#eab308" }} />}
                  sx={{
                    color: isDarkMode ? "inherit" : "#6b7280",
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    "& .MuiButton-startIcon": {
                      color: "#eab308",
                    },
                    "&:hover": {
                      color: "#10b981",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  4.9 rating
                </Button>
                <Button
                  onClick={() => handleVideoStats("feature_clicked")}
                  startIcon={
                    <EmojiEvents sx={{ fontSize: 16, color: "#10b981" }} />
                  }
                  sx={{
                    color: isDarkMode ? "inherit" : "#6b7280",
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    "&:hover": {
                      color: "#10b981",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  Featured by TechCrunch
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* Right: Content */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 4, sm: 6, md: 8 },
                }}
              >
                {/* Badge */}
                <Chip
                  icon={<FormatQuote sx={{ fontSize: 16 }} />}
                  label="Message from our Founder"
                  sx={{
                    bgcolor: "#ecfdf5",
                    color: "#047857",
                    border: "1px solid #a7f3d0",
                    px: 2,
                    py: 1,
                    height: "auto",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    alignSelf: "flex-start",
                    "& .MuiChip-icon": {
                      color: "#047857",
                    },
                  }}
                />

                {/* Headline */}
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: {
                        xs: "1.875rem",
                        sm: "2.25rem",
                        md: "3rem",
                        lg: "3.75rem",
                      },
                      fontWeight: 700,
                      color: isDarkMode ? "inherit" : "#111827",
                      lineHeight: 1.1,
                      mb: { xs: 2, sm: 4 },
                    }}
                  >
                    "Every Student Deserves{" "}
                    <Box
                      component="span"
                      sx={{
                        display: "block",
                        color: "#10b981",
                      }}
                    >
                      AI That Understands
                    </Box>
                    Their Domain"
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                      color: isDarkMode ? "inherit" : "#6b7280",
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    As a former PhD student who struggled with domain-specific
                    writing, I built Shothik AI to solve the problem every
                    academic faces: generic tools that don't understand your
                    field.
                  </Typography>
                </Box>

                {/* Key points */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    {
                      color: "#10b981",
                      bgColor: isDarkMode ? "#FFF" : "#ecfdf5",
                      title: "Built by Academics, for Academics",
                      description:
                        "Our team includes PhD researchers from medical, legal, and engineering backgrounds.",
                    },
                    {
                      color: "#2563eb",
                      bgColor: isDarkMode ? "#FFF" : "#eff6ff",
                      title: "Trusted by Top Universities",
                      description:
                        "Students at Harvard, MIT, Stanford already use Shothik AI for their research papers.",
                    },
                    {
                      color: "#7c3aed",
                      bgColor: isDarkMode ? "#FFF" : "#f3e8ff",
                      title: "Continuous Innovation",
                      description:
                        "We ship new domain-specific features every week based on student feedback.",
                    },
                  ].map((point, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: { xs: 2, sm: 4 },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 24, sm: 32 },
                          height: { xs: 24, sm: 32 },
                          bgcolor: point.bgColor,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          mt: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 8, sm: 12 },
                            height: { xs: 8, sm: 12 },
                            bgcolor: point.color,
                            borderRadius: "50%",
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: isDarkMode ? "inherit" : "#111827",
                            fontSize: { xs: "1rem", sm: "1.125rem" },
                            mb: 0.5,
                          }}
                        >
                          {point.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#6b7280",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            lineHeight: 1.5,
                          }}
                        >
                          {point.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Founder quote */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    sx={{
                      bgcolor: "#f9fafb",
                      borderLeft: "4px solid #10b981",
                      borderRadius: "0 12px 12px 0",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 6 } }}>
                      <FormatQuote
                        sx={{ fontSize: 32, color: "#10b981", mb: 1.5 }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: "1rem", sm: "1.125rem" },
                          color: "#374151",
                          fontStyle: "italic",
                          lineHeight: 1.6,
                          mb: 2,
                        }}
                      >
                        "I spent countless nights rewriting papers because
                        generic paraphrasing tools couldn't handle medical
                        terminology. That frustration became our mission: build
                        AI that actually understands what you're writing about."
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            width: { xs: 40, sm: 48 },
                            height: { xs: 40, sm: 48 },
                            bgcolor: "#10b981",
                            fontWeight: 700,
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            color: "#FFF",
                          }}
                        >
                          AR
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: "#111827",
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                          >
                            Arif Rahman
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#6b7280",
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                          >
                            PhD Biomedical Engineering, Founder & CEO
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* CTA */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleCtaClick("free_trial")}
                      sx={{
                        bgcolor: "#10b981",
                        color: "white",
                        px: { xs: 4, sm: 8 },
                        py: { xs: 2, sm: 3 },
                        fontSize: { xs: "1rem", sm: "1.125rem" },
                        fontWeight: 600,
                        boxShadow:
                          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        textTransform: "none",
                        borderRadius: 1.5,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "#059669",
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      Start Your Free Trial
                    </Button>
                  </motion.div>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleStoryClick}
                    sx={{
                      border: "2px solid #d1d5db",
                      color: isDarkMode ? "inherit" : "#374151",
                      px: { xs: 4, sm: 8 },
                      py: { xs: 2, sm: 3 },
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      textTransform: "none",
                      borderRadius: 1.5,
                      "&:hover": {
                        borderColor: "#a7f3d0",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    Read Our Story
                  </Button>
                </Box>

                {/* Trust indicators */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 4, sm: 8 },
                    pt: 2,
                    fontSize: "0.875rem",
                  }}
                >
                  <Button
                    onClick={() => handleVideoStats("reviews_clicked")}
                    sx={{
                      color: isDarkMode ? "inherit" : "#6b7280",
                      textTransform: "none",
                      p: 0,
                      minWidth: "auto",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      "&:hover": {
                        color: "#10b981",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} sx={{ fontSize: 16, color: "#fbbf24" }} />
                      ))}
                    </Box>
                    4.9/5 (2,847 reviews)
                  </Button>
                  <Button
                    onClick={() => handleVideoStats("media_clicked")}
                    sx={{
                      color: isDarkMode ? "inherit" : "#6b7280",
                      textTransform: "none",
                      p: 0,
                      minWidth: "auto",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      "&:hover": {
                        color: "#10b981",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    Featured in TechCrunch, Wired
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
