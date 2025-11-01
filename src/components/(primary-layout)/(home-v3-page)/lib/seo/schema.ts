const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shothik.com";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Shothik AI",
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512x512.png`,
    description: "AI-powered writing and productivity platform offering paraphrasing, humanizing AI text, grammar checking, and automated content creation.",
    sameAs: [
      "https://twitter.com/shothikai",
      "https://linkedin.com/company/shothik"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@shothik.com"
    }
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Shothik AI",
    url: SITE_URL,
    description: "AI writing and productivity platform with paraphrasing, humanizer, grammar checker, and AI agents.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function generateWebPageSchema(
  name: string,
  description: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      "@id": SITE_URL
    },
    publisher: {
      "@type": "Organization",
      name: "Shothik AI",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512x512.png`
      }
    },
    inLanguage: "en-US"
  };
}

export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Shothik AI",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "USD",
      description: "Free tier available"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.8,
      ratingCount: 1250
    },
    description: "AI-powered writing assistant with paraphrasing, humanizer, grammar checking, and AI agents."
  };
}

export function generateItemListSchema(items: { name: string; description: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      description: item.description
    }))
  };
}

export function generateAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Shothik AI",
    description: "Learn about Shothik AI's journey from 2022 startup to global AI writing platform. Built by PhD researchers, trusted by students at Harvard, MIT, and Stanford.",
    url: `${SITE_URL}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "Shothik AI",
      url: SITE_URL,
      foundingDate: "2022",
      description: "AI-powered writing platform built by academics for academics, offering domain-specific AI writing tools."
    }
  };
}

export function generateContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Shothik AI",
    description: "Get help from Shothik AI support team via email, Discord, or live chat.",
    url: `${SITE_URL}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "Shothik AI",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "support@shothik.ai",
        url: `${SITE_URL}/contact`
      }
    }
  };
}
