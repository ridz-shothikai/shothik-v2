'use client';

import { Button } from '../../ui/button';
import { LucideIcon } from 'lucide-react';

interface MenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

interface MenuColumnProps {
  title: string;
  items: MenuItem[];
  onItemClick: () => void;
  className?: string;
}

export default function MenuColumn({ title, items, onItemClick, className }: MenuColumnProps) {
  return (
    <div className={className}>
      <div className="text-subtitle2 font-bold text-foreground mb-4 text-sm uppercase tracking-wide">
        {title}
      </div>
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.label}
              variant="ghost"
              asChild
              className="justify-start text-muted-foreground text-sm font-medium px-3 py-2 rounded hover:bg-muted hover:text-primary"
              data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={onItemClick}
            >
              <a href={item.href}>
                <Icon className="h-[18px] w-[18px] mr-2" />
                {item.label}
              </a>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
