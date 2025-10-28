"use client";
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  PenTool,
  GraduationCap,
  Presentation,
  TrendingUp,
  UserPlus,
  BarChart3,
  LayoutDashboard,
  ScanSearch,
  Brain,
  MessageSquare,
  Video,
  Rocket,
} from "lucide-react";
import type { StaticImageData } from "next/image";

// Import Shothik feature logos
import ParaphraseIcon from "../../../assets/icons/Paraphrase.svg";
import AIDetectorIcon from "../../../assets/icons/AI Detector.svg";
import HumanizeGPTIcon from "../../../assets/icons/Humanize GPT.svg";
import TranslatorIcon from "../../../assets/icons/Translator.svg";
import SummarizeIcon from "../../../assets/icons/Summarize.svg";

// Import brand-colored images - Green (#00A76F) and Facebook Blue (#1877F2)
// Optimized WebP format for 60-70% smaller file sizes
import paraphrasingImg from "../../../assets/generated_images/Paraphrasing_green-blue_arrows_c569233c.webp";
import plagiarismImg from "../../../assets/generated_images/Plagiarism_shield_green-blue_67cd9cd3.webp";
import aiDetectionImg from "../../../assets/generated_images/AI_detector_blue-green_b12ba8ea.webp";
import aiRobotImg from "../../../assets/generated_images/Humanizer_transformation_blue-green_8b4c2051.webp";
import translationImg from "../../../assets/generated_images/Translation_globe_connections_35d12fd5.webp";
import summaryImg from "../../../assets/generated_images/Summarizer_compression_visual_fd8495fa.webp";
import businessPresentationImg from "../../../assets/generated_images/Business_presentations_data_b07bdcf0.webp";
import academicSlidesImg from "../../../assets/generated_images/Academic_slides_scholarly_d0594423.webp";
import stockAnalysisImg from "../../../assets/generated_images/Stock_analysis_charts_f0dae739.webp";
import leadGenerationImg from "../../../assets/generated_images/Lead_generation_network_fb03033e.webp";
import academicResearchImg from "../../../assets/generated_images/Academic_research_database_f83c0112.webp";
import marketResearchImg from "../../../assets/generated_images/Market_research_insights_b3b57afc.webp";
import productLinkImg from "../../../assets/generated_images/Product_link_scanner_504b802d.webp";
import campaignImg from "../../../assets/generated_images/Campaign_brain_neural_87fb1955.webp";
import creativeImg from "../../../assets/generated_images/Creative_canvas_AI_f5886843.webp";
import videoImg from "../../../assets/generated_images/Video_production_suite_8ea05291.webp";
import rocketImg from "../../../assets/generated_images/Rocket_launch_growth_81640870.webp";
import dashboardImg from "../../../assets/generated_images/Analytics_command_center_cc3460f4.webp";

interface GalleryCard {
  id: string;
  category: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  image: StaticImageData | string;
}

