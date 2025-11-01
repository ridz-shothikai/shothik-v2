'use client';

import { Button } from '../../ui/button';
import { Play } from 'lucide-react';
import Image from "next/image";
import { RefObject } from "react";
import heroImage from "../../../attached_assets/B80BBD6F-003A-44F9-B9B6-31569128A57E_1759865243321.png";

interface HeroVideoProps {
  videoRef: RefObject<HTMLDivElement>;
  scrollY: number;
  videoPulseStyle: React.CSSProperties;
  onVideoClick: () => void;
  className?: string;
}

export default function HeroVideo({ 
  videoRef, 
  scrollY, 
  videoPulseStyle, 
  onVideoClick,
  className
}: HeroVideoProps) {
  return (
    <div className={`mb-0 ${className || ''}`}>
      <div
        ref={videoRef}
        onClick={onVideoClick}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onVideoClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Play introduction video - Watch Shothik founders explain the platform"
        data-testid="video-hero"
        className="relative max-w-full md:max-w-[750px] h-[40vh] md:h-[45vh] mx-auto rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out border border-border shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] hover:shadow-[0_12px_24px_-4px_rgba(145,158,171,0.16)] focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2 motion-reduce:transform-none"
        style={{
          transform: `scale(${1 + scrollY * 0.0001})`,
          ...videoPulseStyle,
        }}
      >
        <Image
          src={heroImage}
          alt="Shothik AI Founders - Introducing Shothik"
          fill
          priority
          style={{
            objectFit: 'contain',
          }}
          sizes="(max-width: 768px) 100vw, 750px"
        />

        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-20">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Play introduction video"
            data-testid="button-play-video"
            className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] bg-white/95 backdrop-blur-md border-2 border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-[1.08] hover:bg-white hover:shadow-[0_12px_48px_rgba(0,0,0,0.16)] hover:border-primary active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-4 motion-reduce:animate-none motion-reduce:transition-none animate-pulse-ring"
          >
            <Play className="h-8 w-8 md:h-10 md:w-10 text-primary ml-1" />
          </Button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse-ring {
          0%, 100% {
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 0 rgba(25, 118, 210, 0.4);
          }
          50% {
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 12px rgba(25, 118, 210, 0);
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-ring {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
