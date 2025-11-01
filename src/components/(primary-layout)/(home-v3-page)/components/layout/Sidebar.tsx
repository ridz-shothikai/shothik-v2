"use client";

import Image from "next/image";
import { useState } from "react";
import agentIcon from "../../attached_assets/Agent_1759908370558.png";
import aiDetectorIcon from "../../attached_assets/AI Detector_1759908376738.png";
import checkmarkImage from "../../attached_assets/Checkmark_1759923653930.png";
import grammarIcon from "../../attached_assets/Grammar Fix_1759908381522.png";
import humanizeIcon from "../../attached_assets/Humanize GPT_1759908388806.png";
import marketingIcon from "../../attached_assets/Marketing Automation_1759908397767.png";
import paraphraseIcon from "../../attached_assets/Paraphrase_1759908407164.png";
import summarizeIcon from "../../attached_assets/Summarize_1759908412611.png";
import translatorIcon from "../../attached_assets/Translator_1759908416747.png";

const mainNavItems = [
  {
    icon: paraphraseIcon,
    label: "Paraphrase",
    id: "paraphrase",
  },
  {
    icon: humanizeIcon,
    label: "Humanize GPT",
    id: "humanize",
  },
  {
    icon: aiDetectorIcon,
    label: "AI Detector",
    id: "ai-detector",
  },
  {
    icon: grammarIcon,
    label: "Grammar Fix",
    id: "grammar",
  },
  {
    icon: summarizeIcon,
    label: "Summarize",
    id: "summarize",
  },
  {
    icon: translatorIcon,
    label: "Translator",
    id: "translator",
  },
  {
    icon: agentIcon,
    label: "Agent",
    id: "agent",
  },
];

const bottomNavItem = {
  icon: marketingIcon,
  label: "Marketing Automation",
  id: "marketing",
};

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState<string>("paraphrase");

  return (
    <aside className="border-border/60 dark:border-border/60 fixed top-0 left-0 flex h-screen w-20 flex-col items-center border-r bg-white/70 py-4 backdrop-blur-[20px] backdrop-saturate-[180%] dark:bg-black dark:backdrop-blur-none">
      <div className="mb-6 flex items-center justify-center">
        <Image
          src={checkmarkImage}
          alt="Shothik AI"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-3">
        {mainNavItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`flex cursor-pointer flex-col items-center gap-1 border-none bg-none px-2 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded p-2 transition-colors ${
                  isActive
                    ? "bg-[rgba(0,167,111,0.1)] hover:bg-[rgba(0,167,111,0.15)]"
                    : "bg-transparent hover:bg-white/5 dark:hover:bg-white/5"
                }`}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="max-w-[70px] text-center text-[9px] leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          onClick={() => setActiveItem(bottomNavItem.id)}
          data-testid={`nav-${bottomNavItem.label.toLowerCase().replace(/\s+/g, "-")}`}
          className={`flex cursor-pointer flex-col items-center gap-1 border-none bg-none px-2 transition-colors ${
            activeItem === bottomNavItem.id
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded p-2 transition-colors ${
              activeItem === bottomNavItem.id
                ? "bg-[rgba(0,167,111,0.1)] hover:bg-[rgba(0,167,111,0.15)]"
                : "bg-transparent hover:bg-white/5 dark:hover:bg-white/5"
            }`}
          >
            <Image
              src={bottomNavItem.icon}
              alt={bottomNavItem.label}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="max-w-[70px] text-center text-[9px] leading-tight">
            {bottomNavItem.label}
          </span>
        </button>
      </div>
    </aside>
  );
}
