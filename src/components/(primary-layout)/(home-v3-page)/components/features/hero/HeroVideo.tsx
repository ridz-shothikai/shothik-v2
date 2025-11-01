"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
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
  className,
}: HeroVideoProps) {
  return (
    <div className={`mb-0 ${className || ""}`}>
      <div
        ref={videoRef}
        onClick={onVideoClick}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onVideoClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Play introduction video - Watch Shothik founders explain the platform"
        data-testid="video-hero"
        className="border-border focus-visible:outline-primary relative mx-auto h-[40vh] max-w-full cursor-pointer overflow-hidden rounded-2xl border shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] transition-all duration-300 ease-out hover:shadow-[0_12px_24px_-4px_rgba(145,158,171,0.16)] focus-visible:outline-3 focus-visible:outline-offset-2 motion-reduce:transform-none md:h-[45vh] md:max-w-[750px]"
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
            objectFit: "contain",
          }}
          sizes="(max-width: 768px) 100vw, 750px"
        />

        <div className="absolute top-0 right-0 bottom-0 left-0 z-20 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Play introduction video"
            data-testid="button-play-video"
            className="hover:border-primary focus-visible:outline-primary animate-pulse-ring h-[60px] w-[60px] border-2 border-white/80 bg-white/95 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:scale-[1.08] hover:bg-white hover:shadow-[0_12px_48px_rgba(0,0,0,0.16)] focus-visible:outline-3 focus-visible:outline-offset-4 active:scale-[0.98] motion-reduce:animate-none motion-reduce:transition-none md:h-[72px] md:w-[72px]"
          >
            <Play className="text-primary ml-1 h-8 w-8 md:h-10 md:w-10" />
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-ring {
          0%,
          100% {
            box-shadow:
              0 8px 32px rgba(0, 0, 0, 0.12),
              0 0 0 0 rgba(25, 118, 210, 0.4);
          }
          50% {
            box-shadow:
              0 8px 32px rgba(0, 0, 0, 0.12),
              0 0 0 12px rgba(25, 118, 210, 0);
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
