'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import shothikInterface from "../../../attached_assets/image_1760596886557.png";

export default function FounderMessage() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-32 md:py-48 bg-background"
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div 
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12 md:gap-16 items-center mb-32 md:mb-40 transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)'
          }}
        >
          <div className="flex flex-col gap-6">
            <h2 className="text-h2 leading-tight font-bold text-foreground">
              Write naturally, <br />perfect instantly.
            </h2>
            <p className="text-subtitle1 md:text-body1 leading-relaxed max-w-lg text-foreground-secondary">
              Shothik's AI understands context and tone, helping you craft professional content that sounds authentically human—from your first draft to your final masterpiece.
            </p>
          </div>
          <div className="relative">
            <Image
              src={shothikInterface}
              alt="Shothik AI Writing Interface"
              width={900}
              height={600}
              className="w-full h-auto rounded-2xl shadow-[0_20px_60px_rgba(0,167,111,0.2)] border border-white/10"
            />
          </div>
        </div>

        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center transition-all duration-700 delay-200 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)'
          }}
        >
          <div className="order-1 lg:order-2 flex flex-col gap-6">
            <h2 className="text-h2 leading-tight font-bold text-foreground">
              Your lifelong writing companion.
            </h2>
            <p className="text-subtitle1 md:text-body1 leading-relaxed max-w-lg text-foreground-secondary">
              From your first essay as a student to your first business proposal as an entrepreneur—Shothik grows with you through every milestone of your journey.
            </p>
          </div>
          <div className="order-2 lg:order-1 relative">
            <div className="aspect-[4/3] bg-white/5 rounded-2xl shadow-[0_20px_60px_rgba(24,119,242,0.2)] p-8 flex items-center justify-center border border-white/10">
              <div className="text-center text-white/40">
                <p className="text-body2 font-normal text-foreground-tertiary">
                  Secondary screenshot will be placed here
                </p>
                <p className="text-caption block mt-2 text-foreground-tertiary">
                  Add your feature showcase image
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
