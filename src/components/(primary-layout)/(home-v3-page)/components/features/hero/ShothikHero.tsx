'use client';

import { ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";
import checkmarkLogo from "../../../attached_assets/Checkmark_1759923653930.png";
import NeuralNetworkDots from "./NeuralNetworkDots";
import HeroVideo from "./HeroVideo";
import VideoModal from "./VideoModal";
import { useTextRotation } from "./hooks/useTextRotation";
import { useScrollLock } from "./hooks/useScrollLock";
import { useMouseTracking } from "./hooks/useMouseTracking";

const TYPING_TEXTS = ["Writing reports...", "Creating slides...", "Running ads..."];

export default function ShothikHero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const checkmarkRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const currentText = useTextRotation(TYPING_TEXTS);
  useScrollLock(isVideoOpen);
  const { mousePos, scrollY } = useMouseTracking(heroRef);

  const getCheckmarkTilt = () => {
    if (!checkmarkRef.current || !heroRef.current) return {};
    const heroRect = heroRef.current.getBoundingClientRect();
    const rect = checkmarkRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - heroRect.left;
    const centerY = rect.top + rect.height / 2 - heroRect.top;
    const deltaX = mousePos.x - centerX;
    const deltaY = mousePos.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 200) return {};
    
    const tiltX = (deltaY / distance) * 5;
    const tiltY = -(deltaX / distance) * 5;
    
    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      transition: 'transform 0.1s ease-out',
    };
  };

  const getVideoPulse = () => {
    if (!videoRef.current || !heroRef.current) return {};
    const heroRect = heroRef.current.getBoundingClientRect();
    const rect = videoRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - heroRect.left;
    const centerY = rect.top + rect.height / 2 - heroRect.top;
    const distance = Math.sqrt(
      Math.pow(mousePos.x - centerX, 2) + Math.pow(mousePos.y - centerY, 2)
    );
    
    if (distance < 300) {
      const intensity = 1 - (distance / 300);
      return {
        transform: `scale(${1 + intensity * 0.02})`,
        boxShadow: `0 0 ${intensity * 30}px rgba(0, 167, 111, ${intensity * 0.3})`,
      };
    }
    return {};
  };

  return (
    <section
      ref={heroRef}
      className="min-h-[75vh] md:min-h-[80vh] flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 py-24 md:py-32 relative overflow-visible bg-background"
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,167,111,0.015),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_50%,rgba(0,167,111,0.025),transparent_60%)] pointer-events-none z-[1]" />

      <NeuralNetworkDots />

      <div
        className="absolute top-0 left-0 right-0 bottom-0 transition-transform duration-100 ease-out motion-reduce:transform-none z-0"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      <div className="max-w-[80rem] mx-auto text-center relative z-10">
        <div className="mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div
              ref={checkmarkRef}
              className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 animate-checkmark-bounce motion-reduce:animate-none motion-reduce:transform-none"
              style={getCheckmarkTilt()}
            >
              <Image
                src={checkmarkLogo}
                alt="Shothik Success"
                width={80}
                height={80}
                data-testid="img-checkmark-logo"
                className="w-full h-full"
              />
            </div>
            <h1
              className="text-h1 m-0 text-foreground"
              data-testid="text-hero-heading"
            >
              Let Shothik Handle It
            </h1>
          </div>

          <div className="min-h-[36px] md:min-h-[44px] flex items-center justify-center mb-8 md:mb-10">
            <h2
              className="text-h5 md:text-h4 text-primary animate-fade-in motion-reduce:animate-none"
              key={currentText}
            >
              {TYPING_TEXTS[currentText]}
            </h2>
          </div>

          <p className="max-w-3xl text-foreground-secondary mx-auto mb-3 md:mb-4 text-body1 md:text-subtitle1 px-4">
            AI built for humanity, not just the privileged few. 100+ languages. Hyperlocal payments. Enterprise features at human prices.
          </p>
          <p className="max-w-2xl text-foreground-tertiary mx-auto mb-6 text-body2 md:text-subtitle2 px-4">
            From Bangladesh to the world—giving voice to billions
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 mt-20 md:mt-24 mb-16 md:mb-20 animate-bounce-slow motion-reduce:animate-none">
          <span className="text-body2 md:text-body1 text-foreground-secondary">
            Watch how it works
          </span>
          <ChevronDown className="h-6 w-6 text-foreground-tertiary" />
        </div>

        <HeroVideo
          videoRef={videoRef}
          scrollY={scrollY}
          videoPulseStyle={getVideoPulse()}
          onVideoClick={() => setIsVideoOpen(true)}
        />
      </div>

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />

      <style jsx>{`
        @keyframes checkmarkBounceIn {
          0% { opacity: 0; transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-checkmark-bounce {
          animation: checkmarkBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-checkmark-bounce,
          .animate-fade-in,
          .animate-bounce-slow {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
