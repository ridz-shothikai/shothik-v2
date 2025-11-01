'use client';

import { SiLinkedin, SiFacebook, SiX, SiInstagram, SiDiscord } from "react-icons/si";
import { IconType } from "react-icons";

interface SocialLink {
  icon: IconType;
  href: string;
  color: string;
  testId: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  { icon: SiLinkedin, href: "https://www.linkedin.com/company/shothik-ai", color: "#0A66C2", testId: "linkedin", label: "LinkedIn" },
  { icon: SiFacebook, href: "https://www.facebook.com/shothik.ai", color: "#1877F2", testId: "facebook", label: "Facebook" },
  { icon: SiX, href: "https://x.com/shothik_ai", color: "#000000", testId: "twitter", label: "Twitter" },
  { icon: SiInstagram, href: "https://www.instagram.com/shothik.ai", color: "#E4405F", testId: "instagram", label: "Instagram" },
  { icon: SiDiscord, href: "https://discord.gg/shothik-ai", color: "#5865F2", testId: "discord", label: "Discord" },
];

interface SocialLinksProps {
  className?: string;
}

export default function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div className={className}>
      <div className="text-subtitle2 font-bold text-caption text-foreground mb-4 uppercase tracking-wider">
        Get to Know Us
      </div>
      <div className="flex gap-3 flex-wrap">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.testId}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${social.label}`}
              className="flex items-center justify-center w-8 h-8 rounded-md bg-white/5 dark:bg-white/5 text-muted-foreground transition-all duration-200 hover:bg-white/10 dark:hover:bg-white/10"
              style={{ '--hover-color': social.color } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.color = social.color}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
              data-testid={`button-${social.testId}`}
            >
              <Icon size={16} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
