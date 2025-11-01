"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGetUserQuery } from "@/redux/api/auth/authApi";
import { updateTheme } from "@/redux/slice/settings";
import Logo from "@/resource/assets/Logo";
import {
  BarChart3,
  Beaker,
  Brain,
  Brush,
  CheckCheck,
  ChevronDown,
  Edit,
  FileText,
  Gem,
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountPopover from "./AccountPopover";
import MenuColumn from "./MenuColumn";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";

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

export default function Header() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const { theme } = useSelector((state) => state.settings);
  const { isLoading } = useGetUserQuery(undefined, {
    skip: !accessToken,
  });
  const { sidebar } = useSelector((state) => state.settings);
  const isCompact = sidebar === "compact";

  const featuresSections = [
    featuresMenuContent.writing,
    featuresMenuContent.agents,
    featuresMenuContent.vibeMetaAutomation,
  ];

  return (
    <header
      className={cn(
        "bg-background/70 supports-[backdrop-filter]:bg-background/60 z-50 border-b backdrop-blur-md",
      )}
    >
      <div className="flex h-16 items-center justify-between gap-6 px-4 lg:px-8">
        {/* Logo + Desktop Nav */}
        <div className="flex items-center gap-6">
          <div>
            <div></div> {isCompact && <Logo className="hidden lg:block" />}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {/* Features Popover */}
            <Popover open={featuresOpen} onOpenChange={setFeaturesOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "px-3 text-sm font-semibold transition-colors",
                    featuresOpen
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-muted/50",
                  )}
                  onMouseEnter={() => setFeaturesOpen(true)}
                  data-testid="nav-features"
                >
                  Features
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="border-border bg-card w-[720px] max-w-[800px] border p-8 shadow-lg backdrop-blur-lg"
                onMouseLeave={() => setFeaturesOpen(false)}
                data-testid="features-dropdown"
              >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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

            {/* Other Links */}
            {navLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                asChild
                className="text-muted-foreground hover:text-primary hover:bg-muted/50 px-3 text-sm font-semibold transition-colors"
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <div className="flex items-center gap-2 md:gap-3">
              {isLoading ? (
                <div className="flex items-center gap-1">
                  <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
                  <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
                  <span className="bg-primary h-2 w-2 animate-bounce rounded-full" />
                </div>
              ) : (
                user?.package !== "unlimited" && (
                  <Link href={"/pricing?redirect=" + pathname}>
                    <Button
                      data-umami-event="Nav: Upgrade To Premium"
                      className={cn("h-9 px-3 text-xs md:text-sm")}
                    >
                      <Gem className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                      {user?.email ? "Upgrade" : "Upgrade Plan"}
                    </Button>
                  </Link>
                )
              )}

              {!isLoading && (
                <AccountPopover accessToken={accessToken} user={user} />
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-foreground lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        featuresSections={featuresSections}
        navLinks={navLinks}
        theme={theme}
        setTheme={dispatch(updateTheme)}
      />
    </header>
  );
}
