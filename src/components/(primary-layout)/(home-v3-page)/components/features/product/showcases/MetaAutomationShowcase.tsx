'use client';

import { useState, useEffect } from "react";
import { Button } from '../../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { X, CheckCircle2, Loader2 } from "lucide-react";

export default function MetaAutomationShowcase() {
  const [open, setOpen] = useState(false);
  const [agentStage, setAgentStage] = useState(0);

  const stages = [
    {
      title: "Product Analysis",
      description: "Extracting product data and competitor landscape",
      progress: 15,
    },
    {
      title: "AI Personas & Campaigns",
      description: "Generating targeted personas and campaign structure",
      progress: 30,
    },
    {
      title: "Vibe Canvas - Ad Creatives",
      description: "Creating compelling ad copy and variations",
      progress: 50,
    },
    {
      title: "Media Canvas Generation",
      description: "Generating UGC, influencers, and content formats",
      progress: 70,
    },
    {
      title: "Campaign Launch",
      description: "Publishing to Facebook with targeting configuration",
      progress: 90,
    },
    {
      title: "Dashboard & Optimization",
      description: "Live insights, mindmap learning, and AI suggestions",
      progress: 100,
    },
  ];

  useEffect(() => {
    if (open && agentStage < 5) {
      const timer = setTimeout(() => {
        setAgentStage(agentStage + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, agentStage]);

  const handleOpen = () => {
    setAgentStage(0);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAgentStage(0);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        size="lg"
        data-testid="button-try-meta-demo"
        className="text-sm font-semibold rounded-lg bg-[#1877F2] hover:bg-[#0C63D4] text-white"
      >
        Try Interactive Demo
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl h-[80vh] p-0 gap-0 bg-background dark:bg-gray-900">
          <div className="flex h-full">
            <div className="w-80 border-r border-border bg-gray-50 dark:bg-gray-800 p-6 overflow-y-auto">
              <p className="text-caption text-muted-foreground font-bold mb-6 block">
                META AUTOMATION PIPELINE
              </p>

              <div className="flex flex-col gap-4">
                {stages.map((stage, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all ${
                      index <= agentStage
                        ? 'border-[#1877F2] bg-[rgba(24,119,242,0.05)] opacity-100'
                        : 'border-border bg-transparent opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {index < agentStage ? (
                        <CheckCircle2 size={16} color="#1877F2" />
                      ) : index === agentStage ? (
                        <Loader2 size={16} color="#1877F2" className="animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-border" />
                      )}
                      <p className="text-body2 font-semibold text-foreground">
                        {stage.title}
                      </p>
                    </div>
                    <p className="text-caption text-muted-foreground block mb-3">
                      {stage.description}
                    </p>
                    {index <= agentStage && (
                      <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                        <div
                          className="h-full bg-[#1877F2] transition-all duration-1000"
                          style={{
                            width: `${index < agentStage ? 100 : stage.progress}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="px-8 py-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-h6 font-bold text-foreground">Meta Automation Agent</h3>
                  <p className="text-body2 text-muted-foreground">
                    From product link to live campaigns automatically
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  size="icon"
                  data-testid="button-close-meta-demo"
                  className="text-muted-foreground"
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {agentStage === 5 ? (
                  <div className="text-center py-16">
                    <CheckCircle2 size={64} color="#1877F2" className="mx-auto" />
                    <h4 className="text-h4 mt-6 mb-4 font-bold">Campaign Live!</h4>
                    <p className="text-body1 text-muted-foreground mb-8">
                      Your Meta ads campaign is now running with AI-powered optimization
                    </p>
                    <div className="grid grid-cols-4 gap-6 max-w-2xl mx-auto">
                      {[
                        { value: '2.4K', label: 'Impressions' },
                        { value: '156', label: 'Clicks' },
                        { value: '12', label: 'Conversions' },
                        { value: '3.2x', label: 'ROAS' },
                      ].map((stat, i) => (
                        <div key={i} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border">
                          <p className="text-h5 font-bold text-[#1877F2]">{stat.value}</p>
                          <p className="text-caption text-muted-foreground">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto">
                    <h5 className="text-h5 mb-4 font-bold text-center">
                      {stages[agentStage].title}
                    </h5>
                    <p className="text-body2 text-muted-foreground text-center mb-8">
                      {stages[agentStage].description}
                    </p>
                    <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-xl border border-border">
                      <div className="flex items-center gap-4 mb-6">
                        <Loader2 size={20} color="#1877F2" className="animate-spin" />
                        <p className="text-body2 font-semibold">Processing...</p>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                        <div
                          className="h-full bg-[#1877F2] transition-all duration-1000"
                          style={{
                            width: `${stages[agentStage].progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
