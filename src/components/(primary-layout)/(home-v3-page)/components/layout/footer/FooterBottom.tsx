'use client';

import logo from "../../../attached_assets/Logo (3)_1760613683127.png";
import Image from 'next/image';

const bottomLinks = [
  { label: "Terms of Service", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Deletion Policy", href: "#deletion" },
  { label: "Refund Policy", href: "#refund" },
];

interface FooterBottomProps {
  className?: string;
}

export default function FooterBottom({ className }: FooterBottomProps) {
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${className || ''}`}>
      <div className="flex flex-col gap-4">
        <Image
          src={logo}
          alt="Shothik AI"
          height={20}
          width={100}
          className="h-5 max-w-[100px] w-auto object-contain"
          data-testid="logo-footer"
        />
        <div>
          <div className="text-body2 text-foreground-secondary mb-2">
            © {new Date().getFullYear()} Shothik AI. All rights reserved.
          </div>
          <div className="text-body2 text-foreground-tertiary mb-3 max-w-md">
            AI writing assistant built by academics, for academics. Trusted by students at Harvard, MIT, and Stanford.
          </div>
          <div className="flex gap-3 flex-wrap mb-3">
            {bottomLinks.map((link, index) => (
              <div key={link.label} className="flex items-center gap-3">
                <a
                  href={link.href}
                  className="text-body2 text-foreground-secondary hover:text-primary transition-colors"
                  data-testid={`link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {link.label}
                </a>
                {index < bottomLinks.length - 1 && (
                  <span className="text-foreground-tertiary">•</span>
                )}
              </div>
            ))}
          </div>
          <div className="text-caption text-foreground-tertiary text-xs leading-relaxed">
            This site is protected by reCAPTCHA and the Google{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-secondary hover:text-primary transition-colors"
              data-testid="link-google-privacy"
            >
              Privacy Policy
            </a>
            {' '}and{' '}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-secondary hover:text-primary transition-colors"
              data-testid="link-google-terms"
            >
              Terms of Service
            </a>
            {' '}apply
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 self-start md:self-end">
        <div className="text-body2 text-foreground-secondary">
          Accepted Payments
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <span className="px-3 py-1.5 bg-card border border-border rounded-md text-caption text-foreground-secondary font-medium">
            Visa
          </span>
          <span className="px-3 py-1.5 bg-card border border-border rounded-md text-caption text-foreground-secondary font-medium">
            Mastercard
          </span>
          <span className="px-3 py-1.5 bg-card border border-border rounded-md text-caption text-foreground-secondary font-medium">
            bKash
          </span>
          <span className="px-3 py-1.5 bg-card border border-border rounded-md text-caption text-foreground-secondary font-medium">
            UPI
          </span>
        </div>
        <div className="text-caption text-foreground-tertiary mt-2">
          14-day free trial • No credit card required
        </div>
      </div>
    </div>
  );
}
