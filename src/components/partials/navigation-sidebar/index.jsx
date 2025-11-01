"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Logo from "@/resource/assets/Logo";
import {
  Brain,
  CheckCheck,
  Edit,
  FileText,
  Languages,
  Megaphone,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";

const menuItems = [
  {
    label: "Paraphrase",
    icon: Edit,
    href: "/paraphrase",
    testId: "sidebar-paraphrase",
  },
  {
    label: "Humanize",
    icon: Sparkles,
    href: "/humanize",
    testId: "sidebar-humanize",
  },
  {
    label: "Plagiarism Checker",
    icon: CheckCheck,
    href: "/plagiarism",
    testId: "sidebar-plagiarism",
  },
  {
    label: "AI Detector",
    icon: Brain,
    href: "/ai-detector",
    testId: "sidebar-ai-detector",
  },
  { label: "Admob", icon: FileText, href: "/admob", testId: "sidebar-admob" },
  {
    label: "Marketing Automation",
    icon: Megaphone,
    href: "/marketing",
    testId: "sidebar-marketing",
  },
  {
    label: "Translator",
    icon: Languages,
    href: "/translator",
    testId: "sidebar-translator",
  },
  {
    label: "AI Optimization",
    icon: TrendingUp,
    href: "/optimization",
    testId: "sidebar-optimization",
  },
  {
    label: "Community",
    icon: Users,
    href: "/community",
    testId: "sidebar-community",
  },
];

export default function NavigationSidebar() {
  const { sidebar } = useSelector((state) => state.settings);
  const isCompact = sidebar === "compact";
  return (
    <Sidebar>
      <SidebarHeader className="border-sidebar-border h-12 border-b px-4 lg:h-16">
        <div>
          <Logo
            className={cn("", {
              "lg:hidden": isCompact,
              "lg:inline-block": !isCompact,
            })}
          />
          <Image
            src="/moscot.png"
            priority
            alt="shothik_logo"
            width={100}
            height={40}
            className={cn("mx-auto h-auto w-1/2 object-contain", {
              "hidden lg:hidden": !isCompact,
              "hidden lg:inline-block": isCompact,
            })}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild data-testid={item.testId}>
                    <a href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
