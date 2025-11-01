'use client';

import { Separator } from '../ui/separator';
import FooterColumn from "./footer/FooterColumn";
import SocialLinks from "./footer/SocialLinks";
import FooterBottom from "./footer/FooterBottom";

const aiWritingTools = [
  { label: "Paraphrase", href: "/paraphrase" },
  { label: "Humanize AI Text", href: "/humanize" },
  { label: "AI Detector", href: "/ai-detector" },
  { label: "Plagiarism Checker", href: "/plagiarism" },
  { label: "Translator (100+ Languages)", href: "/translator" },
  { label: "Grammar Fix", href: "#grammar" },
];

const aiAgents = [
  { label: "AI Slides Agent", href: "#slides-agent" },
  { label: "Deep Research Agent", href: "#research-agent" },
  { label: "AI Sheet Agent", href: "#sheet-agent" },
  { label: "Meta Ads Automation", href: "/marketing" },
];

const domains = [
  { label: "Medical Writing", href: "#medical" },
  { label: "Legal Writing", href: "#legal" },
  { label: "Engineering Writing", href: "#engineering" },
  { label: "Academic Writing", href: "#academic" },
];

const features = [
  { label: "Large Documents (156 Pages)", href: "#large-docs" },
  { label: "Domain Expert AI", href: "#domain-ai" },
  { label: "Plagiarism Protection", href: "#plagiarism-protection" },
  { label: "Freeze Important Text", href: "#freeze-text" },
];

const company = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Our Journey", href: "/about#journey" },
  { label: "Message from Founder", href: "/#founder" },
  { label: "Career", href: "#career" },
  { label: "Contact Us", href: "/contact" },
];

const support = [
  { label: "Help Center", href: "/contact#faq" },
  { label: "Get Early Access", href: "#early-access" },
  { label: "FAQs", href: "/contact#faq" },
  { label: "Join Discord", href: "#discord" },
  { label: "Community", href: "/community" },
];

export default function ShothikFooter() {
  return (
    <footer className="bg-background border-t border-border pt-12 md:pt-16 pb-8 md:pb-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          <FooterColumn title="AI Writing Tools" links={aiWritingTools} />
          <FooterColumn title="AI Agents" links={aiAgents} />
          <FooterColumn title="Domains" links={domains} />
          <FooterColumn title="Features" links={features} />
          <FooterColumn title="Support" links={support} />
          
          <div className="col-span-2 sm:col-span-1">
            <FooterColumn title="Company" links={company} />
            <div className="mt-6">
              <SocialLinks />
            </div>
          </div>
        </div>

        <Separator className="my-8 md:my-10" />

        <FooterBottom />
      </div>
    </footer>
  );
}
