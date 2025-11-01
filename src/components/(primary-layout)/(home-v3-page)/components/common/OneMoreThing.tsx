'use client';

import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Sparkles } from "lucide-react";

export default function OneMoreThing() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-background">
      <div className="max-w-[896px] mx-auto px-4 md:px-8 text-center relative">
        <div className="text-overline text-muted-foreground mb-6">
          And one more thing...
        </div>
        
        <h2 className="text-h1 mb-6 leading-tight text-foreground">
          Meta Andromeda<br />powered ads.
        </h2>
        
        <p className="text-h5 mb-12 font-normal max-w-[672px] mx-auto text-muted-foreground">
          Create Facebook & Instagram ads that actually convert. Automatically.
        </p>

        <Card className="p-4 md:p-6 bg-white/5 dark:bg-white/5 shadow-[0_20px_60px_rgba(24,119,242,0.2)] mb-8 rounded-lg border border-white/10 dark:border-white/10">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="text-h4 mb-3 text-foreground">
                  8-15 creative variants
                </h4>
                <p className="text-body1 text-muted-foreground">
                  Persona-based ad copy for every audience stage.
                </p>
              </div>
              <div>
                <h4 className="text-h4 mb-3 text-foreground">
                  All formats supported
                </h4>
                <p className="text-body1 text-muted-foreground">
                  Reels, carousel, static, video—all optimized.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          size="lg"
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          data-testid="button-try-meta-ads"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Try Meta Ad Automation
        </Button>
      </div>
    </section>
  );
}
