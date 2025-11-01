'use client';

import { Badge } from '../ui/badge';
import { CreditCard } from "lucide-react";

interface PaymentBadgesProps {
  variant?: 'compact' | 'full';
}

export default function PaymentBadges({ variant = 'full' }: PaymentBadgesProps) {
  const countries = [
    { code: 'IN', name: 'India', methods: 'UPI, Cards', bgColor: '#FF9933' },
    { code: 'BD', name: 'Bangladesh', methods: 'bKash, Nagad', bgColor: '#006A4E' },
  ];

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {countries.map((country) => (
          <Badge
            key={country.code}
            variant="outline"
            className="font-semibold text-caption bg-primary/10 dark:bg-primary/15 text-foreground border-primary/20 dark:border-primary/30"
            data-testid={`chip-${country.name.toLowerCase()}`}
          >
            {country.name}
          </Badge>
        ))}
        <span className="text-body2 font-semibold text-muted-foreground text-caption">
          + 15 more coming soon
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-overline text-muted-foreground mb-3">
            Hyperlocal Payments
          </div>
          <div className="flex flex-wrap gap-3">
            {countries.map((country) => (
              <Badge
                key={country.code}
                variant="outline"
                className="bg-primary/10 dark:bg-primary/15 text-foreground border-primary/20 dark:border-primary/30 px-2 py-2"
                data-testid={`chip-payment-${country.name.toLowerCase()}`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mr-2"
                  style={{ backgroundColor: country.bgColor }}
                >
                  {country.code}
                </div>
                <span className="font-bold text-body2 mr-1">
                  {country.name}
                </span>
                <span className="text-caption text-muted-foreground">
                  {country.methods}
                </span>
              </Badge>
            ))}
          </div>
          <Badge
            variant="outline"
            className="mt-3 bg-muted/50 dark:bg-muted/50 text-muted-foreground font-semibold text-caption border-border"
            data-testid="chip-more-countries"
          >
            15+ countries coming soon
          </Badge>
        </div>

        <div>
          <div className="text-overline text-muted-foreground mb-3">
            International Payments
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge
              variant="outline"
              className="bg-secondary/10 dark:bg-secondary/15 text-foreground border-secondary/20 dark:border-secondary/30 font-semibold"
              data-testid="chip-payment-cards"
            >
              <CreditCard className="h-4 w-4 text-secondary mr-2" />
              Visa / Mastercard
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
