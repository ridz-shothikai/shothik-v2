'use client';

import { Button } from '../ui/button';

export default function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
        <h2 className="text-h1 mb-12 leading-tight text-foreground">
          Ready to begin?
        </h2>

        <Button 
          size="lg"
          className="mb-4 bg-primary hover:bg-primary/90 text-primary-foreground"
          data-testid="button-get-started-final"
        >
          Get Started
        </Button>

        <p className="text-body2 text-muted-foreground">
          No credit card required
        </p>
      </div>
    </section>
  );
}
