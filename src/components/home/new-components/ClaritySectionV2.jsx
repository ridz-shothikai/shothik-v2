"use client"

import React from "react";

// StudentToEntrepreneurJourneySection.jsx (Material UI)
// Single-file React component using @mui/material v5 and @mui/icons-material
// Drop into a project that already has @mui/material and @mui/icons-material installed.

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Stack,
  IconButton,
  useTheme,
  Divider,
} from "@mui/material";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz"; // paraphrase
import SpellcheckIcon from "@mui/icons-material/Spellcheck"; // grammar fix
import SummarizeIcon from "@mui/icons-material/Summarize"; // summarize
import TranslateIcon from "@mui/icons-material/Translate"; // translator
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"; // humanize
import VisibilityIcon from "@mui/icons-material/Visibility"; // ai detector
import SmartToyIcon from "@mui/icons-material/SmartToy"; // agents
import CampaignIcon from "@mui/icons-material/Campaign"; // marketing automation

export default function ClaritSectionV2({
  onCTAClick = () => {},
}) {
  const theme = useTheme();

  const stages = [
    {
      id: "learn",
      label: "Learn",
      subtitle: "Student: study faster & write better",
      services: [
        {
          key: "paraphrase",
          title: "Paraphrase",
          desc: "Reword sentences while preserving meaning — perfect for study notes and drafts.",
          icon: <SwapHorizIcon fontSize="small" />,
        },
        {
          key: "grammar",
          title: "Grammar Fix",
          desc: "Auto-correct spelling, punctuation and tone for academic clarity.",
          icon: <SpellcheckIcon fontSize="small" />,
        },
        {
          key: "summarize",
          title: "Summarize",
          desc: "Get concise summaries so you can absorb and review faster.",
          icon: <SummarizeIcon fontSize="small" />,
        },
        {
          key: "translate",
          title: "Translator",
          desc: "Translate content while preserving voice and context.",
          icon: <TranslateIcon fontSize="small" />,
        },
      ],
    },
    {
      id: "build",
      label: "Build",
      subtitle: "Founder: prepare pitch & product-ready content",
      services: [
        {
          key: "humanize",
          title: "Humanize",
          desc: "Make technical or academic text sound natural and persuasive.",
          icon: <AutoFixHighIcon fontSize="small" />,
        },
        {
          key: "ai-detector",
          title: "AI Detector",
          desc: "Check for generated content and tune for a human voice.",
          icon: <VisibilityIcon fontSize="small" />,
        },
        {
          key: "agents",
          title: "Agents",
          desc: "Automate repetitive content tasks and assemble workflows.",
          icon: <SmartToyIcon fontSize="small" />,
        },
      ],
    },
    {
      id: "grow",
      label: "Grow",
      subtitle: "Entrepreneur: scale outreach & convert users",
      services: [
        {
          key: "marketing",
          title: "Marketing Automation",
          desc: "Create email flows, landing copy, and campaign-ready assets quickly.",
          icon: <CampaignIcon fontSize="small" />,
        },
        {
          key: "agents-2",
          title: "Agents",
          desc: "Deploy agents that perform outreach tasks and content orchestration.",
          icon: <SmartToyIcon fontSize="small" />,
        },
      ],
    },
  ];

  const [tab, setTab] = React.useState(0);

  const handleTabChange = (e, value) => {
    setTab(value);
  };

  const activeStage = stages[tab] || stages[0];

  return (
    <Box
      component="section"
      sx={{ py: { xs: 6, md: 12 }, bgcolor: "background.paper" }}
    >
      <Container maxWidth="lg">
        {/* Hero / Motto */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
            From Student to Entrepreneur —{" "}
            <Box component="span" sx={{ color: "success.main" }}>
              Your writing journey, simplified
            </Box>
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 760, mx: "auto" }}
          >
            One platform to write, verify and launch: paraphrase, humanize,
            detect, fix grammar, summarize, translate, build agents and automate
            marketing — all in a cohesive workflow.
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              data-umami-event="Get early access"
              variant="contained"
              color="success"
              onClick={() => onCTAClick("get-started")}
              aria-label="Get early access"
            >
              Get early access
            </Button>
            <Button data-umami-event="View features" variant="outlined" onClick={() => onCTAClick("features")}>
              View features
            </Button>
          </Stack>
        </Box>

        {/* Tabs (stages) */}
        <Card variant="outlined" sx={{ mb: 4 }}>
          <Box sx={{ px: { xs: 2, md: 3 }, pt: 2 }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Stage tabs"
              sx={{ mb: 2 }}
            >
              {stages.map((s, i) => (
                <Tab
                  key={s.id}
                  disableRipple
                  label={
                    <Box sx={{ textAlign: "left" }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {s.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.subtitle}
                      </Typography>
                    </Box>
                  }
                  sx={{ py: 1.5, minWidth: 160 }}
                />
              ))}
            </Tabs>

            <Divider />

            {/* Cards Grid */}
            <CardContent>
              <Grid container spacing={2}>
                {activeStage.services.map((svc) => (
                  <Grid key={svc.key} item xs={12} sm={6} md={4}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <CardContent>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="flex-start"
                        >
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 2,
                              bgcolor: "success.50",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Box sx={{ color: "success.main" }}>{svc.icon}</Box>
                          </Box>

                          <Box>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {svc.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {svc.desc}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>

                      <Box sx={{ px: 2, pb: 2 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Button
                            size="small"
                            onClick={() => onCTAClick(svc.key)}
                            aria-label={`Learn more about ${svc.title}`}
                          >
                            Learn more
                          </Button>
                          <Typography variant="caption" color="text.disabled">
                            Fast • Secure
                          </Typography>
                        </Stack>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Box>
        </Card>

        {/* Secondary row: Why choose us + illustration */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} lg={8}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Designed for the whole journey
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
              Preserve your voice and get results. Each tool plugs into
              workflows so you can go from first draft to market-ready copy
              without leaving the platform.
            </Typography>

            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  • Intuitive, card-based UI for quick scanning
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  • Stage-guided path from student to entrepreneur
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  • Built-in verification (AI detector & originality checks)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  • Automations & agents to scale outreach
                </Typography>
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => onCTAClick("signup")}
              >
                Start free trial
              </Button>
              <Button variant="outlined" onClick={() => onCTAClick("demo")}>
                Request demo
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                display: { xs: "none", lg: "block" },
                bgcolor: "background.default",
                borderRadius: 2,
                p: 2,
                height: "100%",
                border: `1px dashed ${theme.palette.success[100] || "#E6F4EA"}`,
              }}
            >
              {/* Replace this area with a branded illustration, Lottie or GIF in production. */}
              <Box
                sx={{
                  width: "100%",
                  height: 220,
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Illustration / GIF — replace with brand asset
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Integration notes as a comment:
        - This component uses MUI v5. Ensure `@mui/material` and `@mui/icons-material` are installed.
        - Replace the placeholder illustration with a compressed GIF or Lottie for better engagement.
        - Wire `onCTAClick` to your analytics/navigation. Example: onCTAClick('paraphrase')
        - A/B testing ideas: (A) Stage-tabbed experience (this component) vs (B) full-grid experience.
        - Accessibility: tabs are keyboard accessible via MUI's Tabs component. Add any extra ARIA attributes
          for deeper support if required.
      */}
    </Box>
  );
}
