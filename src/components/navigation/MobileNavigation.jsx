"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useResponsive from "@/hooks/useResponsive";
import SvgColor from "@/resource/SvgColor";
import { usePathname, useRouter } from "next/navigation";

const links = [
  {
    title: "Paraphrase",
    link: "/paraphrase",
    iconColor: "#FF595E",
    iconSrc: "/navbar/paraphrase.svg",
  },
  {
    title: "Humanize GPT",
    link: "/humanize-gpt",
    iconColor: "#FF595E",
    iconSrc: "/navbar/bypass-svgrepo-com.svg",
  },
  {
    title: "AI Detector",
    link: "/ai-detector",
    iconColor: "#6A4C93",
    iconSrc: "/navbar/ai_detector_icon.svg",
  },
  {
    title: "Plagiarism Checker",
    link: "/plagiarism-checker",
    iconColor: "#6A4C93",
    iconSrc: "/navbar/plagiarism_checker.svg",
  },
  {
    title: "Grammar Fix",
    link: "/grammar-checker",
    iconColor: "#8AC926",
    iconSrc: "/navbar/grammar.svg",
  },
  {
    title: "Summarize",
    link: "/summarize",
    iconColor: "#1982C4",
    iconSrc: "/navbar/summarize.svg",
  },
  {
    title: "Translator",
    link: "/translator",
    iconColor: "#6A4C93",
    iconSrc: "/navbar/translator.svg",
  },
  {
    title: "Agent",
    link: "/agents",
    iconColor: "#1976D2",
    iconSrc: "/navbar/ai-brain.svg",
  },
  {
    title: "Marketing Automation",
    link: "/marketing-automation",
    iconColor: "#1976D2",
    iconSrc: "/navbar/marketing-automation.svg",
  },
];

const MobileNavigation = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const isMobile = useResponsive("down", "sm");

  if (!isMobile) return null;

  const validPath = links.some((tab) => tab.link === pathname)
    ? pathname
    : false;

  return (
    <div className="-mt-1 px-2">
      <Tabs value={validPath} onValueChange={(v) => push(v)}>
        <TabsList className="grid w-full grid-cols-4 overflow-x-auto">
          {links.map((tab) => (
            <TabsTrigger
              key={tab.link}
              value={tab.link}
              className="flex flex-col items-center gap-1 py-2"
            >
              <SvgColor
                className="h-[30px] w-[30px]"
                color={tab.iconColor}
                src={tab.iconSrc}
              />
              <span className="text-xs">{tab.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default MobileNavigation;
