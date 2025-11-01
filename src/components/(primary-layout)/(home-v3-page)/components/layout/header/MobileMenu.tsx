'use client';

import { Button } from '../../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../ui/sheet';
import { Separator } from "../../ui/separator";
import { Sun, Moon, Monitor } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { ThemePreference } from '../../../lib/theme-utils';

interface MenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface NavLink {
  label: string;
  href: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  featuresSections: MenuSection[];
  navLinks: NavLink[];
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

export default function MobileMenu({
  open,
  onClose,
  featuresSections,
  navLinks,
  preference,
  setPreference,
}: MobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[280px] overflow-y-auto" data-testid="mobile-drawer">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        
        <Separator className="my-4" />
        
        <div className="px-2 py-2">
          <div className="text-subtitle2 font-bold mb-2 text-muted-foreground">Features</div>
          
          {featuresSections.map((section) => (
            <div key={section.title}>
              <div className="text-caption font-semibold text-foreground mt-4 mb-2 uppercase">
                {section.title}
              </div>
              <div className="flex flex-col">
                {section.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="py-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />
        
        <div className="flex flex-col">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="px-4 py-3 font-semibold text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="px-2 py-2">
          <div className="text-caption font-semibold text-muted-foreground mb-2 uppercase">
            Theme
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <Button
              variant="ghost"
              className={`justify-start ${preference === 'auto' ? 'text-primary bg-accent font-semibold' : 'text-foreground'}`}
              onClick={() => setPreference('auto')}
              data-testid="mobile-theme-auto"
            >
              <Monitor className="mr-2 h-4 w-4" />
              Auto (Time-based)
            </Button>
            <Button
              variant="ghost"
              className={`justify-start ${preference === 'light' ? 'text-primary bg-accent font-semibold' : 'text-foreground'}`}
              onClick={() => setPreference('light')}
              data-testid="mobile-theme-light"
            >
              <Sun className="mr-2 h-4 w-4" />
              Light Mode
            </Button>
            <Button
              variant="ghost"
              className={`justify-start ${preference === 'dark' ? 'text-primary bg-accent font-semibold' : 'text-foreground'}`}
              onClick={() => setPreference('dark')}
              data-testid="mobile-theme-dark"
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark Mode
            </Button>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            data-testid="mobile-join-waitlist"
          >
            Join the Waitlist
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
