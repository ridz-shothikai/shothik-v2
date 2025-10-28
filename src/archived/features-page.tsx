'use client';

import dynamic from 'next/dynamic';
import { Box, Container, Typography, Button } from "@mui/material";
import { ArrowForward, Edit, Psychology, AutoAwesome, Spellcheck, Translate, Slideshow, Science, BarChart, Assessment, Lightbulb, Collections, Palette, Article, Brush, Image, RocketLaunch, AccountTree, TrendingUp } from "@mui/icons-material";
import { ShothikHeader, ShothikFooter } from "@/components/layout";
import { ScrollProgress, FinalCTA } from "@/components/common";

// Lazy load Sidebar to prevent hydration mismatch
const Sidebar = dynamic(() => import("@/components/layout").then(mod => ({ default: mod.Sidebar })), { 
  ssr: true  // Allow SSR to prevent hydration mismatch
});

interface FeatureSection {
  id: string;
  category?: string;
  title: string;
  description: string;
  icon: React.ElementType;
  imagePosition: 'left' | 'right';
}

const features: FeatureSection[] = [
  // Writing Tools
  {
    id: 'paraphraser',
    category: 'Writing',
    title: 'Paraphraser',
    description: 'Rewrite content while preserving meaning. Transform your text with AI-powered paraphrasing that maintains context and improves clarity.',
    icon: Edit,
    imagePosition: 'right',
  },
  {
    id: 'ai-detector',
    title: 'AI Detector',
    description: 'Identify AI-generated content with high accuracy. Our advanced detection algorithms analyze text patterns to distinguish between human and AI writing.',
    icon: Psychology,
    imagePosition: 'left',
  },
  {
    id: 'humanizer',
    title: 'Humanizer',
    description: 'Make AI text sound natural and authentic. Transform robotic AI-generated content into human-like writing that resonates with your audience.',
    icon: AutoAwesome,
    imagePosition: 'right',
  },
  {
    id: 'grammar',
    title: 'Grammar Checker',
    description: 'Perfect your writing with intelligent grammar and style suggestions. Catch errors and improve clarity with real-time feedback.',
    icon: Spellcheck,
    imagePosition: 'left',
  },
  {
    id: 'translator',
    title: 'Translator',
    description: 'Break language barriers with AI-powered translation supporting over 100 languages. Maintain context and nuance in every translation.',
    icon: Translate,
    imagePosition: 'right',
  },
  
  // Agents
  {
    id: 'ai-slides',
    category: 'Agents',
    title: 'AI Slides',
    description: 'Create professional presentations in minutes. Our AI agent transforms your ideas into stunning slides with intelligent layout and design.',
    icon: Slideshow,
    imagePosition: 'left',
  },
  {
    id: 'research',
    title: 'Deep Research',
    description: 'Conduct comprehensive research with AI assistance. Gather insights, analyze data, and synthesize information from multiple sources.',
    icon: Science,
    imagePosition: 'right',
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis',
    description: 'Transform raw data into actionable insights. Our AI agent analyzes patterns, generates visualizations, and provides intelligent recommendations.',
    icon: BarChart,
    imagePosition: 'left',
  },
  
  // Vibe Meta Automation
  {
    id: 'product-analysis',
    category: 'Vibe Meta Automation',
    title: 'Product / Service Analysis',
    description: 'Deep dive into your product positioning and market fit. AI-powered analysis identifies key selling points and target audience insights.',
    icon: Assessment,
    imagePosition: 'right',
  },
  {
    id: 'ai-strategy',
    title: 'AI Strategy Generation',
    description: 'Generate comprehensive advertising strategies tailored to your goals. AI creates data-driven campaign plans with audience targeting and messaging.',
    icon: Lightbulb,
    imagePosition: 'left',
  },
  {
    id: 'ai-ad-sets',
    title: 'AI Ad Sets',
    description: 'Automatically create optimized ad sets for maximum performance. AI determines the best audience segments, budgets, and placement strategies.',
    icon: Collections,
    imagePosition: 'right',
  },
  {
    id: 'ai-ad-creatives',
    title: 'AI Ad Creatives',
    description: 'Generate eye-catching ad creatives that convert. AI designs visuals and layouts optimized for engagement and brand consistency.',
    icon: Palette,
    imagePosition: 'left',
  },
  {
    id: 'ai-ad-copies',
    title: 'AI Ad Copies & Ads',
    description: 'Craft compelling ad copy that drives action. AI writes persuasive headlines, descriptions, and CTAs tailored to your audience.',
    icon: Article,
    imagePosition: 'right',
  },
  {
    id: 'vibe-canvas',
    title: 'AI-Powered Editing (Meta Vibe Canvas)',
    description: 'Fine-tune your creatives with intelligent editing tools. Adjust layouts, colors, and elements with AI-powered suggestions.',
    icon: Brush,
    imagePosition: 'left',
  },
  {
    id: 'media-canvas',
    title: 'AI Media Canvas',
    description: 'Create and customize media assets with AI assistance. Generate images, videos, and graphics that align with your brand.',
    icon: Image,
    imagePosition: 'right',
  },
  {
    id: 'ad-launch',
    title: 'Ad Launch & Campaign Execution',
    description: 'Deploy campaigns seamlessly across Meta platforms. AI manages scheduling, budget allocation, and performance monitoring.',
    icon: RocketLaunch,
    imagePosition: 'left',
  },
  {
    id: 'mindmap-reports',
    title: 'Mindmap & Reports',
    description: 'Visualize campaign structure and performance insights. AI generates comprehensive reports with actionable recommendations.',
    icon: AccountTree,
    imagePosition: 'right',
  },
  {
    id: 'ai-optimization',
    title: 'AI Optimization',
    description: 'Continuously improve campaign performance with AI-driven optimization. Automatic adjustments based on real-time data and trends.',
    icon: TrendingUp,
    imagePosition: 'left',
  },
];

