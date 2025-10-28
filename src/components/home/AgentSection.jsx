"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const AgentSection = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: 0.2 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, delay: 0.4 },
    },
  };

  return (
    <motion.section
      className="relative mx-auto w-full max-w-7xl px-4 py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
        {/* Left Text Side */}
        <motion.div className="order-2 md:order-1" variants={textVariants}>
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Agent
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Delegate coding tasks so you can focus on higher-level
                direction.
              </p>
            </div>

            <div className="space-y-4 border-l-2 border-emerald-500 pl-6">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Code Generation
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Automatically generate, review, and refactor code from natural
                  language prompts.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Task Management
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Track progress on multiple coding tasks with real-time status
                  updates.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Intelligent Context
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Maintain full project context across conversations and
                  iterations.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/agents"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-emerald-700"
              >
                Explore Agent
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Right Interactive Side with Decorative Frame */}
        <motion.div
          className="relative order-1 md:order-2"
          variants={imageVariants}
        >
          {/* Decorative curved frame */}
          <div className="absolute -inset-4 opacity-0 md:opacity-100">
            <svg
              className="absolute inset-0 h-full w-full text-slate-900"
              viewBox="0 0 400 500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M 50 80 Q 80 50 120 50 L 350 50 Q 380 50 380 80 L 380 420 Q 380 450 350 450 L 50 450 Q 20 450 20 420 L 20 150 Q 20 100 50 80" />
              <path
                d="M 350 50 Q 380 80 360 120 L 380 200"
                strokeOpacity="0.5"
              />
              <path d="M 20 350 L 0 380" strokeOpacity="0.5" />
            </svg>
          </div>

          {/* Main content area */}
          <div className="relative z-10">
            {/* Browser chrome mockup */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
              {/* Top bar */}
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
              </div>

              {/* Content area with gradient background */}
              <div className="relative h-96 overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 p-6">
                {/* Background image or pattern */}
                <div className="absolute inset-0 opacity-20">
                  <img
                    src="/home/shothik-mascot.png"
                    alt="Background"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Overlay with content */}
                <div className="relative z-10 space-y-4 rounded-lg border border-white/50 bg-white/90 p-5 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Cursor
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex gap-2">
                      <span className="text-emerald-600">○</span>
                      <div>
                        <p className="font-medium text-slate-900">
                          IN PROGRESS 3
                        </p>
                        <p className="text-xs text-slate-500">Generating...</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-slate-400">◐</span>
                      <div>
                        <p className="font-medium text-slate-900">
                          Analyze Tab vs Agent
                        </p>
                        <p className="text-xs text-slate-500">Just now</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-slate-400">◐</span>
                      <div>
                        <p className="font-medium text-slate-900">
                          Set up Cursor Rules
                        </p>
                        <p className="text-xs text-slate-500">10m</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <p className="text-xs leading-relaxed text-slate-600">
                      Analyze Tab vs Agent Usage Patterns. Help me understand
                      how teams split their focus between the tab, view and the
                      agents panel across our workspaces.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AgentSection;
