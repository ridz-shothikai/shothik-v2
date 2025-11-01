'use client';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
  className?: string;
}

export default function FooterColumn({ title, links, className }: FooterColumnProps) {
  return (
    <div className={className}>
      <div className="text-subtitle2 font-bold text-foreground mb-4 uppercase tracking-wider">
        {title}
      </div>
      <div className="flex flex-col gap-2.5">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-body2 text-foreground-secondary hover:text-primary transition-colors duration-200"
            data-testid={`link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