const galleryCards: GalleryCard[] = [
  {
    id: "paraphrasing",
    category: "writing",
    icon: (
      <img
        src={ParaphraseIcon.src}
        alt="Paraphrase"
        style={{ width: "32px", height: "32px" }}
      />
    ),
    title: "Paraphrasing Engine – Rewrite Smarter, Faster",
    description:
      "Built-in plagiarism check, enhanced editor, multiple modes, tone control. Academic-grade paraphrasing for STEM researchers.",
    image: paraphrasingImg,
  },
  {
    id: "plagiarism",
    category: "writing",
    icon: (
      <img
        src={AIDetectorIcon.src}
        alt="AI Detector"
        style={{ width: "32px", height: "32px" }}
      />
    ),
    title: "Plagiarism Check – Safe, Original Content",
    description:
      "Beat Turnitin detection. Scan billions of sources before submitting—catch plagiarism before your professor does.",
    image: plagiarismImg,
  },
  {
    id: "ai-detector",
    category: "writing",
    icon: (
      <img
        src={AIDetectorIcon.src}
        alt="AI Detector"
        style={{ width: "32px", height: "32px" }}
      />
    ),
    title: "AI Detector – Know What's Real",
    description:
      "Detect AI-generated sentences from any LLM instantly. Grade with confidence. See which sentences students wrote vs. ChatGPT generated.",
    image: aiDetectionImg,
  },
  {
    id: "humanized-gpt",
    category: "writing",
    icon: (
      <img
        src={HumanizeGPTIcon.src}
        alt="Humanize GPT"
        style={{ width: "32px", height: "32px" }}
      />
    ),
    title: "Humanized GPT – Get 100% human score.",
    description:
      "Converts AI generated content into human content. Bypass AI detectors like Turnitin, GPTzero, Originality AI and more.",
    image: aiRobotImg,
  },
  {
    id: "translation",
    category: "writing",
    icon: (
      <img
        src={TranslatorIcon.src}
        alt="Translator"
        style={{ width: "32px", height: "32px" }}
      />
    ),
    title: "Translation Tool – Communicate Globally",
    description:
      "Translation in 100+ Languages. Instantly translate text and documents. Perfect for students, businesses, and global teams.",
    image: translationImg,
  },
  {
    id: "summarizer",
    category: "writing",
    icon: (
      <img
        src={SummarizeIcon.src}
        alt="Summarize"
        style={{ width: "32px", height: "32px" }}
      />
    ),
    title: "Smart Summarizer – Key Insights, Fast",
    description:
      "Save hours of reading. Instantly summarize reports, research papers, and articles into key insights.",
    image: summaryImg,
  },
  {
    id: "business-presentations",
    category: "productivity",
    icon: <Presentation size={32} strokeWidth={1.5} />,
    title: "Business Presentations: Pitch Decks in 60 Seconds",
    description:
      "Investor pitch? Sales deck? Quarterly report? AI researches content, designs slides, builds professional presentations instantly.",
    image: businessPresentationImg,
  },
  {
    id: "academic-slides",
    category: "productivity",
    icon: <PenTool size={32} strokeWidth={1.5} />,
    title: "Academic Slides: Research to Presentation Fast",
    description:
      "Conference talk? Thesis defense? Class presentation? AI converts research into polished slides with citations instantly.",
    image: academicSlidesImg,
  },
  {
    id: "stock-analysis-agent",
    category: "productivity",
    icon: <TrendingUp size={32} strokeWidth={1.5} />,
    title: "Stock Analysis: Track Any Stock Instantly",
    description:
      "Track Tesla? Monitor crypto? Compare sectors? AI scrapes live prices, news, SEC filings—delivers organized spreadsheets instantly.",
    image: stockAnalysisImg,
  },
  {
    id: "lead-gen-agent",
    category: "productivity",
    icon: <UserPlus size={32} strokeWidth={1.5} />,
    title: "Lead Generation: Real-Time B2B Prospects",
    description:
      "Need B2B leads? LinkedIn prospects? Competitor customers? AI scrapes data, finds emails, builds spreadsheets instantly.",
    image: leadGenerationImg,
  },
  {
    id: "academic-research",
    category: "productivity",
    icon: <GraduationCap size={32} strokeWidth={1.5} />,
    title: "Academic Research: Scholarly Sources in Minutes",
    description:
      "Thesis? Literature review? Term paper? AI searches academic databases, finds peer-reviewed sources, builds citations instantly.",
    image: academicResearchImg,
  },
  {
    id: "market-research",
    category: "productivity",
    icon: <BarChart3 size={32} strokeWidth={1.5} />,
    title: "Market Research: Industry Insights Automated",
    description:
      "Competitor analysis? Market trends? Consumer insights? AI scans industry reports, extracts data, delivers research briefs instantly.",
    image: marketResearchImg,
  },
  {
    id: "drop-link-decode",
    category: "meta-automation",
    icon: <ScanSearch size={32} strokeWidth={1.5} />,
    title: "Smart Product Scan",
    description:
      "Upload any product link — AI studies your market, competitors, and audience to reveal what messaging converts best. → Instant clarity. No manual research.",
    image: productLinkImg,
  },
  {
    id: "campaign-brain",
    category: "meta-automation",
    icon: <Brain size={32} strokeWidth={1.5} />,
    title: "Instant Campaign Maker",
    description:
      "From one click, AI structures your campaign: persona → adset → ad creative → ad copy. → Get a full-funnel strategy ready to deploy.",
    image: campaignImg,
  },
  {
    id: "meta-vibe-canvas",
    category: "meta-automation",
    icon: <MessageSquare size={32} strokeWidth={1.5} />,
    title: "Creative Chat Canvas",
    description:
      "Talk to your ads. Literally. Change visuals, copy, or style through natural chat — AI adjusts everything instantly. → Zero design tools. Full creative control.",
    image: creativeImg,
  },
  {
    id: "andromeda-media",
    category: "meta-automation",
    icon: <Video size={32} strokeWidth={1.5} />,
    title: "Infinite Creative Variations",
    description:
      "Generate UGC, influencer videos, carousels, or reels — powered by the Andromeda algorithm. → One concept, infinite content formats.",
    image: videoImg,
  },
  {
    id: "click-launch-learn",
    category: "meta-automation",
    icon: <Rocket size={32} strokeWidth={1.5} />,
    title: "One Click, All Live",
    description:
      "Push your adsets directly to Facebook from inside the canvas. → No exports, no setup, no confusion — just go live.",
    image: rocketImg,
  },
  {
    id: "dashboard-command",
    category: "meta-automation",
    icon: <LayoutDashboard size={32} strokeWidth={1.5} />,
    title: "AI Mindmap & Dashboard",
    description:
      "See performance, ask questions, and take one-click optimization actions. → Earn and learn simultaneously — the more you run, the smarter it gets.",
    image: dashboardImg,
  },
];

