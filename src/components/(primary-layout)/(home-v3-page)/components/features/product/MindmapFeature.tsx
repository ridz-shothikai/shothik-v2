'use client';

import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Network, Brain, TrendingUp, MessageCircle, Play } from "lucide-react";

export default function MindmapFeature() {
  return (
    <section
      data-testid="section-mindmap-feature"
      className="py-20 md:py-32 bg-background relative"
    >
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-radial from-[rgba(24,119,242,0.15)] to-transparent pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <Badge 
            className="mb-6 bg-[rgba(24,119,242,0.15)] text-[#1877F2] border border-[rgba(24,119,242,0.3)] hover:bg-[rgba(24,119,242,0.15)]"
          >
            <Brain size={16} className="mr-2" />
            Our Secret Weapon
          </Badge>
          <h2 className="text-h2 font-bold text-foreground mb-4 text-5xl md:text-6xl">
            Strategic Mindmap Feature
          </h2>
          <h6 className="text-h6 text-muted-foreground max-w-2xl mx-auto font-normal mb-2">
            Don't just launch ads—understand the strategy behind every decision
          </h6>
          <p className="text-body1 text-muted-foreground/60 max-w-2xl mx-auto font-normal">
            Learn why your campaigns work while you earn. Our unique mindmap visualizes ad strategy, performance patterns, and optimization paths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="relative h-[350px] md:h-[450px] rounded-lg border border-white/10 bg-[rgba(15,20,35,0.8)] overflow-hidden shadow-[0_20px_60px_rgba(24,119,242,0.2)]">
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#1877F2]" />
                <span className="text-body2 text-white/70">
                  Campaign Strategy Mindmap
                </span>
              </div>
            </div>
            
            <div className="p-8 h-[calc(100%-60px)] flex items-center justify-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-30 h-30 rounded-full bg-gradient-to-br from-[#1877F2] to-[#667eea] flex items-center justify-center text-white font-bold text-sm text-center p-4 z-[3] shadow-[0_10px_40px_rgba(24,119,242,0.4)]">
                Campaign Strategy
              </div>

              {[
                { top: '10%', left: '15%', label: 'Audience', color: '#00A76F', lineLength: 200, angle: 135 },
                { top: '10%', right: '15%', label: 'Creative', color: '#1877F2', lineLength: 200, angle: 225 },
                { bottom: '10%', left: '15%', label: 'Budget', color: '#00A76F', lineLength: 200, angle: 45 },
                { bottom: '10%', right: '15%', label: 'Optimize', color: '#1877F2', lineLength: 200, angle: 315 },
              ].map((node, index) => (
                <div key={index}>
                  <div
                    className="absolute top-1/2 left-1/2 w-0.5 bg-white/20 origin-top"
                    style={{
                      height: `${node.lineLength}px`,
                      transform: `translate(-1px, 0) rotate(${node.angle}deg)`,
                      zIndex: 1,
                    }}
                  />
                  <div
                    className="absolute w-20 h-20 rounded-full bg-white/5 border-2 flex items-center justify-center font-semibold text-xs z-[2]"
                    style={{
                      ...node,
                      borderColor: node.color,
                      color: node.color,
                      boxShadow: `0 5px 20px ${node.color}40`,
                    }}
                  >
                    {node.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/60 rounded backdrop-blur-[10px]">
              <Play size={14} color="#1877F2" />
              <span className="text-caption text-[#1877F2]">Live Demo</span>
            </div>
          </div>

          <div className="text-foreground">
            <h4 className="text-h4 font-bold mb-8 text-foreground">
              Learn & Earn with Visual Intelligence
            </h4>
            
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-[rgba(24,119,242,0.15)] border border-[rgba(24,119,242,0.3)] flex items-center justify-center flex-shrink-0">
                  <Network size={24} color="#1877F2" />
                </div>
                <div>
                  <h6 className="text-h6 font-semibold mb-1 text-foreground">
                    Visual Strategy Maps
                  </h6>
                  <p className="text-body2 text-muted-foreground">
                    See how campaigns, ad sets, and creatives connect. Understand the full picture at a glance.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-[rgba(0,167,111,0.15)] border border-[rgba(0,167,111,0.3)] flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={24} color="#00A76F" />
                </div>
                <div>
                  <h6 className="text-h6 font-semibold mb-1 text-foreground">
                    Chat with Your Mindmap
                  </h6>
                  <p className="text-body2 text-muted-foreground">
                    Ask questions about your campaign structure. Get AI-powered insights and recommendations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-[rgba(24,119,242,0.15)] border border-[rgba(24,119,242,0.3)] flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={24} color="#1877F2" />
                </div>
                <div>
                  <h6 className="text-h6 font-semibold mb-1 text-foreground">
                    Learn What Works
                  </h6>
                  <p className="text-body2 text-muted-foreground">
                    Discover patterns, understand performance drivers, and become a better marketer with every campaign.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              data-testid="button-try-mindmap"
              className="mt-10 border-[#1877F2] text-[#1877F2] rounded font-semibold hover:bg-[rgba(24,119,242,0.15)]"
            >
              Explore Mindmap Feature
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
