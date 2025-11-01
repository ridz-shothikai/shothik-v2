'use client';

import { Button } from '../../ui/button';
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  tag: string;
  title: string;
  description: string;
  accentColor: string;
  mockup: ReactNode;
  reverse?: boolean;
  index: number;
  mockupType: string;
}

export default function FeatureCard({
  icon,
  tag,
  title,
  description,
  accentColor,
  mockup,
  reverse = false,
  index,
  mockupType,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      data-testid={`feature-${mockupType}`}
      className="mb-32 md:mb-48"
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center`}>
        <div className={reverse ? 'md:order-2' : 'md:order-1'}>
          <div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-lg border transition-all duration-200 hover:translate-x-1 mb-8"
            style={{
              backgroundColor: `${accentColor}10`,
              borderColor: `${accentColor}30`,
            }}
          >
            <div className="flex items-center" style={{ color: accentColor }}>
              {icon}
            </div>
            <span
              className="text-caption font-bold uppercase tracking-wider text-xs"
              style={{ color: accentColor }}
            >
              {tag}
            </span>
          </div>

          <h3 className="text-h3 font-bold text-foreground mb-6 text-4xl md:text-5xl tracking-tight leading-tight">
            {title}
          </h3>

          <p className="text-body1 text-muted-foreground mb-10 leading-relaxed text-base md:text-lg tracking-wide">
            {description}
          </p>

          <Button
            size="lg"
            data-testid={`button-try-${mockupType}`}
            className="px-10 py-7 rounded-lg font-semibold text-base tracking-wide shadow-[0_4px_14px_rgba(24,119,242,0.3)] hover:shadow-[0_8px_24px_rgba(24,119,242,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            style={{ backgroundColor: '#1877F2' }}
          >
            Try It Now
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2, ease: "easeOut" }}
          className={`${reverse ? 'md:order-1' : 'md:order-2'} hover-card-mockup`}
        >
          {mockup}
        </motion.div>
      </div>

      <style jsx>{`
        .hover-card-mockup:hover :global(.mockup-container) {
          transform: translateY(-4px);
          box-shadow: 0 24px 64px rgba(24, 119, 242, 0.2);
        }
        :global(.dark) .hover-card-mockup:hover :global(.mockup-container) {
          box-shadow: 0 24px 64px rgba(24, 119, 242, 0.35);
        }
      `}</style>
    </motion.div>
  );
}
