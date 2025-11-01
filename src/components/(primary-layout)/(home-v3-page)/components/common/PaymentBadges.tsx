"use client";

import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

interface PaymentBadgesProps {
  variant?: "compact" | "full";
}

export default function PaymentBadges({
  variant = "full",
}: PaymentBadgesProps) {
  const countries = [
    { code: "IN", name: "India", methods: "UPI, Cards", bgColor: "#FF9933" },
    {
      code: "BD",
      name: "Bangladesh",
      methods: "bKash, Nagad",
      bgColor: "#006A4E",
    },
  ];

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {countries.map((country) => (
          <Badge
            key={country.code}
            variant="outline"
            className="text-caption bg-primary/10 dark:bg-primary/15 text-foreground border-primary/20 dark:border-primary/30 font-semibold"
            data-testid={`chip-${country.name.toLowerCase()}`}
          >
            {country.name}
          </Badge>
        ))}
        <span className="text-body2 text-muted-foreground text-caption font-semibold">
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
                  className="mr-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: country.bgColor }}
                >
                  {country.code}
                </div>
                <span className="text-body2 mr-1 font-bold">
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
            className="bg-muted/50 dark:bg-muted/50 text-muted-foreground text-caption border-border mt-3 font-semibold"
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
              <CreditCard className="text-secondary mr-2 h-4 w-4" />
              Visa / Mastercard
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