export default function FeaturesPage() {
  let currentCategory = '';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <ScrollProgress />
      <Sidebar />
      <Box sx={{ ml: { xs: 8, md: 10 } }}>
        <ShothikHeader />
      
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          px: 3,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              fontWeight: 600,
              letterSpacing: 1.5,
              mb: 2,
            }}
          >
            Features
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 4,
              maxWidth: '900px',
            }}
          >
            The best way to work with AI.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            href="#paraphraser"
            data-testid="button-explore-features"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            Explore Features
          </Button>
        </Container>
      </Box>

      {/* Feature Sections */}
      <Box sx={{ pb: 8 }}>
        {features.map((feature, index) => {
          const showCategory = feature.category && feature.category !== currentCategory;
          if (feature.category) {
            currentCategory = feature.category;
          }

          return (
            <Box key={feature.id}>
              {/* Category Label */}
              {showCategory && (
                <Container maxWidth="lg" sx={{ px: 3, mb: 6, mt: index > 0 ? 12 : 0 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 700,
                      color: 'primary.main',
                      mb: 2,
                    }}
                  >
                    {feature.category}
                  </Typography>
                  <Box
                    sx={{
                      width: 80,
                      height: 4,
                      bgcolor: 'primary.main',
                      borderRadius: 2,
                    }}
                  />
                </Container>
              )}

              {/* Feature Section */}
              <Box
                id={feature.id}
                component="section"
                sx={{
                  py: { xs: 8, md: 12 },
                  px: 3,
                  scrollMarginTop: '80px',
                }}
                data-testid={`section-${feature.id}`}
              >
                <Container maxWidth="lg">
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: { xs: 4, md: 8 },
                      alignItems: 'center',
                    }}
                  >
                    {/* Text Content */}
                    <Box
                      sx={{
                        order: { xs: 1, md: feature.imagePosition === 'left' ? 2 : 1 },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 64,
                          height: 64,
                          borderRadius: 3,
                          bgcolor: 'primary.main',
                          color: 'white',
                          mb: 3,
                        }}
                      >
                        <feature.icon sx={{ fontSize: 32 }} />
                      </Box>
                      <Typography
                        variant="h2"
                        sx={{
                          fontSize: { xs: '2rem', md: '2.5rem' },
                          fontWeight: 700,
                          mb: 2,
                          lineHeight: 1.2,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          lineHeight: 1.7,
                          color: 'text.secondary',
                          maxWidth: '500px',
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>

                    {/* Visual Placeholder */}
                    <Box
                      sx={{
                        order: { xs: 2, md: feature.imagePosition === 'left' ? 1 : 2 },
                        aspectRatio: '16/10',
                        borderRadius: 3,
                        bgcolor: 'action.hover',
                        border: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: 2,
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
                        }}
                      />
                      <feature.icon
                        sx={{
                          fontSize: 120,
                          color: 'primary.main',
                          opacity: 0.15,
                        }}
                      />
                    </Box>
                  </Box>
                </Container>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Final CTA */}
      <FinalCTA />
      <ShothikFooter />
      </Box>
    </Box>
  );
}