const categories = [
  { id: "writing", label: "Writing Suite" },
  { id: "productivity", label: "Professional Suite" },
  { id: "meta-automation", label: "Meta Automation Suite" },
];

export default function InspirationGallery() {
  const [selectedCategory, setSelectedCategory] = useState("writing");
  const prefersReducedMotion = useReducedMotion();

  const filteredCards = galleryCards.filter(
    (card) => card.category === selectedCategory,
  );

  return (
    <Box
      component="section"
      id="product-suites"
      data-testid="section-inspiration-gallery"
      sx={{
        py: { xs: 10, md: 16 },
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#000000" : "#FFFFFF",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="overline"
            sx={{
              display: "block",
              color: "text.secondary",
              mb: 1,
              letterSpacing: "0.1em",
            }}
          >
            Product Suites
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Powerful AI tools for every workflow
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
              fontWeight: 400,
            }}
          >
            From intelligent writing assistance to automated Meta
            campaigns—discover our complete suite of AI-powered solutions
          </Typography>
        </Box>

        {/* Category Filters */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mb: 6,
            flexWrap: "wrap",
          }}
        >
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.label}
              onClick={() => setSelectedCategory(cat.id)}
              data-testid={`gallery-category-${cat.id}`}
              sx={{
                px: 2,
                py: 2.5,
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                bgcolor:
                  selectedCategory === cat.id
                    ? "primary.main"
                    : "background.paper",
                color: selectedCategory === cat.id ? "white" : "text.primary",
                border: 1,
                borderColor:
                  selectedCategory === cat.id ? "primary.main" : "divider",
                "&:hover": {
                  bgcolor:
                    selectedCategory === cat.id
                      ? "primary.dark"
                      : "action.hover",
                },
              }}
            />
          ))}
        </Box>

        {/* Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          <AnimatePresence>
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                initial={{
                  opacity: prefersReducedMotion ? 1 : 0,
                  y: prefersReducedMotion ? 0 : 20,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: prefersReducedMotion ? 1 : 0,
                  y: prefersReducedMotion ? 0 : -20,
                }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.3,
                        delay: index * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
              >
                <Card
                  data-testid={`gallery-card-${card.id}`}
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      ...(index === 0 && {
                        transform: "translateY(-4px)",
                        boxShadow: (theme) => theme.shadows[8],
                      }),
                      "& .card-image": {
                        transform: "translateY(60px)",
                      },
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2.5, pb: 10 }}>
                    {/* Horizontal Layout - Icon on left, title+description on right */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Icon */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: "action.hover",
                          color: "text.primary",
                          flexShrink: 0,
                        }}
                      >
                        {card.icon}
                      </Box>

                      {/* Text Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                            mb: 1,
                            fontSize: "1.125rem",
                          }}
                        >
                          {card.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.875rem",
                            lineHeight: 1.6,
                          }}
                        >
                          {card.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  {/* Image with shadow overlay */}
                  <Box
                    className="card-image"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      px: 4,
                      pb: 0,
                      transform: "translateY(10px)",
                      transition: "transform 0.3s ease",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: -25,
                        left: 0,
                        right: 0,
                        height: 25,
                        background: (theme) =>
                          `linear-gradient(to bottom, transparent, ${theme.palette.background.paper})`,
                        pointerEvents: "none",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        typeof card.image === "string"
                          ? card.image
                          : card.image.src
                      }
                      alt={card.title}
                      sx={{
                        height: 80,
                        width: "85%",
                        margin: "0 auto",
                        objectFit: "cover",
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        boxShadow:
                          "0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </Box>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
}
