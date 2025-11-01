import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  slug?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shothik.com";
const SITE_NAME = "Shothik AI";
const DEFAULT_DESCRIPTION = "Shothik is a general AI agent that understands your thoughts before you do. Paraphrasing, Humanizer, Grammar Fix, and AI Agents at your service.";

export function generatePageMetadata({
  title,
  description,
  slug = "",
  image = "/images/og/default.jpg",
  keywords = ["AI writing assistant", "paraphrasing tool", "AI humanizer", "grammar checker", "AI agents"],
  type = "website"
}: SEOConfig): Metadata {
  const url = `${SITE_URL}/${slug}`;
  const fullTitle = slug ? `${title} | ${SITE_NAME}` : title;
  
  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: "Shothik AI" }],
    creator: "Shothik AI",
    publisher: "Shothik AI",
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      }],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@shothikai",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  };
}

export function generateHomeMetadata(): Metadata {
  return generatePageMetadata({
    title: "Shothik - Write Better with AI",
    description: DEFAULT_DESCRIPTION,
    keywords: [
      "AI writing assistant",
      "paraphrasing tool",
      "AI humanizer",
      "grammar checker",
      "AI detector",
      "AI agents",
      "writing tools",
      "content creation",
      "meta ads automation"
    ],
    image: "/images/og/home.jpg",
  });
}
