"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BarChart3,
  Beaker,
  Brain,
  Brush,
  CheckCheck,
  ChevronDown,
  Edit,
  FileText,
  GitBranch,
  Image,
  Images,
  Languages,
  Lightbulb,
  Menu,
  Palette,
  Presentation,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import NextImage from "next/image";
import { useState } from "react";
import logo from "../../attached_assets/Logo (3)_1760613683127.png";
import { useThemeMode } from "../../contexts/ThemeContext";
import ThemeToggle from "../common/ThemeToggle";
import MenuColumn from "./header/MenuColumn";
import MobileMenu from "./header/MobileMenu";

const navLinks = [
  { label: "Use Case", href: "#product-suites" },
  { label: "Blog", href: "/blog" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Pricing", href: "#pricing" },
];

const featuresMenuContent = {
  writing: {
    title: "Writing",
    items: [
      { label: "Paraphraser", icon: Edit, href: "/features#paraphraser" },
      { label: "AI Detector", icon: Brain, href: "/features#ai-detector" },
      { label: "Humanizer", icon: Sparkles, href: "/features#humanizer" },
      { label: "Grammar Checker", icon: CheckCheck, href: "/features#grammar" },
      { label: "Translator", icon: Languages, href: "/features#translator" },
    ],
  },
  agents: {
    title: "Agents",
    items: [
      { label: "AI Slides", icon: Presentation, href: "/features#ai-slides" },
      { label: "Deep Research", icon: Beaker, href: "/features#research" },
      {
        label: "Data Analysis",
        icon: BarChart3,
        href: "/features#data-analysis",
      },
    ],
  },
  vibeMetaAutomation: {
    title: "Vibe Meta Automation",
    items: [
      {
        label: "Product / Service Analysis",
        icon: FileText,
        href: "/features#product-analysis",
      },
      {
        label: "AI Strategy Generation",
        icon: Lightbulb,
        href: "/features#ai-strategy",
      },
      { label: "AI Ad Sets", icon: Images, href: "/features#ai-ad-sets" },
      {
        label: "AI Ad Creatives",
        icon: Palette,
        href: "/features#ai-ad-creatives",
      },
      {
        label: "AI Ad Copies & Ads",
        icon: FileText,
        href: "/features#ai-ad-copies",
      },
      {
        label: "AI-Powered Editing (Meta Vibe Canvas)",
        icon: Brush,
        href: "/features#vibe-canvas",
      },
      { label: "AI Media Canvas", icon: Image, href: "/features#media-canvas" },
      {
        label: "Ad Launch & Campaign Execution",
        icon: Rocket,
        href: "/features#ad-launch",
      },
      {
        label: "Mindmap & Reports",
        icon: GitBranch,
        href: "/features#mindmap-reports",
      },
      {
        label: "AI Optimization",
        icon: TrendingUp,
        href: "/features#ai-optimization",
      },
    ],
  },
};

export default function ShothikHeader() {
  const { setPreference, preference } = useThemeMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const featuresSections = [
    featuresMenuContent.writing,
    featuresMenuContent.agents,
    featuresMenuContent.vibeMetaAutomation,
  ];

  return (
    <header className="dark:bg-background/70 fixed top-0 right-0 left-0 z-40 border-b-0 bg-white/70 saturate-[180%] backdrop-blur-[20px]">
      <div className="flex h-16 items-center justify-between gap-6 bg-transparent px-4 md:px-8 dark:bg-transparent">
        <div className="flex items-center gap-6">
          <NextImage
            src={logo}
            alt="Shothik AI"
            height={20}
            width={100}
            className="h-5 w-auto max-w-[100px] object-contain"
            data-testid="logo-header"
          />

          <div className="hidden items-center gap-2 md:flex">
            <Popover open={featuresOpen} onOpenChange={setFeaturesOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={`px-3 text-sm font-semibold ${featuresOpen ? "text-primary" : "text-foreground-secondary"} hover:text-primary hover:bg-muted/50 transition-colors`}
                  data-testid="nav-features"
                  onMouseEnter={() => setFeaturesOpen(true)}
                >
                  Features
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="bg-card border-border w-[720px] max-w-[800px] border p-8 shadow-lg backdrop-blur-[20px] dark:shadow-2xl"
                data-testid="features-dropdown"
                onMouseLeave={() => setFeaturesOpen(false)}
              >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {featuresSections.map((section) => (
                    <MenuColumn
                      key={section.title}
                      title={section.title}
                      items={section.items}
                      onItemClick={() => setFeaturesOpen(false)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {navLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                asChild
                className="text-foreground-secondary hover:text-primary hover:bg-muted/50 px-3 text-sm font-semibold transition-colors"
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-2 text-sm font-semibold"
              data-testid="button-join-waitlist"
            >
              Join the Waitlist
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        featuresSections={featuresSections}
        navLinks={navLinks}
        preference={preference}
        setPreference={setPreference}
      />
    </header>
  );
}
